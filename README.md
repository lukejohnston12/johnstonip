# johnstonip.com

The new Johnston IP Law website: a fast, accessible static site built with Jekyll and hosted on GitHub Pages. It replaces the old WordPress site, so there is no PHP, database or plugin to patch.

## Publish the preview

1. In GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick this branch and the `/ (root)` folder, then click **Save**.
3. After a minute or two the preview is live at `https://lukejohnston12.github.io/johnstonip/`.

GitHub builds Jekyll sites automatically. There is no build pipeline to maintain.

## Design rules

The visual system is written down in `DESIGN.md`. Read it before adding pages or components.

## Edit content

Most content lives in plain data files, so you rarely need to touch HTML:

| What | Where |
| --- | --- |
| Phone, address, social links, booking link | `_data/firm.yml` |
| FAQs (homepage and FAQ page) | `_data/faqs.yml` |
| Industries | `_data/industries.yml` |
| Team | `_data/team.yml` |
| IP Scan questions and recommendations | `assets/js/scan.js` (the `STEPS` list and `recommend()` function) |
| Photos and video | `_data/images.yml` |
| Main menu | `_data/nav.yml` |
| Page copy | `index.html`, `trademarks.html`, `patents.html`, `other-ip.html`, `industries.html`, `about.html`, `faqs.html`, `contact.html` |
| Design (colors, type, layout) | `_includes/site.css` (inlined into each page) |

## Before launch

- [ ] **Images:** add the founder portrait and welcome video in `_data/images.yml`. Each spot shows a branded placeholder until it's filled in.
- [ ] **Contact form:** set `contact_form_action` in `_config.yml` to a form service endpoint (for example Formspree). Until then, the form asks visitors to call.
- [ ] **Booking:** optionally set `booking_url` in `_data/firm.yml` (Calendly, etc.). Every "free discovery session" button then links straight to it.
- [ ] **Email:** add the public email address in `_data/firm.yml`.
- [ ] **Facts:** confirm the credentials and stats against the firm's records (education, admissions, awards, "30+ years", review ratings).
- [ ] **Media page:** the old site has blog posts and webinars that aren't migrated yet. Set up redirects for any old URLs that have backlinks.
- [ ] **Go live:** in `_config.yml`, set `baseurl: ""` and `preview: false`. Add a `CNAME` file containing `www.johnstonip.com`, then point DNS at GitHub Pages.

## The IP Scan

The homepage's IP Scan asks up to five questions, skipping the ones that don't apply, and builds a prioritized brief (Urgent / Now / Next / Later). The **Review this brief** button carries the answers to the contact page, where the brief appears above the form. It also checks the matching topics and fills a hidden `ip_scan` field, so the brief arrives with the submission once the form is connected. The scan fires an `ipscan:complete` browser event, which analytics can listen for later.

The recommendation text is general information and is worded cautiously. Have an attorney review `assets/js/scan.js` before launch.

## Run locally

```bash
gem install jekyll
jekyll serve
```

Then open http://127.0.0.1:4000/johnstonip/.

To regenerate the social share image and icons after a brand change, run `node tools/make-images.mjs` (requires Playwright).

## Quality bar

Every page scored 99–100 for Performance, Accessibility and Best Practices in Lighthouse (mobile), with CLS 0 and LCP under 2.1s on a simulated mobile network. SEO scores 100 once `preview` is off; preview mode deliberately blocks search indexing so the preview doesn't compete with the live site.

How the pages stay fast:
- No frameworks. A few KB of JavaScript for the menu, contact form and IP Scan; every page still works without it.
- CSS is inlined, so nothing blocks rendering.
- Self-hosted variable fonts, preloaded, with size-matched fallbacks so text doesn't jump when fonts load.
- Semantic HTML, skip link, visible focus states, reduced-motion support, and WCAG AA contrast (checked with axe).
- Structured data for the firm, founder, breadcrumbs and FAQs, plus a sitemap, canonical URLs and Open Graph tags.

Fonts: Archivo (headlines, trimmed to a 112% width cut) and Public Sans (body), both under the SIL Open Font License.
