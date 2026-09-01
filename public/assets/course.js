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

  // ---------- Lightbox — zväčšenie obrázka po kliknutí ----------

  let lightboxEl = null;
  function getLightbox() {
    if (lightboxEl) return lightboxEl;
    lightboxEl = el("div", "course-lightbox",
      "<button type='button' class='course-lightbox-close' aria-label='Zavrieť'>" +
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4'><path d='M6 6l12 12M18 6 6 18'/></svg></button>" +
      "<img class='course-lightbox-img' alt=''>");
    document.body.appendChild(lightboxEl);
    const close = () => lightboxEl.classList.remove("show");
    lightboxEl.addEventListener("click", (e) => { if (e.target === lightboxEl) close(); });
    lightboxEl.querySelector(".course-lightbox-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    return lightboxEl;
  }

  function openLightbox(src, alt) {
    const box = getLightbox();
    const img = box.querySelector(".course-lightbox-img");
    img.src = src;
    img.alt = alt || "";
    box.classList.add("show");
  }

  function makeZoomable(img) {
    img.classList.add("course-zoomable");
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  }

  function Course(root, hooks) {
    this.root = root;
    this.hooks = hooks || {};
    this.slides = this.hooks.slides || window.COURSE_SLIDES;
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

    // Kapitolový banner — zobrazí sa len na prvej obrazovke danej časti.
    const isFirstOfPart = this.slides.findIndex((s) => s.part === slide.part) === this.index;
    if (isFirstOfPart) wrap.appendChild(this.renderPartHero(slide));

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

  Course.prototype.renderPartHero = function (slide) {
    const part = this.parts.find((p) => p.id === slide.part) || {};
    const hero = el("div", "course-part-hero" + (part.image ? " has-image" : ""));
    hero.innerHTML =
      "<div class='course-part-text'>" +
      "<div class='course-part-eyebrow'>Časť " + String(slide.part).padStart(2, "0") + " z " + String(this.parts.length).padStart(2, "0") + "</div>" +
      "<h2>" + part.label + "</h2>" +
      (part.intro ? "<p>" + part.intro + "</p>" : "") +
      "</div>" +
      (part.image
        ? "<img class='course-part-image' src='" + part.image + "' alt=''>"
        : "<div class='course-part-icon'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5'>" + (PART_ICONS[slide.part] || "") + "</svg></div>");
    return hero;
  };

  Course.prototype.renderMap = function (slide) {
    const map = el("div", "course-map");

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
    const row = el("div", "course-progress-row");
    const track = el("div", "course-progress-track");
    track.appendChild(el("div", "course-progress-fill"));
    track.firstChild.style.width = pct + "%";
    row.appendChild(track);
    row.appendChild(el("span", "course-map-count", (this.index + 1) + "/" + this.slides.length));
    map.appendChild(row);

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

  const PART_ICONS = {
    1: '<circle cx="12" cy="8" r="3"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>',
    2: '<path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="9"/>',
    3: '<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/>',
    4: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 16l-5-4-4 3-3-2-6 5"/>',
    5: '<path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.4L12 14.6 7.1 17.1l.9-5.4-4-3.9L9.5 7Z"/>',
  };

  const MEDIUM_META = {
    email: { label: "Toto je e-mail", cls: "email", icon: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>' },
    sms: { label: "Toto je SMS správa", cls: "sms", icon: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>' },
    call: { label: "Toto je telefonát", cls: "call", icon: '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>' },
    social: { label: "Toto je príspevok na sociálnej sieti", cls: "social", icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.2"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/>' },
  };

  function mediumBadge(medium) {
    const meta = MEDIUM_META[medium];
    if (!meta) return null;
    return el("span", "course-medium-badge " + meta.cls,
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>" + meta.icon + "</svg>" + meta.label);
  }

  function header(card, slide) {
    const kicker = el("p", "course-kicker",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8'>" + (PART_ICONS[slide.part] || "") + "</svg> ČASŤ " + slide.part);
    card.appendChild(kicker);
    card.appendChild(el("h2", null, slide.title));
    const badge = mediumBadge(slide.medium);
    if (badge) card.appendChild(badge);
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

  function evidenceFigure(card, evidenceImage) {
    if (!evidenceImage) return;
    const fig = el("figure", "course-evidence");
    const img = el("img");
    img.src = evidenceImage.src;
    img.alt = evidenceImage.caption || "Skutočný príklad";
    img.loading = "lazy";
    makeZoomable(img);
    fig.appendChild(img);
    if (evidenceImage.caption) fig.appendChild(el("figcaption", null, evidenceImage.caption + " Kliknutím na obrázok ho zväčšíte."));
    card.appendChild(fig);
  }

  function galleryBlock(card, items) {
    if (!items || !items.length) return;
    const wrap = el("div", "course-gallery");
    items.forEach((item) => {
      const fig = el("figure", "course-evidence");
      const img = el("img");
      img.src = item.src;
      img.alt = item.caption || "Skutočný príklad";
      img.loading = "lazy";
      makeZoomable(img);
      fig.appendChild(img);
      if (item.caption) fig.appendChild(el("figcaption", null, item.caption + " Kliknutím na obrázok ho zväčšíte."));
      wrap.appendChild(fig);
    });
    card.appendChild(wrap);
  }

  // ---------- Renderery jednotlivých typov ----------

  const RENDERERS = {};

  RENDERERS.intro = function (slide, card) {
    card.appendChild(el("div", "course-badge", "Interaktívny kurz"));
    if (slide.image) {
      const img = el("img", "course-intro-photo");
      img.src = slide.image;
      img.alt = "";
      card.appendChild(img);
    }
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

  const BASKET_ICONS = {
    danger: "<path d='M12 3l8 4v5c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V7l8-4Z'/><path d='M9.5 12l2 2 3.5-3.5'/>",
    safe: "<path d='M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.6 8.6 0 0 1-3.7-.8L4 20l1-4.6a8.3 8.3 0 0 1-1-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z'/>",
    basket: "<path d='M4 10h16l-1.6 9.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 10Z'/><path d='M2.5 10h19'/><path d='M8.5 10 10 4h4l1.5 6'/><path d='M10 14v3M14 14v3'/>",
  };
  const SIDENOTE_ICONS = {
    good: "<path d='M4 12l5 5L20 6'/>",
    warn: "<path d='M12 9v4M12 17h.01'/><circle cx='12' cy='12' r='9'/>",
    info: "<circle cx='9' cy='7' r='3'/><path d='M2 20c0-3.3 3-6 7-6s7 2.7 7 6'/><path d='M17 8c1.7.4 3 2 3 4M20 20c0-2-1-3.6-2.5-4.5'/>",
  };

  function tipCallout(text) {
    if (!text) return null;
    return el("div", "course-tip",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='9'/><path d='M12 11v5M12 8h.01'/></svg>" +
      "<p><strong>Tip:</strong> " + text + "</p>");
  }

  function sideNotePanel(sideNote) {
    if (!sideNote) return null;
    const panel = el("aside", "course-sidenote");
    panel.appendChild(el("h3", null, sideNote.title || "Zapamätajte si"));
    const list = el("div", "course-sidenote-list");
    sideNote.items.forEach((it) => {
      list.appendChild(el("div", "course-sidenote-item " + (it.tone || "info"),
        "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>" + (SIDENOTE_ICONS[it.tone] || SIDENOTE_ICONS.info) + "</svg><span>" + it.text + "</span>"));
    });
    panel.appendChild(list);
    return panel;
  }

  RENDERERS.sort = function (slide, card) {
    header(card, slide);
    const tip = tipCallout(slide.tip);
    if (tip) card.appendChild(tip);

    const layout = el("div", "course-sort-layout" + (slide.sideNote ? " has-side" : ""));
    const mainCol = el("div", "course-sort-main");
    layout.appendChild(mainCol);
    const sideNote = sideNotePanel(slide.sideNote);
    if (sideNote) layout.appendChild(sideNote);
    card.appendChild(layout);

    const items = shuffle(slide.items);
    const pool = el("div", "course-pool");
    const basketsWrap = el("div", "course-baskets course-baskets-" + slide.baskets.length);
    const baskets = {};

    slide.baskets.forEach((b) => {
      const basket = el("div", "course-basket" + (b.tone ? " tone-" + b.tone : ""));
      basket.dataset.basket = b.id;
      const icon = BASKET_ICONS[b.tone] || BASKET_ICONS.basket;
      basket.appendChild(el("div", "course-basket-label",
        "<span class='course-basket-icon-wrap'><svg class='course-basket-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8'>" + icon + "</svg></span>" +
        "<span class='course-basket-text'><span class='course-basket-title'>" + b.label + "</span>" +
        (b.desc ? "<span class='course-basket-desc'>" + b.desc + "</span>" : "") + "</span>"));
      const drop = el("div", "course-basket-drop");
      basket.appendChild(drop);
      basketsWrap.appendChild(basket);
      baskets[b.id] = drop;
    });

    let selected = null;
    let remaining = items.length;
    const status = el("p", "course-hint course-hint-pill", "Zostáva umiestniť: <strong>" + remaining + "</strong>");

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
        status.innerHTML = remaining > 0 ? "Zostáva umiestniť: <strong>" + remaining + "</strong>" : "Hotovo — skontrolujte si červeno označené kartičky.";
      }
    }

    items.forEach((item, i) => {
      const it = el("div", "course-item", "<span class='course-item-num'>" + (i + 1) + "</span><span>" + item.text + "</span>");
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

    mainCol.appendChild(pool);
    mainCol.appendChild(basketsWrap);
    mainCol.appendChild(status);
    note(mainCol, slide.note);
  };

  RENDERERS.match = function (slide, card) {
    header(card, slide);
    const wrap = el("div", "course-match");
    const linesSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    linesSvg.setAttribute("class", "course-match-lines");
    wrap.appendChild(linesSvg);
    const leftCol = el("div", "course-match-col");
    const rightCol = el("div", "course-match-col");
    const rightsShuffled = shuffle(slide.pairs.map((p, i) => ({ text: p.right, i })));

    let selLeft = null, selRight = null;
    let solved = 0;
    const status = el("p", "course-hint", "Spojené: 0 z " + slide.pairs.length);

    function drawLine(leftEl, rightEl) {
      const wrapRect = wrap.getBoundingClientRect();
      linesSvg.setAttribute("width", wrapRect.width);
      linesSvg.setAttribute("height", wrapRect.height);
      const r1 = leftEl.getBoundingClientRect();
      const r2 = rightEl.getBoundingClientRect();
      const x1 = r1.right - wrapRect.left, y1 = r1.top + r1.height / 2 - wrapRect.top;
      const x2 = r2.left - wrapRect.left, y2 = r2.top + r2.height / 2 - wrapRect.top;
      const midX = (x1 + x2) / 2;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M " + x1 + " " + y1 + " C " + midX + " " + y1 + ", " + midX + " " + y2 + ", " + x2 + " " + y2);
      path.setAttribute("class", "course-match-thread");
      linesSvg.appendChild(path);
    }

    const leftEls = slide.pairs.map((p, i) => {
      const e2 = el("div", "course-match-item", p.left);
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
        drawLine(selLeft, selRight);
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
    galleryBlock(card, slide.gallery);
  };

  RENDERERS.sequence = function (slide, card) {
    header(card, slide);
    const list = el("div", "course-sequence");
    const shuffled = shuffle(slide.steps.map((s, i) => ({ text: s, i })));
    let nextExpected = 0;
    const status = el("p", "course-hint", "Kliknite na krok číslo 1.");

    shuffled.forEach((s) => {
      const item = el("button", "course-seq-item",
        "<span class='course-seq-num'></span><span class='course-seq-text'>" + s.text + "</span>");
      item.type = "button";
      const numEl = item.querySelector(".course-seq-num");
      item.addEventListener("click", () => {
        if (item.classList.contains("done")) return;
        if (s.i === nextExpected) {
          item.classList.add("done");
          numEl.textContent = nextExpected + 1;
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
    const hasPhoto = !!slide.evidenceImage;
    const screen = el("div", "course-hotspot-screen" + (hasPhoto ? " has-photo" : ""));
    if (hasPhoto) {
      const img = el("img", "course-hotspot-photo");
      img.src = slide.evidenceImage.src;
      img.alt = slide.evidenceImage.caption || "";
      makeZoomable(img);
      screen.appendChild(img);
    } else {
      const mock = el("div", "course-hotspot-mock",
        "<div class='chp-side'></div><div class='chp-main'><div class='chp-bubble'></div><div class='chp-bubble short'></div></div><div class='chp-input'></div>");
      screen.appendChild(mock);
    }
    let found = 0;
    const status = el("p", "course-hint", "Kliknite na očíslované miesta na obrázku — nájdených: 0 z " + slide.spots.length);
    const legend = el("div", "course-hotspot-legend");

    const legendItems = slide.spots.map((s, i) => {
      const row = el("div", "course-hotspot-legend-item");
      row.appendChild(el("div", "course-hotspot-legend-num", String(i + 1)));
      row.appendChild(el("div", "course-hotspot-legend-text", "<h4>" + s.title + "</h4><p>" + s.text + "</p>"));
      legend.appendChild(row);
      return row;
    });

    slide.spots.forEach((s, i) => {
      const dot = el("button", "course-hotspot-dot", String(i + 1));
      dot.type = "button";
      dot.style.left = s.x + "%";
      dot.style.top = s.y + "%";
      dot.addEventListener("click", () => {
        if (dot.classList.contains("found")) return;
        dot.classList.add("found");
        legendItems[i].classList.add("found");
        found++;
        status.textContent = found >= slide.spots.length ? "Objavili ste všetko!" : "Nájdených: " + found + " z " + slide.spots.length;
      });
      screen.appendChild(dot);
    });

    card.appendChild(screen);
    card.appendChild(status);
    card.appendChild(legend);
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
    evidenceFigure(card, slide.evidenceImage);
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

    const layout = el("div", "course-quickfire-layout");
    const sidebar = el("div", "course-quickfire-sidebar");
    const main = el("div", "course-quickfire-main");
    layout.appendChild(sidebar);
    layout.appendChild(main);
    card.appendChild(layout);

    if (slide.tips && slide.tips.length) {
      card.appendChild(el("div", "course-quickfire-tips",
        "<div class='course-quickfire-tips-icon'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6'><path d='M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z'/><path d='M9 12l2 2 4-4'/></svg></div>" +
        "<div><p class='course-quickfire-tips-title'>Na čo myslieť?</p><ul>" + slide.tips.map((t) => "<li>" + t + "</li>").join("") + "</ul></div>"));
    }

    let idx = 0, correct = 0;
    const answered = new Array(slide.questions.length).fill(null);

    const sideItems = slide.questions.map((q, i) => {
      const item = el("div", "course-quickfire-side-item",
        "<span class='course-quickfire-side-num'>" + (i + 1) + "</span><span>" + (q.short || q.text) + "</span>");
      sidebar.appendChild(item);
      return item;
    });

    function updateSidebar() {
      sideItems.forEach((item, i) => {
        item.classList.toggle("current", i === idx);
        item.classList.toggle("done", answered[i] !== null);
        item.classList.toggle("correct", answered[i] === true);
        item.classList.toggle("incorrect", answered[i] === false);
        if (answered[i] !== null) {
          item.querySelector(".course-quickfire-side-num").innerHTML =
            answered[i]
              ? "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.6'><path d='M4 12l5 5L20 6'/></svg>"
              : "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.6'><path d='M6 6l12 12M18 6 6 18'/></svg>";
        }
      });
    }

    function renderStep() {
      main.innerHTML = "";
      const q = slide.questions[idx];
      const qCard = el("div", "course-quickfire-card");
      qCard.appendChild(el("p", "course-quickfire-eyebrow",
        "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='9'/><path d='M12 17h.01M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5'/></svg>Otázka " + (idx + 1) + " z " + slide.questions.length));
      qCard.appendChild(el("div", "course-quickfire-question",
        "<span class='course-quickfire-bolt'><svg viewBox='0 0 24 24' fill='currentColor'><path d='M13 2 4 14h6l-1 8 9-12h-6l1-8Z'/></svg></span><span>" + q.text + "</span>"));

      const opts = el("div", "course-quickfire-opts");
      const yes = el("button", "course-quickfire-opt", "Áno");
      const no = el("button", "course-quickfire-opt", "Nie");
      [yes, no].forEach((b) => (b.type = "button"));
      opts.appendChild(yes);
      opts.appendChild(no);
      qCard.appendChild(opts);

      const hint = el("p", "course-quickfire-hint",
        "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='9'/><path d='M12 8h.01M11 12h1v4h1'/></svg>Po odpovedi sa zobrazí krátke vysvetlenie.");
      qCard.appendChild(hint);

      function lock(val) {
        yes.disabled = true; no.disabled = true;
        const ok = val === q.answer;
        if (ok) correct++;
        answered[idx] = ok;
        (val ? yes : no).classList.add(ok ? "correct" : "incorrect");
        updateSidebar();
        hint.remove();
        qCard.appendChild(el("div", "course-quickfire-explain " + (ok ? "good" : "warn"),
          "<strong>" + (ok ? "Správne." : "Nie celkom.") + "</strong> " + q.why));
        const isLast = idx + 1 >= slide.questions.length;
        const nextBtn = el("button", "btn btn-primary", isLast ? "Zobraziť výsledok" : "Ďalšia otázka");
        nextBtn.type = "button";
        nextBtn.style.marginTop = "1.1rem";
        nextBtn.addEventListener("click", () => {
          idx++;
          if (isLast) renderSummary(); else renderStep();
        });
        qCard.appendChild(nextBtn);
      }
      yes.addEventListener("click", () => lock(true));
      no.addEventListener("click", () => lock(false));

      main.appendChild(qCard);
      updateSidebar();
    }

    function renderSummary() {
      main.innerHTML = "";
      main.appendChild(el("div", "course-quickfire-card course-quickfire-summary",
        "<h3>Hotovo!</h3><p>Správne ste odpovedali na <strong>" + correct + " z " + slide.questions.length + "</strong> otázok.</p>"));
    }

    renderStep();
  };

  function initialsOf(text) {
    const words = String(text).replace(/[^a-zA-ZÀ-ž0-9 ]/g, " ").trim().split(/\s+/);
    return (words[0] || "?").slice(0, 2).toUpperCase();
  }

  RENDERERS.spot = function (slide, card) {
    header(card, slide);
    const medium = slide.medium || "email";

    const mock = el("div", "phone-mock");
    const shell = el("div", "phone-shell");
    shell.appendChild(el("div", "phone-statusbar", "<span>9:41</span><span>●●●●</span>"));
    const inner = el("div", "phone-inner");

    if (medium === "social") {
      inner.appendChild(el("div", "social-post-head",
        "<span class='mail-avatar'>" + initialsOf(slide.message.from) + "</span>" +
        "<span class='who'><b>" + slide.message.from + "</b><span>práve teraz</span></span>"));
    } else {
      inner.appendChild(el("div", "mail-app-head",
        "<span class='mail-avatar'>" + initialsOf(slide.message.from) + "</span>" +
        "<span class='who'><b>" + slide.message.from + "</b>" + (slide.message.subject ? "<span>Predmet: " + slide.message.subject + "</span>" : "") + "</span>"));
    }

    const body = el("div", medium === "social" ? "social-post-body" : "mail-body-new");
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
    inner.appendChild(body);
    shell.appendChild(inner);
    mock.appendChild(shell);
    card.appendChild(mock);

    const status = el("p", "course-hint", "Klikajte na podčiarknuté časti textu — nájdených: 0 z " + slide.clues.length);
    card.appendChild(status);
    const list = el("div", "course-clue-list");
    slide.clues.forEach((c) => {
      const item = el("div", "clue-list-item",
        "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 9v4M12 17h.01'/><circle cx='12' cy='12' r='9'/></svg><span>" + c + "</span>");
      list.appendChild(item);
    });
    card.appendChild(list);
    if (slide.footer) card.appendChild(el("p", "course-hint", slide.footer));
    evidenceFigure(card, slide.evidenceImage);
  };

  function storyFlagsRow(flags) {
    if (!flags || !flags.length) return null;
    const row = el("div", "course-story-flags");
    row.appendChild(el("span", "course-story-flags-label", "Na čo si dať pozor:"));
    flags.forEach((f) => row.appendChild(el("span", "course-story-flag-chip",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 9v4M12 17h.01'/><circle cx='12' cy='12' r='9'/></svg><span>" + f + "</span>")));
    return row;
  }

  function storySafeTip(text) {
    return el("div", "course-story-safe-tip",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8'><path d='M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z'/><path d='M9 12l2 2 4-4'/></svg>" +
      "<div><strong>Správny postup:</strong> " + text + "</div>");
  }

  function storyDecisionPanel(slide, node, onChoose) {
    const panel = el("div", "course-story-decision");
    panel.appendChild(el("p", "course-story-decision-eyebrow",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='9'/><path d='M12 17h.01M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5'/></svg><span>" +
      (node.choiceHint || "Čo urobíte? Kliknite na jednu z možností.") + "</span>"));
    const opts = el("div", "course-story-options");
    node.choices.forEach((c) => {
      const target = slide.nodes[c.to];
      const good = target && target.end === "good";
      const btn = el("button", "course-story-option " + (good ? "good" : "bad"),
        "<span class='course-story-option-icon'>" +
        (good
          ? "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.6'><path d='M4 12l5 5L20 6'/></svg>"
          : "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.6'><path d='M6 6l12 12M18 6 6 18'/></svg>") +
        "</span><span class='course-story-option-text'>" + c.text + "</span>" +
        "<svg class='course-story-option-arrow' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M9 6l6 6-6 6'/></svg>");
      btn.type = "button";
      btn.addEventListener("click", () => onChoose(c.to));
      opts.appendChild(btn);
    });
    panel.appendChild(opts);
    if (slide.safeTip) panel.appendChild(storySafeTip(slide.safeTip));
    return panel;
  }

  RENDERERS.story = function (slide, card, course) {
    header(card, slide);
    const medium = slide.medium;

    if (medium === "call") {
      renderCallStory(slide, card);
      return;
    }

    const grid = el("div", "course-story-grid");
    const mediaCol = el("div", "course-story-media");
    const panelCol = el("div", "course-story-panel-col");
    grid.appendChild(mediaCol);
    grid.appendChild(panelCol);
    card.appendChild(grid);
    const flagsRow = storyFlagsRow(slide.flags);
    if (flagsRow) card.appendChild(flagsRow);

    if (medium === "sms") {
      const mock = el("div", "phone-mock");
      const shell = el("div", "phone-shell");
      shell.appendChild(el("div", "phone-statusbar", "<span>9:41</span><span>●●●●</span>"));
      const inner = el("div", "phone-inner sms-thread");
      shell.appendChild(inner);
      mock.appendChild(shell);
      mediaCol.appendChild(mock);

      const renderNode = (id) => {
        const node = slide.nodes[id];
        panelCol.innerHTML = "";
        if (node.end) {
          panelCol.appendChild(el("div", "course-story-result " + (node.end === "good" ? "good" : "warn"), node.text));
          return;
        }
        inner.appendChild(el("div", "sms-bubble in", "<span class='sms-sender'>" + node.speaker + "</span>" + node.text));
        panelCol.appendChild(storyDecisionPanel(slide, node, (to) => {
          const chosen = node.choices.find((c) => c.to === to);
          inner.appendChild(el("div", "sms-bubble out", chosen.text));
          setTimeout(() => renderNode(to), 250);
        }));
      };
      renderNode(slide.start);
      return;
    }

    // Fallback — obyčajná bublina rozhovoru (bez konkrétneho média).
    const renderNode = (id) => {
      const node = slide.nodes[id];
      mediaCol.innerHTML = "";
      panelCol.innerHTML = "";
      if (node.end) {
        panelCol.appendChild(el("div", "course-story-result " + (node.end === "good" ? "good" : "warn"), node.text));
        return;
      }
      mediaCol.appendChild(el("div", "course-story-bubble", "<strong>" + node.speaker + ":</strong><br>" + node.text));
      panelCol.appendChild(storyDecisionPanel(slide, node, (to) => renderNode(to)));
    };
    renderNode(slide.start);
  };

  function renderCallStory(slide, card) {
    const grid = el("div", "course-story-grid");
    const mediaCol = el("div", "course-story-media");
    const panelCol = el("div", "course-story-panel-col");
    grid.appendChild(mediaCol);
    grid.appendChild(panelCol);
    card.appendChild(grid);
    const flagsRow = storyFlagsRow(slide.flags);
    if (flagsRow) card.appendChild(flagsRow);

    const shell = el("div", "call-shell");
    const inner = el("div", "call-inner");
    shell.appendChild(inner);
    mediaCol.appendChild(shell);

    function showRinging() {
      const node = slide.nodes[slide.start];
      inner.innerHTML =
        "<div class='call-avatar'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6'><circle cx='12' cy='8' r='4'/><path d='M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8'/></svg></div>" +
        "<div class='caller'>" + node.speaker + "</div><div class='sub'>prichádzajúci hovor…</div>" +
        "<div class='call-actions'>" +
        "<div class='call-btn decline' id='call-decline'><div class='circle'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2'><path d='M22 2 2 22M2 2l20 20'/></svg></div>Odmietnuť</div>" +
        "<div class='call-btn accept' id='call-accept'><div class='circle'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2'><path d='M15.05 5A5 5 0 0 1 19 8.95m-3.95-7.95A9 9 0 0 1 23 8.94'/><path d='M9 5.5c-1.9.7-3.5 2.3-3.5 5.5 0 5 4.5 9.5 9.5 9.5 3.2 0 4.8-1.6 5.5-3.5'/></svg></div>Prijať</div>" +
        "</div>";
      panelCol.innerHTML = "";
      panelCol.appendChild(el("div", "course-story-hint-box",
        "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M7 10v4a5 5 0 0 0 10 0v-4M12 19v3M12 3v9'/></svg>" +
        "<p>Kliknite na zelené tlačidlo <strong>„Prijať“</strong>, ak chcete hovor zdvihnúť — presne tak, ako by ste to urobili na svojom telefóne. Alebo kliknite na červené <strong>„Odmietnuť“</strong>, ak hovor nechcete prijať.</p>"));
      inner.querySelector("#call-accept").addEventListener("click", () => showNode(slide.start, node));
      inner.querySelector("#call-decline").addEventListener("click", () => {
        panelCol.innerHTML = "";
        panelCol.appendChild(el("div", "course-note", "<strong>Dobrá voľba aj toto:</strong> hovor od neznámeho čísla vôbec nemusíte prijímať. Ak je to niečo dôležité, ozvú sa iným spôsobom."));
      });
    }

    function showNode(id, preloadedNode) {
      const node = preloadedNode || slide.nodes[id];
      if (node.end) {
        inner.innerHTML =
          "<div class='call-avatar'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6'><circle cx='12' cy='8' r='4'/><path d='M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8'/></svg></div>" +
          "<div class='caller'>Hovor ukončený</div>";
        panelCol.innerHTML = "";
        panelCol.appendChild(el("div", "course-story-result " + (node.end === "good" ? "good" : "warn"), node.text));
        return;
      }
      inner.innerHTML =
        "<div class='call-avatar'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6'><circle cx='12' cy='8' r='4'/><path d='M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8'/></svg></div>" +
        "<div class='caller'>" + node.speaker + "</div><div class='sub'>hovor prebieha…</div>" +
        "<div class='call-transcript'>„" + node.text + "“</div>";
      panelCol.innerHTML = "";
      panelCol.appendChild(storyDecisionPanel(slide, node, (to) => showNode(to)));
    }

    showRinging();
  }

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
    evidenceFigure(card, slide.evidenceImage);
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
      if (r.image) {
        const img = el("img", "course-guess-photo-img");
        img.src = r.image;
        img.alt = "";
        makeZoomable(img);
        roundBox.appendChild(img);
      } else {
        roundBox.appendChild(el("div", "course-guess-photo", r.prompt));
      }
      const opts = el("div", "course-choice-opts");
      const real = el("button", "course-choice-opt", "Skutočná fotografia");
      const ai = el("button", "course-choice-opt", "Vytvorená umelou inteligenciou");
      [real, ai].forEach((b) => (b.type = "button"));
      const result = el("div", "course-choice-result");
      function lock(val) {
        real.disabled = true; ai.disabled = true;
        const ok = val === r.answer;
        (val === "real" ? real : ai).classList.add(ok ? "correct" : "incorrect");
        result.innerHTML = "<strong>" + (ok ? "Uhádli ste!" : "Tentoraz nie.") + "</strong> " + (r.explain || "");
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
    card.appendChild(el("p", "course-hint", "Kliknite postupne na každé oranžovo zvýraznené slovo — vysvetlíme, prečo do otázky pre AI nepatrí."));

    const grid = el("div", "course-rewrite-grid");
    const unsafePanel = el("div", "course-rewrite-panel unsafe");
    unsafePanel.appendChild(el("p", "course-rewrite-panel-label",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 9v4M12 17h.01'/><circle cx='12' cy='12' r='9'/></svg>Nebezpečná otázka"));
    const sentenceEl = el("p", "course-rewrite-sentence");
    unsafePanel.appendChild(sentenceEl);
    const reasons = el("div", "course-rewrite-reasons");
    unsafePanel.appendChild(reasons);

    const safePanel = el("div", "course-rewrite-panel safe");
    safePanel.appendChild(el("p", "course-rewrite-panel-label",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4'><path d='M4 12l5 5L20 6'/></svg>Bezpečná otázka"));
    const safeBody = el("p", "course-rewrite-safe-body", "Kliknite na citlivé údaje vľavo — bezpečná verzia sa objaví tu.");
    safePanel.appendChild(safeBody);

    grid.appendChild(unsafePanel);
    grid.appendChild(safePanel);
    card.appendChild(grid);

    const removed = new Set();
    slide.sentence.forEach((part, i) => {
      if (part.sensitive) {
        const span = el("span", "course-rewrite-word sensitive", part.text);
        span.addEventListener("click", () => {
          if (removed.has(i)) return;
          removed.add(i);
          span.classList.add("removed");
          if (part.why) {
            reasons.appendChild(el("div", "course-rewrite-reason",
              "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 9v4M12 17h.01'/><circle cx='12' cy='12' r='9'/></svg>" +
              "<span><strong>„" + part.text + "“</strong> — " + part.why + "</span>"));
          }
          checkDone();
        });
        sentenceEl.appendChild(span);
      } else {
        sentenceEl.appendChild(document.createTextNode(" " + part.text + " "));
      }
    });

    const totalSensitive = slide.sentence.filter((p) => p.sensitive).length;
    function checkDone() {
      if (removed.size >= totalSensitive) {
        safePanel.classList.add("revealed");
        safeBody.innerHTML = "„" + slide.safeVersion + "“";
        if (slide.takeaway) card.appendChild(el("div", "course-note", "<strong>Zapamätajte si:</strong> " + slide.takeaway));
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
