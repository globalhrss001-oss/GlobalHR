(function () {
  var headerEl = document.getElementById("siteHeader");
  if (!headerEl) return;

  var prefix = headerEl.getAttribute("data-nav-prefix") || "";

  function href(path) {
    return prefix + path;
  }

  var NAV_ITEMS = [
    { label: "Home", href: href("index.html") },
    {
      id: "about",
      label: "About Us",
      href: href("about.html"),
      mega: [
        {
          title: "About Global HR",
          links: [
            { label: "Who we are", href: href("about.html#our-story") },
            { label: "Our history", href: href("about.html#history") },
            { label: "Success stories", href: href("about.html#success-stories") },
            { label: "Licences & credentials", href: href("about.html#licences") },
            { label: "Our values", href: href("about.html#values") },
            { label: "Updates", href: href("news.html") },
          ],
        },
        {
          title: "People & places",
          links: [
            { label: "Our offices", href: href("about.html#offices") },
            { label: "Leadership team", href: href("about.html#leadership") },
            { label: "Contact us", href: href("contact.html") },
          ],
        },
      ],
    },
    {
      id: "services",
      label: "Services",
      href: href("services.html"),
      mega: [
        {
          title: "Who we help",
          links: [
            { label: "For job seekers", href: href("services.html#job-seekers") },
            { label: "For employers", href: href("services.html#employers") },
            { label: "Industries we serve", href: href("services.html#industries") },
            { label: "Arrival service", href: href("services.html#arrival-service") },
          ],
        },
        {
          title: "Get started",
          links: [
            { label: "How it works", href: href("services.html#process") },
            { label: "Training & certification", href: href("training.html") },
            { label: "View updates", href: href("news.html") },
          ],
        },
      ],
    },
    {
      id: "training",
      label: "Training & Cert.",
      href: href("training.html"),
      mega: [
        {
          title: "Programs",
          links: [
            { label: "Overview", href: href("training.html#overview") },
            { label: "Training programs", href: href("training.html#programs") },
            { label: "Scaffolding training", href: href("training.html#programs") },
            { label: "Interview briefings", href: href("training.html#programs") },
          ],
        },
        {
          title: "Gallery & enquiries",
          links: [
            { label: "Photo gallery", href: href("training.html#gallery") },
            { label: "Book training", href: href("contact.html?reason=training") },
            { label: "View all programs", href: href("training.html#programs") },
          ],
        },
      ],
    },
    {
      id: "updates",
      label: "Updates",
      href: href("news.html"),
      mega: [
        {
          title: "Browse updates",
          links: [
            { label: "All updates", href: href("news.html") },
            { label: "Job openings", href: href("news.html?category=Job opening") },
            { label: "Exhibitions & events", href: href("news.html?category=Exhibition") },
            { label: "Arrivals & mobilisation", href: href("news.html?category=Arrival") },
          ],
        },
        {
          title: "Stay informed",
          links: [
            { label: "Get job alerts", href: href("subscribe.html") },
            { label: "Contact us", href: href("contact.html") },
          ],
        },
      ],
    },
    { label: "Contact", href: href("contact.html") },
  ];

  function chevronSvg() {
    return (
      '<svg class="site-nav__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">' +
      '<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/>' +
      "</svg>"
    );
  }

  function renderDesktopItem(item) {
    if (!item.mega) {
      return (
        '<li class="site-nav__item">' +
        '<a class="site-nav__link" href="' +
        item.href +
        '">' +
        item.label +
        "</a></li>"
      );
    }
    return (
      '<li class="site-nav__item site-nav__item--mega" data-mega-id="' +
      item.id +
      '">' +
      '<div class="site-nav__mega-row">' +
      '<a class="site-nav__link site-nav__link--mega-label" href="' +
      item.href +
      '">' +
      item.label +
      "</a>" +
      '<button type="button" class="site-nav__mega-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Show ' +
      item.label +
      ' menu">' +
      chevronSvg() +
      "</button></div></li>"
    );
  }

  function renderMegaPanel(item) {
    if (!item.mega) return "";
    var cols = item.mega
      .map(function (col) {
        var links = col.links
          .map(function (link) {
            return (
              '<li><a class="site-mega__link" href="' +
              link.href +
              '">' +
              link.label +
              "</a></li>"
            );
          })
          .join("");
        return (
          '<div class="site-mega__col">' +
          '<p class="site-mega__title">' +
          col.title +
          "</p>" +
          '<ul class="site-mega__list">' +
          links +
          "</ul></div>"
        );
      })
      .join("");
    return (
      '<div class="site-mega__inner" data-mega-panel="' +
      item.id +
      '" hidden>' +
      cols +
      "</div>"
    );
  }

  function renderMobileItem(item) {
    if (!item.mega) {
      return '<a class="site-mobile__link" href="' + item.href + '">' + item.label + "</a>";
    }
    var sub = item.mega
      .map(function (col) {
        var links = col.links
          .map(function (link) {
            return (
              '<a class="site-mobile__sublink" href="' + link.href + '">' + link.label + "</a>"
            );
          })
          .join("");
        return (
          '<div class="site-mobile__group">' +
          '<p class="site-mobile__grouptitle">' +
          col.title +
          "</p>" +
          links +
          "</div>"
        );
      })
      .join("");
    return (
      '<details class="site-mobile__details">' +
      '<summary class="site-mobile__summary">' +
      item.label +
      "</summary>" +
      '<div class="site-mobile__sub">' +
      sub +
      '<a class="site-mobile__sublink site-mobile__sublink--primary" href="' +
      item.href +
      '">View all ' +
      item.label +
      "</a></div></details>"
    );
  }

  var desktopNav = NAV_ITEMS.map(renderDesktopItem).join("");
  var megaPanels = NAV_ITEMS.filter(function (i) {
    return i.mega;
  })
    .map(renderMegaPanel)
    .join("");
  var mobileNav = NAV_ITEMS.map(renderMobileItem).join("");

  headerEl.className =
    "site-header relative sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-700 text-brandDark dark:text-slate-200";
  headerEl.innerHTML =
    '<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">' +
    '<div class="flex h-[4.25rem] sm:h-20 items-center justify-between gap-4">' +
    '<a href="' +
    href("index.html") +
    '" class="flex items-center shrink-0" aria-label="Global HR home">' +
    '<img src="' +
    prefix +
    'assets/logo.png" alt="Global HR" class="site-logo" width="200" height="64" decoding="async" />' +
    "</a>" +
    '<nav class="site-nav hidden lg:flex items-center" aria-label="Main navigation">' +
    '<ul class="site-nav__list">' +
    desktopNav +
    "</ul></nav>" +
    '<div class="flex items-center gap-2 shrink-0">' +
    '<button id="themeToggle" type="button" class="rounded-md border border-slate-300 dark:border-slate-600 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brandBlue hover:text-brandBlue dark:hover:text-sky-400 transition-colors" aria-label="Toggle color theme">' +
    '<span class="inline dark:hidden">Dark</span><span class="hidden dark:inline">Light</span>' +
    "</button>" +
    '<button id="mobileMenuBtn" type="button" class="lg:hidden rounded-md border border-slate-300 dark:border-slate-600 p-2 text-slate-700 dark:text-slate-200" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">' +
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7h16M4 12h16M4 17h16"/></svg>' +
    "</button></div></div></div>" +
    '<div id="siteMegaDropdown" class="site-mega site-mega--closed" aria-hidden="true">' +
    '<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">' +
    megaPanels +
    "</div></div>" +
    '<div id="mobileMenu" class="site-mobile hidden lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">' +
    '<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">' +
    mobileNav +
    "</div></div>";

  var megaDropdown = document.getElementById("siteMegaDropdown");
  var megaItems = headerEl.querySelectorAll(".site-nav__item--mega");
  var megaPanelsEls = headerEl.querySelectorAll("[data-mega-panel]");
  var activeMega = null;
  var closeTimer = null;
  var openTimer = null;
  var suppressHover = false;
  var hoverCooldownUntil = 0;
  var OPEN_SWITCH_DELAY = 280;
  var CLOSE_DELAY = 500;

  function showMega(id) {
    if (!megaDropdown || !id) return;
    if (suppressHover || Date.now() < hoverCooldownUntil) return;
    activeMega = id;
    megaDropdown.classList.remove("site-mega--closed");
    megaDropdown.setAttribute("aria-hidden", "false");
    megaPanelsEls.forEach(function (panel) {
      var on = panel.getAttribute("data-mega-panel") === id;
      panel.hidden = !on;
    });
    megaItems.forEach(function (item) {
      var on = item.getAttribute("data-mega-id") === id;
      item.classList.toggle("is-open", on);
      var toggle = item.querySelector(".site-nav__mega-toggle");
      if (toggle) toggle.setAttribute("aria-expanded", on ? "true" : "false");
    });
  }

  function hideMega(explicit) {
    activeMega = null;
    hoverCooldownUntil = Date.now() + 400;
    if (explicit) suppressHover = true;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (megaDropdown) {
      megaDropdown.classList.add("site-mega--closed");
      megaDropdown.setAttribute("aria-hidden", "true");
    }
    megaPanelsEls.forEach(function (panel) {
      panel.hidden = true;
    });
    megaItems.forEach(function (item) {
      item.classList.remove("is-open");
      var toggle = item.querySelector(".site-nav__mega-toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }

  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }
    closeTimer = setTimeout(function () {
      hideMega(false);
    }, CLOSE_DELAY);
  }

  function cancelClose() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function cancelOpen() {
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }
  }

  function requestShowMega(id) {
    if (!megaDropdown || !id) return;
    if (suppressHover || Date.now() < hoverCooldownUntil) return;
    cancelClose();
    if (activeMega === id) return;

    cancelOpen();
    if (!activeMega) {
      showMega(id);
      return;
    }

    openTimer = setTimeout(function () {
      showMega(id);
      openTimer = null;
    }, OPEN_SWITCH_DELAY);
  }

  headerEl.addEventListener("mouseleave", function () {
    suppressHover = false;
    cancelClose();
    if (activeMega) hideMega(false);
  });

  headerEl.addEventListener("mouseenter", function (e) {
    if (!e.relatedTarget || !headerEl.contains(e.relatedTarget)) {
      suppressHover = false;
    }
  });

  megaItems.forEach(function (item) {
    var id = item.getAttribute("data-mega-id");
    var toggle = item.querySelector(".site-nav__mega-toggle");
    item.addEventListener("mouseenter", function () {
      requestShowMega(id);
    });
    item.addEventListener("mouseleave", scheduleClose);
    item.addEventListener("focusin", function () {
      requestShowMega(id);
    });
    if (toggle) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (activeMega === id) {
          hideMega(true);
        } else {
          suppressHover = false;
          hoverCooldownUntil = 0;
          showMega(id);
        }
      });
    }
  });

  if (megaDropdown) {
    megaDropdown.addEventListener("mouseenter", cancelClose);
    megaDropdown.addEventListener("mouseleave", scheduleClose);
    megaDropdown.addEventListener("focusout", function (e) {
      if (!headerEl.contains(e.relatedTarget)) scheduleClose();
    });
  }

  document.addEventListener("mousedown", function (e) {
    if (!headerEl.contains(e.target)) hideMega(true);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideMega(true);
  });

  window.globalHrSiteNav = {
    items: NAV_ITEMS,
    hideMega: hideMega,
  };
})();
