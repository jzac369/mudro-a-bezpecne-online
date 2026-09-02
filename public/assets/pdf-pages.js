// Príprava strán PDF ako obrázkov.
//
// Používa sa v admin zóne pri nahrávaní brožúrky alebo prezentácie.
// Súbor je v tej chvíli v prehliadači lokálne, takže ho vieme prečítať
// bez obmedzení a jednotlivé strany vykresliť do obrázkov.
//
// Prečo to robíme: samotné PDF uložené v úložisku Firebase sa nedá
// z našej stránky načítať cez `fetch` — úložisko neposiela hlavičky,
// ktoré to prehliadaču povolia. Obrázky sa však cez `img` zobrazia bez
// problémov, takže listovanie funguje vždy a je aj oveľa rýchlejšie.

(function () {
  "use strict";

  var PDFJS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  var PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  var loaderPromise = null;
  function loadPdfJs() {
    if (loaderPromise) return loaderPromise;
    loaderPromise = new Promise(function (resolve, reject) {
      if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
      var s = document.createElement("script");
      s.src = PDFJS_SRC;
      s.onload = function () {
        if (!window.pdfjsLib) { reject(new Error("Knižnicu na čítanie PDF sa nepodarilo načítať")); return; }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(window.pdfjsLib);
      };
      s.onerror = function () { reject(new Error("Knižnicu na čítanie PDF sa nepodarilo stiahnuť")); };
      document.head.appendChild(s);
    });
    return loaderPromise;
  }

  function canvasToBlob(canvas, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (b) {
        if (b) resolve(b); else reject(new Error("Stranu sa nepodarilo previesť na obrázok"));
      }, "image/jpeg", quality);
    });
  }

  // Vráti pole objektov { index, blob } — jeden pre každú stranu dokumentu.
  window.renderPdfFileToPages = async function (file, opts) {
    opts = opts || {};
    var targetWidth = opts.width || 1000;
    var quality = opts.quality || 0.7;
    var onProgress = opts.onProgress || function () {};

    var pdfjsLib = await loadPdfJs();
    var buffer = await file.arrayBuffer();
    var pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    var pages = [];

    for (var i = 1; i <= pdf.numPages; i++) {
      onProgress(i - 1, pdf.numPages);
      var page = await pdf.getPage(i);
      var base = page.getViewport({ scale: 1 });
      var viewport = page.getViewport({ scale: targetWidth / base.width });

      var canvas = document.createElement("canvas");
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      pages.push({ index: i, blob: await canvasToBlob(canvas, quality) });
      // Uvoľníme pamäť — pri dlhých dokumentoch na slabšom počítači to pomôže.
      canvas.width = 0; canvas.height = 0;
    }

    onProgress(pdf.numPages, pdf.numPages);
    return pages;
  };
})();
