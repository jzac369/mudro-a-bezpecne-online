// Obsah oboch workshopov — texty, cenu, YouTube ID a otázky kvízu tu neskôr
// doplň skutočnými hodnotami. `youtubeId` je ID z unlisted videa
// (časť URL za "v=", napr. z https://youtu.be/dQw4w9WgXcQ je to "dQw4w9WgXcQ").
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
      passScore: 7,
      questions: [
        {
          question:
            "Zavolá vám niekto, kto tvrdí, že je z banky, a žiada okamžite " +
            "nahlásiť PIN kód. Čo urobíte?",
          options: [
            "Nahlásim PIN, veď to znie dôveryhodne",
            "Zložím a zavolám späť na oficiálne číslo banky z karty alebo výpisu",
            "Pošlem PIN cez SMS, nech je to rýchlejšie",
          ],
          correctIndex: 1,
        },
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
      passScore: 7,
      questions: [
        {
          question: "Umelá inteligencia je najlepšie chápať ako:",
          options: [
            "Program, ktorý vždy hovorí úplnú pravdu",
            "Nástroj, ktorý pomáha, ale odpovede je dobré si overiť",
            "Robota, ktorý za nás rozhoduje",
          ],
          correctIndex: 1,
        },
      ],
    },
  },
};
