// Skopíruje aktuálnu verziu public/data/workshops.js do functions/data/,
// aby Cloud Functions vždy nasadzovali rovnaké otázky/odpovede kvízu, aké
// vidí účastník v prehliadači. Spúšťa sa automaticky pred každým nasadením
// funkcií — pozri "predeploy" v firebase.json.
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "..", "public", "data", "workshops.js");
const destDir = path.join(__dirname, "..", "data");
const dest = path.join(destDir, "workshops.js");

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log("Skopírované: " + src + " -> " + dest);
