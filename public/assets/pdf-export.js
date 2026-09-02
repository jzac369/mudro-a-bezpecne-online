// Ukladanie do PDF.
//
// Hotovú stranu (certifikát, pracovný list cvičenia) vykreslíme najprv do
// obrázka a ten vložíme do PDF. Vďaka tomu vyzerá PDF presne tak, ako to
// účastník vidí na obrazovke, a nemusíme do súboru vkladať písma so
// slovenskou diakritikou — tá je súčasťou obrázka.
//
// Použitie:
//   await window.savePdfFromImage(dataUrl, { filename: "cvicenie.pdf", orientation: "portrait" });

(function () {
  "use strict";

  var JSPDF_SRC = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

  var loaderPromise = null;
  function loadJsPdf() {
    if (loaderPromise) return loaderPromise;
    loaderPromise = new Promise(function (resolve, reject) {
      if (window.jspdf && window.jspdf.jsPDF) { resolve(window.jspdf.jsPDF); return; }
      var s = document.createElement("script");
      s.src = JSPDF_SRC;
      s.onload = function () {
        if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF);
        else reject(new Error("jsPDF sa nenačítal"));
      };
      s.onerror = function () { reject(new Error("jsPDF sa nepodarilo stiahnuť")); };
      document.head.appendChild(s);
    });
    return loaderPromise;
  }

  function imageSize(dataUrl) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve({ w: img.naturalWidth, h: img.naturalHeight }); };
      img.onerror = function () { reject(new Error("Obrázok sa nepodarilo načítať")); };
      img.src = dataUrl;
    });
  }

  // Vloží obrázok na stranu A4 tak, aby sa celý zmestil a zostal vycentrovaný.
  window.savePdfFromImage = async function (dataUrl, opts) {
    opts = opts || {};
    var orientation = opts.orientation || "portrait";
    var filename = opts.filename || "dokument.pdf";
    var margin = typeof opts.margin === "number" ? opts.margin : 8;   // v mm

    var jsPDF = await loadJsPdf();
    var size = await imageSize(dataUrl);

    var doc = new jsPDF({ orientation: orientation, unit: "mm", format: "a4" });
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();
    var availW = pageW - margin * 2;
    var availH = pageH - margin * 2;

    var scale = Math.min(availW / size.w, availH / size.h);
    var w = size.w * scale;
    var h = size.h * scale;
    var x = (pageW - w) / 2;
    var y = (pageH - h) / 2;

    doc.addImage(dataUrl, "PNG", x, y, w, h, undefined, "FAST");
    doc.save(filename);
    return true;
  };

  // Zistí, či je ukladanie do PDF k dispozícii (potrebuje internet na
  // stiahnutie knižnice). Volajúci tak vie tlačidlo skryť alebo ponúknuť
  // náhradné riešenie.
  window.pdfExportAvailable = function () {
    return loadJsPdf().then(function () { return true; }, function () { return false; });
  };
})();
