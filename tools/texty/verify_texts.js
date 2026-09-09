// Overí, že v kurze naozaj sedí každý schválený text — a to na tej istej
// ceste, akú používa admin zóna, nie len hľadaním reťazca v súbore.
const fs = require("fs");
const vm = require("vm");

const sandbox = { window: {}, console };
vm.createContext(sandbox);
for (const f of ["public/data/course.js", "public/assets/course-schema.js"]) {
  vm.runInContext(fs.readFileSync(f, "utf8"), sandbox, { filename: f });
}
const slides = sandbox.window.COURSE_SLIDES;
const collect = sandbox.window.courseCollectFields;

const changes = JSON.parse(fs.readFileSync(process.argv[2], "utf8")).filter((c) => c.new !== c.orig);

const values = new Map();          // "id|path" -> [hodnoty]
for (const slide of slides) {
  for (const f of collect(slide, slide.type) || []) {
    const key = slide.id + "|" + f.path;
    if (!values.has(key)) values.set(key, []);
    values.get(key).push(f.get());
  }
}

let ok = 0;
const bad = [];
for (const c of changes) {
  const list = values.get(c.slideId + "|" + c.path) || [];
  if (list.includes(c.new)) ok++;
  else bad.push({ row: c.row, slide: c.slideId, path: c.path, expected: c.new.slice(0, 50) });
}

// Zostal niekde ešte starý text?
const stillOld = changes.filter((c) => (values.get(c.slideId + "|" + c.path) || []).includes(c.orig));

console.log("schválených zmien:", changes.length);
console.log("nájdených v kurze:", ok);
console.log("nenájdených:", bad.length);
bad.slice(0, 10).forEach((b) => console.log("  ", JSON.stringify(b)));
console.log("kde ešte figuruje pôvodné znenie:", stillOld.length);
stillOld.slice(0, 5).forEach((c) => console.log("  riadok", c.row, c.path));
process.exit(bad.length === 0 ? 0 : 1);
