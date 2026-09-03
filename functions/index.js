const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { getStorage } = require("firebase-admin/storage");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const dns = require("dns").promises;

setGlobalOptions({ region: "europe-west1", maxInstances: 10 });

function escapeHtmlServer(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

initializeApp();
const db = getFirestore();

const EMAILJS_PRIVATE_KEY = defineSecret("EMAILJS_PRIVATE_KEY");

// Kľúče k platobnej bráne. Do kódu ani do databázy sa nikdy neukladajú —
// nastavujú sa príkazom `firebase functions:secrets:set`.
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");

const EMAILJS_SERVICE_ID = "service_qnxes8j";
const EMAILJS_TEMPLATE_ID = "template_aspeze7";
const EMAILJS_PUBLIC_KEY = "eOd4Q1os_TN-pSs2S";

// Písmená bez I/O — vylúčené kvôli zámene s 1/0 pri prepise kódu z papiera.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";

const DEFAULT_SETTINGS = {
  inactivityMinutes: 5,
  codeValidityDays: 90,
  maxLoginsPerCode: 0, // 0 = neobmedzené
  maxFailedAttempts: 5, // 0 = vypnuté
  lockoutMinutes: 15,
  groupDiscountMinSize: 0, // 0 = vypnuté
  groupDiscountPercent: 0,
  staleOrderDays: 3,
  remindNeverLoggedEnabled: false,
  remindNeverLoggedDays: 3,
  remindUnfinishedEnabled: false,
  remindUnfinishedDays: 7,
  staleOrderEmailEnabled: false,
  cardPaymentEnabled: false, // platba kartou cez Stripe
  notifyEmail: "",
};

const MAX_REMINDERS_PER_RUN = 50; // bezpečnostný strop na jedno spustenie

const DEFAULT_CONSULTATION_SETTINGS = {
  enabled: false,
  price30: 15,
  price60: 25,
  meetingLink: "",
  availability: [], // [{ weekday: 1-7 (1=pondelok), start:"09:00", end:"12:00" }]
};

async function getConsultationSettings() {
  const snap = await db.collection("settings").doc("consultations").get();
  return Object.assign({}, DEFAULT_CONSULTATION_SETTINGS, snap.exists ? snap.data() : {});
}

function weekdayOf(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const js = d.getDay(); // 0 = nedeľa
  return js === 0 ? 7 : js;
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m) {
  const h = Math.floor(m / 60), mm = m % 60;
  return String(h).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
}

/**
 * Pre daný dátum a dĺžku konzultácie vypočíta voľné termíny z týždennej
 * dostupnosti (availability) po odčítaní už existujúcich (nezrušených)
 * rezervácií daného dňa.
 */
function computeFreeSlots(dateStr, durationMin, availability, existingBookings) {
  const wd = weekdayOf(dateStr);
  const windows = (availability || []).filter((a) => a.weekday === wd);
  const busy = existingBookings.map((b) => ({ start: timeToMinutes(b.startTime), end: timeToMinutes(b.endTime) }));
  const slots = [];
  windows.forEach((w) => {
    let cursor = timeToMinutes(w.start);
    const end = timeToMinutes(w.end);
    while (cursor + durationMin <= end) {
      const slotEnd = cursor + durationMin;
      const overlaps = busy.some((b) => cursor < b.end && slotEnd > b.start);
      if (!overlaps) slots.push({ start: minutesToTime(cursor), end: minutesToTime(slotEnd) });
      cursor += durationMin;
    }
  });
  return slots;
}


// Po zaplatení sa účastník vracia späť na našu stránku. Adresu prijímame
// z prehliadača, preto ju porovnáme so zoznamom povolených domén — inak by
// sa cez ňu dal niekto presmerovať na cudziu stránku.
const ALLOWED_RETURN_ORIGINS = [
  "https://jzac369.github.io/mudro-a-bezpecne-online",
  "https://mudroabezpecne.sk",
  "https://www.mudroabezpecne.sk",
];

function pickAllowedOrigin(candidate) {
  if (typeof candidate === "string") {
    const clean = candidate.replace(/\/+$/, "");
    if (ALLOWED_RETURN_ORIGINS.includes(clean)) return clean;
  }
  return ALLOWED_RETURN_ORIGINS[0];
}

async function getSettings() {
  const snap = await db.collection("settings").doc("general").get();
  return Object.assign({}, DEFAULT_SETTINGS, snap.exists ? snap.data() : {});
}

function generateRandomCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

async function issueUniqueCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateRandomCode();
    const existing = await db.collection("accessCodes").doc(code).get();
    if (!existing.exists) return code;
  }
  throw new HttpsError("resource-exhausted", "Nepodarilo sa vygenerovať unikátny kód, skús znova.");
}

function fullName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

/**
 * Vytvorí objednávku so stavom "pending_payment" a vlastným variabilným
 * symbolom pre bankový prevod. Volané z verejnej objednávkovej stránky.
 * Podporuje skupinovú objednávku (participants — ďalší účastníci nad rámec
 * hlavného objednávateľa) a voliteľný zľavový kupón.
 */
exports.createOrder = onCall(async (request) => {
  const { firstName, lastName, email, workshopId, participants, couponCode, utm, geo, client, gift } = request.data || {};
  if (!firstName || !lastName || !email || !workshopId) {
    throw new HttpsError("invalid-argument", "Chýba meno, priezvisko, e-mail alebo kurz.");
  }

  const workshopSnap = await db.collection("workshops").doc(workshopId).get();
  if (!workshopSnap.exists) {
    throw new HttpsError("not-found", "Zvolený kurz neexistuje.");
  }
  const basePrice = Number(workshopSnap.data().price) || 0;

  const cleanParticipants = Array.isArray(participants)
    ? participants
        .filter((p) => p && p.firstName && p.lastName)
        .map((p) => ({ firstName: String(p.firstName).trim(), lastName: String(p.lastName).trim() }))
        .slice(0, 19) // rozumný strop
    : [];
  const groupSize = 1 + cleanParticipants.length;

  const settings = await getSettings();

  let unitPrice = basePrice;
  let discountNote = null;
  const baseAmount = Math.round(basePrice * groupSize * 100) / 100;
  let groupDiscountPercent = 0;

  // Skupinová zľava (ak je zapnutá a počet účastníkov ju dosahuje).
  if (settings.groupDiscountMinSize > 0 && groupSize >= settings.groupDiscountMinSize && settings.groupDiscountPercent > 0) {
    unitPrice = unitPrice * (1 - settings.groupDiscountPercent / 100);
    discountNote = "skupinová zľava " + settings.groupDiscountPercent + " %";
    groupDiscountPercent = settings.groupDiscountPercent;
  }

  let amount = Math.round(unitPrice * groupSize * 100) / 100;
  const groupDiscountAmount = Math.round((baseAmount - amount) * 100) / 100;

  // Zľavový kód — overí sa a jeho použitie sa započíta atomicky (transakcia
  // chráni pred súbežným prekročením limitu maxUses pri viacerých objednávkach naraz).
  let couponApplied = null;
  let couponDiscountAmount = 0;
  if (couponCode) {
    const codeId = String(couponCode).trim().toUpperCase();
    if (codeId) {
      try {
        const codeRef = db.collection("discountCodes").doc(codeId);
        const discountAmount = await db.runTransaction(async (tx) => {
          const codeSnap = await tx.get(codeRef);
          if (!codeSnap.exists) return 0;
          const c = codeSnap.data();
          if (!c.active) return 0;
          const today = new Date().toISOString().slice(0, 10);
          if (c.validFrom && today < c.validFrom) return 0;
          if (c.validUntil && today > c.validUntil) return 0;
          if (c.appliesTo && c.appliesTo !== "all" && c.appliesTo !== workshopId) return 0;
          if (c.maxUses > 0 && (c.usedCount || 0) >= c.maxUses) return 0;

          const raw = c.type === "fixed" ? Number(c.value) : amount * (Number(c.value) / 100);
          const discount = Math.round(Math.min(Math.max(raw, 0), amount) * 100) / 100;
          tx.update(codeRef, { usedCount: FieldValue.increment(1) });
          return discount;
        });
        if (discountAmount > 0) {
          amount = Math.round((amount - discountAmount) * 100) / 100;
          couponApplied = codeId;
          couponDiscountAmount = discountAmount;
        }
      } catch (err) {
        console.error("Overenie zľavového kódu zlyhalo:", err);
      }
    }
  }

  const orderRef = db.collection("orders").doc();
  // Číslo faktúry sa prideľuje hneď pri vytvorení objednávky (nie až pri
  // vystavení faktúry), aby variabilný symbol na platobných pokynoch bol
  // od začiatku ten istý, aký bude neskôr aj na faktúre/POZ dokumente.
  const invoiceNumber = await nextDocNumber("KU", "invoiceCounters");
  const variableSymbol = invoiceNumber.slice(2);

  await orderRef.set({
    name: fullName(firstName, lastName),
    firstName,
    lastName,
    email,
    workshopId,
    participants: cleanParticipants,
    groupSize,
    amount,
    baseAmount,
    groupDiscountPercent,
    groupDiscountAmount,
    discountNote,
    couponApplied,
    couponDiscountAmount,
    variableSymbol,
    invoiceNumber,
    status: "pending_payment",
    createdAt: FieldValue.serverTimestamp(),
    utm: utm && typeof utm === "object" ? {
      source: utm.source || null,
      medium: utm.medium || null,
      campaign: utm.campaign || null,
    } : null,
    geo: geo && typeof geo === "object" ? {
      ip: geo.ip || null,
      city: geo.city || null,
      region: geo.region || null,
      country: geo.country || null,
    } : null,
    client: client && typeof client === "object" ? {
      deviceType: client.deviceType || null,
      os: client.os || null,
      browser: client.browser || null,
      browserVersion: client.browserVersion || null,
      screenWidth: Number.isFinite(client.screenWidth) ? client.screenWidth : null,
      screenHeight: Number.isFinite(client.screenHeight) ? client.screenHeight : null,
      referrer: typeof client.referrer === "string" ? client.referrer.slice(0, 500) : null,
    } : null,
    isGift: !!gift,
    giftRecipientName: gift && typeof gift.recipientName === "string" ? gift.recipientName.slice(0, 200) : null,
    giftMessage: gift && typeof gift.message === "string" ? gift.message.slice(0, 1000) : null,
  });

  return {
    orderId: orderRef.id,
    variableSymbol,
    amount,
    // Kartu ponúkneme len vtedy, keď je platba kartou zapnutá v nastaveniach.
    cardPaymentAvailable: settings.cardPaymentEnabled === true,
    breakdown: {
      basePrice,
      groupSize,
      baseAmount,
      groupDiscountPercent,
      groupDiscountAmount,
      couponCode: couponApplied,
      couponDiscountAmount,
      finalAmount: amount,
    },
  };
});

/**
 * Vydá prístupové kódy pre objednávku a pošle ich e-mailom.
 *
 * Funkcia je zámerne idempotentná: objednávku si najprv „zaberie“
 * v transakcii, takže ani dve súbežné volania (napríklad webhook doručený
 * dvakrát, čo Stripe bežne robí) nevydajú kódy dvakrát. Ak by vydávanie
 * neskôr zlyhalo, stav sa vráti späť na čakajúcu platbu, aby sa dalo
 * zopakovať z admin zóny.
 */
