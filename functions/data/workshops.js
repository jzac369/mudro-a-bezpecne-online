// Obsah oboch workshopov — texty a otázky kvízu. Video (youtubeId) a
// brožúrka (brochureUrl) sa teraz spravujú v admin zóne a načítavajú sa
// z Firestore (kolekcia `workshops`) — hodnoty nižšie slúžia len ako
// záložná hodnota, kým admin nič nenastaví.
//
// Tento súbor beží v prehliadači AJ na serveri (Cloud Functions kopírujú
// jeho aktuálnu verziu pri každom nasadení — pozri firebase.json
// "predeploy" a functions/data/workshops.js) — server ním nezávisle od
// klienta overuje správne odpovede kvízu, aby si účastník nemohol sám
// zapísať vymyslený výsledok.
(function (root) {
  "use strict";
  var WORKSHOPS = {
  "bezpecne-financie": {
    id: "bezpecne-financie",
    title: "Ako nenaletieť podvodníkom",
    subtitle: "Bezpečné financie aj s pomocou umelej inteligencie",
    price: 19,
    priceLabel: "19 €",
    description:
      "Naučíme sa rozpoznať podvodný e-mail, telefonát „z banky“, zázračnú " +
      "investíciu aj poplašnú správu zo sociálnych sietí — a ukážeme si, " +
      "ako nám pri tom všetkom môže pomôcť umelá inteligencia ako „druhý názor na počkanie“.",
    youtubeId: "PLACEHOLDER_VIDEO_ID_1",
    brochureUrl: "assets/brozurky/bezpecne-financie.pdf",
    quiz: {
      passScore: 14,
      questions: [
        { question: "Volá vám osoba, ktorá tvrdí, že je z banky, a žiada previesť peniaze na „bezpečný účet“. Čo urobíte?", options: ["Peniaze okamžite prevediem, ide o naliehavú situáciu", "Hovor ukončím a zavolám banke na oficiálne číslo z karty", "Nadiktujem PIN, aby banka mohla účet zabezpečiť"], correctIndex: 1 },
        { question: "Umelá inteligencia vám odpovedala na dôležitú finančnú otázku. Ako postupovať?", options: ["Odpoveď AI je vždy správna", "Pri dôležitých rozhodnutiach si informácie overím aj inde", "Rozhodnem sa výlučne podľa AI"], correctIndex: 1 },
        { question: "Ponuka sľubuje: „Investujte 250 € a získajte garantovaný výnos 5 000 € mesačne.“ Čo je najpravdepodobnejšie?", options: ["Ide o výhodnú investičnú príležitosť", "Ide o bežný bankový produkt", "Ide o ponuku, ktorá s veľkou pravdepodobnosťou je podvod"], correctIndex: 2 },
        { question: "Ktoré údaje by ste nikdy nemali zadávať do ChatGPT ani posielať neznámej osobe?", options: ["Otázku o počasí", "Heslá, PIN kódy, čísla kariet alebo autorizačné kódy", "Recept na guláš"], correctIndex: 1 },
        { question: "Ktorý znak je typický pre poplašné či podvodné príspevky na sociálnych sieťach?", options: ["VEĽKÉ PÍSMENÁ, výkričníky a výzvy „Zdieľajte, kým to nezmažú!“", "Uvedený autor, dôveryhodný zdroj a odkazy na oficiálne informácie", "Vecný a pokojný štýl písania"], correctIndex: 0 },
        { question: "Na fotografii má osoba šesť prstov na jednej ruke. Čo je najpravdepodobnejšie?", options: ["Fotografia je len rozmazaná", "Obrázok mohol byť vytvorený alebo upravený umelou inteligenciou", "Ide o dôkaz, že fotografia je skutočná"], correctIndex: 1 },
        { question: "Čo je to „prompt“?", options: ["Tajný bezpečnostný kód", "Otázka alebo zadanie, ktoré napíšete umelej inteligencii", "Názov aplikácie na video hovory"], correctIndex: 1 },
        { question: "Čo znamená, že AI „halucinuje“?", options: ["AI si niečo vymyslí a tvári sa, že je to pravda", "AI sa vypne kvôli chybe", "AI zobrazuje farebné obrázky"], correctIndex: 0 },
        { question: "Ako sa volal prvý počítačový program schopný viesť rozhovor podobný ľudskému a v ktorom roku vznikol?", options: ["ChatGPT, 2020", "ELIZA, 1966", "Google, 1998"], correctIndex: 1 },
        { question: "Čo je „phishing“?", options: ["Podvodný e-mail alebo SMS, ktoré sa tvária ako správa od banky či úradu a chcú vylákať vaše údaje", "Druh rybolovu", "Bezpečný spôsob platby cez internet"], correctIndex: 0 },
        { question: "Čo je „vishing“?", options: ["Podvod cez telefonát, pri ktorom sa volajúci vydáva napr. za pracovníka banky", "Vírus v počítači", "Bezpečnostný kód karty"], correctIndex: 0 },
        { question: "Čo je „smishing“?", options: ["Podvod cez SMS správu, napríklad falošné oznámenie o doručení balíka", "Skratka pre smartfón", "Typ internetového pripojenia"], correctIndex: 0 },
        { question: "Čo je „dezinformácia“?", options: ["Nepravdivá informácia šírená úmyselne s cieľom ovplyvniť názory alebo správanie ľudí", "Aktualizácia softvéru", "Iný názov pre reklamu"], correctIndex: 0 },
        { question: "Čo je „deepfake“?", options: ["Falošné video alebo hlas vytvorený umelou inteligenciou, ktorý napodobňuje skutočnú osobu", "Staré, zašumené video", "Bezpečnostná funkcia telefónu"], correctIndex: 0 },
        { question: "Čo je „dvojfaktorové overenie“?", options: ["Dvojitý zámok — okrem hesla treba zadať aj kód, napríklad z SMS", "Dve rôzne heslá k tomu istému účtu", "Overenie dvomi rôznymi bankami naraz"], correctIndex: 0 },
        { question: "Podľa jednej zo „zlatých poučiek“ z brožúry: „Kto ma naháňa a tlačí na rýchle konanie…“", options: ["…mi chce ušetriť čas", "…chce ma pripraviť o peniaze", "…je vždy z banky"], correctIndex: 1 },
        { question: "Dostali ste nezrozumiteľnú zmluvu od dodávateľa energií. Čo je bezpečný postup pri práci s AI?", options: ["Odfotiť zmluvu aj s rodným číslom a poslať ju AI na vysvetlenie", "Prekryť osobné údaje, dať si zmluvu vysvetliť jednoducho a pri väčších rozhodnutiach sa poradiť aj s odborníkom", "Zmluvu radšej vôbec nečítať"], correctIndex: 1 },
        { question: "Ako si bezpečne overíte telefonát, ktorý tvrdí, že je „z banky“?", options: ["Zavolám späť na číslo, ktoré mi volajúci sám nadiktoval", "Zavolám na oficiálne číslo z karty alebo webu banky, nie na číslo od volajúceho", "Údaje potvrdím rovno v hovore, aby to bolo rýchlejšie"], correctIndex: 1 },
        { question: "Čo urobiť, ak sa aj napriek opatrnosti staniete obeťou podvodu?", options: ["Nič, peniaze sú už stratené", "Okamžite kontaktovať banku (zablokovanie karty/účtu) a nahlásiť to polícii na 158 alebo 112", "Počkať mesiac, či sa podvodník sám neozve"], correctIndex: 1 },
        { question: "Aká je celková hlavná myšlienka všetkých šiestich „zlatých pravidiel“ z brožúry?", options: ["Internetu je lepšie sa úplne vyhýbať", "Spomaľte, spýtajte sa a overte si to skôr, než konáte", "Umelá inteligencia rozhoduje namiesto vás"], correctIndex: 1 },
      ],
    },
  },
  "zaciname-s-ai": {
    id: "zaciname-s-ai",
    title: "Začíname s umelou inteligenciou",
    subtitle: "Prvé kroky s AI asistentom bez obáv",
    price: 19,
    priceLabel: "19 €",
    description:
      "Vysvetlíme si zrozumiteľne, čo je umelá inteligencia, ako sa s ňou " +
      "bezpečne porozprávať a na čo všetko nám môže byť v bežnom živote " +
      "užitočná — od písania listov po hľadanie receptov.",
    youtubeId: "PLACEHOLDER_VIDEO_ID_2",
    brochureUrl: "assets/brozurky/zaciname-s-ai.pdf",
    quiz: {
      passScore: 14,
      questions: [
        { question: "Umelá inteligencia je najlepšie chápať ako:", options: ["Program, ktorý vždy hovorí úplnú pravdu", "Nástroj, ktorý pomáha, ale odpovede je dobré si overiť", "Robota, ktorý za nás rozhoduje"], correctIndex: 1 },
        { question: "Ako sa volá text, ktorý napíšete AI asistentovi, aby vám niečo urobil?", options: ["Prompt (zadanie/otázka)", "Heslo", "Kód"], correctIndex: 0 },
        { question: "Môže sa AI asistent niekedy pomýliť?", options: ["Nie, nikdy", "Áno, môže uviesť nesprávnu informáciu, preto je dobré si dôležité veci overiť", "Len v noci"], correctIndex: 1 },
        { question: "Na čo môže byť AI asistent v bežnom živote užitočný?", options: ["Napríklad na napísanie listu, hľadanie receptu alebo vysvetlenie pojmu", "Len na hranie hier", "Nedá sa využiť v bežnom živote"], correctIndex: 0 },
        { question: "Je bezpečné napísať AI asistentovi svoje rodné číslo alebo heslo do banky?", options: ["Áno, AI to potrebuje vedieť", "Nie, citlivé osobné údaje by ste nemali zdieľať s AI ani inde online", "Len ak je to „dôveryhodná“ aplikácia"], correctIndex: 1 },
        { question: "Čím konkrétnejšia je vaša otázka pre AI, tým je zvyčajne odpoveď:", options: ["Nesúvisí to spolu", "Presnejšia a užitočnejšia", "Kratšia"], correctIndex: 1 },
        { question: "Čo znamená skratka „AI“?", options: ["Automatický internet", "Umelá inteligencia (Artificial Intelligence)", "Aplikačný ikon"], correctIndex: 1 },
        { question: "Ak vám AI asistent dá odpoveď, ktorej nerozumiete, čo môžete urobiť?", options: ["Poprosiť ho, aby to vysvetlil jednoduchšie", "Musíte to len prijať", "Zavrieť aplikáciu a už ju nepoužívať"], correctIndex: 0 },
        { question: "Dokáže AI asistent napísať za vás blahoprajný text k narodeninám?", options: ["Áno, stačí mu to opísať (komu, aká príležitosť, aký tón)", "Nie, to nevie", "Len v angličtine"], correctIndex: 0 },
        { question: "Je AI asistent to isté ako vyhľadávač (napr. Google)?", options: ["Áno, úplne to isté", "Nie — AI vám vie priamo odpovedať a poradiť, nielen ukázať odkazy", "Áno, len má iné farby"], correctIndex: 1 },
        { question: "Ak chcete od AI jednoduchý recept na obed, čo je dobré napísať do promptu?", options: ["Len slovo „jedlo“", "Čo máte doma, koľko času máte a pre koľko ľudí varíte", "Nič, AI to uhádne samo"], correctIndex: 1 },
        { question: "Môžete AI asistenta požiadať, aby vám vysvetlil odborný text jednoduchšími slovami?", options: ["Áno, presne na to sa výborne hodí", "Nie, AI rozumie len odborným textom", "Len ak je text v angličtine"], correctIndex: 0 },
        { question: "Čo by ste mali urobiť, ak vám AI poradí niečo dôležité o zdraví alebo peniazoch?", options: ["Konať okamžite bez rozmýšľania", "Overiť si to u odborníka (lekár, banka) skôr, než budete konať", "Ignorovať to vždy"], correctIndex: 1 },
        { question: "Je normálne, že AI asistent odpovedá inak, keď sa spýtate rovnakú vec dvakrát?", options: ["Nie, to je chyba", "Áno, môže sa to mierne líšiť, keďže odpovede generuje nanovo", "Znamená to, že je pokazený"], correctIndex: 1 },
        { question: "Čo je „chatbot“?", options: ["Program, s ktorým sa dá viesť rozhovor formou písania správ", "Druh počítačového vírusu", "Meno konkrétnej firmy"], correctIndex: 0 },
        { question: "Môže vám AI pomôcť naformulovať e-mail alebo list, keď neviete, ako začať?", options: ["Áno, stačí popísať o čo ide a komu píšete", "Nie, listy musí písať človek úplne sám", "Len úradné listy"], correctIndex: 0 },
        { question: "Čo znamená, že AI „halucinuje“?", options: ["AI vidí farebné obrázky", "AI si niečo vymyslí a podá to ako fakt, hoci to nie je pravda", "AI sa vypne"], correctIndex: 1 },
        { question: "Je v poriadku opýtať sa AI asistenta na to isté viackrát inými slovami, ak odpoveď nie je jasná?", options: ["Áno, to je úplne bežné a pomáha to", "Nie, pýtať sa môžete len raz", "AI by sa nahnevala"], correctIndex: 0 },
        { question: "Potrebujete na používanie väčšiny AI asistentov pripojenie na internet?", options: ["Áno, väčšinou áno", "Nikdy nie je potrebné", "Len v pondelok"], correctIndex: 0 },
        { question: "Aký je dobrý prvý krok, keď začínate s AI asistentom?", options: ["Skúsiť jednoduchú, bežnú otázku, napr. o niečom, čo dobre poznáte", "Hneď sa ho pýtať na veľmi zložité odborné veci", "Nepoužívať ho vôbec zo strachu z chyby"], correctIndex: 0 },
      ],
    },
  },
  };
  root.WORKSHOPS = WORKSHOPS;
  if (typeof module !== "undefined" && module.exports) module.exports = WORKSHOPS;
})(typeof window !== "undefined" ? window : globalThis);
