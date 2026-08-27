// Schéma textovo editovateľných polí pre každý typ obrazovky kurzu +
// generický "path walker", ktorý vie z objektu obrazovky vytiahnuť/zapísať
// hodnoty na danej ceste. Používa ho jednak admin zóna (formulár na úpravu
// textu), jednak workshop.html (aplikovanie uložených úprav pred vykreslením).
//
// Cesta je reťazec segmentov oddelených bodkou:
//   "title"                    — priamo pole objektu
//   "message.body"             — vnorený objekt
//   "tiles[].title"            — pre každý prvok poľa "tiles" pole "title"
//   "steps[]"                  — pole reťazcov, každý prvok je list sám o sebe
//   "nodes.*.choices[].text"   — pre každý kľúč objektu "nodes", pre každý
//                                 prvok poľa "choices" pole "text"
// Zámerne NIKDY neobsahuje herné/štrukturálne polia (type, id, part, basket,
// answer, to, x, y, sensitive, end...) — tie sa cez tento editor meniť nedajú,
// aby administrátor omylom nerozbil funkčnosť obrazovky.
(function () {
  "use strict";

  const TEXT_FIELDS = {
    intro: ["title", "lead", "body"],
    tiles: ["title", "lead", "tiles[].title", "tiles[].text"],
    flip: ["title", "lead", "cards[].front", "cards[].back"],
    sort: ["title", "lead", "items[].text", "baskets[].label", "note"],
    match: ["title", "lead", "pairs[].left", "pairs[].right", "note"],
    sequence: ["title", "lead", "steps[]", "note"],
    hotspot: ["title", "lead", "spots[].title", "spots[].text"],
    choice: ["title", "lead", "intro", "rounds[].weak", "rounds[].good", "rounds[].why", "rounds[].answerPreview", "note"],
    belief: ["title", "lead", "items[].text", "note"],
    reveal: ["title", "lead", "cells[].title", "cells[].text", "note"],
    revealgrid: ["title", "lead", "cells[].title", "cells[].text"],
    quickfire: ["title", "lead", "questions[].text"],
    spot: ["title", "lead", "message.from", "message.subject", "message.body", "clues[]", "footer"],
    story: ["title", "lead", "nodes.*.speaker", "nodes.*.text", "nodes.*.choices[].text"],
    slider: ["title", "lead", "sliderQuestion", "sliderHint", "checklist[]", "note"],
    guess: ["title", "lead", "rounds[].prompt", "checklist[].title", "checklist[].text", "note"],
    rewrite: ["title", "lead", "sentence[].text", "safeVersion"],
    printcard: ["title", "lead", "rules[]"],
    diploma: ["title", "lead", "quote"],
    info: ["title", "lead", "body"],
  };

  const FIELD_HINTS = {
    "message.body": "Časti textu medzi dvojitými hranatými zátvorkami [[ako toto]] sú klikateľné varovné znaky. Zachovajte rovnaký počet dvojíc [[ ]], koľko je nižšie vysvetlení (Nájdené znaky).",
  };

  function walkPath(root, path, visit) {
    const segs = path.split(".");
    function rec(node, idx, labelParts) {
      if (node === undefined || node === null) return;
      const seg = segs[idx];
      const isLast = idx === segs.length - 1;
      const arrMatch = seg.match(/^(\w+)\[\]$/);
      if (arrMatch) {
        const key = arrMatch[1];
        const arr = node[key];
        if (!Array.isArray(arr)) return;
        arr.forEach((item, i) => {
          if (isLast) {
            visit(() => arr[i], (v) => { arr[i] = v; }, labelParts.concat(key + " #" + (i + 1)));
          } else {
            rec(item, idx + 1, labelParts.concat(key + " #" + (i + 1)));
          }
        });
      } else if (seg === "*") {
        Object.keys(node).forEach((k) => {
          if (isLast) {
            visit(() => node[k], (v) => { node[k] = v; }, labelParts.concat(k));
          } else {
            rec(node[k], idx + 1, labelParts.concat(k));
          }
        });
      } else {
        if (isLast) {
          if (node[seg] !== undefined) visit(() => node[seg], (v) => { node[seg] = v; }, labelParts.concat(seg));
        } else {
          rec(node[seg], idx + 1, labelParts.concat(seg));
        }
      }
    }
    rec(root, 0, []);
    return;
  }

  // Vráti zoznam { path, label, hint, get(), set(v) } pre daný typ obrazovky.
  function collectFields(slideObj, type) {
    const paths = TEXT_FIELDS[type] || [];
    const out = [];
    paths.forEach((path) => {
      walkPath(slideObj, path, (get, set, labelParts) => {
        out.push({ path, label: labelParts.join(" › "), hint: FIELD_HINTS[path], get, set });
      });
    });
    return out;
  }

  // Aplikuje uložené texty z overrideDoc na target (mutuje target).
  // Páruje hodnoty podľa poradia na tej istej ceste — bezpečné aj keď sa
  // medzičasom zmenila štruktúra v kóde (staršie uložené texty sa jednoducho
  // nepoužijú tam, kde už nesedia).
  function applyOverride(target, overrideDoc, type) {
    if (!overrideDoc) return;
    const paths = TEXT_FIELDS[type] || [];
    paths.forEach((path) => {
      const ovValues = [];
      walkPath(overrideDoc, path, (get) => ovValues.push(get()));
      let i = 0;
      walkPath(target, path, (get, set) => {
        const v = ovValues[i];
        if (typeof v === "string" && v.trim() !== "") set(v);
        i++;
      });
    });
  }

  function cloneSlide(slide) {
    return JSON.parse(JSON.stringify(slide));
  }

  window.COURSE_TEXT_FIELDS = TEXT_FIELDS;
  window.courseWalkPath = walkPath;
  window.courseCollectFields = collectFields;
  window.courseApplyOverride = applyOverride;
  window.courseCloneSlide = cloneSlide;
})();
