// Zdieľaná logika: Firebase inicializácia, veľkosť textu, neaktivita/odhlásenie.

(function initFirebase() {
  if (window.firebase && window.FIREBASE_CONFIG) {
    firebase.initializeApp(window.FIREBASE_CONFIG);
  }
})();

// --- Affiliate/partnerský odkaz: ?ref=KOD si zapamätáme, aby sa dal
// zľavový kód automaticky predvyplniť pri neskoršej objednávke ---
(function affiliateRef() {
  try {
    const ref = new URLSearchParams(location.search).get("ref");
    if (ref) {
      localStorage.setItem("mbo_ref_code", ref.trim().toUpperCase());
      localStorage.setItem("mbo_ref_code_at", String(Date.now()));
    }
  } catch (err) { /* localStorage nemusí byť dostupný, nevadí */ }
})();

// --- Veľkosť textu (A+ / A-), uložená per zariadenie ---
(function textScale() {
  const STORAGE_KEY = "mbo_font_scale";
  const MIN = 0.85, MAX = 1.5, STEP = 0.1;

  function apply(scale) {
    document.documentElement.style.setProperty("--font-scale", scale);
  }

  function load() {
    const saved = parseFloat(localStorage.getItem(STORAGE_KEY));
    const scale = Number.isFinite(saved) ? saved : 1;
    apply(scale);
    return scale;
  }

  let current = load();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-text-scale]");
    if (!btn) return;
    const dir = btn.getAttribute("data-text-scale");
    current = Math.min(MAX, Math.max(MIN, current + (dir === "up" ? STEP : -STEP)));
    current = Math.round(current * 100) / 100;
    apply(current);
    localStorage.setItem(STORAGE_KEY, String(current));
  });
})();

// --- Neaktivita a automatické odhlásenie po 5 minútach ---
// Výnimka: kým beží video (window.MBO_VIDEO_PLAYING === true), časovač sa nepočíta.
window.MBO_VIDEO_PLAYING = false;

const MBO = {
  INACTIVITY_LIMIT_MS: 5 * 60 * 1000,
  WARNING_BEFORE_MS: 60 * 1000,
  _warnTimer: null,
  _logoutTimer: null,
  _modalEl: null,

  startInactivityWatch(onLogout, limitMinutes) {
    if (limitMinutes && Number(limitMinutes) > 0) {
      this.INACTIVITY_LIMIT_MS = Number(limitMinutes) * 60 * 1000;
    }
    const reset = () => this._resetTimers(onLogout);
    ["mousemove", "mousedown", "keydown", "scroll", "touchstart"].forEach((evt) =>
      window.addEventListener(evt, reset, { passive: true })
    );
    reset();
  },

  _resetTimers(onLogout) {
    clearTimeout(this._warnTimer);
    clearTimeout(this._logoutTimer);
    this._hideWarning();
    if (window.MBO_VIDEO_PLAYING) return;

    const warnAt = this.INACTIVITY_LIMIT_MS - this.WARNING_BEFORE_MS;
    this._warnTimer = setTimeout(() => this._showWarning(onLogout), warnAt);
    this._logoutTimer = setTimeout(() => onLogout("neaktivita"), this.INACTIVITY_LIMIT_MS);
  },

  _showWarning(onLogout) {
    if (window.MBO_VIDEO_PLAYING) return;
    if (this._modalEl) return;
    const modal = document.createElement("div");
    modal.setAttribute("role", "alertdialog");
    modal.setAttribute("aria-modal", "true");
    modal.style.cssText =
      "position:fixed;inset:0;background:rgba(31,58,61,.55);display:flex;" +
      "align-items:center;justify-content:center;z-index:9999;padding:1rem;";
    modal.innerHTML =
      '<div class="card" style="max-width:420px;text-align:center;">' +
      "<h2>Ste tam ešte?</h2>" +
      "<p>Za chvíľu vás z dôvodu neaktivity odhlásime, aby bol váš postup v bezpečí.</p>" +
      '<button class="btn btn-primary btn-block" type="button" data-mbo-stay>Zostať prihlásený(á)</button>' +
      "</div>";
    document.body.appendChild(modal);
    this._modalEl = modal;
    modal.querySelector("[data-mbo-stay]").addEventListener("click", () => {
      this._resetTimers(onLogout);
    });
  },

  _hideWarning() {
    if (this._modalEl) {
      this._modalEl.remove();
      this._modalEl = null;
    }
  },
};

