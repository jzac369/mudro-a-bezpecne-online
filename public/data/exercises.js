// Praktické cvičenia (krok 4 kurzu).
//
// Každé cvičenie sa dá urobiť priamo na obrazovke a zároveň stiahnuť
// ako pracovný list vo formáte PDF a vyplniť perom.
//
// Polia:
//   id     — používa sa na zapamätanie, ktoré cvičenia sú hotové
//   type   — určuje, akú interakciu vykreslí assets/exercises.js
//   short  — jedna veta na dlaždici v prehľade
//   time   — orientačný čas, aby účastník vedel, do čoho ide
window.COURSE_EXERCISES = [

  {
    id: "slovnicek",
    type: "glossary",
    icon: "book",
    title: "Slovníček pojmov",
    short: "Sedemnásť cudzích slov z brožúrky, vysvetlených po našom — v troch krátkych častiach.",
    time: "12 minút",
    intro: "V kurze aj v brožúrke sa objaví pár cudzích slov. Tu ich máte pokope a vysvetlené normálnou rečou. Nemusíte sa ich učiť naspamäť — úplne stačí, keď budete vedieť, kde si ich nájsť.",
    task: "Kliknite na kartičku a otočí sa — na druhej strane je vysvetlenie. Sú tu tri krátke časti, po každej si môžete dať pauzu a pokračovať neskôr.",
    // Zámerne rozdelené na tri kratšie časti — sedemnásť pojmov naraz je pre
    // začiatočníka priveľa. Vishing a smishing tu nie sú, tie sa preberajú
    // v Lekciách na obrazovke „Slovníček pojmov“.
    parts: [
      {
        title: "Umelá inteligencia",
        intro: "Slová, na ktoré narazíte hneď, ako otvoríte ChatGPT.",
        terms: [
          { term: "AI (umelá inteligencia)", text: "Program, ktorý rozumie ľudskej reči a vie odpovedať, radiť a písať texty. Skratka z anglického Artificial Intelligence." },
          { term: "ChatGPT", text: "Jedna z najznámejších aplikácií na prácu s umelou inteligenciou. Funguje ako osobný asistent, s ktorým sa dá písať aj rozprávať." },
          { term: "Prompt", text: "Otázka alebo zadanie, ktoré napíšete umelej inteligencii." },
          { term: "Halucinácia", text: "Keď si AI odpoveď vymyslí, aj keď znie presvedčivo. Preto dôležité veci vždy overujeme." },
          { term: "Aplikácia", text: "Program v mobile alebo na tablete. Aplikácie inštalujeme len z oficiálneho obchodu (Google Play, App Store) — nikdy z odkazu v SMS či e-maile." },
        ],
      },
      {
        title: "Podvody a nepravdivé správy",
        intro: "Pomenovania pre to, čím sa vás niekto snaží oklamať.",
        terms: [
          { term: "Phishing", read: "čítaj „fišing“", text: "Podvodný e-mail alebo SMS, ktoré sa tvária ako správy od banky či úradu a chcú vylákať vaše údaje." },
          { term: "Hoax", read: "čítaj „houks“", text: "Zámerne vytvorená nepravdivá alebo zavádzajúca správa, ktorej cieľom je oklamať ľudí a prinútiť ich, aby ju šírili ďalej." },
          { term: "Dezinformácia", text: "Nepravdivá informácia šírená úmyselne s cieľom ovplyvniť názory či správanie ľudí, často cez strach alebo hnev. Cieľom je manipulovať verejnou mienkou." },
          { term: "Deepfake", read: "čítaj „dípfejk“", text: "Falošné video alebo hlas vytvorený umelou inteligenciou — napríklad „známa osobnosť“ vo videu odporúča investíciu, ktorá sa nezakladá na pravde." },
          { term: "Kryptomena", text: "Digitálne „peniaze“ (napríklad bitcoin) používané na internete. Obľúbený nástroj podvodníkov, pretože platby sa po odoslaní nedajú vrátiť." },
        ],
      },
      {
        title: "Vaše údaje a bezpečné klikanie",
        intro: "Čo si chrániť a na čo si dať pozor, kým na niečo kliknete.",
        terms: [
          { term: "Odkaz (link)", text: "Modrý podčiarknutý text alebo tlačidlo, ktoré po kliknutí otvorí webovú stránku. Na odkazy v podozrivých správach nikdy neklikáme." },
          { term: "Príloha", text: "Súbor pripojený k e-mailu (dokument, obrázok). Prílohu od neznámeho odosielateľa neotvárame." },
          { term: "QR kód", text: "Štvorcový čiarový kód, ktorý sa odfotí mobilom a otvorí webovú stránku. Podvodníci ho vedia nalepiť napríklad na parkovací automat — naskenovaním sa dostanete na falošnú platobnú stránku." },
          { term: "Verejná Wi-Fi sieť", text: "Bezplatné pripojenie na internet, napríklad v kaviarni alebo na letisku. Cez takúto sieť radšej nerobte internetbanking — bezpečnejšie sú mobilné dáta alebo domáca Wi-Fi." },
          { term: "PIN", text: "Tajný číselný kód ku karte. Nikdy ho nikomu nehovoríme — ani pracovníkovi banky, ba ani rodine." },
          { term: "CVV / CVC", text: "Trojčíslie na zadnej strane platobnej karty. Kto ho pozná spolu s číslom karty, môže s vašou kartou zaplatiť." },
          { term: "Dvojfaktorové overenie", text: "Dvojitý zámok: okrem hesla treba zadať aj kód, napríklad z SMS. Sťažuje zlodejom prístup k vášmu účtu." },
        ],
      },
    ],
    // Krátke overenie na záver — po jednej otázke z každej časti.
    check: [
      {
        question: "Čo je to „prompt“?",
        options: ["Tajný číselný kód ku karte", "Otázka alebo zadanie, ktoré napíšete umelej inteligencii", "Názov mobilnej aplikácie"],
        correct: 1,
        why: "Prompt je jednoducho to, čo umelej inteligencii napíšete. Čím konkrétnejšie, tým užitočnejšia odpoveď.",
      },
      {
        question: "Čo je „phishing“ (fišing)?",
        options: ["Druh rybolovu", "Bezpečný spôsob platby cez internet", "Podvodný e-mail alebo SMS, ktoré sa tvária ako správa od banky či úradu"],
        correct: 2,
        why: "Slovo vzniklo z anglického „fishing“ — rybolov. Podvodníci rozpošlú tisíce správ a čakajú, kto sa chytí.",
      },
      {
        question: "Čo je „dvojfaktorové overenie“?",
        options: ["Dvojitý zámok — okrem hesla treba zadať aj kód, napríklad z SMS", "Dve rôzne heslá k tomu istému účtu", "Overenie dvomi rôznymi bankami naraz"],
        correct: 0,
        why: "Je to jedna z najúčinnejších ochrán účtu. Aj keby niekto zistil vaše heslo, bez kódu z SMS sa dnu nedostane.",
      },
    ],
    note: "Narazíte na iné cudzie slovo? Opýtajte sa AI: „Vysvetli mi slovo … jednoducho, ako pre seniora, a uveď príklad.“",
    worksheetNote: "Tento zoznam si môžete vytlačiť a nechať pri počítači. Keď na niektoré slovo znova narazíte, budete ho mať poruke.",
  },

  {
    id: "rozpocet",
    type: "budget",
    icon: "wallet",
    title: "Domáci rozpočet s pomocou AI",
    short: "Spočítajte si príjmy a výdavky a nechajte si od AI poradiť, kde sa dá ušetriť.",
    time: "10 minút",
    intro: "Prehľad o vlastných peniazoch je prvá obrana pred podvodom — kto vie, koľko mu mesačne zostáva, ten sa nedá tak ľahko nahovoriť na „výhodnú investíciu“.",
    task: "Vyplňte políčka nižšie. Sumy môžu byť aj približné alebo vymyslené — ide len o nácvik. Po vyplnení vám pripravíme hotovú otázku pre AI.",
    incomeLabels: ["Dôchodok", "Iný príjem (brigáda, prenájom…)"],
    expenseLabels: [
      "Bývanie (nájom, energie, voda)",
      "Potraviny a drogéria",
      "Lieky a zdravie",
      "Telefón, televízia, internet",
      "Doprava",
      "Ostatné (darčeky, koníčky…)",
    ],
    promptTemplate:
      "Som senior a chcem si prejsť svoj mesačný rozpočet. Moje mesačné príjmy sú spolu {prijem} € " +
      "a výdavky {vydavky} €. Je môj rozpočet vyrovnaný? Ktoré výdavky by som mohol znížiť a ako? " +
      "Vysvetli mi to jednoducho, bez cudzích slov.",
    note: "Všimnite si, že v otázke nie je číslo účtu ani meno banky — AI ich na radu vôbec nepotrebuje.",
    worksheetNote: "Ak si tabuľku vyplníte perom, môžete ju odfotiť priamo do aplikácie ChatGPT. Nikdy však nefoťte doklady s rodným číslom, číslom občianskeho preukazu, karty ani účtu.",
  },

  {
    id: "lov-na-podvody",
    type: "scam-hunt",
    icon: "search",
    title: "Lov na podvody",
    short: "Tri skutočné správy — rozhodnite, ktorá je podvod, a zistite, podľa čoho sa to pozná.",
    time: "8 minút",
    intro: "Toto sú skutočné správy, ktoré chodia ľuďom na Slovensku. Skúste si na nich, či už varovné znaky rozoznáte sami.",
    task: "Pri každej správe najprv sami rozhodnite, či ide o podvod. Až potom sa vám ukáže vysvetlenie.",
    messages: [
      {
        label: "Správa č. 1 — SMS",
        text: "„Slovenska posta: Vas balik #SK29174 caka na dorucenie. Uhradte colny poplatok 2,10 EUR: http://sk-posta.delivery-pay.com“",
        isScam: true,
        why: "Podvod (smishing). Prezradili ho tri veci: adresa odkazu nie je oficiálna stránka pošty, chýbajú mäkčene a dĺžne, a suma je zámerne drobná — 2,10 € nikoho nezaskočí, no zadaním karty prídete o oveľa viac.",
      },
      {
        label: "Správa č. 2 — e-mail",
        text: "„Vážený zákazník, Vaša platba za elektrinu neprešla. Aby sme predišli odpojeniu do 48 hodín, aktualizujte platobné údaje: kliknite TU. Váš dodávateľ energie.“",
        isScam: true,
        why: "Podvod (phishing). Vyvoláva strach z odpojenia a tlačí na rýchle kliknutie. Skutočný dodávateľ vás osloví menom a nikdy nežiada platobné údaje cez odkaz v e-maile.",
      },
      {
        label: "Správa č. 3 — WhatsApp",
        text: "„Ahoj mami, pokazil sa mi telefón, píšem z nového čísla. Súrne potrebujem zaplatiť faktúru, pošleš mi 380 € na tento účet? Neskôr ti vrátim. Nevolaj, nefunguje mi mikrofón.“",
        isScam: true,
        why: "Podvod („nové číslo“). Najsilnejší varovný znak je veta „nevolaj“ — zámerne bráni telefonickému overeniu, po ktorom by ste inak siahli ako prví. Vždy zavolajte na číslo, ktoré máte uložené vy.",
      },
    ],
    note: "Všetky tri správy sú podvod. To je zámer — v skutočnom živote nechodí označené, ktorá správa je nebezpečná. Preto platí: pri každej žiadosti o peniaze alebo údaje spomaľte a overte si to.",
  },

  {
    id: "prompt",
    type: "prompt-builder",
    icon: "message",
    title: "Poskladajte si otázku pre AI",
    short: "Vyberte situáciu, doplňte pár slov a máte hotovú otázku, ktorú stačí odpísať do ChatGPT.",
    time: "7 minút",
    intro: "Dobre položená otázka je polovica úspechu. Tu si ju poskladáte krok za krokom — a hotovú si môžete skopírovať alebo vytlačiť.",
    task: "Vyberte situáciu, v ktorej sa práve nachádzate, a doplňte políčka. Otázku pre AI vám poskladáme sami.",
    situations: [
      {
        id: "email",
        label: "Prišiel mi podozrivý e-mail",
        fields: [
          { key: "odosielatel", label: "Kto e-mail údajne poslal?", placeholder: "napríklad: moja banka" },
          { key: "ziada", label: "Čo od vás žiada?", placeholder: "napríklad: aby som klikol na odkaz a prihlásil sa" },
        ],
        template: "Som senior a prišiel mi e-mail, ktorý má byť od {odosielatel}. Žiada odo mňa, {ziada}. Je to dôveryhodné, alebo môže ísť o podvod? Uveď konkrétne varovné znaky a vysvetli mi to jednoducho.",
      },
      {
        id: "telefonat",
        label: "Volal mi niekto podozrivý",
        fields: [
          { key: "kto", label: "Za koho sa volajúci vydával?", placeholder: "napríklad: za pracovníka banky" },
          { key: "chcel", label: "Čo od vás chcel?", placeholder: "napríklad: aby som previedol peniaze na bezpečný účet" },
        ],
        template: "Som senior a volal mi človek, ktorý tvrdil, že je {kto}. Chcel odo mňa, {chcel}. Je toto bežný postup? Poraď mi jednoducho, čo mám urobiť a ako si to mám overiť.",
      },
      {
        id: "investicia",
        label: "Ponúkajú mi investíciu",
        fields: [
          { key: "firma", label: "Ako sa firma alebo ponuka volá?", placeholder: "napríklad: SPP SK akcie" },
          { key: "slubuje", label: "Čo sľubuje?", placeholder: "napríklad: garantovaný zisk 5 000 € mesačne" },
        ],
        template: "Som senior a ponúkajú mi investíciu: {firma}. Sľubuje {slubuje}. Aké riziká to prináša? Ako si overím, či je firma dôveryhodná, a aké otázky mám položiť pred rozhodnutím? Vysvetli mi to jednoducho.",
      },
      {
        id: "zmluva",
        label: "Nerozumiem zmluve",
        fields: [
          { key: "cohoZmluva", label: "O akú zmluvu ide?", placeholder: "napríklad: o dodávke elektriny" },
        ],
        template: "Som senior a mám pred sebou zmluvu {cohoZmluva}. Vysvetli mi ju jednoducho, bez cudzích slov: Na čo si mám dať pozor? Aké sú tam poplatky a pokuty? Dá sa vypovedať a dokedy?",
      },
    ],
    note: "Všimnite si, že v žiadnej z otázok nie je vaše meno, adresa ani číslo účtu. Situáciu treba opísať — údaje netreba.",
    worksheetPrompts: [
      { label: "PODOZRIVÝ E-MAIL", text: "Prepíšem ti obsah e-mailu: … Je dôveryhodný, alebo môže ísť o podvod? Uveď varovné znaky." },
      { label: "PODOZRIVÝ TELEFONÁT", text: "Volal mi človek, ktorý tvrdil, že je z … Žiadal odo mňa … Je to bežný postup? Poraď, čo mám urobiť." },
      { label: "INVESTIČNÁ PONUKA", text: "Ponúkajú mi investíciu: … Aké riziká predstavuje? Ako si overím, že je spoločnosť dôveryhodná?" },
      { label: "ZMLUVA ALEBO ÚRADNÝ LIST", text: "Odfotil som ti zmluvu. Vysvetli mi ju jednoducho. Na čo si mám dať pozor? Aké sú tam poplatky a pokuty?" },
    ],
  },

  {
    id: "simulator",
    type: "chat-sim",
    icon: "robot",
    title: "Simulátor ChatGPT — vyskúšajte si to nanečisto",
    short: "Okno, ktoré vyzerá ako skutočný ChatGPT. Napíšte otázku a uvidíte, ako by odpovedal.",
    time: "10 minút",
    intro: "Než si ChatGPT otvoríte doma, vyskúšajte si ho tu. Nič sa nedá pokaziť a nepotrebujete žiadne prihlásenie ani účet.",
    task: "Kliknite na jednu z pripravených otázok dole, alebo si napíšte vlastnú a stlačte šípku. Po každej odpovedi vám ponúkneme, na čo sa dá pýtať ďalej.",
    suggestions: [
      "Prišiel mi e-mail z banky, že mi zablokujú účet, ak nekliknem na odkaz. Je to podvod?",
      "Prišla mi SMS, že mám nedoručený balík a mám doplatiť 2 eurá.",
      "Píše mi vnučka z nového čísla, že súrne potrebuje peniaze.",
      "Ponúkajú mi investíciu s garantovaným ziskom 20 % mesačne. Aké sú riziká?",
      "Vysvetli mi jednoducho, čo je phishing.",
    ],

    // Odpoveď na citlivé údaje. Simulátor ju použije vždy, keď v otázke
    // rozpozná číslo karty, PIN, rodné číslo alebo číslo účtu — je to
    // najlepšia príležitosť pripomenúť, čo do AI nepatrí.
    sensitiveReply: {
      text: "Zastavím vás — v tejto správe vidím údaj, ktorý vyzerá ako číslo karty, PIN, rodné číslo alebo číslo účtu.\n\n**Toto mi prosím nepíšte.** Na to, aby som vám poradil, ho vôbec nepotrebujem — ani ja, ani skutočný ChatGPT.\n\nStačí, keď situáciu opíšete slovami. Napríklad namiesto „mám poslať 400 € na SK12 3456…“ napíšte len „niekto odo mňa žiada, aby som poslal peniaze na neznámy účet“. Poradím vám úplne rovnako dobre.",
      followUps: [
        { q: "Niekto odo mňa žiada peniaze na neznámy účet. Je to bezpečné?", to: "telefonat" },
        { q: "Ako si lepšie zabezpečím účet?", to: "hesla" },
      ],
    },

    // Keď si simulátor nie je istý, radšej sa doplní opýta, než aby
    // odpovedal mimo témy.
    clarify: {
      text: "Rád vám pomôžem — a pokojne sa pýtajte aj viackrát, neomrzí ma to.\n\nAby som odpovedal presne, potreboval by som vedieť trochu viac. **Ako sa to k vám dostalo?**",
      options: [
        { q: "Prišlo mi to e-mailom.", to: "email" },
        { q: "Prišla mi SMS správa.", to: "balik" },
        { q: "Niekto mi volal.", to: "telefonat" },
        { q: "Videl som to na Facebooku.", to: "hoax" },
      ],
    },

    // Odpovede sa vyberajú podľa zhody so slovami a frázami v otázke.
    // "phrases" vážia viac než jednotlivé slová — bez toho by široko
    // formulovaná odpoveď prebrala otázku, ktorá patrí inej téme.
    replies: [
      {
        id: "email",
        phrases: ["e-mail z banky", "email z banky", "zablokujú účet", "zablokuju ucet", "prišlo mi to e-mailom", "prislo mi to e-mailom", "podozrivý e-mail", "podozrivy e-mail"],
        keywords: ["mail", "odkaz", "zablokuj", "prihlas", "klikn"],
        text: "Toto má viacero znakov podvodného e-mailu:\n\n• **Časový nátlak** — hrozba, že o účet prídete, vás má donútiť konať skôr, než sa poradíte.\n• **Odkaz na prihlásenie** — banka od vás nikdy nežiada prihlásenie cez odkaz v e-maile.\n• **Všeobecné oslovenie** — skutočná banka pozná vaše meno.\n\nČo odporúčam: na nič neklikajte a e-mail zatiaľ nezmazávajte. Zavolajte do banky na číslo zo zadnej strany vašej karty a overte si to. Ak vám banka potvrdí, že správu neposlala, e-mail zmažte.",
        followUps: [
          { q: "Ako spoznám pravú adresu odosielateľa?", to: "adresa" },
          { q: "Už som na ten odkaz klikol, čo teraz?", to: "coteraz" },
        ],
      },
      {
        id: "telefonat",
        phrases: ["bezpečný účet", "bezpecny ucet", "volal mi z banky", "vraj z banky", "niekto mi volal", "pracovník banky", "pracovnik banky", "volali mi z banky"],
        keywords: ["vishing", "telefonat", "zdvihol", "nadiktoval"],
        text: "Nie, toto nie je bežný postup banky.\n\nŽiadna banka nežiada klientov, aby previedli peniaze na „bezpečný účet“ — taký účet vôbec neexistuje. Je to vymyslený pojem, ktorý používajú výhradne podvodníci.\n\nČo odporúčam:\n\n1. **Hovor ukončite.** Nemusíte byť zdvorilí, nič nevysvetľujte.\n2. **Zavolajte banke sami** na číslo zo zadnej strany karty — nikdy nie na číslo, ktoré vám nadiktovali.\n3. **Ak ste už niečo poslali,** volajte banke okamžite a potom na políciu (158).\n\nPozor aj na to, že číslo na displeji sa dá napodobniť, takže ani známe číslo nie je dôkaz.",
        followUps: [
          { q: "Kde si overím, či je firma dôveryhodná?", to: "overit" },
          { q: "Už som poslal peniaze, čo mám robiť?", to: "coteraz" },
        ],
      },
      {
        id: "balik",
        phrases: ["nedoručený balík", "nedoruceny balik", "balík", "balik", "zásielka", "zasielka", "colný poplatok", "colny poplatok", "sms z pošty", "sms z posty", "doplatiť", "doplatit"],
        keywords: ["posta", "kurier", "dorucen", "zasiel", "sledovac"],
        text: "Toto je v súčasnosti najrozšírenejší podvod na Slovensku.\n\nSkutočná pošta ani kuriér nikdy nežiadajú doplatok cez odkaz v SMS. Suma býva zámerne drobná — dve, tri eurá — aby nevzbudila podozrenie. Podvodníkom však nejde o tie eurá, ale o údaje z vašej platobnej karty.\n\nČo odporúčam:\n\n1. **Na odkaz neklikajte** a správu nechajte tak.\n2. **Ak naozaj čakáte balík,** zadajte sledovacie číslo priamo na oficiálnej stránke pošty alebo prepravcu — nikdy nie cez odkaz zo správy.\n3. **Správu potom môžete zmazať.**\n\nVšimnite si aj adresu v odkaze — býva to niečo ako „sk-posta.delivery-pay.com“, čo nie je stránka Slovenskej pošty.",
        followUps: [
          { q: "Ako spoznám pravú adresu stránky?", to: "adresa" },
          { q: "Už som zadal údaje z karty, čo teraz?", to: "coteraz" },
        ],
      },
      {
        id: "vnuk",
        phrases: ["vnuk", "vnučka", "vnucka", "z nového čísla", "z noveho cisla", "nové číslo", "nove cislo", "ahoj mami", "ahoj babka", "syn mi píše", "dcéra mi píše"],
        keywords: ["babk", "dedk", "nehod", "nevolaj", "surne"],
        text: "Toto je podvod, ktorý cieli na to najsilnejšie — na city k rodine. Práve preto funguje aj na opatrných ľudí.\n\nNajsilnejší varovný znak je, keď vás žiadajú, **aby ste nevolali** alebo o tom nikomu nehovorili. Presne to má zabrániť tomu, aby ste si to overili.\n\nČo odporúčam:\n\n1. **Zavolajte príbuznému na číslo, ktoré máte uložené vy** — nikdy nie na to, z ktorého prišla správa.\n2. **Ak nedvíha, skúste iného člena rodiny.** Pokojne aj neskoro večer, je to lepšie než prísť o peniaze.\n3. **Peniaze neposielajte,** kým si to neoveríte hlasom.\n\nPozor aj na to, že umelá inteligencia dnes dokáže napodobniť hlas vášho blízkeho. Ani povedomý hlas už nie je dôkaz — opýtajte sa na niečo, čo môže vedieť len on.",
        followUps: [
          { q: "Dá sa napodobniť aj hlas alebo video?", to: "aifoto" },
          { q: "Už som poslal peniaze, čo mám robiť?", to: "coteraz" },
        ],
      },
      {
        id: "investicia",
        phrases: ["garantovaný zisk", "garantovany zisk", "investíciu", "investiciu", "zaručený výnos", "zaruceny vynos", "zhodnotenie", "kryptomen"],
        keywords: ["investic", "vynos", "akcie", "zarobi", "bitcoin"],
        text: "Táto ponuka vykazuje viaceré znaky investičného podvodu.\n\nZaručený vysoký výnos bez rizika v skutočnosti neexistuje — platí to bez výnimky. Zisk 20 % mesačne by znamenal viac než 700 % ročne, čo nedosahuje ani ten najlepší fond na svete.\n\n**Skôr než čokoľvek podpíšete, opýtajte sa:**\n\n• Má spoločnosť povolenie od Národnej banky Slovenska? Overiť si to viete na www.nbs.sk.\n• Sú jasne uvedené všetky poplatky a podmienky?\n• Môžem svoje peniaze kedykoľvek vybrať?\n\nAk čo i len na jednu otázku nedostanete jasnú odpoveď, do investície nejdite.",
        followUps: [
          { q: "Kde si overím firmu na nbs.sk?", to: "overit" },
          { q: "Vo videu to odporúčala známa osobnosť. Môžem tomu veriť?", to: "aifoto" },
        ],
      },
      {
        id: "zmluva",
        phrases: ["nerozumiem zmluve", "mám zmluvu", "mam zmluvu", "úradný list", "uradny list", "poistk", "vypovedať zmluvu"],
        keywords: ["zmluv", "uver", "dokument", "papier", "pokut"],
        text: "Rád vám zmluvu vysvetlím. Ak mi ju odfotíte alebo prepíšete, pozriem sa najmä na tieto veci:\n\n• **Na aký čas je uzatvorená** a či sa automaticky predlžuje.\n• **Aké poplatky a pokuty** z nej vyplývajú — najmä pri predčasnom ukončení.\n• **Dokedy a ako sa dá vypovedať.**\n\nJedna rada na záver: skôr než dokument odfotíte, prekryte papierikom rodné číslo, číslo občianskeho preukazu a číslo účtu. Na vysvetlenie zmluvy ich nepotrebujem.\n\nPri zmluvách vysokej hodnoty alebo pri dedičstve sa okrem toho poraďte aj s právnikom či notárom.",
        followUps: [
          { q: "Kde si overím firmu, ktorá mi zmluvu poslala?", to: "overit" },
          { q: "Ako spoznám podvodný e-mail?", to: "email" },
        ],
      },
      {
        id: "hoax",
        phrases: ["na facebooku", "sociálnej sieti", "socialnej sieti", "je to pravda", "zdieľať ďalej", "zdielat dalej", "poplašná správa", "poplasna sprava", "videl som na internete", "kolujú správy"],
        keywords: ["hoax", "faceb", "zdiel", "retazov", "dezinform"],
        text: "Toto vyzerá na poplašnú správu (hoax) alebo dezinformáciu.\n\nTypické znaky sú tri: **veľké písmená a výkričníky**, **výzva zdieľať ďalej** a **žiadny oficiálny zdroj**. Pravdivá správa vždy uvádza, odkiaľ pochádza, a dá sa to overiť.\n\nČo odporúčam:\n\n1. **Nezdieľajte to ďalej,** kým si to neoveríte — aj keby to znelo veľmi vážne.\n2. **Skúste si to nájsť inde.** Ak sa niečo naozaj stalo, napíšu o tom viaceré seriózne médiá, nielen jedna stránka.\n3. **Overiť si to môžete** na demagog.sk, fakty.afp.com alebo na facebookovej stránke Polície SR „Hoaxy a podvody“.\n\nČím viac strachu a výkričníkov správa obsahuje, tým opatrnejší buďte.",
        followUps: [
          { q: "Kde presne si overím, či je správa pravdivá?", to: "overit" },
          { q: "Ako spoznám fotografiu vyrobenú umelou inteligenciou?", to: "aifoto" },
        ],
      },
      {
        id: "hesla",
        phrases: ["silné heslo", "silne heslo", "aké heslo", "ake heslo", "dvojfaktorové", "dvojfaktorove", "dvojité overenie", "zabezpečiť účet", "zabezpecit ucet", "správca hesiel"],
        keywords: ["hesl", "prihlasovac"],
        text: "Dobré heslo je hlavne **dlhé** — dĺžka je dôležitejšia než zložité znaky.\n\n**Ako na to jednoducho:**\n\n• Spojte tri náhodné slová, ktoré si zapamätáte, napríklad „hruska-lampa-vlak“. Je to dlhé aj ľahko zapamätateľné.\n• **Do banky používajte iné heslo** než kamkoľvek inam. To je najdôležitejšie pravidlo.\n• Heslá si pokojne zapíšte do zošita doma. Papier v zásuvke je bezpečnejší než nálepka na monitore.\n\n**Zapnite si dvojfaktorové overenie,** ak to služba ponúka. Znamená to, že okrem hesla treba zadať aj kód z SMS — a aj keby niekto vaše heslo zistil, dnu sa nedostane.\n\nTen kód z SMS ale nikdy nikomu nediktujte, ani „pracovníkovi banky“.",
        followUps: [
          { q: "Ako zistím, či mi uniklo heslo?", to: "overit" },
          { q: "Niekto sa mi dostal do účtu, čo teraz?", to: "coteraz" },
        ],
      },
      {
        id: "aifoto",
        phrases: ["vyrobená umelou inteligenciou", "vyrobena umelou inteligenciou", "je tá fotka", "je ta fotka", "je to skutočná fotografia", "deepfake", "falošné video", "falosne video", "vo videu odporúčal"],
        keywords: ["fotk", "fotogra", "obrazok", "video"],
        text: "Fotografia ani video dnes už nie sú dôkazom, že sa niečo naozaj stalo.\n\n**Na čom sa AI obrázky najčastejšie prezradia:**\n\n• **Ruky a prsty** — nesprávny počet alebo zvláštny tvar.\n• **Text v obrázku** — nápisy bývajú nezrozumiteľné alebo s preklepmi.\n• **Pozadie** — zdeformované predmety, ktoré do scény nepatria.\n• **Značka ✦** v rohu — niektoré siete takto označujú obsah vytvorený AI.\n\nPozor najmä na videá, kde známa osobnosť odporúča investíciu. Tvár aj hlas sa dnes dajú napodobniť a je to jeden z najčastejších podvodov. Žiadny skutočný odborník nebude cez reklamu sľubovať zaručený zisk.\n\nAk si nie ste istí, obrázok neposielajte ďalej.",
        followUps: [
          { q: "Ponúkajú mi investíciu, ktorú odporúčala známa osobnosť.", to: "investicia" },
          { q: "Kde si overím, či je správa pravdivá?", to: "overit" },
        ],
      },
      {
        id: "qrwifi",
        phrases: ["qr kód", "qr kod", "qr kódu", "verejná wifi", "verejna wifi", "wi-fi v kaviarni", "parkovací automat", "parkovaci automat", "naskenoval"],
        keywords: ["qr", "wifi", "wi-fi", "skenov"],
        text: "Obe tieto veci sú obľúbeným nástrojom podvodníkov.\n\n**QR kód** je len skratka k webovej adrese — sám osebe nič neprezradí. Podvodníci vedia nalepiť vlastný kód napríklad na parkovací automat a naskenovaním sa dostanete na falošnú platobnú stránku.\n\n• Po naskenovaní **si vždy prečítajte adresu**, ktorá sa otvorí, skôr než čokoľvek zadáte.\n• Na parkovacích automatoch a plagátoch skontrolujte, či nálepka nie je prelepená.\n\n**Verejná Wi-Fi** v kaviarni alebo na letisku nie je zabezpečená.\n\n• Cez ňu **nerobte internetbanking** ani nezadávajte heslá.\n• Bezpečnejšie sú mobilné dáta alebo vaša domáca sieť.",
        followUps: [
          { q: "Ako spoznám, že je webová adresa falošná?", to: "adresa" },
          { q: "Ako si lepšie zabezpečím účet?", to: "hesla" },
        ],
      },
      {
        id: "coteraz",
        phrases: ["už som klikol", "uz som klikol", "už som poslal peniaze", "uz som poslal peniaze", "zadal som údaje", "zadal som udaje", "naletel som", "okradli ma", "čo teraz", "co teraz", "už sa stalo"],
        keywords: ["naletel", "okradl", "podviedl", "prisiel som o peniaze"],
        text: "Zachovajte pokoj — a konajte hneď. Pri podvode rozhodujú minúty.\n\n**V tomto poradí:**\n\n1. **Zavolajte banke** na číslo zo zadnej strany karty a požiadajte o zablokovanie karty alebo účtu. Toto urobte ako prvé.\n2. **Nahláste to polícii** na čísle 158 (alebo 112). Podvod nahláste aj vtedy, ak sa hanbíte — nie ste prvý ani posledný.\n3. **Nič nemažte.** Správy, e-maily a čísla účtov sa môžu hodiť ako dôkaz.\n4. **Ak ste niekam zadali heslo,** zmeňte si ho — a všade, kde ste ho použili tiež.\n\nA povedzte o tom niekomu blízkemu. Nie je to hanba, podvodníci sú na to trénovaní.",
        followUps: [
          { q: "Ako si zmením heslo, aby bolo bezpečné?", to: "hesla" },
          { q: "Kde nahlásim podvodnú stránku?", to: "overit" },
        ],
      },
      {
        id: "phishing",
        phrases: ["čo je phishing", "co je phishing", "čo znamená phishing", "co znamena phishing", "čo je vishing", "čo je smishing", "vysvetli mi phishing"],
        keywords: ["phishing", "phish", "fishing", "smishing", "vishing"],
        text: "**Phishing** (číta sa „fišing“) je podvod, pri ktorom sa niekto vydáva za banku, poštu alebo úrad a snaží sa z vás vylákať údaje — heslo, PIN alebo číslo karty.\n\nSlovo vzniklo z anglického „fishing“, teda rybolov. Podvodníci naozaj „lovia“ — rozpošlú tisíce správ a čakajú, kto sa chytí.\n\n**Dva príklady:**\n\n1. E-mail „z banky“, že vám zablokujú účet, ak nekliknete na odkaz a neprihlásite sa.\n2. SMS „z pošty“, že máte nedoručený balík a máte doplatiť 2 €.\n\nExistujú aj dva príbuzné pojmy: **vishing** je to isté po telefóne a **smishing** cez SMS správu.\n\nObrana je vždy rovnaká: neklikať, nič nevypĺňať a overiť si to priamo u banky alebo pošty na oficiálnom čísle.",
        followUps: [
          { q: "Prišiel mi taký e-mail, ako mám postupovať?", to: "email" },
          { q: "Ako spoznám pravú adresu odosielateľa?", to: "adresa" },
        ],
      },
      {
        id: "adresa",
        phrases: ["pravú adresu", "pravu adresu", "adresa odosielateľa", "adresa odosielatela", "falošná adresa", "falosna adresa", "pravú stránku", "pravu stranku", "je webová adresa falošná", "spoznám pravú"],
        keywords: ["adresa", "domen", "odosielatel"],
        text: "Adresa je to najspoľahlivejšie, podľa čoho podvod spoznáte — podvodník vie napodobniť logo aj text, ale adresu nie.\n\n**Na čo sa pozerať:**\n\n• **Preklepy v názve** — „vub-overenie.net“, „bankaa.sk“, „sk-posta.delivery-pay.com“.\n• **Koncovka** — slovenské inštitúcie majú spravidla „.sk“. Adresa končiaca na „.br“ patrí Brazílii.\n• **Zvláštny odosielateľ** — skutočná banka vám nenapíše z adresy na gmail.com.\n• **Čo je tesne pred prvou lomkou** — to je tá skutočná stránka. Pri „vub.sk.overenie-uctu.com/…“ je skutočná stránka „overenie-uctu.com“, nie VÚB.\n\nNajistejšie je adresu vôbec nepoužiť a napísať si stránku banky ručne alebo si ju otvoriť z vlastných záložiek.",
        followUps: [
          { q: "Kde si môžem overiť podozrivú stránku?", to: "overit" },
          { q: "Prišiel mi podozrivý e-mail, čo s ním?", to: "email" },
        ],
      },
      {
        id: "overit",
        phrases: ["kde si overím", "kde si overim", "ako si overím", "ako si overim", "overiť firmu", "overit firmu", "nbs.sk", "overiť správu", "overit spravu", "skontrolovať stránku", "či mi uniklo heslo"],
        keywords: ["overi", "skontrolov", "preveri"],
        text: "Podľa toho, čo si potrebujete overiť:\n\n• **Firmu alebo investíciu** — na www.nbs.sk. Národná banka Slovenska vedie zoznam všetkých, ktorí smú na Slovensku ponúkať investície, a aj zoznam firiem, pred ktorými varuje.\n• **Správu alebo tvrdenie** — demagog.sk alebo fakty.afp.com. Overujú aj fotografie a videá.\n• **Podozrivú webovú stránku** — Google Safe Browsing na adrese transparencyreport.google.com/safe-browsing/search.\n• **Či vám uniklo heslo** — haveibeenpwned.com. Zadáte len e-mailovú adresu, heslo tam nikdy nepíšte.\n• **Banku, poštu či úrad** — vždy priamo na ich oficiálnom čísle alebo stránke, nikdy nie cez odkaz z podozrivej správy.\n\nVšetky tieto odkazy nájdete aj v kroku „Zdroje“ tohto kurzu.",
        followUps: [
          { q: "Ponúkajú mi investíciu, ako ju preverím?", to: "investicia" },
          { q: "Ako spoznám pravú adresu odosielateľa?", to: "adresa" },
        ],
      },
    ],
    note: "Toto je len nácvik — odpovede sú pripravené vopred. Skutočný ChatGPT nájdete na chatgpt.com alebo ako aplikáciu v mobile či tablete.",
  },
  {
    id: "previerka",
    type: "checklist",
    icon: "shield",
    title: "Bezpečnostná previerka domácnosti",
    short: "Osem vecí, ktoré si doma zariadite raz — a budete pokojnejší po zvyšok roka.",
    time: "15 minút",
    intro: "Toto nie je test vedomostí, ale zoznam konkrétnych vecí, ktoré sa oplatí naozaj urobiť. Väčšina z nich zaberie pár minút.",
    task: "Odškrtnite si, čo už máte hotové. Zvyšné si nechajte na neskôr — zoznam si môžete stiahnuť a vytlačiť.",
    items: [
      { text: "Číslo mojej banky mám uložené v telefóne pod menom banky (opísané zo zadnej strany karty, nie z internetu).", why: "Keď vám niekto zavolá „z banky“, zavoláte späť na uložené číslo a hneď viete, na čom ste." },
      { text: "Moja rodina vie, že im nikdy nepošlem peniaze len na základe SMS alebo správy — vždy najprv zavolám.", why: "Toto je najúčinnejšia obrana proti podvodu „vnuk v núdzi“. Dohodnite sa na tom nahlas." },
      { text: "Heslá mám zapísané v zošite doma, nie na papieriku pri počítači ani v e-maile.", why: "Papierový zošit doma je bezpečnejší než nálepka na monitore aj než súbor v počítači." },
      { text: "Na telefóne aj v počítači mám zapnuté automatické aktualizácie.", why: "Väčšina útokov využíva staré, neopravené chyby. Aktualizácie ich zatvárajú za vás." },
      { text: "V internetbankingu mám zapnuté upozornenia na každú platbu (SMS alebo v aplikácii).", why: "O neoprávnenej platbe sa dozviete v priebehu minút, nie až na výpise o mesiac." },
      { text: "Viem, kde na svojej karte nájdem číslo na zablokovanie, a skúsil som si ho prečítať.", why: "V strese sa drobné písmo číta ťažko. Vyskúšajte si to teraz, v pokoji." },
      { text: "Mám aspoň jednu blízku osobu, ktorej môžem kedykoľvek zavolať a poradiť sa, keď si nie som istý.", why: "Podvodníci sa spoliehajú, že sa nikoho nespýtate. Jeden telefonát ich plán zmarí." },
      { text: "Viem, že polícia má číslo 158 a tiesňová linka 112 — a že podvod treba nahlásiť aj vtedy, keď sa hanbím.", why: "Nie ste prví ani poslední. Hlásenie pomáha chytiť páchateľov a niekedy aj vrátiť peniaze." },
    ],
    note: "Nemusíte to stihnúť naraz. Aj keď si dnes zariadite dve veci zo zoznamu, ste na tom lepšie než včera.",
  },

  {
    id: "karta-pomoci",
    type: "emergency-card",
    icon: "phone",
    title: "Karta prvej pomoci pri podvode",
    short: "Vyplňte si svoje čísla a vytlačte si kartičku k telefónu — keď sa niečo stane, nebudete hľadať.",
    time: "5 minút",
    intro: "Keď zistíte, že ste naleteli, rozhodujú minúty. Vtedy sa čísla nehľadajú dobre — preto si ich pripravíme dopredu.",
    task: "Vyplňte políčka nižšie. Vytvoríme vám kartičku, ktorú si vytlačíte a necháte pri telefóne alebo vložíte do peňaženky.",
    fields: [
      { key: "banka", label: "Moja banka", placeholder: "napríklad: Slovenská sporiteľňa" },
      { key: "bankaTel", label: "Číslo na banku (opíšte zo zadnej strany karty)", placeholder: "napríklad: 0850 111 888" },
      { key: "blizky", label: "Blízka osoba, ktorej zavolám", placeholder: "napríklad: dcéra Katka" },
      { key: "blizkyTel", label: "Číslo na blízku osobu", placeholder: "napríklad: 0900 123 456" },
    ],
    fixedRows: [
      { label: "Polícia SR", value: "158" },
      { label: "Tiesňová linka", value: "112" },
      { label: "Overenie firmy a investície", value: "www.nbs.sk" },
    ],
    steps: [
      "Zavolajte banke a požiadajte o zablokovanie karty alebo účtu.",
      "Zavolajte blízkej osobe — nie ste v tom sami.",
      "Nahláste to polícii na 158 (alebo 112).",
      "Nič nemažte — správy a e-maily sa môžu hodiť ako dôkaz.",
    ],
    note: "Kartičku si vytlačte a nechajte pri telefóne. Ak sa nič nestane, len tam bude ležať. Ak sa stane, ušetrí vám drahocenné minúty.",
  },
];
