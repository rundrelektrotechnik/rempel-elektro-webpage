# Rempel-Elektro website

The new website for **Rempel-Elektro** (Nikolai Rempel, Michelstadt, Odenwald).
It replaces the old site at <http://www.rempel-elektro.de/>.

The site is in German and has one main goal: make it easy for visitors to phone the business.
It has a start page, services, contact, and the legal pages (Impressum and Datenschutz).
It uses no cookies, no tracking and nothing from third-party services.

## Changing texts and contact details

Everything the customer maintains is in one plain text file: **`kundendaten.txt`**.
It holds the address, phone numbers, e-mail and the wording of the pages.
Open it in any text editor, change only the text after the colon, and save.
Notes at the top of the file explain the rules.

## Seeing the website

You need [Node.js](https://nodejs.org/) installed once. Then, in this folder:

```bash
npm install
npm run dev
```

Open <http://localhost:8081/> in your browser. Changes to `kundendaten.txt` show up right away.

To create a copy that can be sent to the customer and opened straight from a folder:

```bash
npm run preview
```

The result is in `_preview/` (a folder and a zip file).

## More information

- `plans/PROJECT.md`: the full plan and page descriptions
- `AGENTS.md`: working rules for everyone who edits this project
- `assets/img/services/CREDITS.md`: sources and licences of the photos
