// Zdieľaná logika: Firebase inicializácia, veľkosť textu, neaktivita/odhlásenie.

(function initFirebase() {
  if (window.firebase && window.FIREBASE_CONFIG) {
    firebase.initializeApp(window.FIREBASE_CONFIG);
  }
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

  startInactivityWatch(onLogout) {
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

window.MBO = MBO;
