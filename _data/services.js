/**
 * Service copy — the fixed list of the business, per AGENTS.md section 4.
 * Never add a service, a certification or a claim that the client has not
 * confirmed. `desc` is the teaser on the start page; `lede` and `body` are
 * used on the Leistungen page.
 */
module.exports = [
  {
    id: 'planung-beratung',
    title: 'Planung und Beratung',
    icon: 'plan',
    desc: 'Klären, was sinnvoll ist und was es kostet, bevor die erste Steckdose gesetzt wird.',
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
    title: 'Kundendienst',
    icon: 'wrench',
    desc: 'Sie rufen an, wir klären am Telefon, was zu tun ist, und kommen, wenn es nötig ist.',
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
    title: 'Elektroinstallation',
    icon: 'outlet',
    desc: 'Leitungen, Verteilungen, Steckdosen, Beleuchtung und Prüfung im Bestand und im Neubau.',
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
    title: 'Antennenanlagen',
    icon: 'sat',
    desc: 'SAT, DAB und Kabel: Empfang herstellen, Anlagen justieren, Verteilung ordnen.',
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
    title: 'Photovoltaik',
    icon: 'solar',
    desc: 'PV auf dem Dach, Wechselrichter, Speicher, Anschluss an die Hausinstallation.',
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
