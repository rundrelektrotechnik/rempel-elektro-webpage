/**
 * Single source of truth for all company and legal data.
 * Never retype a fact in a template: pull it from here.
 *
 * Facts the customer supplies live in /kundendaten.txt, a plain `Name: Wert` file
 * the customer edits without any tooling. This module reads it on every data build
 * (the module exports a function, so the dev server picks edits up too), checks it
 * and derives everything else from it: link hrefs, the address line, the maps link.
 * Everything below the derived values is copy and configuration that belongs to the
 * developers, not to the customer.
 *
 * Displayed values keep the German spacing ("06061 - 70 31 96").
 * Link hrefs use the international form without spacing ("tel:+496061703196"):
 * the visible number starts with the German 0, the link works from abroad too.
 */
const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'kundendaten.txt');

const PHONE = /^0[\d ()/-]{5,}$/;

/** The fields of kundendaten.txt. `label` is the name before the colon. */
const FIELDS = [
  { id: 'name', label: 'Firma' },
  { id: 'owner', label: 'Inhaber' },
  { id: 'title', label: 'Titel' },
  { id: 'street', label: 'Straße', aliases: ['Strasse'] },
  { id: 'zip', label: 'PLZ', check: /^\d{5}$/, hint: 'fünf Ziffern, zum Beispiel 64720' },
  { id: 'city', label: 'Ort' },
  { id: 'phone', label: 'Telefon', check: PHONE, hint: 'mit der 0 am Anfang, zum Beispiel 06061 - 70 31 96' },
  { id: 'mobile', label: 'Mobil', check: PHONE, hint: 'mit der 0 am Anfang, zum Beispiel 0170 - 514 562 5' },
  { id: 'fax', label: 'Fax', check: PHONE, hint: 'mit der 0 am Anfang, zum Beispiel 06061 - 70 31 97' },
  { id: 'email', label: 'E-Mail', aliases: ['Email', 'Mail'], check: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, hint: 'zum Beispiel name@beispiel.de' },
  { id: 'kammer', label: 'Handwerkskammer' },
  { id: 'betriebsnummer', label: 'Betriebsnummer', aliases: ['Betriebs-Nr.', 'Betriebs-Nr'], check: /^\d+$/, hint: 'nur Ziffern' },
  { id: 'ustIdNr', label: 'USt-IdNr.', aliases: ['USt-IdNr', 'Umsatzsteuer-ID'], check: /^DE ?\d{9}$/, hint: 'zum Beispiel DE 245119682' },
  { id: 'url', label: 'Internetadresse', aliases: ['Website', 'Domain'], check: /^https:\/\/[^\s/]+$/, hint: 'mit https:// am Anfang und ohne Schrägstrich am Ende' },
];

const norm = (text) => text.toLowerCase().replace(/\s+/g, '');

/** Reads kundendaten.txt and returns its values by field id. Throws a German message on any problem. */
function readCustomerData() {
  let text;
  try {
    text = fs.readFileSync(FILE, 'utf8');
  } catch {
    throw new Error('Die Datei "kundendaten.txt" fehlt. Sie gehört in den Hauptordner des Projekts.');
  }
  if (text.includes('�') || /Ã[¤¶¼Ÿ]/.test(text)) {
    throw new Error('Die Datei "kundendaten.txt" ist nicht als UTF-8 gespeichert (Umlaute sind kaputt). Bitte im Editor als "UTF-8" speichern.');
  }

  const byLabel = new Map();
  for (const field of FIELDS) {
    for (const name of [field.label, ...(field.aliases || [])]) byLabel.set(norm(name), field);
  }

  const values = {};
  const problems = [];
  const reported = new Set(); // fields that already have a message
  text.replace(/^﻿/, '').split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const colon = line.indexOf(':');
    const where = `Zeile ${index + 1}`;
    if (colon < 1) {
      problems.push(`${where}: "${line}" – hier fehlt der Doppelpunkt. Erwartet wird: Name: Wert`);
      return;
    }
    const field = byLabel.get(norm(line.slice(0, colon)));
    if (!field) {
      problems.push(`${where}: "${line.slice(0, colon).trim()}" ist keine bekannte Angabe. Bekannt sind: ${FIELDS.map((f) => f.label).join(', ')}`);
      return;
    }
    const value = line.slice(colon + 1).trim();
    if (!value) return; // reported below as missing
    if (field.check && !field.check.test(value)) {
      problems.push(`${where}: ${field.label} "${value}" sieht nicht richtig aus (${field.hint}).`);
      reported.add(field.id);
      return;
    }
    values[field.id] = value;
  });

  for (const field of FIELDS) {
    if (!values[field.id] && !reported.has(field.id)) problems.push(`${field.label} fehlt oder ist leer.`);
  }
  if (problems.length) {
    throw new Error(`Fehler in kundendaten.txt:\n  - ${problems.join('\n  - ')}`);
  }
  return values;
}

