# Global HR — Website

English marketing site (HTML + Tailwind CDN + vanilla JS) with Supabase-backed job listings.

## Local preview

Open `index.html` in a browser, or serve the folder with any static file server.

## Configuration

Copy `js/supabase.js` and set your Supabase project URL and **anon** key. Never commit the **service role** key or use it in frontend code.

## Deploy

**Production:** https://www.globalhrss.com — use **Cloudflare Pages** (connect this repo; no build step; output directory `/`). Do not route the domain through a bare **Worker** that serves only `index.html`, or every path will show the home page.

**GitHub Pages (legacy):** https://antthein.github.io/global-hr-website/

After deploy, add your live URL to Supabase **Authentication → URL Configuration** (Site URL and redirect URLs for `/admin/`).

Cache busting: bump `?v=` on `css/style.css` and `js/*.js` when you change those files. Do not put `?v=` on HTML page links.