async function issueCodesForOrder(orderId, paymentMethod, extra) {
  const orderRef = db.collection("orders").doc(orderId);

  const claim = await db.runTransaction(async (tx) => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) return { missing: true };
    const data = snap.data();
    if (data.status !== "pending_payment") {
      return { order: data, alreadyHandled: true };
    }
    tx.update(orderRef, Object.assign({
      status: "code_sent",
      paidAt: FieldValue.serverTimestamp(),
      codeIssuedAt: FieldValue.serverTimestamp(),
      paymentMethod,
    }, extra || {}));
    return { order: data, alreadyHandled: false };
  });

  if (claim.missing) {
    throw new HttpsError("not-found", "Objednávka neexistuje.");
  }
  if (claim.alreadyHandled) {
    // Kódy už boli vydané skôr — vrátime tie existujúce.
    const existing = await db.collection("accessCodes").where("orderId", "==", orderId).get();
    return { codes: existing.docs.map((d) => d.id), alreadyIssued: true };
  }

  const order = claim.order;
  try {
    const participantsList = [
      { firstName: order.firstName || order.name, lastName: order.lastName || "" },
      ...(Array.isArray(order.participants) ? order.participants : []),
    ];

    const codes = [];
    for (const p of participantsList) {
      const code = await issueUniqueCode();
      await db.collection("accessCodes").doc(code).set({
        code,
        workshopId: order.workshopId,
        orderId,
        firstName: p.firstName,
        lastName: p.lastName,
        participantName: fullName(p.firstName, p.lastName),
        createdAt: FieldValue.serverTimestamp(),
        active: true,
      });
      codes.push(code);
    }

    await sendCodeEmail({
      to: order.email,
      name: order.firstName || order.name,
      codes,
      workshopId: order.workshopId,
    });

    return { codes, alreadyIssued: false };
  } catch (err) {
    // Objednávku vrátime medzi čakajúce, nech sa dá vydanie zopakovať.
    console.error("Vydanie kódov zlyhalo, vraciam objednávku medzi čakajúce:", err);
    await orderRef.update({
      status: "pending_payment",
      codeIssueError: String(err && err.message ? err.message : err).slice(0, 500),
    });
    throw err;
  }
}

/**
 * Označí objednávku ako uhradenú a vygeneruje prístupový kód pre každého
 * účastníka objednávky (hlavný objednávateľ + prípadní ďalší v skupine).
 * Volané z admin zóny (ručné spárovanie prevodu) alebo z platobného
 * webhooku (fáza 2 — platba kartou).
 */
exports.markOrderPaid = onCall({ secrets: [EMAILJS_PRIVATE_KEY] }, async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže potvrdiť platbu.");
  }

  const { orderId, paymentMethod } = request.data || {};
  if (!["card", "transfer", "cash"].includes(paymentMethod)) {
    throw new HttpsError("invalid-argument", "Neplatný spôsob úhrady.");
  }
  const result = await issueCodesForOrder(orderId, paymentMethod);
  if (result.alreadyIssued) {
    throw new HttpsError("failed-precondition", "Táto objednávka už bola spracovaná.");
  }
  return { codes: result.codes };
});

/**
 * Ručné vygenerovanie kódu z admin zóny (darčekové poukazy, opravy,
 * testovanie) — bez naviazania na objednávku.
 */
exports.generateCode = onCall({ secrets: [EMAILJS_PRIVATE_KEY] }, async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže generovať kódy.");
  }
  const { workshopId, firstName, lastName, email } = request.data || {};
  if (!workshopId || !firstName) {
    throw new HttpsError("invalid-argument", "Chýba kurz alebo meno účastníka.");
  }
  const participantName = fullName(firstName, lastName || "");

  const workshopSnap = await db.collection("workshops").doc(workshopId).get();
  const amount = workshopSnap.exists ? workshopSnap.data().price || 0 : 0;

  // Vytvoríme aj objednávku, aby sa ručne vygenerovaný kód zobrazil
  // v admin zóne v Registráciách rovnako ako bežná (uhradená) rezervácia.
  const orderRef = db.collection("orders").doc();
  const now = FieldValue.serverTimestamp();
  await orderRef.set({
    name: participantName,
    firstName,
    lastName: lastName || "",
    email: email || "",
    workshopId,
    amount,
    variableSymbol: null,
    status: "code_sent",
    createdAt: now,
    paidAt: now,
    codeIssuedAt: now,
    manual: true,
  });

  const code = await issueUniqueCode();
  await db.collection("accessCodes").doc(code).set({
    code,
    workshopId,
    orderId: orderRef.id,
    firstName,
    lastName: lastName || "",
    participantName,
    createdAt: FieldValue.serverTimestamp(),
    active: true,
  });

  if (email) {
    await sendCodeEmail({ to: email, name: firstName, codes: [code], workshopId });
  }

  return { code };
});

/**
 * Overí meno + kód a vydá custom token s claimami `codeId` a `workshopId`,
 * ktorý front-end použije na signInWithCustomToken (bez hesla). Zároveň
 * kontroluje platnosť kódu (dni od vydania) a limit počtu prihlásení,
 * ak sú tieto obmedzenia v nastaveniach zapnuté.
 */
function getRequestIp(request) {
  const req = request.rawRequest;
  if (!req) return "unknown";
  const forwarded = req.headers && req.headers["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  return req.ip || "unknown";
}

exports.verifyCode = onCall(async (request) => {
  const { name, code } = request.data || {};
  if (!name || !code) {
    throw new HttpsError("invalid-argument", "Zadaj meno aj prístupový kód.");
  }

  const settings = await getSettings();
  const ip = getRequestIp(request);
  const attemptRef = db.collection("loginAttempts").doc(Buffer.from(ip).toString("hex").slice(0, 200));

  if (settings.maxFailedAttempts > 0) {
    const attemptSnap = await attemptRef.get();
    if (attemptSnap.exists) {
      const a = attemptSnap.data();
      if (a.lockedUntil && a.lockedUntil.toDate() > new Date()) {
        throw new HttpsError("resource-exhausted", "Príliš veľa nesprávnych pokusov. Skúste to prosím znova o pár minút.");
      }
    }
  }

  const normalizedCode = String(code).trim().toUpperCase();
  const codeSnap = await db.collection("accessCodes").doc(normalizedCode).get();

  // Existujúci, ale deaktivovaný kód nie je pokus o uhádnutie kódu — nerátame
  // ho do ochrany pred brute-force a vraciame samostatnú, zrozumiteľnú správu.
  if (codeSnap.exists && codeSnap.data().active === false) {
    throw new HttpsError(
      "permission-denied",
      "Váš prístup ku kurzu je dočasne obmedzený. Kontaktujte nás prosím na info@digistart.sk a uveďte svoj prístupový kód " + normalizedCode + " — radi vám pomôžeme.",
      { reason: "deactivated", code: normalizedCode }
    );
  }

  if (!codeSnap.exists) {
    if (settings.maxFailedAttempts > 0) {
      await db.runTransaction(async (tx) => {
        const cur = await tx.get(attemptRef);
        const now = Date.now();
        const windowMs = settings.lockoutMinutes * 60 * 1000;
        const prev = cur.exists ? cur.data() : null;
        const stillInWindow = prev && prev.windowStart && (now - prev.windowStart.toDate().getTime()) < windowMs;
        const count = (stillInWindow ? prev.count : 0) + 1;
        const patch = {
          ip,
          count,
          lastCode: normalizedCode,
          lastAttemptAt: FieldValue.serverTimestamp(),
          windowStart: stillInWindow ? prev.windowStart : FieldValue.serverTimestamp(),
        };
        if (count >= settings.maxFailedAttempts) {
          patch.lockedUntil = new Date(now + windowMs);
        }
        tx.set(attemptRef, patch, { merge: true });
      });
    }
    throw new HttpsError("not-found", "Kód nie je platný. Skontroluj prosím jeho zápis.");
  }

  if (settings.maxFailedAttempts > 0) {
    await attemptRef.set({ count: 0, lockedUntil: null }, { merge: true });
  }

  const codeData = codeSnap.data();

  if (settings.codeValidityDays > 0 && codeData.createdAt) {
    const ageMs = Date.now() - codeData.createdAt.toDate().getTime();
    const maxMs = settings.codeValidityDays * 24 * 3600 * 1000;
    if (ageMs > maxMs) {
      throw new HttpsError("permission-denied", "Platnosť tohto prístupového kódu vypršala. Kontaktujte nás, radi vám vystavíme nový.");
    }
  }

  if (settings.maxLoginsPerCode > 0) {
    const sessionsSnap = await db.collection("sessions").where("codeId", "==", normalizedCode).limit(settings.maxLoginsPerCode + 1).get();
    if (sessionsSnap.size >= settings.maxLoginsPerCode) {
      throw new HttpsError("permission-denied", "Tento kód už dosiahol maximálny povolený počet prihlásení.");
    }
  }

  const token = await getAuth().createCustomToken(normalizedCode, {
    codeId: normalizedCode,
    workshopId: codeData.workshopId,
  });

  return {
    token,
    workshopId: codeData.workshopId,
    participantName: codeData.participantName,
    firstName: codeData.firstName || (codeData.participantName || "").split(" ")[0],
  };
});

/**
 * Opätovné odoslanie kódu, keď si ho účastník nevie nájsť. Vyhľadá podľa
 * e-mailu poslednú uhradenú objednávku a pošle príslušné kódy znova (celú
 * skupinu, ak išlo o skupinovú objednávku).
 * Odpoveď je zámerne rovnaká pri úspechu aj neúspechu, aby sa cez formulár
 * nedalo zisťovať, ktoré e-maily sú v systéme zaregistrované.
 */
exports.resendCode = onCall({ secrets: [EMAILJS_PRIVATE_KEY] }, async (request) => {
  const { email } = request.data || {};
  if (!email) throw new HttpsError("invalid-argument", "Zadaj e-mail.");

  const ordersSnap = await db
    .collection("orders")
    .where("email", "==", email)
    .where("status", "==", "code_sent")
    .orderBy("codeIssuedAt", "desc")
    .limit(1)
    .get();

  if (!ordersSnap.empty) {
    const order = ordersSnap.docs[0].data();
    const codesSnap = await db
      .collection("accessCodes")
      .where("orderId", "==", ordersSnap.docs[0].id)
      .get();
    if (!codesSnap.empty) {
      const codes = codesSnap.docs.map((d) => d.data().code);
      await sendCodeEmail({ to: email, name: order.firstName || order.name, codes, workshopId: order.workshopId });
    }
  }

  return { ok: true };
});

/**
 * Vytvorí nový administrátorský účet (alebo povýši existujúci) —
 * volateľné iba existujúcim administrátorom.
 */
exports.createAdmin = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže pridávať ďalších administrátorov.");
  }
  const { email, password } = request.data || {};
  if (!email || !password || password.length < 6) {
    throw new HttpsError("invalid-argument", "Zadaj e-mail a heslo (aspoň 6 znakov).");
  }

  let user;
  try {
    user = await getAuth().getUserByEmail(email);
  } catch (err) {
    user = await getAuth().createUser({ email, password });
  }
  await getAuth().setCustomUserClaims(user.uid, { admin: true });

  return { uid: user.uid };
});

/**
 * Odoslanie e-mailu s prístupovým kódom (alebo viacerými kódmi pri
 * skupinovej objednávke) cez EmailJS REST API (server-side, súkromný
 * kľúč nikdy neopustí Cloud Function).
 */
