// Pracovný list na stiahnutie a vytlačenie.
//
// Cvičenia si účastník môže vyplniť na obrazovke, alebo si stiahne
// pracovný list a vyplní ho perom. Tu skladáme stranu A4 na výšku
// z jednoduchých stavebných blokov a vraciame ju ako obrázok, ktorý
// sa potom vloží do PDF.
//
// Použitie:
//   const dataUrl = await window.renderWorksheet({
//     title: "Cvičenie 1 · Domáci rozpočet",
//     intro: "Vyplňte tabuľku…",
//     blocks: [ { type: "table", rows: [...] }, { type: "note", text: "…" } ],
//   });

(function () {
  "use strict";

  var W = 800;          // logická šírka strany (pomer A4)
  var H = 1131;         // logická výška strany
  var SCALE = 2;        // dvojnásobné rozlíšenie kvôli tlači
  var M = 62;           // okraj

  var INK = "#1f3a3d";
  var TEXT = "#2a2721";
  var MUTE = "#5c5749";
  var LINE = "#d5cdb9";
  var ACCENT = "#c17a2e";
  var PAPER = "#ffffff";

  function wrapLines(ctx, text, maxWidth) {
    var out = [];
    String(text).split("\n").forEach(function (paragraph) {
      var words = paragraph.split(" ");
      var line = "";
      words.forEach(function (w) {
        var test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > maxWidth && line) {
          out.push(line);
          line = w;
        } else {
          line = test;
        }
      });
      out.push(line);
    });
    return out;
  }

  // Jednoduchý „kurzor“, ktorý si drží aktuálnu výšku na strane.
  function Cursor(ctx) {
    this.ctx = ctx;
    this.y = M;
  }

  Cursor.prototype.space = function (px) { this.y += px; };

  Cursor.prototype.text = function (text, opts) {
    opts = opts || {};
    var ctx = this.ctx;
    ctx.font = opts.font || "15px 'Atkinson Hyperlegible', Arial, sans-serif";
    ctx.fillStyle = opts.color || TEXT;
    ctx.textAlign = opts.align || "left";
    var maxW = opts.maxWidth || (W - M * 2);
    var lh = opts.lineHeight || 23;
    var x = opts.align === "center" ? W / 2 : M;
    var lines = wrapLines(ctx, text, maxW);
    lines.forEach(function (l, i) { ctx.fillText(l, x, this.y + i * lh); }, this);
    this.y += lines.length * lh;
    return this;
  };

  // Vodorovná linka na písanie odpovede rukou.
  Cursor.prototype.writingLines = function (count, opts) {
    opts = opts || {};
    var ctx = this.ctx;
    var gap = opts.gap || 34;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    for (var i = 0; i < count; i++) {
      this.y += gap;
      ctx.beginPath();
      ctx.moveTo(M, this.y);
      ctx.lineTo(W - M, this.y);
      ctx.stroke();
    }
    return this;
  };

  var RENDERERS = {};

  RENDERERS.heading = function (cur, b) {
    cur.space(18);
    cur.text(b.text, { font: "700 17px 'Atkinson Hyperlegible', Arial, sans-serif", color: INK, lineHeight: 24 });
    cur.space(6);
  };

  RENDERERS.paragraph = function (cur, b) {
    cur.space(8);
    cur.text(b.text, { color: b.muted ? MUTE : TEXT });
    cur.space(4);
  };

  // Tabuľka s popisom vľavo a prázdnym políčkom vpravo (na vyplnenie perom).
  RENDERERS.table = function (cur, b) {
    var ctx = cur.ctx;
    cur.space(10);
    if (b.caption) {
      cur.text(b.caption, { font: "700 14px 'Atkinson Hyperlegible', Arial, sans-serif", color: ACCENT, lineHeight: 20 });
      cur.space(4);
    }
    var rowH = 34;
    var valueW = b.valueWidth || 150;
    b.rows.forEach(function (row) {
      var y = cur.y;
      ctx.fillStyle = "#f6f3ec";
      ctx.fillRect(M, y, W - M * 2, rowH - 6);
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 1;
      ctx.strokeRect(M + .5, y + .5, W - M * 2 - 1, rowH - 7);
      // oddelenie políčka na hodnotu
      ctx.beginPath();
      ctx.moveTo(W - M - valueW, y);
      ctx.lineTo(W - M - valueW, y + rowH - 6);
      ctx.stroke();

      ctx.font = "14px 'Atkinson Hyperlegible', Arial, sans-serif";
      ctx.fillStyle = TEXT;
      ctx.textAlign = "left";
      ctx.fillText(row.label, M + 12, y + 21);

      if (row.value) {
        ctx.font = "700 14px 'Atkinson Hyperlegible', Arial, sans-serif";
        ctx.fillStyle = INK;
        ctx.textAlign = "right";
        ctx.fillText(row.value, W - M - 12, y + 21);
      }
      cur.y += rowH;
    });
    cur.space(6);
  };

  RENDERERS.checklist = function (cur, b) {
    var ctx = cur.ctx;
    cur.space(10);
    b.items.forEach(function (item) {
      var y = cur.y;
      var boxSize = 18;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(M + .5, y + .5, boxSize, boxSize);
      if (item.checked) {
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(M + 4, y + 9);
        ctx.lineTo(M + 8, y + 14);
        ctx.lineTo(M + 15, y + 5);
        ctx.stroke();
      }
      ctx.font = "14px 'Atkinson Hyperlegible', Arial, sans-serif";
      ctx.fillStyle = TEXT;
      ctx.textAlign = "left";
      var lines = wrapLines(ctx, item.text, W - M * 2 - boxSize - 16);
      lines.forEach(function (l, i) { ctx.fillText(l, M + boxSize + 14, y + 14 + i * 20); });
      cur.y += Math.max(boxSize + 12, lines.length * 20 + 10);
    });
    cur.space(4);
  };

  // Rámček s hotovým textom otázky pre AI — účastník ho odpíše do ChatGPT.
  RENDERERS.promptBox = function (cur, b) {
    var ctx = cur.ctx;
    cur.space(12);
    ctx.font = "14px 'Atkinson Hyperlegible', Arial, sans-serif";
    var lines = wrapLines(ctx, b.text, W - M * 2 - 32);
    var boxH = lines.length * 21 + 46;
    ctx.fillStyle = "#f1ddc0";
    ctx.fillRect(M, cur.y, W - M * 2, boxH);
    ctx.fillStyle = ACCENT;
    ctx.fillRect(M, cur.y, 5, boxH);

    ctx.font = "700 11px 'Atkinson Hyperlegible', Arial, sans-serif";
    ctx.fillStyle = "#8f5a1e";
    ctx.textAlign = "left";
    ctx.fillText(b.label || "OTÁZKA PRE AI", M + 18, cur.y + 20);

    ctx.font = "14px 'Atkinson Hyperlegible', Arial, sans-serif";
    ctx.fillStyle = INK;
    lines.forEach(function (l, i) { ctx.fillText(l, M + 18, cur.y + 40 + i * 21); });
    cur.y += boxH;
    cur.space(8);
  };

  RENDERERS.note = function (cur, b) {
    var ctx = cur.ctx;
    cur.space(14);
    ctx.font = "13px 'Atkinson Hyperlegible', Arial, sans-serif";
    var lines = wrapLines(ctx, b.text, W - M * 2 - 30);
    var boxH = lines.length * 19 + 26;
    ctx.fillStyle = "#eef3ee";
    ctx.fillRect(M, cur.y, W - M * 2, boxH);
    ctx.fillStyle = "#2f6b49";
    ctx.fillRect(M, cur.y, 5, boxH);
    ctx.fillStyle = "#1c4a30";
    ctx.textAlign = "left";
    lines.forEach(function (l, i) { ctx.fillText(l, M + 18, cur.y + 20 + i * 19); });
    cur.y += boxH;
    cur.space(6);
  };

  // Očíslované správy (napr. pri love na podvody) s miestom na poznámku.
  RENDERERS.messages = function (cur, b) {
    var ctx = cur.ctx;
    b.items.forEach(function (m, idx) {
      cur.space(14);
      ctx.font = "700 13px 'Atkinson Hyperlegible', Arial, sans-serif";
      ctx.fillStyle = ACCENT;
      ctx.textAlign = "left";
      ctx.fillText((idx + 1) + ". " + m.label, M, cur.y);
      cur.y += 8;

      ctx.font = "italic 14px 'Atkinson Hyperlegible', Arial, sans-serif";
      var lines = wrapLines(ctx, m.text, W - M * 2 - 28);
      var boxH = lines.length * 20 + 22;
      ctx.fillStyle = "#f6f3ec";
      ctx.fillRect(M, cur.y, W - M * 2, boxH);
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 1;
      ctx.strokeRect(M + .5, cur.y + .5, W - M * 2 - 1, boxH - 1);
      ctx.fillStyle = TEXT;
      lines.forEach(function (l, i) { ctx.fillText(l, M + 14, cur.y + 20 + i * 20); });
      cur.y += boxH + 6;

      ctx.font = "12px 'Atkinson Hyperlegible', Arial, sans-serif";
      ctx.fillStyle = MUTE;
      ctx.fillText(b.answerLabel || "Je to podvod? Podľa čoho to spoznám?", M, cur.y + 12);
      cur.y += 16;
      cur.writingLines(2);
      cur.space(6);
    });
  };

  RENDERERS.lines = function (cur, b) {
    if (b.label) {
      cur.space(10);
      cur.text(b.label, { font: "700 14px 'Atkinson Hyperlegible', Arial, sans-serif", color: MUTE, lineHeight: 20 });
    }
    cur.writingLines(b.count || 3);
    cur.space(8);
  };

  window.renderWorksheet = async function (spec) {
    spec = spec || {};
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (err) { /* nevadí */ }
    }

    var canvas = document.createElement("canvas");
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    var ctx = canvas.getContext("2d");
    ctx.scale(SCALE, SCALE);

    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);

    // Hlavička s názvom portálu
    ctx.fillStyle = ACCENT;
    ctx.fillRect(0, 0, W, 6);
    ctx.font = "700 11px 'Atkinson Hyperlegible', Arial, sans-serif";
    ctx.fillStyle = ACCENT;
    ctx.textAlign = "left";
    ctx.fillText("M Ú D R O   A   B E Z P E Č N E   O N L I N E", M, 38);

    var cur = new Cursor(ctx);
    cur.y = 62;

    cur.text(spec.title || "Pracovný list", {
      font: "700 24px 'Atkinson Hyperlegible', Arial, sans-serif", color: INK, lineHeight: 32,
    });
    if (spec.intro) {
      cur.space(8);
      cur.text(spec.intro, { color: MUTE, lineHeight: 22 });
    }
    cur.space(6);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(M, cur.y + 8);
    ctx.lineTo(W - M, cur.y + 8);
    ctx.stroke();
    cur.space(10);

    (spec.blocks || []).forEach(function (b) {
      var fn = RENDERERS[b.type];
      // Ak by sa blok už nezmestil, zvyšok radšej vynecháme, než aby
      // text pretiekol mimo stranu.
      if (!fn || cur.y > H - 130) return;
      fn(cur, b);
    });

    // Pätička
    ctx.font = "11px 'Atkinson Hyperlegible', Arial, sans-serif";
    ctx.fillStyle = "#8a8474";
    ctx.textAlign = "left";
    ctx.fillText("mudroabezpecne.sk", M, H - 40);
    ctx.textAlign = "right";
    ctx.fillText(spec.footer || "Pracovný list ku kurzu", W - M, H - 40);

    return canvas.toDataURL("image/png");
  };
})();
