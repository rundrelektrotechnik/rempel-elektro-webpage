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
      'Sie erhalten eine nachvollziehbare Übersicht: welche Arbeiten anfallen, in welcher Reihenfolge und mit welchem Aufwand. Bei Photovoltaik und Speicher sagen wir Ihnen, welche Anmeldung und welche Förderung in Frage kommen.',
    ],
    items: [
      'Sichtprüfung der vorhandenen Installation',
      'Übersicht der Verteilung und der Verbrauchsstellen',
      'Vorschlag, welche Schritte nacheinander sinnvoll sind',
      'Angaben zu Anmeldung und Förderung bei Photovoltaik',
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
      'Danach prüfen wir die Anlage, finden die Ursache und tauschen oder reparieren, was schadhaft ist. Wartung und Kontrolle sind sinnvoll, wenn Sicherungen, FI-Schalter oder Leitungen älter sind oder die Anlage stark beansprucht wird.',
    ],
    items: [
      'Fehlersuche in Leitungen, Steckdosen und Verteilungen',
      'Austausch schadhafter Kontakte, Schalter und Sicherungen',
      'Prüfung von FI-Schaltern und Schutzschaltern',
      'Wartung elektrischer Anlagen nach Absprache',
      'Reparaturen nach einem Schaden oder in älteren Gebäuden',
    ],
  },
  {
    id: 'elektroinstallation',
    title: 'Elektroinstallation',
    icon: 'outlet',
    desc: 'Leitungen, Verteilungen, Steckdosen, Beleuchtung und Prüfung im Bestand und im Neubau.',
    lede: 'Wir verlegen Leitungen, setzen Verteilungen und nehmen Anschlüsse in Betrieb – auch dort, wo das Haus schon steht.',
    body: [
      'Vom einzelnen Stromkreis bis zur ganzen Verteilung: Leitungen verlegen, Unterverteilung ergänzen, Steckdosen und Schalter setzen, Beleuchtung anschließen und den Anschluss an den vorhandenen Anschlussraum herstellen.',
      'Bestandsgebäude sind selten leergeräumt, wenn gearbeitet wird. Wir sagen vorher, welche Bereiche über mehrere Tage belegt sind und was Sie selbst vorbereiten sollten. Nach Abschluss erhalten Sie die Übersicht der neuen Stromkreise und die Prüfprotokolle.',
    ],
    items: [
      'Neue Stromkreise für Küche, Werkstatt und Außenbereich',
      'Steckdosen, Schalter und Abzweige ergänzen oder ersetzen',
      'Unterverteilungen setzen und den Anschlussraum erweitern',
      'Beleuchtung und Anschlüsse im Außenbereich',
      'Prüfung der Anlage und Prüfprotokoll nach Abschluss',
    ],
  },
  {
    id: 'antennenanlagen',
    title: 'Antennenanlagen',
    icon: 'sat',
    desc: 'SAT, DAB und Kabel: Empfang herstellen, Anlagen justieren, Verteilung ordnen.',
    lede: 'Empfang ist kein Zufall. Wir richten die Anlage aus und verteilen das Signal sauber in den Räumen.',
    body: [
      'Wir montieren und justieren Sat-Anlagen, bauen DAB- und UKW-Empfang auf und schließen Kabelanschlüsse an. Dazu gehören Antenne, Halterung, Kabel und die Verteilung auf mehrere Räume.',
      'Bei Empfangsstörungen prüfen wir die Anlage, statt blind Bauteile zu tauschen: Pegelmessung, Kabel und Anschlüsse zeigen meist, wo der Fehler sitzt.',
    ],
    items: [
      'Sat-Antennen und Empfangsgeräte, justiert und fest montiert',
      'DAB und UKW für mehrere Räume',
      'Kabelanschluss und Verteilung auf mehrere Abnehmer',
      'Pegelmessung und Störungssuche bei Empfangsproblemen',
    ],
  },
  {
    id: 'photovoltaik',
    title: 'Photovoltaik',
    icon: 'solar',
    desc: 'PV auf dem Dach, Wechselrichter, Speicher, Anschluss an die Hausinstallation.',
    lede: 'Wir prüfen das Dach, montieren Module und Wechselrichter, schließen Speicher an und melden die Anlage an.',
    body: [
      'Zuerst prüfen wir, ob Dach und Hausinstallation für eine Photovoltaikanlage geeignet sind, und sagen Ihnen, was real auf dem Dach möglich ist. Danach montieren wir Module und Wechselrichter und schließen die Anlage an die vorhandene Verteilung und den Anschlussraum an.',
      'Die Inbetriebnahme braucht Sorgfalt: die Anmeldung beim Netzbetreiber, der Zweirichtungszähler, die Dokumentation der Anlage und die Prüfung. Wir schreiben auf, was Sie dafür brauchen und was wir übernehmen.',
    ],
    items: [
      'Module und Wechselrichter, auf dem Dach montiert',
      'Anschluss an Verteilung und Anschlussraum',
      'Speicher und Vorbereitung für Wallbox oder Wärmepumpe',
      'Anmeldung beim Netzbetreiber, Zweirichtungszähler, Dokumentation',
      'Prüfung und Übergabe der fertigen Anlage',
    ],
  },
];
