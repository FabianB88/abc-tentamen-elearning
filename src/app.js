/* ==========================================================================
   De speler: bouwt de cursus op uit inhoud.js en houdt de voortgang bij.

   Je hoeft dit bestand niet aan te passen om de inhoud te wijzigen.
   ========================================================================== */

(function () {
  'use strict';

  var cursus = window.INHOUD;
  var staat = {
    huidig: -1,          // -1 = startpagina, hoofdstukken.length = resultaat
    gezien: {},
    antwoorden: {},      // sleutel -> gekozen antwoordnummer
    checks: {}           // sleutel -> aangevinkt ja/nee
  };

  var el = {};

  /* ====================================================================== */
  /* Tekst omzetten naar veilige HTML                                        */
  /* ====================================================================== */

  function ontsnap(tekst) {
    return String(tekst)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Zet *vet* om, en maakt van URL's en e-mailadressen klikbare links.
  // Wordt altijd na ontsnap() gedraaid, zodat inhoud nooit HTML kan injecteren.
  function opmaak(tekst) {
    var uit = ontsnap(tekst);

    uit = uit.replace(/https?:\/\/[^\s<]+/g, function (adres) {
      // Een punt of komma direct achter een URL hoort bij de zin, niet bij de link.
      var staart = '';
      var m = adres.match(/[.,;:)]+$/);
      if (m) {
        staart = m[0];
        adres = adres.slice(0, -staart.length);
      }
      return '<a href="' + adres + '" target="_blank" rel="noopener noreferrer">' +
             adres + '<span class="buiten" aria-hidden="true"></span>' +
             '<span class="verborgen"> (opent in een nieuw tabblad)</span></a>' + staart;
    });

    uit = uit.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, function (adres) {
      return '<a href="mailto:' + adres + '">' + adres + '</a>';
    });

    uit = uit.replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>');

    return uit;
  }

  function alinea(tekst) {
    return tekst.split('\n\n').map(function (deel) {
      return '<p>' + opmaak(deel) + '</p>';
    }).join('');
  }

  function maak(tag, klasse, html) {
    var node = document.createElement(tag);
    if (klasse) node.className = klasse;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  /* ====================================================================== */
  /* Vragen tellen en scoren                                                 */
  /* ====================================================================== */

  function alleVragen() {
    var lijst = [];
    cursus.hoofdstukken.forEach(function (h, hi) {
      h.blokken.forEach(function (b, bi) {
        if (b.type === 'vraag') lijst.push({ sleutel: h.id + ':' + bi, blok: b, hoofdstuk: hi });
      });
    });
    return lijst;
  }

  function score() {
    var vragen = alleVragen();
    if (!vragen.length) return { goed: 0, totaal: 0, percentage: 100 };
    var goed = 0;
    vragen.forEach(function (v) {
      if (staat.antwoorden[v.sleutel] === v.blok.goed) goed++;
    });
    return {
      goed: goed,
      totaal: vragen.length,
      percentage: Math.round((goed / vragen.length) * 100)
    };
  }

  // Staat het juiste antwoord steeds op dezelfde plek, dan kun je gokken zonder
  // de vraag te lezen. Deze controle waarschuwt daarvoor in de console en
  // verandert niets aan de cursus.
  //
  // De lengte van de antwoorden controleren we bewust niet. Dit is een
  // leercheck, geen tentamen: een antwoord mag uitleggen waarom het klopt, ook
  // als het daardoor langer wordt dan de afleiders.
  function controleerVragen() {
    var vragen = alleVragen();
    if (vragen.length < 3) return;

    var perPlek = {};
    vragen.forEach(function (v) {
      perPlek[v.blok.goed] = (perPlek[v.blok.goed] || 0) + 1;
    });

    Object.keys(perPlek).forEach(function (plek) {
      if (perPlek[plek] > vragen.length / 2) {
        console.warn('[vragen] Het juiste antwoord staat ' + perPlek[plek] + ' van de ' +
                     vragen.length + ' keer op plek ' + (Number(plek) + 1) +
                     '. Verdeel ze beter over de vier plekken.');
      }
    });
  }

  function alleVragenBeantwoord() {
    return alleVragen().every(function (v) {
      return staat.antwoorden[v.sleutel] !== undefined;
    });
  }

  function hoofdstukAf(index) {
    var h = cursus.hoofdstukken[index];
    if (!staat.gezien[h.id]) return false;
    return h.blokken.every(function (b, bi) {
      return b.type !== 'vraag' || staat.antwoorden[h.id + ':' + bi] !== undefined;
    });
  }

  /* ====================================================================== */
  /* Voortgang bewaren                                                       */
  /* ====================================================================== */

  function bewaar() {
    var huidigId = 'start';
    if (staat.huidig >= 0 && staat.huidig < cursus.hoofdstukken.length) {
      huidigId = cursus.hoofdstukken[staat.huidig].id;
    } else if (staat.huidig >= cursus.hoofdstukken.length) {
      huidigId = 'einde';
    }

    window.SCORM.bewaarVoortgang({
      huidigHoofdstuk: huidigId,
      gezien: staat.gezien,
      antwoorden: staat.antwoorden,
      checks: staat.checks
    });

    if (alleVragenBeantwoord()) {
      var s = score();
      window.SCORM.meldResultaat(s.percentage, s.percentage >= cursus.slagingsdrempel);
    } else {
      window.SCORM.meldOnvoltooid();
    }
  }

  function herstel() {
    var opgeslagen = window.SCORM.haalVoortgang();
    if (!opgeslagen) return;
    staat.gezien = opgeslagen.gezien || {};
    staat.antwoorden = opgeslagen.antwoorden || {};
    staat.checks = opgeslagen.checks || {};

    var plek = opgeslagen.huidigHoofdstuk;
    if (plek === 'einde') {
      staat.huidig = cursus.hoofdstukken.length;
    } else if (plek && plek !== 'start') {
      cursus.hoofdstukken.forEach(function (h, i) {
        if (h.id === plek) staat.huidig = i;
      });
    }
  }

  /* ====================================================================== */
  /* Blokken tekenen                                                         */
  /* ====================================================================== */

  var tekenaars = {

    tekst: function (blok) {
      var node = maak('section', 'blok blok-tekst');
      if (blok.kop) node.appendChild(maak('h3', null, opmaak(blok.kop)));
      if (blok.body) node.insertAdjacentHTML('beforeend', alinea(blok.body));
      return node;
    },

    lijst: function (blok) {
      var node = maak('section', 'blok blok-lijst');
      if (blok.kop) node.appendChild(maak('h3', null, opmaak(blok.kop)));
      var ul = maak('ul');
      blok.items.forEach(function (item) {
        ul.appendChild(maak('li', null, opmaak(item)));
      });
      node.appendChild(ul);
      return node;
    },

    letop: function (blok) {
      var node = maak('aside', 'blok blok-letop');
      node.setAttribute('role', 'note');
      node.appendChild(maak('p', 'letop-label', 'Let op'));
      node.insertAdjacentHTML('beforeend', alinea(blok.body));
      return node;
    },

    checklist: function (blok, hoofdstuk, index) {
      var node = maak('section', 'blok blok-checklist');
      if (blok.kop) node.appendChild(maak('h3', null, opmaak(blok.kop)));
      var ul = maak('ul', 'checklist');

      blok.items.forEach(function (item, i) {
        var sleutel = hoofdstuk.id + ':' + index + ':' + i;
        var id = 'check-' + sleutel.replace(/:/g, '-');
        var li = maak('li');

        var vakje = document.createElement('input');
        vakje.type = 'checkbox';
        vakje.id = id;
        vakje.checked = !!staat.checks[sleutel];
        vakje.addEventListener('change', function () {
          staat.checks[sleutel] = vakje.checked;
          bewaar();
        });

        var label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerHTML = opmaak(item);

        li.appendChild(vakje);
        li.appendChild(label);
        ul.appendChild(li);
      });

      node.appendChild(ul);
      return node;
    },

    vraag: function (blok, hoofdstuk, index) {
      var sleutel = hoofdstuk.id + ':' + index;
      var node = maak('section', 'blok blok-vraag');

      var veld = document.createElement('fieldset');
      var legenda = document.createElement('legend');
      legenda.innerHTML = opmaak(blok.vraag);
      veld.appendChild(legenda);

      var terugkoppeling = maak('div', 'terugkoppeling');
      terugkoppeling.setAttribute('role', 'status');
      terugkoppeling.setAttribute('aria-live', 'polite');

      var beantwoord = staat.antwoorden[sleutel] !== undefined;

      function toonTerugkoppeling() {
        var gekozen = staat.antwoorden[sleutel];
        var goed = gekozen === blok.goed;
        terugkoppeling.className = 'terugkoppeling ' + (goed ? 'is-goed' : 'is-fout');
        terugkoppeling.innerHTML =
          '<p class="terugkoppeling-kop">' +
          (goed ? 'Klopt.' : 'Niet helemaal. Het juiste antwoord is: ' +
            ontsnap(blok.opties[blok.goed])) +
          '</p>' + alinea(blok.uitleg);
      }

      blok.opties.forEach(function (optie, i) {
        var id = 'vraag-' + sleutel.replace(/:/g, '-') + '-' + i;
        var rij = maak('div', 'optie');

        var knop = document.createElement('input');
        knop.type = 'radio';
        knop.name = 'vraag-' + sleutel;
        knop.id = id;
        knop.value = String(i);
        knop.checked = staat.antwoorden[sleutel] === i;
        knop.disabled = beantwoord;

        var label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerHTML = opmaak(optie);

        knop.addEventListener('change', function () {
          if (staat.antwoorden[sleutel] !== undefined) return;
          staat.antwoorden[sleutel] = i;
          veld.querySelectorAll('input[type=radio]').forEach(function (r) {
            r.disabled = true;
          });
          rij.parentNode.querySelectorAll('.optie').forEach(function (o, oi) {
            if (oi === blok.goed) o.classList.add('is-juist');
            else if (oi === i) o.classList.add('is-onjuist');
          });
          toonTerugkoppeling();
          bewaar();
          werkNavigatieBij();
        });

        rij.appendChild(knop);
        rij.appendChild(label);
        veld.appendChild(rij);

        if (beantwoord) {
          if (i === blok.goed) rij.classList.add('is-juist');
          else if (staat.antwoorden[sleutel] === i) rij.classList.add('is-onjuist');
        }
      });

      node.appendChild(veld);
      node.appendChild(terugkoppeling);
      if (beantwoord) toonTerugkoppeling();
      return node;
    }
  };

  /* ====================================================================== */
  /* Schermen                                                                */
  /* ====================================================================== */

  function toonStart() {
    var wrap = maak('div', 'scherm');
    var body = maak('div', 'les-body');

    body.appendChild(maak('p', 'kruimel', 'Welkom'));
    body.appendChild(maak('h2', null, ontsnap(cursus.titel)));
    body.insertAdjacentHTML('beforeend', alinea(cursus.intro));

    var lijst = maak('ol', 'inhoudsopgave');
    cursus.hoofdstukken.forEach(function (h, i) {
      var li = maak('li');
      li.appendChild(maak('span', 'io-nummer', String(i + 1)));
      li.appendChild(maak('span', 'io-titel', ontsnap(h.titel)));
      if (hoofdstukAf(i)) {
        li.classList.add('is-af');
        li.appendChild(maak('span', 'io-af', 'afgerond'));
      }
      lijst.appendChild(li);
    });
    body.appendChild(maak('h3', null, 'Wat je gaat doorlopen'));
    body.appendChild(lijst);
    wrap.appendChild(body);

    var begonnen = Object.keys(staat.gezien).length > 0;
    var knoppen = maak('div', 'knoppen');
    knoppen.appendChild(hoofdknop(begonnen ? 'Verder gaan' : 'Beginnen', function () {
      ga(eersteOnafgerondeHoofdstuk());
    }));
    wrap.appendChild(knoppen);

    return wrap;
  }

  function hoofdknop(tekst, bijKlik) {
    var knop = maak('button', 'knop knop-primair', tekst);
    knop.type = 'button';
    knop.addEventListener('click', bijKlik);
    return knop;
  }

  function tekstknop(tekst, bijKlik) {
    var knop = maak('button', 'knop knop-secundair', tekst);
    knop.type = 'button';
    knop.addEventListener('click', bijKlik);
    return knop;
  }

  function toonHoofdstuk(index) {
    var h = cursus.hoofdstukken[index];
    staat.gezien[h.id] = true;

    var wrap = maak('div', 'scherm');

    var kop = maak('header', 'les-kop');
    kop.appendChild(maak('p', 'kruimel',
      'Hoofdstuk ' + (index + 1) + ' van ' + cursus.hoofdstukken.length));
    kop.appendChild(maak('h2', null, ontsnap(h.titel)));
    wrap.appendChild(kop);

    var body = maak('div', 'les-body');
    h.blokken.forEach(function (blok, bi) {
      var tekenaar = tekenaars[blok.type];
      if (!tekenaar) {
        console.warn('Onbekend bloktype in inhoud.js: ' + blok.type);
        return;
      }
      body.appendChild(tekenaar(blok, h, bi));
    });
    wrap.appendChild(body);

    var knoppen = maak('div', 'knoppen');

    var laatste = index === cursus.hoofdstukken.length - 1;
    var verder = hoofdknop(laatste ? 'Afronden' : 'Volgende', function () { ga(index + 1); });
    verder.id = 'verder';
    knoppen.appendChild(verder);

    var slot = maak('p', 'slot-uitleg');
    slot.id = 'slot-uitleg';
    slot.textContent = 'Beantwoord eerst de vraag hierboven om verder te gaan.';
    knoppen.appendChild(slot);

    knoppen.appendChild(tekstknop(
      index === 0 ? 'Terug naar het overzicht' : 'Vorige hoofdstuk',
      function () { ga(index - 1); }));

    wrap.appendChild(knoppen);
    return wrap;
  }

  function toonResultaat() {
    var s = score();
    var geslaagd = s.percentage >= cursus.slagingsdrempel;

    var wrap = maak('div', 'scherm');
    var body = maak('div', 'les-body');
    body.appendChild(maak('p', 'kruimel', 'Afronding'));
    body.appendChild(maak('h2', null, geslaagd ? 'Je hebt de e-learning afgerond' :
      'Je bent er nog niet helemaal'));

    var kaart = maak('div', 'uitslag ' + (geslaagd ? 'is-geslaagd' : 'is-niet-geslaagd'));
    kaart.appendChild(maak('p', 'uitslag-cijfer', s.goed + ' van de ' + s.totaal + ' goed'));
    kaart.appendChild(maak('p', 'uitslag-tekst',
      geslaagd
        ? (window.SCORM.actief()
            ? 'Je resultaat is doorgegeven aan Brightspace. Je kunt dit venster sluiten.'
            : 'Je resultaat is lokaal bewaard. Deze cursus draait nu niet in Brightspace, ' +
              'dus er is niets doorgegeven aan je docent.')
        : 'Je hebt minimaal ' + cursus.slagingsdrempel + '% nodig. Loop de hoofdstukken ' +
          'nog een keer door en probeer het opnieuw.'));
    body.appendChild(kaart);

    var fout = alleVragen().filter(function (v) {
      return staat.antwoorden[v.sleutel] !== v.blok.goed;
    });
    if (fout.length) {
      body.appendChild(maak('h3', null, 'Dit ging nog niet goed'));
      var ul = maak('ul', 'foutenlijst');
      fout.forEach(function (v) {
        var li = maak('li');
        li.appendChild(maak('span', 'fout-hoofdstuk',
          cursus.hoofdstukken[v.hoofdstuk].titel));
        li.appendChild(maak('span', 'fout-vraag', ontsnap(v.blok.vraag)));
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }
    wrap.appendChild(body);

    function opnieuwBeginnen() {
      if (!window.confirm('Weet je zeker dat je opnieuw wilt beginnen? Je antwoorden ' +
                          'worden gewist.')) return;
      staat.gezien = {};
      staat.antwoorden = {};
      staat.checks = {};
      ga(-1);
    }

    var knoppen = maak('div', 'knoppen');
    if (geslaagd) {
      knoppen.appendChild(hoofdknop('Terug naar het overzicht', function () { ga(-1); }));
      knoppen.appendChild(tekstknop('Opnieuw doen', opnieuwBeginnen));
    } else {
      knoppen.appendChild(hoofdknop('Opnieuw doen', opnieuwBeginnen));
      knoppen.appendChild(tekstknop('Terug naar het laatste hoofdstuk', function () {
        ga(cursus.hoofdstukken.length - 1);
      }));
    }
    wrap.appendChild(knoppen);
    return wrap;
  }

  /* ====================================================================== */
  /* Navigatie                                                               */
  /* ====================================================================== */

  function eersteOnafgerondeHoofdstuk() {
    for (var i = 0; i < cursus.hoofdstukken.length; i++) {
      if (!hoofdstukAf(i)) return i;
    }
    return cursus.hoofdstukken.length;
  }

  function ga(index) {
    var max = cursus.hoofdstukken.length;
    staat.huidig = Math.max(-1, Math.min(index, max));

    el.inhoud.innerHTML = '';
    var scherm;
    if (staat.huidig === -1) scherm = toonStart();
    else if (staat.huidig >= max) scherm = toonResultaat();
    else scherm = toonHoofdstuk(staat.huidig);
    el.inhoud.appendChild(scherm);

    bewaar();
    werkNavigatieBij();

    // Focus naar de kop, zodat wie met toetsenbord of schermlezer werkt op de
    // juiste plek belandt in plaats van bovenaan de pagina.
    var kop = el.inhoud.querySelector('h2');
    if (kop) {
      kop.setAttribute('tabindex', '-1');
      kop.focus();
    }
    el.inhoud.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function werkNavigatieBij() {
    // Zijmenu. De knop "Overzicht" hoort niet bij de hoofdstukken en telt dus
    // niet mee in de nummering.
    var thuis = el.menu.querySelector('.menu-thuis');
    if (thuis) {
      thuis.setAttribute('aria-current', staat.huidig === -1 ? 'step' : 'false');
      thuis.classList.toggle('is-actief', staat.huidig === -1);
    }
    el.menu.querySelectorAll('.menu-hoofdstuk').forEach(function (knop, i) {
      var actief = i === staat.huidig;
      knop.setAttribute('aria-current', actief ? 'step' : 'false');
      knop.classList.toggle('is-actief', actief);
      knop.classList.toggle('is-af', hoofdstukAf(i));
    });

    // Voortgangsbalk
    var af = 0;
    cursus.hoofdstukken.forEach(function (h, i) { if (hoofdstukAf(i)) af++; });
    var pct = Math.round((af / cursus.hoofdstukken.length) * 100);
    el.balk.style.width = pct + '%';
    el.balkWrap.setAttribute('aria-valuenow', String(pct));
    el.balkTekst.textContent = af + ' van ' + cursus.hoofdstukken.length + ' hoofdstukken af';

    // Volgende-knop vergrendelen zolang een vraag openstaat
    var verder = document.getElementById('verder');
    var uitleg = document.getElementById('slot-uitleg');
    if (verder && staat.huidig >= 0 && staat.huidig < cursus.hoofdstukken.length) {
      var open = !hoofdstukAf(staat.huidig);
      verder.disabled = open;
      if (open) verder.setAttribute('aria-describedby', 'slot-uitleg');
      else verder.removeAttribute('aria-describedby');
      if (uitleg) uitleg.hidden = !open;
    }
  }

  /* ====================================================================== */
  /* Opbouw van het frame                                                    */
  /* ====================================================================== */

  function bouwFrame() {
    document.title = cursus.titel;
    document.getElementById('cursus-titel').textContent = cursus.titel;
    document.getElementById('cursus-ondertitel').textContent = cursus.ondertitel || '';

    el.inhoud = document.getElementById('inhoud');
    el.menu = document.getElementById('menu');
    el.balk = document.getElementById('balk');
    el.balkWrap = document.getElementById('balk-wrap');
    el.balkTekst = document.getElementById('balk-tekst');

    var thuis = maak('button', 'menu-item menu-thuis', 'Overzicht');
    thuis.type = 'button';
    thuis.addEventListener('click', function () { sluitMenu(); ga(-1); });
    el.menu.appendChild(thuis);

    cursus.hoofdstukken.forEach(function (h, i) {
      var knop = maak('button', 'menu-item menu-hoofdstuk');
      knop.type = 'button';
      knop.appendChild(maak('span', 'menu-nummer', String(i + 1)));
      knop.appendChild(maak('span', 'menu-titel', ontsnap(h.titel)));
      knop.appendChild(maak('span', 'menu-vink verborgen', 'afgerond'));
      knop.addEventListener('click', function () { sluitMenu(); ga(i); });
      el.menu.appendChild(knop);
    });

    el.schakel = document.getElementById('menu-schakel');
    el.overlay = document.getElementById('overlay');

    el.schakel.addEventListener('click', function () {
      if (document.body.classList.contains('menu-open')) sluitMenu();
      else openMenu();
    });
    document.getElementById('menu-sluit').addEventListener('click', sluitMenu);
    el.overlay.addEventListener('click', sluitMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') sluitMenu();
    });
  }

  function openMenu() {
    document.body.classList.add('menu-open');
    el.schakel.setAttribute('aria-expanded', 'true');
    el.overlay.hidden = false;
    var actief = el.menu.querySelector('.is-actief') || el.menu.querySelector('button');
    if (actief) actief.focus();
  }

  function sluitMenu() {
    if (!document.body.classList.contains('menu-open')) return;
    document.body.classList.remove('menu-open');
    el.schakel.setAttribute('aria-expanded', 'false');
    el.overlay.hidden = true;
    el.schakel.focus();
  }

  /* ====================================================================== */

  function start() {
    if (!cursus || !cursus.hoofdstukken || !cursus.hoofdstukken.length) {
      document.getElementById('inhoud').innerHTML =
        '<div class="scherm"><h2>Er is geen inhoud gevonden</h2>' +
        '<p>Controleer of <code>inhoud.js</code> goed is opgeslagen en of er geen ' +
        'komma of accolade ontbreekt.</p></div>';
      return;
    }
    controleerVragen();
    window.SCORM.start();
    bouwFrame();
    herstel();
    ga(staat.huidig);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
