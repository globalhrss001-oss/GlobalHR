# Global HR — Technical Guide

For developers maintaining **https://www.globalhrss.com**.

Companion doc: [USER-GUIDE.md](USER-GUIDE.md) (staff / content editors).

---

## 1. Stack overview

| Layer | Choice |
|--------|--------|
| Frontend | Static HTML + Tailwind CDN + vanilla JS (no bundler, no `package.json`) |
| Styles | `css/style.css` + per-page Tailwind config in `<head>` |
| Hosting | Cloudflare Workers static assets (`wrangler.toml`) |
| CMS | Google Sheets + Apps Script Web App |
| Contact | Formspree (`js/contact.js`) |
| Languages | EN / JA / KO / RU (`js/i18n.js`, `js/i18n-ko-ru.js`) |
| Theme | Light / dark (`localStorage` key `globalhr_theme`) |

Production: **https://www.globalhrss.com**  
Legacy GitHub Pages: `https://antthein.github.io/global-hr-website/`

---

## 2. Repository layout

```
Global_HR/
├── index.html, about.html, training.html, …
├── admin/                 # Staff login + job CMS UI
├── css/style.css          # All custom CSS
├── js/                    # Page and shared modules
├── assets/
│   ├── logo.png, favicons
│   ├── documents/         # Licence PDFs (blocked by _redirects)
│   ├── images/            # Curated photos, clients, training
│   │   └── new images/    # Staging only — NOT deployed
│   └── media/news/{id}/   # News / job media for Sheets paths
├── scripts/google-sheets/ # Apps Script + sheet templates (not deployed)
├── samples/               # Design experiments (not deployed)
├── wrangler.toml
├── _redirects
├── .assetsignore
├── README.md
├── TECHNICAL.md           # This file
└── USER-GUIDE.md
```

### Deploy exclusions (`.assetsignore`)

Cloudflare **25 MiB per file** limit. Ignored from upload:

- `.git/`, `samples/`, `scripts/`, `README.md`
- `assets/images/new images/` (large dumps / staging)

Put production media under `assets/images/photos/`, `assets/images/clients/`, `assets/media/news/…`, etc.

---

## 3. Pages and routing

### Public pages

| File | Role |
|------|------|
| `index.html` | Home: hero, countries, industries, process, news panel, clients |
| `about.html` | Story, vision/mission, values, history, licences, leadership, offices |
| `testing-certification.html` | Training / testing pathways + gallery |
| `training.html` | Highlights (TWI, Rotary, CVT, SMF, arrival, gallery, updates) |
| `news.html` | Updates list/detail; job openings appear as feed items |
| `contact.html` | Formspree + WhatsApp; `?reason=licence` / `training` prefills |
| `subscribe.html` | Job-alert leads → Sheets **Leads** tab |
| `japan.html` | Japan recruitment pathways |
| `japan-titp.html` | TITP occupation categories |

### Redirects / stubs

| File / rule | Behavior |
|-------------|----------|
| `jobs.html` | → `news.html` (jobs live in Updates) |
| `markets.html` | → `index.html#home-countries` |
| `services.html` | → `index.html#home-industries` |
| `_redirects` | `/assets/documents/*` → `contact.html?reason=licence` (302) |

Japan / TITP are **not** in the primary mega-nav; reach by URL or cross-links.

### Admin

| Path | Role |
|------|------|
| `/admin/` (`admin/index.html`) | Staff login |
| `/admin/dashboard.html` | Job CRUD UI |

`meta robots: noindex, nofollow` on admin pages.

---

## 4. Shared layout

### Header / footer injection

Every public page should include:

```html
<header id="siteHeader"></header>
<script src="js/site-nav.js?v=…"></script>
…
<footer id="siteFooter"></footer>
<script src="js/site-footer.js?v=…"></script>
```

For nested paths (`admin/`), set:

- `data-nav-prefix="../"` on `#siteHeader`
- `data-footer-prefix="../"` on `#siteFooter`

**Nav items** (from `js/site-nav.js`): Home · About · Training/Certification · Highlights · Contact  
Theme toggle + language control live in the nav.

