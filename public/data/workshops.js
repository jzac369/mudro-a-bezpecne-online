// Obsah oboch workshopov — texty a otázky kvízu. Video (youtubeId) a
// brožúrka (brochureUrl) sa teraz spravujú v admin zóne a načítavajú sa
// z Firestore (kolekcia `workshops`) — hodnoty nižšie slúžia len ako
// záložná hodnota, kým admin nič nenastaví.
window.WORKSHOPS = {
  "bezpecne-financie": {
    id: "bezpecne-financie",
    title: "Ako nenaletieť podvodníkom",
    subtitle: "Bezpečné financie aj s pomocou umelej inteligencie",
    price: 19,
    priceLabel: "19 €",
    description:
      "Naučíme sa rozpoznať podvodné telefonáty, e-maily a SMS správy, " +
      "overiť si podozrivú výzvu skôr, než pošleme peniaze, a ukážeme, " +
      "ako môže umelá inteligencia pomôcť odhaliť podvod.",
    youtubeId: "PLACEHOLDER_VIDEO_ID_1",
    brochureUrl: "assets/brozurky/bezpecne-financie.pdf",
    exercises: [
      {
        id: "rozpoznaj-email",
        title: "Rozpoznaj podvodný e-mail",
        prompt:
          "Pozri si e-mail nižšie a rozhodni, či ide o podvod, alebo o " +
          "skutočnú správu od banky.",
      },
    ],
    quiz: {
      passScore: 14,
      questions: [
        { question: "Zavolá vám niekto, kto tvrdí, že je z banky, a žiada okamžite nahlásiť PIN kód. Čo urobíte?", options: ["Nahlásim PIN, veď to znie dôveryhodne", "Zložím a zavolám späť na oficiálne číslo banky z karty alebo výpisu", "Pošlem PIN cez SMS, nech je to rýchlejšie"], correctIndex: 1 },
        { question: "Príde vám e-mail, že ste vyhrali veľkú sumu peňazí, ale musíte najprv zaplatiť „poplatok“. Čo to najčastejšie je?", options: ["Bežná výhra v súťaži", "Podvod (nikdy neplatíte za to, aby ste dostali výhru)", "Chyba banky"], correctIndex: 1 },
        { question: "Aké informácie by ste NIKDY nemali diktovať po telefóne cudziemu volajúcemu?", options: ["Meno a priezvisko", "PIN, heslo alebo celé číslo karty", "Mesto, v ktorom bývate"], correctIndex: 1 },
        { question: "Vnúčik vám zavolá a povie, že má problém a potrebuje peniaze hneď, nemá čas vysvetľovať. Čo je najbezpečnejšie?", options: ["Pošlem peniaze okamžite, veď je to rodina", "Zavesím a zavolám vnukovi na jeho bežné číslo, aby som si to overil(a)", "Pošlem polovicu sumy"], correctIndex: 1 },
        { question: "Čo je „phishing“?", options: ["Druh rybolovu", "Podvodná snaha vylákať vaše heslá alebo údaje falošným e-mailom či stránkou", "Bezpečný spôsob platby"], correctIndex: 1 },
        { question: "Dostanete SMS: „Vaša zásielka čaká, kliknite tu a zaplaťte 1 €.“ Čo je najbezpečnejšie?", options: ["Kliknúť a rýchlo zaplatiť", "Neklikať a overiť si zásielku priamo na stránke pošty/kuriéra", "Preposlať SMS známym"], correctIndex: 1 },
        { question: "Ako spoznáte podozrivú webovú adresu (URL)?", options: ["Je vždy krátka", "Má preklepy, čudné znaky alebo nesedí s názvom firmy", "Je vždy napísaná veľkými písmenami"], correctIndex: 1 },
        { question: "Volajúci sa vydáva za políciu a žiada, aby ste peniaze „preniesli na bezpečný účet“. Čo urobíte?", options: ["Uposlúchnem, polícia má vždy pravdu", "Zložím telefón a sám(sama) zavolám na 158", "Pošlem peniaze poštou"], correctIndex: 1 },
        { question: "Prečo je nebezpečné klikať na odkazy v neznámych e-mailoch?", options: ["Môžu viesť na podvodnú stránku alebo stiahnuť škodlivý súbor", "Spomalia internet", "Nie je to nebezpečné"], correctIndex: 0 },
        { question: "Čo znamená, že platba je „nezvratná“?", options: ["Dá sa kedykoľvek vrátiť", "Peniaze sa po odoslaní už väčšinou nedajú jednoducho stiahnuť späť", "Platí to len pre platby kartou"], correctIndex: 1 },
        { question: "Ako môže umelá inteligencia pomôcť pri odhaľovaní podvodov?", options: ["Vie napísať dôveryhodne znejúci text, ktorým dokáže podvodník oklamať", "AI podvody úplne vylúčila", "AI sa v podvodoch nepoužíva"], correctIndex: 0 },
        { question: "Ak si nie ste istý(á), či je hovor alebo správa podvod, čo je najlepšie?", options: ["Reagovať čo najrýchlejšie", "Poradiť sa s rodinou alebo si to overiť na oficiálnom čísle/stránke", "Ignorovať a vymazať bez rozmýšľania"], correctIndex: 1 },
        { question: "Čo je „falošný hlas AI“ (deepfake hlas)?", options: ["Umelo vytvorený hlas, ktorý znie ako known osoba, no v skutočnosti ňou nie je", "Porucha telefónu", "Staré nahrávky z rádia"], correctIndex: 0 },
        { question: "Prečo je vhodné mať s rodinou dohodnuté „bezpečné heslo“ pre núdzové situácie?", options: ["Aby ste overili, že volajúci je naozaj váš príbuzný", "Nie je to potrebné", "Slúži len na hry"], correctIndex: 0 },
        { question: "Podvodník tvrdí, že musíte konať „ihneď, inak príde o účet“. Prečo na to podvodníci tlačia?", options: ["Aby ste sa nestihli poradiť alebo overiť si to", "Aby vám ušetrili čas", "Nemá to žiadny dôvod"], correctIndex: 0 },
        { question: "Je bezpečné nainštalovať si aplikáciu na „vzdialenú pomoc“, o ktorú vás požiada neznámy volajúci?", options: ["Áno, vždy pomáha rýchlejšie vyriešiť problém", "Nie, môže tak získať prístup k vášmu počítaču a peniazom", "Len ak je aplikácia farebná"], correctIndex: 1 },
        { question: "Čo robiť, ak ste už omylom poslali peniaze podvodníkovi?", options: ["Nič, je už neskoro", "Čo najskôr kontaktovať banku a nahlásiť to polícii", "Počkať týždeň a uvidieť, čo sa stane"], correctIndex: 1 },
        { question: "Prečo si podvodníci často vyberajú seniorov ako cieľ?", options: ["Pretože sú menej dôverčiví", "Niektorí môžu byť menej oboznámení s novými podvodnými technikami a bývajú ochotní pomôcť", "Seniori nemajú peniaze"], correctIndex: 1 },
        { question: "Čo znamená „overiť si informáciu z druhého, nezávislého zdroja“?", options: ["Veriť len tomu, čo povie volajúci", "Skontrolovať si to napríklad na oficiálnej stránke banky alebo telefonicky u rodiny", "Nie je to potrebné"], correctIndex: 1 },
        { question: "Ktoré tvrdenie je pravdivé?", options: ["Banka si od vás nikdy nebude telefonicky pýtať PIN ani celé heslo", "Banka si môže telefonicky pýtať váš PIN", "Podvody sa týkajú len mladých ľudí"], correctIndex: 0 },
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
    exercises: [
      {
        id: "prvy-prompt",
        title: "Napíš svoju prvú otázku pre AI asistenta",
        prompt: "Skús sformulovať jednoduchú otázku, ktorú by si položil(a) AI asistentovi.",
      },
    ],
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
