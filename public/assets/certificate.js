// Vykreslenie certifikátu o absolvovaní kurzu.
//
// Kreslíme do canvasu vo dvojnásobnom rozlíšení, aby bol certifikát ostrý
// aj po vytlačení. Rozmery v kóde nižšie sú v „logických“ bodoch (1200×848),
// prepočet na skutočné pixely rieši mierka.
//
// Použitie:
//   const dataUrl = await window.drawCertificate({
//     participantName, workshopTitle, workshopSubtitle, signatureUrl
//   });

(function () {
  "use strict";

  var W = 1200;      // logická šírka
  var H = 848;       // logická výška
  var SCALE = 2;     // dvojnásobné rozlíšenie kvôli tlači

  function loadImage(url) {
    return new Promise(function (resolve) {
      if (!url) { resolve(null); return; }
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }

  // Podpis býva naskenovaný na bielom papieri. Na krémovom certifikáte by
  // biely obdĺžnik pôsobil ako nalepený štvorec, preto svetlé pixely
  // spriehľadníme. Ak sa obrázok načíta z cudzej domény bez povolenia,
  // prehliadač nám do neho nedovolí nazrieť — vtedy ho použijeme tak, ako je.
  function removeWhiteBackground(img) {
    try {
      var c = document.createElement("canvas");
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      var cx = c.getContext("2d");
      cx.drawImage(img, 0, 0);
      var data = cx.getImageData(0, 0, c.width, c.height);
      var px = data.data;
      for (var i = 0; i < px.length; i += 4) {
        var r = px[i], g = px[i + 1], b = px[i + 2];
        if (r > 232 && g > 232 && b > 232) {
          px[i + 3] = 0;                        // úplne svetlé = pozadie
        } else if (r > 200 && g > 200 && b > 200) {
          px[i + 3] = Math.round(px[i + 3] * 0.35);  // okraje zjemníme
        }
      }
      cx.putImageData(data, 0, 0);
      return c;
    } catch (err) {
      return img;   // canvas je „zafarbený“ cudzím obrázkom, kreslíme bez úpravy
    }
  }

  function blob(ctx, x, y, r, color) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Rozdelí text na riadky tak, aby sa zmestil do zadanej šírky.
  function wrapLines(ctx, text, maxWidth) {
    var words = String(text).split(" ");
    var lines = [];
    var line = "";
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
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

  function drawLines(ctx, lines, cx, y, lineHeight) {
    lines.forEach(function (l, i) { ctx.fillText(l, cx, y + i * lineHeight); });
  }

  // Zmenší písmo, kým sa text nezmestí na jeden riadok. Používame pri mene
  // účastníka — to musí zostať na jednom riadku, aj keď je dlhé.
  function fitOneLine(ctx, text, maxWidth, fontTemplate, maxSize, minSize) {
    var size = maxSize;
    while (size > minSize) {
      ctx.font = fontTemplate.replace("%s", size + "px");
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 1;
    }
    ctx.font = fontTemplate.replace("%s", size + "px");
    return size;
  }

  window.drawCertificate = async function (opts) {
    opts = opts || {};
    var participantName = opts.participantName || "Účastník kurzu";
    var workshopTitle = opts.workshopTitle || "";
    var workshopSubtitle = opts.workshopSubtitle || "";

    // Bez načítaných písiem by prehliadač ticho použil náhradné a certifikát
    // by vyzeral inak pri každom otvorení.
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (err) { /* nevadí */ }
    }

    var canvas = document.createElement("canvas");
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    var ctx = canvas.getContext("2d");
    ctx.scale(SCALE, SCALE);

    // Krémové pozadie + jemné farebné škvrny v rohoch
    ctx.fillStyle = "#faf3e6";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.55;
    blob(ctx, 60, 40, 220, "#e7c98f");
    blob(ctx, 40, 260, 180, "#8fae8f");
    blob(ctx, W - 60, H - 60, 240, "#8fae8f");
    blob(ctx, W - 100, H - 280, 170, "#e0a98f");
    ctx.globalAlpha = 1;

    // Hlavička
    ctx.textAlign = "left";
    ctx.font = "700 14px 'Atkinson Hyperlegible', sans-serif";
    ctx.fillStyle = "#c17a2e";
    ctx.fillText("M Ú D R O   A   B E Z P E Č N E   O N L I N E", 90, 90);

    ctx.textAlign = "center";

    ctx.font = "700 64px Georgia, 'Times New Roman', serif";
    ctx.fillStyle = "#1f3a3d";
    ctx.fillText("Certifikát", W / 2, 250);

    ctx.font = "italic 26px Georgia, serif";
    ctx.fillStyle = "#5c5749";
    ctx.fillText("o úspešnom absolvovaní kurzu", W / 2, 300);

    ctx.strokeStyle = "#c17a2e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 160, 360);
    ctx.lineTo(W / 2 + 160, 360);
    ctx.stroke();

    ctx.font = "20px 'Atkinson Hyperlegible', sans-serif";
    ctx.fillStyle = "#332f28";
    ctx.fillText("Tento certifikát vystavuje Múdro a Bezpečne Online za úspešné absolvovanie", W / 2, 410);
    ctx.fillText("vzdelávacieho kurzu, ktorý absolvoval(a):", W / 2, 438);

    // Meno účastníka — pri dlhom mene zmenšíme písmo, aby sa zmestilo.
    ctx.fillStyle = "#c17a2e";
    fitOneLine(ctx, participantName, 1000, "700 %s Georgia, serif", 40, 20);
    ctx.fillText(participantName, W / 2, 505);

    // Rámček s názvom kurzu má pevnú výšku, aby pätička s dátumom
    // a podpisom sedela vždy na rovnakom mieste — aj pri dlhom názve.
    // Ak by sa názov nezmestil na dva riadky, zmenšíme písmo.
    var boxY = 545, boxH = 120;
    var titleSize = 26, titleLines;
    while (titleSize > 16) {
      ctx.font = "700 " + titleSize + "px Georgia, serif";
      titleLines = wrapLines(ctx, workshopTitle, 720);
      if (titleLines.length <= 2) break;
      titleSize -= 1;
    }
    ctx.font = "700 " + titleSize + "px Georgia, serif";
    titleLines = wrapLines(ctx, workshopTitle, 720);

    ctx.fillStyle = "rgba(143,174,143,0.18)";
    roundRect(ctx, W / 2 - 400, boxY, 800, boxH, 14);
    ctx.fill();

    // Blok textu vycentrujeme na výšku rámčeka.
    var titleLH = titleSize + 6;
    var subH = workshopSubtitle ? 28 : 0;
    var blockH = titleLines.length * titleLH + subH;
    var firstBaseline = boxY + (boxH - blockH) / 2 + titleSize;

    ctx.fillStyle = "#1f3a3d";
    drawLines(ctx, titleLines, W / 2, firstBaseline, titleLH);

    if (workshopSubtitle) {
      ctx.font = "20px Georgia, serif";
      ctx.fillStyle = "#5c5749";
      var subLines = wrapLines(ctx, workshopSubtitle, 720);
      ctx.fillText(subLines[0], W / 2, firstBaseline + titleLines.length * titleLH);
    }

    // Pätička: dátum vľavo, podpis lektora vpravo — pevné miesto pod rámčekom.
    var footerBase = 715;
    var lineY = footerBase + 15;
    var labelY = footerBase + 38;

    var dateStr = opts.date || new Date().toLocaleDateString("sk-SK", { year: "numeric", month: "long", day: "numeric" });
    var sigImg = await loadImage(opts.signatureUrl);

    ctx.textAlign = "center";
    var colLeftX = W / 2 - 220, colRightX = W / 2 + 220;

    if (sigImg) {
      var source = removeWhiteBackground(sigImg);
      var sigW = 160;
      var natW = sigImg.naturalWidth || sigImg.width;
      var natH = sigImg.naturalHeight || sigImg.height;
      var sigH = (natH / natW) * sigW;
      // Vysoký podpis by zasahoval do rámčeka — v takom prípade ho zmenšíme.
      var maxSigH = footerBase - (boxY + boxH) - 8;
      if (sigH > maxSigH) { sigW = sigW * (maxSigH / sigH); sigH = maxSigH; }
      ctx.drawImage(source, colRightX - sigW / 2, footerBase - sigH, sigW, sigH);
    } else {
      ctx.font = "italic 26px Georgia, serif";
      ctx.fillStyle = "#1f3a3d";
      ctx.fillText("Lektor", colRightX, footerBase - 5);
    }

    ctx.font = "700 22px Georgia, serif";
    ctx.fillStyle = "#1f3a3d";
    ctx.fillText(dateStr, colLeftX, footerBase - 5);

    ctx.strokeStyle = "#c9c0a8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(colLeftX - 130, lineY); ctx.lineTo(colLeftX + 130, lineY);
    ctx.moveTo(colRightX - 130, lineY); ctx.lineTo(colRightX + 130, lineY);
    ctx.stroke();

    ctx.font = "700 12px 'Atkinson Hyperlegible', sans-serif";
    ctx.fillStyle = "#5c5749";
    ctx.fillText("D Á T U M", colLeftX, labelY);
    ctx.fillText("L E K T O R", colRightX, labelY);

    ctx.font = "12px 'Atkinson Hyperlegible', sans-serif";
    ctx.fillStyle = "#8a8474";
    ctx.textAlign = "left";
    ctx.fillText("mudroabezpecne.sk", 90, H - 50);

    return canvas.toDataURL("image/png");
  };
})();
