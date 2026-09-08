// Widget "Napíšte lektorovi" — živý chat s lektorom (alebo zanechanie správy,
// keď lektor nie je online). Samostatný skript, zapája sa na stránky, ktoré
// majú <a class="help-fab"> a majú načítané firebase-app/auth/firestore
// (compat) + assets/firebase-config.js pred týmto súborom.
(function () {
  "use strict";

  // Za chatom je skutočný lektor, nie anonymná podpora — meno a tvár sú to,
  // čo z tlačidla robí človeka. Fotka sa doplní neskôr; kým súbor neexistuje,
  // sa obrázok ticho odstráni a zostanú iniciálky.
  const LECTURER = { name: "Jaroslav", initials: "J", photo: "assets/lektor.jpg" };

  const PRESENCE_STALE_MS = 90 * 1000;
  const STORAGE_CHAT_ID = "mbo_chat_id";
  const STORAGE_LAST_SEEN = "mbo_chat_last_seen";

  function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function avatarHtml(cls) {
    return "<span class='mbo-ava " + (cls || "") + "'>" +
      "<span class='mbo-ava-ini'>" + LECTURER.initials + "</span>" +
      "<img src='" + LECTURER.photo + "' alt='' onerror='this.remove()'>" +
      "<i class='mbo-ava-dot'></i></span>";
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* Centrum pomoci — vlastný dizajnový systém widgetu, nezávislý od
         toho, ktoré CSS premenné (--ink/--surface-2/...) má práve
         aktuálna stránka; farby sú tu zámerne pevné (tmavozelená +
         krémová + biela), aby chat vyzeral rovnako na každej stránke. */
      .mbo-chat-panel {
        position: fixed; right: 1.2rem; bottom: 4.6rem; width: 314px; max-width: calc(100vw - 2rem);
        height: auto; max-height: min(620px, calc(100vh - 6.2rem));
        background: #fff; border: 1px solid #e7dcc9; border-radius: 18px;
        box-shadow: 0 16px 44px rgba(16,50,47,.18); display: none; flex-direction: column; z-index: 60;
        /* Poistka pre nízke okná prehliadača: keď sa aj po zmenšení
           #mbo-chat-body na minimum ešte stále nezmestí vstup a odkaz
           "Ukončiť konverzáciu" do max-height, celý panel sa radšej
           dá posúvať ako by mal odkaz/tlačidlo Odoslať zostať navždy
           neviditeľné mimo neho. overflow-y:auto + border-radius sa
           v prehliadačoch orezáva správne, zaoblenie sa nestratí. */
        overflow-y: auto; overflow-x: hidden;
      }
      .mbo-chat-panel.open { display: flex; }
      @media (max-width: 480px) {
        .mbo-chat-panel { right: .6rem; left: .6rem; bottom: 4.4rem; width: auto; max-width: none; height: auto; max-height: calc(100vh - 5.6rem); }
      }

      .mbo-chat-head { background: #12554a; color: #fff; padding: .6rem .8rem; flex: none; }
      .mbo-chat-head-row { display: flex; justify-content: space-between; align-items: flex-start; gap: .6rem; }
      .mbo-chat-head-titles { display: flex; align-items: center; gap: .65rem; }
      .mbo-chat-head-titles h3 { color: #fff; margin: 0; font-size: .92rem; font-weight: 800; line-height: 1.25; }
      /* Avatar lektora — kým fotka nie je nahraná, zostanú iniciálky. */
      .mbo-ava {
        position: relative; flex: none; width: 30px; height: 30px; border-radius: 50%;
        background: linear-gradient(160deg, #12554a, #0c3f37); color: #fff;
        display: inline-flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: .8rem; overflow: visible;
        box-shadow: inset 0 0 0 2px rgba(255,255,255,.25);
      }
      .mbo-ava img {
        position: absolute; inset: 0; width: 100%; height: 100%;
        border-radius: 50%; object-fit: cover;
      }
      .mbo-ava .mbo-ava-dot {
        position: absolute; right: -1px; bottom: -1px; width: 10px; height: 10px;
        border-radius: 50%; background: #3fae6f; border: 2px solid #12554a;
      }
      .mbo-chat-panel.lektor-offline .mbo-ava .mbo-ava-dot { background: #c9c2b2; }
      .mbo-chat-head-titles p { margin: .05rem 0 0; font-size: .72rem; color: #cfe3dc; }
      .mbo-chat-close {
        background: rgba(255,255,255,.14); border: none; color: #fff; width: 24px; height: 24px; border-radius: 50%;
        padding: 0; cursor: pointer; flex: none; display: flex; align-items: center; justify-content: center;
      }
      .mbo-chat-close svg { width: 14px; height: 14px; display: block; }
      .mbo-chat-close:hover { background: rgba(255,255,255,.24); }
      .mbo-chat-pill {
        display: inline-flex; align-items: center; gap: .35rem; margin-top: .15rem; padding: .1rem .45rem;
        border-radius: 999px; background: rgba(255,255,255,.14); color: #fff; font-size: .7rem; font-weight: 700;
      }
      .mbo-chat-pill .mbo-dot { width: 7px; height: 7px; border-radius: 50%; background: #9aa8a4; flex: none; }
      .mbo-chat-pill.online .mbo-dot { background: #6fd39a; }

      .mbo-chat-status {
        flex: none; display: flex; align-items: flex-start; gap: .5rem; padding: .5rem .8rem;
        font-size: .8rem; line-height: 1.4; background: #f6efe2; color: #33514c; border-bottom: 1px solid #e7dcc9;
      }
      .mbo-chat-status.online { background: #e7f0ea; color: #12554a; }
      .mbo-chat-status .mbo-status-icon { flex: none; width: 15px; height: 15px; margin-top: .1rem; color: #97500f; }
      .mbo-chat-status.online .mbo-status-icon { color: #12554a; }

      .mbo-chat-body { flex: 1; overflow-y: auto; padding: .7rem .8rem; display: flex; flex-direction: column; gap: .6rem; min-height: 0; }

      .mbo-chat-msg { display: flex; flex-direction: column; max-width: 88%; }
      .mbo-chat-msg.admin { align-self: flex-start; align-items: flex-start; }
      .mbo-chat-msg.visitor { align-self: flex-end; align-items: flex-end; }
      .mbo-chat-msg.system { align-self: center; align-items: center; max-width: 100%; }
      .mbo-chat-sender { font-size: .74rem; font-weight: 700; color: #12554a; margin-bottom: .3rem; padding-left: .2rem; }
      .mbo-chat-bubble { padding: .5rem .7rem; border-radius: 12px; font-size: .88rem; line-height: 1.45; word-break: break-word; }
      .mbo-chat-bubble.visitor { background: #12554a; color: #fff; border-bottom-right-radius: 4px; }
      .mbo-chat-bubble.admin { background: #f6efe2; color: #23342f; border-bottom-left-radius: 4px; }
      .mbo-chat-bubble.system { background: none; color: #6b7671; font-size: .78rem; text-align: center; }
      .mbo-chat-meta { display: flex; align-items: center; gap: .3rem; margin-top: .25rem; font-size: .68rem; color: #8a9490; padding: 0 .2rem; }
      .mbo-chat-meta .mbo-check { width: 12px; height: 12px; color: #6b9f8f; }

      .mbo-chat-form { padding: .7rem .8rem; flex: none; }
      .mbo-chat-form .field { margin-bottom: .55rem; }
      .mbo-chat-form label { font-weight: 700; display: block; margin-bottom: .2rem; font-size: .8rem; color: #23342f; }
      .mbo-chat-form input, .mbo-chat-form textarea {
        font-family: inherit; font-size: .9rem; padding: .5rem .7rem; border-radius: 9px; border: 1.5px solid #ddd0b8;
        width: 100%; box-sizing: border-box;
      }
      .mbo-chat-form input:focus, .mbo-chat-form textarea:focus, #mbo-chat-input:focus { outline: 2px solid #12554a; outline-offset: 1px; }
      .mbo-chat-form .btn-primary, #mbo-chat-start {
        display: block; width: 100%; min-height: 42px; background: #12554a; color: #fff; border: none;
        border-radius: 9px; font: inherit; font-size: .92rem; font-weight: 700; cursor: pointer;
      }
      .mbo-chat-form .btn-primary:hover, #mbo-chat-start:hover { background: #0c3f37; }

      /* Vstup takmer na celú šírku okna, tlačidlo Odoslať pod ním —
         nie vedľa seba. */
      .mbo-chat-send-row { display: flex; flex-direction: column; gap: .4rem; padding: .6rem .8rem; border-top: 1px solid #e7dcc9; flex: none; }
      .mbo-chat-send-row input {
        width: 100%; min-height: 44px; font-family: inherit; font-size: .92rem; padding: 0 .8rem;
        border-radius: 10px; border: 1.5px solid #ddd0b8; box-sizing: border-box;
      }
      #mbo-chat-send {
        width: 100%; min-height: 44px; padding: 0 .8rem; background: #12554a; color: #fff;
        border: none; border-radius: 10px; font: inherit; font-size: .92rem; font-weight: 700; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
      }
      #mbo-chat-send:hover { background: #0c3f37; }
      #mbo-chat-send svg { width: 16px; height: 16px; }

      .mbo-chat-dot {
        position: absolute; top: -2px; right: -2px; width: 14px; height: 14px; border-radius: 50%;
        background: #c06a1f; border: 2px solid #fff; display: none;
      }
      .mbo-chat-dot.show { display: block; }
      .help-fab { position: fixed; }
      .mbo-chat-typing { flex: none; padding: 0 .8rem .4rem; font-size: .78rem; color: #6b7671; font-style: italic; }

      /* Nenápadný textový odkaz, nie plnokrvné tlačidlo na celú šírku. */
      #mbo-chat-end {
        display: block; margin: 0 auto .7rem; background: none; border: none;
        color: #8a9490; font: inherit; font-size: .76rem; padding: .25rem .6rem; cursor: pointer; text-align: center;
        text-decoration: underline; text-underline-offset: 2px;
      }
      #mbo-chat-end:hover { color: #97500f; }
    `;
    document.head.appendChild(style);
  }

  const SEND_ICON = "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M22 2 11 13'/><path d='M22 2 15 22l-4-9-9-4 20-7Z'/></svg>";
  const CHECK_ICON = "<svg class='mbo-check' viewBox='0 0 16 16' fill='none' stroke='currentColor' stroke-width='1.7'><path d='M2 8.3l3.3 3.3L14 3'/></svg>";
  const CLOCK_ICON = "<svg class='mbo-status-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='9'/><path d='M12 7v5l3.5 2'/></svg>";
  const CHAT_OK_ICON = "<svg class='mbo-status-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 12l5 5L20 6'/></svg>";

  function buildPanel() {
    const panel = el("div", "mbo-chat-panel");
    panel.innerHTML =
      "<div class='mbo-chat-head'>" +
      "<div class='mbo-chat-head-row'>" +
      "<div class='mbo-chat-head-titles'>" + avatarHtml("") + "<div><h3>" + LECTURER.name + "</h3><span class='mbo-chat-pill' id='mbo-chat-pill'></span></div></div>" +
      "<button type='button' class='mbo-chat-close' aria-label='Zavrieť'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4' stroke-linecap='round'><path d='M6 6l12 12M18 6L6 18'/></svg></button>" +
      "</div>" +
      "</div>" +
      "<div class='mbo-chat-status' id='mbo-chat-status'></div>" +
      "<div class='mbo-chat-body' id='mbo-chat-body'></div>" +
      "<div class='mbo-chat-typing' id='mbo-chat-typing' style='display:none;'>Lektor píše…</div>" +
      "<div class='mbo-chat-form' id='mbo-chat-form'></div>" +
      "<div class='mbo-chat-send-row' id='mbo-chat-send-row' style='display:none;'>" +
      "<input type='text' id='mbo-chat-input' placeholder='Napíšte svoju správu...'>" +
      "<button type='button' id='mbo-chat-send'>" + SEND_ICON + "<span>Odoslať</span></button>" +
      "</div>" +
      "<button type='button' id='mbo-chat-end' style='display:none;'>Ukončiť konverzáciu</button>";
    document.body.appendChild(panel);
    return panel;
  }

  function scrollToBottom(bodyEl) {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function fmtTime(ts) {
    if (!ts) return "";
    try { return ts.toDate().toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return ""; }
  }

  function init() {
    if (!window.firebase || !window.FIREBASE_CONFIG) return;
    const fab = document.querySelector(".help-fab");
    if (!fab) return;

    injectStyles();
    const panel = buildPanel();
    const dot = el("span", "mbo-chat-dot");
    fab.appendChild(dot);

    const statusEl = panel.querySelector("#mbo-chat-status");
    const pillEl = panel.querySelector("#mbo-chat-pill");
    const bodyEl = panel.querySelector("#mbo-chat-body");
    const formWrap = panel.querySelector("#mbo-chat-form");
    const sendRow = panel.querySelector("#mbo-chat-send-row");
    const input = panel.querySelector("#mbo-chat-input");
    const sendBtn = panel.querySelector("#mbo-chat-send");
    const closeBtn = panel.querySelector(".mbo-chat-close");

    let db = null;
    let adminOnline = false;
    let unsubscribeMessages = null;
    let unsubscribeChatDoc = null;
    let currentChatId = localStorage.getItem(STORAGE_CHAT_ID) || null;
    const typingEl = panel.querySelector("#mbo-chat-typing");
    const endBtn = panel.querySelector("#mbo-chat-end");

    async function ensureAuth() {
      if (firebase.auth().currentUser) return firebase.auth().currentUser;
      const cred = await firebase.auth().signInAnonymously();
      return cred.user;
    }

    async function checkPresence() {
      try {
        const snap = await db.collection("presence").doc("admin").get();
        if (!snap.exists) return false;
        const data = snap.data();
        if (!data.online || !data.updatedAt) return false;
        return Date.now() - data.updatedAt.toDate().getTime() < PRESENCE_STALE_MS;
      } catch (err) {
        console.error("Nepodarilo sa zistiť dostupnosť administrátora:", err);
        return false;
      }
    }

    function renderStatus() {
      statusEl.className = "mbo-chat-status " + (adminOnline ? "online" : "offline");
      statusEl.innerHTML = (adminOnline ? CHAT_OK_ICON : CLOCK_ICON) + "<span>" + (adminOnline
        ? "Píšete skutočnému človeku, nie automatu."
        : "Napíšte pokojne teraz — odpoviem hneď, ako budem späť.") + "</span>";

      pillEl.className = "mbo-chat-pill " + (adminOnline ? "online" : "offline");
      pillEl.innerHTML = "<span class='mbo-dot'></span>" +
        (adminOnline ? "Online — odpoviem hneď" : "Teraz nie som pri počítači");
      panel.classList.toggle("lektor-offline", !adminOnline);

      // Karta lektora v kurze ukazuje ten istý stav ako panel — inak by
      // sľubovala "som online", aj keď lektor pri počítači nie je.
      const card = document.getElementById("lektor-card");
      if (card) {
        card.classList.toggle("offline", !adminOnline);
        const stav = document.getElementById("lektor-stav");
        if (stav) {
          stav.innerHTML = "<i></i>" + (adminOnline
            ? "Lektor je teraz online"
            : "Lektor teraz nie je pri počítači");
        }
      }
    }

    function renderStartForm() {
      sendRow.style.display = "none";
      bodyEl.innerHTML = "";
      formWrap.style.display = "block";
      formWrap.innerHTML =
        "<div class='field'><label>Vaše meno</label><input type='text' id='mbo-chat-name'></div>" +
        "<div class='field'><label>E-mail" + (adminOnline ? " (nepovinné)" : "") + "</label><input type='email' id='mbo-chat-email'></div>" +
        "<div class='field'><label>Správa</label><textarea id='mbo-chat-msg' rows='3'></textarea></div>" +
        "<button type='button' class='btn-primary' id='mbo-chat-start'>Odoslať</button>" +
        "<p id='mbo-chat-start-error' style='display:none;color:#b3261e;font-size:.82rem;margin-top:.5rem;'></p>" +
        "<p style='margin-top:.7rem;text-align:center;font-size:.8rem;color:#6b7671;'>Radšej e-mailom? <a href='mailto:info@digistart.sk' style='color:#12554a;font-weight:700;'>info@digistart.sk</a></p>";

      panel.querySelector("#mbo-chat-start").addEventListener("click", async () => {
        const name = panel.querySelector("#mbo-chat-name").value.trim();
        const email = panel.querySelector("#mbo-chat-email").value.trim();
        const message = panel.querySelector("#mbo-chat-msg").value.trim();
        const errorEl = panel.querySelector("#mbo-chat-start-error");
        errorEl.style.display = "none";
        if (!name || !message || (!adminOnline && !email)) {
          errorEl.textContent = adminOnline ? "Vyplňte prosím meno a správu." : "Vyplňte prosím meno, e-mail a správu — potrebujeme vám vedieť odpovedať.";
          errorEl.style.display = "block";
          return;
        }
        try {
          const user = await ensureAuth();
          let codeId = null;
          try {
            const token = await user.getIdTokenResult();
            codeId = token.claims.codeId || null;
          } catch (e) { /* anonymný návštevník bez tokenu s claimami */ }
          const chatRef = await db.collection("chats").add({
            visitorUid: user.uid,
            visitorName: name,
            visitorEmail: email || null,
            codeId,
            page: location.pathname.split("/").pop() || "index.html",
            status: adminOnline ? "open" : "message_left",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastMessageBy: "visitor",
            unreadByAdmin: true,
          });
          await chatRef.collection("messages").add({
            sender: "visitor",
            text: message,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
          currentChatId = chatRef.id;
          localStorage.setItem(STORAGE_CHAT_ID, currentChatId);
          formWrap.style.display = "none";
          openThread();
        } catch (err) {
          errorEl.textContent = "Správu sa nepodarilo odoslať. Skúste to prosím znova.";
          errorEl.style.display = "block";
          console.error(err);
        }
      });
    }

    function openThread() {
      sendRow.style.display = "flex";
      formWrap.style.display = "none";
      endBtn.style.display = "block";
      if (unsubscribeMessages) unsubscribeMessages();
      unsubscribeMessages = db.collection("chats").doc(currentChatId).collection("messages")
        .orderBy("createdAt", "asc")
        .onSnapshot((snap) => {
          bodyEl.innerHTML = "";
          let lastAdminTs = null;
          snap.forEach((doc) => {
            const m = doc.data();
            const wrap = el("div", "mbo-chat-msg " + m.sender);
            if (m.sender === "admin") wrap.appendChild(el("div", "mbo-chat-sender", "Podpora DigiStart"));
            wrap.appendChild(el("div", "mbo-chat-bubble " + m.sender, escapeHtml(m.text)));
            // Fajočka je len potvrdenie, že správa bola úspešne odoslaná
            // (t.j. zapísaná do Firestore) — nesleduje sa ňou doručenie ani
            // prečítanie, taký stav appka nemá.
            wrap.appendChild(el("div", "mbo-chat-meta", fmtTime(m.createdAt) + (m.sender === "visitor" ? CHECK_ICON : "")));
            bodyEl.appendChild(wrap);
            if (m.sender === "admin" && m.createdAt) lastAdminTs = m.createdAt.toDate().getTime();
          });
          scrollToBottom(bodyEl);
          if (lastAdminTs) {
            const lastSeen = Number(localStorage.getItem(STORAGE_LAST_SEEN)) || 0;
            dot.classList.toggle("show", !panel.classList.contains("open") && lastAdminTs > lastSeen);
          }
        });

      if (unsubscribeChatDoc) unsubscribeChatDoc();
      unsubscribeChatDoc = db.collection("chats").doc(currentChatId).onSnapshot((doc) => {
        const c = doc.data();
        if (!c) return;
        typingEl.style.display = c.adminTyping ? "block" : "none";
        if (c.status === "closed") {
          endBtn.textContent = "Chat ukončený";
          endBtn.setAttribute("data-closed", "1");
        } else {
          endBtn.textContent = "Ukončiť konverzáciu";
          endBtn.removeAttribute("data-closed");
        }
      });
    }

    endBtn.addEventListener("click", async () => {
      if (!currentChatId) return;
      if (endBtn.hasAttribute("data-closed")) {
        // Konverzácia už bola ukončená — začneme celkom novú.
        localStorage.removeItem(STORAGE_CHAT_ID);
        currentChatId = null;
        if (unsubscribeMessages) unsubscribeMessages();
        if (unsubscribeChatDoc) unsubscribeChatDoc();
        renderStartForm();
        return;
      }
      if (!confirm("Naozaj chcete ukončiť túto konverzáciu?")) return;
      await db.collection("chats").doc(currentChatId).update({ status: "closed" });
    });

    function escapeHtml(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    sendBtn.addEventListener("click", async () => {
      const text = input.value.trim();
      if (!text || !currentChatId) return;
      input.value = "";
      try {
        await db.collection("chats").doc(currentChatId).collection("messages").add({
          sender: "visitor",
          text,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        await db.collection("chats").doc(currentChatId).update({
          lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastMessageBy: "visitor",
          unreadByAdmin: true,
          status: adminOnline ? "open" : "message_left",
        });
      } catch (err) {
        console.error("Správu sa nepodarilo odoslať:", err);
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });

    async function openPanel() {
      panel.classList.add("open");
      dot.classList.remove("show");
      localStorage.setItem(STORAGE_LAST_SEEN, String(Date.now()));
      if (!db) db = firebase.firestore();
      adminOnline = await checkPresence();
      renderStatus();
      if (currentChatId) {
        openThread();
      } else {
        renderStartForm();
      }
    }

    // Chat sa dá otvoriť aj odinakiaľ než z plávajúceho tlačidla — napr.
    // z karty lektora vnútri kurzu (prvok s atribútom data-open-chat).
    const openers = [fab].concat(Array.prototype.slice.call(document.querySelectorAll("[data-open-chat]")));
    openers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (panel.classList.contains("open")) {
          panel.classList.remove("open");
        } else {
          openPanel();
          panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    });
    closeBtn.addEventListener("click", () => panel.classList.remove("open"));

    // Ak existuje rozbehnutá konverzácia, na pozadí sledujeme nové správy
    // od admina aj keď je panel zatvorený (kvôli bodke s upozornením).
    if (currentChatId) {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) { try { await firebase.auth().signInAnonymously(); } catch (e) {} return; }
        if (!db) db = firebase.firestore();
        db.collection("chats").doc(currentChatId).collection("messages")
          .orderBy("createdAt", "desc").limit(1)
          .onSnapshot((snap) => {
            if (snap.empty) return;
            const m = snap.docs[0].data();
            if (m.sender === "admin" && m.createdAt) {
              const lastSeen = Number(localStorage.getItem(STORAGE_LAST_SEEN)) || 0;
              if (m.createdAt.toDate().getTime() > lastSeen && !panel.classList.contains("open")) {
                dot.classList.add("show");
              }
            }
          });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
