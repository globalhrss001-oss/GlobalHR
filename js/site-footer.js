(function () {
  var footerEl = document.getElementById("siteFooter");
  if (!footerEl) return;

  var prefix = footerEl.getAttribute("data-footer-prefix") || "";
  var FACEBOOK_URL = "https://www.facebook.com/GlobalHRSS";

  function href(path) {
    return prefix + path;
  }

  function facebookIcon() {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="site-social-link__icon">' +
      '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' +
      "</svg>"
    );
  }

  footerEl.className = "bg-slate-950 text-slate-200";
  footerEl.innerHTML =
    '<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">' +
    '<div class="grid gap-8 md:grid-cols-3">' +
    '<div>' +
    '<a href="' +
    href("index.html") +
    '" class="inline-block" aria-label="Global HR home">' +
    '<img src="' +
    prefix +
    'assets/logo.png" alt="Global HR" class="site-logo-footer bg-white dark:bg-slate-800 p-2 rounded-lg ring-1 ring-slate-200/80 dark:ring-slate-600" width="200" height="64" decoding="async" />' +
    "</a>" +
    '<p class="mt-3 text-sm text-slate-400">Recruitment solutions across Asia-Pacific &amp; beyond.</p>' +
    '<div class="mt-4">' +
    '<p class="text-xs font-semibold text-white mb-2">Follow us</p>' +
    '<a href="' +
    FACEBOOK_URL +
    '" class="site-social-link" target="_blank" rel="noopener noreferrer" aria-label="Global HR on Facebook">' +
    facebookIcon() +
    "<span>Facebook</span></a></div></div>" +
    '<div><h3 class="text-sm font-semibold text-white mb-2">Quick Links</h3>' +
    '<ul class="space-y-2 text-sm text-slate-400">' +
    '<li><a href="' +
    href("about.html") +
    '" class="hover:text-white transition-colors">About Us</a></li>' +
    '<li><a href="' +
    href("services.html") +
    '" class="hover:text-white transition-colors">Services</a></li>' +
    '<li><a href="' +
    href("training.html") +
    '" class="hover:text-white transition-colors">Training &amp; Cert.</a></li>' +
    '<li><a href="' +
    href("jobs.html") +
    '" class="hover:text-white transition-colors">Jobs</a></li>' +
    '<li><a href="' +
    href("contact.html") +
    '" class="hover:text-white transition-colors">Contact</a></li>' +
    '<li><a href="' +
    href("admin/index.html") +
    '" class="hover:text-white transition-colors">Staff login</a></li></ul></div>' +
    '<div><h3 class="text-sm font-semibold text-white mb-2">Contact</h3>' +
    '<ul class="space-y-2 text-sm text-slate-400">' +
    "<li>Myanmar: +95 1 356 0017 · +95 1 356 0018</li>" +
    "<li>Singapore: +65 6338 3266 · +65 6338 4566 · Mobile +65 9062 2272</li>" +
    '<li><a href="mailto:jc@globalhrss.com" class="hover:text-white underline-offset-2 hover:underline">jc@globalhrss.com</a></li>' +
    '<li><a href="' +
    FACEBOOK_URL +
    '" class="hover:text-white underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">Facebook · @GlobalHRSS</a></li></ul></div></div>' +
    '<div class="mt-8 border-t border-slate-800 pt-4 space-y-1 text-xs text-slate-500">' +
    '<p>Singapore EA Licence No. 01C5543 · Established 2001 · <a href="' +
    href("about.html#licences") +
    '" class="text-slate-400 hover:text-white underline-offset-2 hover:underline">Licences</a></p>' +
    "<p>© 2026 Global HR. All rights reserved.</p></div></div>";
})();
