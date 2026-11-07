# Global HR — User Guide

For staff who update the website content (news, jobs, leads, contact).  
No coding required for day-to-day tasks.

Live site: **https://www.globalhrss.com**  
Staff login: **https://www.globalhrss.com/admin/**

Companion doc for developers: [TECHNICAL.md](TECHNICAL.md).

---

## 1. Site map (what visitors see)

| Page | What it is |
|------|------------|
| **Home** | Company intro, countries, industries, process, latest updates, client logos |
| **About** | Story, vision & mission, history, licences, leadership, offices |
| **Training / Certification** | Testing & training pathways (scaffolding, mechanical, electrical, etc.) |
| **Highlights** | Partnerships & activities (TWI, Rotary, CVT, arrival, photo gallery) |
| **Updates** (`news.html`) | News, activities, and **job openings** |
| **Contact** | Enquiry form + WhatsApp office links |
| **Job alerts** (`subscribe.html`) | Visitors leave email/phone for openings |
| **Japan / TITP** | Japan recruitment pages (linked where needed; not in main menu) |

Old URLs such as Jobs / Markets / Services redirect into Updates or Home sections automatically.

---

## 2. Languages and appearance

Visitors can switch language in the header:

- **English**, **Japanese**, **Korean**, **Russian**

They can also toggle **Light / Dark** theme.  
These preferences are saved in their browser only — they do not change the site for everyone.

---

## 3. Publishing Updates (News)

Updates appear on:

- Home → **Latest updates** panel  
- Highlights page → latest updates section  
- Full list: **Updates** (`/news.html`)

### Where to edit

Open the Google Sheet **Global HR - Jobs CMS** (client Google account) → tab **News**.

### Columns (what to fill)

| Column | What to enter |
|--------|----------------|
| `id` | Unique ID, e.g. `news-jurong-arrival-2026` (no spaces) |
| `title` | Headline |
| `summary` | Short teaser for cards / home panel |
| `body` | Full article text |
| `image` | One cover image path (see below) |
| `media` | Extra photos/videos for the detail page (optional) |
| `category` | Free text, e.g. `Arrival`, `Training`, `Exhibition`, `Job opening` |
| `published_at` | Date as `YYYY-MM-DD` (e.g. `2026-07-12`) |
| `status` | `active` = visible · `hidden` = draft / removed |

Newest `published_at` dates show first.

### Photos and videos

1. Ask a developer (or someone with repo access) to put files in:

   `assets/media/news/{your-news-id}/`

   Example: `assets/media/news/news-jurong-arrival-2026/01.jpg`

2. In the sheet, set paths like:

   - **image:** `assets/media/news/news-jurong-arrival-2026/cover.jpg`
   - **media:** several paths separated by `|` or one path per line

3. Deploy the website so new files go live (developer / Cloudflare).

**Video tips**

- Small files: `.mp4` / `.webm` / `.mov` in the folder above  
- Large videos (over ~25 MB): use a **YouTube** link in `media` instead of uploading the file

Only `assets/…` paths and trusted YouTube/Vimeo links are shown. Other websites’ image URLs will not display.

### Show or hide

- Set `status` to **`active`** to publish  
- Set `status` to **`hidden`** to take offline without deleting  

Changes may take up to **about 10 minutes** to appear (browser cache). Hard-refresh the page (Ctrl+F5) if needed.

### Categories on Updates page

Visitors can filter by category. Use clear, consistent names (e.g. always `Job opening`, not `Jobs`).

---

## 4. Job openings

Job openings are shown as items in **Updates**, with category **`Job opening`**.

You can manage jobs in two ways:

### A. Admin portal (recommended for jobs)

1. Go to **https://www.globalhrss.com/admin/**
2. Sign in with your staff username and password  
3. Open the **Jobs** dashboard  
4. **Add new job**, or edit / hide / delete existing ones  

Fields typically include title, company, location, type, industry, description, apply email, and status (`active` / `hidden`).

Public site updates within a few minutes (same cache as news).

Footer link: **Staff login**.

### B. News sheet (optional)

You can also add a News row with `category` = `Job opening` if marketing wants a richer story + gallery. Coordinate with whoever manages the Jobs tab so listings stay consistent.

### Passwords

- Passwords are set by a developer via Apps Script — **never type a real password into the Google Sheet**  
- Maximum **3** admin accounts  
- To disable someone without deleting: set `active` to `FALSE` on the **Admins** tab  

