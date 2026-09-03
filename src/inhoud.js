/* ==========================================================================
   INHOUD VAN DE E-LEARNING
   --------------------------------------------------------------------------
   Dit is het enige bestand dat je hoeft aan te passen om de cursus te
   wijzigen. Raak de andere bestanden niet aan tenzij je iets aan de werking
   wilt veranderen.

   Opmaak die je in een tekst mag gebruiken:
     *vet*                 -> vetgedrukt
     https://... of e-mail -> wordt automatisch een klikbare link
     \n\n                  -> nieuwe alinea

   Blokken die je kunt gebruiken (zie LEESMIJ.md voor uitleg per blok):
     { type: 'tekst',     kop: '...', body: '...' }
     { type: 'lijst',     kop: '...', items: ['...', '...'] }
     { type: 'letop',     body: '...' }
     { type: 'checklist', kop: '...', items: ['...', '...'] }
     { type: 'vraag',     vraag: '...', opties: [...], goed: 0, uitleg: '...' }

   Bij 'vraag' is `goed` het nummer van het juiste antwoord, waarbij het
   eerste antwoord nummer 0 is, het tweede 1, enzovoort.
   ========================================================================== */

window.INHOUD = {

  titel: 'Tentamen maken in de tentamenperiode',
  ondertitel: 'Academie Business & Communicatie',

  intro:
    'Bij de Academie Business & Communicatie maak je je tentamens op je eigen laptop. ' +
    'Dat noemen we een *BYOD-toets* (Bring Your Own Device). We gebruiken daarvoor de ' +
    'toetsapplicaties Ans en Hogeschooltaal via https://han.nl/exam.\n\n' +
    'In deze korte e-learning lees je wat je moet regelen voor, tijdens en na je tentamen: ' +
    'op tijd inschrijven, je laptop klaarmaken en van tevoren een oefentoets doen. ' +
    'Je sluit elk hoofdstuk af met een vraag. Heb je er minimaal vijf van de zes goed, ' +
    'dan staat de e-learning geregistreerd als afgerond.',

  // Percentage vragen dat goed moet zijn om de e-learning als behaald te
  // registreren in Brightspace. Bij vijf vragen komt 80 neer op vier goed.
  // Pas je dit aan, wijzig dan ook <adlcp:masteryscore> in imsmanifest.xml.
  slagingsdrempel: 80,

  hoofdstukken: [

    /* ------------------------------------------------------------------ */
    {
      id: 'inschrijving',
      titel: 'Inschrijving en planning',
      blokken: [
        {
          type: 'tekst',
          kop: 'Schrijf je op tijd in',
          body:
            'Vanaf het moment dat je je kunt intekenen voor onderwijs, kun je je ook ' +
            'inschrijven voor het tentamen. Doe dit *minimaal 10 werkdagen* voor het ' +
            'tentamen.\n\n' +
            'Weekenden, lesvrije dagen en vakanties tellen niet mee als werkdag. Tel dus ' +
            'terug vanaf je tentamendatum en houd rekening met vakantieweken.'
        },
        {
          type: 'lijst',
          kop: 'Wat je moet doen',
          items: [
            'Schrijf je in via Osiris.',
            'Doe dit minimaal 10 werkdagen voor je tentamen.',
            'De datum en tijd van je tentamen vind je in Osiris.'
          ]
        },
        {
          type: 'letop',
          body:
            'Niet op tijd ingeschreven betekent dat je *geen toegang* hebt tot het ' +
            'tentamen. Er is geen uitzondering op deze regel.'
        },
        {
          type: 'tekst',
          kop: 'Lukt het inschrijven niet?',
          body:
            'Gebruik dan het formulier *Osiris - Verzoek tot na-inschrijven tentamens*.\n\n' +
            'Heb je een vraag, mail dan naar tentamenbureau.abc@han.nl.'
        },
        {
          type: 'vraag',
          vraag:
            'Je tentamen is op maandag 12 januari. Wanneer moet je je uiterlijk hebben ' +
            'ingeschreven?',
          opties: [
            'Uiterlijk 10 kalenderdagen ervoor, dus op 2 januari.',
            'Uiterlijk 10 werkdagen ervoor. Kerstvakantie en weekenden tellen niet mee, ' +
              'dus je moet nog verder terugtellen dan 2 januari.',
            'Uiterlijk de vrijdag ervoor.',
            'Je hoeft niets te doen, inschrijven voor onderwijs regelt het tentamen ook.'
          ],
          goed: 1,
          uitleg:
            'Het gaat om *werkdagen*, niet om kalenderdagen. Weekenden, lesvrije dagen en ' +
            'vakanties tellen niet mee. Rond de kerstvakantie betekent dat je flink verder ' +
            'terug moet tellen dan tien dagen op de kalender. Inschrijven voor onderwijs is ' +
            'iets anders dan inschrijven voor een tentamen: dat zijn twee losse handelingen ' +
            'in Osiris.'
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'tijdens',
      titel: 'Tijdens het tentamen',
      blokken: [
        {
          type: 'tekst',
          kop: 'De basisregels',
          body:
            'Tijdens het tentamen gelden een aantal regels. Ze gelden voor iedereen en de ' +
            'surveillanten kunnen er niet van afwijken.'
        },
        {
          type: 'lijst',
          kop: 'Regels in het tentamenlokaal',
          items: [
            'Neem een geldig identiteitsbewijs mee: paspoort, ID-kaart, rijbewijs of ' +
              'HAN-pas. Andere bewijzen worden niet geaccepteerd. Zonder geldig ID mag je ' +
              'het tentamen niet maken.',
            'Drinken mag, maar alleen in een afgesloten flesje. Eten is niet toegestaan.',
            'Naar het toilet gaan mag niet bij tentamens die korter duren dan 150 minuten.',
            'Telefoons en horloges zijn niet toegestaan.'
          ]
        },
        {
          type: 'checklist',
          kop: 'Vink af wat je meeneemt',
          items: [
            'Een geldig identiteitsbewijs',
            'Mijn laptop, opgeladen',
            'Mijn oplader',
            'Drinken in een afgesloten flesje',
            'Mijn telefoon en horloge laat ik thuis of stop ik in mijn tas'
          ]
        },
        {
          type: 'tekst',
          kop: 'Wees op tijd',
          body:
            'Zorg dat je *minimaal 10 minuten* voor aanvang in het lokaal bent, zodat je ' +
            'rustig kunt opstarten.\n\n' +
            'Ben je te laat, dan mag je pas 30 minuten na de starttijd naar binnen. Je ' +
            'krijgt geen extra tijd, dus je mist een half uur van je tentamen. Kom je ' +
            '*meer dan 30 minuten* na de starttijd, dan mag je het lokaal helemaal niet ' +
            'meer in.'
        },
        {
          type: 'tekst',
          kop: 'Voorzieningen',
          body:
            'Heb je een voorziening nodig, vraag die dan aan via *Osiris - Zaak*. Voor ' +
            'advies kun je terecht bij je studieloopbaanbegeleider.\n\n' +
            'Heb je de voorziening geluiddempende oordopjes, dan haal je die bij de ' +
            'Campusstore. Je eigen oordopjes zijn niet toegestaan.'
        },
        {
          type: 'vraag',
          vraag:
            'Je tentamen begint om 9.00 uur. Door een treinstoring sta je om 9.20 uur voor ' +
            'de deur. Wat gebeurt er?',
          opties: [
            'Je mag meteen naar binnen en krijgt 20 minuten extra tijd.',
            'Je mag meteen naar binnen, maar zonder extra tijd.',
            'Je wacht buiten tot 9.30 uur, gaat dan naar binnen en krijgt geen extra tijd.',
            'Je mag het tentamen niet meer maken.'
          ],
          goed: 2,
          uitleg:
            'Wie te laat is, mag pas 30 minuten na de starttijd naar binnen, dus om 9.30 ' +
            'uur. Je krijgt die tijd niet terug: je maakt het tentamen in de resterende ' +
            'tijd. Was je pas na 9.30 uur aangekomen, dan had je helemaal niet meer naar ' +
            'binnen gemogen. Een treinstoring verandert dat niet, dus reis met marge.'
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'techniek',
      titel: 'Technische eisen',
      blokken: [
        {
          type: 'tekst',
          kop: 'Je laptop moet klaar zijn',
          body:
            'Je maakt je tentamen op je eigen laptop, met de afnamesoftware Schoolyear. ' +
            'Die software neemt je laptop tijdens het tentamen over, en dat lukt alleen ' +
            'als je apparaat vooraf goed staat ingesteld.\n\n' +
            'Zorg dus dat je dit ruim van tevoren geregeld hebt. Een laptop die het op de ' +
            'dag zelf niet doet, is geen geldige reden voor een herkansing.'
        },
        {
          type: 'lijst',
          kop: 'Eisen aan je laptop',
          items: [
            'Verbind met het netwerk *Eduroam*, niet met een hotspot. Via een hotspot ' +
              'werken niet alle instellingen tijdens het tentamen.',
            'Zorg dat je laptop volledig opgeladen is en neem je oplader mee.',
            'Voer de laptopcheck uit. Hoe dat gaat lees je in het volgende hoofdstuk.'
          ]
        },
        {
          type: 'tekst',
          kop: 'Werkt Schoolyear niet op je laptop?',
          body:
            'Dan vraag je een leenlaptop aan. Het bekendste voorbeeld is een *Chromebook*: ' +
            'daar draait Schoolyear niet op. Maar ook op andere apparaten kan de check ' +
            'stuklopen.\n\n' +
            'Een leenlaptop vraag je aan door een zaak aan te maken in Osiris: ' +
            '*Osiris - Zaak - leenlaptop t.b.v. Schoolyear*.'
        },
        {
          type: 'letop',
          body:
            'Een leenlaptop aanvragen is *geen* kwestie van één druk op de knop. Je zaak ' +
            'moet behandeld worden en de laptop moet klaargemaakt en opgehaald worden. ' +
            'Reken op meerdere werkdagen. Vraag hem dus aan zodra je weet dat je er een ' +
            'nodig hebt, niet in de week van je tentamen.'
        },
        {
          type: 'vraag',
          vraag:
            'Je hebt een Chromebook en je eerste tentamen is over drie weken. Wat doe je?',
          opties: [
            'Niets. Je meldt je op de tentamendag bij de surveillant en krijgt daar een ' +
              'laptop.',
            'Je vraagt nu meteen een leenlaptop aan via Osiris - Zaak - leenlaptop t.b.v. ' +
              'Schoolyear.',
            'Je wacht tot de week van het tentamen en vraagt dan een leenlaptop aan.',
            'Je gebruikt je telefoon met een hotspot.'
          ],
          goed: 1,
          uitleg:
            'Schoolyear draait niet op een Chromebook, dus je hebt een leenlaptop nodig. ' +
            'Die aanvraag kost meerdere werkdagen: je zaak moet behandeld worden en de ' +
            'laptop moet klaargemaakt worden. Wachten tot de week van je tentamen is ' +
            'daarom te laat. Er staan op de tentamendag geen laptops klaar, en een hotspot ' +
            'is sowieso niet toegestaan.'
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'laptopcheck',
      titel: 'Laptopcheck',
      blokken: [
        {
          type: 'tekst',
          kop: 'Elke tentamenperiode opnieuw',
          body:
            'De laptopcheck controleert of Schoolyear goed werkt op jouw laptop. Je voert ' +
            'hem uit *voor iedere tentamenperiode opnieuw*, tussen de eerste dag van de ' +
            'maand en het begin van de tentamenperiode.\n\n' +
            'Dat het de vorige keer werkte zegt niets: door updates van je ' +
            'besturingssysteem of van Schoolyear kan het opnieuw misgaan. Zet de ' +
            'laptopcheck daarom als terugkerende afspraak in je agenda.'
        },
        {
          type: 'letop',
          body:
            'Sla eerst al je werk op en sluit je bestanden af. Schoolyear heeft een ' +
            '*herstart* van je laptop nodig om te kunnen werken, en die kan tijdens de ' +
            'check zomaar plaatsvinden. Alles wat je niet hebt opgeslagen ben je dan kwijt. ' +
            'Dit geldt ook voor de oefentoets in het volgende hoofdstuk.'
        },
        {
          type: 'lijst',
          kop: 'De laptopcheck uitvoeren',
          items: [
            'Sla je werk op en sluit je bestanden.',
            'Ga naar https://help.schoolyear.com/hc/nl/articles/6359493922973 en sla die ' +
              'link op bij je favorieten.',
            'Volg de stappen op die pagina en laat je laptop herstarten als daarom ' +
              'gevraagd wordt.',
            'Loopt er iets mis, mail dan direct naar tentamenbureau.abc@han.nl. Wacht niet ' +
              'tot de tentamenweek.'
          ]
        },
        {
          type: 'checklist',
          kop: 'Vink af wat je geregeld hebt',
          items: [
            'Ik heb de laptopcheck deze periode uitgevoerd',
            'De check gaf geen foutmeldingen',
            'Ik heb de laptopcheck als terugkerende afspraak in mijn agenda gezet'
          ]
        },
        {
          type: 'vraag',
          vraag:
            'Je hebt de laptopcheck vorige tentamenperiode gedaan en die ging goed. Moet je ' +
            'hem nu opnieuw doen?',
          opties: [
            'Nee, een keer per studiejaar is genoeg.',
            'Nee, zolang je dezelfde laptop gebruikt hoeft het niet.',
            'Ja, voor iedere tentamenperiode opnieuw, tussen de eerste dag van de maand en ' +
              'het begin van de tentamenperiode.',
            'Alleen als je een nieuwe laptop hebt gekocht.'
          ],
          goed: 2,
          uitleg:
            'De check hoort bij de periode, niet bij de laptop. Je besturingssysteem en ' +
            'Schoolyear krijgen tussentijds updates, en juist die kunnen de afname breken. ' +
            'Daarom controleer je elke tentamenperiode opnieuw, ook op een laptop die het ' +
            'de vorige keer prima deed.'
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'oefentoets',
      titel: 'Oefentoets in Ans',
      blokken: [
        {
          type: 'tekst',
          kop: 'Doe de oefentoets, ook als je denkt dat je het wel snapt',
          body:
            'De laptopcheck laat zien of Schoolyear technisch werkt. De oefentoets laat ' +
            'zien hoe het *voelt*: hoe je inlogt, hoe Schoolyear je scherm overneemt, waar ' +
            'de knoppen zitten en hoe je een antwoord geeft en indient.\n\n' +
            'We raden dit sterk aan. Het kost weinig tijd en het voorkomt dat je op de dag ' +
            'zelf staat te zoeken terwijl de klok loopt.'
        },
        {
          type: 'lijst',
          kop: 'Zo doe je de oefentoets',
          items: [
            'Sla eerst je werk op en sluit je bestanden. Ook hier kan je laptop opnieuw ' +
              'opstarten.',
            'Ga naar https://han.nl/exam.',
            'Klik op *Oefentoets ABC*.',
            'Doorloop de toets rustig en kijk waar alles zit. De uitleg staat in de ' +
              'oefentoets zelf, het werkt als een rondleiding.'
          ]
        },
        {
          type: 'checklist',
          kop: 'Vink af wat je geregeld hebt',
          items: [
            'Ik heb mijn werk opgeslagen voordat ik begon',
            'Ik heb de oefentoets in Ans gedaan',
            'Ik weet hoe ik inlog en hoe ik een antwoord indien',
            'Ik weet wat ik moet doen als Schoolyear vastloopt'
          ]
        },
        {
          type: 'vraag',
          vraag:
            'Je bent midden in een verslag als je bedenkt dat je de laptopcheck en de ' +
            'oefentoets nog moet doen. Wat doe je eerst?',
          opties: [
            'Je begint meteen, je verslag staat toch nog open op de achtergrond.',
            'Je slaat je verslag op en sluit je bestanden, en begint daarna pas.',
            'Je doet alleen de laptopcheck, want daarbij herstart je laptop niet.',
            'Je wacht tot je klaar bent met het verslag, ergens volgende maand.'
          ],
          goed: 1,
          uitleg:
            'Schoolyear heeft een herstart van je laptop nodig om te kunnen werken, en die ' +
            'kan tijdens de check of de oefentoets zomaar plaatsvinden. Alles wat je niet ' +
            'hebt opgeslagen ben je dan kwijt. Sla dus eerst op en sluit je bestanden af. ' +
            'Uitstellen tot volgende maand is ook geen goed idee: dan zit je mogelijk al ' +
            'in de tentamenperiode en is er geen tijd meer om iets te regelen.'
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: 'informatie',
      titel: 'Informatie & afronding',
      blokken: [
        {
          type: 'tekst',
          kop: 'Waar vind je meer informatie?',
          body:
            'Heb je een vraag over tentamens of over inzage, kijk dan op *Insite - jouw ' +
            'opleiding - Tentameninformatie*.\n\n' +
            'Kom je er niet uit, neem dan contact op met de tentamenorganisatie via ' +
            'tentamenbureau.abc@han.nl.'
        },
        {
          type: 'tekst',
          kop: 'Inloopspreekuur',
          body:
            'In periode 1 zijn er inloopspreekuren. Je bent welkom met vragen over ' +
            'inloggen, Ans, Schoolyear of iets anders. Kwam je er bij de laptopcheck of de ' +
            'oefentoets niet uit, dan is dit de plek om het samen te bekijken.\n\n' +
            'De geplande momenten staan op *Insite - jouw opleiding - Tentameninformatie*.'
        },
        {
          type: 'vraag',
          vraag:
            'Je doet de laptopcheck en Schoolyear start niet op. Je komt er zelf niet uit ' +
            'en het is periode 1. Wat is je beste volgende stap?',
          opties: [
            'Je wacht tot de tentamendag en meldt het daar bij de surveillant.',
            'Je mailt tentamenbureau.abc@han.nl of gaat langs bij een inloopspreekuur.',
            'Je leent op de tentamendag de laptop van een medestudent.',
            'Je vraagt uitstel van het tentamen aan bij je studieloopbaanbegeleider.'
          ],
          goed: 1,
          uitleg:
            'Los dit op zodra je het merkt, niet op de dag zelf. De tentamenorganisatie is ' +
            'bereikbaar via de mail, en in periode 1 kun je ook langs een inloopspreekuur ' +
            'komen. Wachten tot de tentamendag betekent dat je je tentamen niet kunt maken, ' +
            'en een laptop lenen van een medestudent kan niet: die heeft hem zelf nodig.'
        },
        {
          type: 'tekst',
          kop: 'Heel veel succes met je tentamens!',
          body:
            'Je hebt alles gehad. Loop de checklists nog een keer na in de week voor je ' +
            'tentamen, dan kom je niet voor verrassingen te staan.'
        }
      ]
    }

  ]
};
