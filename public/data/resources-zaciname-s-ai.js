// Rozcestník odkazov ku kurzu „Začíname s umelou inteligenciou“.
//
// Polia sú rovnaké ako pri prvom kurze — pozri data/resources.js.
// Adresy sú overené; pri každej je uvedené aj to, kam vedie, aby si
// účastník zvykol adresu skontrolovať ešte pred kliknutím.
(function (root) {
  "use strict";

  var RESOURCES = [
    {
      title: "Traja pomocníci, ktorých si viete otvoriť hneď",
      intro: "Všetci traja sú zadarmo, rozumejú po slovensky a stoja za nimi známe firmy.",
      icon: "robot",
      items: [
        {
          name: "ChatGPT — od firmy OpenAI",
          text: "Ten, s ktorým sme pracovali v celom kurze. Na počítači nemusíte inštalovať nič — stačí otvoriť túto adresu a rovno začať písať. V mobile a na tablete ho nájdete ako aplikáciu; pri názve musí byť vydavateľ OpenAI. Bezplatná verzia bohato stačí na všetko, čo sme si ukazovali.",
          url: "https://chatgpt.com",
          action: "Otvoriť ChatGPT",
          host: "chatgpt.com",
        },
        {
          name: "Microsoft Copilot",
          text: "Pomocník od Microsoftu. Na novších počítačoch s Windows býva zabudovaný priamo v systéme a v prehliadači Edge. Jeho výhodou je, že aj v bezplatnej verzii hľadá na internete, takže si poradí aj s celkom čerstvými informáciami.",
          url: "https://copilot.microsoft.com",
          action: "Otvoriť Copilot",
          host: "copilot.microsoft.com",
        },
        {
          name: "Google Gemini",
          text: "Pomocník od Googlu. Dobre spolupracuje s ostatnými službami Googlu — napríklad s Mapami alebo Gmailom. Hodí sa, keď plánujete výlet alebo cestu.",
          url: "https://gemini.google.com",
          action: "Otvoriť Gemini",
          host: "gemini.google.com",
        },
      ],
    },

    {
      title: "Keď si chcete niečo overiť",
      intro: "Umelá inteligencia sa občas pomýli. Tu si jej odpoveď potvrdíte — alebo vyvrátite.",
      icon: "search",
      items: [
        {
          name: "Demagog.SK",
          text: "Slovenskí novinári tu overujú výroky politikov a tvrdenia, ktoré sa šíria po internete. Ku každému overeniu uvádzajú zdroje, takže si viete pozrieť, odkiaľ informácia pochádza. Dobré miesto, keď si nie ste istí, či je nejaké tvrdenie pravdivé.",
          url: "https://demagog.sk/",
          action: "Otvoriť Demagog.SK",
          host: "demagog.sk",
        },
        {
          name: "AFP Fakty — overovanie na Slovensku",
          text: "Overovacia redakcia tlačovej agentúry AFP. Rozoberá konkrétne správy, fotografie a videá, ktoré kolujú po sociálnych sieťach, a vysvetľuje, čo je na nich pravda a čo nie. Nájdete tu aj ukážky obrázkov vytvorených umelou inteligenciou.",
          url: "https://fakty.afp.com/list/Slovakia",
          action: "Otvoriť AFP Fakty",
          host: "fakty.afp.com",
        },
        {
          name: "Hoaxy a podvody — Polícia SR",
          text: "Oficiálna stránka Polície Slovenskej republiky na Facebooku. Upozorňuje na poplašné správy a podvody, ktoré práve kolujú medzi ľuďmi, a vysvetľuje, podľa čoho ich spoznáte. Oplatí sa sledovať.",
          url: "https://www.facebook.com/hoaxyapodvody",
          action: "Otvoriť stránku polície",
          host: "facebook.com",
        },
      ],
    },

    {
      title: "Bezpečnosť na internete",
      intro: "Základ, ktorý platí pri umelej inteligencii aj kdekoľvek inde.",
      icon: "shield",
      items: [
        {
          name: "Bezpečne na nete",
          text: "Zrozumiteľne písaný rozcestník o bezpečnom správaní na internete — heslá, podvodné správy, nákupy, sociálne siete. Vysvetlené pokojne a bez technického žargónu, takže sa v tom vyzná aj úplný začiatočník.",
          url: "https://bezpecnenanete.eset.com/sk/",
          action: "Otvoriť stránku",
          host: "bezpecnenanete.eset.com",
        },
        {
          name: "Národná banka Slovenska — Pozor na podvody",
          text: "Upozornenia Národnej banky na aktuálne finančné podvody. Nájdete tu aj varovania pred falošnými investičnými ponukami, v ktorých podvodníci často zneužívajú tvár či hlas známej osobnosti vytvorené umelou inteligenciou.",
          url: "https://nbs.sk/pozor-na-podvody/",
          action: "Otvoriť stránku",
          host: "nbs.sk",
        },
        {
          name: "Národné centrum kybernetickej bezpečnosti SK-CERT",
          text: "Oficiálne slovenské pracovisko pre kybernetickú bezpečnosť. Zverejňuje varovania pred aktuálnymi hrozbami a podvodnými kampaňami. Hodí sa, keď si chcete overiť, či o nejakom podvode píše aj oficiálna inštitúcia.",
          url: "https://www.sk-cert.sk/",
          action: "Otvoriť SK-CERT",
          host: "sk-cert.sk",
        },
      ],
    },

    {
      title: "Kde sa učiť ďalej",
      intro: "Keď vám chuť vydrží — a to sa stáva častejšie, než by ste čakali.",
      icon: "book",
      items: [
        {
          name: "Vzdelávacie kurzy DigiStart",
          text: "Praktické online kurzy vytvorené najmä pre seniorov a začiatočníkov. Témy sú vysvetľované pokojne, zrozumiteľne a krok za krokom, bez zbytočných technických výrazov. Učiť sa môžete doma, vlastným tempom, na počítači, tablete alebo mobile. Kurzy obsahujú video s lektorom, praktické cvičenia, materiály na stiahnutie a po dokončení aj certifikát.",
          url: "https://kurzy.digistart.sk/",
          action: "Otvoriť vzdelávacie kurzy DigiStart",
          host: "kurzy.digistart.sk",
          featured: true,
        },
        {
          name: "Digitálni seniori",
          text: "Oficiálny projekt zameraný na digitálne zručnosti seniorov na Slovensku. Nájdete tu bezplatné vzdelávacie materiály a informácie o školeniach, ktoré prebiehajú aj osobne v jednotlivých regiónoch.",
          url: "https://www.digitalniseniori.gov.sk/",
          action: "Otvoriť stránku projektu",
          host: "digitalniseniori.gov.sk",
        },
        {
          name: "Digitálny klub pre seniorov",
          text: "Bezplatná stránka s krátkymi online kurzami a testami, na ktorých si overíte, čo už viete. Témy sú rozdelené na malé časti, takže sa dajú zvládať po kúskoch.",
          url: "https://digitalnyklub.sk/senior",
          action: "Otvoriť Digitálny klub",
          host: "digitalnyklub.sk",
        },
        {
          name: "Univerzita tretieho veku",
          text: "Väčšina slovenských univerzít ponúka seniorom štúdium za veľmi dostupný poplatok — vrátane kurzov práce s počítačom a internetom. Prednášky bývajú raz do týždňa a chodí sa na ne osobne, takže spoznáte aj nových ľudí.",
          url: "https://cdv.uniba.sk/univerzita-tretieho-veku/",
          action: "Pozrieť ponuku (Univerzita Komenského)",
          host: "cdv.uniba.sk",
        },
      ],
    },
  ];

  root.COURSE_LIBRARY = root.COURSE_LIBRARY || {};
  root.COURSE_LIBRARY["zaciname-s-ai"] = root.COURSE_LIBRARY["zaciname-s-ai"] || {};
  root.COURSE_LIBRARY["zaciname-s-ai"].resources = RESOURCES;
})(typeof window !== "undefined" ? window : globalThis);
