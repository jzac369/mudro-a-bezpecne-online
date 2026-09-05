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
        { question: "Volá vám osoba, ktorá tvrdí, že je z banky, a žiada previesť peniaze na „bezpečný účet“. Čo urobíte?", options: ["Hovor ukončím a zavolám banke na oficiálne číslo z karty", "Peniaze okamžite prevediem, ide o naliehavú situáciu", "Nadiktujem PIN, aby banka mohla účet zabezpečiť"], correctIndex: 0 },
        { question: "Umelá inteligencia vám odpovedala na dôležitú finančnú otázku. Ako postupovať?", options: ["Odpoveď AI je vždy správna", "Rozhodnem sa výlučne podľa AI", "Pri dôležitých rozhodnutiach si informácie overím aj inde"], correctIndex: 2 },
        { question: "Ponuka sľubuje: „Investujte 250 € a získajte garantovaný výnos 5 000 € mesačne.“ Čo je najpravdepodobnejšie?", options: ["Ide o výhodnú investičnú príležitosť", "Ide o ponuku, ktorá s veľkou pravdepodobnosťou je podvod", "Ide o bežný bankový produkt"], correctIndex: 1 },
        { question: "Ktoré údaje by ste nikdy nemali zadávať do ChatGPT ani posielať neznámej osobe?", options: ["Heslá, PIN kódy, čísla kariet alebo autorizačné kódy", "Otázku o počasí", "Recept na guláš"], correctIndex: 0 },
        { question: "Ktorý znak je typický pre poplašné či podvodné príspevky na sociálnych sieťach?", options: ["Uvedený autor, dôveryhodný zdroj a odkazy na oficiálne informácie", "VEĽKÉ PÍSMENÁ, výkričníky a výzvy „Zdieľajte, kým to nezmažú!“", "Vecný a pokojný štýl písania"], correctIndex: 1 },
        { question: "Na fotografii má osoba šesť prstov na jednej ruke. Čo je najpravdepodobnejšie?", options: ["Fotografia je len rozmazaná", "Ide o dôkaz, že fotografia je skutočná", "Obrázok mohol byť vytvorený alebo upravený umelou inteligenciou"], correctIndex: 2 },
        { question: "Čo je to „prompt“?", options: ["Otázka alebo zadanie, ktoré napíšete umelej inteligencii", "Tajný bezpečnostný kód", "Názov aplikácie na video hovory"], correctIndex: 0 },
        { question: "Čo znamená, že AI „halucinuje“?", options: ["AI sa vypne kvôli chybe", "AI si niečo vymyslí a tvári sa, že je to pravda", "AI zobrazuje farebné obrázky"], correctIndex: 1 },
        { question: "Ako sa volal prvý počítačový program schopný viesť rozhovor podobný ľudskému a v ktorom roku vznikol?", options: ["ChatGPT, 2020", "Google, 1998", "ELIZA, 1966"], correctIndex: 2 },
        { question: "Čo je „phishing“?", options: ["Druh rybolovu", "Podvodný e-mail alebo SMS, ktoré sa tvária ako správa od banky či úradu a chcú vylákať vaše údaje", "Bezpečný spôsob platby cez internet"], correctIndex: 1 },
        { question: "Čo je „vishing“?", options: ["Podvod cez telefonát, pri ktorom sa volajúci vydáva napr. za pracovníka banky", "Vírus v počítači", "Bezpečnostný kód karty"], correctIndex: 0 },
        { question: "Čo je „smishing“?", options: ["Skratka pre smartfón", "Typ internetového pripojenia", "Podvod cez SMS správu, napríklad falošné oznámenie o doručení balíka"], correctIndex: 2 },
        { question: "Čo je „dezinformácia“?", options: ["Aktualizácia softvéru", "Nepravdivá informácia šírená úmyselne s cieľom ovplyvniť názory alebo správanie ľudí", "Iný názov pre reklamu"], correctIndex: 1 },
        { question: "Čo je „deepfake“?", options: ["Falošné video alebo hlas vytvorený umelou inteligenciou, ktorý napodobňuje skutočnú osobu", "Staré, zašumené video", "Bezpečnostná funkcia telefónu"], correctIndex: 0 },
        { question: "Čo je „dvojfaktorové overenie“?", options: ["Dve rôzne heslá k tomu istému účtu", "Overenie dvomi rôznymi bankami naraz", "Dvojitý zámok — okrem hesla treba zadať aj kód, napríklad z SMS"], correctIndex: 2 },
        { question: "Podľa jednej zo „zlatých poučiek“ z brožúry: „Kto ma naháňa a tlačí na rýchle konanie…“", options: ["…mi chce ušetriť čas", "…chce ma pripraviť o peniaze", "…je vždy z banky"], correctIndex: 1 },
        { question: "Dostali ste nezrozumiteľnú zmluvu od dodávateľa energií. Čo je bezpečný postup pri práci s AI?", options: ["Odfotiť zmluvu aj s rodným číslom a poslať ju AI na vysvetlenie", "Zmluvu radšej vôbec nečítať", "Prekryť osobné údaje, dať si zmluvu vysvetliť jednoducho a pri väčších rozhodnutiach sa poradiť aj s odborníkom"], correctIndex: 2 },
        { question: "Ako si bezpečne overíte telefonát, ktorý tvrdí, že je „z banky“?", options: ["Zavolám na oficiálne číslo z karty alebo webu banky, nie na číslo od volajúceho", "Zavolám späť na číslo, ktoré mi volajúci sám nadiktoval", "Údaje potvrdím rovno v hovore, aby to bolo rýchlejšie"], correctIndex: 0 },
        { question: "Čo urobiť, ak sa aj napriek opatrnosti staniete obeťou podvodu?", options: ["Nič, peniaze sú už stratené", "Okamžite kontaktovať banku (zablokovanie karty/účtu) a nahlásiť to polícii na 158 alebo 112", "Počkať mesiac, či sa podvodník sám neozve"], correctIndex: 1 },
        { question: "Aká je celková hlavná myšlienka všetkých šiestich „zlatých pravidiel“ z brožúry?", options: ["Spomaľte, spýtajte sa a overte si to skôr, než konáte", "Internetu je lepšie sa úplne vyhýbať", "Umelá inteligencia rozhoduje namiesto vás"], correctIndex: 0 },
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
        { question: "Môže sa AI asistent niekedy pomýliť?", options: ["Nie, nikdy", "Len v noci", "Áno, môže uviesť nesprávnu informáciu, preto je dobré si dôležité veci overiť"], correctIndex: 2 },
        { question: "Na čo môže byť AI asistent v bežnom živote užitočný?", options: ["Len na hranie hier", "Napríklad na napísanie listu, hľadanie receptu alebo vysvetlenie pojmu", "Nedá sa využiť v bežnom živote"], correctIndex: 1 },
        { question: "Je bezpečné napísať AI asistentovi svoje rodné číslo alebo heslo do banky?", options: ["Áno, AI to potrebuje vedieť", "Len ak je to „dôveryhodná“ aplikácia", "Nie, citlivé osobné údaje by ste nemali zdieľať s AI ani inde online"], correctIndex: 2 },
        { question: "Čím konkrétnejšia je vaša otázka pre AI, tým je zvyčajne odpoveď:", options: ["Presnejšia a užitočnejšia", "Nesúvisí to spolu", "Kratšia"], correctIndex: 0 },
        { question: "Čo znamená skratka „AI“?", options: ["Automatický internet", "Umelá inteligencia (Artificial Intelligence)", "Aplikačný ikon"], correctIndex: 1 },
        { question: "Ak vám AI asistent dá odpoveď, ktorej nerozumiete, čo môžete urobiť?", options: ["Musíte to len prijať", "Zavrieť aplikáciu a už ju nepoužívať", "Poprosiť ho, aby to vysvetlil jednoduchšie"], correctIndex: 2 },
        { question: "Dokáže AI asistent napísať za vás blahoprajný text k narodeninám?", options: ["Áno, stačí mu to opísať (komu, aká príležitosť, aký tón)", "Nie, to nevie", "Len v angličtine"], correctIndex: 0 },
        { question: "Je AI asistent to isté ako vyhľadávač (napr. Google)?", options: ["Áno, úplne to isté", "Áno, len má iné farby", "Nie — AI vám vie priamo odpovedať a poradiť, nielen ukázať odkazy"], correctIndex: 2 },
        { question: "Ak chcete od AI jednoduchý recept na obed, čo je dobré napísať do promptu?", options: ["Len slovo „jedlo“", "Čo máte doma, koľko času máte a pre koľko ľudí varíte", "Nič, AI to uhádne samo"], correctIndex: 1 },
        { question: "Môžete AI asistenta požiadať, aby vám vysvetlil odborný text jednoduchšími slovami?", options: ["Áno, presne na to sa výborne hodí", "Nie, AI rozumie len odborným textom", "Len ak je text v angličtine"], correctIndex: 0 },
        { question: "Čo by ste mali urobiť, ak vám AI poradí niečo dôležité o zdraví alebo peniazoch?", options: ["Konať okamžite bez rozmýšľania", "Ignorovať to vždy", "Overiť si to u odborníka (lekár, banka) skôr, než budete konať"], correctIndex: 2 },
        { question: "Je normálne, že AI asistent odpovedá inak, keď sa spýtate rovnakú vec dvakrát?", options: ["Nie, to je chyba", "Áno, môže sa to mierne líšiť, keďže odpovede generuje nanovo", "Znamená to, že je pokazený"], correctIndex: 1 },
        { question: "Čo je „chatbot“?", options: ["Program, s ktorým sa dá viesť rozhovor formou písania správ", "Druh počítačového vírusu", "Meno konkrétnej firmy"], correctIndex: 0 },
        { question: "Môže vám AI pomôcť naformulovať e-mail alebo list, keď neviete, ako začať?", options: ["Nie, listy musí písať človek úplne sám", "Áno, stačí popísať o čo ide a komu píšete", "Len úradné listy"], correctIndex: 1 },
        { question: "Čo znamená, že AI „halucinuje“?", options: ["AI si niečo vymyslí a podá to ako fakt, hoci to nie je pravda", "AI vidí farebné obrázky", "AI sa vypne"], correctIndex: 0 },
        { question: "Je v poriadku opýtať sa AI asistenta na to isté viackrát inými slovami, ak odpoveď nie je jasná?", options: ["Nie, pýtať sa môžete len raz", "AI by sa nahnevala", "Áno, to je úplne bežné a pomáha to"], correctIndex: 2 },
        { question: "Potrebujete na používanie väčšiny AI asistentov pripojenie na internet?", options: ["Áno, väčšinou áno", "Nikdy nie je potrebné", "Len v pondelok"], correctIndex: 0 },
        { question: "Aký je dobrý prvý krok, keď začínate s AI asistentom?", options: ["Hneď sa ho pýtať na veľmi zložité odborné veci", "Skúsiť jednoduchú, bežnú otázku, napr. o niečom, čo dobre poznáte", "Nepoužívať ho vôbec zo strachu z chyby"], correctIndex: 1 },
      ],
    },
  },
  };
  root.WORKSHOPS = WORKSHOPS;
  if (typeof module !== "undefined" && module.exports) module.exports = WORKSHOPS;
})(typeof window !== "undefined" ? window : globalThis);
