// Praktické cvičenia (krok 4 kurzu).
//
// Vykresľuje prehľad cvičení ako dlaždice a po kliknutí otvorí jedno
// cvičenie. Každé sa dá vyplniť na obrazovke a stiahnuť ako pracovný
// list vo formáte PDF.
//
// Použitie:
//   window.initExercises(container, {
//     exercises, done: ["rozpocet"], onDone: function (ids) {}
//   });

(function () {
  "use strict";

  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var ICONS = {
    wallet: "<path d='M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'/><path d='M16 12h4'/><path d='M3 9h17'/>",
    search: "<circle cx='11' cy='11' r='7'/><path d='m20 20-3.5-3.5'/>",
    message: "<path d='M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.6 8.6 0 0 1-3.7-.8L4 20l1-4.6a8.3 8.3 0 0 1-1-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z'/>",
    robot: "<rect x='4' y='8' width='16' height='12' rx='3'/><path d='M12 8V4M9 4h6'/><circle cx='9' cy='14' r='1.2' fill='currentColor' stroke='none'/><circle cx='15' cy='14' r='1.2' fill='currentColor' stroke='none'/>",
    shield: "<path d='M12 3l8 4v5c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V7l8-4Z'/><path d='M9.5 12l2 2 3.5-3.5'/>",
    phone: "<path d='M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z'/>",
    book: "<path d='M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2Z'/><path d='M8 7h7M8 11h5'/>",
  };

  function icon(name, cls) {
    return "<svg class='" + (cls || "") + "' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8'>" +
      (ICONS[name] || ICONS.shield) + "</svg>";
  }

  var CHECK = "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.6'><path d='M4 12l5 5L20 6'/></svg>";
  var CROSS = "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.6'><path d='M6 6l12 12M18 6 6 18'/></svg>";

  function Exercises(root, opts) {
    this.root = root;
    this.opts = opts || {};
    this.list = this.opts.exercises || window.COURSE_EXERCISES || [];
    this.done = new Set(this.opts.done || []);
    this.store = this.opts.store || null;
    // Rozpracované odpovede držíme aj v pamäti prehliadača, aby ich
    // nechcené obnovenie stránky nezmazalo.
    this.answers = (this.store && this.store.get("cvicenia", null)) || {};
  }

  // Uloží rozpracované odpovede. Volá sa pri každej zmene v políčkach,
  // preto zápis trochu oneskoríme — pri písaní by inak bol pri každom písmene.
  Exercises.prototype.persist = function () {
    var self = this;
    if (!this.store) return;
    clearTimeout(this._persistTimer);
    this._persistTimer = setTimeout(function () {
      self.store.set("cvicenia", self.answers);
    }, 350);
  };

  Exercises.prototype.markDone = function (id) {
    if (this.done.has(id)) return;
    this.done.add(id);
    if (this.opts.onDone) this.opts.onDone(Array.from(this.done));
  };

  // ---------- Prehľad s dlaždicami ----------

  Exercises.prototype.renderOverview = function () {
    var self = this;
    this.root.innerHTML = "";

    var head = el("div", "ex-overview-head");
    head.appendChild(el("h2", null, "Praktické cvičenia"));
    head.appendChild(el("p", "ex-overview-lead",
      this.list.length + " cvičení, ktoré si môžete urobiť priamo tu na obrazovke — alebo si ich stiahnuť ako pracovný list vo formáte PDF a vyplniť perom."));
    this.root.appendChild(head);

    var progress = el("div", "ex-progress");
    var pct = Math.round((this.done.size / this.list.length) * 100);
    progress.innerHTML =
      "<div class='ex-progress-bar'><div class='ex-progress-fill' style='width:" + pct + "%'></div></div>" +
      "<span class='ex-progress-label'>" +
      (this.done.size >= this.list.length
        ? "Hotovo — prešli ste všetkých " + this.list.length + " cvičení."
        : "Hotové <strong>" + this.done.size + "</strong> z " + this.list.length) +
      "</span>";
    this.root.appendChild(progress);

    var grid = el("div", "ex-grid");
    this.list.forEach(function (ex, i) {
      var isDone = self.done.has(ex.id);
      var tile = el("button", "ex-tile" + (isDone ? " is-done" : ""));
      tile.type = "button";
      tile.innerHTML =
        "<span class='ex-tile-top'>" +
        "<span class='ex-tile-icon'>" + icon(ex.icon) + "</span>" +
        "<span class='ex-tile-num'>" + (i + 1) + "</span>" +
        (isDone ? "<span class='ex-tile-check'>" + CHECK + "</span>" : "") +
        "</span>" +
        "<span class='ex-tile-title'>" + esc(ex.title) + "</span>" +
        "<span class='ex-tile-short'>" + esc(ex.short) + "</span>" +
        "<span class='ex-tile-foot'>" +
        "<span class='ex-tile-time'>" + esc(ex.time || "") + "</span>" +
        "<span class='ex-tile-go'>" + (isDone ? "Otvoriť znova" : "Začať") + " →</span>" +
        "</span>";
      tile.addEventListener("click", function () { self.openExercise(ex.id); });
      grid.appendChild(tile);
    });
    this.root.appendChild(grid);
  };

  // ---------- Jedno cvičenie ----------

  Exercises.prototype.openExercise = function (id) {
    var self = this;
    var ex = this.list.find(function (x) { return x.id === id; });
    if (!ex) return;
    var index = this.list.indexOf(ex);

    this.root.innerHTML = "";

    var back = el("button", "ex-back", "← Späť na prehľad cvičení");
    back.type = "button";
    back.addEventListener("click", function () {
      self.renderOverview();
      self.root.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    this.root.appendChild(back);

    var card = el("div", "ex-detail");
    card.appendChild(el("p", "ex-detail-kicker",
      icon(ex.icon, "ex-detail-kicker-icon") + "Cvičenie " + (index + 1) + " z " + this.list.length +
      (ex.time ? " · " + esc(ex.time) : "")));
    card.appendChild(el("h2", "ex-detail-title", esc(ex.title)));
    if (ex.intro) card.appendChild(el("p", "ex-detail-intro", esc(ex.intro)));
    if (ex.task) {
      card.appendChild(el("div", "course-task",
        "<span class='course-task-icon'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M9 11l3 3 8-8'/><path d='M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9'/></svg></span>" +
        "<div><span class='course-task-label'>Vaša úloha</span><p>" + esc(ex.task) + "</p></div>"));
    }

    var bodyWrap = el("div", "ex-body");
    card.appendChild(bodyWrap);
    this.root.appendChild(card);

    var renderer = RENDERERS[ex.type];
    var api = renderer ? renderer(ex, bodyWrap, this) : null;

    if (ex.note) card.appendChild(el("div", "course-note", "<strong>Zapamätajte si:</strong> " + esc(ex.note)));

    // Pätička s tlačidlami
    var foot = el("div", "ex-foot");

    var pdfBtn = el("button", "btn btn-secondary ex-pdf-btn",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 3v12'/><path d='m7 12 5 5 5-5'/><path d='M5 21h14'/></svg>" +
      "Stiahnuť ako PDF");
    pdfBtn.type = "button";
    pdfBtn.addEventListener("click", function () {
      self.downloadPdf(ex, api, pdfBtn);
    });
    foot.appendChild(pdfBtn);

    var doneBtn = el("button", "btn btn-primary", self.done.has(ex.id) ? "Hotové ✓" : "Označiť ako hotové");
    doneBtn.type = "button";
    doneBtn.addEventListener("click", function () {
      self.markDone(ex.id);
      doneBtn.textContent = "Hotové ✓";
      doneBtn.disabled = true;
      var next = self.list[index + 1];
      if (next) {
        var nextBtn = el("button", "btn btn-secondary", "Ďalšie cvičenie →");
        nextBtn.type = "button";
        nextBtn.addEventListener("click", function () {
          self.openExercise(next.id);
          self.root.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        foot.appendChild(nextBtn);
      } else {
        foot.appendChild(el("span", "ex-all-done", "Prešli ste všetky cvičenia."));
      }
    });
    foot.appendChild(doneBtn);
    this.root.appendChild(foot);
  };

  // ---------- Uloženie pracovného listu do PDF ----------

  Exercises.prototype.downloadPdf = function (ex, api, btn) {
    var original = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Pripravujem PDF…";

    var spec = (api && api.worksheet) ? api.worksheet() : { title: ex.title, blocks: [] };
    spec.footer = "Cvičenie " + (this.list.indexOf(ex) + 1) + " z " + this.list.length;

    Promise.resolve()
      .then(function () { return window.renderWorksheet(spec); })
      .then(function (dataUrl) {
        return window.savePdfFromImage(dataUrl, {
          filename: "cvicenie-" + ex.id + ".pdf",
          orientation: "portrait",
        });
      })
      .catch(function (err) {
        console.error("Pracovný list sa nepodarilo uložiť:", err);
        alert("PDF sa nepodarilo vytvoriť. Skontrolujte prosím pripojenie na internet a skúste to znova.");
      })
      .then(function () {
        btn.disabled = false;
        btn.innerHTML = original;
      });
  };

  // ---------- Jednotlivé typy cvičení ----------

  var RENDERERS = {};

  // 0 · Slovníček pojmov
  // Sedemnásť pojmov naraz je priveľa, preto ich prechádzame po častiach —
  // vždy je na obrazovke len jedna. Kartičky sa otáčajú, nedá sa nimi nič
  // pokaziť; overenie na konci je krátke a dá sa preskočiť.
  RENDERERS.glossary = function (ex, host, app) {
    var state = app.answers[ex.id] || (app.answers[ex.id] = { part: 0, seen: {} });
    var parts = ex.parts || [];
    var stage = el("div", "gloss-stage");
    host.appendChild(stage);

    function partNav(activeIndex) {
      var nav = el("div", "gloss-nav");
      parts.forEach(function (p, i) {
        var b = el("button", "gloss-nav-item" +
          (i === activeIndex ? " active" : "") +
          (state.seen[i] ? " seen" : ""));
        b.type = "button";
        b.innerHTML = "<span class='gloss-nav-num'>" + (i + 1) + "</span><span>" + esc(p.title) + "</span>";
        b.addEventListener("click", function () { showPart(i); });
        nav.appendChild(b);
      });
      return nav;
    }

    function showPart(pi) {
      state.part = pi;
      app.persist();
      var part = parts[pi];
      stage.innerHTML = "";
      stage.appendChild(partNav(pi));

      var head = el("div", "gloss-part-head");
      head.innerHTML =
        "<p class='gloss-part-eyebrow'>Časť " + (pi + 1) + " z " + parts.length + " · " + part.terms.length + " pojmov</p>" +
        "<h3>" + esc(part.title) + "</h3>" +
        (part.intro ? "<p class='gloss-part-intro'>" + esc(part.intro) + "</p>" : "");
      stage.appendChild(head);

      var flipped = {};
      var grid = el("div", "course-flip-grid gloss-grid");
      part.terms.forEach(function (t) {
        var outer = el("div", "course-flip");
        var inner = el("div", "course-flip-inner");
        inner.appendChild(el("div", "course-flip-face course-flip-front",
          "<h3>" + esc(t.term) + "</h3>" +
          (t.read ? "<span class='gloss-read'>" + esc(t.read) + "</span>" : "") +
          "<span class='course-flip-hint'>Kliknite a otočí sa</span>"));
        inner.appendChild(el("div", "course-flip-face course-flip-back",
          "<p class='gloss-back-term'>" + esc(t.term) + "</p><p>" + esc(t.text) + "</p>"));
        outer.appendChild(inner);
        outer.addEventListener("click", function () {
          outer.classList.toggle("flipped");
          if (outer.classList.contains("flipped") && !flipped[t.term]) {
            flipped[t.term] = true;
            setCount();
          }
        });
        grid.appendChild(outer);
      });
      stage.appendChild(grid);

      var count = el("p", "gloss-count");
      stage.appendChild(count);
      function setCount() {
        var n = Object.keys(flipped).length;
        var all = part.terms.length;
        count.innerHTML = n >= all
          ? "Prezreli ste si všetky pojmy z tejto časti."
          : "Otočené <strong>" + n + "</strong> z " + all;
        count.classList.toggle("complete", n >= all);
        if (n >= all) { state.seen[pi] = true; app.persist(); }
      }
      setCount();

      var foot = el("div", "gloss-foot");
      if (pi > 0) {
        var prev = el("button", "btn btn-secondary", "← Predchádzajúca časť");
        prev.type = "button";
        prev.addEventListener("click", function () { showPart(pi - 1); scrollTop(); });
        foot.appendChild(prev);
      }
      var next = el("button", "btn btn-primary",
        pi + 1 < parts.length ? "Pokračovať na " + (pi + 2) + ". časť →" : "Krátke overenie na záver →");
      next.type = "button";
      next.addEventListener("click", function () {
        state.seen[pi] = true;
        app.persist();
        if (pi + 1 < parts.length) showPart(pi + 1); else showCheck();
        scrollTop();
      });
      foot.appendChild(next);
      stage.appendChild(foot);
    }

    function scrollTop() {
      if (stage.scrollIntoView) stage.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function showCheck() {
      var quiz = ex.check || [];
      stage.innerHTML = "";
      stage.appendChild(partNav(-1));

      var head = el("div", "gloss-part-head");
      head.innerHTML =
        "<p class='gloss-part-eyebrow'>Na záver · " + quiz.length + " otázky</p>" +
        "<h3>Krátke overenie</h3>" +
        "<p class='gloss-part-intro'>Nič sa nedá pokaziť — je to len na overenie, či slová sedia. Ak si nie ste istí, pokojne sa vráťte na kartičky vyššie.</p>";
      stage.appendChild(head);

      var correct = 0, answered = 0;
      quiz.forEach(function (q, qi) {
        var box = el("div", "gloss-q");
        box.appendChild(el("p", "gloss-q-num", "Otázka " + (qi + 1)));
        box.appendChild(el("p", "gloss-q-text", esc(q.question)));
        var opts = el("div", "gloss-q-opts");
        var buttons = [];
        var result = el("div", "gloss-q-result");
        q.options.forEach(function (opt, oi) {
          var b = el("button", "gloss-q-opt", "<span class='gloss-q-opt-icon'></span><span>" + esc(opt) + "</span>");
          b.type = "button";
          b.addEventListener("click", function () {
            if (b.disabled) return;
            buttons.forEach(function (x) { x.disabled = true; });
            var ok = oi === q.correct;
            if (ok) correct++;
            answered++;
            b.classList.add(ok ? "correct" : "incorrect");
            b.querySelector(".gloss-q-opt-icon").innerHTML = ok ? CHECK : CROSS;
            if (!ok) {
              var right = buttons[q.correct];
              right.classList.add("correct", "is-answer");
              right.querySelector(".gloss-q-opt-icon").innerHTML = CHECK;
            }
            result.className = "gloss-q-result show " + (ok ? "ok" : "warn");
            result.innerHTML = "<strong>" + (ok ? "Správne." : "Správna je zvýraznená možnosť.") + "</strong> " + esc(q.why);
            if (answered >= quiz.length) showSummary();
          });
          buttons.push(b);
          opts.appendChild(b);
        });
        box.appendChild(opts);
        box.appendChild(result);
        stage.appendChild(box);
      });

      var summary = el("div", "gloss-summary");
      stage.appendChild(summary);

      function showSummary() {
        summary.innerHTML =
          "<p class='gloss-summary-score'>Správne <strong>" + correct + " z " + quiz.length + "</strong>.</p>" +
          "<p>Celý slovníček máte nižšie — a nájdete ho aj v brožúrke. Nemusíte ho vedieť naspamäť, stačí vedieť, kde ho hľadať.</p>";
        summary.classList.add("show");
        summary.appendChild(fullList());
      }

      var back = el("button", "btn btn-secondary", "← Späť na kartičky");
      back.type = "button";
      back.style.marginTop = "1.4rem";
      back.addEventListener("click", function () { showPart(parts.length - 1); scrollTop(); });
      stage.appendChild(back);
    }

    // Celý slovníček pokope — slúži ako referencia, ku ktorej sa dá vrátiť.
    function fullList() {
      var wrap = el("div", "gloss-full");
      wrap.appendChild(el("h4", "gloss-full-title", "Celý slovníček pokope"));
      parts.forEach(function (p) {
        wrap.appendChild(el("p", "gloss-full-group", esc(p.title)));
        var dl = el("dl", "gloss-full-list");
        p.terms.forEach(function (t) {
          dl.appendChild(el("dt", null, esc(t.term) + (t.read ? " <span class='gloss-read-inline'>(" + esc(t.read) + ")</span>" : "")));
          dl.appendChild(el("dd", null, esc(t.text)));
        });
        wrap.appendChild(dl);
      });
      return wrap;
    }

    showPart(Math.min(state.part || 0, parts.length - 1));

    return {
      worksheet: function () {
        return {
          title: ex.title,
          intro: "Vytlačte si a nechajte pri počítači. Keď na niektoré slovo znova narazíte, budete ho mať poruke.",
          blocks: [
            { type: "glossary", groups: parts.map(function (p) {
              return { title: p.title, terms: p.terms.map(function (t) {
                return { term: t.term + (t.read ? " (" + t.read + ")" : ""), text: t.text };
              }) };
            }) },
            { type: "note", text: ex.worksheetNote || ex.note },
          ],
        };
      },
    };
  };

  // 1 · Domáci rozpočet
  RENDERERS.budget = function (ex, host, app) {
    var saved = app.answers[ex.id] || (app.answers[ex.id] = { income: {}, expense: {} });

    function group(title, labels, bucket) {
      var wrap = el("div", "ex-money-group");
      wrap.appendChild(el("h3", "ex-money-title", esc(title)));
      labels.forEach(function (label, i) {
        var row = el("label", "ex-money-row");
        row.appendChild(el("span", "ex-money-label", esc(label)));
        var inp = el("input", "ex-money-input");
        inp.type = "number";
        inp.min = "0";
        inp.step = "1";
        inp.inputMode = "numeric";
        inp.placeholder = "0";
        inp.value = saved[bucket][i] != null ? saved[bucket][i] : "";
        inp.addEventListener("input", function () {
          saved[bucket][i] = inp.value;
          recount();
          app.persist();
        });
        row.appendChild(inp);
        row.appendChild(el("span", "ex-money-unit", "€"));
        wrap.appendChild(row);
      });
      return wrap;
    }

    host.appendChild(group("Mesačné príjmy", ex.incomeLabels, "income"));
    host.appendChild(group("Mesačné výdavky", ex.expenseLabels, "expense"));

    var result = el("div", "ex-budget-result");
    host.appendChild(result);

    var promptBox = el("div", "ex-prompt-box");
    promptBox.style.display = "none";
    host.appendChild(promptBox);

    function sum(bucket, count) {
      var t = 0;
      for (var i = 0; i < count; i++) t += Number(saved[bucket][i]) || 0;
      return t;
    }

    function recount() {
      var income = sum("income", ex.incomeLabels.length);
      var expense = sum("expense", ex.expenseLabels.length);
      var rest = income - expense;
      saved.income_total = income;
      saved.expense_total = expense;
      app.persist();

      if (!income && !expense) { result.innerHTML = ""; promptBox.style.display = "none"; return; }

      var tone = rest >= 0 ? "ok" : "warn";
      result.className = "ex-budget-result show " + tone;
      result.innerHTML =
        "<div class='ex-budget-row'><span>Príjmy spolu</span><strong>" + income + " €</strong></div>" +
        "<div class='ex-budget-row'><span>Výdavky spolu</span><strong>" + expense + " €</strong></div>" +
        "<div class='ex-budget-row total'><span>Zostatok na konci mesiaca</span><strong>" + rest + " €</strong></div>" +
        (rest >= 0
          ? "<p class='ex-budget-note'>Rozpočet je vyrovnaný. Aj malá suma odložená každý mesiac sa časom nazbiera na peknú rezervu.</p>"
          : "<p class='ex-budget-note'>Výdavky prevyšujú príjmy. Práve s týmto vám vie AI pomôcť — nižšie máte pripravenú otázku.</p>");

      var text = ex.promptTemplate
        .replace("{prijem}", String(income))
        .replace("{vydavky}", String(expense));
      promptBox.style.display = "block";
      promptBox.innerHTML = "";
      promptBox.appendChild(promptBlock(text, ex.note));
    }

    recount();

    return {
      worksheet: function () {
        return {
          title: ex.title,
          intro: ex.task,
          blocks: [
            { type: "table", caption: "MESAČNÉ PRÍJMY", rows: ex.incomeLabels.map(function (l, i) {
              return { label: l, value: saved.income[i] ? saved.income[i] + " €" : "" }; }) },
            { type: "table", caption: "MESAČNÉ VÝDAVKY", rows: ex.expenseLabels.map(function (l, i) {
              return { label: l, value: saved.expense[i] ? saved.expense[i] + " €" : "" }; }) },
            { type: "table", rows: [{
              label: "Zostatok na konci mesiaca",
              value: (saved.income_total || saved.expense_total)
                ? ((saved.income_total || 0) - (saved.expense_total || 0)) + " €" : "" }] },
            { type: "promptBox", label: "OTÁZKA PRE AI", text: ex.promptTemplate
                .replace("{prijem}", saved.income_total != null ? String(saved.income_total) : "…")
                .replace("{vydavky}", saved.expense_total != null ? String(saved.expense_total) : "…") },
            { type: "note", text: ex.worksheetNote || ex.note },
            { type: "lines", label: "Moje poznámky", count: 3 },
          ],
        };
      },
    };
  };

  // Spoločný blok s hotovou otázkou pre AI + tlačidlo na skopírovanie.
  function promptBlock(text, note) {
    var box = el("div", "ex-prompt");
    box.appendChild(el("p", "ex-prompt-label",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.6 8.6 0 0 1-3.7-.8L4 20l1-4.6a8.3 8.3 0 0 1-1-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z'/></svg>" +
      "Vaša hotová otázka pre AI"));
    box.appendChild(el("p", "ex-prompt-text", esc(text)));

    var copyBtn = el("button", "btn btn-secondary ex-copy-btn", "Skopírovať otázku");
    copyBtn.type = "button";
    copyBtn.addEventListener("click", function () {
      var done = function () {
        copyBtn.textContent = "Skopírované ✓";
        setTimeout(function () { copyBtn.textContent = "Skopírovať otázku"; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {
          copyBtn.textContent = "Skopírujte text rukou";
        }
        document.body.removeChild(ta);
      }
    });
    box.appendChild(copyBtn);
    if (note) box.appendChild(el("p", "ex-prompt-note", esc(note)));
    return box;
  }

  // 2 · Lov na podvody
  RENDERERS["scam-hunt"] = function (ex, host, app) {
    var answered = 0;
    var progress = el("p", "ex-hint-pill", "Posúdené <strong>0</strong> z " + ex.messages.length);

    ex.messages.forEach(function (m, i) {
      var box = el("div", "ex-msg");
      box.appendChild(el("p", "ex-msg-label", esc(m.label)));
      box.appendChild(el("blockquote", "ex-msg-text", esc(m.text)));

      var opts = el("div", "ex-msg-opts");
      var scam = el("button", "ex-msg-opt", "Toto je podvod");
      var okBtn = el("button", "ex-msg-opt", "Toto je v poriadku");
      [scam, okBtn].forEach(function (b) { b.type = "button"; });
      var result = el("div", "ex-msg-result");

      function lock(saidScam) {
        scam.disabled = true; okBtn.disabled = true;
        var correct = saidScam === m.isScam;
        var chosen = saidScam ? scam : okBtn;
        chosen.classList.add(correct ? "correct" : "incorrect");
        chosen.insertAdjacentHTML("afterbegin",
          "<span class='ex-msg-opt-icon'>" + (correct ? CHECK : CROSS) + "</span>");
        result.className = "ex-msg-result show " + (correct ? "ok" : "warn");
        result.innerHTML = "<strong>" +
          (correct ? "Správne." : (m.isScam ? "Pozor — toto je podvod." : "Táto správa je v poriadku.")) +
          "</strong> " + esc(m.why);
        answered++;
        progress.innerHTML = answered >= ex.messages.length
          ? "Hotovo — posúdili ste všetky " + ex.messages.length + " správy."
          : "Posúdené <strong>" + answered + "</strong> z " + ex.messages.length;
      }
      scam.addEventListener("click", function () { lock(true); });
      okBtn.addEventListener("click", function () { lock(false); });

      opts.appendChild(scam);
      opts.appendChild(okBtn);
      box.appendChild(opts);
      box.appendChild(result);
      host.appendChild(box);
    });

    host.appendChild(progress);

    return {
      worksheet: function () {
        return {
          title: ex.title,
          intro: ex.task,
          blocks: [
            { type: "messages", items: ex.messages.map(function (m) {
              return { label: m.label, text: m.text }; }),
              answerLabel: "Je to podvod? Podľa čoho to spoznám?" },
            { type: "note", text: ex.note },
          ],
        };
      },
    };
  };

  // 3 · Poskladajte si otázku pre AI
  RENDERERS["prompt-builder"] = function (ex, host, app) {
    var state = app.answers[ex.id] || (app.answers[ex.id] = { situation: ex.situations[0].id, values: {} });

    var picker = el("div", "ex-situations");
    var fieldsWrap = el("div", "ex-fields");
    var outWrap = el("div", "ex-prompt-box");
    host.appendChild(picker);
    host.appendChild(fieldsWrap);
    host.appendChild(outWrap);

    var buttons = ex.situations.map(function (s) {
      var b = el("button", "ex-situation", esc(s.label));
      b.type = "button";
      b.addEventListener("click", function () {
        state.situation = s.id;
        app.persist();
        buttons.forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        renderFields();
      });
      picker.appendChild(b);
      return b;
    });

    function current() {
      return ex.situations.find(function (s) { return s.id === state.situation; }) || ex.situations[0];
    }

    function build() {
      var s = current();
      var text = s.template;
      s.fields.forEach(function (f) {
        var v = (state.values[s.id] && state.values[s.id][f.key]) || "";
        text = text.replace("{" + f.key + "}", v || "…");
      });
      return text;
    }

    function renderOut() {
      outWrap.innerHTML = "";
      outWrap.appendChild(promptBlock(build(), ex.note));
    }

    function renderFields() {
      var s = current();
      if (!state.values[s.id]) state.values[s.id] = {};
      fieldsWrap.innerHTML = "";
      s.fields.forEach(function (f) {
        var row = el("div", "ex-field");
        row.appendChild(el("label", "ex-field-label", esc(f.label)));
        var inp = el("input", "ex-field-input");
        inp.type = "text";
        inp.placeholder = f.placeholder || "";
        inp.value = state.values[s.id][f.key] || "";
        inp.addEventListener("input", function () {
          state.values[s.id][f.key] = inp.value;
          renderOut();
          app.persist();
        });
        row.appendChild(inp);
        fieldsWrap.appendChild(row);
      });
      renderOut();
    }

    buttons[0].classList.add("active");
    renderFields();

    return {
      worksheet: function () {
        return {
          title: ex.title,
          intro: ex.task,
          blocks: [
            { type: "promptBox", label: "MOJA OTÁZKA", text: build() },
            { type: "heading", text: "Vzorové otázky na doma" },
            { type: "paragraph", text: "Tam, kde sú tri bodky, doplňte vlastné informácie.", muted: true },
          ].concat((ex.worksheetPrompts || []).map(function (p) {
            return { type: "promptBox", label: p.label, text: p.text };
          })).concat([
            { type: "note", text: ex.note },
          ]),
        };
      },
    };
  };

  // 4 · Simulátor ChatGPT
  RENDERERS["chat-sim"] = function (ex, host, app) {
    var asked = [];

    var win = el("div", "chatsim");
    win.innerHTML =
      "<div class='chatsim-bar'>" +
      "<span class='chatsim-dots'><i></i><i></i><i></i></span>" +
      "<span class='chatsim-title'>ChatGPT</span>" +
      "<span class='chatsim-badge'>nácvik</span>" +
      "</div>";
    var thread = el("div", "chatsim-thread");
    win.appendChild(thread);

    var inputRow = el("form", "chatsim-input");
    var input = el("input", "chatsim-field");
    input.type = "text";
    input.placeholder = "Napíšte svoju otázku…";
    input.setAttribute("aria-label", "Vaša otázka pre ChatGPT");
    var send = el("button", "chatsim-send",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4'><path d='M12 19V5'/><path d='m5 12 7-7 7 7'/></svg>");
    send.type = "submit";
    send.setAttribute("aria-label", "Odoslať");
    inputRow.appendChild(input);
    inputRow.appendChild(send);
    win.appendChild(inputRow);
    host.appendChild(win);

    // Uvítacia správa, aby okno nebolo prázdne
    addBubble("ai", "Dobrý deň! Som ChatGPT. Opýtajte sa ma na čokoľvek — napríklad či je nejaká správa podvod. Nič sa nedá pokaziť.");

    var chips = el("div", "chatsim-chips");
    chips.appendChild(el("span", "chatsim-chips-label", "Neviete, čo napísať? Skúste niektorú z týchto otázok:"));
    (ex.suggestions || []).forEach(function (s) {
      var c = el("button", "chatsim-chip", esc(s));
      c.type = "button";
      c.addEventListener("click", function () { submit(s); });
      chips.appendChild(c);
    });
    host.appendChild(chips);

    inputRow.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) return;
      submit(v);
      input.value = "";
    });

    // forcedId sa použije pri kliknutí na navrhnutú otázku — tá má cieľ
    // určený v dátach, takže sa nespolieha na to, či ju párovanie trafí.
    function submit(text, forcedId) {
      asked.push(text);
      clearChips();
      addBubble("me", text);
      var typing = addTyping();
      setTimeout(function () {
        typing.remove();
        var res = answerFor(text, forcedId);
        addBubble("ai", res.text);
        if (res.followUps && res.followUps.length) addFollowUps(res.followUps);
        thread.scrollTop = thread.scrollHeight;
      }, 700);
      thread.scrollTop = thread.scrollHeight;
    }

    // Seniori píšu často bez diakritiky, preto ju pred porovnávaním odstránime
    // a porovnávame "bez mäkčeňov" na oboch stranách.
    function normalize(s) {
      return String(s).toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");
    }

    // Ak v otázke vidíme niečo, čo vyzerá ako číslo karty, PIN, rodné číslo
    // alebo IBAN, neodpovedáme na tému — upozorníme. Je to najlepšia chvíľa
    // pripomenúť, čo do AI nepatrí, a zároveň to pôsobí ako skutočná AI.
    function looksSensitive(text) {
      var t = String(text);
      var digitsOnly = t.replace(/[\s-]/g, "");
      if (/\b[A-Za-z]{2}\d{2}[A-Za-z0-9\s]{10,}/.test(t)) return true;        // IBAN
      if (/\d{6}\s*\/\s*\d{3,4}/.test(t)) return true;                         // rodné číslo
      if (/\d{13,}/.test(digitsOnly)) return true;                             // dlhý číselný reťazec
      if (/\d{16}/.test(digitsOnly)) return true;                              // číslo karty
      if (/\b(pin|cvv|cvc|heslo|rodne cislo|rodné číslo)\b[^.?!]{0,20}\b\d{3,}/i.test(normalize(t))) return true;
      return false;
    }

    // Odpoveď vyberáme podľa zhody so slovami a frázami. Viacslovné frázy
    // vážia viac — bez toho by otázka „Volala mi vnučka…“ trafila slovo
    // „volal“ a dostala odpoveď o bankách.
    function answerFor(text, forcedId) {
      if (looksSensitive(text) && ex.sensitiveReply) return ex.sensitiveReply;

      if (forcedId) {
        var forced = (ex.replies || []).find(function (r) { return r.id === forcedId; });
        if (forced) return forced;
      }

      var q = normalize(text);
      var best = null, bestScore = 0;
      (ex.replies || []).forEach(function (r) {
        var score = 0;
        (r.phrases || []).forEach(function (p) { if (q.indexOf(normalize(p)) !== -1) score += 3; });
        (r.keywords || []).forEach(function (k) {
          // zhoda len na začiatku slova — "vola" tak netrafí "vyvolal"
          if (new RegExp("(^| )" + normalize(k).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(q)) score += 1;
        });
        if (score > bestScore) { bestScore = score; best = r; }
      });

      // Pri slabej zhode radšej priznáme neistotu a spýtame sa doplňujúco,
      // než by sme odpovedali mimo témy.
      if (bestScore < 2 || !best) {
        if (ex.clarify) return { text: ex.clarify.text, followUps: ex.clarify.options };
        return { text: "Ďakujem za otázku. Opíšte mi prosím situáciu podrobnejšie." };
      }
      return best;
    }

    var chipsRow = null;
    function clearChips() {
      if (chipsRow) { chipsRow.remove(); chipsRow = null; }
    }
    function addFollowUps(list) {
      chipsRow = el("div", "chatsim-followups");
      chipsRow.appendChild(el("span", "chatsim-followups-label", "Môžete sa opýtať ďalej:"));
      list.forEach(function (item) {
        var text = item && item.q ? item.q : item;
        var to = item && item.to ? item.to : null;
        var b = el("button", "chatsim-chip", esc(text));
        b.type = "button";
        b.addEventListener("click", function () { submit(text, to); });
        chipsRow.appendChild(b);
      });
      thread.appendChild(chipsRow);
      thread.scrollTop = thread.scrollHeight;
    }

    function addBubble(who, text) {
      var b = el("div", "chatsim-msg " + who);
      b.innerHTML =
        "<span class='chatsim-avatar'>" +
        (who === "ai"
          ? "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8'>" + ICONS.robot + "</svg>"
          : "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8'><circle cx='12' cy='8' r='3.5'/><path d='M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6'/></svg>") +
        "</span><div class='chatsim-text'>" + formatReply(text) + "</div>";
      thread.appendChild(b);
      thread.scrollTop = thread.scrollHeight;
      return b;
    }

    function addTyping() {
      var t = el("div", "chatsim-msg ai");
      t.innerHTML =
        "<span class='chatsim-avatar'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8'>" + ICONS.robot + "</svg></span>" +
        "<div class='chatsim-text'><span class='chatsim-typing'><i></i><i></i><i></i></span></div>";
      thread.appendChild(t);
      thread.scrollTop = thread.scrollHeight;
      return t;
    }

    // Odpovede píšeme s odrážkami a **tučným** textom — prevedieme ich na HTML.
    function formatReply(text) {
      return esc(text)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .split("\n")
        .map(function (line) {
          var t = line.trim();
          if (!t) return "";
          if (t.charAt(0) === "•") return "<span class='chatsim-li'>" + t.slice(1).trim() + "</span>";
          if (/^\d+\.\s/.test(t)) return "<span class='chatsim-li num'>" + t + "</span>";
          return "<p>" + t + "</p>";
        })
        .join("");
    }

    return {
      worksheet: function () {
        return {
          title: ex.title,
          intro: "Otázky, ktoré si môžete vyskúšať v skutočnom ChatGPT na chatgpt.com alebo v aplikácii.",
          blocks: [
            { type: "heading", text: "Otázky na vyskúšanie" },
          ].concat((ex.suggestions || []).map(function (s, i) {
            return { type: "promptBox", label: "OTÁZKA " + (i + 1), text: s };
          })).concat([
            { type: "heading", text: "Moja vlastná otázka" },
            { type: "lines", count: 4 },
            { type: "note", text: "Na koniec každej otázky pokojne pridajte: „Vysvetli mi to jednoducho, ako seniorovi, bez cudzích slov.“ Odpoveď bude hneď zrozumiteľnejšia." },
          ]),
        };
      },
    };
  };

  // 5 · Bezpečnostná previerka domácnosti
  RENDERERS.checklist = function (ex, host, app) {
    var state = app.answers[ex.id] || (app.answers[ex.id] = { checked: {} });
    var progress = el("p", "ex-hint-pill", "");

    function update() {
      var n = ex.items.filter(function (_, i) { return state.checked[i]; }).length;
      progress.innerHTML = n >= ex.items.length
        ? "Výborne — máte zariadené všetko z tohto zoznamu."
        : "Hotové <strong>" + n + "</strong> z " + ex.items.length;
    }

    ex.items.forEach(function (item, i) {
      var row = el("label", "ex-check-row" + (state.checked[i] ? " checked" : ""));
      var cb = el("input", "ex-check-box");
      cb.type = "checkbox";
      cb.checked = !!state.checked[i];
      cb.addEventListener("change", function () {
        state.checked[i] = cb.checked;
        row.classList.toggle("checked", cb.checked);
        update();
        app.persist();
      });
      row.appendChild(cb);
      var txt = el("span", "ex-check-text");
      txt.appendChild(el("span", "ex-check-main", esc(item.text)));
      if (item.why) txt.appendChild(el("span", "ex-check-why", esc(item.why)));
      row.appendChild(txt);
      host.appendChild(row);
    });

    host.appendChild(progress);
    update();

    return {
      worksheet: function () {
        return {
          title: ex.title,
          intro: ex.task,
          blocks: [
            { type: "checklist", items: ex.items.map(function (it, i) {
              return { text: it.text, checked: !!state.checked[i] }; }) },
            { type: "note", text: ex.note },
          ],
        };
      },
    };
  };

  // 6 · Karta prvej pomoci
  RENDERERS["emergency-card"] = function (ex, host, app) {
    var state = app.answers[ex.id] || (app.answers[ex.id] = { values: {} });

    var fields = el("div", "ex-fields");
    ex.fields.forEach(function (f) {
      var row = el("div", "ex-field");
      row.appendChild(el("label", "ex-field-label", esc(f.label)));
      var inp = el("input", "ex-field-input");
      inp.type = "text";
      inp.placeholder = f.placeholder || "";
      inp.value = state.values[f.key] || "";
      inp.addEventListener("input", function () {
        state.values[f.key] = inp.value;
        renderCard();
        app.persist();
      });
      row.appendChild(inp);
      fields.appendChild(row);
    });
    host.appendChild(fields);

    var preview = el("div", "ex-card-preview");
    host.appendChild(preview);

    function val(key, placeholder) {
      var v = (state.values[key] || "").trim();
      return v ? esc(v) : "<span class='ex-card-blank'>" + placeholder + "</span>";
    }

    function renderCard() {
      preview.innerHTML =
        "<div class='ex-card'>" +
        "<div class='ex-card-head'>" +
        "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>" + ICONS.phone + "</svg>" +
        "<span>Keď sa niečo stane — komu volám</span></div>" +
        "<div class='ex-card-rows'>" +
        "<div class='ex-card-row'><span>" + val("banka", "moja banka") + "</span><strong>" + val("bankaTel", "číslo z karty") + "</strong></div>" +
        "<div class='ex-card-row'><span>" + val("blizky", "blízka osoba") + "</span><strong>" + val("blizkyTel", "číslo") + "</strong></div>" +
        ex.fixedRows.map(function (r) {
          return "<div class='ex-card-row fixed'><span>" + esc(r.label) + "</span><strong>" + esc(r.value) + "</strong></div>";
        }).join("") +
        "</div>" +
        "<ol class='ex-card-steps'>" +
        ex.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") +
        "</ol></div>";
    }
    renderCard();

    return {
      worksheet: function () {
        var rows = [
          { label: state.values.banka || "Moja banka", value: state.values.bankaTel || "" },
          { label: state.values.blizky || "Blízka osoba", value: state.values.blizkyTel || "" },
        ].concat(ex.fixedRows);
        return {
          title: ex.title,
          intro: "Vystrihnite si túto stranu a nechajte ju pri telefóne alebo v peňaženke.",
          blocks: [
            { type: "heading", text: "Komu volám" },
            { type: "table", rows: rows, valueWidth: 200 },
            { type: "heading", text: "Čo urobím — v tomto poradí" },
            { type: "checklist", items: ex.steps.map(function (s) { return { text: s }; }) },
            { type: "note", text: ex.note },
          ],
        };
      },
    };
  };

  window.initExercises = function (root, opts) {
    var app = new Exercises(root, opts);
    app.renderOverview();
    return app;
  };
})();
