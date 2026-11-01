/**
 * Service copy — the fixed list of the business, per AGENTS.md section 4.
 * Never add a service, a certification or a claim that the client has not
 * confirmed. `teaser` is the few words on the start-page tile, `image` its stock
 * photo (assets/img/services/CREDITS.md). The Leistungen page shows `lede` and
 * the short `items` list per service: keep both short.
 */
module.exports = [
  {
    id: 'planung-beratung',
    title: 'Planung und Beratung',
    image: '/assets/img/services/planung-beratung.jpg',
    imagePos: '50% 50%',
    teaser: 'Vorab klären, was sinnvoll ist.',
    lede: 'Erst das Gespräch, dann der Auftrag: Wir erfassen, was Sie vorhaben, und sagen, was davon sinnvoll ist.',
    items: [
      'Sichtprüfung der vorhandenen Installation',
      'Übersicht der Arbeiten und ihres Aufwands',
      'Hinweise zu Fördermitteln bei Photovoltaik',
    ],
  },
  {
    id: 'kundendienst',
    title: 'Kundendienst',
    image: '/assets/img/services/kundendienst.jpg',
    imagePos: '50% 50%',
    teaser: 'Fehler finden, Schäden beheben.',
    lede: 'Wenn der Strom fehlt oder eine Steckdose nicht mehr geht: Sie rufen an, wir fragen nach und kommen.',
    items: [
      'Fehlersuche in Leitungen, Steckdosen und Verteilungen',
      'Reparaturen an der elektrischen Anlage',
      'Wartung nach Absprache',
    ],
  },
  {
    id: 'elektroinstallation',
    title: 'Elektroinstallation',
    image: '/assets/img/services/elektroinstallation.jpg',
    imagePos: '50% 30%',
    teaser: 'Neubau und Bestand.',
    lede: 'Leitungen, Verteilungen, Steckdosen und Beleuchtung – im Neubau und dort, wo das Haus schon steht.',
    items: [
      'Leitungen verlegen',
      'Verteilungen setzen oder erweitern',
      'Steckdosen, Schalter und Beleuchtung',
      'Prüfung der Anlage nach Abschluss',
    ],
  },
  {
    id: 'antennenanlagen',
    title: 'Antennenanlagen',
    image: '/assets/img/services/antennenanlagen.jpg',
    imagePos: '50% 50%',
    teaser: 'SAT, DAB und Kabel.',
    lede: 'Wir richten die Anlage aus und prüfen, wo der Empfang scheitert.',
    items: [
      'Sat-Antennen, montiert und justiert',
      'DAB-Empfang',
      'Kabelanschluss',
      'Störungssuche bei Empfangsproblemen',
    ],
  },
  {
    id: 'photovoltaik',
    title: 'Photovoltaik',
    image: '/assets/img/services/photovoltaik.jpg',
    imagePos: '50% 50%',
    teaser: 'Module, Speicher, Anschluss.',
    lede: 'Wir prüfen das Dach, montieren Module und Wechselrichter und schließen Speicher an.',
    items: [
      'Module und Wechselrichter auf dem Dach',
      'Anschluss an die Hausinstallation',
      'Speicher und Einspeisung',
      'Prüfung der fertigen Anlage',
    ],
  },
];