/** "06061 - 70 31 96" -> "6061703196": digits without the leading 0. */
const national = (number) => number.replace(/\D/g, '').slice(1);

/**
 * "06061 - 70 31 96" -> "+49 6061 703196": the dash the customer writes after the area
 * code is kept as the split. Without a dash the number is not split.
 */
function international(number) {
  const parts = number.match(/^0(\d+)\s*[-/]\s*(.+)$/);
  return parts ? `+49 ${parts[1]} ${parts[2].replace(/\D/g, '')}` : `+49 ${national(number)}`;
}

module.exports = function () {
  const c = readCustomerData();
  const address = `${c.street}, ${c.zip} ${c.city}`;

  return {
    // --- from kundendaten.txt ---
    name: c.name,
    owner: c.owner,
    title: c.title,

    street: c.street,
    zip: c.zip,
    city: c.city,
    region: 'Odenwald',
    address,

    phone: c.phone,
    phoneIntl: international(c.phone),
    phoneHref: `tel:+49${national(c.phone)}`,
    fax: c.fax,
    faxIntl: international(c.fax),
    faxHref: `tel:+49${national(c.fax)}`,
    mobile: c.mobile,
    mobileHref: `tel:+49${national(c.mobile)}`,

    email: c.email,
    emailHref: `mailto:${c.email}`,

    kammer: c.kammer,
    betriebsnummer: c.betriebsnummer,
    ustIdNr: c.ustIdNr,

    /** Canonical origin. */
    url: c.url,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.street} ${c.zip} ${c.city}`).replace(/%20/g, '+')}`,

    // --- developer copy and configuration ---
    ogImage: '/assets/img/og-image.png',
    ogImageAlt: 'Rempel-Elektro: Blitzsymbol und Schriftzug',

    /** Colour used by the manifest and theme-color meta. */
    themeColor: '#12324e',

    /** Date shown on the legal pages. Edit by hand when the text changes; never derive it from the build. */
    legalStand: 'November 2026',

    /** Year in the footer copyright. Refreshed when the build runs. */
    year: new Date().getFullYear(),

    /** Where the business works. Generic on purpose: no invented service list. */
    area: 'Michelstadt, dem Odenwald und den umliegenden Gemeinden des Odenwaldkreises',

    /** Same areas as plain place names, for schema.org/areaServed. */
    areaNames: ['Michelstadt', 'Odenwald', 'Odenwaldkreis'],

    /** One-line description of the business: footer and default title. */
    tagline: 'Elektrohandwerk in Michelstadt und im Odenwald',

    /** Default metadata for pages that set nothing in their frontmatter. */
    metaTitle: `${c.name} – Elektrohandwerk in Michelstadt und im Odenwald`,
    metaDescription:
      'Elektrohandwerk in Michelstadt und im Odenwald: Planung und Beratung, Kundendienst, ' +
      `Elektroinstallation, Antennenanlagen und Photovoltaik. Erreichbar unter ${c.phone}.`,

    /** Main navigation. */
    nav: [
      { text: 'Start', href: '/' },
      { text: 'Leistungen', href: '/leistungen/' },
      { text: 'Kontakt', href: '/kontakt/' },
    ],

    /** Legal links, always in the footer of every page. */
    legalNav: [
      { text: 'Impressum', href: '/impressum/' },
      { text: 'Datenschutz', href: '/datenschutz/' },
    ],
  };
};
