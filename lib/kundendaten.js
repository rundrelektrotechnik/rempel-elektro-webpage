/**
 * Reads /kundendaten.txt: the one file the customer edits, in a plain format for
 * someone without technical knowledge.
 *
 *   # a comment line
 *   Telefon: 06061 - 70 31 96          a fact, before the first [section]
 *
 *   [Startseite Hero]                  a section of website text
 *   Titel: Elektrohandwerk in ...
 *   Text: A long text can go on
 *       following lines that start with a space.
 *   Punkt: a repeated key makes a list (only where the schema says so)
 *
 * Everything the file may contain is declared below (FACTS and SECTIONS). Anything
 * else, a missing value or a value that looks wrong stops the build with a message
 * in German that names the line, because the person who reads it is the customer.
 *
 * Consumers: _data/site.js (facts), _data/text.js (page texts), _data/services.js
 * (the five services' texts). Each calls readCustomerFile(); the file is read on
 * every data build, so `npm run dev` picks up edits (kundendaten.txt is a watch target).
 */
const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'kundendaten.txt');

const PHONE = /^0[\d ()/-]{5,}$/;

/** Facts: before the first [section]. `label` is the name before the colon. */
const FACTS = [
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

const HEADING = { label: 'Überschrift', aliases: ['Ueberschrift'] };

/** Sections of website text. Every field is required; `list` fields repeat the key. */
const SECTIONS = [
  { id: 'general', name: 'Allgemein', fields: [{ id: 'tagline', label: 'Kurzbeschreibung' }] },
  { id: 'hero', name: 'Startseite Hero', fields: [{ id: 'title', label: 'Titel' }, { id: 'text', label: 'Text' }] },
  { id: 'servicesStart', name: 'Startseite Leistungen', fields: [{ id: 'heading', ...HEADING }] },
  { id: 'stepsHeading', name: 'Zusammenarbeit', fields: [{ id: 'heading', ...HEADING }] },
  ...[1, 2, 3].map((n) => ({
    id: `step${n}`,
    name: `Schritt ${n}`,
    fields: [{ id: 'title', label: 'Titel' }, { id: 'text', label: 'Text' }],
  })),
  {
    id: 'region',
    name: 'Einsatzgebiet',
    fields: [
      { id: 'heading', ...HEADING },
      { id: 'text', label: 'Text' },
      { id: 'places', label: 'Orte', split: ',', hint: 'Ortsnamen mit Komma getrennt, zum Beispiel Michelstadt, Odenwald, Odenwaldkreis' },
    ],
  },
  { id: 'contactStart', name: 'Startseite Kontakt', fields: [{ id: 'heading', ...HEADING }, { id: 'note', label: 'Hinweis' }] },
  {
    id: 'servicesPage',
    name: 'Seite Leistungen',
    fields: [
      { id: 'title', label: 'Titel' },
      { id: 'lede', label: 'Text' },
      { id: 'closingTitle', label: 'Abschluss Überschrift', aliases: ['Abschluss Ueberschrift'] },
      { id: 'closingText', label: 'Abschluss Text' },
    ],
  },
  { id: 'contactPage', name: 'Seite Kontakt', fields: [{ id: 'lede', label: 'Text' }] },
  ...[1, 2, 3, 4, 5].map((n) => ({
    id: `service${n}`,
    name: `Leistung ${n}`,
    fields: [
      { id: 'title', label: 'Titel' },
      { id: 'teaser', label: 'Kurztext' },
      { id: 'lede', label: 'Beschreibung' },
      { id: 'items', label: 'Punkt', list: { min: 2, max: 6 } },
    ],
  })),
];

const norm = (text) => text.toLowerCase().replace(/\s+/g, '');

const lookup = (fields) => {
  const map = new Map();
  for (const field of fields) {
    for (const name of [field.label, ...(field.aliases || [])]) map.set(norm(name), field);
  }
  return map;
};

/** Splits the file into entries { section, label, value, line } and structural problems. */
function readEntries(text, problems) {
  const entries = [];
  let section = null;
  let last = null;
  text.replace(/^﻿/, '').split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    const where = `Zeile ${index + 1}`;
    if (!line || line.startsWith('#')) return;

    if (/^\[.*\]$/.test(line)) {
      section = { name: line.slice(1, -1).trim(), line: index + 1 };
      last = null;
      return;
    }
    // A line that starts with a space continues the value above it.
    if (/^\s/.test(raw) && last) {
      last.value = `${last.value} ${line}`.trim();
      return;
    }
    const colon = line.indexOf(':');
    if (colon < 1) {
      problems.push(`${where}: "${line}" – hier fehlt der Doppelpunkt. Erwartet wird: Name: Wert`);
      last = null;
      return;
    }
    last = { section, label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim(), line: index + 1 };
    entries.push(last);
  });
  return entries;
}

