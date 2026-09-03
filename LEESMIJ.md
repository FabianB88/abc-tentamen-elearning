# E-learning "Tentamen maken in de tentamenperiode"

Voor de Academie Business & Communicatie (HAN). Draait als SCORM 1.2-pakket in
Brightspace, en als gewone website als je de map `dist` ergens neerzet.

Geen Node, geen npm, geen framework. Vijf bestanden en een PowerShell-script.

---

## De inhoud aanpassen

Alles wat studenten te zien krijgen staat in **`src/inhoud.js`**. Dat is het enige
bestand dat je hoeft te openen. Open het in Kladblok, VS Code of de web-editor van
GitHub, pas de tekst aan tussen de aanhalingstekens, en sla op.

Daarna:

```bash
powershell -ExecutionPolicy Bypass -File tools\bouw.ps1
```

Dat zet een nieuwe `dist\abc-tentamen-elearning-scorm.zip` klaar. Die upload je in
Brightspace.

### Beschikbare blokken

Elk hoofdstuk bestaat uit blokken. Er zijn er vijf.

**`tekst`** — gewone alinea's met een kopje erboven. Velden: `kop` en `body`.

**`lijst`** — opsomming met magenta bolletjes. Velden: `kop` en `items`.

**`letop`** — waarschuwing, met een accentlijn ernaast en iets grotere letter.
Veld: `body`.

**`checklist`** — aanvinklijst. Wat een student aanvinkt wordt bewaard en staat er de
volgende keer nog. Velden: `kop` en `items`.

**`vraag`** — kennisvraag met terugkoppeling. Velden: `vraag`, `opties`, `goed` en
`uitleg`. Het veld `goed` telt vanaf nul: `goed: 0` is het eerste antwoord, `goed: 1`
het tweede. Verwissel je antwoorden van volgorde, tel dan opnieuw.

### Twee valkuilen bij het schrijven van vragen

Schrijf je een nieuwe vraag, let dan op twee hints die je ongemerkt weggeeft.

Ten eerste: laat het juiste antwoord niet steeds op dezelfde plek staan. Verdeel ze over
alle vier de posities. Ten tweede, en dit is de sterkste van de twee: maak het juiste
antwoord niet langer dan de afleiders. Wie merkt dat het langste antwoord meestal goed
is, hoeft de vraag niet meer te lezen. Houd de vier opties ongeveer even lang; dat kost
even werk aan de afleiders, maar dat is precies waar het om gaat.

De cursus controleert dit zelf bij het opstarten en zet een waarschuwing in de console
van de browser als het juiste antwoord te vaak op dezelfde plek staat of te vaak de
langste optie is. Open de ontwikkelaarsconsole (F12) nadat je vragen hebt aangepast en
kijk of er iets rood of geel verschijnt.

In elke tekst mag je gebruiken:

- `*tussen sterretjes*` wordt vetgedrukt
- een URL of e-mailadres wordt vanzelf een klikbare link
- `\n\n` begint een nieuwe alinea

### Een hoofdstuk toevoegen

Kopieer een bestaand blok tussen de accolades in `hoofdstukken`, geef het een eigen
`id` (kleine letters, geen spaties) en pas titel en blokken aan. De nummering, het
menu, de voortgangsbalk en de scoreberekening gaan automatisch mee.

Let op: het `id` is de sleutel waaronder antwoorden worden bewaard. Hernoem je een
`id`, dan verliezen studenten die al bezig waren hun voortgang van dat hoofdstuk.

### De slagingsnorm

`slagingsdrempel: 80` betekent dat 80% van de vragen goed moet zijn voor de status
*passed* in Brightspace. Bij de huidige zes vragen is dat vijf goed. Voeg je een vraag
toe of haal je er een weg, controleer dan of de drempel nog uitkomt op het aantal dat je
bedoelt, en pas de zin daarover in de intro aan. Wijzig je de drempel zelf, zet dan ook
`<adlcp:masteryscore>` in `src/imsmanifest.xml` op hetzelfde getal.

---

## Testen voordat je uploadt

Start een lokale server (of gebruik de preview in Claude Code, configuratie
`abc-tentamen`) en open:

