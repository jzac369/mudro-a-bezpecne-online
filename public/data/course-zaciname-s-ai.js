// Lekcie kurzu „Začíname s umelou inteligenciou“.
//
// Obsah vychádza z brožúrky DigiStart „Vaša cesta do sveta umelej
// inteligencie“ (verzia 3.0 / 2026) a z metodiky Digitálni seniori.
//
// Číslovanie obrazoviek začína na 101 zámerne — obrazovky prvého kurzu
// majú čísla 1 až 40 a úpravy textov z admin zóny sa ukladajú podľa čísla
// obrazovky. Rôzne čísla znamenajú, že si kurzy navzájom neprepíšu texty.
(function () {
  "use strict";

  var SLIDES = [

  // ---------- ČASŤ 1: Spoznávame umelú inteligenciu ----------
  {
    id: 101, part: 1, type: "intro",
    title: "Začíname s umelou inteligenciou",
    lead: "Pokojné a zrozumiteľné zoznámenie s pomocníkom, ktorý vám ušetrí čas aj starosti.",
    image: "assets/course-media/illustrations/cover-elderly-couple.jpg",
    body: "Čaká vás 38 krátkych zastavení rozdelených do 5 častí. Pri každom si niečo vyskúšate a hneď sa dozviete, ako ste sa trafili — aj prečo. Nič sa nedá pokaziť a kedykoľvek sa môžete vrátiť tam, kde ste skončili.",
    task: "Prezrite si päť častí kurzu nižšie a potom kliknite na tlačidlo <strong>„Ďalej“</strong> v pravom dolnom rohu.",
  },
  {
    id: 102, part: 1, type: "tiles",
    title: "Čo nás čaká",
    lead: "Päť tém, ktoré spolu prejdeme — od prvého zoznámenia až po bezpečné používanie každý deň.",
    task: "Kliknite postupne na <strong>aspoň tri dlaždice</strong>. Každá sa otvorí a ukáže, čo vás v danej časti čaká.",
    tiles: [
      { title: "Spoznávame pomocníka", text: "Čo umelá inteligencia je, čo dokáže a čo nie — bez zbytočných cudzích slov." },
      { title: "Prvé kroky s ChatGPT", text: "Kde ho nájdete, ako vyzerá a ako mu položíte úplne prvú otázku." },
      { title: "Umenie pýtať sa", text: "Malá zmena v otázke — a odpoveď je zrazu oveľa užitočnejšia." },
      { title: "AI v bežnom živote", text: "Listy na úrad, recepty, záhrada, lieky, preklady aj práca s hlasom a fotkou." },
      { title: "Bezpečne a s rozumom", text: "Čo AI nikdy nehovoríme, ako si overiť odpoveď a ako spoznať podvod." },
    ],
    minOpened: 3,
  },
  {
    id: 103, part: 1, type: "flip",
    title: "Čo je vlastne umelá inteligencia?",
    lead: "Predstavte si veľmi sčítaného pomocníka, ktorý ochotne poradí — no volant držíte vy.",
    task: "Kliknite postupne na <strong>všetky štyri karty</strong>. Každá sa otočí a ukáže vysvetlenie na druhej strane.",
    cards: [
      { front: "Prečítala takmer všetko", back: "Umelá inteligencia sa učila z obrovského množstva kníh, novín a webových stránok. Preto vie vysvetliť takmer čokoľvek — a vysvetlí to toľkokrát, koľkokrát budete chcieť." },
      { front: "Nie je to robot s vlastnou vôľou", back: "AI nemá city, názory ani vlastné plány. Nič neurobí sama od seba — čaká, kým ju o niečo požiadate. Presne ako ceruzka, ktorá sama nič nenakreslí." },
      { front: "Rozprávate sa s ňou po slovensky", back: "Nepotrebujete žiadne technické znalosti ani cudzí jazyk. Píšete jej celými vetami, presne tak, ako by ste sa pýtali známeho." },
      { front: "Vedeli ste?", back: "Prvý program, ktorý viedol rozhovor podobný ľudskému, sa volal ELIZA a vznikol už v roku 1966. Umelá inteligencia teda nie je až taká nová vec — len sa jej v posledných rokoch mimoriadne darí." },
    ],
  },
  {
    id: 104, part: 1, type: "sort",
    title: "Čo AI vie a čo nevie",
    lead: "Aby vám umelá inteligencia naozaj pomohla, oplatí sa vedieť, čo od nej môžete čakať — a čo už nie.",
    task: "Máte 10 kartičiek. Kliknite na kartičku a potom na políčko <strong>„AI to zvládne“</strong> alebo <strong>„Toto nechajte na človeka“</strong>. Pri každej vám hneď povieme, ako ste sa trafili.",
    baskets: [
      { id: "vie", label: "AI to zvládne", desc: "Vysvetliť, napísať, zhrnúť, poradiť.", tone: "safe" },
      { id: "nevie", label: "Toto nechajte na človeka", desc: "Rozhodnúť, ručiť za pravdu, zastúpiť odborníka.", tone: "danger" },
    ],
    sideNote: {
      title: "Zapamätajte si",
      items: [
        { tone: "good", text: "AI je výborná na vysvetľovanie, písanie a zhŕňanie." },
        { tone: "warn", text: "AI nikdy nepreberá zodpovednosť za vaše rozhodnutie." },
        { tone: "info", text: "Pri zdraví a peniazoch je AI prvý názor — nie posledné slovo." },
      ],
    },
    items: [
      { text: "vysvetliť cudzie slovo jednoducho", basket: "vie", why: "Toto je jedna z najsilnejších stránok AI. Pokojne ju požiadajte: „Vysvetli mi to ako sedemdesiatročnému človeku.“" },
      { text: "napísať list na úrad alebo reklamáciu", basket: "vie", why: "Stačí opísať, o čo ide a komu píšete. AI zvolí slušný tón a nič dôležité nevynechá." },
      { text: "navrhnúť recept z toho, čo máte doma", basket: "vie", why: "Vymenujte suroviny, koľko máte času a pre koľko ľudí varíte — a máte recept na mieru." },
      { text: "zhrnúť dlhý článok do niekoľkých bodov", basket: "vie", why: "Z desiatich strán vám AI spraví pár viet s tým najdôležitejším." },
      { text: "trpezlivo odpovedať aj po piaty raz", basket: "vie", why: "AI sa nikdy neurazí ani neunaví. Pýtať sa znova a inými slovami je úplne bežné." },
      { text: "ručiť za to, že údaj je pravdivý", basket: "nevie", why: "AI sa občas pomýli a znie pritom presvedčivo. Dátumy, čísla a paragrafy si preto overte." },
      { text: "rozhodnúť za vás, čo podpísať", basket: "nevie", why: "AI vie vysvetliť, na čo si dať pozor. Rozhodnutie však ostáva vaše — a pri väčších veciach sa oplatí poradiť s odborníkom." },
      { text: "nahradiť lekára pri diagnóze", basket: "nevie", why: "AI vie vysvetliť lekársku správu alebo pripraviť otázky pre lekára. Diagnózu ani liečbu však neurčuje." },
      { text: "vidieť do vášho bankového účtu", basket: "nevie", why: "AI nemá prístup k vašim účtom, e-mailom ani dokumentom. Vie len to, čo jej sami napíšete." },
      { text: "s istotou určiť, či je huba jedlá", basket: "nevie", why: "Pri hubách sa AI mýli a chyba môže byť nebezpečná. Berte to nanajvýš ako orientáciu a overte si to v atlase alebo u znalca." },
    ],
  },
  {
    id: 105, part: 1, type: "revealgrid",
    title: "AI používate už dnes — možno o tom ani neviete",
    lead: "Nie je to vzdialená budúcnosť. Umelá inteligencia vám pomáha už roky, len o sebe nedáva vedieť.",
    task: "Kliknite postupne na <strong>všetkých 8 políčok</strong> a pozrite sa, kde všade pracuje.",
    cells: [
      { title: "Váš telefón", text: "Opravuje preklepy, rozpoznáva tvár pri odomknutí a rozumie hlasu." },
      { title: "Predpoveď počasia", text: "Spracuje milióny meraní a odhadne, či zajtra pršať bude." },
      { title: "E-mailová schránka", text: "Triedi nevyžiadanú poštu a väčšinu podvodných správ zachytí skôr, než ich uvidíte." },
      { title: "Banka", text: "Sleduje neobvyklé platby a vie kartu zablokovať skôr, než škoda narastie." },
      { title: "Navigácia v aute", text: "Prepočítava trasu podľa zápch a ukazuje, kedy naozaj dorazíte." },
      { title: "Nemocnica", text: "Pomáha lekárom všimnúť si na snímke aj drobnosti, ktoré by unikli oku." },
      { title: "YouTube a televízia", text: "Odporúča, čo by sa vám mohlo páčiť, podľa toho, čo ste si už pozreli." },
      { title: "Fotky v mobile", text: "Nájde v albume „psa“ alebo „more“, hoci ste nič nepopisovali." },
    ],
    note: "Umelá inteligencia teda nie je nič nové ani nebezpečné. Nová je len možnosť rozprávať sa s ňou priamo.",
  },
  {
    id: 106, part: 1, type: "match",
    title: "Mýty a skutočnosť",
    lead: "O umelej inteligencii koluje veľa nepresností. Poďme si tie najčastejšie uviesť na pravú mieru.",
    task: "Kliknite na mýtus <strong>vľavo</strong> a potom na vysvetlenie <strong>vpravo</strong>, ktoré k nemu patrí. Ak sa trafíte, spojí ich čiara.",
    pairs: [
      { left: "„AI vie všetko a nikdy sa nemýli.“", right: "Občas si vymyslí, preto dôležité veci overujeme.", why: "AI nerada hovorí „neviem“. Keď odpoveď nepozná, môže si ju domyslieť — a znie pritom presvedčivo." },
      { left: "„AI je len pre mladých a programátorov.“", right: "Rozprávate sa s ňou bežnou slovenčinou.", why: "Netreba žiadne technické znalosti. Kto vie napísať SMS, vie používať aj AI." },
      { left: "„AI nás chce nahradiť.“", right: "Je to pomocník, ktorý čaká na vaše zadanie.", why: "AI nemá vlastnú vôľu ani plány. Robí len to, o čo ju požiadate — a výsledok posudzujete vy." },
      { left: "„Keď niečo zle kliknem, pokazím to.“", right: "Pokaziť sa nedá nič, pokojne skúšajte.", why: "V ChatGPT neexistuje tlačidlo, ktorým by ste niečo zničili. Nepodarený rozhovor jednoducho zavriete a začnete nový." },
    ],
    note: "Najväčšou prekážkou nebýva technika, ale obava, že niečo pokazíme. Tú si môžeme pokojne odložiť.",
  },
  {
    id: 107, part: 1, type: "belief",
    title: "Čo je bezpečné a čo si radšej overiť",
    lead: "AI je ochotný pomocník. Pri niektorých odpovediach jej pokojne veríte, pri iných sa oplatí pozrieť ešte inam.",
    task: "Prečítajte si <strong>štyri odpovede od AI</strong>. Pri každej kliknite, či jej pokojne <strong>uveríte</strong>, alebo si ju radšej <strong>overíte</strong>.",
    tip: "Pomôcka: konkrétne čísla, dátumy a paragrafy si overujeme. Vysvetlenia a všeobecné rady sú bezpečné.",
    items: [
      { text: "„Cesnak sa do rajčinovej omáčky pridáva až na záver, aby nezhorkol.“", answer: "uverim" },
      { text: "„Váš liek sa užíva trikrát denne po 500 mg.“", answer: "overim" },
      { text: "„Vysvetlím vám, čo znamená slovo hypertenzia.“", answer: "uverim" },
      { text: "„Zákon platný od 1. januára 2026 hovorí, že máte nárok na 21 dní.“", answer: "overim" },
    ],
    note: "AI je ako ochotný, ale trochu roztržitý knihovník: takmer vždy podá správnu knihu, no občas siahne na nesprávnu policu.",
  },
  {
    id: 108, part: 1, type: "quickfire", stamp: true,
    title: "Bleskovka č. 1",
    lead: "Zopakujme si, čo už o umelej inteligencii viete. Ide to ľahšie, než čakáte.",
    task: "Tri rýchle otázky. Pri každej kliknite <strong>Áno</strong> alebo <strong>Nie</strong> — hneď sa dozviete, ako ste odpovedali, aj prečo.",
    tips: [
      "AI je nástroj — pracuje až vtedy, keď ju o niečo požiadate.",
      "Rozpráva sa s vami bežnou slovenčinou, technické znalosti netreba.",
      "Dôležité čísla a dátumy si vždy overte aj inde.",
    ],
    questions: [
      { short: "Potrebujete na AI technické znalosti?", text: "Potrebujete na používanie AI technické znalosti alebo angličtinu?", answer: false, why: "Nie. Píšete jej po slovensky, celými vetami, tak ako by ste sa pýtali známeho. Nič iné netreba." },
      { short: "Môže si AI niečo vymyslieť?", text: "Môže si umelá inteligencia niečo vymyslieť a tváriť sa, že je to pravda?", answer: true, why: "Áno, hovorí sa tomu halucinácia. Nie je to zlý úmysel — AI len nerada priznáva, že niečo nevie. Preto dôležité veci overujeme." },
      { short: "Rozhodne AI za vás?", text: "Môže umelá inteligencia rozhodnúť za vás?", answer: false, why: "Nie. AI poradí a vysvetlí, ale rozhodnutie aj zodpovednosť ostávajú na vás. A tak je to správne." },
    ],
  },

  // ---------- ČASŤ 2: Prvé kroky s ChatGPT ----------
  {
    id: 109, part: 2, type: "revealgrid",
    title: "Ktorého pomocníka si vybrať",
    lead: "Pomocníkov je viac a všetci traja najznámejší sú zadarmo a rozumejú po slovensky. V tomto kurze zostaneme pri ChatGPT — je najrozšírenejší a v slovenčine sa mu darí výborne.",
    task: "Kliknite na <strong>všetky tri políčka</strong> a pozrite si, čím je každý pomocník výnimočný.",
    cells: [
      { title: "ChatGPT — od firmy OpenAI", text: "Najznámejší z trojice. Výborný na písanie listov, vysvetľovanie a tvorivé veci. Práve s ním budeme pracovať." },
      { title: "Copilot — od Microsoftu", text: "Býva zabudovaný priamo vo Windows a v prehliadači Edge. Hodí sa, keď potrebujete čerstvé informácie z internetu." },
      { title: "Gemini — od Googlu", text: "Dobre spolupracuje s Google službami, napríklad s Mapami alebo Gmailom. Šikovný pri plánovaní ciest." },
    ],
    note: "Nemusíte si vyberať navždy. Vyskúšať sa dajú všetci traja a nič vás to nestojí.",
  },
  {
    id: 110, part: 2, type: "install",
    title: "Ako si ChatGPT bezpečne zaobstarať",
    lead: "Falošných napodobenín ChatGPT je v obchodoch s aplikáciami mnoho. Líšia sa drobnosťou v názve, majú podobné logo a pýtajú predplatné. Ukážeme si, ako spoznáte tú pravú.",
    task: "Prezrite si kartu pravej aplikácie a tri kontroly pod ňou. Ak si chcete ChatGPT otvoriť hneď, použite tlačidlo pri svojom zariadení — otvorí sa v novom okne a o kurz neprídete.",
    appCard: {
      icon: "assets/course-media/evidence/chatgpt-app-icon.png",
      name: "ChatGPT",
      publisherLabel: "Vydavateľ",
      publisher: "OpenAI",
      publisherNote: "Na iPhone býva uvedené „OpenAI OpCo, LLC“ — je to tá istá firma.",
      priceLabel: "Cena",
      price: "Inštalácia zadarmo",
      caption: "Takto vyzerá logo pravej aplikácie. Toto je jediné oficiálne ChatGPT.",
    },
    waysTitle: "Kde ho nájdete — podľa toho, čo používate",
    ways: [
      {
        device: "Na počítači",
        text: "Nemusíte sťahovať vôbec nič. Stačí v prehliadači napísať adresu chatgpt.com a rovno začnete.",
        action: "Otvoriť chatgpt.com",
        url: "https://chatgpt.com",
        host: "chatgpt.com",
        recommended: true,
      },
      {
        device: "Na telefóne alebo tablete s Androidom",
        text: "Otvorte obchod Google Play a vyhľadajte ChatGPT. Pod názvom musí byť napísané OpenAI.",
        action: "Otvoriť v Google Play",
        url: "https://play.google.com/store/apps/details?id=com.openai.chatgpt",
        host: "play.google.com",
      },
      {
        device: "Na iPhone alebo iPade",
        text: "Otvorte App Store a vyhľadajte ChatGPT. Pri vývojárovi musí byť OpenAI.",
        action: "Otvoriť v App Store",
        url: "https://apps.apple.com/sk/app/chatgpt/id6448311069",
        host: "apps.apple.com",
      },
    ],
    checksTitle: "Tri kontroly, než čokoľvek nainštalujete",
    checks: [
      "Pri názve aplikácie musí byť vydavateľ <strong>OpenAI</strong>. Nič iné.",
      "Inštalácia je <strong>zadarmo</strong>. Kto pýta peniaze vopred, nie je pravý ChatGPT.",
      "Aplikácia má <strong>milióny stiahnutí</strong> a tisíce hodnotení. Napodobeniny mávajú pár desiatok.",
    ],
    note: "Na vyskúšanie nepotrebujete platenú verziu. Bezplatná bohato stačí na všetko, čo si v tomto kurze ukážeme.",
  },
  {
    id: 111, part: 2, type: "hotspot",
    title: "Takto vyzerá ChatGPT v praxi",
    lead: "Obrazovka je jednoduchšia, než čakáte — v skutočnosti sú na nej len tri miesta, ktoré budete používať.",
    task: "Na obrázku sú <strong>tri očíslované body</strong>. Kliknite postupne na každý z nich — pod obrázkom sa im rozsvieti vysvetlenie.",
    spots: [
      { x: 13, y: 62, title: "Zoznam rozhovorov", text: "Vľavo — staršie otázky sa nestrácajú, kedykoľvek sa k nim vrátite." },
      { x: 78, y: 91, title: "Okienko na písanie", text: "Dole — otázka sa píše rovnako ako SMS správa." },
      { x: 58, y: 42, title: "Odpoveď po slovensky", text: "AI odpovie prehľadne, väčšinou v bodoch — tu napríklad rozpísaný plán výletu." },
    ],
    evidenceImage: {
      src: "assets/course-media/evidence/chatgpt-screenshot.jpg",
      caption: "Skutočná obrazovka aplikácie ChatGPT na tablete — presne takto to uvidíte aj vy.",
      appLabel: "ChatGPT",
    },
  },
  {
    id: 112, part: 2, type: "sequence",
    title: "Vaša úplne prvá otázka",
    lead: "Poďme na to. Päť krokov a máte za sebou prvý rozhovor s umelou inteligenciou.",
    task: "Päť krokov je zámerne pomiešaných. Klikajte na ne <strong>v poradí, v akom by ste ich naozaj robili</strong> — začnite tým, čo urobíte úplne ako prvé.",
    steps: [
      "Otvorte aplikáciu ChatGPT alebo v prehliadači napíšte chatgpt.com.",
      "Dole na obrazovke nájdete okienko na písanie — rovnaké ako pri SMS.",
      "Napíšte otázku celou vetou, ako by ste ju položili človeku.",
      "Stlačte šípku (odoslať) a počkajte pár sekúnd na odpoveď.",
      "Nerozumeli ste? Napíšte: „Vysvetli mi to jednoduchšie.“",
    ],
    doneText: "Presne takto to bude vyzerať aj u vás doma. Celé to trvá menej než minútu.",
    note: "V ChatGPT sa nedá nič pokaziť. Žiadne tlačidlo nič nezmaže vo vašom mobile ani účte.",
  },
  {
    id: 113, part: 2, type: "flip",
    title: "Štyri vety, ktoré vám vždy pomôžu",
    lead: "Keď odpoveď nesadne, nemusíte začínať odznova. Stačí napísať jednu z týchto viet a AI to skúsi inak.",
    task: "Kliknite postupne na <strong>všetky štyri karty</strong> a pozrite si, čo každá veta spôsobí.",
    cards: [
      { front: "„Vysvetli mi to jednoduchšie.“", back: "AI odpoveď prepíše bez odborných slov. Túto vetu môžete použiť aj trikrát za sebou — zakaždým to skúsi ešte jednoduchšie." },
      { front: "„Napíš to kratšie, v troch bodoch.“", back: "Z dlhého textu zostane to podstatné. Funguje aj naopak: „Rozpíš mi to podrobnejšie.“" },
      { front: "„Odkiaľ to vieš?“", back: "AI uvedie, z čoho vychádza, prípadne prizná, že si tým nie je istá. Pri dôležitých veciach je to veľmi užitočná otázka." },
      { front: "„To nesedí, over to ešte raz.“", back: "Pokojne AI opravte. Neurazí sa, odpoveď prehodnotí a často sa sama opraví. Ste to vy, kto má posledné slovo." },
    ],
  },
  {
    id: 114, part: 2, type: "story", medium: "chat",
    title: "Keď odpoveď nesadne",
    lead: "Prvá odpoveď nemusí byť tá pravá — a to je úplne v poriadku. Pozrime sa, čo s tým.",
    task: "Prečítajte si, čo vám AI odpovedala, a potom sa rozhodnite, ako budete pokračovať.",
    flags: ["Prvá odpoveď", "Príliš odborné", "Dá sa to napraviť"],
    safeTip: "Rozhovor s AI je ako rozhovor s človekom — pokojne sa pýtajte znova a inak, kým vám odpoveď nesadne.",
    start: "a",
    nodes: {
      a: {
        speaker: "ChatGPT",
        text: "„Hypertenzia 2. stupňa označuje elevovaný systolický tlak v rozmedzí 160–179 mmHg, pričom terapeutický režim DASH implikuje reštrikciu nátria…“",
        choiceHint: "Odpovedi celkom nerozumiete. Čo urobíte?",
        choices: [
          { text: "Zavriem to, na toto zjavne nemám.", to: "bad" },
          { text: "Napíšem: „Vysvetli mi to jednoducho, bez odborných slov.“", to: "good" },
        ],
      },
      bad: {
        end: "bad",
        text: "Škoda — a pritom by stačila jedna veta. Odborná odpoveď neznamená, že ste otázku položili zle. AI len zvolila príliš učený jazyk a stačí ju požiadať o jednoduchšie znenie. Skúste to nabudúce, naozaj to funguje.",
      },
      good: {
        end: "good",
        text: "Presne tak! AI odpovie napríklad: „Máte zvýšený krvný tlak. Odporúčaná strava znamená menej soli, viac zeleniny a ovocia.“ Rovnakú vetu môžete použiť pri akejkoľvek odpovedi, ktorá je pre vás priveľmi odborná.",
      },
    },
  },
  {
    id: 115, part: 2, type: "quickfire", stamp: true,
    title: "Bleskovka č. 2",
    lead: "Prvé kroky máte za sebou. Pozrime sa, čo vám z nich ostalo v hlave.",
    task: "Tri rýchle otázky. Pri každej kliknite <strong>Áno</strong> alebo <strong>Nie</strong>.",
    tips: [
      "Pravú aplikáciu spoznáte podľa vydavateľa OpenAI.",
      "Na počítači netreba inštalovať nič — stačí adresa chatgpt.com.",
      "Keď odpoveď nesadne, požiadajte o jednoduchšie znenie.",
    ],
    questions: [
      { short: "Treba za ChatGPT platiť?", text: "Musíte za ChatGPT zaplatiť, aby ste ho mohli vyskúšať?", answer: false, why: "Nie. Bezplatná verzia stačí na všetko, čo v tomto kurze robíme. Kto pýta peniaze vopred, nie je pravý ChatGPT." },
      { short: "Môžete sa pýtať viackrát?", text: "Môžete sa na tú istú vec opýtať viackrát inými slovami?", answer: true, why: "Áno, a je to úplne bežné. AI sa neurazí a často práve druhá alebo tretia otázka prinesie tú najlepšiu odpoveď." },
      { short: "Zmaže AI niečo v mobile?", text: "Môže ChatGPT niečo zmazať alebo pokaziť vo vašom telefóne?", answer: false, why: "Nie. ChatGPT pracuje len vo svojom okne. K vašim fotkám, kontaktom ani aplikáciám sa nedostane." },
    ],
  },

  // ---------- ČASŤ 3: Umenie pýtať sa ----------
  {
    id: 116, part: 3, type: "reveal",
    title: "Tri veci, ktoré robia otázku dobrou",
    lead: "Rozdiel medzi obyčajnou a výbornou odpoveďou nebýva v umelej inteligencii. Býva v otázke — a to je dobrá správa, lebo tú máte vo svojich rukách.",
    task: "Kliknite postupne na <strong>všetky tri body</strong>. Za každým sa skrýva jedna zložka dobrej otázky.",
    layout: "keys",
    cells: [
      { title: "Povedzte, kto ste a čo riešite", text: "„Som začiatočník a nikdy som nepiekol.“ Vďaka tomu AI zvolí správnu úroveň a nebude predpokladať, čo neviete." },
      { title: "Povedzte, čo presne chcete", text: "Nie „pomôž mi s rastlinami“, ale „palme žltnú listy, stojí dva metre od okna a zalievam raz týždenne — čo s tým?“" },
      { title: "Povedzte, ako to má vyzerať", text: "„V troch bodoch“, „krok za krokom s časmi“, „slušným tónom ako úradný list“. AI to presne tak aj spraví." },
    ],
    note: "Predstavte si, že dávate pokyny ochotnému človeku, ktorý vás vôbec nepozná. Čím viac mu poviete, tým lepšie vám pomôže.",
  },
  {
    id: 117, part: 3, type: "choice",
    title: "Ktorá otázka dá lepšiu odpoveď?",
    lead: "Poďme si to vyskúšať na dvoch dvojiciach. Obe otázky sú zrozumiteľné — no len jedna z nich dá odpoveď, ktorú naozaj použijete.",
    task: "Pri každej dvojici vyberte otázku, ktorá podľa vás prinesie užitočnejšiu odpoveď.",
    chooseLabel: "Ktorá otázka vám dá užitočnejšiu odpoveď?",
    rounds: [
      {
        weak: "Napíš recept na koláč.",
        good: "Napíš recept na jednoduchý jablkový koláč pre začiatočníka. Bez orechov, krok za krokom, s časom a teplotou pečenia.",
        weakVerdict: "Príliš všeobecná — dostanete hociktorý koláč.",
        goodVerdict: "Konkrétna — AI vie, čo máte doma zvládnuť.",
        why: "Čím viac AI poviete, tým menej budete musieť odpoveď prerábať. Tu ste jej povedali, pre koho je recept, čo v ňom nemá byť a ako má vyzerať.",
        answerPreview: "Jablkový koláč pre začiatočníkov: 1. Rúru predhrejte na 180 °C. 2. Štyri jablká ošúpte a nakrájajte…",
      },
      {
        weak: "Napíš email.",
        good: "Napíš slušný e-mail lekárovi, v ktorom sa ospravedlním za zrušený termín a poprosím o nový budúci týždeň.",
        weakVerdict: "AI netuší komu, o čom ani akým tónom.",
        goodVerdict: "Jasné komu, o čom aj v akom tóne.",
        why: "Pri listoch a e-mailoch sú dôležité tri veci: komu píšete, čo chcete povedať a aký tón zvoliť. Keď ich uvediete, text býva použiteľný hneď na prvýkrát.",
        answerPreview: "Vážený pán doktor, ospravedlňujem sa, že som nemohol prísť na dohodnutý termín…",
      },
    ],
    note: "Nemusíte to trafiť na prvýkrát. Keď odpoveď nesadne, doplňte, čo chýbalo — AI to skúsi znova.",
  },
  {
    id: 118, part: 3, type: "sequence",
    title: "Z krátkej otázky urobíme dobrú",
    lead: "Vezmime obyčajnú otázku „Pomôž mi so záhradou“ a poskladajme z nej niečo, čo prinesie skutočne užitočnú odpoveď.",
    task: "Štyri kroky sú pomiešané. Klikajte na ne <strong>v poradí, v akom otázku postupne vylepšujete</strong>.",
    steps: [
      "Pomôž mi so záhradou.",
      "Pomôž mi so záhradou — mám ílovitú pôdu na južnom Slovensku.",
      "Čo mám zasadiť v marci? Mám ílovitú pôdu na južnom Slovensku.",
      "Čo mám zasadiť v marci? Mám ílovitú pôdu na južnom Slovensku. Napíš to ako zoznam s termínmi výsevu.",
    ],
    doneText: "Z troch slov sa stala otázka, na ktorú príde odpoveď, ktorú si môžete rovno vytlačiť a zobrať do záhrady.",
    note: "Nemusíte celú otázku napísať naraz. Pokojne začnite krátko a postupne dopĺňajte — rozhovor si všetko pamätá.",
  },
  {
    id: 119, part: 3, type: "revealgrid",
    title: "Ťahák: čo napísať v bežných situáciách",
    lead: "Tieto vety si môžete pokojne odpísať. Do hranatých zátvoriek doplníte len to svoje.",
    task: "Kliknite na <strong>všetkých 6 políčok</strong> a prezrite si hotové vety pre najčastejšie situácie.",
    cells: [
      { title: "Nerozumiem slovu", text: "„Vysvetli mi jednoducho, čo znamená [slovo]. Použi príklad z bežného života.“" },
      { title: "Potrebujem recept", text: "„Navrhni večeru pre [počet] osôb z týchto surovín: [suroviny]. Príprava do [počet] minút.“" },
      { title: "Mám napísať list", text: "„Napíš [list/e-mail] pre [komu], tón [slušný/priateľský]. Chcem povedať toto: [obsah].“" },
      { title: "Potrebujem preklad", text: "„Prelož tento text do [jazyk] a napíš aj, ako sa to prečíta: [text].“" },
      { title: "Chcem sa pripraviť k lekárovi", text: "„Idem k lekárovi kvôli [problém]. Napíš 5 otázok, ktoré sa mám opýtať.“" },
      { title: "Odpoveď je nezrozumiteľná", text: "„Vysvetli mi to jednoducho, ako by som mal 70 rokov a počujem to prvýkrát.“" },
    ],
    note: "Tieto vety nájdete aj v brožúrke ku kurzu. Oplatí sa mať ich poruke, kým si na ne zvyknete.",
  },
  {
    id: 120, part: 3, type: "quickfire", stamp: true,
    title: "Bleskovka č. 3",
    lead: "Pýtať sa už viete. Poďme si to overiť tromi otázkami.",
    task: "Tri rýchle otázky. Pri každej kliknite <strong>Áno</strong> alebo <strong>Nie</strong>.",
    tips: [
      "Dobrá otázka povie, kto ste, čo chcete a ako to má vyzerať.",
      "Otázku môžete dopĺňať postupne — rozhovor si pamätá, o čom bola reč.",
      "Keď odpoveď nesadne, doplňte, čo v otázke chýbalo.",
    ],
    questions: [
      { short: "Je konkrétna otázka lepšia?", text: "Prinesie konkrétnejšia otázka zvyčajne užitočnejšiu odpoveď?", answer: true, why: "Áno, a je to najjednoduchší spôsob, ako z AI dostať viac. Stačí doplniť, pre koho to je a ako to má vyzerať." },
      { short: "Musí byť otázka spisovná?", text: "Musí byť otázka bezchybne spisovná, aby jej AI rozumela?", answer: false, why: "Nie. AI si poradí aj s preklepmi a hovorovou rečou. Dôležitejšie je povedať, čo presne chcete." },
      { short: "Treba všetko napísať naraz?", text: "Musíte celú otázku napísať naraz a dokonale hneď na prvýkrát?", answer: false, why: "Nie. Pokojne začnite krátko a postupne dopĺňajte. Rozhovor si pamätá, o čom ste sa bavili predtým." },
    ],
  },

  // ---------- ČASŤ 4: AI v bežnom živote ----------
  {
    id: 121, part: 4, type: "tiles",
    title: "Kde vám AI ušetrí čas",
    lead: "Teraz to najpríjemnejšie — konkrétne situácie, v ktorých vám umelá inteligencia naozaj pomôže.",
    task: "Kliknite postupne na <strong>aspoň štyri dlaždice</strong> a pozrite si, čo sa za nimi skrýva.",
    tiles: [
      { title: "Listy a úrady", text: "Reklamácia, žiadosť, odvolanie či sťažnosť — slušne, ale dôrazne a bez zbytočných slov." },
      { title: "Zdravie", text: "Vysvetlí lekársku správu, pripraví otázky k lekárovi a preloží príbalový leták do ľudskej reči." },
      { title: "Kuchyňa", text: "Recept z toho, čo máte v chladničke, aj úprava receptu pre cukrovkára či bezlepkovú diétu." },
      { title: "Dom a záhrada", text: "Čo zasadiť, ako zachrániť muškáty a čo urobiť ako prvé, keď praskne rúra pod umývadlom." },
      { title: "Cudzie jazyky", text: "Preloží text, list aj jedálny lístok — a povie vám, ako sa to prečíta." },
      { title: "Vnúčatá", text: "Rozprávka na dobrú noc, básnička k narodeninám alebo vysvetlenie, prečo je obloha modrá." },
    ],
    minOpened: 4,
  },
  {
    id: 122, part: 4, type: "match",
    title: "Situácia a hotová otázka",
    lead: "Ku každej situácii sa hodí trochu iná otázka. Poďme si ich priradiť.",
    task: "Kliknite na situáciu <strong>vľavo</strong> a potom na otázku <strong>vpravo</strong>, ktorá k nej patrí.",
    pairs: [
      { left: "Odlepila sa vám podrážka na nových topánkach", right: "„Napíš slušnú, ale dôraznú reklamáciu.“", why: "AI pozná, ako má reklamácia vyzerať, a doplní aj to, čo by ste možno zabudli — dátum kúpy, čo žiadate a dokedy." },
      { left: "Z lekárskej správy nerozumiete ani slovo", right: "„Vysvetli mi tieto pojmy jednoducho.“", why: "AI preloží odbornú reč do zrozumiteľnej slovenčiny. Liečbu však určuje lekár — s ním si výsledok vždy preberte." },
      { left: "V chladničke máte kuracie prsia a cuketu", right: "„Navrhni večeru pre dvoch do 30 minút.“", why: "Vymenujte, čo máte doma, koľko máte času a pre koľkých varíte. Recept dostanete na mieru." },
      { left: "Idete na dovolenku do Talianska", right: "„Prelož mi tieto vety a napíš, ako sa čítajú.“", why: "AI zvládne preklad aj výslovnosť. V mobile ju navyše môžete použiť priamo na mieste." },
    ],
    note: "Všimnite si, že ani v jednej otázke nie je meno, adresa ani rodné číslo. AI ich na dobrú radu nepotrebuje.",
  },
  {
    id: 123, part: 4, type: "reveal",
    title: "Váš mobil má oči",
    lead: "V aplikácii ChatGPT môžete stlačiť ikonu fotoaparátu a niečo odfotiť. AI sa na fotku pozrie a povie vám, čo na nej je.",
    task: "Kliknite postupne na <strong>všetky štyri body</strong> a pozrite si, čo všetko sa dá odfotiť.",
    layout: "keys",
    cells: [
      { title: "Drobné písmo na letáku", text: "Odfoťte príbalový leták a napíšte: „Zhrň mi, ako sa liek užíva a aké sú bežné vedľajšie účinky.“ Konečne bez lupy." },
      { title: "Rastlina v záhrade či lese", text: "„Čo je to za kvet? Ako sa oň starať?“ AI vám odpovie aj s tipmi na polievanie." },
      { title: "Jedálny lístok v cudzine", text: "Odfoťte menu a nechajte si ho preložiť. Už si neobjednáte niečo, čo ste nechceli." },
      { title: "Pokazená vec v domácnosti", text: "„Čo je toto za súčiastku a dá sa vymeniť svojpomocne?“ Aspoň budete vedieť, čo povedať opravárovi." },
    ],
    note: "Pri hubách buďte opatrní — tam sa AI mýli a chyba môže byť nebezpečná. Berte ju nanajvýš ako orientáciu a overte si to v atlase alebo u znalca.",
  },
  {
    id: 124, part: 4, type: "flip",
    title: "Keď sa vám nechce písať",
    lead: "Písanie na malej klávesnici nemusí byť príjemné. Našťastie nie je povinné — AI vás rada počúva aj číta nahlas.",
    task: "Kliknite postupne na <strong>všetky štyri karty</strong>.",
    cards: [
      { front: "Diktovanie namiesto písania", back: "V aplikácii stlačte ikonu mikrofónu a jednoducho hovorte. AI rozumie slovenčine veľmi dobre — a preklepy odpadnú úplne." },
      { front: "Nákupný zoznam nahlas", back: "„Zapíš mi nákupný zoznam: chlieb, mlieko, dve kilá jabĺk.“ AI ho prehľadne spíše a vy ho v obchode len odškrtávate." },
      { front: "Recept počas varenia", back: "Ruky máte od cesta, no mobil vás počuje. Môžete sa spýtať na ďalší krok bez toho, aby ste sa ho dotkli." },
      { front: "Nechajte si čítať", back: "Dlhý článok si môžete nechať prečítať nahlas. Vaše oči si oddýchnu a vy medzitým pokojne zalievate kvety." },
    ],
    note: "Hlasové ovládanie je často jednoduchšie než písanie. Ak vám písanie robí ťažkosti, začnite rovno mikrofónom.",
  },
  {
    id: 125, part: 4, type: "story", medium: "chat",
    title: "Reklamácia, ktorú netreba vymýšľať",
    lead: "Skúsme si jednu skutočnú situáciu od začiatku do konca.",
    task: "Prečítajte si situáciu a rozhodnite sa, ako ju vyriešite.",
    flags: ["Bežná situácia", "Netreba právnika", "Hotové za pár minút"],
    safeTip: "AI vám pripraví text. Pred odoslaním si ho vždy prečítajte a opravte podľa skutočnosti — dátumy a sumy musia sedieť.",
    start: "a",
    nodes: {
      a: {
        speaker: "Situácia",
        text: "Pred tromi týždňami ste si kúpili topánky. Po týždni nosenia sa odlepila podrážka. V predajni vám povedali, že s tým nič neurobia.",
        choiceHint: "Ako budete postupovať?",
        choices: [
          { text: "Mávnem rukou, písať reklamáciu neviem.", to: "bad" },
          { text: "Poprosím AI, aby mi reklamáciu napísala.", to: "good" },
        ],
      },
      bad: {
        end: "bad",
        text: "Škoda peňazí — a pritom napísať reklamáciu dnes zvládne ktokoľvek. Stačí AI povedať, čo sa stalo a čo žiadate. O správne slová a slušný tón sa postará ona.",
      },
      good: {
        end: "good",
        text: "Výborne! Napíšete jej napríklad: „Kúpil som topánky 15. januára v predajni v Piešťanoch. Po týždni sa odlepila podrážka, v predajni ma odmietli. Napíš slušnú, ale dôraznú reklamáciu. Žiadam výmenu alebo vrátenie peňazí.“ O pár sekúnd máte hotový list — stačí ho skontrolovať a odoslať.",
      },
    },
  },
  {
    id: 126, part: 4, type: "quickfire", stamp: true,
    title: "Bleskovka č. 4",
    lead: "Poznáte už kopu situácií, v ktorých AI pomôže. Tri otázky na záver tejto časti.",
    task: "Tri rýchle otázky. Pri každej kliknite <strong>Áno</strong> alebo <strong>Nie</strong>.",
    tips: [
      "AI vie vysvetliť lekársku správu, ale liečbu určuje lekár.",
      "Fotoaparát v aplikácii nahradí lupu pri drobnom písme.",
      "Namiesto písania môžete jednoducho hovoriť.",
    ],
    questions: [
      { short: "Môže AI nahradiť lekára?", text: "Môže umelá inteligencia nahradiť lekára pri určení liečby?", answer: false, why: "Nie. Vysvetliť správu či pripraviť otázky k lekárovi je výborné využitie. Diagnózu a liečbu však vždy určuje lekár." },
      { short: "Dá sa AI niečo odfotiť?", text: "Môžete umelej inteligencii niečo odfotiť a spýtať sa, čo to je?", answer: true, why: "Áno. V aplikácii stlačíte ikonu fotoaparátu. Hodí sa to na drobné písmo, rastliny, jedálne lístky aj pokazené veci." },
      { short: "Musíte otázku napísať?", text: "Musíte otázku vždy napísať na klávesnici?", answer: false, why: "Nie. Stlačte ikonu mikrofónu a hovorte. AI rozumie slovenčine veľmi dobre a písanie úplne odpadne." },
    ],
  },

  // ---------- ČASŤ 5: Bezpečne a s rozumom ----------
  {
    id: 127, part: 5, type: "sort",
    title: "Čo umelej inteligencii nehovoríme",
    lead: "AI nie je nebezpečná. Platí pri nej to isté, čo pri každom rozhovore cez internet — niektoré údaje jednoducho nikam nepatria.",
    task: "Máte 8 kartičiek. Kliknite na kartičku a potom na políčko, kam podľa vás patrí.",
    baskets: [
      { id: "nie", label: "Toto do AI nezadávame", desc: "Údaje, ktoré vás môžu ohroziť.", tone: "danger" },
      { id: "ano", label: "Toto pokojne zadáme", desc: "Na dobrú radu úplne stačí.", tone: "safe" },
    ],
    sideNote: {
      title: "Jednoduché pravidlo",
      items: [
        { tone: "good", text: "Opíšte situáciu — nie svoje čísla a doklady." },
        { tone: "warn", text: "Čo by ste nepovedali cudziemu človeku v autobuse, nepíšte ani AI." },
        { tone: "info", text: "Na užitočnú radu AI vaše osobné údaje väčšinou vôbec nepotrebuje." },
      ],
    },
    items: [
      { text: "rodné číslo", basket: "nie", why: "Rodné číslo je kľúč k vašej totožnosti. Na žiadnu radu ho AI nepotrebuje." },
      { text: "číslo platobnej karty a kód z jej zadnej strany", basket: "nie", why: "Tieto údaje stačia na zaplatenie vašou kartou. Nepatria nikam, ani do AI." },
      { text: "heslo do internetbankingu", basket: "nie", why: "Heslá sa nezadávajú nikde inde než na prihlasovacej stránke danej služby." },
      { text: "odfotený občiansky preukaz alebo pas", basket: "nie", why: "Z fotografie dokladu sa dá zneužiť veľa. Pred odfotením dokumentu citlivé údaje radšej prekryte." },
      { text: "otázka, čo znamená slovo v lekárskej správe", basket: "ano", why: "Vysvetľovanie je presne to, v čom je AI najlepšia. Meno pacienta pritom uvádzať netreba." },
      { text: "suroviny, ktoré máte v chladničke", basket: "ano", why: "Na recept AI potrebuje len to, čo máte doma a koľko máte času." },
      { text: "opis situácie bez mien a čísel", basket: "ano", why: "„Niekto odo mňa žiada peniaze na neznámy účet“ stačí na veľmi dobrú radu." },
      { text: "otázka o histórii, prírode alebo kultúre", basket: "ano", why: "Pri všeobecných otázkach nie je čo riešiť — pýtajte sa koľko chcete." },
    ],
  },
  {
    id: 128, part: 5, type: "rewrite",
    title: "Ako sa pýtať bezpečne",
    lead: "Už viete, ktoré údaje do AI nepatria. Teraz si ukážeme, že otázka bez nich funguje rovnako dobre — často ešte lepšie.",
    task: "V otázke nižšie sú <strong>dva údaje</strong>, ktoré AI na dobrú radu nepotrebuje. Kliknite na každý z nich a vpravo sa vám poskladá bezpečnejšia verzia.",
    sentence: [
      { text: "Volám sa", sensitive: false },
      { text: "Mária Kováčová, bývam na Hlavnej 12 v Piešťanoch", sensitive: true, why: "Meno ani adresu AI na radu nepotrebuje. Stačí opísať, o akú situáciu ide." },
      { text: "a prišiel mi list z", sensitive: false },
      { text: "poisťovne o dlhu 480 € k môjmu rodnému číslu 555555/5555", sensitive: true, why: "Rodné číslo je citlivý údaj a nemá byť nikde, kde nemusí. Suma a typ listu na vysvetlenie bohato stačia." },
      { text: "— čo mám robiť?", sensitive: false },
    ],
    safeVersion: "Prišiel mi list z poisťovne o nedoplatku. Vysvetli mi jednoducho, čo taký list znamená, ako si overím, či je pravý, a čo mám urobiť ako prvé.",
    takeaway: "Opíšte situáciu, nie svoje údaje. Odpoveď bude rovnako užitočná — a vaše údaje zostanú tam, kam patria.",
  },
  {
    id: 129, part: 5, type: "reveal",
    title: "Keď si AI vymýšľa",
    lead: "Halucinácia znie hrozivo, no ide o obyčajnú vec: AI nerada priznáva, že niečo nevie, a tak si odpoveď domyslí. Ak o tom viete, ľahko sa s tým vysporiadate.",
    task: "Kliknite postupne na <strong>všetky tri body</strong> a pozrite si, ako sa proti tomu chrániť.",
    layout: "keys",
    cells: [
      { title: "Spýtajte sa na zdroj", text: "„Odkiaľ to vieš? Kde si to môžem overiť?“ Ak AI zdroj neuvedie alebo sa začne vyhýbať, majte sa na pozore." },
      { title: "Čísla si overte inde", text: "Telefónne čísla, sumy, dátumy a paragrafy si skontrolujte na oficiálnej stránke úradu, banky alebo poisťovne." },
      { title: "Pri zdraví a peniazoch sa poraďte", text: "AI je dobrý prvý názor. Pri liečbe, zmluve či investícii má posledné slovo lekár, právnik alebo pracovník banky." },
    ],
    note: "Novšie verzie AI si vymýšľajú výrazne menej než tie spred pár rokov. Úplne sa toho ale zatiaľ zbaviť nepodarilo.",
  },
  {
    id: 130, part: 5, type: "guess",
    title: "Skutočná fotografia, alebo AI?",
    lead: "Umelá inteligencia dnes dokáže vytvoriť obrázky, ktoré vyzerajú veľmi vierohodne. Oplatí sa vedieť, čo si na nich všímať.",
    task: "Uvidíte <strong>dve fotografie</strong>. Pri každej vyberte, či je podľa vás skutočná, alebo vytvorená umelou inteligenciou. Obrázok si môžete kliknutím zväčšiť.",
    rounds: [
      { image: "assets/course-media/evidence/ai-foto-seniori-prezentacia.jpg", answer: "ai", explain: "Tento obrázok vytvorila umelá inteligencia. Na prvý pohľad je príjemný a nič nekričí, že je vymyslený — a presne v tom je dnes problém. Keď sa pozriete pozorne: nápis na premietanom plátne má okraje ostrejšie, než by po premietaní boli, každý pri stole drží takmer rovnaký tablet, ruky sú v rovnakom držaní a celá scéna je nasvietená ako z reklamného katalógu, bez jediného tieňa navyše." },
      { image: "assets/course-media/evidence/real-foto-deti-na-schodoch.jpg", answer: "real", explain: "Toto je skutočná fotografia. Všimnite si drobnosti, ktoré si nikto nevymýšľa: odreté schody, tenký prameň vlasov mimo účesu, mierne pokrčené šaty, tiene na tvárach sediace so slnkom. Ani to však samo osebe nie je dôkaz — pri dôležitom obrázku vždy overujte aj to, odkiaľ pochádza." },
    ],
    checklist: [
      { title: "Ruky a prsty", text: "Nezvyčajný počet alebo tvar prstov môže byť stopou. Novšie programy však už ruky často kreslia správne, preto sa nespoliehajte len na tento znak." },
      { title: "Text na obrázku", text: "Nápisy bývajú skomolené alebo nezmyselné. Pozrite sa na tabule, plagáty a štítky v pozadí." },
      { title: "Príliš dokonalé svetlo", text: "Keď scéna vyzerá ako z reklamného katalógu — bez jediného tieňa navyše — býva to podozrivé." },
      { title: "Odkiaľ obrázok pochádza", text: "Toto je najspoľahlivejšie zo všetkého. Zaujímajte sa, kto obrázok zverejnil a či o tej istej veci píše aj niekto iný." },
    ],
    note: "Fotografia ani video dnes už nie sú dôkazom, že sa niečo naozaj stalo. Pri dôležitých veciach hľadajte zdroj.",
  },
  {
    id: 131, part: 5, type: "story", medium: "call",
    title: "Hlas, ktorý znel ako vnuk",
    lead: "Rovnakú technológiu, ktorá vám pomáha, vedia zneužiť aj podvodníci. Napodobniť hlas blízkeho človeka dnes nie je ťažké.",
    task: "Zvoní vám telefón. Kliknite na zelené tlačidlo <strong>„Prijať“</strong> a rozhodnite sa, ako zareagujete.",
    flags: ["Neznáme číslo", "Silné emócie", "Tlak na rýchlosť"],
    safeTip: "Dohodnite si v rodine jedno kontrolné slovo alebo otázku, ktorú by vedel len váš blízky. Je to jednoduché a funguje to výborne.",
    start: "a",
    nodes: {
      a: {
        speaker: "Neznáme číslo",
        text: "„Babka, to som ja! Mal som nehodu a potrebujem hneď peniaze na opravu, inak ma zavrú. Nevolaj mame, prosím ťa, bola by z toho zúfalá. Pošli to na účet, ktorý ti teraz nadiktujem…“",
        choiceHint: "Hlas znie ako váš vnuk. Čo urobíte?",
        choices: [
          { text: "Je to jeho hlas, peniaze pošlem hneď.", to: "bad" },
          { text: "Zložím a zavolám vnukovi na číslo, ktoré mám uložené.", to: "good" },
        ],
      },
      bad: {
        end: "bad",
        text: "Toto je presne tá situácia, na ktorú podvodníci stavajú. Hlas sa dnes dá napodobniť z niekoľkých sekúnd nahrávky, napríklad z videa na sociálnej sieti. Najsilnejším varovným znakom bola veta „nevolaj mame“ — má zabrániť tomu, aby ste si to overili.",
      },
      good: {
        end: "good",
        text: "Presne tak, a urobili ste to najlepšie, čo sa dalo. Zavoláte na číslo, ktoré máte uložené vy — nie na to, z ktorého vám volali. Ak vnuk nedvíha, skúste iného člena rodiny. Pokojne aj neskoro večer; je to lepšie než prísť o peniaze.",
      },
    },
  },
  {
    id: 132, part: 5, type: "revealgrid",
    title: "Šesť pravidiel pokojnej hlavy",
    lead: "Toto je celá bezpečnosť v šiestich vetách. Platia pri umelej inteligencii aj kdekoľvek inde na internete.",
    task: "Kliknite postupne na <strong>všetkých 6 políčok</strong>.",
    cells: [
      { title: "Nikdy sa neponáhľajte", text: "Kto vás tlačí konať hneď, väčšinou nechce vaše dobro. Pár minút navyše nič nepokazí." },
      { title: "Overte si to na druhom mieste", text: "Dôležitý údaj si potvrďte na oficiálnej stránke alebo u človeka, ktorý sa tomu rozumie." },
      { title: "Volajte na číslo, ktoré poznáte", text: "Nikdy nie na to, ktoré vám niekto nadiktoval alebo poslal v správe." },
      { title: "Údaje si nechajte pre seba", text: "Heslá, PIN a kódy z SMS nepatria nikomu — ani AI, ani „pracovníkovi banky“." },
      { title: "Poraďte sa s blízkym", text: "Pri väčšom rozhodnutí si zavolajte niekomu z rodiny. Jeden telefonát zmarí väčšinu podvodov." },
      { title: "Pýtajte sa pokojne ďalej", text: "Nič nie je hlúpa otázka. Radšej sa spýtajte desaťkrát, než raz naletieť." },
    ],
  },
  {
    id: 133, part: 5, type: "printcard",
    title: "Váš ťahák vedľa počítača",
    lead: "Vety, ktoré vám s umelou inteligenciou pomôžu vždy. Môžete si ich uložiť alebo vytlačiť a mať ich poruke.",
    task: "Prečítajte si všetkých šesť viet. Sú to presne tie, ktoré budete používať najčastejšie.",
    rules: [
      "„Vysvetli mi to jednoducho, ako by som to počul prvýkrát.“",
      "„Napíš to kratšie, v troch bodoch.“",
      "„Odkiaľ to vieš? Kde si to môžem overiť?“",
      "„To nesedí, over to ešte raz.“",
      "Opisujem situáciu — nie svoje mená, čísla a doklady.",
      "Pri zdraví a peniazoch má posledné slovo odborník.",
    ],
  },
  {
    id: 134, part: 5, type: "belief",
    title: "Posledné rozcvičenie",
    lead: "Skúsme si na záver ešte štyri odpovede. Už to viete — uvidíte sami.",
    task: "Pri každej odpovedi kliknite, či jej pokojne <strong>uveríte</strong>, alebo si ju radšej <strong>overíte</strong>.",
    tip: "Pomôcka: konkrétne čísla a paragrafy overujeme, vysvetlenia a rady na opatrnosť sú bezpečné.",
    items: [
      { text: "„Muškáty prezimujú v chladnej miestnosti, polievajte ich striedmo.“", answer: "uverim" },
      { text: "„Zákaznícka linka vašej poisťovne je 0850 111 222.“", answer: "overim" },
      { text: "„Túto hubu môžete pokojne zjesť, je to bedľa.“", answer: "overim" },
      { text: "„Keď vás niekto tlačí konať hneď, spomaľte a overte si to.“", answer: "uverim" },
    ],
    note: "Všimnite si, že hranica je jednoduchá: čo sa dá zle zapamätať, to sa dá aj zle vymyslieť.",
  },
  {
    id: 135, part: 5, type: "quickfire", stamp: true,
    title: "Bleskovka č. 5",
    lead: "Posledné tri otázky — a Lekcie máte za sebou.",
    task: "Tri rýchle otázky. Pri každej kliknite <strong>Áno</strong> alebo <strong>Nie</strong>.",
    tips: [
      "Do AI nepatria heslá, rodné čísla ani fotografie dokladov.",
      "Hlas aj tvár sa dnes dajú napodobniť — overujte cez známe číslo.",
      "Pri zdraví a peniazoch má posledné slovo odborník.",
    ],
    questions: [
      { short: "Patrí rodné číslo do AI?", text: "Je v poriadku napísať do AI svoje rodné číslo, ak sa pýtate na úradný list?", answer: false, why: "Nie. Na vysvetlenie listu stačí opísať, o čo ide. Rodné číslo ani adresu AI nepotrebuje." },
      { short: "Dá sa napodobniť hlas?", text: "Dokáže dnes umelá inteligencia napodobniť hlas vášho blízkeho?", answer: true, why: "Áno, a stačí jej na to krátka nahrávka. Preto pri žiadosti o peniaze vždy zavolajte späť na číslo, ktoré máte uložené vy." },
      { short: "Stačí odpoveď AI o liečbe?", text: "Môžete sa pri liečbe spoľahnúť len na odpoveď umelej inteligencie?", answer: false, why: "Nie. AI vám lekársku správu vysvetlí a pripraví otázky, no o liečbe rozhoduje lekár." },
    ],
  },
  {
    id: 136, part: 5, type: "reveal",
    title: "Váš prvý týždeň s umelou inteligenciou",
    lead: "Najlepší spôsob, ako si AI osvojiť, je používať ju po troške každý deň. Tu je pokojný plán na prvý týždeň — nič náročné, len sedem malých krokov.",
    task: "Kliknite postupne na <strong>všetky štyri body</strong> a pozrite si, čo si kedy vyskúšať.",
    layout: "keys",
    cells: [
      { title: "Prvé dni — zoznámenie", text: "Otvorte ChatGPT a napíšte: „Ahoj, som tu prvýkrát. Predstav sa mi.“ Potom sa ho spýtajte na niečo, čo dobre poznáte — hneď uvidíte, ako si počína." },
      { title: "Stred týždňa — niečo užitočné", text: "Nechajte si vysvetliť slovo, ktorému nerozumiete, alebo si dajte poradiť recept z toho, čo máte doma." },
      { title: "Koniec týždňa — hlas a fotoaparát", text: "Vyskúšajte mikrofón a nadiktujte nákupný zoznam. Potom niečo odfoťte a spýtajte sa, čo to je." },
      { title: "Nedeľa — pochváľte sa", text: "Ukážte niekomu z rodiny, čo ste sa naučili. Vysvetľovanie druhým je najlepší spôsob, ako si vec zapamätať." },
    ],
    note: "Nemusíte stihnúť všetko. Aj keď vyskúšate dve veci z tohto zoznamu, ste ďalej než minulý týždeň.",
  },
  {
    id: 137, part: 5, type: "match",
    title: "Zhrnutie: čo si odnášate",
    lead: "Posledné cvičenie. Priraďte k sebe to, čo už dávno viete — uvidíte, koľko toho je.",
    task: "Kliknite na pojem <strong>vľavo</strong> a potom na vysvetlenie <strong>vpravo</strong>, ktoré k nemu patrí.",
    pairs: [
      { left: "Prompt", right: "Otázka alebo zadanie, ktoré napíšete umelej inteligencii.", why: "Čím konkrétnejší prompt, tým užitočnejšia odpoveď. To je celé tajomstvo." },
      { left: "Halucinácia", right: "Keď si AI odpoveď vymyslí a tvári sa, že je pravdivá.", why: "Nie je to zlý úmysel. AI len nerada hovorí „neviem“ — preto dôležité veci overujeme." },
      { left: "Chatbot", right: "Program, s ktorým sa dá rozprávať formou správ.", why: "ChatGPT, Copilot aj Gemini sú chatboty. Píšete im ako do SMS." },
      { left: "Deepfake", right: "Falošné video alebo hlas vytvorený umelou inteligenciou.", why: "Práve preto pri žiadosti o peniaze voláme späť na číslo, ktoré máme uložené." },
    ],
    note: "Toto sú štyri slová, ktoré vám úplne stačia. S nimi sa v svete umelej inteligencie pohodlne zorientujete.",
  },
  {
    id: 138, part: 5, type: "diploma",
    title: "Máte za sebou Lekcie!",
    lead: "Gratulujeme — a myslíme to vážne. Viete, čo umelá inteligencia je a čo nie je, dokážete jej položiť dobrú otázku, poznáte desiatky situácií, v ktorých vám ušetrí čas, a viete, čo jej nikdy nehovoriť. To je oveľa viac, než s čím ste začínali. Pokračujte tlačidlom <strong>„Pokračovať na cvičenia“</strong> nižšie — čakajú vás Cvičenia, Zdroje a Záverečný kvíz, po ktorom dostanete certifikát.",
    quote: "Umelá inteligencia je tu, aby nám rozšírila obzory, nie aby nás zastrašila. Stačí sa pýtať a nebáť sa urobiť chybu.",
  },

  ];

  var PARTS = [
    { id: 1, label: "Spoznávame pomocníka", intro: "Čo umelá inteligencia je, čo dokáže a čo nie — pokojne a bez cudzích slov.", image: "assets/course-media/illustrations/part1-ai-pomocnik.jpg" },
    { id: 2, label: "Prvé kroky s ChatGPT", intro: "Kde ho nájdete, ako vyzerá a ako mu položíte úplne prvú otázku.", image: "assets/course-media/evidence/chatgpt-screenshot.jpg" },
    { id: 3, label: "Umenie pýtať sa", intro: "Malá zmena v otázke — a odpoveď je zrazu oveľa užitočnejšia.", image: "assets/course-media/evidence/real-foto-muz-s-notebookom.jpg" },
    { id: 4, label: "AI v bežnom živote", intro: "Listy, recepty, záhrada, lieky aj preklady — konkrétne situácie zo dňa.", image: "assets/course-media/illustrations/cover-elderly-couple.jpg" },
    { id: 5, label: "Bezpečne a s rozumom", intro: "Čo AI nikdy nehovoríme, ako si overiť odpoveď a ako spoznať podvod.", image: "assets/course-media/illustrations/part5-zlate-pravidla.jpg" },
  ];

  window.COURSE_LIBRARY = window.COURSE_LIBRARY || {};
  window.COURSE_LIBRARY["zaciname-s-ai"] = window.COURSE_LIBRARY["zaciname-s-ai"] || {};
  window.COURSE_LIBRARY["zaciname-s-ai"].slides = SLIDES;
  window.COURSE_LIBRARY["zaciname-s-ai"].parts = PARTS;
})();
