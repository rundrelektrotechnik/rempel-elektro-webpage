/**
 * `npm run preview`: builds the site into _preview/site so it can be opened straight
 * from disk (double-click index.html, no server), and packs it into
 * _preview/rempel-elektro-vorschau.zip for the customer.
 *
 * The normal build uses root-relative links ("/kontakt/", "/assets/css/styles.css")
 * that only work behind a web server, and folder links ("/kontakt/") that a browser
 * opening files from disk does not resolve to index.html. This script therefore
 *   - rewrites every root-relative href/src and CSS url() to a relative path,
 *     and points folder links at their index.html;
 *   - drops what cannot work or means nothing from disk (font preload, web manifest,
 *     sitemap, robots, the 404 page, icon sources, photo credits);
 *   - checks that every local link in the result points at a file that exists;
 *   - writes a small LIESMICH.txt and a zip. The zip is written here (zlib only), so
 *     no archive tool and no dependency is needed.
 * The real build (`npm run build`) is not touched.
 */
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '_preview');
const SITE = path.join(OUT, 'site');
const ZIP = path.join(OUT, 'rempel-elektro-vorschau.zip');
const FOLDER = 'Rempel-Elektro-Vorschau';

const README = `VORSCHAU DER WEBSITE
====================

So sehen Sie die Website an:

  1. Die ZIP-Datei entpacken (Rechtsklick > "Alle extrahieren").
  2. Im entpackten Ordner die Datei "index.html" doppelt anklicken.
     Sie öffnet sich in Ihrem Internet-Browser.
  3. Alle Seiten lassen sich über die Links anklicken, wie auf der echten Seite.

Hinweise:

  - Das ist nur eine Vorschau. Sie funktioniert ohne Internet und ohne Server.
  - Die Fotos sind Platzhalter, bis eigene Fotos vorliegen.
  - Das Kontaktformular öffnet Ihr E-Mail-Programm. Dafür muss auf dem
    Computer ein E-Mail-Programm eingerichtet sein.
  - Änderungswünsche bitte an die Webseitenbetreuung weitergeben.
`;

/** 1. Fresh build into _preview/site. */
function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const eleventy = path.join(ROOT, 'node_modules', '@11ty', 'eleventy', 'cmd.cjs');
  execFileSync(process.execPath, [eleventy, `--output=${path.relative(ROOT, SITE)}`], { cwd: ROOT, stdio: 'inherit' });
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/** "/leistungen/#x" seen from `file` (a path below the site root) -> "leistungen/index.html#x" relative to its folder. */
function relative(file, target) {
  const [, pathname, suffix = ''] = target.match(/^([^#?]*)([#?].*)?$/);
  const to = path.posix.join('/', pathname.endsWith('/') ? `${pathname}index.html` : pathname);
  const from = path.posix.join('/', path.posix.dirname(file));
  return (path.posix.relative(from, to) || './') + suffix;
}

/** 2. Rewrite links in HTML and CSS; drop what is useless from disk. */
function relativize() {
  for (const full of walk(SITE)) {
    const file = path.relative(SITE, full).split(path.sep).join('/');
    if (file.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      html = html.replace(/<link rel="preload"[^>]*>\s*/g, '').replace(/<link rel="manifest"[^>]*>\s*/g, '');
      html = html.replace(/\b(href|src)="(\/(?!\/)[^"]*)"/g, (_, attr, target) => `${attr}="${relative(file, target)}"`);
      fs.writeFileSync(full, html);
    } else if (file.endsWith('.css')) {
      let css = fs.readFileSync(full, 'utf8');
      css = css.replace(/url\((['"]?)(\/(?!\/)[^'")]*)\1\)/g, (_, quote, target) => `url(${quote}${relative(file, target)}${quote})`);
      fs.writeFileSync(full, css);
    }
  }
  for (const name of ['404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'assets/icons', 'assets/img/services/CREDITS.md']) {
    fs.rmSync(path.join(SITE, name), { recursive: true, force: true });
  }
}

/** 3. Every local link of every page must point at a file that exists. */
function check() {
  const problems = [];
  let links = 0;
  for (const full of walk(SITE).filter((f) => f.endsWith('.html') || f.endsWith('.css'))) {
    const text = fs.readFileSync(full, 'utf8');
    const found = [...text.matchAll(/\b(?:href|src)="([^"]*)"|url\((['"]?)([^'")]*)\2\)/g)].map((m) => m[1] ?? m[3]);
    for (const link of found) {
      if (!link || /^(https?:|mailto:|tel:|#|data:)/.test(link)) continue;
      links += 1;
      if (link.startsWith('/')) {
        problems.push(`${path.relative(SITE, full)}: Link beginnt noch mit "/": ${link}`);
        continue;
      }
      const target = path.resolve(path.dirname(full), decodeURI(link.split(/[#?]/)[0]));
      if (!fs.existsSync(target)) problems.push(`${path.relative(SITE, full)}: Ziel fehlt: ${link}`);
    }
  }
  if (problems.length) throw new Error(`Die Vorschau hat kaputte Links:\n  - ${problems.join('\n  - ')}`);
  return links;
}

/** 4. Minimal ZIP writer (deflate or stored, UTF-8 names). */
function zip(entries) {
  const stamp = new Date();
  const dosTime = (stamp.getHours() << 11) | (stamp.getMinutes() << 5) | (stamp.getSeconds() >> 1);
  const dosDate = ((stamp.getFullYear() - 1980) << 9) | ((stamp.getMonth() + 1) << 5) | stamp.getDate();
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name, 'utf8');
    const crc = zlib.crc32(data);
    const packed = zlib.deflateRawSync(data);
    const useDeflate = packed.length < data.length;
    const body = useDeflate ? packed : data;
    const method = useDeflate ? 8 : 0;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    chunks.push(local, nameBytes, body);

    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(20, 4);
    entry.writeUInt16LE(20, 6);
    entry.writeUInt16LE(0x0800, 8);
    entry.writeUInt16LE(method, 10);
    entry.writeUInt16LE(dosTime, 12);
    entry.writeUInt16LE(dosDate, 14);
    entry.writeUInt32LE(crc, 16);
    entry.writeUInt32LE(body.length, 20);
    entry.writeUInt32LE(data.length, 24);
    entry.writeUInt16LE(nameBytes.length, 28);
    entry.writeUInt32LE(offset, 42);
    central.push(entry, nameBytes);

    offset += local.length + nameBytes.length + body.length;
  }

  const centralSize = central.reduce((sum, b) => sum + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, ...central, end]);
}

function pack() {
  fs.writeFileSync(path.join(SITE, 'LIESMICH.txt'), README.replace(/\r?\n/g, '\r\n'));
  const entries = walk(SITE)
    .sort()
    .map((full) => ({
      name: `${FOLDER}/${path.relative(SITE, full).split(path.sep).join('/')}`,
      data: fs.readFileSync(full),
    }));
  fs.writeFileSync(ZIP, zip(entries));
  return entries.length;
}

build();
relativize();
const links = check();
const files = pack();
const size = (fs.statSync(ZIP).size / 1024).toFixed(0);
console.log(`\nVorschau fertig: ${links} lokale Links geprüft, alle in Ordnung.`);
console.log(`  Ordner (zum Ausprobieren): ${path.relative(ROOT, path.join(SITE, 'index.html'))}`);
console.log(`  ZIP für den Kunden:        ${path.relative(ROOT, ZIP)} (${files} Dateien, ${size} KB)`);
