// Jednorazový skript: vytvorí (alebo nájde) admin používateľa a nastaví mu
// custom claim admin:true. Spúšťa sa lokálne, nikdy sa nenasadzuje.
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
initializeApp();
const auth = getAuth();

async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error("Použitie: node scripts/set-admin.js <email> <heslo>");
    process.exit(1);
  }
  let user;
  try {
    user = await auth.getUserByEmail(email);
    console.log("Používateľ už existuje:", user.uid);
  } catch (e) {
    user = await auth.createUser({ email, password });
    console.log("Vytvorený nový používateľ:", user.uid);
  }
  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log("Nastavený admin claim pre", email);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