/** Reads and checks kundendaten.txt. Returns { facts, text, services }; throws a German message on any problem. */
function readCustomerFile() {
  let raw;
  try {
    raw = fs.readFileSync(FILE, 'utf8');
  } catch {
    throw new Error('Die Datei "kundendaten.txt" fehlt. Sie gehört in den Hauptordner des Projekts.');
  }
  if (raw.includes('�') || /Ã[¤¶¼Ÿ]/.test(raw)) {
    throw new Error('Die Datei "kundendaten.txt" ist nicht als UTF-8 gespeichert (Umlaute sind kaputt). Bitte im Editor als "UTF-8" speichern.');
  }

  const problems = [];
  const entries = readEntries(raw, problems);

  const factFields = lookup(FACTS);
  const sectionDefs = new Map(SECTIONS.map((s) => [norm(s.name), s]));
  const result = { facts: {}, sections: {} };
  const reported = new Set(); // "section|field" that already has a message
  const unknownSections = new Set();

  for (const entry of entries) {
    const where = `Zeile ${entry.line}`;
    let def = null;
    let fields = factFields;
    let target = result.facts;
    let scope = '';

    if (entry.section) {
      def = sectionDefs.get(norm(entry.section.name));
      if (!def) {
        if (!unknownSections.has(entry.section.name)) {
          unknownSections.add(entry.section.name);
          problems.push(`Zeile ${entry.section.line}: [${entry.section.name}] ist keine bekannte Überschrift in eckigen Klammern. Bekannt sind: ${SECTIONS.map((s) => `[${s.name}]`).join(', ')}`);
        }
        continue;
      }
      fields = lookup(def.fields);
      target = result.sections[def.id] ||= {};
      scope = `${def.id}|`;
    }

    const field = fields.get(norm(entry.label));
    if (!field) {
      const known = (def ? def.fields : FACTS).map((f) => f.label).join(', ');
      problems.push(`${where}: "${entry.label}" ist hier keine bekannte Angabe${def ? ` (im Abschnitt [${def.name}])` : ' (vor dem ersten Abschnitt in eckigen Klammern)'}. Bekannt sind: ${known}`);
      continue;
    }
    if (!entry.value) continue; // reported below as missing
    if (field.check && !field.check.test(entry.value)) {
      problems.push(`${where}: ${field.label} "${entry.value}" sieht nicht richtig aus (${field.hint}).`);
      reported.add(scope + field.id);
      continue;
    }

    if (field.list) {
      (target[field.id] ||= []).push(entry.value);
    } else if (target[field.id] !== undefined) {
      problems.push(`${where}: "${field.label}" steht doppelt${def ? ` im Abschnitt [${def.name}]` : ''}. Jede Angabe bitte nur einmal.`);
    } else {
      target[field.id] = field.split ? entry.value.split(field.split).map((p) => p.trim()).filter(Boolean) : entry.value;
    }
  }

  for (const field of FACTS) {
    if (!result.facts[field.id] && !reported.has(field.id)) problems.push(`${field.label} fehlt oder ist leer.`);
  }
  for (const def of SECTIONS) {
    const target = result.sections[def.id] || {};
    for (const field of def.fields) {
      const value = target[field.id];
      if (reported.has(`${def.id}|${field.id}`)) continue;
      if (field.list) {
        const count = value ? value.length : 0;
        if (count < field.list.min || count > field.list.max) {
          problems.push(`[${def.name}]: Es werden ${field.list.min} bis ${field.list.max} Zeilen "${field.label}:" erwartet, gefunden wurden ${count}.`);
        }
      } else if (!value || (Array.isArray(value) && !value.length)) {
        problems.push(`[${def.name}]: "${field.label}" fehlt oder ist leer.`);
      }
    }
  }
  if (problems.length) {
    throw new Error(`Fehler in kundendaten.txt:\n  - ${problems.join('\n  - ')}`);
  }

  const s = result.sections;
  return {
    facts: result.facts,
    text: {
      tagline: s.general.tagline,
      hero: s.hero,
      servicesStart: s.servicesStart,
      steps: { heading: s.stepsHeading.heading, items: [s.step1, s.step2, s.step3] },
      region: s.region,
      contactStart: s.contactStart,
      servicesPage: s.servicesPage,
      contactPage: s.contactPage,
    },
    services: [1, 2, 3, 4, 5].map((n) => s[`service${n}`]),
  };
}

module.exports = { readCustomerFile };