async function sendCodeEmail({ to, name, codes, workshopId, messageOverride }) {
  let workshopTitle = workshopId || "";
  if (workshopId) {
    try {
      const workshopSnap = await db.collection("workshops").doc(workshopId).get();
      if (workshopSnap.exists) workshopTitle = workshopSnap.data().title || workshopId;
    } catch (err) {
      console.error("Nepodarilo sa načítať názov workshopu pre e-mail:", err);
    }
  }

  let customMessage = messageOverride || "";
  if (!messageOverride) {
    try {
      const settings = await getSettings();
      customMessage = settings.emailCustomMessage || "";
    } catch (err) {
      console.error("Nepodarilo sa načítať vlastnú správu pre e-mail:", err);
    }
  }

  const codeList = codes.join(", ");
  const primaryCode = codes[0] || "";

  let status = "sent";
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY.value(),
        template_params: {
          to_email: to,
          to_name: name,
          name,
          email: to,
          code: codeList,
          workshop_title: workshopTitle,
          custom_message: customMessage,
        },
      }),
    });
    if (!res.ok) {
      status = "failed";
      console.error("EmailJS odoslanie zlyhalo:", res.status, await res.text());
    }
  } catch (err) {
    status = "failed";
    console.error("EmailJS odoslanie zlyhalo:", err);
  }

  try {
    await db.collection("mail").add({
      to,
      code: primaryCode,
      codes,
      workshopId,
      status,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    // sendCodeEmail je zámerne "best-effort" a nesmie zhodiť volajúcu funkciu —
    // aj keby zápis logu zlyhal, e-mail sa už mohol odoslať.
    console.error("Nepodarilo sa zapísať záznam o e-maile do kolekcie mail:", err);
  }
}

/**
 * Prejde aktívne prístupové kódy a pošle e-mailové pripomienky:
 * 1) tým, čo majú platný kód, ale nikdy sa neprihlásili,
 * 2) tým, čo sa prihlásili, ale nedokončili kurz (neprešli kvízom),
 * a administrátorovi pošle denný súhrn neuhradených objednávok.
 * Každej pripomienke sa pošle len JEDEN e-mail (značka *ReminderSentAt
 * na accessCodes dokumente zabráni opakovanému odosielaniu).
 */
async function runReminderSweep() {
  const settings = await getSettings();
  const now = Date.now();
  const day = 24 * 3600 * 1000;
  const result = { neverLoggedSent: 0, unfinishedSent: 0, staleDigestSent: false, staleCount: 0 };

  if (settings.remindNeverLoggedEnabled || settings.remindUnfinishedEnabled) {
    const codesSnap = await db.collection("accessCodes").where("active", "==", true).get();

    for (const doc of codesSnap.docs) {
      if (result.neverLoggedSent + result.unfinishedSent >= MAX_REMINDERS_PER_RUN) break;
      const c = doc.data();
      if (!c.createdAt) continue;
      const age = now - c.createdAt.toDate().getTime();

      const sessionsSnap = await db.collection("sessions").where("codeId", "==", doc.id).limit(1).get();
      const hasLoggedIn = !sessionsSnap.empty;

      // 1) Nikdy sa neprihlásil.
      if (settings.remindNeverLoggedEnabled && !hasLoggedIn && !c.neverLoggedReminderSentAt &&
          age >= (settings.remindNeverLoggedDays || 3) * day) {
        const email = await lookupOrderEmail(c.orderId);
        if (email) {
          await sendCodeEmail({
            to: email,
            name: c.firstName || c.participantName || "",
            codes: [c.code || doc.id],
            workshopId: c.workshopId,
            messageOverride: "Všimli sme si, že ste sa zatiaľ neprihlásili do svojho kurzu. Váš prístupový kód je stále platný — stačí ísť na stránku Prihlásenie a zadať meno a kód.",
          });
          await doc.ref.update({ neverLoggedReminderSentAt: FieldValue.serverTimestamp() });
          result.neverLoggedSent++;
        }
        continue;
      }

      // 2) Prihlásil sa, ale kurz nedokončil.
      if (settings.remindUnfinishedEnabled && hasLoggedIn && !c.unfinishedReminderSentAt &&
          age >= (settings.remindUnfinishedDays || 7) * day) {
        const quizSnap = await db.collection("quizResults").where("codeId", "==", doc.id).get();
        const passed = quizSnap.docs.some((q) => q.data().passed === true);
        if (!passed) {
          const email = await lookupOrderEmail(c.orderId);
          if (email) {
            await sendCodeEmail({
              to: email,
              name: c.firstName || c.participantName || "",
              codes: [c.code || doc.id],
              workshopId: c.workshopId,
              messageOverride: "Váš kurz čaká na dokončenie — zostáva vám už len záverečný kvíz a certifikát. Prihláste sa rovnakým kódom a pokračujte presne tam, kde ste skončili.",
            });
            await doc.ref.update({ unfinishedReminderSentAt: FieldValue.serverTimestamp() });
            result.unfinishedSent++;
          }
        }
      }
    }
  }

  if (settings.staleOrderEmailEnabled && settings.notifyEmail) {
    const staleDays = settings.staleOrderDays || 3;
    const ordersSnap = await db.collection("orders").where("status", "==", "pending_payment").get();
    const stale = ordersSnap.docs
      .map((d) => d.data())
      .filter((o) => o.createdAt && (now - o.createdAt.toDate().getTime()) > staleDays * day);

    if (stale.length > 0) {
      const lines = stale.map((o) =>
        "- " + (o.name || "") + " (" + o.email + "), VS " + (o.variableSymbol || "—") + ", " + (o.amount || 0) + " €"
      );
      await sendCodeEmail({
        to: settings.notifyEmail,
        name: "Admin",
        codes: [],
        workshopId: null,
        messageOverride: "Máte " + stale.length + " neuhradených objednávok starších ako " + staleDays + " dní:\n" + lines.join("\n"),
      });
      result.staleDigestSent = true;
      result.staleCount = stale.length;
    }
  }

  return result;
}

async function lookupOrderEmail(orderId) {
  if (!orderId) return null;
  try {
    const orderSnap = await db.collection("orders").doc(orderId).get();
    return orderSnap.exists ? orderSnap.data().email : null;
  } catch (err) {
    console.error("Nepodarilo sa nájsť e-mail k objednávke " + orderId, err);
    return null;
  }
}

/**
 * Denné automatické spustenie pripomienok (08:00 SEČ/SELČ).
 */
exports.dailyReminders = onSchedule(
  { schedule: "every day 08:00", timeZone: "Europe/Bratislava", secrets: [EMAILJS_PRIVATE_KEY] },
  async () => {
    const result = await runReminderSweep();
    console.log("Denné pripomienky dokončené:", JSON.stringify(result));
  }
);

/**
 * Ručné spustenie tej istej logiky z admin zóny (tlačidlo "Spustiť teraz") —
 * užitočné na okamžité odoslanie aj na overenie, že nastavenia fungujú.
 */
exports.runRemindersNow = onCall({ secrets: [EMAILJS_PRIVATE_KEY] }, async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže spustiť pripomienky ručne.");
  }
  return await runReminderSweep();
});

/**
 * Keď návštevník zanechá správu v chate a admin práve nie je online
 * (status "message_left"), pošle e-mailové upozornenie administrátorovi
 * na adresu nastavenú v settings/general.notifyEmail.
 */
exports.notifyOfflineChatMessage = onDocumentCreated(
  { document: "chats/{chatId}", secrets: [EMAILJS_PRIVATE_KEY] },
  async (event) => {
    const chat = event.data.data();
    if (chat.status !== "message_left") return;

    const settings = await getSettings();
    if (!settings.notifyEmail) return;

    let firstMessage = "";
    try {
      const msgsSnap = await db.collection("chats").doc(event.params.chatId).collection("messages").orderBy("createdAt", "asc").limit(1).get();
      if (!msgsSnap.empty) firstMessage = msgsSnap.docs[0].data().text || "";
    } catch (err) {
      console.error("Nepodarilo sa načítať prvú správu chatu:", err);
    }

    await sendCodeEmail({
      to: settings.notifyEmail,
      name: "Admin",
      codes: [],
      workshopId: null,
      messageOverride:
        "Nová správa v chate od " + chat.visitorName + (chat.visitorEmail ? " (" + chat.visitorEmail + ")" : "") +
        ", stránka: " + (chat.page || "—") + ".\n\nSpráva: " + firstMessage +
        "\n\nOdpovedať môžete priamo v admin zóne v sekcii Chat.",
    });
  }
);

/**
 * Vráti voľné termíny pre daný dátum a dĺžku konzultácie (30/60 min).
 * Neprezrádza mená ani e-maily iných záujemcov — len obsadené časy.
 */
exports.getConsultationAvailability = onCall(async (request) => {
  const { date, duration } = request.data || {};
  const durationMin = Number(duration);
  if (!date || ![30, 60].includes(durationMin)) {
    throw new HttpsError("invalid-argument", "Zadaj dátum a dĺžku konzultácie (30 alebo 60 minút).");
  }

  const settings = await getConsultationSettings();
  if (!settings.enabled) return { slots: [], price: 0, enabled: false };

  const bookingsSnap = await db.collection("consultationBookings").where("date", "==", date).get();
  const existing = bookingsSnap.docs.map((d) => d.data()).filter((b) => b.status !== "cancelled");

  const slots = computeFreeSlots(date, durationMin, settings.availability, existing);
  return { slots, price: durationMin === 30 ? settings.price30 : settings.price60, enabled: true };
});

/**
 * Vytvorí rezerváciu konzultácie (stav "pending_payment", platba
 * bankovým prevodom rovnako ako pri workshopoch). Pred zápisom znova
 * overí, že si termín medzičasom neobsadil niekto iný.
 */
exports.bookConsultation = onCall({ secrets: [EMAILJS_PRIVATE_KEY] }, async (request) => {
  const { name, email, duration, mode, date, startTime } = request.data || {};
  const durationMin = Number(duration);
  if (!name || !email || !date || !startTime || ![30, 60].includes(durationMin) || !["video", "audio"].includes(mode)) {
    throw new HttpsError("invalid-argument", "Chýbajú alebo sú neplatné údaje objednávky.");
  }

  const settings = await getConsultationSettings();
  if (!settings.enabled) throw new HttpsError("failed-precondition", "Konzultácie momentálne nie sú dostupné.");

  const endTime = minutesToTime(timeToMinutes(startTime) + durationMin);

  const bookingsSnap = await db.collection("consultationBookings").where("date", "==", date).get();
  const existing = bookingsSnap.docs.map((d) => d.data()).filter((b) => b.status !== "cancelled");
  const startMin = timeToMinutes(startTime), endMin = timeToMinutes(endTime);
  const collision = existing.some((b) => startMin < timeToMinutes(b.endTime) && endMin > timeToMinutes(b.startTime));
  if (collision) {
    throw new HttpsError("already-exists", "Tento termín je už, žiaľ, obsadený. Vyberte prosím iný.");
  }

  const amount = durationMin === 30 ? settings.price30 : settings.price60;
  const bookingRef = db.collection("consultationBookings").doc();
  const variableSymbol = bookingRef.id.replace(/\D/g, "").slice(0, 10) || String(Date.now()).slice(-10);

  await bookingRef.set({
    name, email, duration: durationMin, mode, date, startTime, endTime,
    amount, variableSymbol, status: "pending_payment",
    createdAt: FieldValue.serverTimestamp(),
  });

  await sendCodeEmail({
    to: email,
    name,
    codes: [],
    workshopId: null,
    messageOverride:
      "Rezervovali ste konzultáciu (" + durationMin + " min, " + (mode === "video" ? "video" : "telefonicky") + ") na " + date + " o " + startTime + ". " +
      "Prosím uhraďte " + amount + " € bankovým prevodom (variabilný symbol " + variableSymbol + "), termín potvrdíme po prijatí platby.",
  });

  return { bookingId: bookingRef.id, variableSymbol, amount, date, startTime, endTime };
});

