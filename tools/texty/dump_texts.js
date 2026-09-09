// Vytiahne všetky editovateľné texty obrazoviek kurzu presne tou istou
// schémou, akú používa admin zóna — čo sa sem dostane, to sa dá aj vrátiť späť.
const fs = require("fs");
const vm = require("vm");

const sandbox = { window: {}, console };
vm.createContext(sandbox);
for (const f of ["public/data/course.js", "public/assets/course-schema.js"]) {
  vm.runInContext(fs.readFileSync(f, "utf8"), sandbox, { filename: f });
}

const slides = sandbox.window.COURSE_SLIDES;
const collect = sandbox.window.courseCollectFields;

const out = [];
for (const slide of slides) {
  const fields = collect(slide, slide.type) || [];
  for (const f of fields) {
    const value = typeof f.get() === "string" ? f.get() : "";
    if (!value.trim()) continue;
    out.push({
      slideId: slide.id,
      type: slide.type || "(part)",
      title: slide.title || slide.label || "",
      path: f.path,
      label: f.label || "",
      text: value,
      words: value.trim().split(/\s+/).length,
    });
  }
}

fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1), "utf8");

const byType = {};
out.forEach((r) => { byType[r.type] = (byType[r.type] || 0) + 1; });
console.log("obrazoviek:", slides.length);
console.log("textových polí:", out.length);
console.log("slov spolu:", out.reduce((s, r) => s + r.words, 0));
console.log("podľa typu:", JSON.stringify(byType, null, 1));
console.log("krátke (<=3 slová):", out.filter((r) => r.words <= 3).length);
