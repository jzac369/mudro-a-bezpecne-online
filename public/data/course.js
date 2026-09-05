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
    body: "Čaká vás 35 krátkych zastavení rozdelených do 5 častí. Pri každom si niečo vyskúšate a hneď sa dozviete, či ste odpovedali správne — aj prečo. Nič sa nedá pokaziť a kedykoľvek sa môžete vrátiť tam, kde ste skončili.",
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
    lead: "Pozor — nie každý podvod straší. Tento naopak sľubuje peniaze, a práve tým je nebezpečný.",
    task: "Nájdite <strong>3 varovné znaky</strong>. Kliknite na podčiarknuté časti a všímajte si, ako podvodník mieša sľub peňazí so žiadosťou o údaje.",
    message: {
      from: "vratky@vszp-portal.net",
      subject: "Máte nárok na vrátenie 490 €",
      body: "Dobrý deň, na základe kontroly vám vznikol preplatok [[490 €]]. Pre vrátenie peňazí zadajte číslo vašej platobnej karty (carte bancaire) [[nižšie]]. Sumu vám pripíšeme do 24 hodín po [[potvrdení údajov karty]].",
    },
    clues: [
      "Nečakaná „vratka“ 490 € — sľub peňazí je návnada, nikto vám len tak neposiela stovky eur.",
      "Text je preložený strojovo — všimnite si francúzske „carte bancaire“, ktoré tam vôbec nepatrí.",
      "Žiada údaje o karte — poisťovňa vracia peniaze na účet, nikdy si nepýta kartu cez e-mail.",
    ],
    footer: "Ako si to overiť: zavolajte priamo poisťovni na oficiálne číslo z jej webovej stránky — nikdy nie na číslo uvedené v podozrivom e-maile.",
    evidenceImage: {
      src: "assets/course-media/evidence/vszp-fake-faktura.jpg",
      caption: "Skutočná falošná „faktúra o náhrade“ vydávajúca sa za zdravotnú poisťovňu. Žiadna poisťovňa takto peniaze nevracia.",
    },
  },
  {
    id: 17, part: 3, type: "spot", medium: "email",
    title: "„Váš balík čaká na potvrdenie platby“",
    lead: "Najrozšírenejší podvod na Slovensku. Funguje preto, že takmer každý dnes niečo očakáva poštou.",
    task: "Nájdite <strong>4 varovné znaky</strong>. Kliknite na podčiarknuté časti — všimnite si najmä, aká drobná je požadovaná suma.",
    message: {
      from: "info@postask.br",
      subject: "Balík čaká na vyzdvihnutie",
      body: "Dobry den, Vas balik nebolo mozne dorucit. [[Pre jeho doručenie je potrebné uhradiť malý poplatok 3,59 €.]] [[Prosíme, aby ste zaplatili po prijatí tento správy]] do 12 hodín. [[Kliknite tu]] pre potvrdenie platby. [[Odosielateľ: postask.br]]",
    },
    clues: [
      "Malý poplatok 3,59 € — drobná suma nevzbudí podozrenie. Podvodníkom však nejde o tie tri eurá, ale o údaje z vašej karty.",
      "Chyby v slovenčine — „aby ste zaplatili po prijatí tento správy“ a chýbajúce mäkčene v úvode.",
      "Tlačidlo „Kliknite tu“ vedie na falošnú platobnú stránku, ktorá vyzerá ako tá skutočná.",
      "Adresa odosielateľa končí na „.br“ — to je Brazília, nie slovenská pošta.",
    ],
    footer: "Čakáte naozaj balík? Sledovacie číslo si zadajte priamo na oficiálnej stránke pošty alebo prepravcu — nikdy nie cez odkaz zo správy.",
    evidenceImage: {
      src: "assets/course-media/evidence/posta-phishing-email.jpg",
      caption: "Skutočný podvodný e-mail vydávajúci sa za Slovenskú poštu. Adresa odosielateľa a drobný poplatok sú typickým vzorom tohto podvodu.",
    },
  },
  {
    id: 18, part: 3, type: "story", medium: "call",
    title: "Telefonát „z banky“",
    lead: "E-maily už rozoznáte. Teraz si vyskúšajme situáciu, ktorá prebieha naživo a nedá vám čas na rozmyslenie.",
    task: "Zvoní vám telefón od neznámeho čísla. Kliknite na zelené tlačidlo <strong>„Prijať“</strong> a potom sa rozhodnite, ako budete reagovať — presne tak, ako by ste to urobili naozaj.",
    flags: ["Neznáme číslo", "Naliehavosť", "Tlak na rýchle konanie"],
    safeTip: "Skutočná banka vám nikdy netelefonuje so žiadosťou o prevod peňazí na „bezpečný účet“. Ak máte pochybnosti, hovor ukončite a zavolajte si banke sami, na číslo zo zadnej strany karty.",
    start: "a",
    nodes: {
      a: {
        speaker: "Neznáme číslo",
        text: "„Dobrý deň, tu bezpečnostné oddelenie vašej banky. Váš účet bol práve napadnutý hackermi! Musíme okamžite previesť vaše peniaze na bezpečný účet. Nadiktujem vám číslo…“",
        choiceHint: "Čo teraz urobíte? Kliknite na jednu z možností.",
        choices: [
          { text: "Nadiktujem číslo účtu, nech to vyriešia.", to: "bad" },
          { text: "Hovor ukončím a zavolám banke sám, na číslo zo zadnej strany karty.", to: "good" },
        ],
      },
      bad: {
        end: "bad",
        text: "Toto je presne to, čo podvodník chce počuť. Skutočná banka nikdy nežiada prevod peňazí na „bezpečný účet“ — taký účet vôbec neexistuje. Peniaze by skončili u podvodníka a späť by sa už nedali získať.",
      },
      good: {
        end: "good",
        text: "Správne! Hovor pokojne ukončite a zavolajte si banke sami. Aj číslo na displeji sa dá napodobniť, preto voľte vždy číslo, ktoré poznáte vy — zo zadnej strany karty alebo z oficiálneho webu banky.",
      },
    },
  },
  {
    id: 19, part: 3, type: "story", medium: "sms",
    title: "„Babka, potrebujem peniaze“",
    lead: "Tento podvod cieli na to najsilnejšie, čo máte — na city k rodine. Preto funguje aj na opatrných ľudí.",
    task: "Prečítajte si SMS v telefóne <strong>vľavo</strong>. Potom <strong>vpravo</strong> kliknite na to, čo by ste v tejto situácii naozaj urobili.",
    flags: ["Neznáme číslo", "Naliehavosť", "Tajomstvo", "Tlak na rýchle konanie"],
    safeTip: "Peniaze nikdy neposielajte len podľa SMS správy. Najprv si to overte — zavolajte na číslo, ktoré máte uložené vy, nie na to, z ktorého vám niekto píše.",
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
        text: "Práve toto podvodníci chcú — naliehavosť a mlčanlivosť. Prosba „nikomu o tom nehovor“ je najsilnejší varovný znak: má zabrániť tomu, aby ste si to overili u rodiny.",
      },
      good: {
        end: "good",
        text: "Presne tak! Zavolajte na číslo, ktoré máte uložené vy — nikdy na to, z ktorého prišla správa. Pozor aj na hlas: AI dnes dokáže napodobniť hlas vášho blízkeho, takže ani povedomý hlas už nie je dôkaz.",
      },
    },
  },
  {
    id: 20, part: 3, type: "sort",
    title: "Skutočná banka vs. podvodník",
    lead: "Videli ste podvodný e-mail aj telefonát. Zhrňme si teraz, podľa čoho ich spoľahlivo odlíšite od skutočnej banky.",
    task: "Kliknite na výrok a potom na políčko <strong>„Skutočná banka“</strong> alebo <strong>„Podvodník“</strong>, komu podľa vás patrí.",
    baskets: [
      { id: "banka", label: "Skutočná banka", desc: "Dá vám čas a nikdy nepýta tajné údaje.", tone: "safe" },
      { id: "podvodnik", label: "Podvodník", desc: "Tlačí na čas a chce údaje hneď.", tone: "danger" },
    ],
    items: [
      { text: "nikdy nežiada PIN, heslá ani kódy zo SMS", basket: "banka", why: "Banka tieto údaje pozná zo svojho systému — nemá dôvod pýtať si ich od vás." },
      { text: "dá vám dosť času na rozhodnutie a overenie", basket: "banka", why: "Seriózna inštitúcia vás nikdy nenaháňa. Časový tlak je nástroj podvodníkov." },
      { text: "rešpektuje, keď hovor ukončíte a zavoláte jej sami", basket: "banka", why: "Banka vám dokonca sama odporučí, aby ste jej zavolali späť na oficiálne číslo." },
      { text: "nikdy nevyzve na prevod peňazí na „bezpečný účet“", basket: "banka", why: "Žiadny „bezpečný účet“ neexistuje — je to vymyslený pojem, ktorý používajú výhradne podvodníci." },
      { text: "žiada PIN, heslá alebo kódy zo SMS", basket: "podvodnik", why: "Toto je najjasnejší znak podvodu. Kód zo SMS je posledná poistka pred odčerpaním peňazí." },
      { text: "tvrdí, že musíte okamžite previesť peniaze", basket: "podvodnik", why: "Naliehavosť má vypnúť vaše premýšľanie. Vždy si vypýtajte čas na rozmyslenie." },
      { text: "vytvára časový tlak — „musíte konať hneď“", basket: "podvodnik", why: "Kto vás naháňa, chce vás pripraviť o peniaze. Platí to takmer bez výnimky." },
      { text: "bráni vám hovor ukončiť či zavolať do banky", basket: "podvodnik", why: "Podvodník vie, že overenie ho prezradí — preto sa mu snaží za každú cenu zabrániť." },
    ],
    note: "Ak si nie ste istí, hovor ukončite a banku kontaktujte sami — výhradne na číslo z karty alebo oficiálneho webu.",
  },
  {
    id: 21, part: 3, type: "slider",
    title: "„Zázračná“ investičná ponuka",
    lead: "Podvodníci neútočia len strachom. Rovnako často lákajú na sľub rýchleho zbohatnutia — a práve pri peniazoch sa oplatí byť najopatrnejší.",
    task: "Prečítajte si reklamu nižšie a kliknite na jedno z <strong>troch tlačidiel</strong> — ako rizikovo na vás pôsobí. Potom vám vysvetlíme, prečo.",
    adText: "„Investujte len 250 € a zarábajte 5 000 € mesačne! Garantovaný výnos bez rizika. Pridajte sa k tisíckam spokojných Slovákov. Ponuka platí len obmedzený čas!“",
    sliderQuestion: "Ako rizikovo na vás táto ponuka pôsobí?",
    riskLevels: [
      { label: "Bezpečné", tone: "safe", correct: false, why: "Táto ponuka rozhodne nie je bezpečná. Sľubuje z 250 € mesačný zisk 5 000 € — také zhodnotenie neexistuje ani u najlepších investícií na svete. Slovo „garantovaný“ pri takomto výnose je istá známka podvodu." },
      { label: "Trochu rizikové", tone: "mid", correct: false, why: "Nejde o „trochu“ rizikovú ponuku — ide o takmer istý podvod. Kombinácia „garantovaný výnos“ + „bez rizika“ + obrovské číslo sa v skutočnom finančnom svete nevyskytuje. Vysoký výnos vždy nesie vysoké riziko." },
      { label: "Veľmi rizikové", tone: "danger", correct: true, why: "Presne tak. Žiadna seriózna investícia negarantuje vysoký výnos bez rizika — to je pravidlo, ktoré neobíde nikto. Za 250 € mesačne 5 000 € je nezmysel, ktorý má len prilákať vaše peniaze." },
    ],
    checklist: [
      "Má spoločnosť povolenie a dohliada na ňu Národná banka Slovenska?",
      "Sú jasne uvedené podmienky investície a všetky poplatky?",
      "Môžem svoje peniaze kedykoľvek vybrať?",
    ],
    checklistNote: "Ak čo i len na jednu z týchto otázok nedostanete jasnú odpoveď, do investície nejdite. Tieto otázky si môžete nechať pripraviť aj od AI — stačí napísať: „Ponúkajú mi investíciu… Aké otázky mám položiť pred rozhodnutím?“",
    note: "Zázračný zisk = zaručená strata. Zoznam licencovaných subjektov nájdete na www.nbs.sk.",
    evidenceImage: {
      src: "assets/course-media/evidence/investicny-podvod-instagram.jpg",
      caption: "Presne takéto investičné reklamy s falošným logom energetickej firmy kolujú na Instagrame a Facebooku.",
    },
  },
  {
    id: 22, part: 3, type: "revealgrid",
    title: "Ako si overiť firmu skôr, než jej dáte peniaze",
    lead: "Predtým než pošlete čo i len euro, dá sa firma preveriť za pár minút. Tu sú tri spôsoby, ktoré zvládnete aj sami.",
    task: "Kliknite postupne na <strong>všetky tri políčka</strong> a prečítajte si, ako sa dá firma preveriť.",
    cells: [
      { title: "Pozrite zoznam na www.nbs.sk", text: "Národná banka Slovenska vedie zoznam všetkých firiem, ktoré smú na Slovensku ponúkať investície. Ak tam firma nie je, nemá na to povolenie — a vaše peniaze nie sú chránené." },
      { title: "Prečítajte si varovania NBS", text: "Na tej istej stránke nájdete aj zoznam firiem, pred ktorými NBS priamo varuje. Podvodníci často zneužívajú mená bánk, energetických firiem či známych osobností." },
      { title: "Opýtajte sa AI na druhý názor", text: "Napíšte: „Ponúka mi investíciu firma XY. Povedz mi, na čo si mám dať pozor a ako si ju overím.“ Odpoveď si potom skontrolujte na nbs.sk — AI vám pomôže vedieť, čo hľadať." },
    ],
    note: "Seriózna firma vám nikdy nebráni požiadať si o čas na rozmyslenie a overenie.",
  },
  {
    id: 23, part: 3, type: "spot", stamp: true, medium: "email",
    title: "Opakovanie: nájdite chyták",
    lead: "Posledné cvičenie tejto časti. Tentoraz podvodník kombinuje hneď dve taktiky naraz — strach aj sľub peňazí.",
    task: "Nájdite <strong>3 varovné znaky</strong>. Skúste si najprv sami tipnúť, ktoré časti sú podozrivé, a až potom na ne kliknite.",
    message: {
      from: "podpora@banka-sk24.info",
      subject: "URGENTNÉ: Váš účet a výhra",
      body: "Vážený zákazník, [[váš účet bude do 2 hodín zablokovaný]], pokiaľ [[nepotvrdíte údaje kliknutím na odkaz]]. Zároveň vám oznamujeme, že ste vyžrebovaný a získavate [[500 € — stačí zaslať údaje o karte]].",
    },
    clues: [
      "Krátky časový limit (2 hodiny) vyvoláva paniku — ešte kratší než v predošlých príkladoch.",
      "Odkaz žiadajúci potvrdenie údajov — klasický phishing, ktorý už poznáte.",
      "Sľub výhry výmenou za údaje karty — podvodník mieša strach aj návnadu peniazmi v jednej správe.",
    ],
    footer: "Zvládli ste tretiu časť! Rozoznáte podvodný e-mail, telefonát aj SMS. V ďalšej časti sa pozrieme na hoaxy a fotografie vytvorené umelou inteligenciou.",
  },

  // ---------- ČASŤ 4 · Hoaxy, fotky, zmluvy ----------
  {
    id: 24, part: 4, type: "spot", medium: "social",
    title: "Poplašná správa zo sociálnej siete",
    lead: "Hoax nechce vaše peniaze priamo — chce vašu pozornosť a vaše zdieľanie. Šíri sa preto, že v nás vyvoláva silné emócie.",
    task: "Nájdite <strong>3 varovné signály hoaxu</strong>. Kliknite na podčiarknuté časti príspevku.",
    message: {
      from: "zdieľané na sociálnej sieti",
      subject: "",
      body: "[[POZOR!]] EÚ od budúceho roka [[ZAKÁŽE hotovosť!]] Všetky peniaze budú len elektronické. [[Zdieľajte, kým to nezmažú!!!]]",
    },
    clues: [
      "VEĽKÉ PÍSMENÁ a výkričníky — snaha vyvolať silné emócie namiesto vecnej informácie.",
      "Tvrdenie bez odkazu na oficiálny zdroj — pravdivá správa vždy uvádza, odkiaľ pochádza.",
      "Výzva „zdieľajte, kým to nezmažú“ — tlak na okamžité šírenie, aby ste to nestihli overiť.",
    ],
    footer: "Kde si overiť pravdu: nbs.sk, slov-lex.sk (znenie zákonov), seriózne médiá alebo facebooková stránka Polícia SR — „Hoaxy a podvody“.",
  },
  {
    id: 25, part: 4, type: "match",
    title: "Skutočné príklady poplašných správ",
    lead: "Takto vyzerali dva hoaxy, ktoré na Slovensku obehli tisíce ľudí. Jeden vyvolával paniku, druhý dokonca ohrozoval zdravie.",
    task: "Kliknite na <strong>názov správy vľavo</strong> a potom na <strong>vysvetlenie vpravo</strong>, prečo je nebezpečná.",
    pairs: [
      { left: "„Tanky na Záhorí“", right: "VEĽKÉ PÍSMENÁ, výkričníky, „ZDIEĽAJTE!!“ — vyvoláva zbytočnú paniku.", why: "Táto správa nemala žiadny oficiálny zdroj a šírila strach z vojny. Overiť sa dala za minútu na stránke polície." },
      { left: "„Kašľaním proti infarktu“", right: "Nebezpečná zdravotná rada — pri podozrení na infarkt vždy volajte 155 alebo 112.", why: "Toto je najnebezpečnejší typ hoaxu — môže stáť život. Pri infarkte je každá sekunda dôležitá a kašľanie situáciu len zhoršuje." },
    ],
    note: "Čím viac výkričníkov, tým menej pravdy. Skôr než správu zdieľate ďalej, dajte si chvíľu pauzu.",
    gallery: [
      { src: "assets/course-media/evidence/hoax-tanky-facebook.jpg", caption: "„Tanky na Záhorí“ — takto vyzerá skutočný hoax na Facebooku, aj s označením HOAX od stránky, ktorá klamstvá vyvracia." },
      { src: "assets/course-media/evidence/infarkt-hoax-text.jpg", caption: "„Kašľaním proti infarktu“ — skutočná poplašná správa s nebezpečnou zdravotnou radou." },
    ],
  },
  {
    id: 26, part: 4, type: "reveal",
    title: "Keď dezinformácia vyzerá ako spravodajstvo",
    lead: "Najzákernejšie sú správy, ktoré vyzerajú ako seriózny článok — majú logo, autora aj odkaz na „štúdiu“. O to dôležitejšie je vedieť si položiť správne otázky.",
    task: "Kliknite postupne na <strong>všetky tri kľúče</strong>. Za každým je jedna otázka, ktorou takýto článok preveríte.",
    layout: "keys",
    cells: [
      { title: "Kde je pôvodná štúdia?", text: "Odkaz vedie len na vlastný web stránky — na skutočnú štúdiu sa nedostanete. Seriózny článok vždy uvedie zdroj, ktorý sa dá otvoriť a overiť." },
      { title: "Na akú emóciu hrá?", text: "Strach o zdravie a domov sa zdieľa najrýchlejšie. Ak vo vás článok vyvoláva hnev alebo strach, je to dôvod spomaliť — nie zdieľať." },
      { title: "Opýtajte sa AI", text: "Napíšte: „Je pravda, že infrazvuk z veterných turbín spôsobuje srdcové choroby? Čo hovoria overené zdroje a kde si to môžem skontrolovať?“" },
    ],
    note: "Pravdivá informácia sa dá overiť z viacerých nezávislých zdrojov. Ak ju nájdete len na jednom webe, buďte opatrní.",
    evidenceImage: {
      src: "assets/course-media/evidence/epoch-times-dezinformacia.jpg",
      caption: "Presne tento príspevok o veterných turbínach koloval na sociálnych sieťach — vyzerá ako spravodajstvo, no ide o zavádzajúci výklad jednej štúdie.",
    },
  },
  {
    id: 27, part: 4, type: "guess",
    title: "Skutočná fotografia, alebo AI?",
    lead: "Umelá inteligencia dnes vytvorí obrázok, ktorý na prvý pohľad vyzerá ako skutočná fotografia. Podvodníci ich používajú na vymyslené zbierky, falošné výhry aj reklamy so známymi osobnosťami.",
    task: "Uvidíte <strong>dve fotografie</strong>. Pri každej kliknite, či je podľa vás skutočná, alebo vytvorená umelou inteligenciou. Obrázok si môžete kliknutím zväčšiť.",
    rounds: [
      { image: "assets/course-media/evidence/ai-foto-macka-farba.jpg", answer: "ai", explain: "Je to AI — všimnite si, že rozliata farba je nerealisticky dramatická, kvapky vo vzduchu nesedia s jedným prevrhnutým vedrom a perspektíva škvŕn na posteli aj stene pôsobí zvláštne. Mačka aj textúry vyzerajú takmer presvedčivo — a presne to robí AI fotografie nebezpečnými." },
      { image: "assets/course-media/evidence/real-foto-muz-s-notebookom.jpg", answer: "real", explain: "Je to skutočná fotografia — svetlo, tiene aj drobné nedokonalosti (prirodzené záhyby oblečenia, nerovnomerné pozadie) sedia s bežným fotoaparátom. Nič nepôsobí „príliš dokonalo“." },
    ],
    checklist: [
      { title: "Ruky a prsty", text: "Neprirodzený počet alebo tvar prstov — najčastejšia chyba AI." },
      { title: "Tvár", text: "Nesúmerné oči, príliš pravidelné zuby, zvláštne uši alebo okuliare." },
      { title: "Text na obrázku", text: "Nápisy bývajú nezrozumiteľné alebo s preklepmi." },
      { title: "Svetlo a tiene", text: "Tiene dopadajú rôznymi smermi, pokožka je príliš hladká." },
      { title: "Pozadie", text: "Zdeformované alebo nelogické objekty, ktoré do scény nepatria." },
    ],
    note: "Platí to aj pre videá — hovorí sa tomu deepfake. Fotografia už dnes nie je dôkazom, že sa niečo naozaj stalo.",
  },
  {
    id: 28, part: 4, type: "choice", stamp: true,
    title: "Zložitá zmluva? Odfoťte ju AI",
    lead: "Doteraz sme AI používali na odhaľovanie podvodov. Teraz si ukážeme, ako vám pomôže aj pri úplne bežnom papieri — zmluve, ktorej nerozumiete.",
    task: "Uvidíte <strong>dve otázky</strong> k zmluve o dodávke elektriny. Kliknite na tú, ktorá vám prinesie užitočnejšiu odpoveď.",
    intro: "Zmluvy, poistky, úvery — AI vám ich preloží do ľudskej reči. Stačí dokument odfotiť priamo v aplikácii.",
    rounds: [
      {
        weak: "Je táto zmluva dobrá?",
        good: "Vysvetli mi ju jednoducho: Na čo si mám dať pozor? Aké sú tam poplatky a pokuty? Dá sa vypovedať?",
        why: "Konkrétne otázky prinesú konkrétne odpovede — napríklad o výške pokuty či dĺžke výpovednej lehoty. Na otázku „je dobrá?“ vám AI odpovie len všeobecne.",
        answerPreview: "Zmluva je na 24 mesiacov. Pri predčasnom ukončení hrozí pokuta 150 €. Pozor na článok 7 — zmluva sa automaticky predĺži, ak ju nevypoviete 3 mesiace vopred.",
      },
    ],
    note: "Osobné údaje na dokumente pred odfotením prekryte. Pri zmluvách vysokej hodnoty sa vždy poraďte aj s právnikom alebo notárom.",
  },

  // ---------- ČASŤ 5 · Zlaté pravidlá a záver ----------
  {
    id: 29, part: 5, type: "sort",
    title: "Trezor: čo nikdy nezadávame",
    lead: "AI je výborný pomocník, ale nie je určená na vaše citlivé údaje. Platí pri nej to isté pravidlo ako pri e-mailoch a telefonátoch.",
    task: "Kliknite na kartičku a potom na políčko, kam patrí: <strong>Trezor</strong> (nikdy nikomu — ani AI), alebo <strong>Chat s AI</strong> (pokojne sa opýtajte).",
    tip: "Do AI sa pýtame na vysvetlenie. Nikdy do nej nevkladáme citlivé osobné ani bankové údaje.",
    baskets: [
      { id: "trezor", label: "Trezor — nikdy nezadávame", desc: "Citlivé údaje, heslá, kódy, čísla kariet, neprekryté doklady.", tone: "danger" },
      { id: "chat", label: "Chat s AI — v poriadku", desc: "Otázky, vysvetlenie pojmov, posúdenie podozrivého obsahu bez citlivých údajov.", tone: "safe" },
    ],
    sideNote: {
      title: "Zapamätajte si",
      items: [
        { tone: "good", text: "AI môže pomôcť vysvetliť alebo posúdiť obsah." },
        { tone: "warn", text: "Nikdy nevpisujte citlivé osobné ani bankové údaje." },
        { tone: "info", text: "Ak si nie ste istí, údaje najprv zakryte alebo sa poraďte s blízkym." },
      ],
    },
    items: [
      { text: "heslo do internetbankingu", basket: "trezor", why: "Heslo nepatrí nikam okrem prihlasovacej stránky vašej banky. Ani AI ho na nič nepotrebuje." },
      { text: "číslo karty, PIN a CVV/CVC", basket: "trezor", why: "Kto pozná číslo karty spolu s CVV, môže s ňou zaplatiť. Tieto tri údaje spolu nikdy nikam nepíšte." },
      { text: "rodné číslo a číslo dokladu", basket: "trezor", why: "S rodným číslom a číslom dokladu sa dá zneužiť vaša totožnosť — napríklad na uzavretie pôžičky na vaše meno." },
      { text: "autorizačný SMS kód z banky", basket: "trezor", why: "Tento kód je posledná poistka pred odoslaním peňazí. Nikomu ho nediktujte ani neprepisujte — ani „pracovníkovi banky“." },
      { text: "„budem 2 týždne preč, dom bude prázdny“", basket: "trezor", why: "Informácia o vašej neprítomnosti je cenná pre zlodejov. Nezdieľajte ju na internete — ani v chate, ani na sociálnych sieťach." },
      { text: "fotografia dokladu bez prekrytia", basket: "trezor", why: "Na doklade je rodné číslo aj číslo dokladu naraz. Ak už dokument fotíte, citlivé údaje najprv prekryte papierikom." },
      { text: "„je tento e-mail podozrivý?“", basket: "chat", why: "Presne na toto je AI výborná. Text e-mailu neobsahuje vaše tajné údaje, takže ho môžete pokojne prepísať." },
      { text: "„ako spoznám podvodný telefonát?“", basket: "chat", why: "Všeobecná otázka o bezpečnosti — žiadne vaše osobné údaje. AI vám rada vysvetlí varovné znaky." },
      { text: "zmluva s vopred prekrytými osobnými údajmi", basket: "chat", why: "Takto je to správne: obsah zmluvy AI potrebuje, vaše meno a rodné číslo nie. Stačí ich prekryť." },
      { text: "„vysvetli mi tento výraz jednoducho“", basket: "chat", why: "Ideálne využitie AI. Nič neriskujete a dostanete zrozumiteľné vysvetlenie ktoréhokoľvek cudzieho slova." },
    ],
  },
  {
    id: 30, part: 5, type: "rewrite",
    title: "Ako sa pýtať bezpečne",
    lead: "V predošlom kroku ste sa naučili, čo do AI nepatrí. Teraz si ukážeme, že sa dá opýtať bezpečne — a dostať pritom rovnako užitočnú odpoveď.",
    task: "V otázke nižšie sú <strong>dva citlivé údaje</strong> zvýraznené oranžovou. Kliknite na každý z nich — vysvetlíme, prečo tam nepatrí, a vpravo sa vám poskladá bezpečná verzia otázky.",
    sentence: [
      { text: "Mám na účte", sensitive: false },
      { text: "12 400 €", sensitive: true, why: "Presná suma nie je pre radu od AI potrebná — stačí povedať, že ide o peniaze. Zároveň prezrádza, koľko máte." },
      { text: "a mám ich poslať na účet", sensitive: false },
      { text: "SK44 0900 0000 0001 2345 6789", sensitive: true, why: "Číslo účtu je citlivý bankový údaj — a AI ho na posúdenie situácie vôbec nepotrebuje." },
      { text: "— je to bezpečné?", sensitive: false },
    ],
    safeVersion: "Niekto ma žiada, aby som poslal peniaze na neznámy účet. Je to bezpečné?",
    takeaway: "Opíšte situáciu, nie čísla. AI vám poradí rovnako dobre aj bez konkrétnych údajov.",
  },
  {
    id: 31, part: 5, type: "match",
    title: "Šesť zlatých pouček",
    lead: "Toto je jadro celého kurzu. Šesť viet, ktoré vás ochránia pred väčšinou podvodov.",
    task: "Kliknite na <strong>začiatok poučky vľavo</strong> a potom na jej <strong>pokračovanie vpravo</strong>.",
    pairs: [
      { left: "„Kto ma naháňa,", right: "chce ma pripraviť o peniaze.“", why: "Podvodníci vytvárajú časový nátlak zámerne. Seriózna firma vám vždy nechá čas na rozmyslenie." },
      { left: "„Banka nikdy", right: "nepýta PIN ani heslo.“", why: "Platí to bez výnimky — telefonicky, e-mailom aj SMS. Ak si ich niekto pýta, je to podvodník." },
      { left: "„Ak mám pochybnosti,", right: "ukončím hovor a zavolám späť.“", why: "Volajte iba na číslo zo zadnej strany karty alebo z oficiálneho webu — nikdy nie na to, ktoré vám nadiktujú." },
      { left: "„Zaručený vysoký zisk", right: "je varovným signálom.“", why: "Vysoký výnos vždy znamená vysoké riziko. Kto tvrdí opak, klame." },
      { left: "„Umelá inteligencia radí,", right: "rozhodnutie robí človek.“", why: "AI vám pomôže situáciu pochopiť, ale konečné slovo — najmä pri peniazoch — máte vždy vy." },
      { left: "„Čím viac strachu a výkričníkov,", right: "tým väčšia opatrnosť.“", why: "Dôveryhodné informácie bývajú pokojné a vecné. Panika je nástroj manipulácie." },
    ],
    note: "Všetkých šesť pouček spája jedna myšlienka: spomaľte, spýtajte sa a overte si to skôr, než konáte.",
  },
  {
    id: 32, part: 5, type: "match",
    title: "Keď sa niečo stane",
    lead: "Aj opatrnému človeku sa môže stať, že naletí. Dôležité je vedieť, komu hneď zavolať — rýchlosť tu rozhoduje.",
    task: "Kliknite na <strong>situáciu vľavo</strong> a potom na <strong>správny kontakt vpravo</strong>.",
    pairs: [
      { left: "Podozrivý pohyb na účte alebo strata karty", right: "Vaša banka — číslo zo zadnej strany karty.", why: "Volajte okamžite a požiadajte o zablokovanie karty či účtu. Čím skôr, tým väčšia šanca peniaze zachrániť." },
      { left: "Naleteli ste podvodu, treba to nahlásiť", right: "Polícia SR — linka 158 alebo tiesňová linka 112.", why: "Podvod nahláste aj vtedy, keď sa hanbíte. Nie ste prvý ani posledný a polícii to pomôže chytiť páchateľov." },
      { left: "Podozrivá investičná ponuka či firma", right: "Národná banka Slovenska — www.nbs.sk.", why: "NBS vedie zoznam licencovaných firiem aj varovania. Overte si to ešte predtým, než niečo podpíšete." },
    ],
    note: "Nehanbite sa ozvať. Podvodom naletia aj vzdelaní a opatrní ľudia — sú na to špeciálne trénovaní.",
  },
  {
    id: 33, part: 5, type: "quickfire", stamp: true,
    title: "Záverečná bleskovka",
    lead: "Posledných päť situácií. Overme si, čo všetko ste sa v kurze naučili.",
    task: "Pri každej otázke kliknite <strong>Áno</strong> alebo <strong>Nie</strong>. Po odpovedi sa vám zobrazí vysvetlenie a môžete prejsť na ďalšiu.",
    tips: [
      "Hľadajte znaky nátlaku, naliehavosti a podozrivého odkazu.",
      "Neodpovedajte pod tlakom. Najprv sa zastavte a overte si informáciu.",
      "Nejde o memorovanie, ale o rozpoznanie varovných signálov.",
    ],
    questions: [
      { short: "E-mail vás naháňa časom a žiada kliknúť na odkaz", text: "E-mail vás naháňa časom a žiada kliknúť na odkaz — je to podozrivé?", answer: true, why: "Áno. Časový nátlak a odkaz na kliknutie sú dva z najčastejších varovných znakov podvodu. Banka od vás prihlásenie cez odkaz v e-maile nikdy nežiada." },
      { short: "Banka si od vás telefonicky pýta PIN", text: "Banka si od vás telefonicky pýta PIN — je to normálne?", answer: false, why: "Nie. Žiadna banka si nikdy telefonicky ani e-mailom nepýta PIN, heslo ani kódy zo SMS. Ak sa to stane, ide o podvodníka — hovor ukončite." },
      { short: "Ponuka sľubuje garantovaný zisk bez rizika", text: "Ponuka sľubuje garantovaný zisk bez rizika — treba byť opatrný?", answer: true, why: "Áno. Zaručený vysoký zisk bez rizika v skutočnosti neexistuje — je to typický znak podvodnej investície. Firmu si overte na www.nbs.sk." },
      { short: "Správa má veľa výkričníkov a žiada zdieľať ďalej", text: "Správa má veľa výkričníkov a žiada zdieľať ďalej — je to varovný signál?", answer: true, why: "Áno, presne takto vyzerajú hoaxy — čím viac výkričníkov, tým menej pravdy. Skôr než správu pošlete ďalej, overte si ju." },
      { short: "Overiť si dôležitú informáciu na viacerých zdrojoch", text: "Je v poriadku overiť si dôležitú informáciu na viacerých zdrojoch?", answer: true, why: "Áno, overenie z viacerých nezávislých zdrojov je vždy dobrý a bezpečný postup — platí to aj pre odpovede od umelej inteligencie." },
    ],
  },
  {
    id: 34, part: 5, type: "printcard",
    title: "Váš papierik vedľa telefónu",
    lead: "Šesť zlatých pravidiel na jednom mieste. Vytlačte si ich a nalepte vedľa telefónu alebo počítača — presne tam, kde ich budete potrebovať.",
    task: "Prečítajte si všetkých šesť pravidiel a potom kliknite na tlačidlo <strong>„Stiahnuť ako obrázok“</strong> pod nimi.",
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
    lead: "Ďakujeme, že ste si našli čas naučiť sa niečo nové. Rozoznáte podvodný e-mail, telefonát aj SMS, viete si overiť firmu a bezpečne používať umelú inteligenciu ako pomocníka.",
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