**Footer** (`js/site-footer.js`): logo, tagline, Facebook/TikTok, quick links (incl. Updates, Job alerts, Staff login), Myanmar/Singapore contacts, EA licence line.

---

## 5. JavaScript modules

| File | Role |
|------|------|
| `cms-config.js` | `window.GLOBAL_HR_CMS_API_URL` — Apps Script `/exec` URL |
| `sheets-news.js` | Fetch/cache news feed; media allowlist; local job fallbacks |
| `news-ui.js` | Shared card/detail HTML helpers |
| `news-page.js` | `news.html` list, detail, category filters |
| `home-news-panel.js` | Home “Latest updates” panel |
| `highlights-news.js` | Updates grid on `training.html` |
| `admin-api.js` | Session + POST actions to Apps Script |
| `admin.js` | Login + dashboard job table/modal |
| `contact.js` | Formspree submit, honeypot, reason prefills |
| `subscribe.js` | Lead signup → CMS `action: "lead"` |
| `clients-data.js` / `clients-page.js` | Homepage client logo marquee |
| `site-nav.js` / `site-footer.js` | Layout shells |
| `i18n.js` / `i18n-ko-ru.js` | Translations |
| `main.js` | Theme, hero slideshow, marquees, scroll reveal, stats, back-to-top, job-alert popup lazy-load |
| `job-alert-popup.js` | Delayed subscribe prompt |
| `training-programs.js` | Accordions + hash redirects for moved panels |
| `industries.js` | Industry / TITP accordion UX |
| `photo-lightbox.js` | Gallery lightbox |

### News cache

- Key: `sessionStorage` → `globalhr_news_v12`
- TTL: **10 minutes**
- After publishing news/jobs, hard-refresh or wait ~10 min; bump cache key in `sheets-news.js` if you need a forced invalidation for all visitors.

### Media allowlist (`sheets-news.js`)

Only these render from the feed:

- Paths under `assets/…`
- Trusted YouTube / Vimeo URLs

Do not put arbitrary external image hosts in the sheet.

---

## 6. Brand / CSS

Inline Tailwind brand tokens (each page `<head>`):

| Token | Hex |
|-------|-----|
| `brandBlue` | `#1a56db` |
| `brandNavy` | `#1e3a8a` |
| `brandPurple` | `#4338ca` |
| `brandDark` | `#0f172a` |
| `brandLight` | `#f8fafc` |

Custom CSS lives in **`css/style.css`** only (BEM-ish classes: `site-nav__*`, `home-hero__*`, `hero-news-panel__*`, etc.).

Design preference: **square photo corners** (avoid heavy rounding on photos).

Fonts: Inter + Noto Sans JP / KR (Google Fonts).

---

## 7. Internationalization

| Key | Storage |
|-----|---------|
| Language | `localStorage` → `globalhr_lang` (`en` \| `ja` \| `ko` \| `ru`) |
| Theme | `localStorage` → `globalhr_theme` (`light` \| `dark`) |

Usage in HTML:

- `data-i18n="key"` — text content
- `data-i18n-html="key"` — HTML content
- Page meta: `data-page-title` / `data-page-desc` on `<html>`

Add strings in `js/i18n.js` (EN + JA). KO/RU overlays in `js/i18n-ko-ru.js`.

**Copy rule:** recruitment intro only — avoid “dispatch / outsourcing” wording.

---

## 8. CMS (Google Sheets + Apps Script)

Full setup: [`scripts/google-sheets/SETUP.md`](scripts/google-sheets/SETUP.md).

### Spreadsheet tabs

| Tab | Purpose |
|-----|---------|
| **Jobs** | Job listings managed from `/admin/` |
| **Admins** | Up to 3 staff (`username`, `password_hash`, `active`) |
| **Leads** | Subscribe / job-alert signups |
| **News** | Homepage panel, Highlights, `/news.html` |

### Wire-up

1. Deploy Apps Script as Web App (Execute as: Me; Access: Anyone).
2. Paste `/exec` URL into `js/cms-config.js` → `GLOBAL_HR_CMS_API_URL`.
3. After script edits: **Manage deployments → Edit → New version → Deploy**.

### Public API (no login)

```
GET {WEB_APP_URL}?feed=news&status=active
```