- **`index.html`** — de cursus zoals studenten hem zien
- **`scorm-test.html`** — dezelfde cursus in een nagebootste Brightspace

Die tweede pagina is de belangrijkste. Links doorloop je de cursus, rechts zie je live
wat een LMS zou opslaan. Loop hem één keer helemaal door. Wat je moet zien:

- `lesson_status` staat op `incomplete` zolang je bezig bent, en op `passed` zodra je
  afrondt met genoeg goede antwoorden (`failed` als je eronder blijft).
- `score.raw` is het percentage goede antwoorden, tussen 0 en 100.
- `lesson_location` bevat het `id` van het hoofdstuk waar je gebleven was.
- `suspend_data` blijft ruim onder de 4096 tekens. Dat is de harde grens van SCORM 1.2.
- "Netjes afgesloten" springt op ja zodra het venster dichtgaat.

`scorm-test.html` komt niet in het pakket terecht: `bouw.ps1` kopieert alleen wat in
`imsmanifest.xml` staat.

---

## In Brightspace zetten

1. Draai `tools\bouw.ps1`.
2. In Brightspace: **Cursusmateriaal → Inhoud → Bestaande activiteiten →
   SCORM-object** (of **Nieuw → SCORM/xAPI uploaden**, afhankelijk van de versie).
3. Upload `dist\abc-tentamen-elearning-scorm.zip`.
4. Zet de voltooiingsvoorwaarde op wat je wilt registreren. Het pakket levert zowel
   een status (`passed`/`failed`) als een score van 0 tot 100.

Docenten zien per student de status en de score in het SCORM-rapport van Brightspace.
Daar is verder niets voor nodig — dat doet SCORM zelf.

### Een nieuwe versie plaatsen

Vervang het bestaande SCORM-object in plaats van een nieuw object aan te maken. Maak
je een nieuw object, dan beginnen studenten opnieuw en raak je de bestaande
registraties kwijt.

---

## Online zetten

De cursus staat ook op GitHub Pages, zodat je hem kunt bekijken en delen zonder
Brightspace:

**https://fabianb88.github.io/abc-tentamen-elearning/**

Pages publiceert de map `docs`, en `bouw.ps1` vult die met exact dezelfde bestanden als
de zip. Wat online staat is dus altijd hetzelfde als wat studenten in Brightspace
krijgen. Publiceren gaat zo:

```bash
powershell -ExecutionPolicy Bypass -File tools\bouw.ps1
git add -A
git commit -m "inhoud bijgewerkt"
git push
```

Een minuut later staat het er. `dist` blijft buiten git, die wordt elke keer opnieuw
gemaakt.

Twee dingen om te weten. **De pagina is openbaar.** GitHub Pages heeft geen server, dus
afschermen kan niet; een JS-inlog zou een gordijn zijn. Daarom staat er een
`noindex, nofollow` in `index.html`, zodat hij niet in Google komt. Een `robots.txt`
helpt hier niet: crawlers lezen alleen die van `fabianb88.github.io` zelf, niet die van
een project-repo. **En zonder LMS is er geen registratie**: op Pages bewaart de cursus de
voortgang in de browser van de bezoeker. Wie het gemaakt heeft zie je alleen via het
SCORM-pakket in Brightspace.

---

## Hoe het in elkaar zit

```
src/
  index.html        het frame: kopbalk, menu, voortgangsbalk
  styles.css        vormgeving
  inhoud.js         DE INHOUD — hier pas je alles aan
  app.js            bouwt de cursus op en houdt voortgang bij
  scorm.js          praat met Brightspace
  imsmanifest.xml   vertelt Brightspace hoe het pakket start
  scorm-test.html   nep-LMS om te testen (gaat niet mee in de zip)
docs/               wat GitHub Pages publiceert, gegenereerd door bouw.ps1
tools/
  bouw.ps1          maakt dist/ (de zip) en docs/ (de website)
```

Bewerk nooit iets in `docs`: die map wordt bij elke build leeggegooid en opnieuw
gevuld vanuit `src`.

**Zonder LMS werkt de cursus gewoon door.** `scorm.js` zoekt een LMS-API in de
vensters erboven; vindt hij niets, dan valt de voortgang terug op `localStorage` van
de browser. Handig om te testen, maar dan is er geen centrale registratie.

