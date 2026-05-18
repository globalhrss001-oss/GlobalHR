# Global HR — Website

English marketing site (HTML + Tailwind CDN + vanilla JS) with Supabase-backed job listings.

## Local preview

Open `index.html` in a browser, or serve the folder with any static file server.

## Configuration

Copy `js/supabase.js` and set your Supabase project URL and **anon** key. Never commit the **service role** key or use it in frontend code.

## Deploy

**GitHub Pages (live):** https://antthein.github.io/global-hr-website/

Site is served from the `main` branch root. After deploy, add this URL to Supabase allowed origins if needed.

You can also upload the project folder to another static host (e.g. cPanel). Ensure `assets/logo.png` and `js/supabase.js` are present on the server.
