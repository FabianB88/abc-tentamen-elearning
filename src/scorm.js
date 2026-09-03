/* ==========================================================================
   SCORM 1.2 koppeling
   --------------------------------------------------------------------------
   Praat met de LMS (Brightspace) zodat docenten kunnen zien wie de e-learning
   heeft afgerond. Draait de e-learning buiten een LMS, dan valt alles stil
   terug op localStorage en werkt de cursus gewoon door.

   Je hoeft dit bestand niet aan te passen om de inhoud te wijzigen.
   ========================================================================== */

window.SCORM = (function () {
  'use strict';

  var api = null;
  var actief = false;
  var lokaleSleutel = 'abc-tentamen-elearning';

  /* --- de LMS-API opzoeken ---------------------------------------------- */
  // SCORM-inhoud draait in een iframe. De LMS zet een object window.API klaar
  // in een van de vensters erboven. We lopen omhoog via parent, en daarna via
  // opener (voor LMS'en die de cursus in een popup openen).
  function zoekIn(venster) {
    var pogingen = 0;
    while (venster && pogingen < 500) {
      try {
        if (venster.API) return venster.API;
      } catch (e) {
        // cross-origin venster: niet bij te komen, gewoon doorgaan
      }
      if (venster.parent === venster) break;
      venster = venster.parent;
      pogingen++;
    }
    return null;
  }

  function zoekApi() {
    var gevonden = zoekIn(window);
    if (!gevonden && window.opener && !window.opener.closed) {
      gevonden = zoekIn(window.opener);
    }
    return gevonden;
  }

  /* --- basisbewerkingen -------------------------------------------------- */
  function lees(sleutel) {
    if (!actief) return '';
    var waarde = api.LMSGetValue(sleutel);
    return waarde === null || waarde === undefined ? '' : String(waarde);
  }

  function schrijf(sleutel, waarde) {
    if (!actief) return false;
    return api.LMSSetValue(sleutel, String(waarde)) === 'true';
  }

  function bewaar() {
    if (!actief) return false;
    return api.LMSCommit('') === 'true';
  }

  /* --- opstarten --------------------------------------------------------- */
  function start() {
    api = zoekApi();
    if (!api) {
      console.info('[SCORM] Geen LMS gevonden. Voortgang wordt lokaal bewaard.');
      return false;
    }
    if (api.LMSInitialize('') !== 'true') {
      console.warn('[SCORM] LMSInitialize is mislukt.');
      api = null;
      return false;
    }
    actief = true;

    // Alleen op "incomplete" zetten als de LMS nog niets weet. Anders zou een
    // student die de cursus al had afgerond zijn resultaat kwijtraken bij het
    // opnieuw openen.
    var status = lees('cmi.core.lesson_status');
    if (!status || status === 'not attempted' || status === 'unknown') {
      schrijf('cmi.core.lesson_status', 'incomplete');
    }
    bewaar();
    return true;
  }

  /* --- voortgang bewaren en terughalen ----------------------------------- */
  // suspend_data is in SCORM 1.2 beperkt tot 4096 tekens. Onze voortgang is
  // een kleine JSON (welke hoofdstukken gezien, welke antwoorden gegeven), dus
  // dat past ruim. We kappen desondanks af, zodat een LMS nooit weigert.
  function bewaarVoortgang(gegevens) {
    var tekst = JSON.stringify(gegevens);
    try {
      window.localStorage.setItem(lokaleSleutel, tekst);
    } catch (e) {
      // privémodus of opslag vol: niet erg, de LMS is de echte opslag
    }
    if (!actief) return;
    if (tekst.length > 4000) {
      console.warn('[SCORM] Voortgang is te groot voor suspend_data, niet opgeslagen.');
      return;
    }
    schrijf('cmi.suspend_data', tekst);
    if (gegevens.huidigHoofdstuk) {
      schrijf('cmi.core.lesson_location', gegevens.huidigHoofdstuk);
    }
    bewaar();
  }

  function haalVoortgang() {
    var tekst = '';
    if (actief) tekst = lees('cmi.suspend_data');
    if (!tekst) {
      try {
        tekst = window.localStorage.getItem(lokaleSleutel) || '';
      } catch (e) {
        tekst = '';
      }
    }
    if (!tekst) return null;
    try {
      return JSON.parse(tekst);
    } catch (e) {
      console.warn('[SCORM] Opgeslagen voortgang was onleesbaar, opnieuw beginnen.');
      return null;
    }
  }

  /* --- resultaat wegschrijven -------------------------------------------- */
  function meldResultaat(percentage, geslaagd) {
    if (!actief) return;
    var afgerond = Math.round(percentage);
    schrijf('cmi.core.score.min', '0');
    schrijf('cmi.core.score.max', '100');
    schrijf('cmi.core.score.raw', afgerond);
    schrijf('cmi.core.lesson_status', geslaagd ? 'passed' : 'failed');
    bewaar();
  }

  function meldOnvoltooid() {
    if (!actief) return;
    var status = lees('cmi.core.lesson_status');
    // Een eerder behaald resultaat nooit terugzetten naar incomplete.
    if (status === 'passed' || status === 'completed') return;
    schrijf('cmi.core.lesson_status', 'incomplete');
    bewaar();
  }

  /* --- netjes afsluiten --------------------------------------------------- */
  var afgesloten = false;
  function stop() {
    if (!actief || afgesloten) return;
    afgesloten = true;
    bewaar();
    api.LMSFinish('');
    actief = false;
  }

  // Brightspace sluit het venster soms zonder waarschuwing. pagehide vuurt ook
  // op mobiel, waar unload dat niet betrouwbaar doet.
  window.addEventListener('pagehide', stop);
  window.addEventListener('unload', stop);

  return {
    start: start,
    stop: stop,
    actief: function () { return actief; },
    naamStudent: function () {
      return actief ? lees('cmi.core.student_name') : '';
    },
    bewaarVoortgang: bewaarVoortgang,
    haalVoortgang: haalVoortgang,
    meldResultaat: meldResultaat,
    meldOnvoltooid: meldOnvoltooid
  };
})();
