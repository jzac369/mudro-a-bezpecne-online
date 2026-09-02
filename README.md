# Múdro a Bezpečne Online

Portál pre dva platené online workshopy pre seniorov:

- **Ako nenaletieť podvodníkom: Bezpečné financie aj s pomocou umelej inteligencie**
- **Začíname s umelou inteligenciou**

Front-end je statický (GitHub Pages), dáta a logika bežia na Firebase
(Auth, Firestore, Cloud Functions, Storage). Návrh portálu je zdokumentovaný
v priloženom Artifacte z plánovacej fázy (odkaz máš v konverzácii s Claude).

## Stav

Fáza 1 — základná kostra: statické stránky, prihlásenie kódom (front-end časť),
Cloud Functions stuby, Firestore pravidlá, GitHub Actions deploy na Pages.
Platba kartou cez Stripe Checkout je naprogramovaná — zapne sa po
nastavení kľúčov a webhooku, postup je v `NASTAVENIE-STRIPE.md`.

## Štruktúra

```
public/            statický front-end nasadzovaný na GitHub Pages
  index.html        úvodná stránka, výber a popis oboch workshopov
  prihlasenie.html   prihlásenie menom + 6-miestnym kódom
  workshop.html      video, cvičenia, kvíz, brožúrka (chránené prihlásením)
  admin/index.html   admin zóna (prehľad registrácií, generovanie kódov)
  assets/            zdieľané CSS/JS, firebase inicializácia

functions/          Firebase Cloud Functions (Node)
  index.js           generateCode, verifyCode, markOrderPaid, sendEmail

firestore.rules     bezpečnostné pravidlá pre Firestore
firebase.json       konfigurácia Firebase Hosting (voliteľné) / Functions / Firestore
.github/workflows/deploy.yml   automatický deploy public/ na GitHub Pages
```

## Čo treba doplniť pred prvým spustením

1. Vytvoriť Firebase projekt (Firebase Console) a doplniť konfiguráciu
   do `public/assets/firebase-config.js` (súbor zatiaľ obsahuje placeholder).
2. `firebase deploy --only functions,firestore:rules` po `firebase login`
   a `firebase use --add` (doplní `.firebaserc`).
3. V GitHub repozitári nastaviť **Settings → Pages → Source: GitHub Actions**.
4. Doplniť skutočné YouTube (unlisted) ID videí, texty kvízov a PDF brožúrky
   do `public/data/workshops.js`.
5. Nastaviť e-mailové odosielanie (napr. Firebase "Trigger Email" rozšírenie
   alebo Resend) a doplniť API kľúč ako Functions secret — nikdy priamo do kódu.

## Bezpečnosť

Do repozitára sa **nikdy** neukladajú API kľúče so serverovými právami,
service-account súbory ani prístupové tokeny. Firebase Web config
(v `firebase-config.js`) je verejný identifikátor projektu, nie tajný kľúč —
skutočné oprávnenia strážia Firestore/Storage security rules.
