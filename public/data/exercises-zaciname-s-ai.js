// Praktické cvičenia kurzu „Začíname s umelou inteligenciou“.
//
// Obsah vychádza z brožúrky DigiStart „Vaša cesta do sveta umelej
// inteligencie“ (verzia 3.0 / 2026).
//
// Ovládanie je zámerne čo najjednoduchšie: na obrazovke býva vždy jedna
// otázka a jedno výrazné tlačidlo dopredu.
(function () {
  "use strict";

  var EXERCISES = [

  // 0 · Slovníček — kartičky s desaťsekundovou pauzou na rozmyslenie
  {
    id: "ai-slovnicek",
    type: "glossary",
    icon: "book",
    title: "Slovníček pojmov o AI",
    short: "Pätnásť slov, ktoré okolo umelej inteligencie počujete najčastejšie — kartička po kartičke.",
    time: "10 minút",
    intro: "Okolo umelej inteligencie sa točí pár cudzích slov. Nie sú zložité a nemusíte sa ich učiť naspamäť — stačí, keď vám nebudú znieť cudzo.",
    task: "Kartička ukáže pojem. Máte desať sekúnd, aby ste ho nahlas vysvetlili — potom sa otočí a poviete, či ste to vedeli. Na konci uvidíte, na ktoré slová sa ešte pozrieť.",
    // Skupiny slúžia už len pracovnému listu; na obrazovke idú pojmy
    // v jednom náhodnom slede.
    parts: [
      {
        title: "Základné pojmy",
        intro: "Slová, na ktoré narazíte hneď na začiatku.",
        terms: [
          { term: "Umelá inteligencia (AI)", text: "Počítačový program, ktorý rieši úlohy podobne ako človek — rozumie textu, vysvetľuje, radí a tvorí. Skratka pochádza z anglického Artificial Intelligence." },
          { term: "ChatGPT", read: "čítaj „četdžípítí“", text: "Jeden z najznámejších AI asistentov na svete, od firmy OpenAI. Práve s ním pracujeme v tomto kurze." },
          { term: "Chatbot", read: "čítaj „četbot“", text: "Program, s ktorým sa dá rozprávať formou správ — píšete mu ako do SMS. ChatGPT, Copilot aj Gemini sú chatboty." },
          { term: "Prompt", read: "čítaj „promt“", text: "Otázka alebo zadanie, ktoré napíšete umelej inteligencii. Čím konkrétnejší prompt, tým užitočnejšia odpoveď." },
          { term: "Konverzácia", text: "Váš rozhovor s AI. Môžete klásť viac otázok za sebou — AI si pamätá, o čom ste sa bavili predtým." },
        ],
      },
      {
        title: "Ako to funguje",
        intro: "Čo sa skrýva za tým, že AI odpovedá.",
        terms: [
          { term: "Generatívna AI", text: "Umelá inteligencia, ktorá vie niečo nové vytvoriť — text, obrázok, hudbu či video. Nielen vyhľadať, ale naozaj vyrobiť." },
          { term: "AI model", text: "„Mozog“ celého systému — obrovská sieť vzorcov natrénovaná na veľkom množstve textov. Práve on skladá odpovede." },
          { term: "Strojové učenie", text: "Spôsob, akým sa AI učí. Ukážete jej tisíce fotografií mačiek a ona si z nich odvodí, ako mačka vyzerá." },
          { term: "Algoritmus", text: "Presný postup, podľa ktorého program rieši úlohu. Ako recept v kuchárke — krok za krokom." },
          { term: "Rozpoznávanie obrazu", text: "Schopnosť AI určiť, čo je na fotografii. Vďaka nej nájdete v mobile všetky fotky mora, hoci ste nič nepopisovali." },
        ],
      },
      {
        title: "Opatrnosť a overovanie",
        intro: "Slová, ktoré vám pomôžu používať AI s rozumom.",
        terms: [
          { term: "Halucinácia", text: "Keď si AI odpoveď vymyslí a tvári sa, že je pravdivá. Nie je to zlý úmysel — AI len nerada hovorí „neviem“." },
          { term: "Overovanie faktov", text: "Kontrola, či je informácia naozaj pravdivá. Dôležité údaje si potvrďte na oficiálnej stránke alebo u odborníka." },
          { term: "Deepfake", read: "čítaj „dípfejk“", text: "Falošné video alebo hlas vytvorený umelou inteligenciou. Dokáže napodobniť tvár aj hlas skutočného človeka." },
          { term: "Copilot a Gemini", text: "Ďalší dvaja známi AI asistenti — Copilot je od Microsoftu, Gemini od Googlu. Oba sú zadarmo a rozumejú po slovensky." },
          { term: "Osobné údaje", text: "Meno, adresa, rodné číslo, čísla dokladov a účtov. Do AI nepatria — na dobrú radu ich nepotrebuje." },
        ],
      },
    ],
    note: "Ak narazíte na cudzie slovo, ktorému nerozumiete — opýtajte sa AI: „Vysvetli mi toto slovo jednoducho, ako pre seniora, a uveď príklad.“",
  },

  // 1 · Ako sa opýtať — stepper, na obrazovke vždy jedna otázka
  {
    id: "ai-dobra-otazka",
    type: "offers",
    icon: "message",
    ownFooter: true,
    title: "Ako sa opýtať, aby vám AI naozaj pomohla",
    short: "Vezmeme obyčajnú otázku a krok po kroku z nej spravíme takú, ktorá prinesie použiteľnú odpoveď.",
    time: "7 minút",
    intro: "Rozdiel medzi obyčajnou a výbornou odpoveďou nebýva v umelej inteligencii. Býva v otázke — a tú máte vo svojich rukách.",
    leadStrong: "Dobrá otázka povie, kto ste, čo chcete a ako to má vyzerať.",
    screens: [
      {
        kind: "quiz",
        title: "Prvý pokus",
        lead: "Chcete od AI pomoc s obedom a napíšete jej: „Poraď mi recept.“",
        offers: false,
        question: "Čo podľa vás AI odpovie?",
        options: [
          { key: "a", label: "Hociktorý recept — netuší, čo máte doma", correct: true },
          { key: "b", label: "Presne to, čo potrebujete" },
          { key: "?", label: "Neviem, ukážte mi to", neutral: true },
        ],
        okText: "Presne tak. Otázka je zrozumiteľná, ale AI z nej nevie takmer nič.",
        badText: "Nie celkom — AI totiž netuší, čo máte v chladničke ani koľko máte času.",
        neutralText: "Poďme sa na to pozrieť spolu.",
        columns: [
          { name: "Čo AI vie", tone: "good", items: ["že chcete recept"] },
          { name: "Čo AI netuší", tone: "warn", items: ["čo máte doma", "koľko máte času", "pre koľkých varíte", "čo nejete"] },
        ],
        closing: "Odpoveď preto bude všeobecná. Nie je to chyba AI — jednoducho nemá z čoho vychádzať.",
      },
      {
        kind: "quiz",
        title: "Doplníme, čo máte doma",
        lead: "Skúsme otázku vylepšiť: „Poraď mi recept z kuracích pŕs, cukety a smotany.“",
        question: "Pomohlo to?",
        options: [
          { key: "a", label: "Áno, odpoveď bude oveľa konkrétnejšia", correct: true },
          { key: "b", label: "Nie, je to stále to isté" },
        ],
        okText: "Áno! Jedna veta navyše a odpoveď je zrazu použiteľná.",
        badText: "Pomohlo, a dosť výrazne — AI už vie, z čoho má variť.",
        closing: "Stále jej však chýba čas, ktorý máte, a počet osôb. Poďme to doplniť.",
      },
      {
        kind: "quiz",
        title: "Doplníme čas a počet",
        lead: "„Poraď mi večeru pre dvoch z kuracích pŕs, cukety a smotany. Mám na to pol hodiny.“",
        question: "Čo ešte môžete pridať, aby bola odpoveď hotová na použitie?",
        options: [
          { key: "a", label: "Ako má odpoveď vyzerať — napríklad krok za krokom", correct: true },
          { key: "b", label: "Svoje meno a adresu" },
          { key: "c", label: "Už netreba nič" },
        ],
        okText: "Presne tak. Keď poviete, ako to má vyzerať, dostanete to presne tak.",
        badText: "Meno ani adresu AI na recept nepotrebuje — a ani jej ich nedávame. Užitočné je povedať, ako má odpoveď vyzerať.",
        columns: [
          { name: "Toto pomáha", tone: "good", items: ["„krok za krokom“", "„v troch bodoch“", "„jednoducho, som začiatočník“"] },
          { name: "Toto netreba", tone: "warn", items: ["meno a adresa", "rodné číslo", "čísla účtov"] },
        ],
        closing: "A sme na konci. Pozrime sa, ako vyzerá hotová otázka.",
      },
      {
        kind: "prompt",
        title: "Vaša hotová otázka",
        lead: "Takto vyzerá otázka, ktorá prinesie odpoveď, akú naozaj použijete:",
        prompt: "Poraď mi večeru pre dvoch z kuracích pŕs, cukety a smotany. Mám na to pol hodiny, som začiatočník. Napíš postup krok za krokom a uveď časy.",
        answerTitle: "Takto by mohla odpoveď vyzerať",
        answer:
          "Kuracie prsia s cuketou na smotane — pre 2 osoby, 30 minút\n\n" +
          "Budete potrebovať: 2 kuracie prsia, 1 cuketu, 200 ml smotany na varenie, soľ, korenie, lyžicu oleja.\n\n" +
          "Postup:\n" +
          "1. Kuracie prsia nakrájajte na pásiky a osoľte. (2 minúty)\n" +
          "2. Na panvici rozohrejte olej a mäso opekajte, kým nezbelie. (6 minút)\n" +
          "3. Cuketu nakrájajte na kolieska a pridajte k mäsu. (2 minúty)\n" +
          "4. Spolu restujte, kým cuketa nezmäkne. (8 minút)\n" +
          "5. Prilejte smotanu, premiešajte a nechajte prejsť varom. (5 minút)\n\n" +
          "Podávajte s ryžou alebo pečivom. Dobrú chuť!",
        warn: "Pri jedlách pre diabetikov, alergikov alebo po operácii si postup radšej overte aj u lekára alebo výživového poradcu.",
      },
      {
        kind: "summary",
        title: "Hotovo",
        closing: "Teraz už viete, že o kvalite odpovede rozhoduje otázka — a že ju viete vylepšiť aj po krokoch.",
        aiTitle: "Nemusíte to trafiť na prvýkrát",
        aiText: "Pokojne začnite krátkou otázkou a dopĺňajte, čo vám v odpovedi chýbalo. Rozhovor si pamätá, o čom ste sa bavili predtým, takže nič nemusíte písať odznova.",
        mainLabel: "Späť na cvičenia",
        items: [
          "kto ste a čo riešite",
          "čo presne chcete",
          "ako má odpoveď vyzerať",
          "čo tam naopak nepatrí — vaše osobné údaje",
        ],
      },
    ],
    worksheetNote: "Dobrá otázka povie tri veci: kto ste a čo riešite, čo presne chcete a ako to má vyzerať. Osobné údaje do nej nepatria.",
  },

  // 2 · Simulátor — nanečisto, bez účtu a bez rizika
  {
    id: "ai-simulator",
    type: "chat-sim",
    icon: "robot",
    title: "Vyskúšajte si ChatGPT nanečisto",
    short: "Okno, ktoré vyzerá ako skutočný ChatGPT. Napíšte otázku a uvidíte, ako by odpovedal.",
    time: "10 minút",
    intro: "Než si ChatGPT otvoríte doma, vyskúšajte si ho tu. Nič sa nedá pokaziť a nepotrebujete žiadne prihlásenie ani účet.",
    task: "Kliknite na jednu z pripravených otázok dole, alebo si napíšte vlastnú a stlačte šípku. Po každej odpovedi vám ponúkneme, na čo sa dá pýtať ďalej.",
    suggestions: [
      "Vysvetli mi jednoducho, čo je umelá inteligencia.",
      "Poraď mi večeru z toho, čo mám doma: kuracie prsia, cuketa, smotana.",
      "Napíš slušný list lekárovi, že ruším termín a prosím o nový.",
      "Ako sa starať o muškáty, aby prezimovali?",
      "Prelož mi do nemčiny: Dobrý deň, hľadám lekáreň.",
    ],

    sensitiveReply: {
      text: "Zastavím vás — v tejto správe vidím údaj, ktorý vyzerá ako číslo karty, PIN, rodné číslo alebo číslo účtu.\n\n**Toto mi prosím nepíšte.** Na to, aby som vám poradil, ho vôbec nepotrebujem — ani ja, ani skutočný ChatGPT.\n\nStačí, keď situáciu opíšete slovami. Napríklad namiesto „prišiel mi list k rodnému číslu 555555/5555“ napíšte len „prišiel mi list z poisťovne o nedoplatku“. Poradím vám úplne rovnako dobre.",
      followUps: [
        { q: "Čo teda môžem AI pokojne napísať?", to: "bezpecne" },
        { q: "Prišiel mi list z poisťovne, čo s ním?", to: "urad" },
      ],
    },

    clarify: {
      text: "Rád vám pomôžem — a pokojne sa pýtajte aj viackrát, neomrzí ma to.\n\nAby som odpovedal presne, potreboval by som vedieť trochu viac. **S čím vám mám pomôcť?**",
      options: [
        { q: "Vysvetli mi nejaké cudzie slovo.", to: "vysvetli" },
        { q: "Poraď mi, čo uvariť.", to: "recept" },
        { q: "Pomôž mi napísať list.", to: "list" },
        { q: "Poraď mi so záhradou.", to: "zahrada" },
      ],
    },

    replies: [
      {
        id: "coje",
        phrases: ["čo je umelá inteligencia", "co je umela inteligencia", "čo je ai", "vysvetli mi umelú inteligenciu", "ako funguje ai", "čo je to ai"],
        keywords: ["inteligenc", "chatgpt", "asisten"],
        text: "Umelá inteligencia je počítačový program, ktorý sa naučil rozumieť ľudskej reči.\n\nPredstavte si veľmi sčítaného pomocníka: prečítal obrovské množstvo kníh, novín a webových stránok a z toho, čo sa naučil, vám poskladá odpoveď.\n\n**Tri veci, ktoré je dobré vedieť:**\n\n• Nemá vlastnú vôľu ani city — pracuje, až keď ho o niečo požiadate.\n• Rozprávate sa s ním bežnou slovenčinou, technické znalosti netreba.\n• Občas sa pomýli, preto si dôležité údaje overte aj inde.\n\nNič sa pritom nedá pokaziť. Pýtajte sa pokojne na čokoľvek.",
        followUps: [
          { q: "Na čo všetko mi môžeš pomôcť?", to: "nacovsetko" },
          { q: "Môžeš sa pomýliť?", to: "halucinacia" },
        ],
      },
      {
        id: "nacovsetko",
        phrases: ["na čo mi pomôžeš", "na co mi pomozes", "čo všetko vieš", "co vsetko vies", "na čo ťa môžem použiť", "s čím mi vieš pomôcť"],
        keywords: ["pomoz", "vies urobit", "co dokazes"],
        text: "Pomôžem s väčšinou vecí, pri ktorých treba niečo napísať, vysvetliť alebo vymyslieť.\n\n**Najčastejšie ma ľudia prosia o toto:**\n\n• **Listy a úrady** — reklamácia, žiadosť, sťažnosť, odvolanie.\n• **Vysvetlenie** — cudzie slovo, lekárska správa, zmluva, návod.\n• **Kuchyňa** — recept z toho, čo máte doma, aj úprava pre diétu.\n• **Dom a záhrada** — čo zasadiť, ako niečo opraviť, ako sa o čo starať.\n• **Cudzie jazyky** — preklad textu aj s výslovnosťou.\n• **Pre vnúčatá** — rozprávka, básnička, vysvetlenie detskej otázky.\n\nSkúste niečo, čo práve riešite. Neexistuje hlúpa otázka.",
        followUps: [
          { q: "Pomôž mi napísať list.", to: "list" },
          { q: "Poraď mi, čo uvariť.", to: "recept" },
        ],
      },
      {
        id: "recept",
        phrases: ["čo uvariť", "co uvarit", "poraď mi recept", "porad mi recept", "večeru", "veceru", "kuracie prsia", "mám doma", "mam doma", "recept"],
        keywords: ["varit", "obed", "jedlo", "chladnick"],
        text: "Rád poradím. Z kuracích pŕs, cukety a smotany zvládnete večeru pre dvoch asi za pol hodinu.\n\n**Kuracie prsia s cuketou na smotane**\n\n1. Kuracie prsia nakrájajte na pásiky a osoľte. *(2 minúty)*\n2. Na rozohriatom oleji ich opekajte, kým nezbelejú. *(6 minút)*\n3. Pridajte cuketu nakrájanú na kolieska. *(2 minúty)*\n4. Restujte spolu, kým cuketa nezmäkne. *(8 minút)*\n5. Prilejte smotanu, premiešajte a nechajte prejsť varom. *(5 minút)*\n\nPodávajte s ryžou alebo pečivom.\n\nAk mi napíšete, čo nejete alebo koľko máte času, recept prispôsobím.",
        followUps: [
          { q: "Uprav to prosím pre cukrovkára.", to: "dieta" },
          { q: "Napíš mi z toho nákupný zoznam.", to: "zoznam" },
        ],
      },
      {
        id: "dieta",
        phrases: ["pre cukrovkára", "pre cukrovkara", "diabetik", "bezlepkov", "diét", "diet", "nízky cukor"],
        keywords: ["cukrovk", "diabet", "lepok"],
        text: "Jasné, upravím to.\n\n**Kuracie prsia s cuketou — vhodnejšia verzia**\n\n• Smotanu na varenie nahraďte **bielym jogurtom** alebo smotanou s nižším obsahom tuku a pridajte ju až na konci, mimo vysokej teploty.\n• Ako prílohu zvoľte **pohánku alebo celozrnnú ryžu** namiesto bielej.\n• Pridajte viac zeleniny — cuketa, paprika, špenát.\n• Nepoužívajte zápražku ani sladké omáčky.\n\n**Dôležité:** toto je len všeobecná rada. Konkrétny jedálniček pri cukrovke vám má odsúhlasiť váš lekár alebo výživový poradca — poznajú vaše hodnoty aj lieky.",
        followUps: [
          { q: "Napíš mi z toho nákupný zoznam.", to: "zoznam" },
          { q: "Pomôž mi napísať list.", to: "list" },
        ],
      },
      {
        id: "zoznam",
        phrases: ["nákupný zoznam", "nakupny zoznam", "čo mám kúpiť", "napíš zoznam"],
        keywords: ["nakup", "zoznam"],
        text: "Nech sa páči, môžete si to odfotiť alebo zapísať:\n\n**Nákupný zoznam**\n\n• 2 kuracie prsia\n• 1 cuketa\n• 200 ml smotany na varenie\n• ryža alebo pečivo k tomu\n• soľ, korenie, olej *(ak nemáte doma)*\n\nAk chcete, viem zoznam rozšíriť o suroviny na celý týždeň. Stačí napísať, koľko dní varíte a pre koľkých.",
        followUps: [
          { q: "Poraď mi so záhradou.", to: "zahrada" },
          { q: "Pomôž mi napísať list.", to: "list" },
        ],
      },
      {
        id: "list",
        phrases: ["napíš list", "napis list", "napíš email", "napis email", "list lekárovi", "reklamáciu", "reklamaciu", "sťažnosť", "žiadosť", "ruším termín"],
        keywords: ["list", "mail", "reklamac", "ziadost", "staznost"],
        text: "Rád. Tu je návrh — pokojne ho upravte podľa seba.\n\n**Vážený pán doktor,**\n\ndovoľujem si Vás požiadať o ospravedlnenie, že som sa nemohol dostaviť na dohodnutý termín. Veľmi ma to mrzí.\n\nRád by som Vás poprosil o nový termín v priebehu budúceho týždňa, ideálne v doobedňajších hodinách. Prispôsobím sa Vašim možnostiam.\n\nĎakujem za pochopenie a ostávam s pozdravom,\n\n*(vaše meno)*\n\n---\n\nAk mi napíšete, o aký list ide a akým tónom ho chcete, pripravím iný — úradný, priateľský alebo dôrazný.",
        followUps: [
          { q: "Napíš to dôraznejšie.", to: "doraznejsie" },
          { q: "Čo môžem AI pokojne napísať?", to: "bezpecne" },
        ],
      },
      {
        id: "doraznejsie",
        phrases: ["dôraznejšie", "doraznejsie", "prísnejšie", "ostrejšie", "napíš to inak"],
        keywords: ["dorazn", "prisnej", "ostrej"],
        text: "Jasné, tu je dôraznejšia verzia. Stále zostáva slušná — to je dôležité.\n\n**Vec: Reklamácia obuvi**\n\nDňa 15. januára 2026 som vo Vašej predajni zakúpil pár topánok. Po týždni bežného nosenia sa odlepila podrážka.\n\nPri osobnej návšteve predajne mi bola reklamácia ústne zamietnutá. S týmto postupom nesúhlasím a **žiadam o výmenu tovaru alebo vrátenie kúpnej ceny.**\n\nOčakávam Vaše písomné vyjadrenie v zákonnej lehote.\n\nS pozdravom,\n*(vaše meno)*\n\n---\n\nPred odoslaním si skontrolujte dátum, sumu a názov predajne, nech všetko sedí.",
        followUps: [
          { q: "Vysvetli mi nejaké cudzie slovo.", to: "vysvetli" },
          { q: "Môžeš sa pomýliť?", to: "halucinacia" },
        ],
      },
      {
        id: "vysvetli",
        phrases: ["vysvetli mi", "čo znamená", "co znamena", "nerozumiem slovu", "hypertenzia", "lekárska správa", "lekarska sprava"],
        keywords: ["vysvetl", "znamena", "pojem"],
        text: "To je presne to, v čom som najužitočnejší. Skúsme príklad z lekárskej správy:\n\n**Hypertenzia** znamená vysoký krvný tlak. Číslo za tým označuje, aký je vysoký — druhý stupeň je stredne vysoký.\n\n**Režim DASH** je odporúčaná strava pri vysokom tlaku: menej soli, viac zeleniny, ovocia a celozrnných potravín, menej tučného mäsa.\n\nAk vám niečo aj tak nie je jasné, napíšte: *„Vysvetli mi to ešte jednoduchšie.“* Pokojne aj trikrát za sebou.\n\n**Pozor:** vysvetlenie pojmov je jedna vec, liečba druhá. Tú vám má určiť lekár.",
        followUps: [
          { q: "Ako sa mám pripraviť k lekárovi?", to: "lekar" },
          { q: "Môžeš sa pomýliť?", to: "halucinacia" },
        ],
      },
      {
        id: "lekar",
        phrases: ["k lekárovi", "k lekarovi", "príprava k lekárovi", "aké otázky lekárovi", "idem k lekárovi"],
        keywords: ["lekar", "doktor", "vysetren"],
        text: "Dobrý nápad — s pripravenými otázkami z návštevy získate oveľa viac.\n\n**Päť otázok, ktoré sa oplatí položiť:**\n\n1. Čo presne mi je a ako sa to volá?\n2. Aké mám možnosti liečby a čím sa líšia?\n3. Ako dlho to bude trvať a čo mám očakávať?\n4. Čo mám robiť doma — a čomu sa vyhnúť?\n5. Kedy mám prísť znova a kedy volať skôr?\n\nZoznam si pokojne vytlačte alebo odfoťte a vezmite so sebou. A nebojte sa doktora požiadať, aby vám to vysvetlil jednoduchšie — máte na to právo.",
        followUps: [
          { q: "Vysvetli mi nejaké cudzie slovo.", to: "vysvetli" },
          { q: "Čo môžem AI pokojne napísať?", to: "bezpecne" },
        ],
      },
      {
        id: "zahrada",
        phrases: ["záhrada", "zahrada", "muškáty", "muskaty", "kvety", "čo zasadiť", "co zasadit", "rastlin"],
        keywords: ["zahrad", "kvet", "sadit", "polievat"],
        text: "Rád poradím.\n\n**Muškáty cez zimu**\n\n• Pred prvými mrazmi ich preneste do **chladnej, svetlej miestnosti** — ideálne 5 až 10 °C.\n• Stonky skráťte približne na tretinu.\n• Polievajte **striedmo**, asi raz za dva až tri týždne. Radšej menej než viac.\n• Cez zimu neprihnojujte.\n• V marci ich presaďte do čerstvej zeminy a postupne zvykajte na svetlo.\n\nAk mi napíšete, v akom kraji bývate a akú máte pôdu, poradím aj to, čo sa vám oplatí vysadiť na jar.",
        followUps: [
          { q: "Poraď mi, čo uvariť.", to: "recept" },
          { q: "Prelož mi niečo do cudzieho jazyka.", to: "preklad" },
        ],
      },
      {
        id: "preklad",
        phrases: ["prelož", "prelozit", "do nemčiny", "do angličtiny", "preklad", "ako sa povie"],
        keywords: ["prelo", "nemc", "anglic", "jazyk"],
        text: "Samozrejme.\n\n**Slovensky:** Dobrý deň, hľadám lekáreň.\n\n**Nemecky:** Guten Tag, ich suche eine Apotheke.\n*Prečíta sa približne: gútn tág, ich zúche ajne apotéke.*\n\n**Anglicky:** Good afternoon, I am looking for a pharmacy.\n*Prečíta sa približne: gud áfternún, ajm luking for e fármesi.*\n\nAk cestujete, môžete mi vetu aj nadiktovať cez mikrofón a ja ju preložím. V zahraničí potom stačí ukázať obrazovku.",
        followUps: [
          { q: "Na čo všetko mi môžeš pomôcť?", to: "nacovsetko" },
          { q: "Čo môžem AI pokojne napísať?", to: "bezpecne" },
        ],
      },
      {
        id: "halucinacia",
        phrases: ["môžeš sa pomýliť", "mozes sa pomylit", "halucin", "vymýšľaš si", "je to pravda", "ako si to overím", "overiť"],
        keywords: ["pomyl", "halucin", "overi", "pravd"],
        text: "Áno, môžem — a je dobré, že sa pýtate.\n\nKeď odpoveď presne nepoznám, občas si ju domyslím a znie to pritom presvedčivo. Hovorí sa tomu **halucinácia**. Nie je to zlý úmysel, len nerád hovorím „neviem“.\n\n**Čo si preto overujte:**\n\n• Telefónne čísla, sumy, dátumy a paragrafy.\n• Údaje o liekoch a liečbe.\n• Všetko, čo sa týka peňazí a zmlúv.\n\n**Ako na to:** opýtajte sa ma *„Odkiaľ to vieš?“* a potom si to pozrite na oficiálnej stránke úradu, banky či poisťovne.\n\nVysvetlenia a všeobecné rady si overovať nemusíte — tam sa mýlim len zriedka.",
        followUps: [
          { q: "Čo môžem AI pokojne napísať?", to: "bezpecne" },
          { q: "Vysvetli mi nejaké cudzie slovo.", to: "vysvetli" },
        ],
      },
      {
        id: "bezpecne",
        phrases: ["čo môžem napísať", "co mozem napisat", "je to bezpečné", "osobné údaje", "osobne udaje", "čo ti nemám písať", "súkromie"],
        keywords: ["bezpecn", "sukrom", "udaj", "heslo"],
        text: "Dobrá otázka — a odpoveď je jednoduchá.\n\n**Toto mi pokojne píšte:**\n\n• Otázky o histórii, prírode, kultúre, varení, záhrade.\n• Opis situácie bez mien a čísel: *„prišiel mi list z poisťovne o nedoplatku“*.\n• Text, ktorý chcete preložiť alebo vysvetliť.\n• Suroviny, ktoré máte doma.\n\n**Toto mi nepíšte:**\n\n• Rodné číslo, čísla dokladov.\n• Čísla platobných kariet a kódy z ich zadnej strany.\n• Heslá a kódy z SMS.\n• Fotografie občianskeho preukazu či pasu.\n\n**Pravidlo, ktoré si zapamätáte:** opíšte situáciu, nie svoje čísla. Na dobrú radu mi vaše údaje väčšinou netreba.",
        followUps: [
          { q: "Môžeš sa pomýliť?", to: "halucinacia" },
          { q: "Ako spoznám podvod cez AI?", to: "podvod" },
        ],
      },
      {
        id: "podvod",
        phrases: ["podvod", "deepfake", "falošný hlas", "falosny hlas", "napodobniť hlas", "volal mi vnuk", "zneužiť ai"],
        keywords: ["podvod", "deepfake", "falos", "zneuz"],
        text: "Tú istú technológiu, ktorá pomáha vám, vedia zneužiť aj podvodníci. Dobré je vedieť, ako to vyzerá.\n\n**Napodobnený hlas.** Z krátkej nahrávky sa dá vyrobiť hlas vášho blízkeho. Typicky zavolá „vnuk“, potrebuje súrne peniaze a prosí, aby ste nikomu nevolali.\n\n**Čo robiť:** zložte a zavolajte na číslo, ktoré máte uložené vy. Ak nedvíha, skúste iného člena rodiny.\n\n**Falošné video so známou tvárou.** Herec alebo politik odporúča investíciu. Takmer vždy ide o podvod.\n\n**Dobrý zvyk do rodiny:** dohodnite si jedno kontrolné slovo, ktoré by vedel len váš blízky. Jednoduché a veľmi účinné.",
        followUps: [
          { q: "Čo môžem AI pokojne napísať?", to: "bezpecne" },
          { q: "Na čo všetko mi môžeš pomôcť?", to: "nacovsetko" },
        ],
      },
      {
        id: "urad",
        phrases: ["list z poisťovne", "list z urad", "úradný list", "uradny list", "nedoplatok", "prišiel mi list"],
        keywords: ["urad", "poistov", "nedoplat", "exekuc"],
        text: "Poďme na to pokojne, krok za krokom.\n\n**1. Skontrolujte, či je list pravý.** Pozrite sa na odosielateľa a číslo účtu. Pravosť si overte telefonicky — na čísle z **oficiálnej stránky** poisťovne, nie na tom, ktoré je v liste.\n\n**2. Nič neplaťte hneď.** Skutočný nedoplatok neutečie. Podvodné listy naopak tlačia na rýchlosť.\n\n**3. Ak je list pravý,** zistite, za aké obdobie nedoplatok vznikol a či sa dá rozložiť na splátky. Väčšina inštitúcií to umožní.\n\n**4. Nechajte si list vysvetliť.** Odfoťte ho a napíšte mi: *„Vysvetli mi jednoducho, čo tento list znamená.“* Osobné údaje pritom pokojne prekryte papierikom.",
        followUps: [
          { q: "Čo môžem AI pokojne napísať?", to: "bezpecne" },
          { q: "Pomôž mi napísať list.", to: "list" },
        ],
      },
    ],
    note: "Toto je len cvičenie — odpovede sú pripravené vopred. Skutočný ChatGPT nájdete na chatgpt.com alebo ako aplikáciu v mobile či tablete.",
  },

  // 3 · Posudzovanie odpovedí — uverím, alebo si to overím?
  {
    id: "ai-uverim-overim",
    type: "scam-hunt",
    icon: "scales",
    title: "Uverím, alebo si to overím?",
    short: "Štyri odpovede od AI. Pri ktorých stačí prikývnuť a pri ktorých siahnuť po druhom zdroji?",
    time: "8 minút",
    intro: "Overovať neznamená nedôverovať. Je to obyčajný zdravý rozum — rovnaký, aký použijete pri rade od susedy.",
    task: "Pri každej odpovedi sa najprv sami rozhodnite. Až potom sa vám ukáže vysvetlenie.",
    labels: {
      yes: "Toto si overím",
      no: "Tomuto pokojne verím",
      yesVerdict: "Toto patrí medzi veci na overenie.",
      noVerdict: "Tejto odpovedi môžete pokojne veriť.",
    },
    worksheetQuestion: "Overil by som si to? Podľa čoho som sa rozhodol?",
    messages: [
      {
        label: "Odpoveď č. 1 — o pestovaní",
        text: "„Muškáty prezimujú najlepšie v chladnej svetlej miestnosti pri teplote 5 až 10 °C. Polievajte ich striedmo, približne raz za dva týždne.“",
        isScam: false,
        why: "Toto je všeobecná rada z oblasti, kde sa AI mýli len zriedka. Aj keby bola teplota o stupeň iná, nič zlé sa nestane. Pokojne ju použite.",
      },
      {
        label: "Odpoveď č. 2 — telefónne číslo",
        text: "„Zákaznícka linka vašej zdravotnej poisťovne je 0850 111 222, volať môžete v pracovné dni od 8:00 do 16:00.“",
        isScam: true,
        why: "Konkrétne telefónne číslo je presne ten typ údaja, ktorý si AI vie domyslieť. Číslo si vždy nájdite na oficiálnej stránke poisťovne — a volajte len na to.",
      },
      {
        label: "Odpoveď č. 3 — vysvetlenie pojmu",
        text: "„Hypertenzia znamená vysoký krvný tlak. Režim DASH je strava s nižším obsahom soli, väčším podielom zeleniny, ovocia a celozrnných potravín.“",
        isScam: false,
        why: "Vysvetľovanie pojmov je najsilnejšia stránka AI. Toto si overovať nemusíte — ale samotnú liečbu vám aj tak určuje lekár, nie AI.",
      },
      {
        label: "Odpoveď č. 4 — zákon a lehota",
        text: "„Podľa zákona máte na vrátenie tovaru kúpeného cez internet presne 21 dní od prevzatia zásielky.“",
        isScam: true,
        why: "Paragrafy, lehoty a sumy si overujte vždy. Na Slovensku je lehota na odstúpenie od zmluvy pri nákupe cez internet spravidla 14 dní — číslo v odpovedi teda nesedí. Overíte si to na stránke Slovenskej obchodnej inšpekcie.",
      },
    ],
    note: "Pomôcka, ktorá platí takmer vždy: čo sa dá zle zapamätať — čísla, dátumy, paragrafy — to sa dá aj zle vymyslieť. Vysvetlenia a všeobecné rady sú bezpečné.",
  },

  // 4 · Čo do AI nepatrí
  {
    id: "ai-co-nezadavame",
    type: "checklist",
    icon: "shield",
    title: "Čo umelej inteligencii nehovoríme",
    short: "Osem vecí, ktoré si prejdete raz — a potom už len pokojne používate AI.",
    time: "8 minút",
    intro: "Toto nie je test vedomostí, ale zoznam zvykov, ktoré sa oplatí mať. Väčšinu z nich už asi dodržiavate.",
    task: "Odškrtnite si, čo už máte zaužívané. Zvyšné si nechajte na neskôr — kedykoľvek sa sem môžete vrátiť.",
    items: [
      { text: "Keď píšem AI, opisujem situáciu — nie svoje meno, adresu a rodné číslo.", why: "Na dobrú radu ich AI nepotrebuje. „Prišiel mi list z poisťovne o nedoplatku“ stačí úplne rovnako dobre." },
      { text: "Heslá, PIN a kódy z SMS nepíšem nikam — ani do AI.", why: "Tieto údaje patria výhradne na prihlasovaciu stránku danej služby. Nikto iný ich od vás nemá pýtať." },
      { text: "Skôr než odfotím dokument, prekryjem na ňom citlivé údaje.", why: "Papierik alebo prst cez rodné číslo a číslo účtu stačí. Text, ktorý si chcete nechať vysvetliť, zostane čitateľný." },
      { text: "Pri číslach, dátumoch a paragrafoch si odpoveď overím aj inde.", why: "Práve tu sa AI mýli najčastejšie. Oficiálna stránka úradu alebo banky to potvrdí za minútu." },
      { text: "Pri zdraví a peniazoch beriem AI ako prvý názor, nie ako posledné slovo.", why: "Vysvetliť správu alebo pripraviť otázky je výborné využitie. Rozhodnutie však patrí lekárovi, právnikovi či pracovníkovi banky." },
      { text: "Viem, že hlas aj tvár sa dnes dajú napodobniť.", why: "Preto pri žiadosti o peniaze voláme späť na číslo, ktoré máme uložené — nikdy nie na to, z ktorého prišla správa." },
      { text: "Máme v rodine dohodnuté kontrolné slovo pre prípad núdze.", why: "Jednoduchá vec, ktorá spoľahlivo odhalí podvodníka s napodobneným hlasom. Dohodnite sa na nej nahlas pri najbližšom stretnutí." },
      { text: "Viem, že v ChatGPT sa nedá nič pokaziť — a pokojne skúšam.", why: "Žiadne tlačidlo nič nezmaže vo vašom mobile ani účte. Obava z pokazenia je najčastejšia prekážka a je zbytočná." },
    ],
    note: "Nemusíte to stihnúť naraz. Aj keď si dnes osvojíte dve veci zo zoznamu, ste na tom lepšie než včera.",
  },

  // 5 · Prvý týždeň — pokojný plán, nič náročné
  {
    id: "ai-prvy-tyzden",
    type: "checklist",
    icon: "search",
    title: "Váš prvý týždeň s AI",
    short: "Sedem malých krokov na sedem dní. Každý zaberie pár minút a po týždni budete prekvapení.",
    time: "10 minút",
    intro: "Najlepší spôsob, ako si umelú inteligenciu osvojiť, je používať ju po troške každý deň. Tento plán je pokojný a nič v ňom nie je náročné.",
    task: "Prejdite si sedem krokov a odškrtnite si ten, ktorý už máte za sebou. Zoznam sa vám uloží, takže sa sem môžete vracať celý týždeň.",
    items: [
      { text: "Pondelok — otvorím ChatGPT a napíšem: „Ahoj, som tu prvýkrát. Predstav sa mi.“", why: "Prvý kontakt má byť ľahký. Uvidíte, že vám odpovie normálnou slovenčinou a nič sa nestane." },
      { text: "Utorok — spýtam sa na niečo, čo dobre poznám.", why: "Napríklad na históriu vašej obce alebo na vašu obľúbenú tému. Hneď uvidíte, ako si AI počína — a či niečo nepopletie." },
      { text: "Streda — nechám si vysvetliť slovo, ktorému nerozumiem.", why: "Skúste čokoľvek z novín alebo z lekárskej správy. Toto je vec, v ktorej je AI najsilnejšia." },
      { text: "Štvrtok — vyskúšam mikrofón a nadiktujem nákupný zoznam.", why: "Písanie na malej klávesnici nie je povinné. Keď zistíte, že AI rozumie vašej slovenčine, veľa sa zjednoduší." },
      { text: "Piatok — niečo odfotím a spýtam sa, čo to je.", why: "Rastlina, príbalový leták alebo súčiastka. Fotoaparát v aplikácii nahradí lupu aj atlas." },
      { text: "Sobota — nechám si poradiť recept z toho, čo mám doma.", why: "Praktické a hneď použiteľné. Vymenujte suroviny, čas a počet osôb — a máte večeru." },
      { text: "Nedeľa — ukážem niekomu z rodiny, čo som sa naučil.", why: "Vysvetľovanie druhým je najlepší spôsob, ako si vec zapamätať. A možno tým pomôžete aj niekomu ďalšiemu." },
    ],
    note: "Nemusíte stihnúť všetkých sedem. Aj dva kroky z tohto zoznamu znamenajú, že ste ďalej než minulý týždeň.",
  },

  // 6 · Kartička k počítaču
  {
    id: "ai-karta-promptov",
    type: "emergency-card",
    icon: "phone",
    title: "Kartička s vetami k počítaču",
    short: "Doplňte si dve vlastné vety a vytlačte si kartičku, ktorá vám s AI pomôže vždy.",
    time: "5 minút",
    intro: "Kým si na prácu s AI zvyknete, oplatí sa mať poruke pár hotových viet. Zostavíme vám z nich kartičku, ktorú si necháte pri počítači.",
    task: "Vyplňte dve políčka nižšie a kartička sa doplní sama. Potom si ju môžete rovno vytlačiť.",
    cardTitle: "Keď si neviem rady — čo napíšem AI",
    cardIcon: "message",
    fields: [
      { key: "temaLabel", label: "Téma, ktorú riešite najčastejšie", placeholder: "napríklad: záhrada" },
      { key: "temaPrompt", label: "Veta, ktorú si k nej chcete zapamätať", placeholder: "napríklad: Poraď mi, čo zasadiť v marci." },
      { key: "vlastnaLabel", label: "Ešte jedna vaša téma", placeholder: "napríklad: listy na úrad" },
      { key: "vlastnaPrompt", label: "A veta k nej", placeholder: "napríklad: Napíš slušnú žiadosť o…" },
    ],
    cardRows: [
      { label: "temaLabel", value: "temaPrompt", labelHint: "vaša téma", valueHint: "vaša veta" },
      { label: "vlastnaLabel", value: "vlastnaPrompt", labelHint: "ďalšia téma", valueHint: "vaša veta" },
    ],
    fixedRows: [
      { label: "Nerozumiem odpovedi", value: "Vysvetli mi to jednoduchšie." },
      { label: "Odpoveď je pridlhá", value: "Napíš to v troch bodoch." },
      { label: "Neviem, či je to pravda", value: "Odkiaľ to vieš?" },
      { label: "Odpoveď nesedí", value: "To nesedí, over to ešte raz." },
    ],
    stepsTitle: "Na čo nezabudnúť",
    steps: [
      "Opisujem situáciu — nie svoje meno, adresu a rodné číslo.",
      "Čísla, dátumy a paragrafy si overím aj na oficiálnej stránke.",
      "Pri zdraví a peniazoch má posledné slovo odborník.",
      "Pokaziť sa nedá nič — pýtam sa pokojne ďalej.",
    ],
    note: "Kartičku nechajte pri počítači. Za pár týždňov ju už nebudete potrebovať — a to je presne cieľ.",
  },

  ];

  window.COURSE_LIBRARY = window.COURSE_LIBRARY || {};
  window.COURSE_LIBRARY["zaciname-s-ai"] = window.COURSE_LIBRARY["zaciname-s-ai"] || {};
  window.COURSE_LIBRARY["zaciname-s-ai"].exercises = EXERCISES;
})();
