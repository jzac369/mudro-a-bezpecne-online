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
    task: "Kliknite na jednu z pripravených otázok dole, alebo si napíšte vlastnú a stlačte šípku. Odpoveď sa objaví presne tak, ako by ju napísal skutočný ChatGPT.",
    suggestions: [
      "Prišiel mi e-mail z banky, že mi zablokujú účet, ak nekliknem na odkaz. Je to podvod?",
      "Volal mi muž, vraj z banky, a chcel, aby som previedol peniaze na bezpečný účet. Čo mám robiť?",
      "Ponúkajú mi investíciu s garantovaným ziskom 20 % mesačne. Aké sú riziká?",
      "Vysvetli mi jednoducho, čo je phishing.",
    ],
    // Odpovede sa vyberajú podľa slov v otázke. Posledná je záložná.
    replies: [
      {
        keywords: ["e-mail", "email", "mail", "odkaz", "zablokuj", "účet"],
        text: "Toto má viacero znakov podvodného e-mailu:\n\n• **Časový nátlak** — hrozba, že o účet prídete, vás má donútiť konať skôr, než sa poradíte.\n• **Odkaz na prihlásenie** — banka od vás nikdy nežiada prihlásenie cez odkaz v e-maile.\n• **Všeobecné oslovenie** — skutočná banka pozná vaše meno.\n\nČo odporúčam: na nič neklikajte a e-mail nezmazávajte hneď. Zavolajte do banky na číslo zo zadnej strany vašej karty a overte si to. Ak vám banka potvrdí, že správu neposlala, e-mail zmažte.",
      },
      {
        keywords: ["volal", "telefon", "hovor", "bezpečný účet", "bezpecny ucet", "vishing"],
        text: "Nie, toto nie je bežný postup banky.\n\nŽiadna banka nežiada klientov, aby previedli peniaze na „bezpečný účet“ — taký účet vôbec neexistuje. Je to vymyslený pojem, ktorý používajú výhradne podvodníci.\n\nČo odporúčam:\n\n1. **Hovor ukončite.** Nemusíte byť zdvorilí, nič nevysvetľujte.\n2. **Zavolajte banke sami** na číslo zo zadnej strany karty — nikdy nie na číslo, ktoré vám nadiktovali.\n3. **Ak ste už niečo poslali,** volajte banke okamžite a potom na políciu (158).\n\nPozor aj na to, že číslo na displeji sa dá napodobniť, takže ani známe číslo nie je dôkaz.",
      },
      {
        keywords: ["investíc", "investic", "zisk", "výnos", "vynos", "akcie", "zarobi"],
        text: "Táto ponuka vykazuje viaceré znaky investičného podvodu.\n\nZaručený vysoký výnos bez rizika v skutočnosti neexistuje — platí to bez výnimky. Zisk 20 % mesačne by znamenal viac než 700 % ročne, čo nedosahuje ani ten najlepší fond na svete.\n\n**Skôr než čokoľvek podpíšete, opýtajte sa:**\n\n• Má spoločnosť povolenie od Národnej banky Slovenska? Overiť si to viete na www.nbs.sk.\n• Sú jasne uvedené všetky poplatky a podmienky?\n• Môžem svoje peniaze kedykoľvek vybrať?\n\nAk čo i len na jednu otázku nedostanete jasnú odpoveď, do investície nejdite.",
      },
      {
        keywords: ["zmluv", "poistk", "úver", "uver", "papier", "dokument"],
        text: "Rád vám zmluvu vysvetlím. Ak mi ju odfotíte alebo prepíšete, pozriem sa najmä na tieto veci:\n\n• **Na aký čas je uzatvorená** a či sa automaticky predlžuje.\n• **Aké poplatky a pokuty** z nej vyplývajú — najmä pri predčasnom ukončení.\n• **Dokedy a ako sa dá vypovedať.**\n\nJedna rada na záver: skôr než dokument odfotíte, prekryte papierikom rodné číslo, číslo občianskeho preukazu a číslo účtu. Na vysvetlenie zmluvy ich nepotrebujem.\n\nPri zmluvách vysokej hodnoty alebo pri dedičstve sa okrem toho poraďte aj s právnikom či notárom.",
      },
      {
        keywords: ["phishing", "phish", "fishing", "co je", "čo je", "vysvetli", "znamená"],
        text: "**Phishing** (číta sa „fišing“) je podvod, pri ktorom sa niekto vydáva za banku, poštu alebo úrad a snaží sa z vás vylákať údaje — heslo, PIN alebo číslo karty.\n\nSlovo vzniklo z anglického „fishing“, teda rybolov. Podvodníci naozaj „lovia“ — rozpošlú tisíce správ a čakajú, kto sa chytí.\n\n**Dva príklady:**\n\n1. E-mail „z banky“, že vám zablokujú účet, ak nekliknete na odkaz a neprihlásite sa.\n2. SMS „z pošty“, že máte nedoručený balík a máte doplatiť 2 €.\n\nObrana je vždy rovnaká: neklikať, nič nevypĺňať a overiť si to priamo u banky alebo pošty na oficiálnom čísle.",
      },
      {
        keywords: [],
        text: "Ďakujem za otázku. Rád vám pomôžem — a nemusíte sa báť pýtať sa čokoľvek, aj viackrát.\n\nAby som odpovedal čo najpresnejšie, pomohlo by mi, keby ste mi napísali:\n\n• **Čo sa stalo** — opíšte situáciu vlastnými slovami.\n• **Kto vás oslovil** — banka, pošta, neznáme číslo, reklama na Facebooku?\n• **Čo od vás chcú** — peniaze, údaje, kliknutie na odkaz?\n\nA pokojne na koniec pridajte: „Vysvetli mi to jednoducho, ako seniorovi.“ Odpoveď bude hneď zrozumiteľnejšia.\n\nPripomínam ešte jedno: do našej konverzácie nikdy nepíšte heslá, PIN, číslo karty ani rodné číslo. Na radu ich nepotrebujem.",
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
