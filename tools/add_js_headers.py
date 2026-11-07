"""One-shot helper: prepend module headers to JS files that lack them."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "js"

HEADERS = {
    "admin-api.js": """/**
 * Admin API client — session storage + POST/GET against Google Apps Script.
 * Exposes window.globalHrAdminApi for admin login and dashboard pages.
 * Depends on js/cms-config.js (GLOBAL_HR_CMS_API_URL).
 */""",
    "admin.js": """/**
 * Admin UI — login form and jobs dashboard CRUD.
 * Uses window.globalHrAdminApi from admin-api.js.
 */""",
    "clients-page.js": """/**
 * Renders employer logo cards / marquees on the homepage (#homeClientsGrid).
 * Data comes from window.GLOBAL_HR_CLIENTS (clients-data.js).
 */""",
    "contact.js": """/**
 * Contact page — Formspree submit, honeypot spam check, reason prefills.
 * Supports ?reason=licence (and training) query prefills.
 */""",
    "highlights-news.js": """/**
 * Highlights page (training.html) — latest updates grid from Sheets news feed.
 * Depends on sheets-news.js + news-ui.js.
 */""",
    "home-news-panel.js": """/**
 * Homepage latest-updates panel (#heroNewsPanel).
 * Depends on sheets-news.js + news-ui.js.
 */""",
    "industries.js": """/**
 * Industry / market / TITP accordion cards — open/close and deep-link by hash.
 */""",
    "job-alert-popup.js": """/**
 * Delayed job-alert subscribe popup (skipped on admin + subscribe pages).
 * Remembers dismiss (14 days) and successful subscribe in localStorage.
 */""",
    "main.js": """/**
 * Site-wide UI: theme toggle, hero slideshow, marquees, scroll reveal,
 * stats count-up, back-to-top, active nav, lazy-load job-alert popup.
 */""",
    "news-page.js": """/**
 * news.html — list/detail views, category filters, hash/query routing.
 * Depends on sheets-news.js + news-ui.js.
 */""",
    "news-ui.js": """/**
 * Shared HTML helpers for news cards, detail blocks, and home/highlights panels.
 * Exposes window.globalHrNewsUi.
 */""",
    "photo-lightbox.js": """/**
 * Full-screen photo lightbox for galleries and zoomable news images.
 */""",
    "sheets-news.js": """/**
 * News/jobs feed from Google Apps Script + sessionStorage cache (10 min TTL).
 * Includes local job-opening fallbacks and media path allowlisting.
 * Exposes window.globalHrSheetsNews. Depends on cms-config.js.
 */""",
    "site-footer.js": """/**
 * Injects the shared site footer into #siteFooter.
 * Use data-footer-prefix="../" on nested pages (e.g. admin/).
 */""",
    "site-nav.js": """/**
 * Injects the shared mega-nav header into #siteHeader.
 * Includes theme + language controls. Use data-nav-prefix="../" when nested.
 */""",
    "subscribe.js": """/**
 * Job-alert subscribe form — POSTs leads to Apps Script (action: lead).
 * Honeypot + client validation. Depends on cms-config.js.
 */""",
    "training-programs.js": """/**
 * Training program accordions + redirects for old program hash URLs
 * that moved to home or testing-certification.html.
 */""",
}


def main() -> None:
    for name, header in HEADERS.items():
        path = ROOT / name
        text = path.read_text(encoding="utf-8")
        if text.lstrip().startswith("/**"):
            print(f"skip (has header): {name}")
            continue
        path.write_text(header + "\n" + text, encoding="utf-8")
        print(f"header added: {name}")


if __name__ == "__main__":
    main()
