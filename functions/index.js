const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");

setGlobalOptions({ region: "europe-west1", maxInstances: 10 });

initializeApp();
const db = getFirestore();

const EMAILJS_PRIVATE_KEY = defineSecret("EMAILJS_PRIVATE_KEY");
const EMAILJS_SERVICE_ID = "service_qnxes8j";
const EMAILJS_TEMPLATE_ID = "template_aspeze7";
const EMAILJS_PUBLIC_KEY = "eOd4Q1os_TN-pSs2S";

// Písmená bez I/O — vylúčené kvôli zámene s 1/0 pri prepise kódu z papiera.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";

const DEFAULT_SETTINGS = {
  inactivityMinutes: 5,
  codeValidityDays: 90,
  maxLoginsPerCode: 0, // 0 = neobmedzené
  couponCode: "",
  couponPercent: 0,
  couponActive: false,
  groupDiscountMinSize: 0, // 0 = vypnuté
  groupDiscountPercent: 0,
  staleOrderDays: 3,
  remindNeverLoggedEnabled: false,
  remindNeverLoggedDays: 3,
  remindUnfinishedEnabled: false,
  remindUnfinishedDays: 7,
  staleOrderEmailEnabled: false,
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
  const { firstName, lastName, email, workshopId, participants, couponCode, utm } = request.data || {};
  if (!firstName || !lastName || !email || !workshopId) {
    throw new HttpsError("invalid-argument", "Chýba meno, priezvisko, e-mail alebo workshop.");
  }

  const workshopSnap = await db.collection("workshops").doc(workshopId).get();
  if (!workshopSnap.exists) {
    throw new HttpsError("not-found", "Zvolený workshop neexistuje.");
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

  // Skupinová zľava (ak je zapnutá a počet účastníkov ju dosahuje).
  if (settings.groupDiscountMinSize > 0 && groupSize >= settings.groupDiscountMinSize && settings.groupDiscountPercent > 0) {
    unitPrice = unitPrice * (1 - settings.groupDiscountPercent / 100);
    discountNote = "skupinová zľava " + settings.groupDiscountPercent + " %";
  }

  let amount = Math.round(unitPrice * groupSize * 100) / 100;

  // Zľavový kupón (percentuálny, na celkovú sumu).
  let couponApplied = null;
  if (couponCode && settings.couponActive && settings.couponCode &&
      String(couponCode).trim().toUpperCase() === String(settings.couponCode).trim().toUpperCase()) {
    amount = Math.round(amount * (1 - settings.couponPercent / 100) * 100) / 100;
    couponApplied = settings.couponCode;
  }

  const orderRef = db.collection("orders").doc();
  const variableSymbol = orderRef.id.replace(/\D/g, "").slice(0, 10) || String(Date.now()).slice(-10);

  await orderRef.set({
    name: fullName(firstName, lastName),
    firstName,
    lastName,
    email,
    workshopId,
    participants: cleanParticipants,
    groupSize,
    amount,
    baseAmount: Math.round(basePrice * groupSize * 100) / 100,
    discountNote,
    couponApplied,
    variableSymbol,
    status: "pending_payment",
    createdAt: FieldValue.serverTimestamp(),
    utm: utm && typeof utm === "object" ? {
      source: utm.source || null,
      medium: utm.medium || null,
      campaign: utm.campaign || null,
    } : null,
  });

  return { orderId: orderRef.id, variableSymbol, amount };
});

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

  const { orderId } = request.data || {};
  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) {
    throw new HttpsError("not-found", "Objednávka neexistuje.");
  }
  const order = orderSnap.data();
  if (order.status !== "pending_payment") {
    throw new HttpsError("failed-precondition", "Táto objednávka už bola spracovaná.");
  }

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

  await orderRef.update({ status: "code_sent", codeIssuedAt: FieldValue.serverTimestamp() });

  await sendCodeEmail({ to: order.email, name: order.firstName || order.name, codes, workshopId: order.workshopId });

  return { codes };
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
    throw new HttpsError("invalid-argument", "Chýba workshop alebo meno účastníka.");
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
exports.verifyCode = onCall(async (request) => {
  const { name, code } = request.data || {};
  if (!name || !code) {
    throw new HttpsError("invalid-argument", "Zadaj meno aj prístupový kód.");
  }

  const normalizedCode = String(code).trim().toUpperCase();
  const codeSnap = await db.collection("accessCodes").doc(normalizedCode).get();
  if (!codeSnap.exists || codeSnap.data().active !== true) {
    throw new HttpsError("not-found", "Kód nie je platný. Skontroluj prosím jeho zápis.");
  }

  const codeData = codeSnap.data();
  const settings = await getSettings();

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
            messageOverride: "Všimli sme si, že ste sa zatiaľ neprihlásili do svojho workshopu. Váš prístupový kód je stále platný — stačí ísť na stránku Prihlásenie a zadať meno a kód.",
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
              messageOverride: "Váš workshop čaká na dokončenie — zostáva vám už len záverečný kvíz a certifikát. Prihláste sa rovnakým kódom a pokračujte presne tam, kde ste skončili.",
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