/**
 * Potvrdí prijatie platby za konzultáciu (admin) a pošle účastníkovi
 * potvrdenie s odkazom na video/audio hovor.
 */
exports.markConsultationPaid = onCall({ secrets: [EMAILJS_PRIVATE_KEY] }, async (request) => {
  try {
    if (request.auth?.token?.admin !== true) {
      throw new HttpsError("permission-denied", "Len administrátor môže potvrdiť platbu.");
    }
    const { bookingId } = request.data || {};
    if (!bookingId || typeof bookingId !== "string") {
      throw new HttpsError("invalid-argument", "Chýba identifikátor rezervácie.");
    }
    const ref = db.collection("consultationBookings").doc(bookingId);
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError("not-found", "Rezervácia neexistuje.");
    const b = snap.data();
    if (b.status !== "pending_payment") {
      throw new HttpsError("failed-precondition", "Táto rezervácia už bola spracovaná.");
    }

    await ref.update({ status: "confirmed", confirmedAt: FieldValue.serverTimestamp() });

    const settings = await getConsultationSettings();
    try {
      await sendCodeEmail({
        to: b.email,
        name: b.name,
        codes: [],
        workshopId: null,
        messageOverride:
          "Vaša konzultácia (" + b.duration + " min, " + (b.mode === "video" ? "video" : "telefonicky") + ") je potvrdená na " + b.date + " o " + b.startTime + "." +
          (settings.meetingLink ? " Odkaz na hovor: " + settings.meetingLink : " V dohodnutom čase vás lektor bude kontaktovať priamo."),
      });
    } catch (emailErr) {
      // Platba je potvrdená aj keby zlyhalo odoslanie e-mailu — nechceme to celé zablokovať.
      console.error("markConsultationPaid: odoslanie potvrdzujúceho e-mailu zlyhalo", emailErr && emailErr.stack ? emailErr.stack : emailErr);
    }

    return { ok: true };
  } catch (err) {
    if (err instanceof HttpsError) throw err;
    console.error("markConsultationPaid zlyhalo:", err && err.stack ? err.stack : err);
    throw new HttpsError("internal", "Nastala neočakávaná chyba: " + (err && err.message ? err.message : String(err)));
  }
});

/**
 * Zrušenie rezervácie konzultácie administrátorom (napr. na žiadosť
 * účastníka), aby sa termín znova uvoľnil pre iných záujemcov.
 */
exports.cancelConsultation = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže zrušiť rezerváciu.");
  }
  const { bookingId } = request.data || {};
  await db.collection("consultationBookings").doc(bookingId).update({
    status: "cancelled", cancelledAt: FieldValue.serverTimestamp(),
  });
  return { ok: true };
});

async function deleteInChunks(refs) {
  for (let i = 0; i < refs.length; i += 400) {
    const batch = db.batch();
    refs.slice(i, i + 400).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}

/**
 * Natrvalo vymaže registráciu (objednávku) a všetko s ňou súvisiace —
 * prístupový kód (kódy pri skupinovej objednávke), relácie, výsledky
 * kvízu a postup kurzu. Nevratná operácia, preto len pre administrátora
 * (klient navyše vyžaduje opätovné zadanie hesla pred zavolaním).
 */
exports.deleteRegistrations = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže mazať registrácie.");
  }
  const { orderIds } = request.data || {};
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    throw new HttpsError("invalid-argument", "Chýba zoznam registrácií na vymazanie.");
  }
  const ids = orderIds.filter((id) => typeof id === "string" && id).slice(0, 100);

  let deletedOrders = 0, deletedCodes = 0;
  for (const orderId of ids) {
    try {
      const orderSnap = await db.collection("orders").doc(orderId).get();
      if (!orderSnap.exists) continue;
      const orderData = orderSnap.data();

      const codesSnap = await db.collection("accessCodes").where("orderId", "==", orderId).get();
      const archivedCodes = codesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      await db.collection("deletedRegistrations").doc(orderId).set({
        order: orderData,
        accessCodes: archivedCodes,
        deletedAt: FieldValue.serverTimestamp(),
        deletedBy: request.auth.token.email || request.auth.uid,
      });

      for (const codeDoc of codesSnap.docs) {
        const codeId = codeDoc.id;
        const [sessionsSnap, quizSnap] = await Promise.all([
          db.collection("sessions").where("codeId", "==", codeId).get(),
          db.collection("quizResults").where("codeId", "==", codeId).get(),
        ]);
        const refs = [...sessionsSnap.docs.map((d) => d.ref), ...quizSnap.docs.map((d) => d.ref),
          db.collection("progress").doc(codeId), codeDoc.ref];
        await deleteInChunks(refs);
        deletedCodes++;
      }
      await db.collection("orders").doc(orderId).delete();
      deletedOrders++;
    } catch (err) {
      console.error("Nepodarilo sa vymazať registráciu " + orderId, err);
    }
  }
  return { deletedOrders, deletedCodes };
});

// ---------- Faktúra a potvrdenie o zaplatení (PDF, e-mailom na žiadosť admina) ----------

const FONT_REGULAR = __dirname + "/assets/DejaVuSans.ttf";
const FONT_BOLD = __dirname + "/assets/DejaVuSans-Bold.ttf";