// --- Informácie o zariadení/prehliadači (pre bezpečnostný a prevádzkový log pri registrácii a prihlásení) ---
MBO.getClientInfo = function () {
  const ua = navigator.userAgent || "";

  let deviceType = "Počítač";
  if (/iPad|Android(?!.*Mobile)|Tablet|Silk(?!.*Mobile)/i.test(ua)) deviceType = "Tablet";
  else if (/Mobi|iPhone|Android/i.test(ua)) deviceType = "Mobil";

  let os = "Neznámy";
  if (/Windows NT 10\.0/i.test(ua)) os = "Windows 10/11";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Neznámy", browserVersion = "";
  if (/Edg\//.test(ua)) { browser = "Edge"; browserVersion = (ua.match(/Edg\/([\d.]+)/) || [])[1] || ""; }
  else if (/OPR\//.test(ua)) { browser = "Opera"; browserVersion = (ua.match(/OPR\/([\d.]+)/) || [])[1] || ""; }
  else if (/Chrome\//.test(ua)) { browser = "Chrome"; browserVersion = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || ""; }
  else if (/Firefox\//.test(ua)) { browser = "Firefox"; browserVersion = (ua.match(/Firefox\/([\d.]+)/) || [])[1] || ""; }
  else if (/Version\/.*Safari\//.test(ua)) { browser = "Safari"; browserVersion = (ua.match(/Version\/([\d.]+)/) || [])[1] || ""; }

  return {
    deviceType,
    os,
    browser,
    browserVersion,
    screenWidth: (window.screen && window.screen.width) || null,
    screenHeight: (window.screen && window.screen.height) || null,
    referrer: document.referrer || null,
    userAgent: ua,
  };
};

// --- Súhlas s cookies (GDPR) ---
// Kategórie: "essential" (vždy povolené — nutné pre fungovanie objednávky a prihlásenia)
// a "stats" (nepovinné — anonymizovaná IP geolokácia pre marketingovú mapu registrácií).
(function cookieConsent() {
  const STORAGE_KEY = "mbo_cookie_consent";

  function getConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function setConsent(stats) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stats: !!stats, decidedAt: new Date().toISOString() }));
    } catch (err) { /* localStorage nedostupné — súhlas sa spýtame nabudúce */ }
  }

  MBO.hasStatsConsent = function () {
    const c = getConsent();
    return !!(c && c.stats);
  };

  MBO.openCookieSettings = function () {
    showBanner(true);
  };

  function showBanner(forceOpen) {
    if (!forceOpen && getConsent()) return;
    if (document.getElementById("mbo-cookie-banner")) return;

    const el = document.createElement("div");
    el.id = "mbo-cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Nastavenia cookies");
    el.style.cssText =
      "position:fixed;left:0;right:0;bottom:0;z-index:10000;background:var(--surface);" +
      "border-top:2px solid var(--line);padding:1.2rem;box-shadow:0 -4px 18px rgba(0,0,0,.12);";
    el.innerHTML =
      '<div style="max-width:900px;margin:0 auto;display:flex;gap:1.2rem;flex-wrap:wrap;align-items:center;">' +
      '<p style="flex:1;min-width:240px;margin:0;font-size:.95rem;">' +
      "Táto stránka používa nevyhnutné cookies, bez ktorých by nefungovala objednávka ani prihlásenie do kurzu. " +
      "So súhlasom používame aj štatistické cookies, ktoré nám anonymne pomáhajú zistiť, z ktorého kraja Slovenska prichádzajú registrácie. " +
      'Viac v <a href="ochrana-osobnych-udajov.html">Ochrane osobných údajov</a>.' +
      "</p>" +
      '<div style="display:flex;gap:.6rem;flex-wrap:wrap;">' +
      '<button type="button" class="btn btn-secondary" data-cookie-essential style="white-space:nowrap;">Iba nevyhnutné</button>' +
      '<button type="button" class="btn btn-primary" data-cookie-all style="white-space:nowrap;">Prijať všetky</button>' +
      "</div></div>";
    document.body.appendChild(el);

    el.querySelector("[data-cookie-all]").addEventListener("click", () => {
      setConsent(true);
      el.remove();
    });
    el.querySelector("[data-cookie-essential]").addEventListener("click", () => {
      setConsent(false);
      el.remove();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => showBanner(false));
  } else {
    showBanner(false);
  }
})();

// --- Pätička s odkazom na ochranu osobných údajov (na každej stránke, kde chýba) ---
(function footer() {
  function addFooter() {
    if (document.getElementById("mbo-footer")) return;
    if (!document.body) return;
    const footer = document.createElement("footer");
    footer.id = "mbo-footer";
    footer.style.cssText = "text-align:center;padding:1.6rem 1rem;color:var(--text-mute);font-size:.85rem;";
    footer.innerHTML =
      "© " + new Date().getFullYear() + " Akadémia digitálneho vzdelávania DigiStart · " +
      '<a href="ochrana-osobnych-udajov.html">Ochrana osobných údajov</a> · ' +
      '<button type="button" data-mbo-cookie-settings style="background:none;border:none;padding:0;color:var(--focus);text-decoration:underline;cursor:pointer;font:inherit;">Nastavenia cookies</button>';
    document.body.appendChild(footer);
    footer.querySelector("[data-mbo-cookie-settings]").addEventListener("click", () => MBO.openCookieSettings());
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addFooter);
  } else {
    addFooter();
  }
})();

window.MBO = MBO;
