# Design direction

Read this before you add a page or a component.

## The idea

**From ™ to ®.** The site borrows its look from what the firm actually produces: registered marks, issued patents and the steps between them. The ™ and ® symbols, registration stamps and the trademark status track are the signature details. Decoration that could belong to any company is left out.

## Color (roles, not a palette)

| Token | Hex | Role |
| --- | --- | --- |
| `--navy` | `#0b1f33` | Text, header, footer, dark fields. Institutional, not black. |
| `--blue` | `#26abe3` | The logo's blue. Used as a **full field** (hero, closing band), never as a timid accent. Text on it is navy. |
| `--blue-ink` | `#0b5f8f` | Links and small blue text on white (passes WCAG AA). |
| `--white` | `#ffffff` | Default page. Not cream. |
| `--stone` | `#eef1f4` | Secondary field. |
| `--amber` | `#f2a33a` | Function only: "Urgent" in the IP Scan. |

## Type

- **Archivo**, cut to 112% width (`assets/fonts/archivo-display.woff2`), weights 600–800, for headings. Tight leading, sentence case.
- **Public Sans** for everything else. It's the U.S. government's open-source typeface, a quiet nod to federal filings.
- No monospace, no tracked all-caps labels, no serif.

## Rules

- **No eyebrow labels** above headings. A heading should stand on its own.
- **No decorative numbering** (01 / 02 / 03). Numbers appear only when they mean something (a statute, a deadline, a count).
- **No "A · B · C" meta strings.** Write a sentence instead.
- **No arrows on buttons.** Buttons say exactly what happens.
- **No icons in rounded squares, glass blur, glows, gradients or fade-in-on-scroll.**
- **Shape:** buttons and panels use a 6px radius. Stamps are rotated a few degrees, like real rubber stamps.
- **Structure comes from color fields and spacing**, not from hairline rules everywhere.
- **Proof goes in sentences**, not a stat strip.

Test every new element by asking: "Would I make this exact choice for any other website?" If yes, it's a default. Change it until the answer is no.