**Voortgang wordt op twee plekken bewaard**: in `cmi.suspend_data` bij de LMS (dat is
de echte opslag, werkt op elk apparaat) en in `localStorage` als reservekopie. Bij het
openen wint de LMS.

**Een behaald resultaat wordt nooit teruggezet.** Opent een student die geslaagd is de
cursus opnieuw, dan blijft `passed` staan tot hij de vragen echt opnieuw beantwoordt.

---

## Toegankelijkheid

De HAN valt onder het Tijdelijk besluit digitale toegankelijkheid overheid, dus WCAG
2.1 AA is verplicht. Wat daarvoor is gedaan, en wat je dus niet moet weggooien:

- Alle kleurcombinaties halen minimaal 4.5:1. De magenta voor tekst en links is
  `#b30043`, niet `#e50056` — die laatste haalt op wit net geen AA voor kleine tekst
  en wordt alleen gebruikt als vlak met witte tekst erop, of als markering.
- Goed en fout worden nooit alleen met kleur aangegeven: er staat ook een teken (✓/✕)
  en het woord "juist" of "jouw antwoord" bij.
- Vragen zitten in een `fieldset` met `legend`, zodat een schermlezer de vraag
  voorleest bij elk antwoord.
- Terugkoppeling staat in een `role="status"` met `aria-live`, dus die wordt
  voorgelezen zodra hij verschijnt.
- Bij het wisselen van hoofdstuk springt de focus naar de kop, niet naar de bovenkant
  van de pagina.
- Het uitschuifmenu is `visibility: hidden` als het dicht is, zodat je er niet met Tab
  in belandt. Escape sluit het en zet de focus terug op de knop.
- De vergrendelde "Volgende"-knop verwijst met `aria-describedby` naar de uitleg
  waarom hij vastzit.
- `prefers-reduced-motion` zet alle overgangen uit.

Bouw je iets nieuws bij, loop deze punten dan na.

---

## Waar dit vandaan komt

De inhoud is overgenomen uit de bestaande Rise-cursus (share-link `bc6ZnI9`). Die had
vijf lessen met alleen tekst en lijstjes: geen afbeeldingen, geen vragen, geen
oefeningen. Bij het overzetten zijn toegevoegd:

- een zesde hoofdstuk over de **oefentoets in Ans**, dat in de bron helemaal ontbrak
- de waarschuwing dat je je werk moet opslaan vóór de laptopcheck of de oefentoets,
  omdat Schoolyear een herstart van de laptop nodig heeft
- zes kennisvragen over situaties (niet over definities), met uitleg die de denkfout
  benoemt in plaats van het juiste antwoord te herhalen
- drie checklists: wat neem je mee, heb je de laptopcheck gedaan, en heb je de
  oefentoets gedaan
- losse alinea's waar in de bron zinnen aan elkaar geplakt zaten

Twee dingen zijn verplaatst of weggehaald. De Chromebook stond in de bron tussen de
eisen aan je laptop; die staat nu als voorbeeld bij "Werkt Schoolyear niet op je
laptop?", met de nadruk erbij dat een leenlaptop aanvragen meerdere werkdagen kost. En
onder het kopje "Voorzieningen" stond dezelfde uitleg over te laat komen als onder "Wees
op tijd"; die staat nu nog maar op één plek.

## Wat veroudert

Controleer dit aan het begin van elk studiejaar. Laatst nagelopen: 3 september 2026.

- Het e-mailadres `tentamenbureau.abc@han.nl`
- De link naar de laptopcheck bij Schoolyear (`help.schoolyear.com/...6359493922973`)
- De namen van de toetsapplicaties (nu Ans en Hogeschooltaal, via `han.nl/exam`)
- Of de oefentoets nog "Oefentoets ABC" heet en nog op `han.nl/exam` staat
- De route voor een leenlaptop (nu Osiris → Zaak → leenlaptop t.b.v. Schoolyear)
- Of de inloopspreekuren nog in periode 1 vallen
- De termijn van 10 werkdagen en de 30 minuten-regel bij te laat komen