// Denné číslovanie dokumentov v tvare PREFIX + YYYYMMDD + poradie (001, 002, …),
// reštartuje sa samo každý deň, keďže kľúčom počítadla je samotný dátum.
async function nextDocNumber(prefix, counterCollection) {
  const now = new Date();
  const dayKey = now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0");
  const counterRef = db.collection(counterCollection).doc(dayKey);
  const seq = await db.runTransaction(async (tx) => {
    const snap = await tx.get(counterRef);
    const next = (snap.exists ? snap.data().count : 0) + 1;
    tx.set(counterRef, { count: next, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return next;
  });
  return prefix + dayKey + String(seq).padStart(3, "0");
}

// Číslo faktúry sa pridelí len raz za objednávku a odvtedy sa vždy znova
// použije (aj v náhľade, aj pri faktúre, aj pri z nej odvodenom potvrdení
// o zaplatení číslo UH+...) — nespotrebúva sa nové číslo pri každom otvorení.
async function getOrAssignInvoiceNumber(orderRef, order) {
  if (order.invoiceNumber) return order.invoiceNumber;
  const invoiceNumber = await nextDocNumber("KU", "invoiceCounters");
  await orderRef.update({ invoiceNumber });
  return invoiceNumber;
}

function pdfToBuffer(draw, docOptions) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument(docOptions || { size: "A4", margin: 56 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.font(FONT_REGULAR);
    try {
      draw(doc);
    } catch (err) {
      reject(err);
      return;
    }
    doc.end();
  });
}

// Vykreslí dva stĺpce (Dodávateľ/Odberateľ) s nezávislým sledovaním y-pozície
// pre každý stĺpec — stĺpce môžu mať rôzny počet riadkov (napr. keď firma nemá
// vyplnené IČ DPH), takže sa nesmie použiť jeden zdieľaný "kurzor" naprieč nimi.
function drawSupplierBuyerColumns(doc, { s, order, colY }) {
  const leftX = 56, rightX = 320, lineH = 15;

  let ly = colY;
  doc.font(FONT_BOLD).fontSize(11).text("Dodávateľ", leftX, ly);
  ly += lineH + 3;
  doc.font(FONT_REGULAR).fontSize(10);
  const supplierLines = [
    s.invoiceCompany || "Akadémia digitálneho vzdelávania DigiStart",
    s.invoiceAddress || null,
    s.invoiceIco ? "IČO: " + s.invoiceIco : null,
    s.invoiceDic ? "DIČ: " + s.invoiceDic : null,
    s.invoiceIcDph ? "IČ DPH: " + s.invoiceIcDph : "Nie sme platcami DPH.",
    s.invoiceIban ? "IBAN: " + s.invoiceIban : null,
    s.invoiceEmail ? "E-mail: " + s.invoiceEmail : null,
    s.invoiceWeb ? "Web: " + s.invoiceWeb : null,
    s.invoicePhone ? "Tel.: " + s.invoicePhone : null,
  ].filter(Boolean);
  supplierLines.forEach((line) => {
    doc.text(line, leftX, ly, { width: 240 });
    ly += lineH;
  });

  let ry = colY;
  doc.font(FONT_BOLD).fontSize(11).text("Odberateľ", rightX, ry);
  ry += lineH + 3;
  doc.font(FONT_REGULAR).fontSize(10);
  const buyerLines = [order.name || "—", order.email || "—"];
  buyerLines.forEach((line) => {
    doc.text(line, rightX, ry, { width: 220 });
    ry += lineH;
  });

  doc.x = leftX;
  doc.y = Math.max(ly, ry) + 14;
}

function drawInvoicePdf(doc, { s, order, invoiceNumber }) {
  const issueDate = new Date().toLocaleDateString("sk-SK");
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("sk-SK");
  const paidDate = order.paidAt ? order.paidAt.toDate().toLocaleDateString("sk-SK") : "—";
  const workshop = order.workshopTitleSnapshot || order.workshopId;
  const amount = order.amount != null ? order.amount : 0;

  doc.font(FONT_BOLD).fontSize(20).text("Faktúra č. " + invoiceNumber);
  doc.moveDown(0.3);
  doc.font(FONT_REGULAR).fontSize(10).fillColor("#5c5749")
    .text("Dátum vystavenia: " + issueDate + "    Dátum splatnosti: " + dueDate + "    Dátum úhrady: " + paidDate);
  doc.fillColor("#1f3a3d");
  doc.moveDown(1.2);

  drawSupplierBuyerColumns(doc, { s, order, colY: doc.y });

  const tableTop = doc.y;
  doc.font(FONT_BOLD).fontSize(10);
  doc.text("Položka", 56, tableTop);
  doc.text("Suma", 480, tableTop);
  doc.moveTo(56, tableTop + 16).lineTo(539, tableTop + 16).strokeColor("#ddd5c2").stroke();

  doc.font(FONT_REGULAR).fontSize(10);
  const itemY = tableTop + 24;
  const itemLabel = workshop + (order.groupSize > 1 ? " (" + order.groupSize + " účastníci)" : "");
  doc.text(itemLabel, 56, itemY, { width: 400 });
  doc.text(amount + " €", 480, itemY);
  doc.moveTo(56, itemY + 24).lineTo(539, itemY + 24).strokeColor("#ddd5c2").stroke();

  doc.font(FONT_BOLD).fontSize(13).text("Spolu: " + amount + " €", 56, itemY + 36);
  doc.font(FONT_REGULAR).fontSize(10).fillColor("#5c5749")
    .text("Variabilný symbol: " + invoiceNumber.slice(2), 56, itemY + 60);
}

const PAYMENT_METHOD_LABELS = { card: "Platobnou kartou", transfer: "Bankovým prevodom", cash: "V hotovosti" };

function drawPozPdf(doc, { s, order, pozNumber, invoiceNumber }) {
  const paidDate = order.paidAt ? order.paidAt.toDate().toLocaleDateString("sk-SK") : "—";
  const workshop = order.workshopTitleSnapshot || order.workshopId;
  const amount = order.amount != null ? order.amount : 0;
  const paymentMethodLabel = PAYMENT_METHOD_LABELS[order.paymentMethod] || "—";

  doc.font(FONT_BOLD).fontSize(20).text("Potvrdenie o zaplatení č. " + pozNumber);
  doc.font(FONT_REGULAR).fontSize(10).fillColor("#5c5749")
    .text("K faktúre č. " + invoiceNumber + "    Dátum úhrady: " + paidDate);
  doc.fillColor("#1f3a3d");
  doc.moveDown(1.2);

  drawSupplierBuyerColumns(doc, { s, order, colY: doc.y });
  doc.moveDown(0.6);

  doc.font(FONT_REGULAR).fontSize(11);
  doc.text("Dodávateľ týmto potvrdzuje prijatie platby za:");
  doc.moveDown(0.4);
  doc.font(FONT_BOLD).text(workshop + (order.groupSize > 1 ? " (" + order.groupSize + " účastníci)" : ""));
  doc.font(FONT_REGULAR);
  doc.text("Suma: " + amount + " €");
  doc.text("Spôsob úhrady: " + paymentMethodLabel);
  doc.text("Variabilný symbol: " + invoiceNumber.slice(2));

  doc.moveDown(1.2);
  doc.fontSize(10).fillColor("#5c5749").text(
    "Toto potvrdenie slúži ako doklad o prijatí platby za uvedenú objednávku."
  );
}

// Darčekový poukaz — na rozdiel od faktúry/POZ ide o pekný, tlačiteľný
// dokument, nie účtovný záznam. Kreslí sa na šírku (A4 landscape) ako
// zdobená karta s dvojitým rámom, vlastným kódom a voliteľným venovaním.
function drawGiftVoucherPdf(doc, { s, order, code }) {
  const W = doc.page.width, H = doc.page.height;
  const CREAM = "#f6ecd9", INK = "#1f3a3d", GOLD = "#c17a2e", MUTED = "#6b6350", BORDER = "#ddd5c2", WHITE = "#fffdf7";

  const workshop = order.workshopTitleSnapshot || order.workshopId;
  const recipient = order.giftRecipientName || "";
  const message = order.giftMessage || "";
  const issuer = s.invoiceCompany || "Akadémia digitálneho vzdelávania DigiStart";
  const issueDate = new Date().toLocaleDateString("sk-SK");

  doc.rect(0, 0, W, H).fill(CREAM);

  // Dvojitý zdobený rám
  const outer = 22, inner = 34;
  doc.roundedRect(outer, outer, W - outer * 2, H - outer * 2, 10).lineWidth(2).strokeColor(GOLD).stroke();
  doc.roundedRect(inner, inner, W - inner * 2, H - inner * 2, 6).lineWidth(0.75).strokeColor(GOLD).stroke();

  // Diamantové zdobenie v rohoch vnútorného rámu
  [[inner, inner], [W - inner, inner], [inner, H - inner], [W - inner, H - inner]].forEach(([cx, cy]) => {
    doc.save();
    doc.rotate(45, { origin: [cx, cy] });
    doc.rect(cx - 4, cy - 4, 8, 8).fill(GOLD);
    doc.restore();
  });

  const centerX = W / 2;
  let y = 58;

  // Malý odznak so stužkou hore v strede
  doc.circle(centerX, y, 15).lineWidth(1.4).strokeColor(GOLD).stroke();
  doc.circle(centerX, y, 8).fillColor(GOLD).fill();
  doc.polygon([centerX - 9, y + 12], [centerX, y + 24], [centerX - 2, y + 12]).fill(GOLD);
  doc.polygon([centerX + 9, y + 12], [centerX, y + 24], [centerX + 2, y + 12]).fill(GOLD);

  y += 40;
  doc.font(FONT_BOLD).fontSize(9).fillColor(MUTED)
    .text("MÚDRO A BEZPEČNE ONLINE", 0, y, { width: W, align: "center", characterSpacing: 1.5 });

  y += 20;
  doc.font(FONT_BOLD).fontSize(28).fillColor(INK)
    .text("DARČEKOVÝ POUKAZ", 0, y, { width: W, align: "center", characterSpacing: 1 });

  y += 42;
  doc.moveTo(centerX - 90, y).lineTo(centerX - 14, y).lineWidth(1).strokeColor(GOLD).stroke();
  doc.moveTo(centerX + 14, y).lineTo(centerX + 90, y).lineWidth(1).strokeColor(GOLD).stroke();
  doc.save();
  doc.rotate(45, { origin: [centerX, y] });
  doc.rect(centerX - 4, y - 4, 8, 8).fill(GOLD);
  doc.restore();

  y += 24;
  if (recipient) {
    doc.font(FONT_REGULAR).fontSize(13).fillColor(MUTED)
      .text("Pre " + recipient, 0, y, { width: W, align: "center" });
    y += 24;
  }

  doc.font(FONT_BOLD).fontSize(18).fillColor(INK)
    .text(workshop, 70, y, { width: W - 140, align: "center" });
  y += 32;

  if (message) {
    const boxW = W - 240, boxX = (W - boxW) / 2;
    doc.font(FONT_REGULAR).fontSize(11);
    const textH = doc.heightOfString("„" + message + "“", { width: boxW - 40, align: "center" });
    doc.roundedRect(boxX, y, boxW, textH + 24, 8).lineWidth(1).fillAndStroke(WHITE, BORDER);
    doc.fillColor(INK).text("„" + message + "“", boxX + 20, y + 12, { width: boxW - 40, align: "center" });
    y += textH + 24 + 16;
  } else {
    y += 4;
  }

  // Kód
  const codeBoxW = 300, codeBoxH = 54, codeBoxX = centerX - codeBoxW / 2;
  doc.font(FONT_REGULAR).fontSize(9).fillColor(MUTED)
    .text("PRIHLASOVACÍ KÓD", 0, y, { width: W, align: "center", characterSpacing: 1.5 });
  y += 15;
  doc.roundedRect(codeBoxX, y, codeBoxW, codeBoxH, 8).lineWidth(1.4).fillAndStroke(WHITE, GOLD);
  doc.font(FONT_BOLD).fontSize(24).fillColor(INK)
    .text(String(code).split("").join(" "), codeBoxX, y + 15, { width: codeBoxW, align: "center" });
  y += codeBoxH + 16;

  doc.font(FONT_REGULAR).fontSize(10).fillColor(MUTED)
    .text("Kód zadajte na stránke mudroabezpecne.sk/prihlasenie.html", 0, y, { width: W, align: "center" });

  y += 50;
  doc.font(FONT_REGULAR).fontSize(10).fillColor(MUTED)
    .text("Ďakujeme, že ste vybrali darček, ktorý dáva zmysel.", 0, y, { width: W, align: "center" });

  // Pätička
  doc.font(FONT_REGULAR).fontSize(9).fillColor(MUTED)
    .text("Vydal: " + issuer, inner + 20, H - inner - 22, { width: 260 });
  doc.font(FONT_REGULAR).fontSize(9).fillColor(MUTED)
    .text(issueDate, W - inner - 20 - 120, H - inner - 22, { width: 120, align: "right" });
}

async function uploadPdfAndGetUrl(buffer, path) {
  const bucket = getStorage().bucket();
  const file = bucket.file(path);
  await file.save(buffer, { contentType: "application/pdf", resumable: false });
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 dní
  });
  return url;
}

/* ============================================================
   Vlastné SMTP odosielanie (faktúra, potvrdenie o zaplatení)
   ============================================================

   Uvítací e-mail s prístupovým kódom naďalej ide cez EmailJS (funkcia
   sendCodeEmail vyššie) — táto časť sa týka výhradne "Poslať FA" a
   "Poslať POZ" v admin zóne, kde sa e-mail posiela priamo z vlastného
   e-mailu (napr. cez Webnode), aby sme neboli závislí na limitoch
   EmailJS free plánu.

   Nastavenia (server, prihlásenie, heslo, šablóna) sa ukladajú do
   Firestore (emailConfig/smtp), ale k tomuto dokumentu sa NEDÁ
   pristupovať priamo z prehliadača — firestore.rules ho vôbec
   nespomínajú (predvolené "deny"), číta a zapisuje ho výhradne Admin
   SDK cez funkcie nižšie. Heslo sa navyše z funkcie getEmailSettings
   nikdy neposiela späť do prehliadača.
*/