If you forget a password, ask the technical contact to reset it with `setupAdminPassword`.

---

## 5. Job alert leads (Subscribe)

When visitors submit **Job alerts** (`/subscribe.html`), a row is added to the sheet tab **Leads**.

| Column | Meaning |
|--------|---------|
| `name`, `email`, `phone` | Contact details |
| `source` / `campaign` | Where they came from (website / UTM) |
| `consent` | They agreed to be contacted |
| `created_at` | When they signed up |
| `status` | You can set manually: e.g. `contacted`, `closed` |

**Workflow suggestion**

1. Check **Leads** regularly  
2. Contact the person  
3. Update `status` so the team knows it was handled  

Do not share the spreadsheet outside the authorized staff Google account.

---

## 6. Contact enquiries

The **Contact** page sends messages through **Formspree** (email inbox configured for Global HR).

Special links:

| Link | What happens |
|------|----------------|
| `contact.html?reason=licence` | Prefills a **licence verification** request (used instead of direct PDF download) |
| `contact.html?reason=training` | Prefills / routes toward **training booking** interest |

Licence PDFs are **not** publicly downloadable. Always handle licence requests via the contact form.

WhatsApp buttons on Contact open the chosen office chat.

---

## 7. What you can change without a developer

| Task | How |
|------|-----|
| Publish / hide a news story | **News** tab → `status` |
| Edit news title, summary, body, date, category | **News** tab |
| Add / edit / hide jobs | **/admin/** dashboard |
| Follow up job-alert signups | **Leads** tab |
| Reply to contact forms | Formspree / email inbox |

---

## 8. What needs a developer

| Task | Why |
|------|-----|
| Upload new photos/videos into `assets/…` and deploy | Files must be in the website project + Cloudflare |
| Change Home, About, Highlights, Training page text or layout | Content is in HTML |
| Add client logos to the homepage marquee | Code + image files |
| Change navigation / footer links | JavaScript layout files |
| Add a new language string or fix a translation | `i18n` files |
| Change Formspree or Google Apps Script setup | Technical config |
| Reset admin passwords / add a 4th admin | Apps Script + Admins tab rules |
| Deploy after media uploads | Cloudflare Workers |

Staging folder `assets/images/new images/` is **not** on the live site. Photos there must be copied into the proper `assets/…` folders and deployed first.

---

## 9. Quick checklists

### Publish a news item

1. [ ] Write title, summary, body in **News**  
2. [ ] Set `id`, `category`, `published_at` (`YYYY-MM-DD`)  
3. [ ] Add cover `image` path (and `media` if needed)  
4. [ ] Confirm media files are deployed on the live site  
5. [ ] Set `status` = `active`  
6. [ ] Check Home panel and `/news.html` (hard-refresh if needed)

### Publish a job

1. [ ] Log in at `/admin/`  
2. [ ] Add job → set status **active**  
3. [ ] Confirm it appears under Updates / Job opening  
4. [ ] When filled, set **hidden** or delete from the dashboard  

### After a job fair / campaign

1. [ ] Export or review new **Leads**  
2. [ ] Mark contacted leads in `status`  
3. [ ] Publish fair photos as a News item if desired  

---

## 10. Troubleshooting

| Problem | What to try |
|---------|-------------|
| New news/job not showing | Wait ~10 minutes; hard-refresh (Ctrl+F5); confirm `status` is `active` |
| Photo missing | Path must start with `assets/…` and the file must already be deployed |
| Video too big / fails | Use YouTube link in `media` instead |
| Cannot log in to admin | Check username; ask tech to reset password; confirm account `active` |
| Contact form not arriving | Check Formspree dashboard / spam; ask tech to verify endpoint |
| Wrong language on your PC | Use the language control in the site header |

---

## 11. Contacts & links

| Resource | URL / note |
|----------|------------|
| Public website | https://www.globalhrss.com |
| Updates | https://www.globalhrss.com/news.html |
| Job alerts signup | https://www.globalhrss.com/subscribe.html |
| Staff admin | https://www.globalhrss.com/admin/ |
| Facebook | https://www.facebook.com/GlobalHRSS |
| TikTok | https://www.tiktok.com/@global.hr2001 |
| CMS spreadsheet | Google Drive — **Global HR - Jobs CMS** (client account) |
| Developer setup | [scripts/google-sheets/SETUP.md](scripts/google-sheets/SETUP.md) |

Keep admin passwords and the spreadsheet access limited to authorized staff only.
