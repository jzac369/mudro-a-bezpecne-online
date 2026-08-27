const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
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

/**
 * Vytvorí objednávku so stavom "pending_payment" a vlastným variabilným
 * symbolom pre bankový prevod. Volané z verejnej objednávkovej stránky.
 */
exports.createOrder = onCall(async (request) => {
  const { name, email, workshopId } = request.data || {};
  if (!name || !email || !workshopId) {
    throw new HttpsError("invalid-argument", "Chýba meno, e-mail alebo workshop.");
  }

  const workshopSnap = await db.collection("workshops").doc(workshopId).get();
  if (!workshopSnap.exists) {
    throw new HttpsError("not-found", "Zvolený workshop neexistuje.");
  }

  const orderRef = db.collection("orders").doc();
  const variableSymbol = orderRef.id.replace(/\D/g, "").slice(0, 10) || String(Date.now()).slice(-10);

  await orderRef.set({
    name,
    email,
    workshopId,
    amount: workshopSnap.data().price,
    variableSymbol,
    status: "pending_payment",
    createdAt: FieldValue.serverTimestamp(),
  });

  return { orderId: orderRef.id, variableSymbol };
});

/**
 * Označí objednávku ako uhradenú a vygeneruje prístupový kód.
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

  const code = await issueUniqueCode();

  await db.collection("accessCodes").doc(code).set({
    code,
    workshopId: order.workshopId,
    orderId,
    participantName: order.name,
    createdAt: FieldValue.serverTimestamp(),
    active: true,
  });

  await orderRef.update({ status: "code_sent", codeIssuedAt: FieldValue.serverTimestamp() });

  await sendCodeEmail({ to: order.email, name: order.name, code, workshopId: order.workshopId });

  return { code };
});

/**
 * Ručné vygenerovanie kódu z admin zóny (darčekové poukazy, opravy,
 * testovanie) — bez naviazania na objednávku.
 */
exports.generateCode = onCall({ secrets: [EMAILJS_PRIVATE_KEY] }, async (request) => {
  if (request.auth?.token?.admin !== true) {
    throw new HttpsError("permission-denied", "Len administrátor môže generovať kódy.");
  }
  const { workshopId, participantName, email } = request.data || {};
  if (!workshopId || !participantName) {
    throw new HttpsError("invalid-argument", "Chýba workshop alebo meno účastníka.");
  }

  const code = await issueUniqueCode();
  await db.collection("accessCodes").doc(code).set({
    code,
    workshopId,
    orderId: null,
    participantName,
    createdAt: FieldValue.serverTimestamp(),
    active: true,
  });

  if (email) {
    await sendCodeEmail({ to: email, name: participantName, code, workshopId });
  }

  return { code };
});

/**
 * Overí meno + kód a vydá custom token s claimami `codeId` a `workshopId`,
 * ktorý front-end použije na signInWithCustomToken (bez hesla).
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
  const token = await getAuth().createCustomToken(normalizedCode, {
    codeId: normalizedCode,
    workshopId: codeData.workshopId,
  });

  return { token, workshopId: codeData.workshopId, participantName: codeData.participantName };
});

/**
 * Opätovné odoslanie kódu, keď si ho účastník nevie nájsť. Vyhľadá podľa
 * e-mailu poslednú uhradenú objednávku a pošle príslušný kód znova.
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
    const codeSnap = await db
      .collection("accessCodes")
      .where("orderId", "==", ordersSnap.docs[0].id)
      .limit(1)
      .get();
    if (!codeSnap.empty) {
      const codeData = codeSnap.docs[0].data();
      await sendCodeEmail({ to: email, name: order.name, code: codeData.code, workshopId: order.workshopId });
    }
  }

  return { ok: true };
});

/**
 * Odoslanie e-mailu s prístupovým kódom cez EmailJS REST API (server-side,
 * súkromný kľúč nikdy neopustí Cloud Function).
 */
async function sendCodeEmail({ to, name, code, workshopId }) {
  let workshopTitle = workshopId;
  try {
    const workshopSnap = await db.collection("workshops").doc(workshopId).get();
    if (workshopSnap.exists) workshopTitle = workshopSnap.data().title || workshopId;
  } catch (err) {
    console.error("Nepodarilo sa načítať názov workshopu pre e-mail:", err);
  }

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
          code,
          workshop_title: workshopTitle,
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

  await db.collection("mail").add({
    to,
    code,
    workshopId,
    status,
    createdAt: FieldValue.serverTimestamp(),
  });
}
