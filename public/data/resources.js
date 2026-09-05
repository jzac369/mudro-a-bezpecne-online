// Rozcestník overených stránok (krok 6 kurzu — „Zdroje“).
//
// Polia:
//   title  — názov skupiny odkazov
//   intro  — jedna veta, kedy sa skupina hodí
//   icon   — kľúč do ikon v workshop.html
//   items  — jednotlivé odkazy:
//              name   — názov stránky
//              text   — čo tam senior nájde, ľudskou rečou
//              url    — adresa
//              action — popis na tlačidle (čo sa stane po kliknutí)
//              host   — adresa v skrátenej podobe; zobrazuje sa pri odkaze,
//                       aby si senior zvykol kontrolovať, kam odkaz vedie
//              featured — voliteľné, zvýrazní odkaz na naše vlastné kurzy
(function (root) {
  "use strict";

  var RESOURCES = [
    {
      title: "Peniaze, podvody a bezpečné nakupovanie",
      intro: "Keď vám niekto ponúka investíciu, žiada peniaze alebo nakupujete cez internet.",
      icon: "wallet",
      items: [
        {
          name: "Národná banka Slovenska — Pozor na podvody",
          text: "Upozornenia Národnej banky Slovenska na aktuálne finančné podvody. Dozviete sa napríklad, ako spoznať falošného pracovníka banky, podozrivú investíciu alebo telefonát, pri ktorom od vás niekto žiada peniaze či osobné údaje.",
          url: "https://nbs.sk/pozor-na-podvody/",
          action: "Otvoriť stránku",
          host: "nbs.sk",
        },
        {
          name: "Register finančných agentov a poradcov NBS",
          text: "Ponúka vám niekto investíciu, poistenie alebo finančné poradenstvo? Tu si môžete podľa mena overiť, či je daný človek alebo spoločnosť oficiálne registrovaná v Národnej banke Slovenska.",
          url: "https://regfap.nbs.sk/search.php",
          action: "Overiť finančného poradcu",
          host: "regfap.nbs.sk",
        },
        {
          name: "Slovenská obchodná inšpekcia — Internetové obchody",
          text: "Užitočné rady pre bezpečné nakupovanie cez internet. Pomôžu vám spoznať podozrivý e-shop a zistiť, čo si skontrolovať skôr, než niekde zadáte údaje z karty alebo zaplatíte.",
          url: "https://www.soi.sk/informacie-pre-verejnost/internetove-obchody",
          action: "Otvoriť stránku",
          host: "soi.sk",
        },
        {
          name: "Slovensko.sk",
          text: "Oficiálna stránka slovenského štátu. Ak dostanete SMS alebo e-mail, ktorý sa tvári ako správa od úradu, radšej si informáciu overte priamo tu a neklikajte na odkaz v podozrivej správe.",
          url: "https://www.slovensko.sk/",
          action: "Otvoriť Slovensko.sk",
          host: "slovensko.sk",
        },
      ],
    },
    {
      title: "Bezpečnosť na internete",
      intro: "Ochrana počítača a mobilu, podvodné e-maily a overenie podozrivého odkazu.",
      icon: "shield",
      items: [
        {
          name: "SK-CERT",
          text: "Oficiálne slovenské centrum kybernetickej bezpečnosti. Nájdete tu rady, ako sa chrániť pred podvodnými e-mailmi, nebezpečnými stránkami, vírusmi a ďalšími hrozbami na internete.",
          url: "https://www.sk-cert.sk/",
          action: "Otvoriť SK-CERT",
          host: "sk-cert.sk",
        },
        {
          name: "CSIRT.SK",
          text: "Upozorňuje na aktuálne internetové podvody a nebezpečné kampane na Slovensku. Ak sa začne šíriť nová falošná SMS, e-mail alebo podvodná stránka, často o nej nájdete informácie práve tu.",
          url: "https://www.csirt.gov.sk/",
          action: "Otvoriť CSIRT.SK",
          host: "csirt.gov.sk",
        },
        {
          name: "Kyberportál Slovensko",
          text: "Oficiálny portál venovaný bezpečnosti na internete. Nájdete tu návody, vysvetlenia a praktické rady, ako bezpečnejšie používať počítač, mobil a online služby.",
          url: "https://kyberportal.slovensko.sk/",
          action: "Otvoriť Kyberportál",
          host: "kyberportal.slovensko.sk",
        },
        {
          name: "Ministerstvo vnútra SR",
          text: "Ministerstvo a polícia pravidelne upozorňujú na podvody zamerané na seniorov — napríklad na falošných policajtov, bankárov alebo telefonáty typu „vnuk v núdzi“.",
          url: "https://www.minv.sk/",
          action: "Otvoriť Ministerstvo vnútra SR",
          host: "minv.sk",
        },
        {
          name: "ESET — Bezpečne na nete",
          text: "Zrozumiteľné články o bezpečnosti na internete. Dozviete sa, ako chrániť mobil a počítač, vytvárať bezpečné heslá, rozpoznať podvod a bezpečnejšie nakupovať online.",
          url: "https://bezpecnenanete.eset.com/sk/",
          action: "Otvoriť Bezpečne na nete",
          host: "bezpecnenanete.eset.com",
        },
        {
          name: "ESET — Phishing",
          text: "Jednoduché vysvetlenie phishingu — podvodných správ a e-mailov, ktoré sa snažia vylákať vaše heslo, údaje z platobnej karty alebo iné citlivé informácie.",
          url: "https://www.eset.com/sk/phishing/",
          action: "Prečítať si o phishingu",
          host: "eset.com",
        },
        {
          name: "Google Safe Browsing",
          text: "Dostali ste podozrivý odkaz? Do tejto služby môžete vložiť adresu webovej stránky a skontrolovať, či ju Google označuje ako nebezpečnú.",
          url: "https://transparencyreport.google.com/safe-browsing/search",
          action: "Skontrolovať webovú stránku",
          host: "transparencyreport.google.com",
        },
        {
          name: "Have I Been Pwned",
          text: "Zadajte svoju e-mailovú adresu a zistíte, či sa niekedy objavila v známom úniku používateľských údajov. Samotné zadanie e-mailovej adresy neznamená, že niekomu odovzdávate svoje heslo — heslo sem nikdy nepíšte.",
          url: "https://haveibeenpwned.com/",
          action: "Skontrolovať e-mailovú adresu",
          host: "haveibeenpwned.com",
        },
      ],
    },
    {
      title: "Overovanie správ a informácií",
      intro: "Keď na sociálnej sieti narazíte na správu, ktorej sa nedá veriť.",
      icon: "check",
      items: [
        {
          name: "Demagog.sk",
          text: "Pomáha overovať pravdivosť tvrdení a informácií. Užitočné najmä vtedy, keď na sociálnej sieti narazíte na výrazné alebo šokujúce tvrdenie a neviete, či mu môžete veriť.",
          url: "https://demagog.sk/",
          action: "Otvoriť Demagog.sk",
          host: "demagog.sk",
        },
        {
          name: "AFP Fakty — Slovensko",
          text: "Overovanie fotografií, videí a správ, ktoré sa šíria na internete a sociálnych sieťach. Nájdete tu aj príklady falošných alebo pomocou umelej inteligencie upravených obrázkov.",
          url: "https://fakty.afp.com/list/Slovakia",
          action: "Otvoriť AFP Fakty",
          host: "fakty.afp.com",
        },
      ],
    },
    {
      title: "Vzdelávanie a digitálne zručnosti pre seniorov",
      intro: "Ak sa chcete učiť ďalej — doma aj v učebni.",
      icon: "book",
      items: [
        {
          name: "Digitálni seniori",
          text: "Vzdelávacie materiály pre seniorov o používaní počítača, tabletu, internetu a digitálnych služieb. Užitočné najmä pre ľudí, ktorí s technológiami ešte len začínajú.",
          url: "https://www.digitalniseniori.gov.sk/",
          action: "Otvoriť Digitálni seniori",
          host: "digitalniseniori.gov.sk",
        },
        {
          name: "Liga pre seniorov",
          text: "Portál určený seniorom s užitočnými informáciami a možnosťami ďalšieho vzdelávania. Nájdete tu napríklad aj prehľad univerzít tretieho veku v jednotlivých regiónoch Slovenska.",
          url: "https://ligapreseniorov.sk/",
          action: "Otvoriť Ligu pre seniorov",
          host: "ligapreseniorov.sk",
        },
        {
          name: "Univerzita tretieho veku — Univerzita Komenského",
          text: "Možnosť pokračovať vo vzdelávaní aj vo vyššom veku. Univerzita ponúka množstvo tém a prednášok z histórie, psychológie, prírodných vied, zdravia či digitálnych zručností.",
          url: "https://cdv.uniba.sk/univerzita-tretieho-veku/",
          action: "Otvoriť Univerzitu tretieho veku UK",
          host: "cdv.uniba.sk",
        },
        {
          name: "Univerzita tretieho veku — UKF Nitra",
          text: "Vzdelávacie programy pre seniorov a ľudí, ktorí sa chcú ďalej učiť. V ponuke bývajú jazyky, história, psychológia, bezpečnosť, digitálna fotografia a ďalšie témy.",
          url: "https://www.ukf.sk/studium/dalsie-vzdelavanie/univerzita-tretieho-veku",
          action: "Otvoriť Univerzitu tretieho veku UKF",
          host: "ukf.sk",
        },
      ],
    },
    {
      title: "Online vzdelávanie DigiStart",
      intro: "Naše ďalšie kurzy, ak by ste chceli pokračovať u nás.",
      icon: "star",
      items: [
        {
          name: "DigiStart — Vzdelávacie kurzy",
          text: "Praktické online kurzy vytvorené najmä pre seniorov a začiatočníkov. Témy sú vysvetľované pokojne, zrozumiteľne a krok za krokom, bez zbytočných technických výrazov. Kurzy sa venujú napríklad bezpečnosti na internete, ochrane pred podvodmi a používaniu umelej inteligencie. Učiť sa môžete doma, vlastným tempom, na počítači, tablete alebo mobile. Kurzy obsahujú video s lektorom, praktické cvičenia, materiály na stiahnutie a po dokončení aj certifikát.",
          url: "https://kurzy.digistart.sk/",
          action: "Otvoriť vzdelávacie kurzy DigiStart",
          host: "kurzy.digistart.sk",
          featured: true,
        },
      ],
    },
  ];

  root.COURSE_RESOURCES = RESOURCES;
  if (typeof module !== "undefined" && module.exports) module.exports = RESOURCES;
})(typeof window !== "undefined" ? window : globalThis);