function documentEmailShell(bodyHtml) {
  return `<div style="margin:0;padding:0;background-color:#efe6d3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#efe6d3;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#fffdf7;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
          <tr>
            <td style="background-color:#1f3a3d;padding:28px 32px;text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:bold;color:#fffdf7;letter-spacing:.03em;">DigiStart online vzdelávanie</div>
              <div style="font-size:13px;color:#c9b98f;margin-top:4px;">Kurzy, ktoré vám dávajú istotu v online svete</div>
            </td>
          </tr>
          <tr><td style="height:4px;background-color:#c17a2e;line-height:4px;font-size:0;">&nbsp;</td></tr>
${bodyHtml}
          <tr>
            <td style="padding:28px 40px 36px;">
              <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:#1f3a3d;">Ak by ste mali akúkoľvek otázku k dokumentu alebo k platbe, pokojne nám napíšte — radi pomôžeme.</p>
              <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#1f3a3d;">S pozdravom,<br><strong>Tím DigiStart kurzy</strong></p>
            </td>
          </tr>
          <tr><td style="height:1px;background-color:#ddd5c2;line-height:1px;font-size:0;">&nbsp;</td></tr>
          <tr>
            <td align="center" style="padding:18px 24px;">
              <p style="margin:0;font-size:12px;color:#9b917a;">Tento e-mail súvisí s vašou objednávkou na mudroabezpecne.sk.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;
}

const DEFAULT_INVOICE_EMAIL_TEMPLATE = documentEmailShell(`          <tr>
            <td style="padding:36px 40px 8px;">
              <p style="margin:0 0 18px;font-size:17px;line-height:1.6;color:#1f3a3d;">Dobrý deň, <strong>{{to_name}}</strong>,</p>
              <p style="margin:0 0 8px;font-size:17px;line-height:1.6;color:#1f3a3d;">posielame Vám <strong>faktúru č. {{doc_number}}</strong> k Vašej objednávke kurzu <strong>„{{workshop_title}}“</strong>.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#f6ecd9;border:2px solid #c17a2e;border-radius:12px;padding:24px 20px;">
                    <div style="font-size:11px;letter-spacing:.15em;color:#6b6350;text-transform:uppercase;margin-bottom:6px;">{{doc_label}}</div>
                    <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:bold;color:#1f3a3d;margin-bottom:16px;">č. {{doc_number}}</div>
                    <a href="{{doc_url}}" style="display:inline-block;background-color:#c17a2e;color:#fffdf7;text-decoration:none;font-size:15px;font-weight:bold;padding:12px 28px;border-radius:999px;">Stiahnuť PDF</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 40px 0;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#5c5749;">{{extra_line}}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 40px 0;">
              <p style="margin:0;font-size:14px;line-height:1.55;color:#8a5a1f;background-color:#fbf1de;border-radius:8px;padding:.7rem .9rem;">
                Pri úhrade bankovým prevodom prosím vždy uvádzajte správny variabilný symbol uvedený vyššie —
                bez neho sa nám platba nemusí podariť správne priradiť k vašej objednávke.
              </p>
            </td>
          </tr>`);

const DEFAULT_POZ_EMAIL_TEMPLATE = documentEmailShell(`          <tr>
            <td style="padding:36px 40px 8px;">
              <p style="margin:0 0 18px;font-size:17px;line-height:1.6;color:#1f3a3d;">Dobrý deň, <strong>{{to_name}}</strong>,</p>
              <p style="margin:0 0 8px;font-size:17px;line-height:1.6;color:#1f3a3d;">potvrdzujeme, že sme prijali platbu za kurz <strong>„{{workshop_title}}“</strong>. V prílohe nižšie nájdete oficiálne <strong>potvrdenie o zaplatení č. {{doc_number}}</strong> na stiahnutie.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#eef4ee;border:2px solid #5c8a5c;border-radius:12px;padding:24px 20px;">
                    <div style="font-size:11px;letter-spacing:.15em;color:#4a6b4a;text-transform:uppercase;margin-bottom:6px;">{{doc_label}}</div>
                    <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:bold;color:#1f3a3d;margin-bottom:16px;">č. {{doc_number}}</div>
                    <a href="{{doc_url}}" style="display:inline-block;background-color:#5c8a5c;color:#fffdf7;text-decoration:none;font-size:15px;font-weight:bold;padding:12px 28px;border-radius:999px;">Stiahnuť PDF</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 40px 0;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#5c5749;">{{extra_line}}</p>
            </td>
          </tr>`);

const DEFAULT_VOUCHER_EMAIL_TEMPLATE = documentEmailShell(`          <tr>
            <td style="padding:36px 40px 8px;">
              <p style="margin:0 0 18px;font-size:17px;line-height:1.6;color:#1f3a3d;">Dobrý deň, <strong>{{to_name}}</strong>,</p>
              <p style="margin:0 0 8px;font-size:17px;line-height:1.6;color:#1f3a3d;">pripravili sme pre Vás <strong>darčekový poukaz</strong> na kurz <strong>„{{workshop_title}}“</strong>.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#f6ecd9;border:2px solid #c17a2e;border-radius:12px;padding:24px 20px;">
                    <div style="font-size:11px;letter-spacing:.15em;color:#6b6350;text-transform:uppercase;margin-bottom:6px;">Prihlasovací kód</div>
                    <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:bold;letter-spacing:.12em;color:#1f3a3d;margin-bottom:16px;">{{code}}</div>
                    <a href="{{doc_url}}" style="display:inline-block;background-color:#c17a2e;color:#fffdf7;text-decoration:none;font-size:15px;font-weight:bold;padding:12px 28px;border-radius:999px;">Stiahnuť poukaz (PDF)</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 40px 0;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#5c5749;">{{extra_line}}</p>
            </td>
          </tr>`);

async function getSmtpConfig() {
  const snap = await db.collection("emailConfig").doc("smtp").get();
  const data = snap.exists ? snap.data() : {};
  if (!data.host || !data.user || !data.password) {
    throw new HttpsError(
      "failed-precondition",
      "SMTP nie je (úplne) nastavené. Doplňte ho v admin zóne v sekcii E-maily."
    );
  }
  return data;
}

async function getSmtpTransporter() {
  const cfg = await getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port || 465,
    secure: cfg.secure !== false,
    auth: { user: cfg.user, pass: cfg.password },
  });
  return { transporter, cfg };
}

// Zloží spoločné časti e-mailu (odosielateľ, kópia, adresa na odpoveď)
// na jednom mieste, nech sa nastavenia BCC/Reply-To nemusia opakovať
// v každej funkcii, ktorá cez SMTP niečo posiela.
function buildMailOptions(cfg, { to, subject, html }) {
  const opts = {
    from: (cfg.fromName ? cfg.fromName + " " : "") + "<" + cfg.user + ">",
    to,
    subject,
    html,
  };
  if (cfg.replyTo && String(cfg.replyTo).trim()) opts.replyTo = String(cfg.replyTo).trim();
  if (cfg.bccEnabled && cfg.bccAddress && String(cfg.bccAddress).trim()) opts.bcc = String(cfg.bccAddress).trim();
  return opts;
}

function renderDocumentEmailHtml(template, vars) {
  let html = template;
  for (const [key, value] of Object.entries(vars)) {
    const safe = key === "doc_url" ? String(value || "") : escapeHtmlServer(value || "");
    html = html.split("{{" + key + "}}").join(safe);
  }
  return html;
}

// docType rozhoduje, ktorá zo samostatných šablón sa použije. Ak admin
// ešte neuložil vlastnú verziu pre daný typ, skúsi sa najprv staršie
// spoločné pole documentEmailTemplate (z čias, keď bola šablóna len
// jedna — nech sa prípadná skoršia úprava nestratí), až potom predvolená.
async function sendDocumentSmtpEmail({ to, name, docLabel, docNumber, workshopTitle, url, extraLine, docType }) {
  let status = "sent";
  let errorMessage = "";
  try {
    const { transporter, cfg } = await getSmtpTransporter();
    const template = docType === "poz"
      ? (cfg.pozEmailTemplate || cfg.documentEmailTemplate || DEFAULT_POZ_EMAIL_TEMPLATE)
      : (cfg.invoiceEmailTemplate || cfg.documentEmailTemplate || DEFAULT_INVOICE_EMAIL_TEMPLATE);
    const html = renderDocumentEmailHtml(template, {
      to_name: name,
      doc_label: docLabel,
      doc_number: docNumber,
      workshop_title: workshopTitle,
      doc_url: url,
      extra_line: extraLine || "",
    });
    await transporter.sendMail(buildMailOptions(cfg, {
      to,
      subject: "Váš dokument je pripravený — " + docLabel + " č. " + docNumber,
      html,
    }));
  } catch (err) {
    status = "failed";
    errorMessage = String((err && err.message) || err).slice(0, 300);
    console.error("SMTP odoslanie dokumentu zlyhalo:", err);
  }

  try {
    await db.collection("mail").add({
      to, docLabel, docNumber, status, via: "smtp",
      error: status === "failed" ? errorMessage : null,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Nepodarilo sa zapísať záznam o e-maile do kolekcie mail:", err);
  }

  if (status === "failed") {
    throw new HttpsError(
      "internal",
      "Odoslanie e-mailu zlyhalo (" + errorMessage + "). Skontrolujte SMTP nastavenia v admin zóne (E-maily)."
    );
  }
}

exports.getEmailSettings = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže vidieť nastavenia e-mailu.");
  }
  const snap = await db.collection("emailConfig").doc("smtp").get();
  const data = snap.exists ? snap.data() : {};
  return {
    host: data.host || "",
    port: data.port || 465,
    secure: data.secure !== false,
    user: data.user || "",
    fromName: data.fromName || "",
    passwordSet: !!data.password,
    replyTo: data.replyTo || "",
    bccEnabled: !!data.bccEnabled,
    bccAddress: data.bccAddress || "",
    invoiceEmailTemplate: data.invoiceEmailTemplate || data.documentEmailTemplate || DEFAULT_INVOICE_EMAIL_TEMPLATE,
    pozEmailTemplate: data.pozEmailTemplate || data.documentEmailTemplate || DEFAULT_POZ_EMAIL_TEMPLATE,
    voucherEmailTemplate: data.voucherEmailTemplate || DEFAULT_VOUCHER_EMAIL_TEMPLATE,
  };
});

exports.saveEmailSettings = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže upravovať nastavenia e-mailu.");
  }
  const {
    host, port, secure, user, fromName, password,
    replyTo, bccEnabled, bccAddress,
    invoiceEmailTemplate, pozEmailTemplate, voucherEmailTemplate,
  } = request.data || {};
  if (!host || !String(host).trim() || !user || !String(user).trim()) {
    throw new HttpsError("invalid-argument", "Chýba SMTP server alebo prihlasovacia e-mailová adresa.");
  }

  const update = {
    host: String(host).trim(),
    port: Number(port) || 465,
    secure: secure !== false,
    user: String(user).trim(),
    fromName: String(fromName || "").trim(),
    replyTo: String(replyTo || "").trim(),
    bccEnabled: !!bccEnabled,
    bccAddress: String(bccAddress || "").trim(),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: request.auth.token.email || request.auth.uid,
  };
  // Prázdne pole hesla znamená "nemeniť" — heslo sa nikdy neposiela
  // späť do prehliadača, takže prázdne pole nemôže znamenať náhodné
  // vymazanie uloženého hesla.
  if (typeof password === "string" && password.length > 0) {
    update.password = password;
  }
  if (typeof invoiceEmailTemplate === "string" && invoiceEmailTemplate.trim()) {
    update.invoiceEmailTemplate = invoiceEmailTemplate;
  }
  if (typeof pozEmailTemplate === "string" && pozEmailTemplate.trim()) {
    update.pozEmailTemplate = pozEmailTemplate;
  }
  if (typeof voucherEmailTemplate === "string" && voucherEmailTemplate.trim()) {
    update.voucherEmailTemplate = voucherEmailTemplate;
  }

  await db.collection("emailConfig").doc("smtp").set(update, { merge: true });
  return { ok: true };
});

// Testovací e-mail pre KONKRÉTNU šablónu (faktúra/POZ/poukaz) — posiela
// presne to, čo je práve rozpísané v editore, aj keď to ešte nie je
// uložené. Vzorové údaje sa použijú rovnaké ako pri živom náhľade.
const TEMPLATE_TEST_SAMPLES = {
  invoice: {
    to_name: "Mária Nováková", doc_label: "faktúra", doc_number: "FA20260903001",
    workshop_title: "Ako nenaletieť podvodníkom", doc_url: "https://mudroabezpecne.sk/",
    extra_line: "Suma: 39 € · VS: 20260903001",
  },
  poz: {
    to_name: "Mária Nováková", doc_label: "potvrdenie o zaplatení", doc_number: "UH20260903001",
    workshop_title: "Ako nenaletieť podvodníkom", doc_url: "https://mudroabezpecne.sk/",
    extra_line: "Spôsob úhrady: Bankovým prevodom · Dátum úhrady: 3. 9. 2026",
  },
  voucher: {
    to_name: "Peter Kilpa", workshop_title: "Ako nenaletieť podvodníkom", code: "BYVNNN",
    doc_url: "https://mudroabezpecne.sk/",
    extra_line: "Poukaz je pripravený pre: Janka. Váš odkaz na poukaze: „K narodeninám!“",
  },
};
const TEMPLATE_TEST_SUBJECTS = {
  invoice: "[TEST] Faktúra",
  poz: "[TEST] Potvrdenie o zaplatení",
  voucher: "[TEST] Darčekový poukaz",
};

exports.sendTestTemplateEmail = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže odosielať testovacie e-maily.");
  }
  const { type, template } = request.data || {};
  if (!TEMPLATE_TEST_SAMPLES[type] || typeof template !== "string" || !template.trim()) {
    throw new HttpsError("invalid-argument", "Chýba typ šablóny alebo jej obsah.");
  }
  const to = request.auth.token.email;
  if (!to) throw new HttpsError("failed-precondition", "Chýba e-mail prihláseného administrátora.");

  const html = renderDocumentEmailHtml(template, TEMPLATE_TEST_SAMPLES[type]);
  let status = "sent";
  let errorMessage = "";
  try {
    const { transporter, cfg } = await getSmtpTransporter();
    await transporter.sendMail(buildMailOptions(cfg, {
      to,
      subject: TEMPLATE_TEST_SUBJECTS[type],
      html,
    }));
  } catch (err) {
    status = "failed";
    errorMessage = String((err && err.message) || err).slice(0, 300);
    console.error("Testovací e-mail šablóny zlyhal:", err);
  }

  try {
    await db.collection("mail").add({
      to, docLabel: "test šablóny — " + (TEMPLATE_TEST_SUBJECTS[type] || type), docNumber: null, status, via: "smtp",
      error: status === "failed" ? errorMessage : null,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Nepodarilo sa zapísať záznam o e-maile do kolekcie mail:", err);
  }

  if (status === "failed") {
    throw new HttpsError("internal", "Odoslanie zlyhalo: " + errorMessage);
  }
  return { ok: true, to };
});

exports.getEmailStats = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže vidieť štatistiky e-mailov.");
  }
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = (startOfDay.getDay() + 6) % 7; // pondelok = začiatok týždňa
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - dayOfWeek);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const mailRef = db.collection("mail");
  const [dayCount, weekCount, monthCount] = await Promise.all([
    mailRef.where("createdAt", ">=", startOfDay).count().get(),
    mailRef.where("createdAt", ">=", startOfWeek).count().get(),
    mailRef.where("createdAt", ">=", startOfMonth).count().get(),
  ]);
  return {
    today: dayCount.data().count,
    week: weekCount.data().count,
    month: monthCount.data().count,
  };
});

// Overí, či doména odosielacej adresy má nastavené SPF a DMARC (presné
// TXT záznamy, jednoznačne definované), a skúsi nájsť DKIM na
// niekoľkých bežných selektoroch — presný selektor Webnode nezverejňuje,
// takže pri "nenájdené" to nemusí nutne znamenať chybu, len sa nedal
// uhádnuť názov. Slúži len ako orientačná kontrola pre lepšiu
// doručiteľnosť, nič nemení ani nenastavuje.
exports.checkEmailDns = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže overovať DNS záznamy.");
  }
  const snap = await db.collection("emailConfig").doc("smtp").get();
  const cfgUser = snap.exists ? snap.data().user : null;
  const emailAddr = (request.data && request.data.email) || cfgUser || "";
  const atIdx = String(emailAddr).indexOf("@");
  if (atIdx === -1) {
    throw new HttpsError("failed-precondition", "Najprv nastavte a uložte SMTP prihlasovaciu e-mailovú adresu.");
  }
  const domain = String(emailAddr).slice(atIdx + 1).trim();

  async function lookupTxt(host) {
    try {
      const records = await dns.resolveTxt(host);
      return records.map((r) => r.join(""));
    } catch (err) {
      return [];
    }
  }

  const rootTxt = await lookupTxt(domain);
  const spfRecord = rootTxt.find((r) => r.toLowerCase().startsWith("v=spf1"));

  const dmarcTxt = await lookupTxt("_dmarc." + domain);
  const dmarcRecord = dmarcTxt.find((r) => r.toLowerCase().startsWith("v=dmarc1"));

  const dkimSelectors = ["default", "selector1", "selector2", "webnode", "smtp", "mail", "dkim", "s1"];
  let dkim = null;
  for (const sel of dkimSelectors) {
    const txt = await lookupTxt(sel + "._domainkey." + domain);
    const rec = txt.find((r) => r.toLowerCase().includes("v=dkim1") || r.toLowerCase().includes("p="));
    if (rec) { dkim = { selector: sel, record: rec }; break; }
  }

  return {
    domain,
    spf: { found: !!spfRecord, record: spfRecord || null },
    dmarc: { found: !!dmarcRecord, record: dmarcRecord || null },
    dkim: dkim ? { found: true, selector: dkim.selector, record: dkim.record } : { found: false, selector: null, record: null },
  };
});

exports.sendTestSmtpEmail = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže odosielať testovacie e-maily.");
  }
  const to = request.auth.token.email;
  if (!to) throw new HttpsError("failed-precondition", "Chýba e-mail prihláseného administrátora.");

  const { transporter, cfg } = await getSmtpTransporter();
  let status = "sent";
  let errorMessage = "";
  try {
    await transporter.sendMail(buildMailOptions(cfg, {
      to,
      subject: "Testovací e-mail — SMTP nastavenia fungujú",
      html:
        "<p style='font-family:Arial,sans-serif;font-size:15px;color:#1f3a3d;'>" +
        "Toto je testovací e-mail z admin zóny mudroabezpecne.sk (sekcia E-maily).<br>" +
        "Ak ho vidíte, SMTP nastavenia sú funkčné.</p>",
    }));
  } catch (err) {
    status = "failed";
    errorMessage = String((err && err.message) || err).slice(0, 300);
    console.error("Testovací SMTP e-mail zlyhal:", err);
  }

  try {
    await db.collection("mail").add({
      to, docLabel: "testovací e-mail", docNumber: null, status, via: "smtp",
      error: status === "failed" ? errorMessage : null,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Nepodarilo sa zapísať záznam o e-maile do kolekcie mail:", err);
  }

  if (status === "failed") {
    throw new HttpsError("internal", "Odoslanie zlyhalo: " + errorMessage);
  }
  return { ok: true, to };
});

exports.listSentEmails = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže vidieť históriu e-mailov.");
  }
  const limit = Math.min(Number(request.data?.limit) || 50, 200);
  const snap = await db.collection("mail").orderBy("createdAt", "desc").limit(limit).get();
  return {
    items: snap.docs.map((d) => {
      const v = d.data();
      return {
        id: d.id,
        to: v.to || null,
        status: v.status || null,
        docLabel: v.docLabel || null,
        docNumber: v.docNumber || null,
        code: v.code || null,
        via: v.via || "emailjs",
        error: v.error || null,
        createdAt: v.createdAt ? v.createdAt.toMillis() : null,
      };
    }),
  };
});

// Náhľad faktúry/POZ pred odoslaním — rovnaký vzhľad, ale s dočasným číslom
// "NÁHĽAD" a bez zápisu do denného počítadla, aby si prezretie nespotrebovalo
// skutočné poradové číslo dokumentu.
// Úprava mena/priezviska/e-mailu registrácie z admin zóny — každá zmena sa
// zaznamená do orderAuditLog (čo sa zmenilo a ktorý admin to urobil).
// Približné využitie Firebase Storage (súčet veľkostí všetkých súborov v
// buckete) — Storage má trvalý free limit 5 GB úložiska (neresetuje sa
// mesačne, na rozdiel od prenosu dát/operácií, ktoré tu nevieme zmerať).
exports.getStorageUsage = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže vidieť využitie úložiska.");
  }
  const [files] = await getStorage().bucket().getFiles();
  const totalBytes = files.reduce((sum, f) => sum + Number(f.metadata.size || 0), 0);
  return { totalBytes, fileCount: files.length };
});

exports.updateOrderContact = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže upravovať údaje registrácie.");
  }
  const { orderId, firstName, lastName, email } = request.data || {};
  if (!orderId || !firstName || !email) {
    throw new HttpsError("invalid-argument", "Chýba meno alebo e-mail.");
  }

  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError("not-found", "Objednávka neexistuje.");
  const before = orderSnap.data();

  const cleanFirstName = String(firstName).trim();
  const cleanLastName = String(lastName || "").trim();
  const cleanEmail = String(email).trim();
  const newName = fullName(cleanFirstName, cleanLastName);

  const changes = {};
  if ((before.firstName || "") !== cleanFirstName) changes.firstName = { from: before.firstName || null, to: cleanFirstName };
  if ((before.lastName || "") !== cleanLastName) changes.lastName = { from: before.lastName || null, to: cleanLastName };
  if ((before.email || "") !== cleanEmail) changes.email = { from: before.email || null, to: cleanEmail };

  if (Object.keys(changes).length === 0) {
    return { changed: false };
  }

  await orderRef.update({ firstName: cleanFirstName, lastName: cleanLastName, email: cleanEmail, name: newName });

  const codesSnap = await db.collection("accessCodes").where("orderId", "==", orderId).get();
  await Promise.all(codesSnap.docs.map((codeDoc) =>
    codeDoc.ref.update({ firstName: cleanFirstName, lastName: cleanLastName, participantName: newName })
  ));

  await db.collection("orderAuditLog").add({
    orderId,
    changes,
    editedBy: request.auth.token.email || request.auth.uid,
    editedAt: FieldValue.serverTimestamp(),
  });

  return { changed: true };
});

exports.previewDocumentPdf = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže zobraziť náhľad dokumentu.");
  }
  const { orderId, docType, codeId } = request.data || {};
  if (!orderId || !["invoice", "poz", "voucher"].includes(docType)) {
    throw new HttpsError("invalid-argument", "Chýba orderId alebo neplatný docType.");
  }
  if (docType === "voucher" && !codeId) {
    throw new HttpsError("invalid-argument", "Chýba prístupový kód poukazu.");
  }

  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError("not-found", "Objednávka neexistuje.");
  const order = orderSnap.data();

  const settingsSnap = await db.collection("settings").doc("general").get();
  const s = settingsSnap.exists ? settingsSnap.data() : {};

  const workshopSnap = await db.collection("workshops").doc(order.workshopId).get();
  order.workshopTitleSnapshot = workshopSnap.exists ? (workshopSnap.data().title || order.workshopId) : order.workshopId;

  if (docType === "voucher") {
    const buffer = await pdfToBuffer(
      (doc) => drawGiftVoucherPdf(doc, { s, order, code: codeId }),
      { size: "A4", layout: "landscape", margin: 0 }
    );
    return { pdfBase64: buffer.toString("base64") };
  }

  const invoiceNumber = await getOrAssignInvoiceNumber(orderRef, order);
  const buffer = docType === "invoice"
    ? await pdfToBuffer((doc) => drawInvoicePdf(doc, { s, order, invoiceNumber }))
    : await pdfToBuffer((doc) => drawPozPdf(doc, { s, order, pozNumber: "UH" + invoiceNumber.slice(2), invoiceNumber }));

  return { pdfBase64: buffer.toString("base64") };
});

// Odoslanie darčekového poukazu (PDF) e-mailom kupujúcemu — vygeneruje sa
// rovnaký dokument ako pri náhľade, uloží sa a pošle sa naň odkaz.
async function sendVoucherSmtpEmail({ to, name, workshopTitle, url, code, recipientName, giftMessage }) {
  let status = "sent";
  let errorMessage = "";
  const extraParts = [];
  if (recipientName) extraParts.push("Poukaz je pripravený pre: " + recipientName + ".");
  if (giftMessage) extraParts.push("Váš odkaz na poukaze: „" + giftMessage + "“");
  const extraLine = extraParts.join(" ");

  try {
    const { transporter, cfg } = await getSmtpTransporter();
    const template = cfg.voucherEmailTemplate || DEFAULT_VOUCHER_EMAIL_TEMPLATE;
    const html = renderDocumentEmailHtml(template, {
      to_name: name,
      workshop_title: workshopTitle,
      doc_url: url,
      code,
      extra_line: extraLine,
    });
    await transporter.sendMail(buildMailOptions(cfg, {
      to,
      subject: "Darčekový poukaz — kurz „" + workshopTitle + "“",
      html,
    }));
  } catch (err) {
    status = "failed";
    errorMessage = String((err && err.message) || err).slice(0, 300);
    console.error("SMTP odoslanie poukazu zlyhalo:", err);
  }

  try {
    await db.collection("mail").add({
      to, docLabel: "darčekový poukaz", code, status, via: "smtp",
      error: status === "failed" ? errorMessage : null,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Nepodarilo sa zapísať záznam o e-maile do kolekcie mail:", err);
  }

  if (status === "failed") {
    throw new HttpsError(
      "internal",
      "Odoslanie e-mailu zlyhalo (" + errorMessage + "). Skontrolujte SMTP nastavenia v admin zóne (E-maily)."
    );
  }
}

exports.sendGiftVoucherEmail = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže odosielať darčekové poukazy.");
  }
  const { orderId, codeId } = request.data || {};
  if (!orderId || !codeId) throw new HttpsError("invalid-argument", "Chýba orderId alebo kód poukazu.");

  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError("not-found", "Objednávka neexistuje.");
  const order = orderSnap.data();

  const settingsSnap = await db.collection("settings").doc("general").get();
  const s = settingsSnap.exists ? settingsSnap.data() : {};

  const workshopSnap = await db.collection("workshops").doc(order.workshopId).get();
  order.workshopTitleSnapshot = workshopSnap.exists ? (workshopSnap.data().title || order.workshopId) : order.workshopId;

  const buffer = await pdfToBuffer(
    (doc) => drawGiftVoucherPdf(doc, { s, order, code: codeId }),
    { size: "A4", layout: "landscape", margin: 0 }
  );
  const url = await uploadPdfAndGetUrl(buffer, "vouchers/" + orderId + "/" + codeId + ".pdf");

  await sendVoucherSmtpEmail({
    to: order.email,
    name: order.firstName || order.name,
    workshopTitle: order.workshopTitleSnapshot,
    url,
    code: codeId,
    recipientName: order.giftRecipientName || null,
    giftMessage: order.giftMessage || null,
  });

  return { url };
});

exports.sendInvoiceEmail = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže odosielať faktúry.");
  }
  const { orderId } = request.data || {};
  if (!orderId) throw new HttpsError("invalid-argument", "Chýba orderId.");

  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError("not-found", "Objednávka neexistuje.");
  const order = orderSnap.data();
  if (order.status === "pending_payment") throw new HttpsError("failed-precondition", "Objednávka ešte nie je uhradená.");

  const settingsSnap = await db.collection("settings").doc("general").get();
  const s = settingsSnap.exists ? settingsSnap.data() : {};

  const workshopSnap = await db.collection("workshops").doc(order.workshopId).get();
  order.workshopTitleSnapshot = workshopSnap.exists ? (workshopSnap.data().title || order.workshopId) : order.workshopId;

  const invoiceNumber = await getOrAssignInvoiceNumber(orderRef, order);
  const buffer = await pdfToBuffer((doc) => drawInvoicePdf(doc, { s, order, invoiceNumber }));
  const url = await uploadPdfAndGetUrl(buffer, "invoices/" + orderId + "/" + invoiceNumber + ".pdf");

  await sendDocumentSmtpEmail({
    to: order.email,
    name: order.firstName || order.name,
    docLabel: "faktúra",
    docNumber: invoiceNumber,
    workshopTitle: order.workshopTitleSnapshot,
    url,
    extraLine: "Suma: " + (order.amount != null ? order.amount : "—") + " € · VS: " + invoiceNumber.slice(2),
    docType: "invoice",
  });

  return { invoiceNumber, url };
});

exports.sendPaymentConfirmationEmail = onCall(async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže odosielať potvrdenia o zaplatení.");
  }
  const { orderId } = request.data || {};
  if (!orderId) throw new HttpsError("invalid-argument", "Chýba orderId.");

  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError("not-found", "Objednávka neexistuje.");
  const order = orderSnap.data();
  if (order.status === "pending_payment") throw new HttpsError("failed-precondition", "Objednávka ešte nie je uhradená.");

  const settingsSnap = await db.collection("settings").doc("general").get();
  const s = settingsSnap.exists ? settingsSnap.data() : {};

  const workshopSnap = await db.collection("workshops").doc(order.workshopId).get();
  order.workshopTitleSnapshot = workshopSnap.exists ? (workshopSnap.data().title || order.workshopId) : order.workshopId;

  const invoiceNumber = await getOrAssignInvoiceNumber(orderRef, order);
  const pozNumber = "UH" + invoiceNumber.slice(2);
  const buffer = await pdfToBuffer((doc) => drawPozPdf(doc, { s, order, pozNumber, invoiceNumber }));
  const url = await uploadPdfAndGetUrl(buffer, "poz/" + orderId + "/" + pozNumber + ".pdf");

  const paidDate = order.paidAt ? order.paidAt.toDate().toLocaleDateString("sk-SK") : "—";
  const paymentMethodLabel = PAYMENT_METHOD_LABELS[order.paymentMethod] || "—";
  await sendDocumentSmtpEmail({
    to: order.email,
    name: order.firstName || order.name,
    docLabel: "potvrdenie o zaplatení",
    docNumber: pozNumber,
    workshopTitle: order.workshopTitleSnapshot,
    url,
    extraLine: "Spôsob úhrady: " + paymentMethodLabel + " · Dátum úhrady: " + paidDate,
    docType: "poz",
  });

  return { pozNumber, url };
});

/* ============================================================
   Platba kartou cez Stripe Checkout
   ============================================================

   Celá platba prebieha na zabezpečenej stránke Stripe — údaje o karte
   sa nikdy nedostanú na náš server ani do našej databázy. My len
   pripravíme platbu a počkáme, kým nám Stripe potvrdí jej prijatie.

   Kľúče sa nikdy neukladajú do kódu, čítajú sa z tajomstiev Firebase:
     firebase functions:secrets:set STRIPE_SECRET_KEY
     firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
*/

function getStripe() {
  const key = STRIPE_SECRET_KEY.value();
  if (!key) {
    throw new HttpsError("failed-precondition", "Platba kartou zatiaľ nie je nastavená.");
  }
  // eslint-disable-next-line global-require
  return require("stripe")(key, { apiVersion: "2024-06-20" });
}

/**
 * Pripraví platbu kartou pre existujúcu objednávku a vráti adresu
 * platobnej stránky Stripe.
 *
 * Sumu berieme výhradne z objednávky uloženej v databáze — nikdy nie
 * z prehliadača, aby sa nedala podvrhnúť.
 */
exports.createStripeCheckout = onCall({ secrets: [STRIPE_SECRET_KEY] }, async (request) => {
  const { orderId, returnOrigin } = request.data || {};
  if (!orderId || typeof orderId !== "string") {
    throw new HttpsError("invalid-argument", "Chýba číslo objednávky.");
  }

  const orderRef = db.collection("orders").doc(orderId);
  const snap = await orderRef.get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Objednávka neexistuje.");
  }
  const order = snap.data();
  if (order.status !== "pending_payment") {
    throw new HttpsError("failed-precondition", "Táto objednávka už bola uhradená.");
  }

  const amount = Number(order.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new HttpsError("failed-precondition", "Objednávku nie je možné uhradiť kartou.");
  }

  const workshopSnap = await db.collection("workshops").doc(order.workshopId).get();
  const workshopTitle = workshopSnap.exists
    ? (workshopSnap.data().title || "Online kurz")
    : "Online kurz";

  // Adresu na návrat obmedzíme na povolené domény, aby sa cez ňu nedalo
  // presmerovať účastníka na cudziu stránku.
  const origin = pickAllowedOrigin(returnOrigin);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    locale: "sk",
    customer_email: order.email || undefined,
    client_reference_id: orderId,
    metadata: { orderId, variableSymbol: order.variableSymbol || "" },
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(amount * 100),
        product_data: {
          name: workshopTitle,
          description: order.groupSize > 1
            ? "Online kurz pre " + order.groupSize + " účastníkov"
            : "Online kurz pre 1 účastníka",
        },
      },
    }],
    success_url: origin + "/platba-uspesna.html?objednavka=" + encodeURIComponent(orderId),
    cancel_url: origin + "/objednavka.html?zrusene=1&objednavka=" + encodeURIComponent(orderId),
  });

  await orderRef.update({
    stripeSessionId: session.id,
    stripeCheckoutStartedAt: FieldValue.serverTimestamp(),
  });

  return { url: session.url };
});

/**
 * Prijíma potvrdenia o platbe priamo od Stripe.
 *
 * Toto je jediné miesto, kde sa objednávka označí ako uhradená kartou —
 * prehliadaču sa v tejto veci nedá veriť, lebo návrat na stránku „platba
 * úspešná“ vie ktokoľvek otvoriť aj bez zaplatenia. Pravosť správy overuje
 * podpis, ktorý Stripe posiela v hlavičke.
 */
exports.stripeWebhook = onRequest(
  // EMAILJS_PRIVATE_KEY je potrebný, lebo táto funkcia (cez issueCodesForOrder)
  // po potvrdení platby posiela účastníkovi e-mail s prístupovým kódom.
  { secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, EMAILJS_PRIVATE_KEY], cors: false },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    let event;
    try {
      const stripe = require("stripe")(STRIPE_SECRET_KEY.value(), { apiVersion: "2024-06-20" });
      event = stripe.webhooks.constructEvent(
        req.rawBody,                       // podpis sa overuje z pôvodného tela požiadavky
        req.headers["stripe-signature"],
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      console.error("Neplatný podpis správy od Stripe:", err && err.message);
      res.status(400).send("Neplatný podpis.");
      return;
    }

    // Odpoveď posielame až po spracovaní, aby Stripe vedel správu zopakovať,
    // ak by sa vydanie kódov nepodarilo.
    try {
      if (event.type === "checkout.session.completed" ||
          event.type === "checkout.session.async_payment_succeeded") {
        const session = event.data.object;
        if (session.payment_status === "paid") {
          await handlePaidCheckout(session);
        }
      }
      res.status(200).send("ok");
    } catch (err) {
      console.error("Spracovanie platby zlyhalo:", err);
      res.status(500).send("Spracovanie zlyhalo.");
    }
  }
);

async function handlePaidCheckout(session) {
  const orderId = (session.metadata && session.metadata.orderId) || session.client_reference_id;
  if (!orderId) {
    console.error("Platba bez čísla objednávky, session:", session.id);
    return;
  }

  const orderSnap = await db.collection("orders").doc(orderId).get();
  if (!orderSnap.exists) {
    console.error("Platba pre neexistujúcu objednávku:", orderId);
    return;
  }
  const order = orderSnap.data();

  // Druhá kontrola sumy — chráni pred prípadom, že by sa platba spárovala
  // s inou objednávkou, než na akú bola vytvorená.
  const expectedCents = Math.round(Number(order.amount) * 100);
  if (Number(session.amount_total) !== expectedCents) {
    console.error(
      "Uhradená suma nesedí s objednávkou:", orderId,
      "očakávané:", expectedCents, "prijaté:", session.amount_total
    );
    await db.collection("orders").doc(orderId).update({
      paymentMismatch: true,
      paymentMismatchAmount: session.amount_total,
    });
    return;
  }

  await issueCodesForOrder(orderId, "card", {
    stripeSessionId: session.id,
    stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
  });
}

/**
 * Zistí stav objednávky pre stránku po návrate z platby.
 *
 * Číslo objednávky je náhodný neuhádnuteľný identifikátor, takže slúži ako
 * kľúč k tejto jedinej objednávke. Zámerne vraciame len to najnutnejšie —
 * žiadne osobné údaje ani prístupové kódy.
 */
exports.getOrderPaymentStatus = onCall(async (request) => {
  const { orderId } = request.data || {};
  if (!orderId || typeof orderId !== "string") {
    throw new HttpsError("invalid-argument", "Chýba číslo objednávky.");
  }
  const snap = await db.collection("orders").doc(orderId).get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Objednávka neexistuje.");
  }
  const order = snap.data();
  return {
    status: order.status || null,
    paid: order.status === "code_sent",
    emailMasked: maskEmail(order.email || ""),
  };
});

function maskEmail(email) {
  const at = email.indexOf("@");
  if (at < 1) return "";
  const name = email.slice(0, at);
  const domain = email.slice(at);
  const shown = name.slice(0, Math.min(2, name.length));
  return shown + "•".repeat(Math.max(name.length - shown.length, 1)) + domain;
}
