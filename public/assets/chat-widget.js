// Widget "Potrebujem pomoc" — živý chat s adminom (alebo zanechanie správy,
// keď admin nie je online). Samostatný skript, zapája sa na stránky, ktoré
// majú <a class="help-fab"> a majú načítané firebase-app/auth/firestore
// (compat) + assets/firebase-config.js pred týmto súborom.
(function () {
  "use strict";

  const PRESENCE_STALE_MS = 90 * 1000;
  const STORAGE_CHAT_ID = "mbo_chat_id";
  const STORAGE_LAST_SEEN = "mbo_chat_last_seen";

  function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .mbo-chat-panel {
        position: fixed; right: 1.4rem; bottom: 5.4rem; width: 340px; max-width: calc(100vw - 2rem);
        max-height: 70vh; background: var(--surface); border: 1px solid var(--line); border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,.25); display: none; flex-direction: column; overflow: hidden; z-index: 60;
      }
      .mbo-chat-panel.open { display: flex; }
      .mbo-chat-head { background: var(--ink); color: #fff; padding: 1rem 1.2rem; display: flex; justify-content: space-between; align-items: center; }
      .mbo-chat-head h3 { color: #fff; margin: 0; font-size: 1.05rem; }
      .mbo-chat-close { background: none; border: none; color: #fff; font-size: 1.3rem; cursor: pointer; line-height: 1; }
      .mbo-chat-status { padding: .5rem 1.2rem; font-size: .82rem; font-weight: 700; }
      .mbo-chat-status.online { background: var(--good-bg); color: var(--good); }
      .mbo-chat-status.offline { background: var(--warn-bg); color: var(--warn); }
      .mbo-chat-body { flex: 1; overflow-y: auto; padding: 1rem 1.2rem; display: flex; flex-direction: column; gap: .6rem; }
      .mbo-chat-form { padding: 1rem 1.2rem; border-top: 1px solid var(--line); }
      .mbo-chat-form .field { margin-bottom: .8rem; }
      .mbo-chat-form input, .mbo-chat-form textarea {
        font-family: inherit; font-size: .95rem; padding: .6rem .8rem; border-radius: 8px; border: 2px solid var(--line);
        width: 100%; box-sizing: border-box;
      }
      .mbo-chat-bubble { max-width: 85%; padding: .6rem .9rem; border-radius: 12px; font-size: .92rem; line-height: 1.4; }
      .mbo-chat-bubble.visitor { align-self: flex-end; background: var(--ink); color: #fff; border-bottom-right-radius: 3px; }
      .mbo-chat-bubble.admin { align-self: flex-start; background: var(--surface-2); color: var(--text); border-bottom-left-radius: 3px; }
      .mbo-chat-bubble.system { align-self: center; background: none; color: var(--text-mute); font-size: .82rem; text-align: center; }
      .mbo-chat-send-row { display: flex; gap: .5rem; padding: .8rem 1.2rem; border-top: 1px solid var(--line); }
      .mbo-chat-send-row input { flex: 1; }
      .mbo-chat-dot {
        position: absolute; top: -2px; right: -2px; width: 14px; height: 14px; border-radius: 50%;
        background: var(--warn); border: 2px solid var(--surface); display: none;
      }
      .mbo-chat-dot.show { display: block; }
      .help-fab { position: fixed; }
      .mbo-chat-typing { padding: 0 1.2rem .6rem; font-size: .82rem; color: var(--text-mute); font-style: italic; }
      #mbo-chat-end {
        display: block; width: 100%; background: none; border: none; border-top: 1px solid var(--line);
        color: var(--text-mute); font: inherit; font-size: .82rem; padding: .6rem; cursor: pointer; text-align: center;
      }
      #mbo-chat-end:hover { color: var(--warn); }
    `;
    document.head.appendChild(style);
  }

  function buildPanel() {
    const panel = el("div", "mbo-chat-panel");
    panel.innerHTML =
      "<div class='mbo-chat-head'><h3>Potrebujem pomoc</h3><button type='button' class='mbo-chat-close' aria-label='Zavrieť'>&times;</button></div>" +
      "<div class='mbo-chat-status' id='mbo-chat-status'></div>" +
      "<div class='mbo-chat-body' id='mbo-chat-body'></div>" +
      "<div class='mbo-chat-typing' id='mbo-chat-typing' style='display:none;'>Lektor píše…</div>" +
      "<div class='mbo-chat-form' id='mbo-chat-form'></div>" +
      "<div class='mbo-chat-send-row' id='mbo-chat-send-row' style='display:none;'>" +
      "<input type='text' id='mbo-chat-input' placeholder='Napíšte správu…'>" +
      "<button type='button' class='btn btn-primary' id='mbo-chat-send' style='padding:.6rem 1rem;'>Odoslať</button>" +
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
      statusEl.textContent = adminOnline
        ? "Sme online — odpovieme vám čo najskôr."
        : "Momentálne nie sme online. Zanechajte správu, ozveme sa čo najskôr.";
    }

    function renderStartForm() {
      sendRow.style.display = "none";
      bodyEl.innerHTML = "";
      formWrap.style.display = "block";
      formWrap.innerHTML =
        "<div class='field'><label style='font-weight:700;display:block;margin-bottom:.3rem;font-size:.9rem;'>Vaše meno</label><input type='text' id='mbo-chat-name'></div>" +
        "<div class='field'><label style='font-weight:700;display:block;margin-bottom:.3rem;font-size:.9rem;'>E-mail" + (adminOnline ? " (nepovinné)" : "") + "</label><input type='email' id='mbo-chat-email'></div>" +
        "<div class='field'><label style='font-weight:700;display:block;margin-bottom:.3rem;font-size:.9rem;'>Správa</label><textarea id='mbo-chat-msg' rows='3'></textarea></div>" +
        "<button type='button' class='btn btn-primary btn-block' id='mbo-chat-start'>Odoslať</button>" +
        "<p class='hint' id='mbo-chat-start-error' style='display:none;color:var(--warn);margin-top:.5rem;'></p>" +
        "<p class='hint' style='margin-top:.8rem;text-align:center;'>Radšej e-mailom? <a href='mailto:info@digistart.sk'>info@digistart.sk</a></p>";

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
            const b = el("div", "mbo-chat-bubble " + m.sender, escapeHtml(m.text) + "<br><span style='opacity:.6;font-size:.75rem;'>" + fmtTime(m.createdAt) + "</span>");
            bodyEl.appendChild(b);
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
          endBtn.textContent = "Konverzácia je ukončená — napísať znova";
        } else {
          endBtn.textContent = "Ukončiť konverzáciu";
        }
      });
    }

    endBtn.addEventListener("click", async () => {
      if (!currentChatId) return;
      if (endBtn.textContent.indexOf("napísať znova") !== -1) {
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

    fab.addEventListener("click", (e) => {
      e.preventDefault();
      if (panel.classList.contains("open")) {
        panel.classList.remove("open");
      } else {
        openPanel();
      }
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
