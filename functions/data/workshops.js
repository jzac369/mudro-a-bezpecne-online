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
        { question: "Ako je umelú inteligenciu najlepšie chápať?", options: ["Ako nástroj, ktorý pomáha — odpovede je však dobré si overiť", "Ako program, ktorý vždy hovorí úplnú pravdu", "Ako robota, ktorý za nás rozhoduje"], correctIndex: 0 },
        { question: "Ako sa nazýva otázka alebo zadanie, ktoré napíšete umelej inteligencii?", options: ["Heslo", "Prompt", "Algoritmus"], correctIndex: 1 },
        { question: "Čo znamená, že umelá inteligencia „halucinuje“?", options: ["Vypne sa pre chybu", "Zobrazuje farebné obrázky", "Vymyslí si odpoveď a tvári sa, že je pravdivá"], correctIndex: 2 },
        { question: "Podľa čoho v obchode s aplikáciami spoznáte pravú aplikáciu ChatGPT?", options: ["Pri názve je uvedený vydavateľ OpenAI", "Má najkrajšie logo", "Pýta si poplatok vopred"], correctIndex: 0 },
        { question: "Čo potrebujete, aby ste si ChatGPT vyskúšali na počítači?", options: ["Kúpiť si predplatné", "Otvoriť v prehliadači adresu chatgpt.com — inštalovať netreba nič", "Nainštalovať špeciálny program od výrobcu počítača"], correctIndex: 1 },
        { question: "Ktorá otázka prinesie užitočnejšiu odpoveď?", options: ["„Napíš recept na koláč.“", "„Pomôž mi s pečením.“", "„Napíš recept na jednoduchý jablkový koláč pre začiatočníka, krok za krokom, s časom a teplotou pečenia.“"], correctIndex: 2 },
        { question: "Čo do umelej inteligencie nikdy nezadávame?", options: ["Otázku o histórii alebo prírode", "Suroviny, ktoré máme v chladničke", "Heslá, PIN, rodné číslo a čísla platobných kariet"], correctIndex: 2 },
        { question: "Odpoveď od AI je pre vás priveľmi odborná. Čo urobíte?", options: ["Napíšem: „Vysvetli mi to jednoduchšie.“", "Zavriem to, zjavne na to nemám", "Budem to musieť prijať tak, ako to je"], correctIndex: 0 },
        { question: "Dá sa v ChatGPT niečo nenávratne pokaziť alebo zmazať vo vašom telefóne?", options: ["Áno, preto treba klikať opatrne", "Nie — pracuje len vo svojom okne a k vašim fotkám či kontaktom sa nedostane", "Áno, ak sa pomýlite pri písaní"], correctIndex: 1 },
        { question: "Vidí umelá inteligencia do vášho bankového účtu alebo e-mailu?", options: ["Áno, po prihlásení do aplikácie", "Áno, vidí všetko v telefóne", "Nie — vie len to, čo jej sami napíšete"], correctIndex: 2 },
        { question: "AI vám poradila konkrétne telefónne číslo na poisťovňu. Ako postupovať?", options: ["Číslo si overím na oficiálnej stránke poisťovne a volám len naň", "Zavolám naň hneď, AI sa v číslach nemýli", "Číslo pošlem ďalej rodine"], correctIndex: 0 },
        { question: "Na čo slúži ikona fotoaparátu v aplikácii ChatGPT?", options: ["Na fotenie selfie do profilu", "Môžete odfotiť napríklad príbalový leták či rastlinu a spýtať sa, čo na obrázku je", "Na natáčanie videa z obrazovky"], correctIndex: 1 },
        { question: "Čo umožňuje ikona mikrofónu?", options: ["Prehrať hudbu", "Nahlas nadiktovať otázku alebo zoznam namiesto písania na klávesnici", "Zavolať na zákaznícku linku"], correctIndex: 1 },
        { question: "AI vám vysvetlila lekársku správu a odporučila postup. Čo urobíte?", options: ["Začnem sa tým riadiť hneď", "Vysvetlenie použijem na lepšie pochopenie, o liečbe však rozhodne lekár", "Prestanem chodiť k lekárovi"], correctIndex: 1 },
        { question: "Ktoré odpovede si oplatí overiť z druhého zdroja?", options: ["Vysvetlenia cudzích slov", "Všeobecné rady na opatrnosť", "Konkrétne čísla, dátumy, sumy a paragrafy"], correctIndex: 2 },
        { question: "Volá vám „vnuk“ z neznámeho čísla, súrne pýta peniaze a prosí, aby ste nikomu nevolali. Čo urobíte?", options: ["Peniaze pošlem hneď, hlas je predsa jeho", "Zložím a zavolám mu na číslo, ktoré mám uložené", "Pošlem aspoň polovicu sumy"], correctIndex: 1 },
        { question: "Čo je „deepfake“?", options: ["Falošné video alebo hlas vytvorený umelou inteligenciou, ktorý napodobňuje skutočného človeka", "Zašumené staré video", "Bezpečnostná funkcia telefónu"], correctIndex: 0 },
        { question: "Je normálne, že AI odpovie na tú istú otázku dvakrát trochu inak?", options: ["Nie, je to chyba a treba ju nahlásiť", "Áno, odpoveď skladá zakaždým nanovo", "Znamená to, že aplikácia je pokazená"], correctIndex: 1 },
        { question: "Ktorý z týchto pomocníkov je od firmy OpenAI?", options: ["Gemini", "Copilot", "ChatGPT"], correctIndex: 2 },
        { question: "Aký je dobrý prvý krok, keď s umelou inteligenciou začínate?", options: ["Hneď sa pýtať na veľmi zložité odborné veci", "Skúsiť jednoduchú otázku o niečom, čo dobre poznáte", "Radšej to nikdy neskúšať, aby som niečo nepokazil"], correctIndex: 1 },
      ],
    },
  },
  };
  root.WORKSHOPS = WORKSHOPS;
  if (typeof module !== "undefined" && module.exports) module.exports = WORKSHOPS;
})(typeof window !== "undefined" ? window : globalThis);