Lead POST body shape (see SETUP.md):

```json
{
  "action": "lead",
  "email": "…",
  "phone": "…",
  "source": "website",
  "campaign": "…",
  "consent": "yes"
}
```

### News columns

`id | title | summary | body | image | media | category | published_at | status`

- `status`: `active` | `hidden`
- `published_at`: `YYYY-MM-DD` (newest first)
- `image`: one cover path
- `media`: paths or YouTube URLs, one per line or `|`-separated
- Local files: `assets/media/news/{id}/…` then commit + deploy (keep each file under 25 MiB; prefer YouTube for large video)

Job openings commonly use category **`Job opening`**.

### Admin passwords

Never store plain passwords in the sheet or Git. Use Apps Script `setupAdminPassword("user", "password")`.

---

## 9. Contact form (Formspree)

Configured in `js/contact.js`:

```
FORMSPREE_ENDPOINT = https://formspree.io/f/xlgkbdpq
```

- Honeypot field `#cHp` / `_gotcha` — bots rejected client-side
- Query `?reason=licence` prefills licence request subject/message
- Training booking links use `contact.html?reason=training`

Change the endpoint only in Formspree dashboard + this file.

---

## 10. Deploy (Cloudflare)

`wrangler.toml`:

```toml
name = "global-hr"
[assets]
directory = "."
```

Cloudflare build settings:

| Setting | Value |
|---------|--------|
| Build command | *(empty)* |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

### Cache busting

When you change CSS or JS, bump the query string on those assets only:

```html
<link rel="stylesheet" href="css/style.css?v=YYYYMMDDx" />
<script src="js/main.js?v=YYYYMMDDx"></script>
```

Do **not** put `?v=` on HTML page links (`about.html`, etc.).

### Large media

- Prefer YouTube in the News `media` column for videos over ~25 MiB
- Do not rely on `assets/images/new images/` in production (excluded)

---

## 11. Security checklist

Already in code / redirects:

- Single CMS URL from `cms-config.js` (no stale fallback URLs)
- Contact + subscribe honeypots; Apps Script rate limits on leads
- News media allowlist
- Licence PDFs not directly downloadable (`_redirects`)

Recommended Cloudflare **Transform Rules → Modify response header**:

| Header | Value |
|--------|--------|
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-Frame-Options` | `SAMEORIGIN` |

Optional CSP: see [README.md](README.md) — must allow Tailwind CDN, Google Fonts, Formspree, `script.google.com`, YouTube/Vimeo.

---

## 12. Local development

1. Open `index.html` in a browser, **or** serve the folder with any static server.
2. CMS calls need the live Apps Script URL in `cms-config.js` (CORS handled by Google).
3. Admin: open `/admin/` against the same CMS URL.

No install / build step.

---

## 13. Common developer tasks

### Add a new public page

1. Copy an existing page shell (head tokens, i18n scripts, `#siteHeader` / `#siteFooter`).
2. Add nav link in `js/site-nav.js` and/or footer in `js/site-footer.js`.
3. Add `data-i18n` keys + strings in `i18n.js` / `i18n-ko-ru.js`.
4. Bump `?v=` on changed JS/CSS.

### Add homepage clients

Edit `js/clients-data.js` and place logos under `assets/images/clients/`.

### Change hero slides

Edit the `data-hero-slideshow` slide markup in `index.html`; keep images optimized and under deploy limits.

### Apps Script change

Edit `scripts/google-sheets/AppsScript-JobsApi.gs` in the Google project → new deployment version → test `/admin/` and news feed.

### Seed / clean demo jobs

See SETUP.md: `node scripts/google-sheets/seed-live-jobs.mjs` (optional env `GLOBALHR_ADMIN_USER` / `GLOBALHR_ADMIN_PASS`).

---

## 14. Related docs

| Doc | Audience |
|-----|----------|
| [README.md](README.md) | Quick start, deploy, security headers |
| [USER-GUIDE.md](USER-GUIDE.md) | Staff: news, jobs, leads, contact |
| [scripts/google-sheets/SETUP.md](scripts/google-sheets/SETUP.md) | Sheets + Apps Script install |
