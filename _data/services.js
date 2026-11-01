/**
 * Service copy — the fixed list of the business, per AGENTS.md section 4.
 * Never add a service, a certification or a claim that the client has not
 * confirmed. `teaser` is the few words on the start-page tile, `image` its stock photo (CREDITS.md); `lede` and `body` are
 * used on the Leistungen page.
 */
module.exports = [
  {
    id: 'planung-beratung',
    image: '/assets/img/services/planung-beratung.jpg',
    imagePos: '50% 50%',
    teaser: 'Vorab klären, was sinnvoll ist.',
    title: 'Planung und Beratung',
    icon: 'plan',
    lede: 'Am Anfang steht ein Gespräch, kein Auftrag. Wir erfassen, was Sie vorhaben, und schätzen ein, was davon tragfähig ist.',
    body: [
      'Wir hören zu, bevor wir planen: Was soll die Anlage leisten, welche Räume sind betroffen, was ist schon vorhanden? Danach sprechen wir darüber, welche Ausführung für Ihr Gebäude sinnvoll ist und welche Anforderungen die einschlägigen VDE-Vorschriften stellen.',
      'Sie erhalten eine nachvollziehbare Übersicht: welche Arbeiten anfallen, in welcher Reihenfolge und mit welchem Aufwand. Bei Photovoltaik und Speicher sagen wir Ihnen, welche Förderung in Frage kommen kann.',
    ],
    items: [
      'Sichtprüfung der vorhandenen Installation',
      'Übersicht der Verteilung und der Verbrauchsstellen',
      'Vorschlag, welche Schritte nacheinander sinnvoll sind',
      'Hinweise zu Fördermitteln bei Photovoltaik',
    ],
  },
  {
    id: 'kundendienst',
    image: '/assets/img/services/kundendienst.jpg',
    imagePos: '50% 50%',
    teaser: 'Fehler finden, Schäden beheben.',
    title: 'Kundendienst',
    icon: 'wrench',
    lede: 'Wenn der Strom fehlt oder eine Steckdose nicht mehr funktioniert: Sie rufen an, wir fragen nach und kommen.',
    body: [
      'Der Anruf ist der kürzeste Weg. Wir fragen am Telefon nach, was passiert ist, und schätzen ein, ob Sie selbst etwas tun können oder wir kommen müssen.',
      'Danach prüfen wir die Anlage, finden die Ursache und reparieren, was schadhaft ist. Auch Wartung gehört dazu.',
    ],
    items: [
      'Fehlersuche in Leitungen, Steckdosen und Verteilungen',
      'Reparaturen an der elektrischen Anlage',
      'Wartung nach Absprache',
    ],
  },
  {
    id: 'elektroinstallation',
    image: '/assets/img/services/elektroinstallation.jpg',
    imagePos: '50% 30%',
    teaser: 'Neubau und Bestand.',
    title: 'Elektroinstallation',
    icon: 'outlet',
    lede: 'Wir verlegen Leitungen, setzen Verteilungen und schließen Beleuchtung und Steckdosen an – auch dort, wo das Haus schon steht.',
    body: [
      'Vom einzelnen Stromkreis bis zur ganzen Verteilung: Leitungen verlegen, Verteilungen setzen oder erweitern, Steckdosen und Schalter setzen und Beleuchtung anschließen.',
      'Bestandsgebäude sind selten leergeräumt, wenn gearbeitet wird. Wir sagen vorher, welche Bereiche über mehrere Tage belegt sind und was Sie selbst vorbereiten sollten. Nach Abschluss prüfen wir die Anlage.',
    ],
    items: [
      'Leitungen verlegen',
      'Verteilungen setzen oder erweitern',
      'Steckdosen und Schalter setzen oder ersetzen',
      'Beleuchtung anschließen',
      'Prüfung der Anlage nach Abschluss',
    ],
  },
  {
    id: 'antennenanlagen',
    image: '/assets/img/services/antennenanlagen.jpg',
    imagePos: '50% 50%',
    teaser: 'SAT, DAB und Kabel.',
    title: 'Antennenanlagen',
    icon: 'sat',
    lede: 'Empfang ist kein Zufall. Wir richten die Anlage aus und prüfen, wo der Empfang scheitert.',
    body: [
      'Wir montieren und justieren Sat-Anlagen, bauen DAB-Empfang auf und schließen Kabelanschlüsse an. Dazu gehören Antenne, Halterung und Kabel.',
      'Bei Empfangsstörungen prüfen wir die Anlage, statt blind Bauteile zu tauschen.',
    ],
    items: [
      'Sat-Antennen und Empfangsgeräte, justiert und fest montiert',
      'DAB-Empfang',
      'Kabelanschluss',
      'Störungssuche bei Empfangsproblemen',
    ],
  },
  {
    id: 'photovoltaik',
    image: '/assets/img/services/photovoltaik.jpg',
    imagePos: '50% 50%',
    teaser: 'Module, Speicher, Anschluss.',
    title: 'Photovoltaik',
    icon: 'solar',
    lede: 'Wir prüfen das Dach, montieren Module und Wechselrichter und schließen Speicher an.',
    body: [
      'Zuerst prüfen wir, ob Dach und Hausinstallation für eine Photovoltaikanlage geeignet sind, und sagen Ihnen, was real auf dem Dach möglich ist. Danach montieren wir Module und Wechselrichter und schließen die Anlage an die vorhandene Hausinstallation an.',
      'Die Inbetriebnahme braucht Sorgfalt, auch bei der Einspeisung. Wir sagen Ihnen, was dafür nötig ist und was wir übernehmen.',
    ],
    items: [
      'Module und Wechselrichter, auf dem Dach montiert',
      'Anschluss an die Hausinstallation',
      'Speicher',
      'Einspeisung',
      'Prüfung der fertigen Anlage',
    ],
  },
];
