# Platba kartou cez Stripe — čo treba nastaviť

Kód je hotový, ale platba kartou sa zapne až po týchto krokoch. Kým ich
neurobíte, zákazníkom sa ponúka len bankový prevod — stránka funguje ako
doteraz a nič sa nerozbije.

Celkovo to zaberie asi 20 minút.

---

## 1. Založte si účet na Stripe

Choďte na <https://dashboard.stripe.com/register> a zaregistrujte sa.

Pri registrácii vyberte **Slovensko** ako krajinu podnikania. Stripe si
vypýta údaje o firme (IČO, adresa, bankový účet, na ktorý vám bude peniaze
posielať) a doklad totožnosti. Overenie zvyčajne trvá 1–2 pracovné dni.

**Kým prebieha overenie, môžete všetko nastaviť a odskúšať v testovacom
režime** — na to slúži prepínač *Test mode* vpravo hore v Stripe.

Poplatky Stripe pre európske karty sú v čase písania 1,5 % + 0,25 € za
platbu. Aktuálny cenník: <https://stripe.com/sk/pricing>

---

## 2. Skopírujte si tajný kľúč

V Stripe choďte na **Developers → API keys**.

Uvidíte dva kľúče:

- *Publishable key* — tento **nepotrebujeme**, celá platba beží na strane
  Stripe.
- **Secret key** (`sk_test_…` v testovacom režime, `sk_live_…` v ostrom) —
  tento potrebujeme.

> **Tajný kľúč nikdy nikam nevpisujte do kódu ani ho neposielajte e-mailom.**
> Kto ho má, môže vo vašom mene vyberať peniaze. Uložíme ho do tajomstiev
> Firebase, kde je zašifrovaný.

---

## 3. Uložte kľúč do Firebase

V priečinku projektu spustite:

```bash
npx firebase-tools functions:secrets:set STRIPE_SECRET_KEY
```

Terminál sa opýta na hodnotu — vložte tajný kľúč zo Stripe a potvrďte.

Zatiaľ vytvorte aj druhé tajomstvo (skutočnú hodnotu doplníme v kroku 5):

```bash
npx firebase-tools functions:secrets:set STRIPE_WEBHOOK_SECRET
```

Zadajte zatiaľ hocijakú hodnotu, napríklad `zatial-prazdne`.

---

## 4. Nasaďte serverové funkcie

```bash
npx firebase-tools deploy --only functions
```

Po dokončení vypíše adresu webhooku. Bude vyzerať takto:

```
https://europe-west1-mudro-a-bezpecne-online.cloudfunctions.net/stripeWebhook
```

Túto adresu si skopírujte.

---

## 5. Nastavte webhook v Stripe

Webhook je správa, ktorou Stripe oznámi nášmu serveru, že platba naozaj
prebehla. **Bez neho sa prístupový kód nevygeneruje** — návrat zákazníka
na stránku „platba úspešná" totiž nie je dôkaz zaplatenia (tú adresu vie
otvoriť ktokoľvek).

1. V Stripe choďte na **Developers → Webhooks → Add endpoint**.
2. Do poľa *Endpoint URL* vložte adresu z kroku 4.
3. V *Select events* zvoľte tieto dve udalosti:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
4. Uložte.
5. Na detaile webhooku kliknite na **Reveal** pri *Signing secret* a
   skopírujte hodnotu (začína `whsec_…`).

Teraz ju uložte do Firebase a nasaďte funkcie znova:

```bash
npx firebase-tools functions:secrets:set STRIPE_WEBHOOK_SECRET
npx firebase-tools deploy --only functions
```

---

## 6. Zapnite platbu kartou v admin zóne

V admin zóne otvorte **Nastavenia** a zaškrtnite
**„Povoliť platbu kartou (Stripe)"**. Uložte.

Od tej chvíle sa zákazníkom pri objednávke ponúknu obe možnosti —
platba kartou aj bankový prevod.

---

## 7. Odskúšajte to

Ešte v testovacom režime Stripe spravte skúšobnú objednávku a zaplaťte
testovacou kartou:

| Údaj | Hodnota |
|---|---|
| Číslo karty | `4242 4242 4242 4242` |
| Platnosť | hocijaký dátum v budúcnosti |
| CVC | hocijaké tri číslice |

Po zaplatení by malo nasledovať:

1. Vrátite sa na stránku „Ďakujeme, spracúvame vašu platbu".
2. Do pár sekúnd sa zmení na „Hotovo! Kurz máte zaplatený".
3. Na e-mail príde prístupový kód.
4. V admin zóne v Registráciách bude objednávka so stavom **kód odoslaný**
   a spôsobom úhrady **karta**.

Ak sa krok 2 nestane, pozrite v Stripe **Developers → Webhooks → váš
endpoint**, či sa správa doručila a s akou odpoveďou.

---

## 8. Prepnutie do ostrej prevádzky

Keď Stripe schváli váš účet a chcete prijímať skutočné platby:

1. V Stripe vypnite *Test mode*.
2. Skopírujte **ostrý** tajný kľúč (`sk_live_…`).
3. Vytvorte webhook **znova** v ostrom režime (testovací tam neplatí) a
   skopírujte jeho nový *Signing secret*.
4. Obe hodnoty uložte a nasaďte:

```bash
npx firebase-tools functions:secrets:set STRIPE_SECRET_KEY
npx firebase-tools functions:secrets:set STRIPE_WEBHOOK_SECRET
npx firebase-tools deploy --only functions
```

---

## Ako je platba zabezpečená

- **Údaje o karte k nám nikdy neprídu.** Zákazník ich zadáva na stránke
  Stripe; my dostaneme len informáciu, že platba prebehla.
- **Sumu určuje server, nie prehliadač.** Berie sa z objednávky uloženej
  v databáze, takže sa nedá podvrhnúť nižšia cena.
- **Potvrdenie o platbe sa overuje podpisom.** Falošná správa ani správa
  so zmenenou sumou neprejde.
- **Suma sa kontroluje druhýkrát** pri spracovaní — ak by nesedela
  s objednávkou, kód sa nevydá a objednávka sa označí na kontrolu.
- **Kód sa vydá len raz.** Stripe niekedy pošle potvrdenie viackrát;
  objednávka sa „zamkne" v transakcii, takže druhé potvrdenie už nič
  nevytvorí.
- **Kľúče nie sú v kóde.** Sú v tajomstvách Firebase a do repozitára sa
  nikdy nedostanú.
