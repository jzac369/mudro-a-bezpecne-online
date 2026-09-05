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

  // Cieľom je, aby sa dal upraviť KAŽDÝ text, ktorý účastník na obrazovke
  // uvidí — vrátane zadania („Vaša úloha“), vysvetlení pri jednotlivých
  // odpovediach, popisov pod fotografiami a poznámok. Mimo ostávajú len polia,
  // ktoré riadia správanie obrazovky (pozri poznámku vyššie).
  const TEXT_FIELDS = {
    intro: ["title", "lead", "body", "task"],
    tiles: ["title", "lead", "task", "tiles[].title", "tiles[].text"],
    flip: ["title", "lead", "task", "cards[].front", "cards[].back"],
    sort: ["title", "lead", "task", "tip", "items[].text", "items[].why",
      "baskets[].label", "baskets[].desc", "sideNote.title", "sideNote.items[].text", "note"],
    match: ["title", "lead", "task", "tip", "pairs[].left", "pairs[].right", "pairs[].why",
      "note", "gallery[].caption"],
    sequence: ["title", "lead", "task", "steps[]", "doneText", "note"],
    hotspot: ["title", "lead", "task", "spots[].title", "spots[].text",
      "evidenceImage.caption", "evidenceImage.appLabel"],
    choice: ["title", "lead", "task", "intro", "rounds[].weak", "rounds[].good", "rounds[].why",
      "rounds[].answerPreview", "note"],
    belief: ["title", "lead", "task", "tip", "items[].text", "note"],
    reveal: ["title", "lead", "task", "cells[].title", "cells[].text", "doneText", "note",
      "evidenceImage.caption"],
    revealgrid: ["title", "lead", "task", "cells[].title", "cells[].text", "note"],
    quickfire: ["title", "lead", "task", "tips[]", "questions[].short", "questions[].text",
      "questions[].why"],
    spot: ["title", "lead", "task", "message.from", "message.subject", "message.body",
      "clues[]", "footer", "evidenceImage.caption"],
    story: ["title", "lead", "task", "flags[]", "safeTip", "nodes.*.speaker", "nodes.*.text",
      "nodes.*.choiceHint", "nodes.*.choices[].text"],
    slider: ["title", "lead", "task", "adText", "sliderQuestion", "riskLevels[].label",
      "riskLevels[].why", "checklist[]", "checklistNote", "note", "evidenceImage.caption"],
    guess: ["title", "lead", "task", "rounds[].prompt", "rounds[].explain",
      "checklist[].title", "checklist[].text", "note"],
    rewrite: ["title", "lead", "task", "sentence[].text", "sentence[].why", "safeVersion", "takeaway"],
    install: ["title", "lead", "task",
      "appCard.name", "appCard.publisherLabel", "appCard.publisher", "appCard.publisherNote",
      "appCard.priceLabel", "appCard.price", "appCard.caption",
      "waysTitle", "ways[].device", "ways[].text", "ways[].action",
      "checksTitle", "checks[].title", "checks[].text",
      "plansTitle", "plans[].title", "plans[].text", "warning", "note"],
    printcard: ["title", "lead", "task", "rules[]"],
    diploma: ["title", "lead", "task", "quote"],
    info: ["title", "lead", "body", "task"],
  };

  const FIELD_HINTS = {
    "message.body": "Časti textu medzi dvojitými hranatými zátvorkami [[ako toto]] sú klikateľné varovné znaky. Zachovajte rovnaký počet dvojíc [[ ]], koľko je nižšie vysvetlení (Nájdené znaky).",
    "task": "Text v oranžovom boxe „Vaša úloha“ nad cvičením. Môžete použiť <strong>tučné písmo</strong>.",
    "items[].why": "Vysvetlenie, ktoré sa účastníkovi ukáže po zaradení tejto kartičky.",
    "pairs[].why": "Vysvetlenie, ktoré sa ukáže po správnom spojení tejto dvojice.",
    "sentence[].why": "Vysvetlenie, prečo tento údaj do otázky pre AI nepatrí.",
    "questions[].short": "Skrátený názov otázky v zozname po ľavej strane.",
    "rounds[].why": "Vysvetlenie, ktoré sa ukáže po odpovedi.",
    "riskLevels[].why": "Vysvetlenie k tejto úrovni rizika. Ktorá je správna, sa tu nemení.",
    "evidenceImage.caption": "Popis pod fotografiou skutočného príkladu.",
    "gallery[].caption": "Popis pod fotografiou.",
    "flags[]": "Krátke štítky „Na čo si dať pozor“ nad príbehom.",
    "tips[]": "Body v boxe „Na čo myslieť?“.",
    "clues[]": "Vysvetlenia varovných znakov. Musí ich byť rovnako veľa ako dvojíc [[ ]] v texte správy.",
  };

  // Popisy polí vo formulári. Bez nich by administrátor videl surové názvy
  // z kódu ("items #4 › why"), čo sa pri tridsiatich poliach na jednej
  // obrazovke číta veľmi ťažko.
  const LABELS = {
    title: "Nadpis", lead: "Úvodná veta", task: "Zadanie („Vaša úloha“)",
    body: "Text", note: "Poznámka („Zapamätajte si“)", tip: "Tip", intro: "Úvodný tip",
    text: "Text", why: "Vysvetlenie", label: "Názov", desc: "Popis", caption: "Popis",
    items: "Kartička", baskets: "Políčko", sideNote: "Bočný panel („Zapamätajte si“)",
    tiles: "Dlaždica",
    pairs: "Dvojica", left: "Vľavo", right: "Vpravo",
    cards: "Kartička", front: "Predná strana", back: "Zadná strana",
    steps: "Krok", doneText: "Text po dokončení",
    spots: "Bod na obrázku", evidenceImage: "Fotografia", appLabel: "Názov aplikácie v hlavičke",
    rounds: "Otázka", weak: "Slabšia možnosť", good: "Lepšia možnosť",
    answerPreview: "Ukážka odpovede AI",
    cells: "Políčko", questions: "Otázka", short: "Krátky názov v zozname",
    tips: "Bod v „Na čo myslieť?“",
    message: "Správa", from: "Odosielateľ", subject: "Predmet",
    clues: "Varovný znak", footer: "Text pod cvičením",
    nodes: "Krok príbehu", speaker: "Kto hovorí", choiceHint: "Otázka pri možnostiach",
    choices: "Možnosť", flags: "Štítok", safeTip: "Správny postup",
    adText: "Text reklamy", sliderQuestion: "Otázka",
    riskLevels: "Úroveň rizika", checklist: "Bod zoznamu", checklistNote: "Poznámka pod zoznamom",
    explain: "Vysvetlenie", prompt: "Text",
    sentence: "Časť vety", safeVersion: "Bezpečná verzia otázky", takeaway: "Zhrnutie",
    rules: "Pravidlo", quote: "Citát", gallery: "Fotografia",
    appCard: "Karta aplikácie", name: "Názov", publisher: "Vydavateľ",
    publisherLabel: "Popisok „Vydavateľ“", publisherNote: "Poznámka k vydavateľovi",
    priceLabel: "Popisok „Cena“", price: "Cena",
    waysTitle: "Nadpis „Kde ho nájdete“", ways: "Zariadenie", device: "Názov zariadenia",
    action: "Text tlačidla",
    checksTitle: "Nadpis „Tri kontroly“", checks: "Kontrola",
    plansTitle: "Nadpis „Zadarmo verzus platené“", plans: "Verzia", warning: "Varovanie",
  };

  // Vetvy príbehu majú vlastné názvy — kľúč "good" tu znamená niečo iné než
  // "good" pri type choice, preto sa prekladajú zvlášť.
  const NODE_LABELS = { a: "úvod", good: "správna voľba", bad: "nesprávna voľba" };

  function prettyLabel(parts, path) {
    const isNode = String(path).indexOf("nodes.") === 0;
    const isSideNote = String(path).indexOf("sideNote.") === 0;
    return parts.map(function (p, i) {
      if (isNode && i === 1 && NODE_LABELS[p]) return NODE_LABELS[p];
      const m = String(p).match(/^(.+) #(\d+)$/);
      // v bočnom paneli nejde o kartičky, ale o odrážky
      if (m) return (isSideNote && m[1] === "items" ? "Bod" : (LABELS[m[1]] || m[1])) + " " + m[2];
      return LABELS[p] || p;
    }).join(" › ");
  }

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
        out.push({ path, label: prettyLabel(labelParts, path), hint: FIELD_HINTS[path], get, set });
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
