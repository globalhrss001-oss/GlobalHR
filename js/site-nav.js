(function () {
  var headerEl = document.getElementById("siteHeader");
  if (!headerEl) return;

  var prefix = headerEl.getAttribute("data-nav-prefix") || "";

  function t(key, fallback, vars) {
    return window.GlobalHrI18n ? window.GlobalHrI18n.t(key, fallback, vars) : fallback || key;
  }

  function currentLang() {
    return window.GlobalHrI18n ? window.GlobalHrI18n.getLang() : "en";
  }

  function href(path) {
    return prefix + path;
  }

  function getNavItems() {
    return [
      { label: t("nav.home"), href: href("index.html") },
      {
        id: "about",
        label: t("nav.about"),
        href: href("about.html"),
        mega: [
          {
            title: t("nav.aboutGroup"),
            links: [
              { label: t("nav.whoWeAre"), href: href("about.html#our-story") },
              { label: t("nav.values"), href: href("about.html#values") },
              { label: t("nav.history"), href: href("about.html#history") },
              { label: t("nav.success"), href: href("about.html#success-stories") },
              { label: t("nav.licences"), href: href("about.html#licences") },
              { label: t("nav.updates"), href: href("news.html") },
            ],
          },
          {
            title: t("nav.whoWeHelp"),
            links: [
              { label: t("nav.jobSeekers"), href: href("about.html#job-seekers") },
              { label: t("nav.employers"), href: href("about.html#employers") },
            ],
          },
          {
            title: t("nav.peoplePlaces"),
            links: [
              { label: t("nav.leadership"), href: href("about.html#leadership") },
              { label: t("nav.offices"), href: href("about.html#offices") },
              { label: t("nav.contactUs"), href: href("contact.html") },
            ],
          },
        ],
      },
      {
        id: "services",
        label: t("nav.services"),
        href: href("services.html"),
        mega: [
          {
            title: t("nav.sector"),
            listCols: 2,
            links: [
              { label: t("services.indBuildingConstruction") },
              { label: t("services.indProcessConstruction") },
              { label: t("services.indMarineShipyard") },
              { label: t("services.indMfg") },
              { label: t("services.indAgritech") },
              { label: t("services.fnb") },
              { label: t("services.indHosp") },
              { label: t("services.indHealth") },
              { label: t("services.indCleaningHss") },
              { label: t("services.indLandscape") },
              { label: t("services.indServices") },
            ],
          },
          {
            title: t("nav.getStarted"),
            links: [
              { label: t("nav.howItWorks"), href: href("services.html#process") },
              { label: t("nav.trainingCert"), href: href("training.html") },
              { label: t("nav.viewUpdates"), href: href("news.html") },
            ],
          },
        ],
      },
      {
        id: "training",
        label: t("nav.training"),
        href: href("training.html"),
        mega: [
          {
            title: t("nav.programs"),
            links: [
              { label: t("nav.trainingPrograms"), href: href("training.html#programs") },
              { label: t("nav.arrival"), href: href("training.html#arrival-service") },
              { label: t("nav.interviewBriefings"), href: href("training.html#programs") },
            ],
          },
          {
            title: t("nav.galleryEnquiries"),
            links: [
              { label: t("nav.photoGallery"), href: href("training.html#gallery") },
              { label: t("nav.bookTraining"), href: href("contact.html?reason=training") },
              { label: t("nav.viewAllPrograms"), href: href("training.html#programs") },
            ],
          },
        ],
      },
      {
        id: "updates",
        label: t("nav.updates"),
        href: href("news.html"),
        mega: [
          {
            title: t("nav.browseUpdates"),
            links: [
              { label: t("nav.allUpdates"), href: href("news.html") },
              { label: t("nav.jobOpenings"), href: href("news.html?category=Job opening") },
              { label: t("nav.exhibitions"), href: href("news.html?category=Exhibition") },
              { label: t("nav.arrivals"), href: href("news.html?category=Arrival") },
            ],
          },
          {
            title: t("nav.stayInformed"),
            links: [
              { label: t("nav.jobAlerts"), href: href("subscribe.html") },
              { label: t("nav.contactUs"), href: href("contact.html") },
            ],
          },
        ],
      },
      { label: t("nav.contact"), href: href("contact.html") },
    ];
  }

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
      '<a class="site-nav__link site-nav__mega-trigger" href="' +
      item.href +
      '" aria-haspopup="true" aria-expanded="false" aria-controls="siteMegaDropdown">' +
      item.label +
      chevronSvg() +
      "</a></li>"
    );
  }

  function renderMegaEntry(link) {
    if (link.children && link.children.length) {
      var kids = link.children
        .map(function (child) {
          return '<li><span class="site-mega__text">' + child.label + "</span></li>";
        })
        .join("");
      return (
        '<li>' +
        '<details class="site-mega__details">' +
        '<summary class="site-mega__summary">' +
        link.label +
        "</summary>" +
        '<ul class="site-mega__sublist">' +
        kids +
        "</ul></details></li>"
      );
    }
    if (link.href) {
      return (
        '<li><a class="site-mega__link" href="' +
        link.href +
        '">' +
        link.label +
        "</a></li>"
      );
    }
    return '<li><span class="site-mega__text">' + link.label + "</span></li>";
  }

  function renderMegaPanel(item) {
    if (!item.mega) return "";
    var cols = item.mega
      .map(function (col) {
        var links = col.links.map(renderMegaEntry).join("");
        var colClass = col.listCols === 2 ? "site-mega__col site-mega__col--wide" : "site-mega__col";
        var listClass = col.listCols === 2 ? "site-mega__list site-mega__list--cols-2" : "site-mega__list";
        return (
          '<div class="' +
          colClass +
          '">' +
          '<p class="site-mega__title">' +
          col.title +
          "</p>" +
          '<ul class="' +
          listClass +
          '">' +
          links +
          "</ul></div>"
        );
      })
      .join("");
    return (
      '<div class="site-mega__inner" data-mega-panel="' +
      item.id +
      '" data-cols="' +
      item.mega.length +
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
            if (link.children && link.children.length) {
              var kids = link.children
                .map(function (child) {
                  return '<span class="site-mobile__text">' + child.label + "</span>";
                })
                .join("");
              return (
                '<details class="site-mobile__nested">' +
                '<summary class="site-mobile__nested-summary">' +
                link.label +
                "</summary>" +
                '<div class="site-mobile__nested-body">' +
                kids +
                "</div></details>"
              );
            }
            if (link.href) {
              return (
                '<a class="site-mobile__sublink" href="' + link.href + '">' + link.label + "</a>"
              );
            }
            return '<span class="site-mobile__text">' + link.label + "</span>";
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
      '">' +
      t("nav.viewAll") +
      " " +
      item.label +
      "</a></div></details>"
    );
  }

  function langSwitcherHtml() {
    var lang = currentLang();
    var options = [
      { id: "en", label: t("nav.langEn"), langAttr: "en", title: "English" },
      { id: "ja", label: t("nav.langJa"), langAttr: "ja", title: "日本語" },
      { id: "ko", label: t("nav.langKo"), langAttr: "ko", title: "한국어" },
      { id: "ru", label: t("nav.langRu"), langAttr: "ru", title: "Русский" },
    ];
    var current = options.filter(function (item) {
      return item.id === lang;
    })[0] || options[0];
    var inline = options
      .map(function (item, index) {
        var sep = index ? '<span class="site-lang__sep" aria-hidden="true">|</span>' : "";
        return (
          sep +
          '<button type="button" class="site-lang__btn' +
          (lang === item.id ? " is-active" : "") +
          '" data-lang-set="' +
          item.id +
          '" lang="' +
          item.langAttr +
          '" title="' +
          item.title +
          '" aria-pressed="' +
          (lang === item.id ? "true" : "false") +
          '">' +
          item.label +
          "</button>"
        );
      })
      .join("");
    var menu = options
      .map(function (item) {
        return (
          '<button type="button" class="site-lang__option' +
          (lang === item.id ? " is-active" : "") +
          '" data-lang-set="' +
          item.id +
          '" lang="' +
          item.langAttr +
          '" role="option" aria-selected="' +
          (lang === item.id ? "true" : "false") +
          '">' +
          item.title +
          "</button>"
        );
      })
      .join("");
    return (
      '<div class="site-lang" aria-label="' +
      t("nav.langGroup") +
      '">' +
      '<div class="site-lang__inline" role="group">' +
      inline +
      "</div>" +
      '<div class="site-lang__dropdown">' +
      '<button type="button" class="site-lang__current" data-lang-menu aria-expanded="false" aria-haspopup="listbox" aria-label="' +
      t("nav.langGroup") +
      '">' +
      '<span lang="' +
      current.langAttr +
      '">' +
      current.label +
      "</span>" +
      '<span class="site-lang__caret" aria-hidden="true"></span>' +
      "</button>" +
      '<div class="site-lang__menu" role="listbox" hidden>' +
      menu +
      "</div></div></div>"
    );
  }

  var megaDropdown = null;
  var megaItems = [];
  var megaPanelsEls = [];
  var activeMega = null;
  var closeTimer = null;
  var openTimer = null;
  var suppressHover = false;
  var headerEventsBound = false;
  var documentEventsBound = false;
  var OPEN_SWITCH_DELAY = 180;
  var CLOSE_DELAY = 400;

  function isDesktopNav() {
    return window.matchMedia("(min-width: 1024px)").matches;
  }

  function positionMega(id) {
    if (!megaDropdown || !id) return;
    var trigger =
      headerEl.querySelector('[data-mega-id="' + id + '"] .site-nav__mega-trigger') ||
      headerEl.querySelector('[data-mega-id="' + id + '"]');
    if (!trigger) return;
    var headerRect = headerEl.getBoundingClientRect();
    var triggerRect = trigger.getBoundingClientRect();
    var margin = 16;
    var panelWidth = megaDropdown.offsetWidth;
    var viewport = document.documentElement.clientWidth;
    var left = triggerRect.left - headerRect.left;
    if (triggerRect.left + panelWidth > viewport - margin) {
      left = viewport - margin - panelWidth - headerRect.left;
    }
    if (headerRect.left + left < margin) {
      left = margin - headerRect.left;
    }
    megaDropdown.style.left = Math.round(left) + "px";
  }

  function showMega(id) {
    if (!megaDropdown || !id || !isDesktopNav()) return;
    if (suppressHover) return;
    activeMega = id;
    megaPanelsEls.forEach(function (panel) {
      var on = panel.getAttribute("data-mega-panel") === id;
      panel.hidden = !on;
    });
    megaDropdown.classList.remove("site-mega--closed");
    megaDropdown.setAttribute("aria-hidden", "false");
    megaItems.forEach(function (item) {
      var on = item.getAttribute("data-mega-id") === id;
      item.classList.toggle("is-open", on);
      var trigger = item.querySelector(".site-nav__mega-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", on ? "true" : "false");
    });
    positionMega(id);
  }

  function hideMega(explicit) {
    activeMega = null;
    if (explicit) suppressHover = true;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
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
      var trigger = item.querySelector(".site-nav__mega-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
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

  function scheduleClose() {
    cancelOpen();
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      hideMega(false);
    }, CLOSE_DELAY);
  }

  function requestShowMega(id) {
    if (!megaDropdown || !id || suppressHover) return;
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

  function bindMegaHover() {
    megaItems.forEach(function (item) {
      var id = item.getAttribute("data-mega-id");
      item.addEventListener("mouseenter", function () {
        suppressHover = false;
        requestShowMega(id);
      });
      item.addEventListener("mouseleave", scheduleClose);
    });
    if (megaDropdown) {
      megaDropdown.addEventListener("mouseenter", cancelClose);
      megaDropdown.addEventListener("mouseleave", scheduleClose);
    }
  }

  function closeLangMenu() {
    headerEl.querySelectorAll(".site-lang__menu").forEach(function (menu) {
      menu.hidden = true;
    });
    headerEl.querySelectorAll("[data-lang-menu]").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function bindHeaderChrome() {
    if (headerEventsBound) return;
    headerEventsBound = true;

    headerEl.addEventListener("click", function (e) {
      if (e.target.closest(".site-mega__link")) {
        setTimeout(function () {
          hideMega(true);
        }, 0);
        return;
      }

      if (
        activeMega &&
        !e.target.closest("#siteMegaDropdown") &&
        !e.target.closest(".site-nav__item--mega")
      ) {
        hideMega(true);
      }

      var langMenuBtn = e.target.closest("[data-lang-menu]");
      if (langMenuBtn) {
        e.preventDefault();
        var wrap = langMenuBtn.closest(".site-lang__dropdown");
        var menu = wrap && wrap.querySelector(".site-lang__menu");
        if (menu) {
          var open = menu.hidden;
          closeLangMenu();
          menu.hidden = !open;
          langMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        }
        return;
      }

      var langBtn = e.target.closest("[data-lang-set]");
      if (langBtn && window.GlobalHrI18n) {
        e.preventDefault();
        window.GlobalHrI18n.setLang(langBtn.getAttribute("data-lang-set"));
        return;
      }

      if (e.target.closest("#themeToggle") && window.globalHrTheme) {
        window.globalHrTheme.toggle();
        return;
      }

      var menuBtn = e.target.closest("#mobileMenuBtn");
      if (menuBtn) {
        var mobileMenu = document.getElementById("mobileMenu");
        if (!mobileMenu) return;
        var open = mobileMenu.classList.contains("hidden");
        mobileMenu.classList.toggle("hidden", !open);
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      }
    });

    headerEl.addEventListener("focusout", function (e) {
      if (activeMega && !headerEl.contains(e.relatedTarget)) hideMega(false);
    });
  }

  function bindDocumentChrome() {
    if (documentEventsBound) return;
    documentEventsBound = true;
    document.addEventListener("mousedown", function (e) {
      if (!headerEl.contains(e.target)) hideMega(true);
      if (!e.target.closest(".site-lang")) closeLangMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        hideMega(true);
        closeLangMenu();
      }
    });
    window.addEventListener("resize", function () {
      if (!activeMega) return;
      if (isDesktopNav()) positionMega(activeMega);
      else hideMega(true);
    });
  }

  function render() {
    var NAV_ITEMS = getNavItems();
    var desktopNav = NAV_ITEMS.map(renderDesktopItem).join("");
    var megaPanels = NAV_ITEMS.filter(function (i) {
      return i.mega;
    })
      .map(renderMegaPanel)
      .join("");
    var mobileNav = NAV_ITEMS.map(renderMobileItem).join("");

    headerEl.className =
      "site-header relative sticky top-0 z-50 text-brandDark dark:text-slate-200";
    headerEl.innerHTML =
      '<div class="site-header__bar bg-white/95 backdrop-blur border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-700">' +
      '<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">' +
      '<div class="flex h-[4.25rem] sm:h-20 items-center justify-between gap-4">' +
      '<a href="' +
      href("index.html") +
      '" class="flex items-center shrink-0" aria-label="' +
      t("nav.homeAria") +
      '">' +
      '<img src="' +
      prefix +
      'assets/logo.png" alt="Global HR" class="site-logo" width="200" height="64" decoding="async" />' +
      "</a>" +
      '<nav class="site-nav hidden lg:flex items-center" aria-label="' +
      t("nav.mainNav") +
      '">' +
      '<ul class="site-nav__list">' +
      desktopNav +
      "</ul></nav>" +
      '<div class="flex items-center gap-2 sm:gap-3 shrink-0">' +
      langSwitcherHtml() +
      '<button id="themeToggle" type="button" class="rounded-md border border-slate-300 dark:border-slate-600 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brandBlue hover:text-brandBlue dark:hover:text-sky-400 transition-colors" aria-label="' +
      t("theme.toggle") +
      '">' +
      '<span class="inline dark:hidden">' +
      t("theme.dark") +
      '</span><span class="hidden dark:inline">' +
      t("theme.light") +
      "</span>" +
      "</button>" +
      '<button id="mobileMenuBtn" type="button" class="lg:hidden rounded-md border border-slate-300 dark:border-slate-600 p-2 text-slate-700 dark:text-slate-200" aria-label="' +
      t("nav.openMenu") +
      '" aria-expanded="false" aria-controls="mobileMenu">' +
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      "</button></div></div></div></div>" +
      '<div id="siteMegaDropdown" class="site-mega site-mega--closed" aria-hidden="true">' +
      megaPanels +
      "</div>" +
      '<div id="mobileMenu" class="site-mobile hidden lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">' +
      '<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">' +
      mobileNav +
      "</div></div>";

    megaDropdown = document.getElementById("siteMegaDropdown");
    megaItems = headerEl.querySelectorAll(".site-nav__item--mega");
    megaPanelsEls = headerEl.querySelectorAll("[data-mega-panel]");
    activeMega = null;
    suppressHover = false;
    bindMegaHover();
    bindHeaderChrome();
    bindDocumentChrome();

    window.globalHrSiteNav = {
      items: NAV_ITEMS,
      hideMega: hideMega,
      render: render,
    };
    document.dispatchEvent(new CustomEvent("globalhr:nav-rendered"));
  }

  render();

  if (window.GlobalHrI18n) {
    window.GlobalHrI18n.onChange(function () {
      render();
    });
  }
})();
