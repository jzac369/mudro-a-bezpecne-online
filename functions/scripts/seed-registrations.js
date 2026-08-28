// Jednorazový skript: vytvorí 20 testovacích registrácií v Firestore
// Spustenie: cd functions && node scripts/seed-registrations.js
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
initializeApp({ projectId: "mudro-a-bezpecne-online" });
const db = getFirestore();

const FIRST_NAMES = ["Mária", "Jana", "Anna", "Eva", "Zuzana", "Katarína", "Monika", "Petra", "Lucia", "Helena",
  "Ján", "Peter", "Miroslav", "Vladimír", "Štefan", "Michal", "Rastislav", "Dušan", "Ladislav", "Rudolf"];
const LAST_NAMES = ["Novák", "Kováč", "Horváth", "Varga", "Tóth", "Szabó", "Lukáč", "Blaho", "Čierny", "Zelený"];
const WORKSHOPS = ["bezpecne-financie", "zaciname-s-ai"];
const STATUSES = ["paid", "paid", "paid", "paid", "pending", "pending"];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rndCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return Timestamp.fromDate(d);
}

async function main() {
  const batch = db.batch();
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const firstName = FIRST_NAMES[i];
    const lastName = rnd(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const email = `test.${firstName.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}.${i + 1}@example.com`;
    const workshopId = WORKSHOPS[i % 2];
    const status = rnd(STATUSES);
    const createdDaysAgo = rndInt(0, 30);
    const createdAt = daysAgo(createdDaysAgo);
    const code = rndCode();

    // Order dokument
    const orderId = `test_order_${i + 1}_${Date.now()}`;
    const orderRef = db.collection("orders").doc(orderId);
    const orderData = {
      name,
      email,
      workshopId,
      workshopTitle: workshopId === "bezpecne-financie"
        ? "Ako nenaletieť podvodníkom"
        : "Začíname s umelou inteligenciou",
      status,
      createdAt,
      amount: 19,
    };

    if (status === "paid") {
      orderData.paidAt = daysAgo(createdDaysAgo - rndInt(0, 2));
      orderData.codeIssuedAt = orderData.paidAt;

      // accessCode dokument
      const codeRef = db.collection("accessCodes").doc(code);
      const codeData = {
        email,
        name,
        workshopId,
        orderId,
        createdAt: orderData.codeIssuedAt,
        usedCount: rndInt(0, 5),
      };

      // Simuluj niektorých ako dokončených (quiz výsledky)
      const completed = Math.random() > 0.45;
      if (completed) {
        codeData.quizPassed = true;
        codeData.quizScore = rndInt(14, 20);
        codeData.completedAt = daysAgo(rndInt(0, createdDaysAgo));
        // Spätná väzba
        if (Math.random() > 0.4) {
          const feedbackRef = db.collection("feedback").doc(`${orderId}_fb`);
          batch.set(feedbackRef, {
            codeId: code,
            workshopId,
            name,
            rating: rndInt(4, 5),
            comment: rnd([
              "Veľmi užitočný workshop, naučil som sa veľa nových vecí.",
              "Výborne vysvetlené, odporúčam každému seniorovi.",
              "Konečne rozumiem ako funguje AI. Ďakujem!",
              "Praktické cvičenia boli skvelé.",
              "Budem odporúčať priateľom a rodine.",
              "Materiály sú prehľadné a zrozumiteľné.",
              null,
            ]),
            createdAt: codeData.completedAt,
          });
        }
      }

      batch.set(codeRef, codeData);
      orderData.code = code;
    }

    batch.set(orderRef, orderData);
  }

  await batch.commit();
  console.log("Hotovo! Vytvorených 20 testovacích registrácií v Firestore.");
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
