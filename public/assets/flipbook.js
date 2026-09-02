// Listovanie brožúrky ako v skutočnej knihe.
//
// Vykresľuje stránky PDF do canvasu (cez PDF.js) a umožňuje ich obracať
// tlačidlami, prstom (potiahnutím), šípkami na klávesnici alebo kliknutím
// na okraj stránky.
//
// Na širokej obrazovke ukazuje dve strany vedľa seba ako otvorenú knihu,
// na tablete a mobile jednu stranu cez celú šírku.
//
// Ak sa PDF.js nepodarí načítať, volajúca stránka dostane cez `onFail`
// signál a môže zobraziť pôvodný PDF prehliadač.

(function () {
  "use strict";

  var PDFJS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  var PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  // PDF.js načítame len raz, aj keby sa flipbook otváral viackrát.
  var pdfjsPromise = null;
  function loadPdfJs() {
    if (pdfjsPromise) return pdfjsPromise;
    pdfjsPromise = new Promise(function (resolve, reject) {
      if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
      var s = document.createElement("script");
      s.src = PDFJS_SRC;
      s.onload = function () {
        if (!window.pdfjsLib) { reject(new Error("pdfjsLib sa nenačítal")); return; }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(window.pdfjsLib);
      };
      s.onerror = function () { reject(new Error("PDF.js sa nepodarilo stiahnuť")); };
      document.head.appendChild(s);
    });
    return pdfjsPromise;
  }

  function Flipbook(container, opts) {
    this.container = container;
    this.opts = opts || {};
    this.pdf = null;
    this.total = 0;
    this.index = 0;          // index ľavej strany aktuálneho rozloženia
    this.spread = false;     // true = dve strany vedľa seba
    this.cache = {};         // vykreslené stránky (dataURL), aby sa nerobili znova
    this.rendering = {};
    this.busy = false;
    this.drawToken = 0;
    this.destroyed = false;
    this.imageBase = null;
    this.justSwiped = false;
  }

  // ---------- Vykreslenie jednej strany PDF do obrázka ----------

  Flipbook.prototype.renderPage = function (pageNum) {
    var self = this;
    if (this.cache[pageNum]) return Promise.resolve(this.cache[pageNum]);
    if (this.rendering[pageNum]) return this.rendering[pageNum];
    if (pageNum < 1 || pageNum > this.total) return Promise.resolve(null);

    // Ak sú strany pripravené vopred ako obrázky, netreba nič počítať —
    // listovanie je potom okamžité aj na staršom tablete.
    if (this.imageBase) {
      this.cache[pageNum] = { url: this.imageBase + "page-" + (pageNum < 10 ? "0" : "") + pageNum + ".jpg" };
      return Promise.resolve(this.cache[pageNum]);
    }

    this.rendering[pageNum] = this.pdf.getPage(pageNum).then(function (page) {
      // Šírku odvodíme od veľkosti okna, aby bol text ostrý aj na
      // retina displejoch, ale zbytočne sa nekreslilo priveľa pixelov.
      var targetW = Math.min(900, Math.max(480, Math.round(window.innerWidth * (self.spread ? 0.48 : 0.92))));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var base = page.getViewport({ scale: 1 });
      var scale = (targetW / base.width) * dpr;
      var viewport = page.getViewport({ scale: scale });

      var canvas = document.createElement("canvas");
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      return page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
        var url = canvas.toDataURL("image/jpeg", 0.86);
        self.cache[pageNum] = { url: url, w: canvas.width, h: canvas.height };
        delete self.rendering[pageNum];
        return self.cache[pageNum];
      });
    }).catch(function (err) {
      delete self.rendering[pageNum];
      console.error("Stranu " + pageNum + " sa nepodarilo vykresliť:", err);
      return null;
    });

    return this.rendering[pageNum];
  };

  Flipbook.prototype.renderPageUrl = function (pageNum) {
    return this.imageBase + "page-" + (pageNum < 10 ? "0" : "") + pageNum + ".jpg";
  };

  // Dopredu si pripravíme susedné strany, aby listovanie nezasekávalo.
  Flipbook.prototype.preload = function () {
    var step = this.spread ? 2 : 1;
    var ahead = [this.index + step + 1, this.index + step + 2, this.index - step + 1, this.index - step + 2];
    var self = this;
    ahead.forEach(function (p) {
      if (p >= 1 && p <= self.total) self.renderPage(p);
    });
  };

  // Vykreslenie jednej strany trvá aj niekoľko sekúnd — záleží, koľko
  // obrázkov na nej je. Aby senior pri listovaní nečakal, pripravujeme si
  // celú brožúrku potichu na pozadí už počas toho, ako číta prvé strany.
  // Ide o jednu stranu naraz, s pauzami, aby to nespomalilo zvyšok stránky.
  Flipbook.prototype.startBackgroundPrefetch = function () {
    var self = this;
    var next = 1;

    function idle(fn) {
      if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 1200 });
      else setTimeout(fn, 250);
    }

    function step() {
      if (self.destroyed) return;
      while (next <= self.total && self.cache[next]) next++;
      if (next > self.total) return;              // všetko je pripravené
      if (self.busy) { idle(step); return; }      // nechme prednosť tomu, čo používateľ práve číta
      var page = next++;
      if (self.imageBase) {
        // Obrázok si necháme stiahnuť do medzipamäte prehliadača.
        var pre = new Image();
        pre.onload = pre.onerror = function () { idle(step); };
        pre.src = self.renderPageUrl(page);
        return;
      }
      self.renderPage(page).then(function () { idle(step); }, function () { idle(step); });
    }

    idle(step);
  };

  // ---------- Zloženie ovládania ----------

  Flipbook.prototype.build = function () {
    var self = this;
    this.container.innerHTML = "";
    var root = el("div", "flipbook");

    // Plocha knihy
    var stage = el("div", "flipbook-stage");
    this.stage = stage;
    this.pagesWrap = el("div", "flipbook-pages");
    stage.appendChild(this.pagesWrap);
    root.appendChild(stage);

    // Ovládanie pod knihou — veľké tlačidlá, aby sa dobre trafili
    var nav = el("div", "flipbook-nav");

    this.prevBtn = el("button", "flipbook-btn flipbook-prev",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4'><path d='M15 6l-6 6 6 6'/></svg><span>Predošlá</span>");
    this.prevBtn.type = "button";
    this.prevBtn.setAttribute("aria-label", "Predošlá strana");
    this.prevBtn.addEventListener("click", function () { self.go(-1); });

    this.indicator = el("div", "flipbook-indicator");

    this.nextBtn = el("button", "flipbook-btn flipbook-next",
      "<span>Ďalšia</span><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4'><path d='M9 6l6 6-6 6'/></svg>");
    this.nextBtn.type = "button";
    this.nextBtn.setAttribute("aria-label", "Ďalšia strana");
    this.nextBtn.addEventListener("click", function () { self.go(1); });

    nav.appendChild(this.prevBtn);
    nav.appendChild(this.indicator);
    nav.appendChild(this.nextBtn);
    root.appendChild(nav);

    // Posuvník na rýchly skok v rámci brožúrky
    var jump = el("div", "flipbook-jump");
    this.slider = el("input", "flipbook-slider");
    this.slider.type = "range";
    this.slider.min = "1";
    this.slider.step = "1";
    this.slider.setAttribute("aria-label", "Skok na stranu");
    this.slider.addEventListener("input", function () {
      var target = Number(self.slider.value) - 1;
      if (self.spread) target = target - (target % 2);
      self.index = Math.max(0, Math.min(target, self.lastIndex()));
      self.draw(0);
    });
    jump.appendChild(el("span", "flipbook-jump-label", "Rýchly skok na stranu"));
    jump.appendChild(this.slider);
    root.appendChild(jump);

    root.appendChild(el("p", "flipbook-hint",
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M9 11V6a2 2 0 1 1 4 0v5'/><path d='M13 9V5a2 2 0 1 1 4 0v6'/><path d='M17 9.5a2 2 0 1 1 4 0V15a6 6 0 0 1-6 6h-2a7 7 0 0 1-7-7v-4a2 2 0 1 1 4 0'/></svg>" +
      "Stranu obrátite tlačidlami, potiahnutím prsta alebo šípkami na klávesnici. Kliknutím na stranu si ju zväčšíte."));

    this.container.appendChild(root);
    this.root = root;

    this.bindGestures(stage);
    this.bindKeys();
  };

  Flipbook.prototype.lastIndex = function () {
    return this.spread ? Math.max(0, this.total - (this.total % 2 === 0 ? 2 : 1)) : this.total - 1;
  };

  // ---------- Potiahnutie prstom a klávesnica ----------

  Flipbook.prototype.bindGestures = function (stage) {
    var self = this;
    var startX = null, startY = null, moved = false;

    stage.addEventListener("pointerdown", function (e) {
      startX = e.clientX; startY = e.clientY; moved = false;
    });
    stage.addEventListener("pointermove", function (e) {
      if (startX === null) return;
      if (Math.abs(e.clientX - startX) > 12) moved = true;
    });
    stage.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      startX = null; startY = null;
      // Vodorovné potiahnutie = listovanie. Kliknutie, ktoré po ňom príde,
      // už nesmie otvoriť zväčšenie — preto si ťah poznačíme.
      if (moved && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        self.justSwiped = true;
        self.go(dx < 0 ? 1 : -1);
      }
    });
    stage.addEventListener("pointercancel", function () { startX = null; });

    // Zväčšenie riešime cez `click` — funguje myšou, prstom aj z klávesnice.
    stage.addEventListener("click", function (e) {
      if (self.justSwiped) { self.justSwiped = false; return; }
      var img = e.target.closest ? e.target.closest(".flipbook-page-img") : null;
      if (img) self.zoom(img.src, img.alt);
    });
  };

  Flipbook.prototype.bindKeys = function () {
    var self = this;
    this._onKey = function (e) {
      // Reagujeme len keď je brožúrka naozaj na obrazovke.
      if (!self.root || !self.root.offsetParent) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { self.go(1); e.preventDefault(); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { self.go(-1); e.preventDefault(); }
    };
    document.addEventListener("keydown", this._onKey);
  };

  // ---------- Zväčšenie strany ----------

  Flipbook.prototype.zoom = function (src, alt) {
    var box = document.getElementById("flipbook-lightbox");
    if (!box) {
      box = el("div", "flipbook-lightbox",
        "<button type='button' class='flipbook-lightbox-close' aria-label='Zavrieť'>" +
        "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4'><path d='M6 6l12 12M18 6 6 18'/></svg></button>" +
        "<img class='flipbook-lightbox-img' alt=''>");
      box.id = "flipbook-lightbox";
      document.body.appendChild(box);
      var close = function () { box.classList.remove("show"); };
      box.addEventListener("click", function (e) { if (e.target === box) close(); });
      box.querySelector(".flipbook-lightbox-close").addEventListener("click", close);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    }
    var img = box.querySelector(".flipbook-lightbox-img");
    img.src = src;
    img.alt = alt || "Zväčšená strana brožúrky";
    box.classList.add("show");
  };

  // ---------- Listovanie ----------

  Flipbook.prototype.go = function (dir) {
    if (this.busy) return;
    var step = this.spread ? 2 : 1;
    var next = this.index + dir * step;
    if (next < 0 || next > this.lastIndex()) return;
    this.index = next;
    this.draw(dir);
  };

  // Vykreslí aktuálne rozloženie. `dir` určuje smer animácie obracania.
  Flipbook.prototype.draw = function (dir) {
    var self = this;
    var pages = this.spread ? [this.index + 1, this.index + 2] : [this.index + 1];
    this.busy = true;

    // Ak sa medzitým používateľ presunie inam (napr. posuvníkom), staršie
    // vykreslenie už nechceme zobraziť — rozoznáme ho podľa tohto čísla.
    var token = ++this.drawToken;

    // Ak stránky ešte nie sú pripravené, dáme najavo, že sa načítavajú.
    var needsRender = pages.some(function (p) { return p >= 1 && p <= self.total && !self.cache[p]; });
    if (needsRender && self.stage) self.stage.classList.add("loading");

    return Promise.all(pages.map(function (p) { return self.renderPage(p); })).then(function (results) {
      if (token !== self.drawToken) return;   // medzitým prišlo novšie vykreslenie
      if (self.stage) self.stage.classList.remove("loading");
      var sheet = el("div", "flipbook-sheet" + (self.spread ? " spread" : ""));
      results.forEach(function (r, i) {
        var slot = el("div", "flipbook-page" + (self.spread ? (i === 0 ? " left" : " right") : ""));
        if (r) {
          var img = el("img", "flipbook-page-img");
          img.src = r.url;
          img.alt = "Strana " + pages[i] + " brožúrky";
          img.draggable = false;
          slot.appendChild(img);
        } else {
          slot.classList.add("blank");
        }
        sheet.appendChild(slot);
      });

      // Animácia obracania — ak ju prehliadač alebo nastavenie nepodporuje,
      // stránka sa jednoducho prepne bez efektu.
      var old = self.pagesWrap.firstChild;
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (old && dir && !reduce) {
        sheet.classList.add(dir > 0 ? "turn-in-next" : "turn-in-prev");
        old.classList.add(dir > 0 ? "turn-out-next" : "turn-out-prev");
        self.pagesWrap.appendChild(sheet);
        setTimeout(function () {
          if (old.parentNode) old.parentNode.removeChild(old);
          sheet.classList.remove("turn-in-next", "turn-in-prev");
          self.busy = false;
        }, 420);
      } else {
        self.pagesWrap.innerHTML = "";
        self.pagesWrap.appendChild(sheet);
        self.busy = false;
      }

      self.updateControls();
      self.preload();
    }).catch(function (err) {
      console.error("Brožúrku sa nepodarilo vykresliť:", err);
      if (self.stage) self.stage.classList.remove("loading");
      self.busy = false;
    });
  };

  Flipbook.prototype.updateControls = function () {
    var first = this.index + 1;
    var last = this.spread ? Math.min(this.index + 2, this.total) : first;
    this.indicator.innerHTML = (first === last)
      ? "Strana <strong>" + first + "</strong> z " + this.total
      : "Strany <strong>" + first + "–" + last + "</strong> z " + this.total;
    this.prevBtn.disabled = this.index <= 0;
    this.nextBtn.disabled = this.index >= this.lastIndex();
    this.slider.max = String(this.total);
    this.slider.value = String(first);
  };

  // ---------- Prispôsobenie šírke okna ----------

  Flipbook.prototype.applyLayout = function () {
    // Dve strany vedľa seba dávajú zmysel až od šírky, kde je text čitateľný.
    var wide = window.innerWidth >= 900;
    if (wide === this.spread) return false;
    this.spread = wide;
    // Pri prepnutí sa zmení cieľová šírka vykreslenia — cache zahodíme.
    // Vopred pripravené obrázky sú na šírke nezávislé, tých sa to netýka.
    if (!this.imageBase) this.cache = {};
    if (this.spread) this.index = this.index - (this.index % 2);
    this.index = Math.max(0, Math.min(this.index, this.lastIndex()));
    return true;
  };

  // Skusí nájsť vopred pripravené obrázky strán (rýchlejšie než počítanie
  // z PDF priamo v prehliadači). Ak neexistujú, vráti null.
  Flipbook.prototype.tryImages = function (pdfUrl) {
    var base = pdfUrl.replace(/\.pdf(\?.*)?$/i, "-strany/");
    if (base === pdfUrl) return Promise.resolve(null);
    return fetch(base + "manifest.json", { cache: "force-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) { return (m && m.pages) ? { base: base, pages: m.pages } : null; })
      .catch(function () { return null; });
  };

  Flipbook.prototype.start = function (url) {
    var self = this;
    this.container.innerHTML = "";
    var loading = el("div", "flipbook-loading",
      "<div class='flipbook-spinner' aria-hidden='true'></div><p>Pripravujeme brožúrku na listovanie…</p>");
    this.container.appendChild(loading);

    return this.tryImages(url).then(function (imgs) {
      if (imgs) {
        self.imageBase = imgs.base;
        self.total = imgs.pages;
        self.applyLayout();
        self.build();
        return self.draw(0);
      }
      // Záložná cesta — strany vypočítame priamo z PDF.
      return loadPdfJs().then(function (pdfjsLib) {
        return pdfjsLib.getDocument(url).promise;
      }).then(function (pdf) {
        self.pdf = pdf;
        self.total = pdf.numPages;
        self.applyLayout();
        self.build();
        return self.draw(0);
      });
    }).then(function () {
      // Pri zmene veľkosti okna prepneme medzi jednou a dvomi stranami.
      var resizeTimer = null;
      self._onResize = function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          if (self.applyLayout()) { self.build(); self.draw(0); }
        }, 250);
      };
      window.addEventListener("resize", self._onResize);
      self.startBackgroundPrefetch();
      if (self.opts.onReady) self.opts.onReady(self.total);
    }).catch(function (err) {
      console.error("Brožúrku sa nepodarilo otvoriť na listovanie:", err);
      if (self.opts.onFail) self.opts.onFail(err);
    });
  };

  // Umožní flipbook korektne ukončiť — odpojí posluchačov a zastaví
  // prípravu strán na pozadí, aby nič nebežalo zbytočne.
  Flipbook.prototype.destroy = function () {
    this.destroyed = true;
    if (this._onKey) document.removeEventListener("keydown", this._onKey);
    if (this._onResize) window.removeEventListener("resize", this._onResize);
    this.cache = {};
  };

  window.initFlipbook = function (container, opts) {
    var fb = new Flipbook(container, opts);
    fb.start(opts.url);
    return fb;
  };
})();
