# Global HR — Website

English marketing site (HTML + Tailwind CDN + vanilla JS) with job listings backed by **Google Sheets** and a staff admin portal at `/admin/`.

## Local preview

Open `index.html` in a browser, or serve the folder with any static file server.

## Configuration

### Jobs CMS (Google Sheets + Apps Script)

1. Follow [`scripts/google-sheets/SETUP.md`](scripts/google-sheets/SETUP.md) on the **client Google account**.
2. Set the deployed Web App `/exec` URL in [`js/cms-config.js`](js/cms-config.js) (`GLOBAL_HR_CMS_API_URL`).

Public pages read jobs via `doGet`. Staff manage jobs at `/admin/` with username + password (up to 3 accounts in the `Admins` sheet tab).

### Contact form

The contact page uses Formspree — configure in `js/contact.js` if needed.

## Deploy

**Production:** https://www.globalhrss.com — **Cloudflare Workers** (Git connected).

Cloudflare build settings:

| Setting | Value |
|---------|--------|
| Build command | *(leave empty)* |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Repo includes [`wrangler.toml`](wrangler.toml) pointing static assets at the project root. Large files are excluded via [`.assetsignore`](.assetsignore) (Cloudflare limit **25 MiB per file**). For news videos over 25 MiB, use a YouTube link in the sheet `media` column instead of uploading the `.mp4`.

**GitHub Pages (legacy):** https://antthein.github.io/global-hr-website/

Cache busting: bump `?v=` on `css/style.css` and `js/*.js` when you change those files. Do not put `?v=` on HTML page links.
