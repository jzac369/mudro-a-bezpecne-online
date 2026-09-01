// Obsah interaktívneho kurzu "Ako sa nenechať oklamať" — 35 obrazoviek.
// Každá obrazovka má `type`, ktorý hovorí renderovaciemu enginu (assets/course.js),
// akú interakciu má vykresliť, a dátové polia, ktoré ten typ potrebuje.
window.COURSE_SLIDES = [

  // ---------- ČASŤ 1 · Spoznávame pomocníka ----------
  {
    id: 1, part: 1, type: "intro",
    title: "Ako sa nenechať oklamať",
    lead: "Umelá inteligencia ako pomocník pri finančných rozhodnutiach.",
    image: "assets/course-media/illustrations/cover-elderly-couple.jpg",
    body: "Čaká vás 35 krátkych zastavení rozdelených do 5 častí. Pri každej si niečo vyskúšate — nič sa nedá pokaziť, kedykoľvek sa môžete vrátiť tam, kde ste skončili.",
  },
  {
    id: 2, part: 1, type: "tiles",
    title: "Čo nás čaká",
    lead: "Kliknite postupne na aspoň tri dlaždice a pozrite si, čo vás čaká.",
    tiles: [
      { title: "Spoznávame pomocníka", text: "Čo je umelá inteligencia, čo vie a čo nevie." },
      { title: "Pozor, AI sa mýli", text: "Prečo si treba dôležité veci overiť." },
      { title: "Lovci podvodov", text: "Podozrivé e-maily, telefonáty aj SMS zo života." },
      { title: "Hoaxy, fotky, zmluvy", text: "Poplašné správy, AI fotografie a zložité zmluvy." },
      { title: "Zlaté pravidlá", text: "Čo nikdy nezadávame — ani do AI." },
    ],
    minOpened: 3,
  },
  {
    id: 3, part: 1, type: "flip",
    title: "Čo je to vlastne umelá inteligencia?",
    lead: "Kliknutím na kartu ju otočíte.",
    cards: [
      { front: "Sčítaný pomocník", back: "AI si prečítala obrovské množstvo kníh, novín a webových stránok. Vďaka tomu vie odpovedať na otázky, vysvetľovať a radiť." },
      { front: "Nikdy sa neunaví", back: "Môžete sa jej pýtať kedykoľvek, koľkokrát chcete, a nikdy ju to neomrzí ani neurazí." },
      { front: "Občas sa mýli", back: "Podobne ako človek. Nie všetko, čo AI povie, je nutne pravda — treba si to overiť." },
      { front: "Vedeli ste?", back: "Prvý program, ktorý viedol rozhovor podobný ľudskému, sa volal ELIZA a vznikol už v roku 1966. Len sa v posledných rokoch výrazne zlepšil." },
    ],
  },
  {
    id: 4, part: 1, type: "sort",
    title: "Čo AI vie a čo nevie",
    lead: "Presuňte každú kartičku do správneho košíka.",
    baskets: [
      { id: "vie", label: "AI vie" },
      { id: "nevie", label: "AI nevie" },
    ],
    items: [
      { text: "vysvetliť zložité veci jednoducho", basket: "vie" },
      { text: "upozorniť na možné riziká a podvody", basket: "vie" },
      { text: "pomôcť rozpoznať podvodný e-mail či SMS", basket: "vie" },
      { text: "zhrnúť dlhý text alebo zmluvu", basket: "vie" },
      { text: "trpezlivo odpovedať na vaše otázky", basket: "vie" },
      { text: "rozhodovať za vás", basket: "nevie" },
      { text: "zaručiť, že každá odpoveď je správna", basket: "nevie" },
      { text: "nahradiť banku, lekára či právnika", basket: "nevie" },
      { text: "vidieť do vášho účtu (a tak je to správne!)", basket: "nevie" },
      { text: "prevziať zodpovednosť za vaše rozhodnutia", basket: "nevie" },
    ],
    note: "AI je ako navigácia v aute: dokáže vás skvele navigovať, ale volant držíte vy.",
  },
  {
    id: 5, part: 1, type: "match",
    title: "AI ako „druhý názor“ — vždy poruke",
    lead: "Spojte situáciu s tým, ako vám v nej AI pomôže.",
    pairs: [
      { left: "Dostali ste podozrivý e-mail", right: "Rozoberie ho vetu po vete a ukáže varovné znaky." },
      { left: "Volala vám „banka“", right: "Vysvetlí, ako banky v takých situáciách naozaj postupujú." },
      { left: "Ponúkajú vám výhodnú investíciu", right: "Upozorní na riziká a navrhne otázky, ktoré si položiť." },
      { left: "Nerozumiete zmluve", right: "Vysvetlí obsah jednoduchým a zrozumiteľným jazykom." },
    ],
    note: "Umelá inteligencia nie je neomylná. Pomôže vám premýšľať, no nenahrádza odborníka.",
  },
  {
    id: 6, part: 1, type: "sequence",
    title: "Začíname s ChatGPT — krok za krokom",
    lead: "Klikajte na kroky v poradí, v akom idú za sebou.",
    steps: [
      "Otvorte aplikáciu ChatGPT alebo v prehliadači napíšte chatgpt.com.",
      "Dole na obrazovke nájdete okienko na písanie — rovnaké ako pri SMS.",
      "Napíšte otázku celou vetou, ako by ste ju položili človeku.",
      "Stlačte šípku (odoslať) a počkajte pár sekúnd na odpoveď.",
      "Nerozumeli ste? Napíšte: „Vysvetli mi to jednoduchšie.“",
    ],
    note: "V ChatGPT sa nedá nič pokaziť. Žiadne tlačidlo nič nezmaže vo vašom mobile ani účte.",
  },
  {
    id: 7, part: 1, type: "hotspot",
    title: "Takto vyzerá ChatGPT v praxi",
    lead: "Kliknite postupne na všetky tri označené miesta.",
    spots: [
      { x: 18, y: 50, title: "Zoznam rozhovorov", text: "Vľavo — staršie otázky sa nestrácajú, kedykoľvek sa k nim vrátite." },
      { x: 60, y: 85, title: "Okienko na písanie", text: "Dole — otázka sa píše rovnako ako SMS správa." },
      { x: 60, y: 30, title: "Odpoveď po slovensky", text: "AI odpovie prehľadne, väčšinou v bodoch." },
    ],
    evidenceImage: {
      src: "assets/course-media/evidence/chatgpt-screenshot.jpg",
      caption: "Skutočná obrazovka aplikácie ChatGPT na tablete — presne takto to uvidíte aj vy.",
    },
  },
  {
    id: 8, part: 1, type: "choice",
    title: "Ako sa správne pýtať",
    lead: "Pri každej dvojici vyberte lepšiu otázku pre AI (prompt).",
    intro: "Čím presnejšia otázka, tým užitočnejšia odpoveď. Presne ako u lekára.",
    rounds: [
      {
        weak: "Čo s týmto e-mailom?",
        good: "Prišiel mi tento e-mail z banky. Myslíš, že je podozrivý? Na čo si mám dať pozor?",
        why: "AI nevie, kto ste ani čo sa stalo. Konkrétny popis dá konkrétnu odpoveď.",
      },
      {
        weak: "Phishing?",
        good: "Sused mi ponúka investíciu s garantovaným ziskom 20 % mesačne. Aké sú riziká?",
        why: "Jedno slovo nestačí — opíšte situáciu tak, ako by ste ju vysvetlili susedovi.",
      },
      {
        weak: "Mám investovať?",
        good: "Ponúkajú mi investíciu do firmy X s výnosom 20 % mesačne. Aké otázky si mám overiť pred rozhodnutím?",
        why: "AI vám nerozhodne za vás, ale pomôže spýtať sa na správne veci.",
      },
    ],
    note: "Užitočná rada: na koniec otázky pridajte „Vysvetli mi to jednoducho, ako seniorovi.“",
  },

  // ---------- ČASŤ 2 · Pozor, AI sa mýli ----------
  {
    id: 9, part: 2, type: "belief",
    title: "Keď si AI vymýšľa: halucinácie",
    lead: "AI vám sebavedomo odpovedala. Uveríte hneď, alebo si to overíte?",
    items: [
      { text: "„Táto banka má zákaznícku linku 0800 123 456.“", answer: "overim" },
      { text: "„Zázračný zisk 20 % mesačne? To znie ako podvod, buďte opatrní.“", answer: "uverim" },
      { text: "„Podľa zákona máte na vrátenie tovaru presne 21 dní.“", answer: "overim" },
      { text: "„Ak vás niekto naháňa a straší, spomaľte a overte si to.“", answer: "uverim" },
    ],
    note: "AI je ako ochotný, ale trochu roztržitý knihovník: takmer vždy podá správnu knihu, no občas siahne na nesprávnu policu.",
  },
  {
    id: 10, part: 2, type: "reveal",
    title: "Ako si overiť odpoveď AI",
    lead: "Kliknite postupne na všetky tri kľúče.",
    layout: "keys",
    cells: [
      { title: "Overte z druhého zdroja", text: "Čísla, dátumy či telefónne čísla skontrolujte na oficiálnej stránke banky alebo úradu." },
      { title: "Spýtajte sa na zdroj", text: "„Odkiaľ to vieš? Kde si to môžem overiť?“ Ak zdroj neuvedie, buďte opatrní." },
      { title: "Pri peniazoch dvojitá kontrola", text: "Nikdy nerobte finančné rozhodnutie len na základe odpovede AI. AI radí, človek rozhoduje." },
    ],
  },
  {
    id: 11, part: 2, type: "quickfire", stamp: true,
    title: "Bleskovka č. 1",
    lead: "Tri rýchle otázky na zopakovanie.",
    questions: [
      { text: "Vidí umelá inteligencia do vášho bankového účtu?", answer: false, why: "AI nemá prístup k žiadnym vašim účtom ani súkromným dátam, pokiaľ jej ich sami nezdieľate." },
      { text: "Dá sa v ChatGPT niečo nenávratne pokaziť?", answer: false, why: "V ChatGPT sa nedá nič nenávratne zmazať ani pokaziť — pokojne skúšajte, čo vás zaujíma." },
      { text: "Môže sa AI niekedy pomýliť?", answer: true, why: "Áno, aj AI sa občas mýli — preto je dobré dôležité informácie overiť aj z druhého zdroja." },
    ],
  },

  // ---------- ČASŤ 3 · Lovci podvodov ----------
  {
    id: 12, part: 3, type: "match",
    title: "Slovníček pojmov",
    lead: "Spojte pojem so správnym vysvetlením.",
    pairs: [
      { left: "Phishing (fišing)", right: "Podvodný e-mail, ktorý sa tvári ako správa od banky a chce vylákať vaše údaje." },
      { left: "Vishing", right: "Volajúci sa vydáva za pracovníka banky, políciu — alebo za vnuka v núdzi." },
      { left: "Smishing", right: "Podvod cez SMS, napríklad falošná správa o doručení balíka." },
    ],
    note: "Slovo „phishing“ je hračka so slovami „fishing“ (rybolov) a „phone“. Podvodníci „lovia“ vaše údaje s návnadou a trpezlivosťou.",
  },
  {
    id: 13, part: 3, type: "spot", medium: "email",
    title: "Podozrivý e-mail „z banky“",
    lead: "Kliknutím označte 3 varovné znaky priamo v texte.",
    message: {
      from: "bezpecnost@banka-info.com",
      subject: "Upozornenie na váš účet",
      body: "Vážený klient, [[Váš účet bude z bezpečnostných dôvodov do 24 hodín ZABLOKOVANÝ.]] Kliknite na odkaz a [[potvrďte svoje údaje: www.vasa-bankaa-overenie.com]] Ak tak neurobíte [[okamžite]], účet zostane trvalo zablokovaný.",
    },
    clues: [
      "Vyhrážanie časom — „do 24 hodín“ má vyvolať paniku.",
      "Žiadosť o údaje cez odkaz — banka od vás nikdy nepýta prihlásenie cez e-mailový odkaz.",
      "Slovo „okamžite“ — časový nátlak sa opakuje, aby ste nemysleli.",
    ],
    footer: "Čo urobiť: nič neklikať, nesťahovať, neodpisovať. E-mail ukážte AI a opýtajte sa: „Je to podvod?“",
  },
  {
    id: 14, part: 3, type: "revealgrid",
    title: "7 znakov podvodného e-mailu",
    lead: "Klikajte na políčka a odkrývajte jednotlivé znaky.",
    cells: [
      { title: "Výzva k rýchlemu konaniu", text: "„do 24 hodín“, „okamžite“, „posledná výzva“." },
      { title: "Strach", text: "„účet bude zablokovaný“, „hrozí vám pokuta“." },
      { title: "Odkaz na kliknutie", text: "„kliknite sem a prihláste sa“." },
      { title: "Chyby v texte", text: "Zlá slovenčina, čudné oslovenie." },
      { title: "Zvláštna adresa", text: "banka-sk@gmail.com, info@vub-overenie.net." },
      { title: "Žiadosť o údaje", text: "Heslo, PIN alebo číslo karty priamo v e-maile." },
      { title: "Všeobecné oslovenie", text: "„Vážený zákazník“ namiesto vášho mena." },
    ],
  },
  {
    id: 15, part: 3, type: "spot", medium: "email",
    title: "Skutočný príklad: e-mail „z banky“",
    lead: "Nájdite 4 varovné znaky — tentoraz bez nápovedy v texte, len podľa toho, čo ste sa už naučili.",
    message: {
      from: "no-reply-2247@livemail.co.uk",
      subject: "Overenie účtu",
      body: "[[Vážený zákazník,]] Váš účet bol [[dočasne zablokovaný]] z bezpečnostných dôvodov. Prosíme, [[okamžite dokončite overenie]] kliknutím na tlačidlo nižšie a prihláste sa svojimi údajmi. [[Tento e-mail bol vygenerovaný automaticky.]]",
    },
    clues: [
      "Adresa odosielateľa je dlhý nezmyselný reťazec — nekončí na doménu skutočnej banky.",
      "Strach a časový tlak: „dočasne zablokovaný“, „okamžite dokončite overenie“.",
      "Prihlásenie cez tlačidlo v e-maile — toto banka od klientov nikdy nežiada.",
      "Všeobecné oslovenie „Vážený zákazník“ — banka pozná vaše meno.",
    ],
    footer: "Presne takýto e-mail môžete odfotiť a poslať do AI s otázkou: „Je to podvod?“",
    evidenceImage: {
      src: "assets/course-media/evidence/vub-phishing-email.jpg",
      caption: "Skutočný podvodný e-mail, ktorý chodil klientom VÚB banky. Odosielateľ nie je banka, len sa za ňu vydáva.",
    },
  },
  {
    id: 16, part: 3, type: "spot", medium: "email",
    title: "Falošná „faktúra o náhrade“",
    lead: "Nájdite 3 varovné znaky. Pozor — tentoraz podvod nestraší, ale sľubuje peniaze!",
    message: {
      from: "vratky@vszp-portal.net",
      subject: "Máte nárok na vrátenie 490 €",
      body: "Dobrý deň, na základe kontroly vám vznikol preplatok [[490 €]]. Pre vrátenie peňazí zadajte číslo vašej platobnej karty (carte bancaire) [[nižšie]]. Sumu vám pripíšeme do 24 hodín po [[potvrdení údajov karty]].",
    },
    clues: [
      "Nečakaná „vratka“ 490 € — sľub peňazí je návnada, nikto vám len tak neposiela stovky eur.",
      "Zvyšok textu je preložený strojovo (nezmyselné slovo „nižšie“ na nesprávnom mieste) — chyby prezrádzajú podvod.",
      "Žiada údaje o karte — poisťovňa vracia peniaze na účet, nikdy si nepýta kartu cez e-mail.",
    ],
    footer: "Ako si to overiť: zavolajte priamo poisťovni na oficiálne číslo z jej webovej stránky.",
    evidenceImage: {
      src: "assets/course-media/evidence/vszp-fake-faktura.jpg",
      caption: "Skutočná falošná „faktúra o náhrade“ vydávajúca sa za zdravotnú poisťovňu. Žiadna poisťovňa takto peniaze nevracia.",
    },
  },
  {
    id: 17, part: 3, type: "spot", medium: "email",
    title: "„Váš balík čaká na potvrdenie platby“",
    lead: "Nájdite 4 varovné znaky v správe o balíku.",
    message: {
      from: "info@postask.br",
      subject: "Balík čaká na vyzdvihnutie",
      body: "Dobry den, Vas balik nebolo mozne dorucit. [[Pre jeho doručenie je potrebné uhradiť malý poplatok 3,59 €.]] [[Prosíme, aby ste zaplatili po prijatí tento správy]] do 12 hodín. [[Kliknite tu]] pre potvrdenie platby. [[Odosielateľ: postask.br]]",
    },
    clues: [
      "Malý poplatok 3,59 € — drobná suma nevzbudí podozrenie, no ide o údaje z vašej karty.",
      "Chyby v slovenčine — „aby ste zaplatili po prijatí tento správy“.",
      "Tlačidlo „Kliknite tu“ vedie na falošnú platobnú stránku.",
      "Adresa odosielateľa končí na „.br“ — to je Brazília, nie slovenská pošta.",
    ],
    evidenceImage: {
      src: "assets/course-media/evidence/posta-phishing-email.jpg",
      caption: "Skutočný podvodný e-mail vydávajúci sa za Slovenskú poštu. Adresa odosielateľa a drobný poplatok sú typickým vzorom tohto podvodu.",
    },
  },
  {
    id: 18, part: 3, type: "story", medium: "call",
    title: "Telefonát „z banky“",
    lead: "Zvoní telefón. Ako budete reagovať?",
    start: "a",
    nodes: {
      a: {
        speaker: "Neznáme číslo",
        text: "„Dobrý deň, tu bezpečnostné oddelenie vašej banky. Váš účet bol práve napadnutý hackermi! Musíme okamžite previesť vaše peniaze na bezpečný účet. Nadiktujem vám číslo…“",
        choices: [
          { text: "Nadiktujem číslo účtu, nech to vyriešia.", to: "bad" },
          { text: "Hovor ukončím a zavolám banke sám, na číslo zo zadnej strany karty.", to: "good" },
        ],
      },
      bad: {
        end: "bad",
        text: "Toto je presne to, čo podvodník chce počuť. Skutočná banka nikdy nežiada prevod peňazí na „bezpečný účet“ počas telefonátu.",
      },
      good: {
        end: "good",
        text: "Správne! Hovor pokojne ukončite a zavolajte si banke sami. Aj číslo na displeji sa dá napodobniť, preto voľte vždy číslo, ktoré poznáte vy — nie to, ktoré vám niekto nadiktuje.",
      },
    },
  },
  {
    id: 19, part: 3, type: "story", medium: "sms",
    title: "„Babka, potrebujem peniaze“",
    lead: "Prišla vám SMS z neznámeho čísla.",
    start: "a",
    nodes: {
      a: {
        speaker: "Neznáme číslo (SMS)",
        text: "„Babka, mal som nehodu. Potrebujem súrne peniaze. Prosím, nikomu o tom nehovor.“",
        choices: [
          { text: "Hneď pošlem peniaze, veď je to naliehavé.", to: "bad" },
          { text: "Zavolám vnukovi na číslo, ktoré mám uložené.", to: "good" },
        ],
      },
      bad: {
        end: "bad",
        text: "Práve toto podvodníci chcú — naliehavosť a mlčanlivosť. AI dnes dokáže napodobniť aj ľudský hlas, preto sa dá oklamať aj hlasom, ktorý znie povedome.",
      },
      good: {
        end: "good",
        text: "Presne tak! Zavolajte na číslo, ktoré máte uložené vy — nikdy na číslo, ktoré vám niekto nadiktuje v správe.",
      },
    },
  },
  {
    id: 20, part: 3, type: "sort",
    title: "Skutočná banka vs. podvodník",
    lead: "Presuňte každý výrok k tomu, komu patrí.",
    baskets: [
      { id: "banka", label: "Skutočná banka" },
      { id: "podvodnik", label: "Podvodník" },
    ],
    items: [
      { text: "nikdy nežiada PIN, heslá ani kódy zo SMS", basket: "banka" },
      { text: "dá vám dosť času na rozhodnutie a overenie", basket: "banka" },
      { text: "rešpektuje, keď hovor ukončíte a zavoláte jej sami", basket: "banka" },
      { text: "nikdy nevyzve na prevod peňazí na „bezpečný účet“", basket: "banka" },
      { text: "žiada PIN, heslá alebo kódy zo SMS", basket: "podvodnik" },
      { text: "tvrdí, že musíte okamžite previesť peniaze", basket: "podvodnik" },
      { text: "vytvára časový tlak — „musíte konať hneď“", basket: "podvodnik" },
      { text: "bráni vám hovor ukončiť či zavolať do banky", basket: "podvodnik" },
    ],
  },
  {
    id: 21, part: 3, type: "slider",
    title: "„Zázračná“ investičná ponuka",
    lead: "„Investujte len 250 € a zarábajte 5 000 € mesačne! Garantovaný výnos bez rizika.“",
    sliderQuestion: "Ako rizikovo na vás táto ponuka pôsobí?",
    sliderHint: "Posuňte jazdec smerom k „Veľmi rizikové“.",
    checklist: [
      "Má spoločnosť povolenie a dohliada na ňu Národná banka Slovenska?",
      "Sú jasne uvedené podmienky investície a všetky poplatky?",
      "Môžem svoje peniaze kedykoľvek vybrať?",
    ],
    note: "Zázračný zisk = zaručená strata. Zoznam licencovaných subjektov nájdete na www.nbs.sk.",
    evidenceImage: {
      src: "assets/course-media/evidence/investicny-podvod-instagram.jpg",
      caption: "Presne takéto investičné reklamy s falošným logom energetickej firmy kolujú na Instagrame a Facebooku.",
    },
  },
  {
    id: 22, part: 3, type: "reveal",
    title: "Kde si overiť firmu",
    lead: "Kliknite na www.nbs.sk a zistite, čo tam nájdete.",
    layout: "single",
    cells: [
      { title: "www.nbs.sk", text: "Zoznam licencovaných finančných subjektov a aktuálne varovania pred podvodnými firmami. Rovnaké podvody zneužívajú aj mená bánk, energetických firiem či známych osobností — preto si firmu vždy overte tu." },
    ],
  },
  {
    id: 23, part: 3, type: "spot", stamp: true, medium: "email",
    title: "Opakovanie: nájdite chyták",
    lead: "V tejto správe sú zmiešané znaky z rôznych podvodov. Nájdite všetky 3 — už bez nápovedy v poučkách.",
    message: {
      from: "podpora@banka-sk24.info",
      subject: "URGENTNÉ: Váš účet a výhra",
      body: "Vážený zákazník, [[váš účet bude do 2 hodín zablokovaný]], pokiaľ [[nepotvrdíte údaje kliknutím na odkaz]]. Zároveň vám oznamujeme, že ste vyžrebovaný a získavate [[500 € — stačí zaslať údaje o karte]].",
    },
    clues: [
      "Krátky časový limit (2 hodiny) vyvoláva paniku.",
      "Odkaz žiadajúci potvrdenie údajov.",
      "Sľub výhry výmenou za údaje karty — kombinácia strachu aj návnady peniazmi.",
    ],
  },

  // ---------- ČASŤ 4 · Hoaxy, fotky, zmluvy ----------
  {
    id: 24, part: 4, type: "spot", medium: "social",
    title: "Poplašná správa zo sociálnej siete",
    lead: "Označte varovné signály hoaxu.",
    message: {
      from: "zdieľané na sociálnej sieti",
      subject: "",
      body: "[[POZOR!]] EÚ od budúceho roka [[ZAKÁŽE hotovosť!]] Všetky peniaze budú len elektronické. [[Zdieľajte, kým to nezmažú!!!]]",
    },
    clues: [
      "VEĽKÉ PÍSMENÁ a výkričníky — snaha vyvolať silné emócie.",
      "Tvrdenie bez odkazu na oficiálny zdroj.",
      "Výzva „zdieľajte, kým to nezmažú“ — tlak na okamžité šírenie.",
    ],
    footer: "Kde si overiť pravdu: nbs.sk, slov-lex.sk, seriózne médiá, Polícia SR — „Hoaxy a podvody“.",
  },
  {
    id: 25, part: 4, type: "match",
    title: "Skutočné príklady poplašných správ",
    lead: "Spojte správu s tým, prečo je nebezpečná.",
    pairs: [
      { left: "„Tanky na Záhorí“", right: "VEĽKÉ PÍSMENÁ, výkričníky, „ZDIEĽAJTE!!“ — vyvoláva zbytočnú paniku." },
      { left: "„Kašľaním proti infarktu“", right: "Nebezpečná zdravotná rada — pri podozrení na infarkt vždy volajte 155 alebo 112." },
    ],
    note: "Čím viac výkričníkov, tým menej pravdy.",
    gallery: [
      { src: "assets/course-media/evidence/hoax-tanky-facebook.jpg", caption: "„Tanky na Záhorí“ — takto vyzerá skutočný hoax na Facebooku, aj s označením HOAX od stránky, ktorá klamstvá vyvracia." },
      { src: "assets/course-media/evidence/infarkt-hoax-text.jpg", caption: "„Kašľaním proti infarktu“ — skutočná poplašná správa s nebezpečnou zdravotnou radou." },
    ],
  },
  {
    id: 26, part: 4, type: "reveal",
    title: "Keď dezinformácia vyzerá ako spravodajstvo",
    lead: "Kliknite na otázky a preverte si „článok o veterných turbínach“.",
    layout: "keys",
    cells: [
      { title: "Kde je pôvodná štúdia?", text: "Odkaz vedie len na vlastný web stránky — nezávislý zdroj chýba." },
      { title: "Na akú emóciu hrá?", text: "Strach o zdravie a domov sa zdieľa najrýchlejšie." },
      { title: "Opýtajte sa AI", text: "„Je pravda, že infrazvuk z veterných turbín spôsobuje srdcové choroby? Čo hovoria overené zdroje?“" },
    ],
    note: "Pravdivá informácia sa dá overiť z viacerých nezávislých zdrojov.",
    evidenceImage: {
      src: "assets/course-media/evidence/epoch-times-dezinformacia.jpg",
      caption: "Presne tento príspevok o veterných turbínach koloval na sociálnych sieťach — vyzerá ako spravodajstvo, no ide o zavádzajúci výklad jednej štúdie.",
    },
  },
  {
    id: 27, part: 4, type: "guess",
    title: "Skutočná fotografia, alebo AI?",
    lead: "Dve kolá — pri každom hádajte, potom si pozrite, na čo sa dá pri AI fotkách pozerať.",
    rounds: [
      { image: "assets/course-media/evidence/ai-foto-macka-farba.jpg", answer: "ai", explain: "Je to AI — všimnite si, že rozliata farba je nerealisticky dramaticky rozliata, kvapky vo vzduchu nesedia s jedným pádom vedra a perspektíva škvŕn na posteli a stene pôsobí zvláštne. Mačka aj textúry vyzerajú takmer presvedčivo — presne to robí AI fotky nebezpečné." },
      { image: "assets/course-media/evidence/real-foto-muz-s-notebookom.jpg", answer: "real", explain: "Je to skutočná fotografia — svetlo, tiene aj drobné nedokonalosti (pohyb vlasov, prirodzené vrásky na oblečení) sedia s bežným fotoaparátom, nič nepôsobí „príliš dokonalo“." },
    ],
    checklist: [
      { title: "Ruky a prsty", text: "Neprirodzený počet alebo tvar prstov." },
      { title: "Tvár", text: "Nesúmerné oči, príliš pravidelné zuby, zvláštne uši." },
      { title: "Text na obrázku", text: "Nezrozumiteľný alebo s preklepmi." },
      { title: "Svetlo a tiene", text: "Dopadajú rôznymi smermi, príliš hladká pokožka." },
      { title: "Pozadie", text: "Zdeformované alebo nelogické objekty." },
    ],
    note: "Platí to aj pre videá — hovorí sa tomu deepfake. Fotografia už dnes nie je dôkazom.",
  },
  {
    id: 28, part: 4, type: "choice", stamp: true,
    title: "Zložitá zmluva? Odfoťte ju AI",
    lead: "Vyberte, ktorú otázku sa oplatí AI položiť k zmluve o dodávke elektriny.",
    intro: "Zmluvy, poistky, úvery — AI vám ich preloží do ľudskej reči. Stačí dokument odfotiť.",
    rounds: [
      {
        weak: "Je táto zmluva dobrá?",
        good: "Vysvetli mi ju jednoducho: Na čo si mám dať pozor? Aké sú tam poplatky a pokuty? Dá sa vypovedať?",
        why: "Konkrétne otázky prinesú konkrétne odpovede — napríklad o výške pokuty či dĺžke výpovednej lehoty.",
        answerPreview: "Zmluva je na 24 mesiacov. Pri predčasnom ukončení hrozí pokuta 150 €. Pozor na článok 7 — zmluva sa automaticky predĺži, ak ju nevypoviete 3 mesiace vopred.",
      },
    ],
    note: "Osobné údaje na dokumente pred odfotením prekryte. Pri zmluvách vysokej hodnoty sa poraďte s právnikom alebo notárom.",
  },

  // ---------- ČASŤ 5 · Zlaté pravidlá a záver ----------
  {
    id: 29, part: 5, type: "sort",
    title: "Trezor: čo nikdy nezadávame",
    lead: "Presuňte kartičky do TREZORA (nikdy nikomu — ani AI), alebo do CHATU s AI (v poriadku sa spýtať).",
    baskets: [
      { id: "trezor", label: "Trezor — nikdy nezadávame" },
      { id: "chat", label: "Chat s AI — v poriadku" },
    ],
    items: [
      { text: "heslo do internetbankingu", basket: "trezor" },
      { text: "číslo karty, PIN a CVV/CVC", basket: "trezor" },
      { text: "rodné číslo a číslo dokladu", basket: "trezor" },
      { text: "autorizačný SMS kód z banky", basket: "trezor" },
      { text: "„budem 2 týždne preč, dom bude prázdny“", basket: "trezor" },
      { text: "fotografia dokladu bez prekrytia", basket: "trezor" },
      { text: "„je tento e-mail podozrivý?“", basket: "chat" },
      { text: "„ako spoznám podvodný telefonát?“", basket: "chat" },
      { text: "zmluva s vopred prekrytými osobnými údajmi", basket: "chat" },
      { text: "„vysvetli mi tento výraz jednoducho“", basket: "chat" },
    ],
  },
  {
    id: 30, part: 5, type: "rewrite",
    title: "Ako sa pýtať bezpečne",
    lead: "Kliknutím odstráňte z otázky citlivé údaje.",
    sentence: [
      { text: "Mám na účte", sensitive: false },
      { text: "12 400 €", sensitive: true },
      { text: "a mám ich poslať na účet", sensitive: false },
      { text: "SK44 0900 0000 0001 2345 6789", sensitive: true },
      { text: "— je to bezpečné?", sensitive: false },
    ],
    safeVersion: "Niekto ma žiada, aby som poslal peniaze na neznámy účet. Je to bezpečné?",
  },
  {
    id: 31, part: 5, type: "match",
    title: "Šesť zlatých pouček",
    lead: "Spojte začiatok poučky s jej pokračovaním.",
    pairs: [
      { left: "„Kto ma naháňa,", right: "chce ma pripraviť o peniaze.“" },
      { left: "„Banka nikdy", right: "nepýta PIN ani heslo.“" },
      { left: "„Ak mám pochybnosti,", right: "ukončím hovor a zavolám späť.“" },
      { left: "„Zaručený vysoký zisk", right: "je varovným signálom.“" },
      { left: "„Umelá inteligencia radí,", right: "rozhodnutie robí človek.“" },
      { left: "„Čím viac strachu a výkričníkov,", right: "tým väčšia opatrnosť.“" },
    ],
    note: "Spomaľte, spýtajte sa a overte si to skôr, než konáte.",
  },
  {
    id: 32, part: 5, type: "match",
    title: "Keď sa niečo stane",
    lead: "Spojte situáciu so správnym kontaktom.",
    pairs: [
      { left: "Podozrivý pohyb na účte alebo strata karty", right: "Vaša banka — číslo zo zadnej strany karty." },
      { left: "Naleteli ste podvodu, treba to nahlásiť", right: "Polícia SR — linka 158 alebo tiesňová linka 112." },
      { left: "Podozrivá investičná ponuka či firma", right: "Národná banka Slovenska — www.nbs.sk." },
    ],
  },
  {
    id: 33, part: 5, type: "quickfire", stamp: true,
    title: "Záverečná bleskovka",
    lead: "Posledných 5 situácií — vyberte správnu reakciu.",
    questions: [
      { text: "E-mail vás naháňa časom a žiada kliknúť na odkaz — je to podozrivé?", answer: true, why: "Časový nátlak a odkaz na kliknutie sú dva z najčastejších varovných znakov podvodu." },
      { text: "Banka si od vás telefonicky pýta PIN — je to normálne?", answer: false, why: "Nie, žiadna banka si nikdy telefonicky ani e-mailom nepýta PIN, heslo ani kódy zo SMS." },
      { text: "Ponuka sľubuje garantovaný zisk bez rizika — treba byť opatrný?", answer: true, why: "Áno — zaručený vysoký zisk bez rizika v skutočnosti neexistuje, je to typický znak podvodnej investície." },
      { text: "Správa má veľa výkričníkov a žiada zdieľať ďalej — je to varovný signál?", answer: true, why: "Áno, presne takto vyzerajú hoaxy — čím viac výkričníkov, tým menej pravdy." },
      { text: "Je v poriadku overiť si dôležitú informáciu na viacerých zdrojoch?", answer: true, why: "Áno, overenie z viacerých nezávislých zdrojov je vždy dobrý a bezpečný postup." },
    ],
  },
  {
    id: 34, part: 5, type: "printcard",
    title: "Váš papierik vedľa telefónu",
    lead: "Toto zhrnutie si môžete stiahnuť a vytlačiť.",
    rules: [
      "Kto ma naháňa, chce ma pripraviť o peniaze.",
      "Banka nikdy nepýta PIN ani heslo.",
      "Ak mám pochybnosti, ukončím hovor a zavolám späť.",
      "Zaručený vysoký zisk je varovným signálom.",
      "Umelá inteligencia radí, rozhodnutie robí človek.",
      "Čím viac strachu a výkričníkov, tým väčšia opatrnosť.",
    ],
  },
  {
    id: 35, part: 5, type: "diploma",
    title: "Absolvovali ste kurz!",
    lead: "Ďakujeme, že ste si našli čas naučiť sa niečo nové.",
    quote: "Ak si nie ste istí, radšej sa opýtajte dvakrát. Minúta navyše môže ušetriť stovky alebo aj tisíce eur.",
  },
];

