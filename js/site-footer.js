(function () {
  var footerEl = document.getElementById("siteFooter");
  if (!footerEl) return;

  var prefix = footerEl.getAttribute("data-footer-prefix") || "";
  var FACEBOOK_URL = "https://www.facebook.com/GlobalHRSS";
  var TIKTOK_URL = "https://www.tiktok.com/@global.hr2001";

  function t(key, fallback) {
    return window.GlobalHrI18n ? window.GlobalHrI18n.t(key, fallback) : fallback || key;
  }

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

  function tiktokIcon() {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="site-social-link__icon">' +
      '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>' +
      "</svg>"
    );
  }

  function socialFollowLink(url, iconHtml, label, ariaLabel) {
    return (
      '<a href="' +
      url +
      '" class="site-social-link" target="_blank" rel="noopener noreferrer" aria-label="' +
      ariaLabel +
      '">' +
      iconHtml +
      "<span>" +
      label +
      "</span></a>"
    );
  }

  function render() {
    footerEl.className = "bg-slate-950 text-slate-200";
    footerEl.innerHTML =
      '<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">' +
      '<div class="grid gap-8 md:grid-cols-3">' +
      "<div>" +
      '<a href="' +
      href("index.html") +
      '" class="inline-block" aria-label="' +
      t("nav.homeAria") +
      '">' +
      '<img src="' +
      prefix +
      'assets/logo.png" alt="Global HR" class="site-logo-footer bg-white dark:bg-slate-800 p-2 rounded-lg ring-1 ring-slate-200/80 dark:ring-slate-600" width="200" height="64" decoding="async" />' +
      "</a>" +
      '<p class="mt-3 text-sm text-slate-400">' +
      t("footer.tagline") +
      "</p>" +
      '<div class="mt-4">' +
      '<p class="text-xs font-semibold text-white mb-2">' +
      t("footer.follow") +
      "</p>" +
      '<div class="site-social-links">' +
      socialFollowLink(FACEBOOK_URL, facebookIcon(), t("footer.facebook"), t("footer.facebookAria")) +
      socialFollowLink(TIKTOK_URL, tiktokIcon(), t("footer.tiktok"), t("footer.tiktokAria")) +
      "</div></div></div>" +
      '<div><h3 class="text-sm font-semibold text-white mb-2">' +
      t("footer.quickLinks") +
      "</h3>" +
      '<ul class="space-y-2 text-sm text-slate-400">' +
      '<li><a href="' +
      href("about.html") +
      '" class="hover:text-white transition-colors">' +
      t("nav.about") +
      "</a></li>" +
      '<li><a href="' +
      href("services.html") +
      '" class="hover:text-white transition-colors">' +
      t("nav.marketsIndustries") +
      "</a></li>" +
      '<li><a href="' +
      href("training.html") +
      '" class="hover:text-white transition-colors">' +
      t("nav.training") +
      "</a></li>" +
      '<li><a href="' +
      href("news.html") +
      '" class="hover:text-white transition-colors">' +
      t("nav.updates") +
      "</a></li>" +
      '<li><a href="' +
      href("subscribe.html") +
      '" class="hover:text-white transition-colors">' +
      t("footer.jobAlerts") +
      "</a></li>" +
      '<li><a href="' +
      href("contact.html") +
      '" class="hover:text-white transition-colors">' +
      t("nav.contact") +
      "</a></li>" +
      '<li><a href="' +
      href("admin/index.html") +
      '" class="hover:text-white transition-colors">' +
      t("footer.staffLogin") +
      "</a></li></ul></div>" +
      '<div><h3 class="text-sm font-semibold text-white mb-2">' +
      t("footer.contact") +
      "</h3>" +
      '<ul class="space-y-2 text-sm text-slate-400">' +
      "<li>" +
      t("footer.myanmar") +
      "</li>" +
      "<li>" +
      t("footer.singapore") +
      "</li>" +
      '<li><a href="mailto:jc@globalhrss.com" class="hover:text-white underline-offset-2 hover:underline">jc@globalhrss.com</a></li>' +
      '<li><a href="' +
      FACEBOOK_URL +
      '" class="hover:text-white underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">Facebook · @GlobalHRSS</a></li>' +
      '<li><a href="' +
      TIKTOK_URL +
      '" class="hover:text-white underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">TikTok · @global.hr2001</a></li></ul></div></div>' +
      '<div class="mt-8 border-t border-slate-800 pt-4 space-y-1 text-xs text-slate-500">' +
      "<p>" +
      t("footer.licenceLine") +
      '<a href="' +
      href("about.html#licences") +
      '" class="text-slate-400 hover:text-white underline-offset-2 hover:underline">' +
      t("footer.licencesLink") +
      "</a></p>" +
      "<p>" +
      t("footer.copyright") +
      "</p></div></div>";
  }

  render();

  if (window.GlobalHrI18n) {
    window.GlobalHrI18n.onChange(render);
  }
})();
