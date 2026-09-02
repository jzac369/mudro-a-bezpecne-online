// Priebežné ukladanie rozpracovanej práce priamo v zariadení.
//
// Postup v kurze (hotové kroky, poradie obrazovky) sa ukladá na server.
// To, čo má účastník práve rozpísané — čísla v rozpočte, odškrtnuté
// položky, odpovede v kvíze — sa ukladá sem, do pamäte prehliadača.
// Vďaka tomu sa po nechcenom obnovení stránky (napríklad potiahnutím
// prsta dole na tablete) nič nestratí.
//
// Použitie:
//   var store = window.createCourseStore("kod123", "bezpecne-financie");
//   store.set("cvicenia", { ... });
//   var data = store.get("cvicenia", {});

(function () {
  "use strict";

  var PREFIX = "mbo_rozpracovane_";

  function available() {
    try {
      var k = "__mbo_test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (err) {
      // Súkromné okno alebo zakázané ukladanie — pokračujeme bez neho.
      return false;
    }
  }

  var canStore = available();

  window.createCourseStore = function (codeId, workshopId) {
    var base = PREFIX + (codeId || "anonym") + "_" + (workshopId || "kurz") + "_";

    return {
      enabled: canStore,

      get: function (key, fallback) {
        if (!canStore) return fallback;
        try {
          var raw = window.localStorage.getItem(base + key);
          if (raw == null) return fallback;
          return JSON.parse(raw);
        } catch (err) {
          return fallback;
        }
      },

      set: function (key, value) {
        if (!canStore) return;
        try {
          window.localStorage.setItem(base + key, JSON.stringify(value));
        } catch (err) {
          // Napríklad plná pamäť — rozpracovanú prácu proste neuložíme.
          console.warn("Rozpracovanú prácu sa nepodarilo uložiť:", err);
        }
      },

      remove: function (key) {
        if (!canStore) return;
        try { window.localStorage.removeItem(base + key); } catch (err) { /* nevadí */ }
      },

      // Po dokončení kurzu už rozpracované veci netreba držať.
      clearAll: function () {
        if (!canStore) return;
        try {
          var toRemove = [];
          for (var i = 0; i < window.localStorage.length; i++) {
            var k = window.localStorage.key(i);
            if (k && k.indexOf(base) === 0) toRemove.push(k);
          }
          toRemove.forEach(function (k) { window.localStorage.removeItem(k); });
        } catch (err) { /* nevadí */ }
      },
    };
  };
})();