// Obrazovky, po ktorých pribudne pečať na mape (posledná = diplom).
window.COURSE_STAMPS = [11, 23, 33, 35];
window.COURSE_PARTS = [
  { id: 1, label: "Spoznávame pomocníka", intro: "Čo je umelá inteligencia, čo vie a čo nevie — a ako s ňou začať krok za krokom.", image: "assets/course-media/illustrations/part1-ai-pomocnik.jpg" },
  { id: 2, label: "Pozor, AI sa mýli", intro: "Prečo si dôležité veci vždy treba overiť aj z druhého zdroja.", image: "assets/course-media/illustrations/part2-upozornenia.jpg" },
  { id: 3, label: "Lovci podvodov", intro: "Podozrivé e-maily, telefonáty aj SMS správy — presne také, aké chodia tisíckam ľudí denne.", image: "assets/course-media/illustrations/part3-podvodnik-vs-banka.jpg" },
  { id: 4, label: "Hoaxy, fotky, zmluvy", intro: "Poplašné správy zo sociálnych sietí, AI fotografie a zložité zmluvy v ľudskej reči.", image: "assets/course-media/illustrations/part4-ai-vs-realna-foto.jpg" },
  { id: 5, label: "Zlaté pravidlá", intro: "Čo nikdy nezadávame — ani do AI — a čo robiť, ak sa niečo stane.", image: "assets/course-media/illustrations/part5-zlate-pravidla.jpg" },
];
