// Obsah interaktívneho kurzu "Ako nenaletieť podvodníkom" — 35 obrazoviek.
// Každá obrazovka má `type`, ktorý hovorí renderovaciemu enginu (assets/course.js),
// akú interakciu má vykresliť, a dátové polia, ktoré ten typ potrebuje.
//
// Spoločné polia naprieč typmi:
//   lead  — jedna veta, ktorá uvádza tému obrazovky (čo sa práve učíme).
//   task  — konkrétne zadanie: čo presne má senior urobiť. Zobrazí sa
//           v boxíku „Vaša úloha“ hneď pod nadpisom.
//   why   — vysvetlenie k jednotlivej odpovedi; ukáže sa hneď po kliknutí,
//           aby senior vedel, prečo bola odpoveď správna alebo nesprávna.
//   note  — poučka na zapamätanie, zobrazí sa pod cvičením.
window.COURSE_SLIDES = [

  // ---------- ČASŤ 1 · Spoznávame pomocníka ----------
  {
    id: 1, part: 1, type: "intro",
    title: "Ako nenaletieť podvodníkom",
    lead: "Umelá inteligencia ako pomocník pri dôležitých finančných rozhodnutiach.",
    image: "assets/course-media/illustrations/cover-elderly-couple.jpg",
    body: "Čaká vás 40 krátkych zastavení rozdelených do 5 častí. Pri každom si niečo vyskúšate a hneď sa dozviete, či ste odpovedali správne — aj prečo. Nič sa nedá pokaziť a kedykoľvek sa môžete vrátiť tam, kde ste skončili.",
    task: "Prezrite si päť častí kurzu nižšie a potom kliknite na tlačidlo <strong>„Ďalej“</strong> v pravom dolnom rohu.",
  },
  {
    id: 2, part: 1, type: "tiles",
    title: "Čo nás čaká",
    lead: "Päť tém, ktoré spolu prejdeme — od zoznámenia s AI až po zlaté pravidlá bezpečnosti.",
    task: "Kliknite postupne na <strong>aspoň tri dlaždice</strong>. Každá sa otvorí a ukáže, čo vás v danej časti čaká.",
    tiles: [
      { title: "Spoznávame pomocníka", text: "Čo je umelá inteligencia, čo vie a čo nevie — a ako s ňou začať." },
      { title: "Pozor, AI sa mýli", text: "Prečo si dôležité veci treba overiť aj z druhého zdroja." },
      { title: "Lovci podvodov", text: "Podozrivé e-maily, telefonáty aj SMS — skutočné príklady zo života." },
      { title: "Hoaxy, fotky, zmluvy", text: "Poplašné správy, fotografie vytvorené AI a zložité zmluvy." },
      { title: "Zlaté pravidlá", text: "Čo nikdy nikomu nezadávame — ani umelej inteligencii." },
    ],
    minOpened: 3,
  },
  {
    id: 3, part: 1, type: "flip",
    title: "Čo je to vlastne umelá inteligencia?",
    lead: "Predstavte si ju ako veľmi sčítaného pomocníka, ktorý ochotne poradí — ale volant držíte vy.",
    task: "Kliknite postupne na <strong>všetky štyri karty</strong>. Každá sa otočí a ukáže vysvetlenie na druhej strane.",
    cards: [
      { front: "Sčítaný pomocník", back: "AI si prečítala obrovské množstvo kníh, novín a webových stránok. Vďaka tomu vie odpovedať na otázky, vysvetľovať a radiť." },
      { front: "Nikdy sa neunaví", back: "Môžete sa jej pýtať kedykoľvek, koľkokrát chcete, a nikdy ju to neomrzí ani neurazí. Nemusíte sa báť, že otravujete." },
      { front: "Občas sa mýli", back: "Podobne ako človek. Nie všetko, čo AI povie, je nutne pravda — dôležité veci si preto vždy overte." },
      { front: "Vedeli ste?", back: "Prvý program, ktorý viedol rozhovor podobný ľudskému, sa volal ELIZA a vznikol už v roku 1966. Umelá inteligencia teda nie je až taká nová vec." },
    ],
  },
  {
    id: 4, part: 1, type: "sort",
    title: "Čo AI vie a čo nevie",
    lead: "Aby vám umelá inteligencia naozaj pomohla, treba vedieť, čo od nej môžete čakať — a čo už nie.",
    task: "Máte 10 kartičiek. Kliknite na kartičku a potom na políčko <strong>„AI vie“</strong> alebo <strong>„AI nevie“</strong>, kam podľa vás patrí. Pri každej vám hneď vysvetlíme, či ste sa trafili.",
    baskets: [
      { id: "vie", label: "AI vie", desc: "Vysvetliť, zhrnúť, upozorniť, poradiť.", tone: "safe" },
      { id: "nevie", label: "AI nevie", desc: "Rozhodnúť za vás ani ručiť za správnosť.", tone: "danger" },
    ],
    sideNote: {
      title: "Zapamätajte si",
      items: [
        { tone: "good", text: "AI je výborná na vysvetľovanie a upozorňovanie na riziká." },
        { tone: "warn", text: "AI nikdy nepreberá zodpovednosť za vaše rozhodnutie." },
        { tone: "info", text: "Pri peniazoch je AI len prvý názor — nie posledné slovo." },
      ],
    },
    items: [
      { text: "vysvetliť zložité veci jednoducho", basket: "vie", why: "Toto je jedna z najsilnejších stránok AI — dokáže preložiť odbornú reč do zrozumiteľnej slovenčiny." },
      { text: "upozorniť na možné riziká a podvody", basket: "vie", why: "AI pozná typické znaky podvodov a vie vás na ne upozorniť skôr, než niečo podpíšete." },
      { text: "pomôcť rozpoznať podvodný e-mail či SMS", basket: "vie", why: "Stačí jej správu prepísať alebo odfotiť a opýtať sa: „Je to podvod?“" },
      { text: "zhrnúť dlhý text alebo zmluvu", basket: "vie", why: "Z dvadsiatich strán vám AI spraví pár bodov s tým najdôležitejším." },
      { text: "trpezlivo odpovedať na vaše otázky", basket: "vie", why: "Môžete sa pýtať koľkokrát chcete — AI sa nikdy neurazí ani neunaví." },
      { text: "rozhodovať za vás", basket: "nevie", why: "AI môže poradiť, ale rozhodnutie — najmä pri peniazoch — musíte urobiť vy sami." },
      { text: "zaručiť, že každá odpoveď je správna", basket: "nevie", why: "AI sa občas mýli a tvári sa pritom veľmi presvedčivo. Preto sa dôležité fakty overujú." },
      { text: "nahradiť banku, lekára či právnika", basket: "nevie", why: "AI je pomocník, nie odborník s licenciou. Pri vážnych veciach vždy oslovte skutočného profesionála." },
      { text: "vidieť do vášho účtu (a tak je to správne!)", basket: "nevie", why: "AI nemá prístup k vašim účtom ani peniazom — a to je dobre, chráni vás to." },
      { text: "prevziať zodpovednosť za vaše rozhodnutia", basket: "nevie", why: "Ak sa niečo pokazí, AI za to neručí. Zodpovednosť zostáva vždy na človeku." },
    ],
    note: "AI je ako navigácia v aute: dokáže vás skvele navigovať, ale volant držíte vy.",
  },
  {
    id: 5, part: 1, type: "match",
    title: "AI ako „druhý názor“ — vždy poruke",
    lead: "Pri dôležitých veciach sa hovorí: vypočujte si aj názor niekoho druhého. AI je taký druhý názor na počkanie — zadarmo a bez toho, aby ste niekoho obťažovali.",
    task: "Kliknite na situáciu <strong>vľavo</strong> a potom na políčko <strong>vpravo</strong>, ktoré k nej patrí. Ak sa trafíte, spojí ich čiara.",
    pairs: [
      { left: "Dostali ste podozrivý e-mail", right: "Rozoberie ho vetu po vete a ukáže varovné znaky.", why: "AI si prejde text a upozorní na časový nátlak, podozrivé odkazy či zvláštnu adresu odosielateľa." },
      { left: "Volala vám „banka“", right: "Vysvetlí, ako banky v takých situáciách naozaj postupujú.", why: "Dozviete sa, že banka nikdy nežiada PIN ani prevod na „bezpečný účet“ — a hneď viete, že šlo o podvod." },
      { left: "Ponúkajú vám výhodnú investíciu", right: "Upozorní na riziká a navrhne otázky, ktoré si položiť.", why: "AI vám pripraví zoznam otázok pre predajcu — napríklad na poplatky, licenciu a možnosť výberu peňazí." },
      { left: "Nerozumiete zmluve", right: "Vysvetlí obsah jednoduchým a zrozumiteľným jazykom.", why: "Z právnickej reči spraví ľudskú — a upozorní na pokuty či automatické predĺženie." },
    ],
    note: "Umelá inteligencia nie je neomylná. Pomôže vám premýšľať, no nenahrádza odborníka.",
  },
  // Poradie je zámerné: najprv ukážeme, ako ChatGPT vyzerá, a až potom, čo sa
  // v ňom robí. Kroky nižšie spomínajú „okienko na písanie“ aj „šípku“ — bez
  // obrázka pred sebou by senior nemal k čomu si ich priradiť.
  // Čísla id zostávajú pôvodné: admin zóna podľa nich prepisuje texty
  // jednotlivých obrazoviek, prečíslovanie by úpravy prilepilo na nesprávnu.
  {
    id: 7, part: 1, type: "hotspot",
    title: "Takto vyzerá ChatGPT v praxi",
    lead: "ChatGPT je najznámejšia aplikácia na prácu s umelou inteligenciou. Takto vyzerá na tablete — zoznámime sa s tromi miestami, ktoré budete používať najčastejšie.",
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
    id: 36, part: 1, type: "install",
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
    checksTitle: "Tri veci si overte, kým kliknete na „Inštalovať“",
    checks: [
      { title: "Vydavateľ musí byť OpenAI", text: "Je to napísané priamo pod názvom aplikácie. Toto je najspoľahlivejší znak — spoľahlivejší než logo, ktoré sa dá napodobniť." },
      { title: "Inštalácia je zadarmo", text: "Ak niečo pýta peniaze už za samotné stiahnutie, je to podvod. Pravé ChatGPT sa inštaluje bezplatne." },
      { title: "Len z Google Play alebo App Store", text: "Nikdy nie z odkazu v SMS, e-maile ani z reklamy. Aj keby odkaz vyzeral akokoľvek dôveryhodne." },
    ],
    plansTitle: "Zadarmo verzus platené — jednoducho",
    plans: [
      { tone: "free", title: "Základná verzia — zadarmo", text: "Na všetko, čo robíme v tomto kurze, úplne stačí. Môžete sa pýtať, dať si vysvetliť správu aj posúdiť podozrivý e-mail. Nič platiť nemusíte." },
      { tone: "paid", title: "Platená verzia — nepotrebujete ju", text: "Stojí okolo 20 € mesačne a dáva rýchlejšie odpovede a novšie funkcie. Pre naše účely nie je potrebná." },
    ],
    warning: "Predplatné sa platí jedine priamo v aplikácii alebo na chatgpt.com. Ak vám niekto ponúka „predplatné ChatGPT“ e-mailom, cez SMS alebo v reklame na sociálnej sieti, je to podvod — presne ten typ, aký sme si ukazovali.",
    note: "Pri registrácii vás ChatGPT požiada o e-mailovú adresu — to je v poriadku a bezpečné. Heslo si však vymyslite nové, nikdy nepoužívajte to isté, aké máte do banky alebo do e-mailu.",
  },
  {
    id: 6, part: 1, type: "sequence",
    title: "Začíname s ChatGPT — krok za krokom",
    lead: "Obrazovku už poznáte. Teraz si prejdime, čo na nej urobíte — píše sa s ňou rovnako ako SMS správa.",
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
    id: 8, part: 1, type: "choice",
    title: "Ako sa správne pýtať",
    lead: "Otázke pre umelú inteligenciu sa hovorí „prompt“. Platí jednoduché pravidlo: čím presnejšia otázka, tým užitočnejšia odpoveď.",
    task: "Uvidíte <strong>tri dvojice otázok</strong>. Pri každej kliknite na tú, ktorá je podľa vás pre AI lepšia. Hneď vám vysvetlíme, prečo.",
    intro: "Je to ako u lekára: „bolí ma tu, od včera, po jedle“ je lepšie než len „je mi zle“.",
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
    lead: "Umelá inteligencia nerada hovorí „neviem“. Keď odpoveď nepozná, občas si ju jednoducho vymyslí — a znie pritom veľmi presvedčivo. Hovorí sa tomu halucinácia.",
    task: "Prečítajte si <strong>štyri odpovede od AI</strong>. Pri každej kliknite, či jej pokojne <strong>uveríte</strong>, alebo si ju radšej <strong>overíte</strong> z druhého zdroja.",
    tip: "Pomôcka: konkrétne čísla, dátumy a paragrafy si overujeme. Všeobecné rady na opatrnosť sú bezpečné.",
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
    lead: "Overovanie nie je prejav nedôvery — je to obyčajný zdravý rozum, rovnaký, aký by ste použili pri rade od susedy.",
    task: "Kliknite postupne na <strong>všetky tri kľúče</strong>. Za každým sa skrýva jedno pravidlo, ako si odpoveď AI overiť.",
    layout: "keys",
    cells: [
      { title: "Overte z druhého zdroja", text: "Čísla, dátumy či telefónne čísla skontrolujte na oficiálnej stránke banky alebo úradu." },
      { title: "Spýtajte sa na zdroj", text: "„Odkiaľ to vieš? Kde si to môžem overiť?“ Ak AI zdroj neuvedie, buďte opatrní." },
      { title: "Pri peniazoch dvojitá kontrola", text: "Nikdy nerobte finančné rozhodnutie len na základe odpovede AI. AI radí, človek rozhoduje." },
    ],
    note: "Novšie verzie AI halucinujú menej často než staršie, no úplne sa toho zbaviť zatiaľ nepodarilo.",
  },
  {
    id: 11, part: 2, type: "quickfire", stamp: true,
    title: "Bleskovka č. 1",
    lead: "Zopakujme si, čo sme sa doteraz naučili o umelej inteligencii.",
    task: "Tri rýchle otázky. Pri každej kliknite <strong>Áno</strong> alebo <strong>Nie</strong> — hneď sa dozviete, či ste odpovedali správne, aj prečo.",
    tips: [
      "AI je pomocník: vysvetľuje, zhŕňa a upozorňuje na riziká.",
      "AI nevidí do vašich účtov a nič v nich nemôže zmeniť.",
      "Pri dôležitých faktoch platí — najprv overiť, potom konať.",
    ],
    questions: [
      { short: "Vidí AI do vášho bankového účtu?", text: "Vidí umelá inteligencia do vášho bankového účtu?", answer: false, why: "Nie. AI nemá prístup k žiadnym vašim účtom ani súkromným údajom, pokiaľ jej ich sami nenapíšete. A práve preto jej ich nikdy nepíšeme." },
      { short: "Dá sa v ChatGPT niečo nenávratne pokaziť?", text: "Dá sa v ChatGPT niečo nenávratne pokaziť?", answer: false, why: "Nie. V ChatGPT sa nedá nič nenávratne zmazať ani pokaziť — pokojne skúšajte, čo vás zaujíma. Nič vo vašom mobile ani účte to nezmení." },
      { short: "Môže sa AI niekedy pomýliť?", text: "Môže sa AI niekedy pomýliť?", answer: true, why: "Áno. AI sa občas mýli a tvári sa pritom presvedčivo — preto dôležité informácie vždy overte aj z druhého zdroja." },
    ],
  },

  // ---------- ČASŤ 3 · Lovci podvodov ----------
  {
    id: 12, part: 3, type: "match",
    title: "Slovníček pojmov",
    lead: "Skôr než sa pustíme do skutočných podvodov, pomenujme si ich. Všetky tri majú spoločné jedno — chcú od vás vylákať údaje alebo peniaze.",
    task: "Kliknite na <strong>pojem vľavo</strong> a potom na <strong>vysvetlenie vpravo</strong>, ktoré k nemu patrí.",
    pairs: [
      { left: "Phishing (čítaj „fišing“)", right: "Podvodný e-mail, ktorý sa tvári ako správa od banky a chce vylákať vaše údaje.", why: "Phishing chodí e-mailom. Slovo vzniklo z anglického „fishing“ — rybolov, lebo podvodníci „lovia“ vaše údaje." },
      { left: "Vishing (podvod telefonátom)", right: "Volajúci sa vydáva za pracovníka banky, políciu — alebo za vnuka v núdzi.", why: "Vishing prebieha po telefóne. Písmeno „v“ je z anglického „voice“ — hlas." },
      { left: "Smishing (podvod cez SMS)", right: "Podvod cez SMS správu, napríklad falošná správa o doručení balíka.", why: "Smishing chodí ako SMS. Najčastejšie ide o „nedoručený balík“ s malým poplatkom." },
    ],
    note: "Bez ohľadu na to, ktorý z nich vás zastihne, obrana je vždy rovnaká: spomaliť, neklikať a overiť si to.",
  },
  {
    id: 13, part: 3, type: "spot", medium: "email",
    title: "Podozrivý e-mail „z banky“",
    lead: "Takýto e-mail príde tisíckam ľudí denne. Naučme sa v ňom nájsť varovné znaky — najprv s nápovedou.",
    task: "V e-maile nižšie sú <strong>3 podozrivé časti oranžovo podčiarknuté</strong>. Kliknite postupne na každú z nich — hneď vám vysvetlíme, prečo je varovným znakom.",
    message: {
      from: "bezpecnost@banka-info.com",
      subject: "Upozornenie na váš účet",
      body: "Vážený klient, [[Váš účet bude z bezpečnostných dôvodov do 24 hodín ZABLOKOVANÝ.]] Kliknite na odkaz a [[potvrďte svoje údaje: www.vasa-bankaa-overenie.com]] Ak tak neurobíte [[okamžite]], účet zostane trvalo zablokovaný.",
    },
    clues: [
      "Vyhrážanie časom — „do 24 hodín“ má vyvolať paniku, aby ste nestihli premýšľať.",
      "Žiadosť o údaje cez odkaz — banka od vás nikdy nepýta prihlásenie cez odkaz v e-maile. Všimnite si aj preklep v adrese: „bankaa“.",
      "Slovo „okamžite“ — časový nátlak sa opakuje, aby ste konali skôr, než sa poradíte.",
    ],
    footer: "Nič neklikajte, nesťahujte ani neodpisujte. E-mail prepíšte alebo odfoťte do AI a opýtajte sa: „Je to podvod? Podľa čoho to spoznám?“",
  },
  {
    id: 14, part: 3, type: "revealgrid",
    title: "7 znakov podvodného e-mailu",
    lead: "Toto je vaša kontrolná tabuľka. Ak v správe nájdete čo i len jeden z týchto znakov, spozornite.",
    task: "Kliknite postupne na <strong>všetkých 7 políčok</strong> a prezrite si každý znak. Ďalej v kurze si ich už vyskúšate nájsť sami.",
    cells: [
      { title: "Výzva k rýchlemu konaniu", text: "„do 24 hodín“, „okamžite“, „posledná výzva“." },
      { title: "Strach", text: "„účet bude zablokovaný“, „hrozí vám pokuta“." },
      { title: "Odkaz na kliknutie", text: "„kliknite sem a prihláste sa“ — banky to od klientov nevyžadujú." },
      { title: "Chyby v texte", text: "Zlá slovenčina, chýbajúce mäkčene, čudné oslovenie." },
      { title: "Zvláštna adresa", text: "banka-sk@gmail.com, info@vub-overenie.net." },
      { title: "Žiadosť o údaje", text: "Heslo, PIN alebo číslo karty priamo v e-maile." },
      { title: "Všeobecné oslovenie", text: "„Vážený zákazník“ namiesto vášho mena." },
    ],
  },
  {
    id: 15, part: 3, type: "spot", medium: "email",
    title: "Skutočný príklad: e-mail „z banky“",
    lead: "Tento e-mail naozaj chodil klientom slovenskej banky. Vyskúšajme si na ňom, čo sme sa práve naučili.",
    task: "Nájdite <strong>4 varovné znaky</strong> — kliknite postupne na podčiarknuté časti textu. Všimnite si aj adresu odosielateľa hore, tá je tiež nezvyčajná.",
    message: {
      from: "no-reply-2247@livemail.co.uk",
      subject: "Overenie účtu",
      body: "[[Vážený zákazník,]] Váš účet bol [[dočasne zablokovaný]] z bezpečnostných dôvodov. Prosíme, [[okamžite dokončite overenie]] kliknutím na tlačidlo nižšie a prihláste sa svojimi údajmi. [[Tento e-mail bol vygenerovaný automaticky.]]",
    },
    clues: [
      "Všeobecné oslovenie „Vážený zákazník“ — skutočná banka pozná vaše meno a oslovila by vás ním.",
      "Strach a časový tlak — tvrdenie, že účet je „dočasne zablokovaný“.",
      "Naliehavá výzva „okamžite dokončite overenie“ — má vás donútiť konať bez rozmýšľania.",
      "Automaticky generovaný e-mail bez podpisu konkrétnej osoby — typické pre hromadné podvodné rozposielanie.",
    ],
    footer: "Adresa odosielateľa (no-reply-2247@livemail.co.uk) je dlhý nezmyselný reťazec a nekončí na doméne skutočnej banky. Presne takýto e-mail môžete odfotiť a poslať do AI s otázkou: „Je to podvod?“",
    evidenceImage: {
      src: "assets/course-media/evidence/vub-phishing-email.jpg",
      caption: "Skutočný podvodný e-mail, ktorý chodil klientom VÚB banky. Odosielateľ nie je banka, len sa za ňu vydáva.",
    },
  },
  {
    id: 16, part: 3, type: "spot", medium: "email",
    title: "Falošná „faktúra o náhrade“",
    lead: "Nie každý podvod straší. Niektorý vás naopak láka na peniaze — napríklad na nečakanú vratku. Práve sľub peňazí má oslabiť vašu pozornosť.",
    task: "Nájdite <strong>3 varovné znaky</strong>. Kliknite na podčiarknuté časti a všimnite si, ako podvodník spája sľub peňazí so žiadosťou o vaše údaje.",
    message: {
      from: "vratky@vszp-portal.net",
      subject: "Máte nárok na vrátenie 490 €",
      body: "Dobrý deň, na základe kontroly vám vznikol preplatok [[490 €]]. Pre vrátenie peňazí zadajte číslo vašej platobnej karty (carte bancaire) [[nižšie]]. Sumu vám pripíšeme do 24 hodín po [[potvrdení údajov karty]].",
    },
    clues: [
      "Nečakaná „vratka“ 490 € — sľub peňazí vás má nalákať, aby ste pokračovali bez overenia. Takúto vratku si vždy overte priamo u inštitúcie.",
      "Zvláštny jazyk — v slovenskom texte sa zrazu objaví francúzske „carte bancaire“. Takáto chyba môže naznačovať strojovo preloženú podvodnú správu.",
      "Žiadosť o údaje z karty — zdravotná poisťovňa ich na vrátenie preplatku cez e-mail nepotrebuje. Údaje z karty do takéhoto formulára nezadávajte.",
    ],
    footer: "Chcete si overiť, či máte preplatok? Kontaktujte poisťovňu cez jej oficiálnu webovú stránku, aplikáciu alebo známe telefónne číslo — nie cez údaje z podozrivej správy.",
    evidenceImage: {
      src: "assets/course-media/evidence/vszp-fake-faktura.jpg",
      caption: "Ukážka podvodnej správy vydávajúcej sa za zdravotnú poisťovňu. Sľubuje vratku peňazí a zároveň žiada údaje z platobnej karty.",
    },
  },
  {
    id: 17, part: 3, type: "spot", medium: "email",
    title: "„Váš balík čaká na potvrdenie platby“",
    lead: "Ide o veľmi častý typ podvodu. Funguje aj preto, že veľa ľudí dnes naozaj čaká balík alebo zásielku.",
    task: "Nájdite <strong>4 varovné znaky</strong>. Kliknite na podčiarknuté časti a všimnite si najmä, aká malá je požadovaná suma.",
    message: {
      from: "info@postask.br",
      subject: "Balík čaká na vyzdvihnutie",
      body: "Dobry den, Vas balik nebolo mozne dorucit. [[Pre jeho doručenie je potrebné uhradiť malý poplatok 3,59 €.]] [[Prosíme, aby ste zaplatili po prijatí tento správy]] do 12 hodín. [[Kliknite tu]] pre potvrdenie platby. [[Odosielateľ: postask.br]]",
    },
    clues: [
      "Malý poplatok 3,59 € pôsobí nevinne a nemusí vzbudiť podozrenie. Cieľom však môže byť dostať vás na falošnú platobnú stránku a získať údaje z karty.",
      "Chyby v slovenčine — napríklad „po prijatí tento správy“ a chýbajúce mäkčene. Nezvyčajný jazyk je jeden z varovných signálov.",
      "Tlačidlo „Kliknite tu“ vás môže zaviesť na falošnú platobnú stránku, ktorá sa podobá na skutočnú stránku prepravcu.",
      "Adresa odosielateľa končí na „.br“, čo je doména Brazílie. Slovenská pošta by oficiálnu správu neposielala z takejto adresy.",
    ],
    footer: "Naozaj čakáte balík? Stav zásielky si overte priamo v aplikácii alebo na oficiálnej stránke pošty či prepravcu — nie cez odkaz zo správy.",
    evidenceImage: {
      src: "assets/course-media/evidence/posta-phishing-email.jpg",
      caption: "Ukážka podvodného e-mailu vydávajúceho sa za Slovenskú poštu. Podozrivá adresa odosielateľa a malý poplatok patria medzi typické varovné znaky.",
    },
  },
  {
    id: 18, part: 3, type: "story", medium: "call",
    title: "Telefonát „z banky“",
    lead: "E-maily už viete preverovať. Teraz si vyskúšame telefonát, pri ktorom sa vás podvodník môže snažiť dostať pod časový tlak.",
    task: "Zvoní vám telefón z neznámeho čísla. Kliknite na zelené tlačidlo <strong>„Prijať“</strong> a potom sa rozhodnite, ako zareagujete — tak, ako by ste to urobili v skutočnosti.",
    flags: ["Neznáme číslo", "Naliehavosť", "Tlak na rýchle konanie"],
    safeTip: "Ak vám volajúci tvrdí, že musíte peniaze previesť na „bezpečný účet“, hovor ukončite. Banku potom kontaktujte sami cez číslo na karte, v aplikácii alebo na jej oficiálnom webe.",
    start: "a",
    nodes: {
      a: {
        speaker: "Neznáme číslo",
        text: "„Dobrý deň, tu bezpečnostné oddelenie vašej banky. Váš účet bol práve napadnutý hackermi! Musíme okamžite previesť vaše peniaze na bezpečný účet. Nadiktujem vám číslo…“",
        choiceHint: "Čo teraz urobíte? Vyberte jednu z možností.",
        choices: [
          { text: "Nadiktujem údaje a urobím prevod, aby účet ochránili.", to: "bad" },
          { text: "Hovor ukončím a banku kontaktujem sám cez oficiálne číslo.", to: "good" },
        ],
      },
      bad: {
        end: "bad",
        text: "Takýto postup je presne to, čo podvodník potrebuje. Banka vás nebude žiadať, aby ste svoje peniaze „zachránili“ prevodom na účet, ktorý vám nadiktuje volajúci. Peniaze by mohli skončiť u podvodníka a ich získanie späť môže byť veľmi ťažké.",
      },
      good: {
        end: "good",
        text: "Správne! Hovor pokojne ukončite a banku kontaktujte sami. Aj číslo zobrazené na displeji sa dá sfalšovať, preto použite číslo z karty, bankovej aplikácie alebo oficiálneho webu.",
      },
    },
  },
  {
    id: 19, part: 3, type: "story", medium: "sms",
    title: "„Babka, potrebujem peniaze“",
    lead: "Tento podvod využíva silné emócie a strach o blízkeho. Práve preto môže zaskočiť aj veľmi opatrného človeka.",
    task: "Prečítajte si SMS v telefóne <strong>vľavo</strong>. Potom <strong>vpravo</strong> vyberte, čo by ste v takejto situácii urobili.",
    flags: ["Neznáme číslo", "Naliehavosť", "Tajomstvo", "Tlak na rýchle konanie"],
    safeTip: "Peniaze neposielajte iba na základe SMS alebo správy. Najprv si situáciu overte — zavolajte blízkemu na číslo, ktoré už máte uložené.",
    start: "a",
    nodes: {
      a: {
        speaker: "Neznáme číslo (SMS)",
        text: "„Babka, mal som nehodu. Potrebujem súrne peniaze. Prosím, nikomu o tom nehovor.“",
        choiceHint: "Čo urobíte?",
        choices: [
          { text: "Hneď pošlem peniaze, veď je to naliehavé.", to: "bad" },
          { text: "Zavolám vnukovi na číslo, ktoré mám uložené.", to: "good" },
        ],
      },
      bad: {
        end: "bad",
        text: "Naliehavosť a prosba o mlčanlivosť sú veľmi silné varovné signály. Veta „nikomu o tom nehovor“ má zabrániť tomu, aby ste si príbeh overili u rodiny.",
      },
      good: {
        end: "good",
        text: "Správne! Zavolajte na číslo, ktoré máte uložené vy — nie na číslo zo správy. Pozor aj na hlasové správy: pomocou AI sa dnes dá hlas človeka napodobniť, preto samotný známy hlas nemusí byť dôkazom.",
      },
    },
  },
  {
    id: 20, part: 3, type: "sort",
    title: "Skutočná banka vs. podvodník",
    lead: "Videli ste podvodný e-mail aj telefonát. Zhrňme si, ktoré správanie je pre banku bežné a ktoré je typické pre podvodníkov.",
    task: "Kliknite na výrok a potom vyberte <strong>„Skutočná banka“</strong> alebo <strong>„Podvodník“</strong> podľa toho, ku komu podľa vás patrí.",
    baskets: [
      { id: "banka", label: "Skutočná banka", desc: "Dá vám priestor na overenie a nepýta heslo, celý PIN ani autorizačné kódy.", tone: "safe" },
      { id: "podvodnik", label: "Podvodník", desc: "Tlačí na rýchle konanie a žiada citlivé údaje alebo prevod peňazí.", tone: "danger" },
    ],
    items: [
      { text: "nikdy od vás nepýta heslo, celý PIN ani autorizačný kód zo SMS", basket: "banka", why: "Banka od vás nebude žiadať heslo, celý PIN ani autorizačný kód zo SMS. Tieto údaje nikomu neprezrádzajte." },
      { text: "dá vám priestor situáciu si overiť", basket: "banka", why: "Dôveryhodná inštitúcia vám umožní situáciu si overiť. Silný časový nátlak je varovný signál." },
      { text: "rešpektuje, keď hovor ukončíte a kontaktujete ju sami", basket: "banka", why: "Ak máte pochybnosti, je správne hovor ukončiť a banku kontaktovať cez jej oficiálny kanál." },
      { text: "nežiada vás o prevod peňazí na „bezpečný účet“, ktorý vám nadiktuje volajúci", basket: "banka", why: "Banka vás nebude žiadať, aby ste peniaze posielali na „bezpečný účet“, ktorý vám nadiktuje volajúci. Takáto požiadavka je typickým znakom podvodu." },
      { text: "pýta heslo, PIN alebo autorizačný kód zo SMS", basket: "podvodnik", why: "Ak si niekto pýta heslo, PIN alebo autorizačný kód zo SMS, je to veľmi silný znak podvodu. Takýto kód môže potvrdiť prihlásenie alebo platbu." },
      { text: "tvrdí, že musíte peniaze previesť okamžite", basket: "podvodnik", why: "Naliehavosť má obmedziť čas na premýšľanie. Keď vás niekto tlačí do okamžitého rozhodnutia, spomaľte a situáciu si overte." },
      { text: "vytvára silný časový tlak — „musíte konať hneď“", basket: "podvodnik", why: "Silný časový tlak je varovný signál. Zastavte sa, nič neposielajte a overte si, s kým naozaj komunikujete." },
      { text: "bráni vám hovor ukončiť alebo si situáciu overiť", basket: "podvodnik", why: "Podvodník nechce, aby ste si jeho príbeh overili. Preto vás môže odhovárať od ukončenia hovoru alebo od kontaktovania banky." },
    ],
    note: "Ak si nie ste istí, hovor ukončite a banku kontaktujte sami — cez číslo na karte, bankovú aplikáciu alebo oficiálny web.",
  },
  {
    id: 21, part: 3, type: "slider",
    title: "„Zázračná“ investičná ponuka",
    lead: "Podvodníci nevyužívajú iba strach. Často lákajú aj na rýchly a vysoký zisk. Pri ponukách, ktoré znejú až príliš dobre, sa oplatí spomaliť a všetko si overiť.",
    task: "Prečítajte si reklamu nižšie a vyberte jedno z <strong>troch tlačidiel</strong> podľa toho, ako rizikovo na vás ponuka pôsobí. Potom si vysvetlíme prečo.",
    adText: "„Investujte len 250 € a zarábajte 5 000 € mesačne! Garantovaný výnos bez rizika. Pridajte sa k tisíckam spokojných Slovákov. Ponuka platí len obmedzený čas!“",
    sliderQuestion: "Ako rizikovo na vás táto ponuka pôsobí?",
    riskLevels: [
      { label: "Bezpečné", tone: "safe", correct: false, why: "Táto ponuka obsahuje viacero veľmi silných varovných znakov. Sľubuje mimoriadne vysoký zisk z malej sumy, používa slovo „garantovaný“ a tvrdí, že je bez rizika. Takéto sľuby sú typické pre podvodné investičné ponuky." },
      { label: "Trochu rizikové", tone: "mid", correct: false, why: "Riziko je oveľa vyššie než „trochu“. Kombinácia vysokého garantovaného výnosu, údajnej nulovej straty a časového tlaku je veľmi podozrivá. Pri investovaní platí: vyšší možný výnos zvyčajne znamená aj vyššie riziko." },
      { label: "Veľmi rizikové", tone: "danger", correct: true, why: "Správne. Seriózna investícia vám nesľúbi mimoriadne vysoký garantovaný zisk bez rizika. Takúto ponuku neplaťte hneď a najprv si overte firmu aj podmienky." },
    ],
    checklist: [
      "Má spoločnosť oprávnenie na túto finančnú službu a dá sa overiť v registri NBS?",
      "Sú jasne uvedené podmienky investície, riziká a všetky poplatky?",
      "Ako a za akých podmienok môžem svoje peniaze vybrať?",
    ],
    checklistNote: "Ak na dôležité otázky nedostanete jasnú odpoveď, peniaze neposielajte. Pomôcť môže aj AI — napríklad otázkou: „Ponúkajú mi túto investíciu. Aké veci si mám pred rozhodnutím overiť?“ Odpoveď AI si potom skontrolujte v dôveryhodných zdrojoch.",
    note: "Vysoký „zaručený“ zisk bez rizika je silný varovný signál. Oprávnenie finančnej firmy si overte v registri na nbs.sk.",
    evidenceImage: {
      src: "assets/course-media/evidence/investicny-podvod-instagram.jpg",
      caption: "Ukážka investičnej reklamy, ktorá zneužíva známe meno alebo značku a láka na nereálne vysoký výnos.",
    },
  },
  {
    id: 22, part: 3, type: "revealgrid",
    title: "Ako si overiť firmu skôr, než jej dáte peniaze",
    lead: "Predtým, než pošlete peniaze alebo niečo podpíšete, venujte pár minút overeniu firmy. Tu sú tri jednoduché spôsoby.",
    task: "Kliknite postupne na <strong>všetky tri políčka</strong> a pozrite si, ako si môžete firmu preveriť.",
    cells: [
      { title: "Overte firmu na nbs.sk", text: "Na stránke Národnej banky Slovenska si môžete overiť, či má firma oprávnenie na finančnú službu, ktorú vám ponúka. Skontrolujte presný názov firmy a jej identifikačné údaje." },
      { title: "Pozrite si varovania NBS", text: "NBS zverejňuje aj upozornenia na rizikové alebo neoprávnené ponuky. Podvodníci pritom často zneužívajú názvy známych firiem, bánk alebo osobností." },
      { title: "Opýtajte sa AI na druhý názor", text: "Môžete napísať napríklad: „Ponúka mi investíciu firma XY. Na čo si mám dať pozor a ako si ju overím?“ AI vám pomôže pripraviť kontrolný zoznam, ale výsledok si vždy overte na oficiálnych stránkach." },
    ],
    doneLabel: "Hotovo — prezreli ste si všetky tri spôsoby overenia.",
    doneTitle: "Teraz už viete, ako si firmu preveriť.",
    doneText: "Nemusíte si všetko pamätať. Dôležité je vedieť, že pred odoslaním peňazí si môžete firmu jednoducho overiť.",
    note: "Seriózna firma by vám mala dať čas na rozmyslenie a umožniť, aby ste si jej údaje a ponuku nezávisle overili.",
  },
  {
    id: 23, part: 3, type: "spot", stamp: true, medium: "email",
    title: "Opakovanie: nájdite chyták",
    lead: "Na záver tejto časti si vyskúšate správu, ktorá spája dve taktiky naraz — strach aj sľub peňazí.",
    task: "Nájdite <strong>3 varovné znaky</strong>. Najprv si skúste sami tipnúť, ktoré časti sú podozrivé, a až potom na ne kliknite.",
    message: {
      from: "podpora@banka-sk24.info",
      subject: "URGENTNÉ: Váš účet a výhra",
      body: "Vážený zákazník, [[váš účet bude do 2 hodín zablokovaný]], pokiaľ [[nepotvrdíte údaje kliknutím na odkaz]]. Zároveň vám oznamujeme, že ste vyžrebovaný a získavate [[500 € — stačí zaslať údaje o karte]].",
    },
    clues: [
      "Krátky časový limit „do 2 hodín“ má vyvolať stres a prinútiť vás konať skôr, než si správu overíte.",
      "Odkaz na „potvrdenie údajov“ je typický znak phishingu. Do internetbankingu sa prihlasujte iba cez oficiálnu aplikáciu alebo adresu, ktorú poznáte.",
      "Sľub výhry výmenou za údaje z karty je ďalší silný varovný znak. Podvodník tu spája strach so sľubom peňazí.",
    ],
    footer: "Výborne. Už viete rozpoznať podozrivý e-mail, telefonát aj SMS. Ďalej sa pozrieme na hoaxy, dezinformácie a obrázky vytvorené umelou inteligenciou.",
  },

  // ---------- ČASŤ 4 · Hoaxy, fotky, zmluvy ----------
  {
    // Slová „hoax“, „poplašná správa“ a „dezinformácia“ sa doteraz v tejto
    // časti používali skôr, než ich kurz vysvetlil — vysvetlené boli len
    // v slovníčku v Cvičeniach, ktoré si účastník otvorí až po Lekciách.
    id: 37, part: 4, type: "revealgrid",
    title: "Hoax, dezinformácia, podvod — v čom sa líšia",
    lead: "V tejto časti budeme často hovoriť o hoaxoch a dezinformáciách. Sú to slová, ktoré počuť aj v správach, a je dobré vedieť, čo za nimi je. Odlíšiť ich pritom pomôže jediná otázka: čo od vás tá správa chce?",
    task: "Kliknite postupne na <strong>všetky tri políčka</strong>. Pri každom nájdete jednoduché vysvetlenie aj príklad, aký ste už mohli vidieť.",
    cells: [
      { title: "Poplašná správa (hoax)", text: "Vymyslená správa, ktorá straší a tlačí na vás, aby ste ju poslali ďalej — „zdieľajte, kým to nezmažú“. Nechce od vás peniaze, chce vaše rozposlanie. Napríklad: „EÚ od budúceho roka zakáže hotovosť.“ Slovo hoax (číta sa „houks“) je len anglický názov pre poplašnú správu — je to teda to isté." },
      { title: "Dezinformácia", text: "Nepravda, ktorá sa tvári ako spravodajstvo — má logo, dátum aj vážny tón. Nechce vás vystrašiť na jeden deň, chce postupne zmeniť váš názor na nejakú tému. Napríklad článok, ktorý vyzerá ako z novín, ale redakcia zaň nikdy neručila." },
      { title: "Podvodná správa (phishing)", text: "To, čo už poznáte z tretej časti: falošná správa „od banky“, pošty alebo úradu. Tá nechce vaše zdieľanie ani váš názor — chce vaše peniaze alebo prihlasovacie údaje. Preto v nej vždy nájdete odkaz na kliknutie alebo žiadosť o platbu." },
    ],
    doneLabel: "Hotovo — poznáte rozdiel medzi všetkými tromi.",
    doneTitle: "Máte to najdôležitejšie.",
    doneText: "Nemusíte si tie názvy pamätať naspamäť. Keď vám niečo príde, stačí sa spýtať: chce to odo mňa zdieľanie, môj názor, alebo moje peniaze?",
    note: "Obrana je pri všetkých troch rovnaká: nešíriť ďalej, kým si to neoveríte. Stačí názov alebo tvrdenie zo správy prepísať do vyhľadávača alebo do AI a opýtať sa: „Je to pravda? Kto to napísal?“",
  },
  {
    id: 24, part: 4, type: "spot", medium: "social",
    title: "Poplašná správa zo sociálnej siete",
    lead: "Hoax často nechce vaše peniaze priamo. Snaží sa vyvolať silnú emóciu, aby ste správu bez overenia poslali ďalej.",
    task: "Nájdite <strong>3 varovné signály hoaxu</strong>. Kliknite na podčiarknuté časti príspevku.",
    message: {
      from: "zdieľané na sociálnej sieti",
      subject: "",
      body: "[[POZOR!]] EÚ od budúceho roka [[ZAKÁŽE hotovosť!]] Všetky peniaze budú len elektronické. [[Zdieľajte, kým to nezmažú!!!]]",
    },
    clues: [
      "VEĽKÉ PÍSMENÁ a množstvo výkričníkov majú upútať pozornosť a vyvolať emócie. Samy osebe nedokazujú, že je správa nepravdivá, ale sú dôvodom spozornieť.",
      "Chýba overiteľný zdroj. Dôveryhodné tvrdenie by malo byť možné skontrolovať na oficiálnej stránke alebo vo viacerých spoľahlivých médiách.",
      "Výzva „zdieľajte, kým to nezmažú“ vytvára tlak na okamžité šírenie. Namiesto zdieľania sa najprv zastavte a informáciu si overte.",
    ],
    footer: "Pravdu si overujte na oficiálnych stránkach, napríklad nbs.sk, slov-lex.sk alebo stránkach Polície SR, a porovnajte ju aj s dôveryhodnými médiami.",
  },
  {
    id: 25, part: 4, type: "match",
    title: "Skutočné príklady poplašných správ",
    lead: "Pozrieme sa na dva príklady hoaxov, ktoré sa šírili medzi ľuďmi. Jeden vyvolával strach, druhý obsahoval nebezpečnú zdravotnú radu.",
    task: "Kliknite na <strong>názov správy vľavo</strong> a potom na <strong>vysvetlenie vpravo</strong>, prečo môže byť nebezpečná.",
    pairs: [
      { left: "„Tanky na Záhorí“", right: "VEĽKÉ PÍSMENÁ, výkričníky a výzva „ZDIEĽAJTE!!“ tlačia na emócie a rýchle šírenie bez overenia.", why: "Správa šírila strach bez spoľahlivého zdroja. Namiesto ďalšieho zdieľania bolo potrebné overiť ju na oficiálnych stránkach." },
      { left: "„Kašľaním proti infarktu“", right: "Nebezpečná zdravotná rada — pri podozrení na infarkt volajte čo najskôr 155 alebo 112.", why: "Zdravotné hoaxy môžu byť obzvlášť nebezpečné, pretože môžu oddialiť správnu pomoc. Pri príznakoch infarktu neexperimentujte s internetovými radami — volajte 155 alebo 112." },
    ],
    note: "Veľa výkričníkov a silných emócií nie je dôkazom klamstva, ale je to signál, že máte spomaliť. Pred zdieľaním si správu overte.",
    gallery: [
      { src: "assets/course-media/evidence/hoax-tanky-facebook.jpg", caption: "„Tanky na Záhorí“ — príklad poplašnej správy zo sociálnej siete, ktorá bola následne označená a vysvetlená ako hoax." },
      { src: "assets/course-media/evidence/infarkt-hoax-text.jpg", caption: "„Kašľaním proti infarktu“ — príklad nebezpečnej zdravotnej dezinformácie." },
    ],
  },
  {
    id: 26, part: 4, type: "reveal",
    title: "Keď dezinformácia vyzerá ako spravodajstvo",
    lead: "Niektoré dezinformácie vyzerajú ako bežný spravodajský článok — majú logo, autora aj odkaz na údajnú štúdiu. Preto sa oplatí pozrieť nielen na vzhľad, ale najmä na zdroje.",
    task: "Kliknite postupne na <strong>všetky tri kľúče</strong>. Za každým sa skrýva jedna otázka, ktorá vám pomôže článok preveriť.",
    layout: "keys",
    cells: [
      { title: "Kde je pôvodný zdroj?", text: "Kliknite na uvedený zdroj a skúste sa dostať až k pôvodnej štúdii alebo oficiálnemu dokumentu. Dôveryhodný článok by mal umožniť tvrdenia overiť." },
      { title: "Na akú emóciu článok hrá?", text: "Strach a hnev nás často nútia reagovať rýchlo. Ak vo vás článok vyvolá silnú emóciu, berte to ako signál: nezdieľať hneď, ale najprv overiť." },
      { title: "Nechajte si pomôcť AI", text: "Môžete sa opýtať napríklad: „Je pravda, že infrazvuk z veterných turbín spôsobuje srdcové choroby? Uveď dôveryhodné zdroje, kde si to môžem overiť.“ Zdroje si potom otvorte a skontrolujte." },
    ],
    note: "Dôležité tvrdenie si skúste potvrdiť vo viacerých nezávislých dôveryhodných zdrojoch. Ak ho nachádzate iba na jednom neznámom webe, buďte opatrní.",
    evidenceImage: {
      src: "assets/course-media/evidence/epoch-times-dezinformacia.jpg",
      caption: "Príklad príspevku o veterných turbínach, ktorý pôsobí ako spravodajstvo, no tvrdenia v ňom treba porovnať s pôvodnou štúdiou a ďalšími dôveryhodnými zdrojmi.",
    },
  },
  {
    // Skutočný článok z augusta 2025. Čísla nižšie sú overené priamo
    // v pôvodnej metaanalýze (BMC Gastroenterology, PMC12337427), nie
    // prevzaté z článku, ktorý ich prekrúca.
    id: 38, part: 4, type: "reveal",
    title: "Nadpis sľubuje zázrak. Čo hovorí štúdia?",
    lead: "Na sociálnej sieti vidíme väčšinou len nadpis a obrázok. Článok otvorí málokto — a predsa nám nadpis zostane v hlave ako informácia. Práve na tom je tento typ článkov postavený.",
    task: "Kliknite postupne na <strong>všetkých päť kľúčov</strong>. Za prvými štyrmi je vždy jeden rozdiel medzi tým, čo sľubuje nadpis, a tým, čo štúdia naozaj zistila. Posledný ukazuje, ako si to overiť sami.",
    layout: "keys",
    cells: [
      { title: "Nadpis tvrdí niečo, čo v štúdii nie je", text: "Nadpis hovorí, že brokolica poráža rakovinu lepšie než operácia, chemoterapia a ožarovanie dokopy. Štúdia, na ktorú sa článok odvoláva, nič také neskúmala a ani skúmať nemohla — nebol v nej jediný pacient, ktorý by dostával brokolicu namiesto liečby." },
      { title: "Predchádzať nie je to isté ako liečiť", text: "Vedci sledovali, či ľudia, ktorí jedia viac kapustovitej zeleniny, ochorejú na rakovinu hrubého čreva menej často. To je otázka prevencie, teda ako ochoreniu predísť. Článok z toho urobil tvrdenie o liečbe človeka, ktorý už chorý je. To je úplne iná vec." },
      { title: "Súvislosť nie je príčina", text: "Štúdia našla asi o pätinu nižší výskyt ochorenia u ľudí, ktorí jedia viac tejto zeleniny. Lenže takí ľudia sa zvyčajne aj inak stravujú, menej fajčia a viac sa hýbu — a to sa od zeleniny nedá oddeliť. Keď vedci výsledok očistili, prínos sa zmenšil natoľko, že doň spadla aj možnosť, že žiadny nie je." },
      { title: "Kto to napísal a čo z toho má", text: "Pod článkom nie je meno autora, len slovo „redakcia“. Na tej istej stránke sa predávajú výživové doplnky a nájdete tam aj rady typu, že kremelina „zoškrabe lepok z hrubého čreva“. Keď niekto o zdraví píše a zároveň naň predáva prípravky, čítajte ho ako reklamu, nie ako správu." },
      { title: "Ako si to overiť cez ChatGPT", text: "Nadpis skopírujte alebo odfoťte a napíšte AI presne toto: „Našiel som článok s nadpisom ‚Brokolica poráža rakovinu lepšie než operácia a chemoterapia‘. Je to pravda? Čo tá štúdia naozaj skúmala — liečbu chorých, alebo riziko, že človek ochorie? Odpovedz jednoducho a uveď zdroje, kde si to môžem overiť.“ Kľúčová je posledná veta: pýtajte si zdroje a potom si ich otvorte. Aj AI sa mýli — no na otázku „skúmala tá štúdia liečbu, alebo prevenciu?“ vám odpovie za pár sekúnd a presne to je ten rozdiel, na ktorom článok stojí. Pri zdraví je posledné slovo vždy lekárovo, nie AI." },
    ],
    doneText: "Všimnite si, že sme článok nemuseli vyvracať. Stačilo porovnať nadpis s tým, čo štúdia naozaj skúmala.",
    note: "Zelenina je zdravá a jesť brokolicu má zmysel — o tom spor nie je. Nebezpečné je to, čo si z takého nadpisu odnesie človek, ktorý má v rodine niekoho chorého: že stačí zelenina a s liečbou sa dá počkať. Odkladanie onkologickej liečby stojí životy. Pri zdraví preto platí dvojnásobne: nadpis nie je informácia, kým si ju nepotvrdí lekár.",
    evidenceImage: {
      src: "assets/course-media/evidence/brokolica-clickbait.jpg",
      caption: "Skutočný článok zo slovenskej stránky, august 2025. Všimnite si, že namiesto mena autora je uvedená len „redakcia“ — a pod článkom už čaká 31 komentárov ľudí, ktorí ho zdieľali ďalej.",
    },
  },
  {
    // Skutočný článok z roku 2017, ktorý sa šíri dodnes. Dávka žiarenia je
    // overená v American Cancer Society (0,4 mSv za mamografiu oboch prsníkov);
    // prepočet 1 rad = 10 mSv je bežná fyzikálna premena.
    id: 39, part: 4, type: "reveal",
    title: "Keď sa z pravdivých faktov poskladá nepravda",
    lead: "Tento článok z roku 2017 tvrdí, že mamografia môže spôsobovať rakovinu. Ľudia ho zdieľajú dodnes. A práve preto je zaujímavý: mnohé fakty v ňom sú pravdivé. Problém je v tom, aké závery z nich autor vyvodzuje.",
    task: "Kliknite postupne na <strong>všetkých šesť bodov</strong> a pozrite sa, ako vzniká zavádzajúca správa.",
    layout: "keys",
    cells: [
      { title: "Začína pravdou — a preto mu veríme", text: "Mamografia naozaj používa ionizujúce žiarenie. Žiarenie môže poškodzovať bunky a mamografia má aj svoje nevýhody. Keď článok začne pravdivými faktmi, ľahšie uveríme aj tomu, čo príde potom." },
      { title: "Skok, ktorý si nemusíme všimnúť", text: "Medzi vyšetrovanými ženami sa našlo viac nádorov. Autor naznačuje: mamografia ich spôsobila. Lenže kto sa vyšetruje, u toho sa aj viac nájde. Vyšetrenie nádor nevytvorí — môže ho odhaliť." },
      { title: "Číslo, ktoré nesedí", text: "Článok uvádza dávku približne 1 rad, teda 10 mSv. Bežná mamografia oboch prsníkov predstavuje približne 0,4 mSv — asi 25-krát menej. Je to približne toľko prirodzeného žiarenia, koľko dostaneme za jeden až dva mesiace života." },
      { title: "Hrozivé tvrdenie bez dôkazu", text: "Podľa článku môže stlačenie prsníka vytlačiť nádorové bunky do krvi a rozšíriť rakovinu. Vedci to skúmali: u 24 pacientok porovnali krv pred mamografiou a po nej. Nárast nádorových buniek nezistili." },
      { title: "„Čo vám lekár nepovie“", text: "Znie to, akoby niekto riziká mamografie tajil. V skutočnosti odborné zdroje otvorene hovoria o falošne pozitívnych výsledkoch, zbytočných biopsiách, nadmernej diagnostike aj malej dávke žiarenia. Pocit „toto pred vami zatajujú“ je častý spôsob, ako nás článok presviedča." },
      { title: "Overte si to pomocou AI", text: "Skúste sa ChatGPT opýtať: „Aké sú skutočné riziká mamografie podľa odborných zdrojov? Aká je dávka žiarenia pri jednom vyšetrení? Uveď zdroje.“ Potom si zdroje otvorte a skontrolujte. AI používajte ako pomocníka pri overovaní, nie ako jediný zdroj zdravotných informácií." },
    ],
    compare: {
      title: "Čo tvrdí článok a čo hovoria fakty",
      rows: [
        { claim: "Ionizujúce žiarenie môže poškodiť bunky.", verdict: "true", fact: "Platí. Preto sa dávky držia čo najnižšie." },
        { claim: "Mamografický skríning môže viesť aj k nadmernej diagnostike.", verdict: "true", fact: "Platí a odborné zdroje o tom otvorene píšu." },
        { claim: "Jedna mamografia znamená približne 1 rad žiarenia.", verdict: "false", fact: "Bežne ide približne o 0,4 mSv, nie 10 mSv." },
        { claim: "Viac nádorov medzi vyšetrovanými ženami dokazuje, že ich spôsobila mamografia.", verdict: "misleading", fact: "Viac vyšetrujeme = viac nádorov odhalíme." },
        { claim: "Stlačenie prsníka pri mamografii rozšíri rakovinu po tele.", verdict: "unconfirmed", fact: "Dostupné klinické merania to nepotvrdili." },
        { claim: "Lekári riziká mamografie zatajujú.", verdict: "misleading", fact: "Odborné zdroje o nich verejne informujú." },
      ],
    },
    doneText: "Nemuseli sme poprieť ani jeden vedecký fakt. Stačilo pozrieť sa, čo z nich autor vyvodil.",
    note: "Dezinformácia nemusí obsahovať vymyslené fakty. Niekedy stačí poskladať pravdivé fakty tak, aby viedli k nepravdivému záveru. Pri zdravotných rozhodnutiach preto informácie overujte z dôveryhodných zdrojov a o vyšetrení sa poraďte s lekárom.",
    evidenceImage: {
      src: "assets/course-media/evidence/mamografia-clickbait.jpg",
      caption: "Skutočný článok z roku 2017. Meno stránky sme zámerne prekryli — poučný je nadpis a číslo pri tlačidle zdieľania: vyše 580 ľudí ho poslalo ďalej a šíri sa aj po rokoch.",
    },
  },
  {
    id: 40, part: 4, type: "reveal",
    title: "Prečo takéto články vôbec vznikajú",
    lead: "Zostáva jedna otázka: prečo to niekto píše? Nie je za tým zlomyseľnosť ani náhoda. Vo väčšine prípadov je za tým jednoduchý dôvod — peniaze.",
    task: "Kliknite postupne na <strong>všetkých päť bodov</strong>. Keď pochopíte, ako sa na tom zarába, budete takéto články spoznávať oveľa ľahšie.",
    layout: "keys",
    cells: [
      { title: "Platí sa za kliknutia", text: "Na stránkach býva reklama a jej majiteľ dostáva zaplatené podľa toho, koľko ľudí ju uvidí. Čím viac návštevníkov, tým viac peňazí. A nič neprivedie ľudí spoľahlivejšie než strach alebo sľub zázraku — preto nadpisy vyzerajú tak, ako vyzerajú. Nudný pravdivý nadpis nezarobí." },
      { title: "Predávajú sa doplnky a zázračné prípravky", text: "Všimnite si, čo sa na tej istej stránke predáva. Článok o tom, že lekári niečo taja, je najlepšia príprava na ponuku prírodného prípravku hneď pod ním. Keď niekto píše o zdraví a zároveň naň predáva výrobky, čítajte ten článok ako reklamu." },
      { title: "Zdieľanie je pre nich reklama zadarmo", text: "Keď článok pošlete ďalej, urobíte pre autora prácu, za ktorú by inak platil. Preto sú v takých textoch výzvy typu „zdieľajte, kým to nezmažú“. Vaša dobrá vôľa varovať známych je súčasťou ich obchodného plánu." },
      { title: "Nedôvera sa dá speňažiť", text: "Vety ako „o čom vám lekár nepovie“ nemajú informovať. Majú vytvoriť vzťah: oni sú tí, čo vám povedia pravdu, a ostatní vám klamú. Kto tomu uverí, vracia sa na tú stránku znova a kupuje, čo mu ponúkne. Preto sa tieto články neútočia na fakty, ale na dôveru." },
      { title: "Čo s tým môžete urobiť vy", text: "Nezdieľať. To je celé — a je to viac, než sa zdá, lebo bez zdieľania sa takýto článok nikam nedostane. Ak vám ho niekto pošle, nemusíte sa hádať; stačí odpísať, že ste si to overili a nesedí to, a poslať odkaz na dôveryhodný zdroj. A keď si nie ste istý, opýtajte sa AI slovami: „Kto prevádzkuje túto stránku a predáva na nej niečo?“" },
    ],
    doneText: "Za väčšinou takýchto článkov nie je konšpirácia. Je za nimi obchod.",
    note: "Nemusíte poznať meno stránky ani jej majiteľa. Stačí si pri každom poplašnom článku položiť jedinú otázku: kto na tom zarobí, keď tomu uverím? Ak je odpoveď „ten, kto to napísal“, viete dosť.",
  },
  {
    id: 27, part: 4, type: "guess",
    title: "Skutočná fotografia, alebo AI?",
    lead: "Umelá inteligencia dnes dokáže vytvoriť obrázky, ktoré vyzerajú veľmi vierohodne. Takéto obrázky sa môžu objaviť v podvodných zbierkach, falošných reklamách aj príspevkoch so známymi osobnosťami.",
    task: "Uvidíte <strong>dve fotografie</strong>. Pri každej vyberte, či je podľa vás skutočná, alebo vytvorená umelou inteligenciou. Obrázok si môžete kliknutím zväčšiť.",
    rounds: [
      { image: "assets/course-media/evidence/ai-foto-seniori-prezentacia.jpg", answer: "ai", explain: "Tento obrázok vytvorila umelá inteligencia. Na prvý pohľad je príjemný a nič nekričí, že je vymyslený — a presne v tom je dnes problém. Keď sa pozriete pozorne: nápis na premietanom plátne má okraje ostrejšie, než by po premietaní boli, každý pri stole drží takmer rovnaký tablet, ruky sú v rovnakom držaní a celá scéna je nasvietená ako z reklamného katalógu, bez jediného tieňa navyše." },
      { image: "assets/course-media/evidence/real-foto-deti-na-schodoch.jpg", answer: "real", explain: "Toto je skutočná fotografia. Všimnite si drobnosti, ktoré si nikto nevymýšľa: odreté schody, tenký prameň vlasov mimo účesu, mierne pokrčené šaty, tiene na tvárach sediace so slnkom. Ani to však samo osebe nie je dôkaz — pri dôležitom obrázku vždy overujte aj to, odkiaľ pochádza." },
    ],
    checklist: [
      { title: "Ruky a prsty", text: "Nezvyčajný počet alebo tvar prstov môže byť stopou. Novšie AI však už ruky často vytvárajú správne, preto sa nespoliehajte iba na tento znak." },
      { title: "Tvár a detaily", text: "Všímajte si zvláštne oči, zuby, uši, okuliare alebo drobné detaily. Sú to len indície, nie spoľahlivý dôkaz." },
      { title: "Text na obrázku", text: "Nápisy môžu byť skomolené alebo nezmyselné. Aj v tomto sa však AI rýchlo zlepšuje." },
      { title: "Svetlo a tiene", text: "Skontrolujte, či svetlo a tiene dávajú zmysel a či predmety pôsobia, akoby boli v jednej scéne." },
      { title: "Pozadie a súvislosti", text: "Hľadajte nelogické alebo zdeformované predmety a potom si položte dôležitejšiu otázku: odkiaľ obrázok pochádza a dá sa jeho príbeh overiť?" },
    ],
    note: "Platí to aj pri videách — hovoríme im deepfake videá. Samotná fotografia alebo video už nemusia dokazovať, že sa udalosť naozaj stala. Dôležitý je aj zdroj a kontext.",
  },
  {
    id: 28, part: 4, type: "choice", stamp: true,
    title: "Zložitá zmluva? AI vám ju môže pomôcť vysvetliť",
    lead: "ChatGPT vám môže pomôcť preložiť zložitý text zmluvy do bežnej reči a upozorniť na dôležité body. Zmluvu však za vás neposúdi ani nenahrádza právnika.",
    task: "Prezrite si štyri kroky nižšie a potom si vyskúšajte, ktorá otázka prinesie užitočnejšiu odpoveď.",
    evidenceImage: {
      src: "assets/course-media/evidence/zmluva-elektrina.jpg",
      caption: "Príklad reálnej zmluvy o združenej dodávke elektriny. Meno dodávateľa aj všetky osobné údaje sme rozostreli.",
    },
    stepsTitle: "Ako na to — 4 kroky",
    steps: [
      { title: "Najprv skryte osobné údaje", text: "Prekryte rodné číslo, číslo účtu, podpis, adresu, zákaznícke číslo a ďalšie citlivé údaje — papierik, nálepka alebo prst pri fotení úplne stačia." },
      { title: "Až potom odfotografujte alebo nahrajte", text: "Nahrajte do ChatGPT fotografiu, PDF alebo snímku obrazovky — už bez citlivých údajov." },
      { title: "Pýtajte sa konkrétne", text: "Namiesto otázky „Je táto zmluva dobrá?“ sa pýtajte na konkrétne veci: poplatky, pokuty, dobu viazanosti, výpoveď, zmenu ceny alebo automatické predĺženie." },
      { title: "Overte dôležité rozhodnutia", text: "AI sa môže pomýliť. Pri dôležitom rozhodnutí si odpoveď porovnajte s originálom zmluvy alebo sa poraďte s odborníkom." },
    ],
    chooseLabel: "Ktorá otázka vám dá užitočnejšiu odpoveď?",
    rounds: [
      {
        weak: "Je táto zmluva dobrá?",
        good: "Vysvetli mi túto zmluvu jednoducho. Na čo si mám dať pozor? Aké sú v nej poplatky, pokuty, viazanosť a podmienky výpovede?",
        why: "Čím konkrétnejšia otázka, tým užitočnejšiu odpoveď vám AI môže dať. Jej odpoveď si však vždy porovnajte s pôvodným textom zmluvy.",
        weakVerdict: "Príliš všeobecná. „Dobrá“ je názor — AI netuší, podľa čoho ju má posúdiť, a odpovie tiež všeobecne.",
        goodVerdict: "Konkrétna. AI vie, čo má v zmluve hľadať, a odpoveď sa dá overiť v texte.",
        answerPreview: "Napríklad: „Zmluva je uzatvorená na 24 mesiacov. Pri predčasnom ukončení sa v článku 7 uvádza pokuta 150 €. Skontrolujte aj podmienky automatického predĺženia.“",
      },
    ],
    prompt: {
      title: "Príklad promptu",
      text: "Vysvetli mi túto zmluvu jednoduchou slovenčinou, akoby si ju vysvetľoval človeku, ktorý sa nevyzná v právnych pojmoch. Upozorni ma najmä na:\n– cenu a všetky poplatky,\n– pokuty a sankcie,\n– dobu viazanosti,\n– podmienky výpovede,\n– automatické predĺženie,\n– možnosť zmeny ceny.\nAk niečomu nerozumieš alebo to v dokumente nevidíš, povedz to a nevymýšľaj si.",
    },
    note: "AI vám môže zmluvu vysvetliť, ale nerozhoduje za vás. Dôležité údaje si vždy skontrolujte v origináli dokumentu.",
  },

  // ---------- ČASŤ 5 · Zlaté pravidlá a záver ----------
  {
    id: 29, part: 5, type: "sort",
    title: "Čo do AI radšej nezadávame",
    lead: "AI je užitočný pomocník, ale citlivé osobné a bankové údaje do chatu nepatria. Na vysvetlenie situácie ich väčšinou vôbec nepotrebuje.",
    task: "Kliknite na kartičku a potom ju zaraďte: <strong>Nezadávame</strong> (citlivý údaj), alebo <strong>Pokojne zadáme</strong> (otázka bez citlivých údajov).",
    tip: "Do AI opisujeme problém a pýtame sa na vysvetlenie. Heslá, bezpečnostné kódy a citlivé osobné údaje do nej nezadávame.",
    baskets: [
      { id: "trezor", label: "Toto do AI nezadávame", desc: "Heslá, PIN-y, autorizačné kódy, údaje z karty a neprekryté osobné doklady.", tone: "danger" },
      { id: "chat", label: "Toto pokojne zadáme", desc: "Všeobecné otázky, vysvetlenie pojmov a posúdenie obsahu po odstránení citlivých údajov.", tone: "safe" },
    ],
    sideNote: {
      title: "Zapamätajte si",
      items: [
        { tone: "good", text: "AI vám môže pomôcť vysvetliť text alebo upozorniť na možné riziká." },
        { tone: "warn", text: "Heslá, bezpečnostné kódy a citlivé osobné či bankové údaje do chatu nezadávajte." },
        { tone: "info", text: "Ak si nie ste istí, či je údaj potrebný, radšej ho odstráňte alebo prekryte. AI často dokáže poradiť aj bez neho." },
      ],
    },
    items: [
      { text: "heslo do internetbankingu", basket: "trezor", why: "Heslo do banky patrí iba do oficiálneho prihlasovania banky. AI ho na vysvetlenie situácie nepotrebuje." },
      { text: "číslo karty, PIN a CVV/CVC", basket: "trezor", why: "Údaje z platobnej karty môžu byť zneužité na platby. Do chatu ich preto nevpisujte ani ich neposielajte cudzej osobe." },
      { text: "rodné číslo a číslo dokladu", basket: "trezor", why: "Rodné číslo a údaje z dokladu patria medzi citlivé osobné údaje a môžu byť zneužité pri krádeži identity. Do AI ich na bežné vysvetlenie nezadávajte." },
      { text: "autorizačný SMS kód z banky", basket: "trezor", why: "Autorizačný kód môže potvrdiť prihlásenie alebo platbu. Nikomu ho nediktujte ani neposielajte — ani človeku, ktorý sa vydáva za pracovníka banky." },
      { text: "„budem 2 týždne preč, dom bude prázdny“", basket: "trezor", why: "Informáciu o tom, že bude váš dom dlhšie prázdny, nie je rozumné verejne zdieľať. Na radu od AI presný termín ani adresu nepotrebujete." },
      { text: "fotografia dokladu bez prekrytia", basket: "trezor", why: "Fotografia dokladu obsahuje množstvo citlivých údajov. Ak potrebujete vysvetliť časť dokumentu, citlivé údaje najprv prekryte alebo použite iba potrebný výsek." },
      { text: "„je tento e-mail podozrivý?“", basket: "chat", why: "Na takúto otázku vám AI môže pomôcť. Pred vložením e-mailu však odstráňte svoje meno, čísla účtov, odkazy s osobnými kódmi a ďalšie citlivé údaje." },
      { text: "„ako spoznám podvodný telefonát?“", basket: "chat", why: "Všeobecná otázka o bezpečnosti nevyžaduje vaše osobné údaje. AI vám môže vysvetliť typické varovné znaky." },
      { text: "časť zmluvy s prekrytými osobnými údajmi", basket: "chat", why: "To je bezpečnejší postup. AI zvyčajne potrebuje text, ktorému nerozumiete, nie vaše meno, rodné číslo ani podpis. Pri citlivých zmluvách zvážte vloženie iba potrebnej časti." },
      { text: "„vysvetli mi tento výraz jednoducho“", basket: "chat", why: "Takáto všeobecná otázka je vhodným použitím AI. Na vysvetlenie výrazu nemusíte uvádzať žiadne osobné údaje." },
    ],
  },
  {
    id: 30, part: 5, type: "rewrite",
    title: "Ako sa pýtať bezpečne",
    lead: "Už viete, ktoré údaje do AI nepatria. Teraz si ukážeme, ako položiť otázku tak, aby bola užitočná aj bez zbytočných osobných a bankových údajov.",
    task: "V otázke nižšie sú <strong>dva údaje</strong>, ktoré AI na posúdenie situácie nepotrebuje. Kliknite na každý z nich a vpravo sa vám postupne poskladá bezpečnejšia verzia otázky.",
    sentence: [
      { text: "Mám na účte", sensitive: false },
      { text: "12 400 €", sensitive: true, why: "Presnú sumu AI na posúdenie podozrivej požiadavky nepotrebuje. Stačí povedať, že vás niekto žiada poslať peniaze." },
      { text: "a mám ich poslať na účet", sensitive: false },
      { text: "SK44 0900 0000 0001 2345 6789", sensitive: true, why: "Ani konkrétny IBAN nie je na túto radu potrebný. Radšej opíšte situáciu bez údajov o účte." },
      { text: "— je to bezpečné?", sensitive: false },
    ],
    safeVersion: "Niekto ma žiada, aby som poslal peniaze na neznámy účet. Ako si môžem overiť, či nejde o podvod?",
    takeaway: "Opíšte situáciu, nie zbytočné osobné či bankové údaje. Na užitočnú radu ich AI väčšinou nepotrebuje.",
  },
  {
    id: 31, part: 5, type: "match",
    title: "Šesť zlatých pravidiel",
    lead: "Toto je jadro celého kurzu. Šesť jednoduchých pravidiel, ktoré vám pomôžu zastaviť sa skôr, než urobíte niečo rizikové.",
    task: "Kliknite na <strong>začiatok pravidla vľavo</strong> a potom na jeho <strong>pokračovanie vpravo</strong>.",
    pairs: [
      { left: "„Keď ma niekto naháňa,", right: "spomalím a najprv si to overím.“", why: "Časový tlak je častou taktikou podvodníkov. Keď vás niekto núti konať okamžite, zastavte sa a situáciu si overte." },
      { left: "„Heslo, PIN ani kód zo SMS", right: "nikomu neprezrádzam.“", why: "Heslo, celý PIN ani autorizačný kód zo SMS nediktujte po telefóne ani neposielajte správou. Ak si ich niekto pýta, spozornite." },
      { left: "„Ak mám pochybnosti,", right: "ukončím hovor a kontaktujem banku sám.“", why: "Ak sa volajúci vydáva za banku a niečo sa vám nezdá, hovor ukončite. Banku potom kontaktujte sami cez číslo na karte, aplikáciu alebo oficiálny web." },
      { left: "„Vysoký zisk bez rizika", right: "je silný varovný signál.“", why: "Seriózne investovanie vždy nesie určité riziko. Mimoriadne vysoký „garantovaný“ zisk bez rizika je veľmi podozrivý." },
      { left: "„Umelá inteligencia radí,", right: "rozhodnutie robí človek.“", why: "AI vám môže pomôcť situáciu pochopiť a pripraviť otázky. Konečné rozhodnutie — najmä pri peniazoch — však nerobte iba podľa jej odpovede." },
      { left: "„Silné emócie v správe?", right: "Najprv overím, až potom zdieľam.“", why: "Strach, hnev alebo naliehavosť nás môžu prinútiť reagovať bez rozmýšľania. Pri emotívnej správe spomaľte a overte si ju." },
    ],
    note: "Všetkých šesť pravidiel spája jedna myšlienka: <strong>zastaviť sa, overiť si situáciu a až potom konať.</strong>",
  },
  {
    id: 32, part: 5, type: "match",
    title: "Keď sa niečo stane",
    lead: "Aj opatrnému človeku sa môže stať, že naletí podvodu. Vtedy je najdôležitejšie konať rýchlo a kontaktovať správne miesto.",
    task: "Kliknite na <strong>situáciu vľavo</strong> a potom na <strong>správny kontakt vpravo</strong>.",
    pairs: [
      { left: "Podozrivý pohyb na účte alebo strata karty", right: "Vaša banka — kontakt z karty, aplikácie alebo oficiálneho webu.", why: "Banku kontaktujte čo najskôr. Môže zablokovať kartu, prístup alebo preveriť podozrivú transakciu. Čím skôr sa ozvete, tým viac možností môže mať na riešenie." },
      { left: "Poslali ste peniaze podvodníkovi alebo ste mu prezradili údaje", right: "Polícia SR — 158 alebo najbližšie oddelenie; pri tiesni volajte 112.", why: "Podvod oznámte polícii a uschovajte si správy, čísla účtov, telefónne čísla či potvrdenia o platbe. Tieto údaje môžu pomôcť pri vyšetrovaní." },
      { left: "Podozrivá investičná ponuka alebo finančná firma", right: "Národná banka Slovenska — informácie a registre na nbs.sk.", why: "Na nbs.sk si môžete overiť oprávnenie finančnej firmy a pozrieť upozornenia. Najlepšie je preveriť ponuku ešte pred odoslaním peňazí alebo podpisom." },
    ],
    note: "Ak ste naleteli, neodkladajte riešenie zo strachu alebo hanby. Podvodníci používajú premyslené manipulačné techniky — dôležité je čo najskôr kontaktovať banku a podľa situácie políciu.",
  },
  {
    id: 33, part: 5, type: "quickfire", stamp: true,
    title: "Záverečná bleskovka",
    lead: "Na záver vás čaká päť krátkych situácií. Overíte si na nich, čo ste si z kurzu odniesli.",
    task: "Pri každej otázke kliknite <strong>Áno</strong> alebo <strong>Nie</strong>. Hneď potom uvidíte vysvetlenie a môžete pokračovať.",
    tips: [
      "Všímajte si časový nátlak, strach, žiadosti o citlivé údaje a podozrivé odkazy.",
      "Keď vás niekto tlačí do rýchleho rozhodnutia, zastavte sa a informáciu si overte.",
      "Nemusíte si pamätať všetko naspamäť. Dôležité je spozornieť, keď sa objaví varovný signál.",
    ],
    questions: [
      { short: "E-mail vás naháňa časom a žiada kliknúť na odkaz", text: "E-mail vás naháňa časom a žiada kliknúť na odkaz — je to podozrivé?", answer: true, why: "Áno. Časový nátlak spolu s výzvou na kliknutie je dôvod spozornieť. Namiesto odkazu zo správy si banku alebo službu otvorte sami cez známu aplikáciu či oficiálnu adresu." },
      { short: "Volajúci „z banky“ od vás pýta PIN", text: "Človek, ktorý sa vydáva za pracovníka banky, od vás telefonicky pýta celý PIN — je to v poriadku?", answer: false, why: "Nie. Banka od vás nebude telefonicky žiadať celý PIN, heslo do internetbankingu ani autorizačný kód zo SMS. Ak sa to stane, hovor ukončite a banku kontaktujte sami." },
      { short: "Ponuka sľubuje garantovaný vysoký zisk bez rizika", text: "Ponuka sľubuje garantovaný vysoký zisk bez rizika — je to varovný signál?", answer: true, why: "Áno. Mimoriadne vysoký garantovaný zisk bez rizika je typický varovný signál. Pred investovaním si overte firmu, podmienky aj riziká." },
      { short: "Správa vyvoláva paniku a žiada okamžité zdieľanie", text: "Správa vyvoláva paniku a žiada, aby ste ju okamžite zdieľali ďalej — je to varovný signál?", answer: true, why: "Áno. Silné emócie a výzva na okamžité zdieľanie sú dôvodom spomaliť. Správu si najprv overte a až potom sa rozhodnite, či ju pošlete ďalej." },
      { short: "Overiť dôležitú informáciu vo viacerých zdrojoch", text: "Je správne overiť si dôležitú informáciu vo viacerých dôveryhodných zdrojoch?", answer: true, why: "Áno. Dôležité informácie je rozumné porovnať vo viacerých nezávislých dôveryhodných zdrojoch. Platí to aj pre odpovede od umelej inteligencie." },
    ],
  },
  {
    id: 34, part: 5, type: "printcard",
    title: "Váš papierik vedľa telefónu",
    lead: "Šesť najdôležitejších pravidiel na jednom mieste. Môžete si ich uložiť alebo vytlačiť a mať ich poruke pri telefóne či počítači.",
    task: "Prečítajte si všetkých šesť pravidiel a potom kliknite na tlačidlo <strong>„Stiahnuť ako obrázok“</strong> pod nimi.",
    downloadImage: "assets/course-media/sest-zlatych-pravidiel.jpg",
    rules: [
      "Keď ma niekto naháňa, spomalím a najprv si to overím.",
      "Heslo, PIN ani autorizačný kód zo SMS nikomu neprezrádzam.",
      "Ak mám pochybnosti, ukončím hovor a kontaktujem banku sám.",
      "Vysoký zisk bez rizika je silný varovný signál.",
      "Umelá inteligencia radí, rozhodnutie robí človek.",
      "Silné emócie? Najprv overím, až potom zdieľam.",
    ],
  },
  {
    id: 35, part: 5, type: "diploma",
    title: "Máte za sebou Lekcie!",
    lead: "Ďakujeme, že ste si našli čas. Už viete lepšie rozpoznať podozrivý e-mail, SMS či telefonát, overiť si finančnú ponuku a používať umelú inteligenciu bezpečnejšie. Toto však bol len jeden zo siedmich krokov kurzu. Pokračujte tlačidlom <strong>„Pokračovať na cvičenia“</strong> nižšie — čakajú vás Cvičenia, Zdroje a Záverečný kvíz, po ktorom dostanete certifikát.",
    quote: "Keď si nie ste istí, doprajte si chvíľu na overenie. Jedna minúta navyše môže zabrániť veľkej chybe.",
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
