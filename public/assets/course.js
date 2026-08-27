// Engine interaktívneho kurzu "Ako sa nenechať oklamať".
// Vykresľuje obrazovky z window.COURSE_SLIDES do kontajnera podľa ich `type`.
// Voláme initCourse(container, hooks) — hooks.onProgress(index, done) sa volá
// pri každom posune, aby si volajúca stránka (workshop.html) vedela uložiť postup.

(function () {
  "use strict";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function Course(root, hooks) {
    this.root = root;
    this.hooks = hooks || {};
    this.slides = window.COURSE_SLIDES;
    this.stamps = window.COURSE_STAMPS || [];
    this.parts = window.COURSE_PARTS || [];
    this.index = 0;
    this.earnedStamps = new Set();
  }

  Course.prototype.start = function (startIndex, earnedStamps) {
    this.index = Math.min(Math.max(startIndex || 0, 0), this.slides.length - 1);
    this.earnedStamps = new Set(earnedStamps || []);
    this.render();
  };

  Course.prototype.goTo = function (i) {
    this.index = Math.min(Math.max(i, 0), this.slides.length - 1);
    this.render();
    const slide = this.slides[this.index];
    if (slide.stamp) this.earnedStamps.add(slide.id);
    const done = this.index >= this.slides.length - 1;
    if (this.hooks.onProgress) {
      this.hooks.onProgress(this.index, done, Array.from(this.earnedStamps));
    }
  };

  Course.prototype.next = function () { this.goTo(this.index + 1); };
  Course.prototype.prev = function () { this.goTo(this.index - 1); };

  Course.prototype.render = function () {
    const slide = this.slides[this.index];
    this.root.innerHTML = "";

    const wrap = el("div", "course-wrap");

    // Mapa postupu s časťami a pečaťami
    wrap.appendChild(this.renderMap(slide));

    // Obsah obrazovky
    const stage = el("div", "course-stage");
    const card = el("div", "course-card");
    stage.appendChild(card);
    wrap.appendChild(stage);

    const renderer = RENDERERS[slide.type] || RENDERERS.info;
    renderer(slide, card, this);

    // Navigácia
    wrap.appendChild(this.renderNav(slide));

    this.root.appendChild(wrap);
    this.root.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  Course.prototype.renderMap = function (slide) {
    const map = el("div", "course-map");
    const label = el("div", "course-map-label",
      "Obrazovka " + (this.index + 1) + " z " + this.slides.length);
    map.appendChild(label);

    const bar = el("div", "course-map-bar");
    this.parts.forEach((p) => {
      const seg = el("div", "course-map-seg" + (p.id === slide.part ? " active" : (p.id < slide.part ? " done" : "")));
      const stampInPart = this.stamps.some((sid) => {
        const s = this.slides.find((x) => x.id === sid);
        return s && s.part === p.id && this.earnedStamps.has(sid);
      });
      seg.title = p.label;
      seg.appendChild(el("span", "course-map-dot" + (stampInPart ? " earned" : "")));
      seg.appendChild(el("span", "course-map-seg-label", p.label));
      bar.appendChild(seg);
    });
    map.appendChild(bar);

    const pct = Math.round(((this.index + 1) / this.slides.length) * 100);
    const track = el("div", "course-progress-track");
    track.appendChild(el("div", "course-progress-fill"));
    track.firstChild.style.width = pct + "%";
    map.appendChild(track);

    return map;
  };

  Course.prototype.renderNav = function (slide) {
    const nav = el("div", "course-nav");
    const back = el("button", "btn btn-secondary", "← Späť");
    back.type = "button";
    back.disabled = this.index === 0;
    back.addEventListener("click", () => this.prev());
    nav.appendChild(back);

    const isLast = this.index === this.slides.length - 1;
    const next = el("button", "btn btn-primary", isLast ? (this.hooks.finishLabel || "Dokončiť kurz") : "Ďalej →");
    next.type = "button";
    next.id = "course-next-btn";
    next.addEventListener("click", () => {
      if (isLast) {
        if (this.hooks.onFinish) this.hooks.onFinish();
      } else {
        this.next();
      }
    });
    nav.appendChild(next);
    return nav;
  };

  // ---------- Zdieľané pomocné bloky ----------

  function header(card, slide) {
    const partLabel = (window.COURSE_PARTS.find((p) => p.id === slide.part) || {}).label || "";
    card.appendChild(el("p", "course-kicker", "ČASŤ " + slide.part + " · " + partLabel));
    card.appendChild(el("h2", null, slide.title));
    if (slide.lead) card.appendChild(el("p", "course-lead", slide.lead));
  }

  function note(card, text) {
    if (!text) return;
    card.appendChild(el("div", "course-note", "<strong>Zapamätajte si:</strong> " + text));
  }

  function feedback(card, ok, text) {
    const f = el("div", "course-feedback " + (ok ? "ok" : "warn"), text);
    card.appendChild(f);
    return f;
  }

  // ---------- Renderery jednotlivých typov ----------

  const RENDERERS = {};

  RENDERERS.intro = function (slide, card) {
    card.appendChild(el("div", "course-badge", "Interaktívny kurz"));
    header(card, slide);
    card.appendChild(el("p", null, slide.body));
    const map = el("div", "course-intro-parts");
    window.COURSE_PARTS.forEach((p, i) => {
      map.appendChild(el("div", "course-intro-part", "<span>" + (i + 1) + "</span>" + p.label));
    });
    card.appendChild(map);
  };

  RENDERERS.tiles = function (slide, card) {
    header(card, slide);
    const grid = el("div", "course-tiles");
    const opened = new Set();
    slide.tiles.forEach((t, i) => {
      const tile = el("div", "course-tile", "<h3>" + t.title + "</h3>");
      tile.addEventListener("click", () => {
        if (tile.classList.contains("open")) return;
        tile.classList.add("open");
        tile.innerHTML = "<h3>" + t.title + "</h3><p>" + t.text + "</p>";
        opened.add(i);
        counter.textContent = opened.size >= slide.minOpened
          ? "Skvelé, prezreli ste si dostatok kapitol."
          : "Otvorené " + opened.size + " z " + slide.minOpened + " potrebných.";
      });
      grid.appendChild(tile);
    });
    card.appendChild(grid);
    const counter = el("p", "course-hint", "Otvorené 0 z " + slide.minOpened + " potrebných.");
    card.appendChild(counter);
  };

  RENDERERS.flip = function (slide, card) {
    header(card, slide);
    const grid = el("div", "course-flip-grid");
    slide.cards.forEach((c) => {
      const outer = el("div", "course-flip");
      const inner = el("div", "course-flip-inner");
      inner.appendChild(el("div", "course-flip-face course-flip-front", "<h3>" + c.front + "</h3><span class='course-flip-hint'>Kliknite</span>"));
      inner.appendChild(el("div", "course-flip-face course-flip-back", "<p>" + c.back + "</p>"));
      outer.appendChild(inner);
      outer.addEventListener("click", () => outer.classList.toggle("flipped"));
      grid.appendChild(outer);
    });
    card.appendChild(grid);
  };

  RENDERERS.sort = function (slide, card) {
    header(card, slide);
    const items = shuffle(slide.items);
    const pool = el("div", "course-pool");
    const basketsWrap = el("div", "course-baskets course-baskets-" + slide.baskets.length);
    const baskets = {};

    slide.baskets.forEach((b) => {
      const basket = el("div", "course-basket");
      basket.dataset.basket = b.id;
      basket.appendChild(el("div", "course-basket-label", b.label));
      const drop = el("div", "course-basket-drop");
      basket.appendChild(drop);
      basketsWrap.appendChild(basket);
      baskets[b.id] = drop;
    });

    let selected = null;
    let remaining = items.length;
    const status = el("p", "course-hint", "Zostáva umiestniť: " + remaining);

    function place(cardEl, basketId) {
      const correct = cardEl.dataset.basket === basketId;
      cardEl.classList.remove("selected");
      cardEl.draggable = false;
      cardEl.style.position = "";
      cardEl.style.left = "";
      cardEl.style.top = "";
      cardEl.style.width = "";
      cardEl.style.zIndex = "";
      baskets[basketId].appendChild(cardEl);
      cardEl.classList.add(correct ? "placed-ok" : "placed-bad");
      if (!correct) {
        const correctLabel = (slide.baskets.find((b) => b.id === cardEl.dataset.basket) || {}).label;
        cardEl.title = "Správne miesto: " + correctLabel;
      }
      if (!cardEl.dataset.counted) {
        cardEl.dataset.counted = "1";
        remaining--;
        status.textContent = remaining > 0 ? "Zostáva umiestniť: " + remaining : "Hotovo — skontrolujte si červeno označené kartičky.";
      }
    }

    items.forEach((item) => {
      const it = el("div", "course-item", item.text);
      it.dataset.basket = item.basket;
      it.tabIndex = 0;

      it.addEventListener("click", () => {
        if (it.classList.contains("placed-ok") || it.classList.contains("placed-bad")) return;
        if (selected === it) {
          it.classList.remove("selected");
          selected = null;
          return;
        }
        if (selected) selected.classList.remove("selected");
        selected = it;
        it.classList.add("selected");
      });

      it.addEventListener("pointerdown", (e) => {
        if (it.classList.contains("placed-ok") || it.classList.contains("placed-bad")) return;
        const rect = it.getBoundingClientRect();
        const startX = e.clientX, startY = e.clientY;
        let moved = false;
        it.setPointerCapture(e.pointerId);
        it.style.position = "fixed";
        it.style.left = rect.left + "px";
        it.style.top = rect.top + "px";
        it.style.width = rect.width + "px";
        it.style.zIndex = "500";

        function onMove(ev) {
          const dx = ev.clientX - startX, dy = ev.clientY - startY;
          if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
          it.style.left = (rect.left + dx) + "px";
          it.style.top = (rect.top + dy) + "px";
          it.classList.add("dragging");
        }
        function onUp(ev) {
          it.removeEventListener("pointermove", onMove);
          it.removeEventListener("pointerup", onUp);
          it.classList.remove("dragging");
          if (!moved) {
            it.style.position = "";
            it.style.left = "";
            it.style.top = "";
            it.style.width = "";
            it.style.zIndex = "";
            return;
          }
          let target = null;
          Object.keys(baskets).forEach((bid) => {
            const r = baskets[bid].parentElement.getBoundingClientRect();
            if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
              target = bid;
            }
          });
          if (target) {
            place(it, target);
          } else {
            it.style.position = "";
            it.style.left = "";
            it.style.top = "";
            it.style.width = "";
            it.style.zIndex = "";
          }
        }
        it.addEventListener("pointermove", onMove);
        it.addEventListener("pointerup", onUp);
      });

      pool.appendChild(it);
    });

    Object.keys(baskets).forEach((bid) => {
      baskets[bid].parentElement.addEventListener("click", () => {
        if (!selected) return;
        place(selected, bid);
        selected = null;
      });
    });

    card.appendChild(pool);
    card.appendChild(basketsWrap);
    card.appendChild(status);
    note(card, slide.note);
  };

  RENDERERS.match = function (slide, card) {
    header(card, slide);
    const wrap = el("div", "course-match");
    const leftCol = el("div", "course-match-col");
    const rightCol = el("div", "course-match-col");
    const rightsShuffled = shuffle(slide.pairs.map((p, i) => ({ text: p.right, i })));

    let selLeft = null, selRight = null;
    let solved = 0;
    const status = el("p", "course-hint", "Spojené: 0 z " + slide.pairs.length);

    const leftEls = slide.pairs.map((p, i) => {
      const e2 = el("div", "course-match-item", p.text);
      e2.dataset.i = i;
      e2.addEventListener("click", () => {
        if (e2.classList.contains("solved")) return;
        if (selLeft) selLeft.classList.remove("selected");
        selLeft = e2;
        e2.classList.add("selected");
        tryMatch();
      });
      leftCol.appendChild(e2);
      return e2;
    });

    const rightEls = rightsShuffled.map((r) => {
      const e2 = el("div", "course-match-item", r.text);
      e2.dataset.i = r.i;
      e2.addEventListener("click", () => {
        if (e2.classList.contains("solved")) return;
        if (selRight) selRight.classList.remove("selected");
        selRight = e2;
        e2.classList.add("selected");
        tryMatch();
      });
      rightCol.appendChild(e2);
      return e2;
    });

    function tryMatch() {
      if (!selLeft || !selRight) return;
      if (selLeft.dataset.i === selRight.dataset.i) {
        selLeft.classList.remove("selected");
        selRight.classList.remove("selected");
        selLeft.classList.add("solved");
        selRight.classList.add("solved");
        solved++;
        status.textContent = solved >= slide.pairs.length
          ? "Výborne, všetko je spojené!"
          : "Spojené: " + solved + " z " + slide.pairs.length;
        selLeft = null; selRight = null;
      } else {
        selLeft.classList.add("shake");
        selRight.classList.add("shake");
        setTimeout(() => {
          if (selLeft) selLeft.classList.remove("selected", "shake");
          if (selRight) selRight.classList.remove("selected", "shake");
          selLeft = null; selRight = null;
        }, 450);
      }
    }

    wrap.appendChild(leftCol);
    wrap.appendChild(rightCol);
    card.appendChild(wrap);
    card.appendChild(status);
    note(card, slide.note);
  };

  RENDERERS.sequence = function (slide, card) {
    header(card, slide);
    const list = el("div", "course-sequence");
    const shuffled = shuffle(slide.steps.map((s, i) => ({ text: s, i })));
    let nextExpected = 0;
    const status = el("p", "course-hint", "Kliknite na krok číslo 1.");

    shuffled.forEach((s) => {
      const item = el("button", "course-seq-item", s.text);
      item.type = "button";
      item.addEventListener("click", () => {
        if (item.classList.contains("done")) return;
        if (s.i === nextExpected) {
          item.classList.add("done");
          item.insertAdjacentHTML("afterbegin", "<span class='course-seq-num'>" + (nextExpected + 1) + "</span> ");
          nextExpected++;
          status.textContent = nextExpected >= slide.steps.length
            ? "Presne v tomto poradí — výborne!"
            : "Teraz kliknite na krok číslo " + (nextExpected + 1) + ".";
        } else {
          item.classList.add("shake");
          setTimeout(() => item.classList.remove("shake"), 400);
        }
      });
      list.appendChild(item);
    });

    card.appendChild(list);
    card.appendChild(status);
    note(card, slide.note);
  };

  RENDERERS.hotspot = function (slide, card) {
    header(card, slide);
    const screen = el("div", "course-hotspot-screen");
    const mock = el("div", "course-hotspot-mock",
      "<div class='chp-side'></div><div class='chp-main'><div class='chp-bubble'></div><div class='chp-bubble short'></div></div><div class='chp-input'></div>");
    screen.appendChild(mock);
    let found = 0;
    const status = el("p", "course-hint", "Nájdených: 0 z " + slide.spots.length);
    const info = el("div", "course-hotspot-info");

    slide.spots.forEach((s) => {
      const dot = el("button", "course-hotspot-dot", "+");
      dot.type = "button";
      dot.style.left = s.x + "%";
      dot.style.top = s.y + "%";
      dot.addEventListener("click", () => {
        if (dot.classList.contains("found")) return;
        dot.classList.add("found");
        found++;
        info.appendChild(el("div", "course-hotspot-card", "<h4>" + s.title + "</h4><p>" + s.text + "</p>"));
        status.textContent = found >= slide.spots.length ? "Objavili ste všetko!" : "Nájdených: " + found + " z " + slide.spots.length;
      });
      screen.appendChild(dot);
    });

    card.appendChild(screen);
    card.appendChild(status);
    card.appendChild(info);
  };

  RENDERERS.choice = function (slide, card) {
    header(card, slide);
    if (slide.intro) card.appendChild(el("p", null, slide.intro));
    slide.rounds.forEach((r, idx) => {
      const box = el("div", "course-choice-round");
      box.appendChild(el("p", "course-choice-num", "Otázka " + (idx + 1)));
      const opts = el("div", "course-choice-opts");
      const weak = el("button", "course-choice-opt", r.weak);
      const good = el("button", "course-choice-opt", r.good);
      [weak, good].forEach((b) => (b.type = "button"));
      const result = el("div", "course-choice-result");

      function lock(chosenGood) {
        weak.disabled = true; good.disabled = true;
        good.classList.add("correct");
        if (!chosenGood) weak.classList.add("incorrect");
        let html = "<p><strong>" + (chosenGood ? "Presne tak." : "Lepšia je druhá možnosť.") + "</strong> " + r.why + "</p>";
        if (r.answerPreview) html += "<p class='course-ai-answer'>„" + r.answerPreview + "“ — takto by mohla znieť odpoveď AI.</p>";
        result.innerHTML = html;
        result.classList.add("show");
      }
      weak.addEventListener("click", () => lock(false));
      good.addEventListener("click", () => lock(true));

      opts.appendChild(weak);
      opts.appendChild(good);
      box.appendChild(opts);
      box.appendChild(result);
      card.appendChild(box);
    });
    note(card, slide.note);
  };

  RENDERERS.belief = function (slide, card) {
    header(card, slide);
    slide.items.forEach((it) => {
      const box = el("div", "course-belief-item");
      box.appendChild(el("p", null, it.text));
      const opts = el("div", "course-choice-opts");
      const btnBelieve = el("button", "course-choice-opt", "Uverím");
      const btnCheck = el("button", "course-choice-opt", "Overím si");
      [btnBelieve, btnCheck].forEach((b) => (b.type = "button"));
      const result = el("div", "course-choice-result");
      function lock(chosen) {
        btnBelieve.disabled = true; btnCheck.disabled = true;
        const ok = chosen === it.answer;
        (chosen === "uverim" ? btnBelieve : btnCheck).classList.add(ok ? "correct" : "incorrect");
        result.textContent = ok ? "Správne." : (it.answer === "overim" ? "Toto si radšej overte z druhého zdroja." : "Toto je v poriadku, netreba sa báť opýtať.");
        result.classList.add("show", ok ? "ok" : "warn");
      }
      btnBelieve.addEventListener("click", () => lock("uverim"));
      btnCheck.addEventListener("click", () => lock("overim"));
      opts.appendChild(btnBelieve);
      opts.appendChild(btnCheck);
      box.appendChild(opts);
      box.appendChild(result);
      card.appendChild(box);
    });
    note(card, slide.note);
  };

  RENDERERS.reveal = function (slide, card) {
    header(card, slide);
    const grid = el("div", "course-reveal course-reveal-" + slide.layout);
    slide.cells.forEach((c, i) => {
      const cell = el("div", "course-reveal-cell");
      const btn = el("button", "course-reveal-btn", slide.layout === "keys" ? ("Kľúč " + (i + 1)) : "Kliknite sem");
      btn.type = "button";
      const content = el("div", "course-reveal-content", "<h4>" + c.title + "</h4><p>" + c.text + "</p>");
      btn.addEventListener("click", () => {
        cell.classList.add("open");
      });
      cell.appendChild(btn);
      cell.appendChild(content);
      grid.appendChild(cell);
    });
    card.appendChild(grid);
    note(card, slide.note);
  };

  RENDERERS.revealgrid = function (slide, card) {
    header(card, slide);
    const grid = el("div", "course-revealgrid");
    slide.cells.forEach((c, i) => {
      const cell = el("div", "course-revealgrid-cell");
      cell.appendChild(el("div", "course-revealgrid-num", String(i + 1)));
      const content = el("div", "course-revealgrid-content", "<h4>" + c.title + "</h4><p>" + c.text + "</p>");
      cell.appendChild(content);
      cell.addEventListener("click", () => cell.classList.toggle("open"));
      grid.appendChild(cell);
    });
    card.appendChild(grid);
  };

  RENDERERS.quickfire = function (slide, card, course) {
    header(card, slide);
    let correct = 0, answered = 0;
    const status = el("p", "course-hint", "Otázka 1 z " + slide.questions.length);
    slide.questions.forEach((q, i) => {
      const box = el("div", "course-belief-item");
      box.appendChild(el("p", null, q.text));
      const opts = el("div", "course-choice-opts");
      const yes = el("button", "course-choice-opt", "Áno");
      const no = el("button", "course-choice-opt", "Nie");
      [yes, no].forEach((b) => (b.type = "button"));
      function lock(val) {
        yes.disabled = true; no.disabled = true;
        const ok = val === q.answer;
        if (ok) correct++;
        (val ? yes : no).classList.add(ok ? "correct" : "incorrect");
        answered++;
        status.textContent = answered >= slide.questions.length
          ? "Hotovo — správne ste odpovedali na " + correct + " z " + slide.questions.length + "."
          : "Otázka " + (answered + 1) + " z " + slide.questions.length;
      }
      yes.addEventListener("click", () => lock(true));
      no.addEventListener("click", () => lock(false));
      opts.appendChild(yes);
      opts.appendChild(no);
      box.appendChild(opts);
      card.appendChild(box);
    });
    card.appendChild(status);
  };

  RENDERERS.spot = function (slide, card) {
    header(card, slide);
    const mail = el("div", "course-mail");
    mail.appendChild(el("div", "course-mail-head",
      "<strong>Od:</strong> " + slide.message.from + (slide.message.subject ? "<br><strong>Predmet:</strong> " + slide.message.subject : "")));
    const body = el("div", "course-mail-body");
    const parts = slide.message.body.split(/(\[\[.*?\]\])/g);
    let clueIndex = 0;
    const foundSet = new Set();
    parts.forEach((part) => {
      const m = part.match(/^\[\[(.*)\]\]$/);
      if (m) {
        const idx = clueIndex++;
        const span = el("span", "course-clue", m[1]);
        span.addEventListener("click", () => {
          if (foundSet.has(idx)) return;
          foundSet.add(idx);
          span.classList.add("found");
          status.textContent = foundSet.size >= slide.clues.length
            ? "Našli ste všetky varovné znaky!"
            : "Nájdených: " + foundSet.size + " z " + slide.clues.length;
          list.children[idx].classList.add("revealed");
        });
        body.appendChild(span);
      } else {
        body.appendChild(document.createTextNode(part));
      }
    });
    mail.appendChild(body);
    card.appendChild(mail);
    const status = el("p", "course-hint", "Klikajte na podčiarknuté časti textu — nájdených: 0 z " + slide.clues.length);
    card.appendChild(status);
    const list = el("div", "course-clue-list");
    slide.clues.forEach((c) => list.appendChild(el("div", "course-clue-item", c)));
    card.appendChild(list);
    if (slide.footer) card.appendChild(el("p", "course-hint", slide.footer));
  };

  RENDERERS.story = function (slide, card, course) {
    header(card, slide);
    const box = el("div", "course-story");
    card.appendChild(box);

    function renderNode(id) {
      const node = slide.nodes[id];
      box.innerHTML = "";
      if (node.end) {
        box.appendChild(el("div", "course-story-bubble " + (node.end === "good" ? "good" : "warn"), node.text));
        return;
      }
      box.appendChild(el("div", "course-story-bubble", "<strong>" + node.speaker + ":</strong><br>" + node.text));
      const choices = el("div", "course-story-choices");
      node.choices.forEach((c) => {
        const b = el("button", "btn btn-secondary", c.text);
        b.type = "button";
        b.style.display = "block";
        b.style.width = "100%";
        b.style.marginBottom = ".6rem";
        b.style.textAlign = "left";
        b.addEventListener("click", () => renderNode(c.to));
        choices.appendChild(b);
      });
      box.appendChild(choices);
    }
    renderNode(slide.start);
  };

  RENDERERS.slider = function (slide, card) {
    header(card, slide);
    const quote = el("blockquote", "course-quote", slide.lead);
    card.appendChild(quote);
    card.appendChild(el("p", null, "<strong>" + slide.sliderQuestion + "</strong>"));
    const track = el("div", "course-slider");
    track.innerHTML =
      "<div class='course-slider-track'><div class='course-slider-fill'></div></div>" +
      "<div class='course-slider-labels'><span>Bezpečné</span><span>Veľmi rizikové</span></div>";
    const input = el("input", "course-slider-input");
    input.type = "range"; input.min = "0"; input.max = "100"; input.value = "50";
    input.addEventListener("input", () => {
      track.querySelector(".course-slider-fill").style.width = input.value + "%";
    });
    track.appendChild(input);
    card.appendChild(track);
    card.appendChild(el("p", "course-hint", slide.sliderHint));

    const checklist = el("div", "course-checklist");
    slide.checklist.forEach((q) => {
      const row = el("label", "course-checklist-row");
      const cb = el("input"); cb.type = "checkbox";
      row.appendChild(cb);
      row.appendChild(document.createTextNode(" " + q));
      checklist.appendChild(row);
    });
    card.appendChild(el("p", null, "<strong>Skôr než investujete, opýtajte sa:</strong>"));
    card.appendChild(checklist);
    note(card, slide.note);
  };

  RENDERERS.guess = function (slide, card) {
    header(card, slide);
    let round = 0;
    const roundBox = el("div", "course-guess-round");
    card.appendChild(roundBox);

    function showRound() {
      roundBox.innerHTML = "";
      if (round >= slide.rounds.length) {
        showChecklist();
        return;
      }
      const r = slide.rounds[round];
      roundBox.appendChild(el("p", "course-choice-num", "Kolo " + (round + 1) + " z " + slide.rounds.length));
      roundBox.appendChild(el("div", "course-guess-photo", r.prompt));
      const opts = el("div", "course-choice-opts");
      const real = el("button", "course-choice-opt", "Skutočná fotografia");
      const ai = el("button", "course-choice-opt", "Vytvorená umelou inteligenciou");
      [real, ai].forEach((b) => (b.type = "button"));
      const result = el("div", "course-choice-result");
      function lock(val) {
        real.disabled = true; ai.disabled = true;
        const ok = val === r.answer;
        (val === "real" ? real : ai).classList.add(ok ? "correct" : "incorrect");
        result.textContent = ok ? "Uhádli ste!" : "Tentoraz nie — ale hlavné je vedieť, na čo sa pozerať.";
        result.classList.add("show");
        const goNext = el("button", "btn btn-primary", round + 1 >= slide.rounds.length ? "Zobraziť znaky AI fotografie" : "Ďalšie kolo");
        goNext.type = "button";
        goNext.style.marginTop = "1rem";
        goNext.addEventListener("click", () => { round++; showRound(); });
        roundBox.appendChild(goNext);
      }
      real.addEventListener("click", () => lock("real"));
      ai.addEventListener("click", () => lock("ai"));
      opts.appendChild(real);
      opts.appendChild(ai);
      roundBox.appendChild(opts);
      roundBox.appendChild(result);
    }

    function showChecklist() {
      const grid = el("div", "course-revealgrid");
      slide.checklist.forEach((c, i) => {
        const cell = el("div", "course-revealgrid-cell open");
        cell.appendChild(el("div", "course-revealgrid-num", String(i + 1)));
        cell.appendChild(el("div", "course-revealgrid-content", "<h4>" + c.title + "</h4><p>" + c.text + "</p>"));
        grid.appendChild(cell);
      });
      roundBox.appendChild(grid);
      note(roundBox, slide.note);
    }

    showRound();
  };

  RENDERERS.rewrite = function (slide, card) {
    header(card, slide);
    const sentenceEl = el("p", "course-rewrite-sentence");
    const removed = new Set();
    slide.sentence.forEach((part, i) => {
      if (part.sensitive) {
        const span = el("span", "course-rewrite-word sensitive", part.text);
        span.addEventListener("click", () => {
          if (removed.has(i)) return;
          removed.add(i);
          span.classList.add("removed");
          checkDone();
        });
        sentenceEl.appendChild(span);
      } else {
        sentenceEl.appendChild(document.createTextNode(" " + part.text + " "));
      }
    });
    card.appendChild(el("p", "course-hint", "Kliknutím odstráňte citlivé údaje (zvýraznené):"));
    card.appendChild(sentenceEl);
    const result = el("div", "course-feedback ok", "");
    result.style.display = "none";
    card.appendChild(result);
    const totalSensitive = slide.sentence.filter((p) => p.sensitive).length;
    function checkDone() {
      if (removed.size >= totalSensitive) {
        result.style.display = "block";
        result.innerHTML = "<strong>Bezpečná verzia:</strong> „" + slide.safeVersion + "“";
      }
    }
  };

  RENDERERS.printcard = function (slide, card) {
    header(card, slide);
    const paper = el("div", "course-paper");
    paper.appendChild(el("h3", null, "Šesť zlatých pravidiel"));
    const list = el("ol", "course-paper-list");
    slide.rules.forEach((r) => list.appendChild(el("li", null, r)));
    paper.appendChild(list);
    card.appendChild(paper);
    const btn = el("button", "btn btn-secondary", "Stiahnuť ako obrázok");
    btn.type = "button";
    btn.style.marginTop = "1rem";
    btn.addEventListener("click", () => downloadPaper(paper, slide.rules));
    card.appendChild(btn);
  };

  function downloadPaper(paperEl, rules) {
    const canvas = document.createElement("canvas");
    canvas.width = 900; canvas.height = 700;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f6f3ec"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1f3a3d";
    ctx.font = "bold 36px Arial";
    ctx.fillText("Šesť zlatých pravidiel", 40, 70);
    ctx.font = "24px Arial";
    let y = 140;
    rules.forEach((r, i) => {
      const lines = wrapText(ctx, (i + 1) + ". " + r, 820);
      lines.forEach((line) => { ctx.fillText(line, 40, y); y += 36; });
      y += 20;
    });
    const link = document.createElement("a");
    link.download = "zlate-pravidla.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((w) => {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  RENDERERS.diploma = function (slide, card) {
    card.appendChild(el("div", "course-diploma-badge",
      "<svg viewBox='0 0 24 24' width='56' height='56' fill='none' stroke='currentColor' stroke-width='1.6'><path d='M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z'/><path d='M9 12l2 2 4-4'/></svg>"));
    card.appendChild(el("h2", "course-diploma-title", slide.title));
    card.appendChild(el("p", "course-lead", slide.lead));
    card.appendChild(el("blockquote", "course-quote", slide.quote));
  };

  RENDERERS.info = function (slide, card) {
    header(card, slide);
    if (slide.body) card.appendChild(el("p", null, slide.body));
  };

  window.initCourse = function (root, hooks) {
    const course = new Course(root, hooks);
    return course;
  };
})();
