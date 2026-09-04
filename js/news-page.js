(function () {
  function t(key, fallback) {
    return window.GlobalHrI18n ? window.GlobalHrI18n.t(key, fallback) : fallback || key;
  }

  var listHost = document.getElementById("newsListGrid");
  var detailHost = document.getElementById("newsDetailView");
  var emptyEl = document.getElementById("newsListEmpty");
  var errorEl = document.getElementById("newsListError");
  var loadingEl = document.getElementById("newsListLoading");
  var filtersEl = document.getElementById("newsCategoryFilters");
  var listSection = document.getElementById("newsListSection");
  var pageTitle = document.getElementById("newsPageTitle");
  var pageSubtitle = document.getElementById("newsPageSubtitle");

  if (!listHost || !detailHost) return;

  var api = window.globalHrSheetsNews;
  var ui = window.globalHrNewsUi;
  if (!api || !ui) return;

  var allNews = [];
  var activeCategory = "";
  var detailId = "";

  function parseQuery() {
    var params = new URLSearchParams(window.location.search);
    detailId = (params.get("id") || "").trim();
    activeCategory = (params.get("category") || "").trim();
  }

  function setLoading(on) {
    if (loadingEl) loadingEl.classList.toggle("hidden", !on);
    if (listHost) listHost.classList.toggle("hidden", on);
    if (emptyEl) emptyEl.classList.add("hidden");
    if (errorEl) errorEl.classList.add("hidden");
  }

  function showError(message) {
    if (loadingEl) loadingEl.classList.add("hidden");
    if (listHost) listHost.classList.add("hidden");
    if (emptyEl) emptyEl.classList.add("hidden");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
    }
  }

  function uniqueCategories(news) {
    return Array.from(
      new Set(
        news
          .map(function (item) {
            return String(item.category || "").trim();
          })
          .filter(Boolean)
      )
    ).sort(function (a, b) {
      return a.localeCompare(b);
    });
  }

  function filterNews(news) {
    if (!activeCategory) return news;
    return news.filter(function (item) {
      return String(item.category || "").trim() === activeCategory;
    });
  }

  function renderFilters(categories) {
    if (!filtersEl) return;
    var buttons =
      '<button type="button" class="news-filter' +
      (!activeCategory ? " is-active" : "") +
      '" data-category="">' +
      t("news.all", "All") +
      "</button>";
    categories.forEach(function (cat) {
      buttons +=
        '<button type="button" class="news-filter' +
        (activeCategory === cat ? " is-active" : "") +
        '" data-category="' +
        ui.escapeHtml(cat) +
        '">' +
        ui.escapeHtml(ui.translateCategory(cat)) +
        "</button>";
    });
    filtersEl.innerHTML = buttons;
    filtersEl.querySelectorAll("[data-category]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-category") || "";
        var url = cat ? ui.newsListUrl(cat) : "news.html";
        window.location.href = url;
      });
    });
  }

  function renderList(news) {
    if (detailId) return;
    if (listSection) listSection.classList.remove("hidden");
    detailHost.classList.add("hidden");
    detailHost.innerHTML = "";

    if (pageTitle) pageTitle.textContent = t("news.pageTitle", "Updates");
    if (pageSubtitle) {
      pageSubtitle.textContent = t(
        "news.pageSubtitle",
        "Activities, arrivals, training, and job openings from Global HR — all in one feed."
      );
    }

    var filtered = filterNews(news);
    renderFilters(uniqueCategories(news));

    var subscribeCta = document.getElementById("newsSubscribeCta");
    if (subscribeCta) subscribeCta.classList.toggle("hidden", !!detailId);

    if (!filtered.length) {
      listHost.innerHTML = "";
      listHost.classList.add("hidden");
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    }

    listHost.innerHTML = filtered.map(ui.renderNewsCard).join("");
    listHost.classList.remove("hidden");
    if (emptyEl) emptyEl.classList.add("hidden");
  }

  function renderDetail(item) {
    if (!item) {
      showError(
        t(
          "news.notFound",
          "This update could not be found. It may have been removed or is no longer active."
        )
      );
      detailHost.classList.add("hidden");
      if (listSection) listSection.classList.add("hidden");
      return;
    }

    if (listSection) listSection.classList.add("hidden");
    listHost.classList.add("hidden");
    if (emptyEl) emptyEl.classList.add("hidden");
    if (filtersEl) filtersEl.innerHTML = "";

    var subscribeCta = document.getElementById("newsSubscribeCta");
    if (subscribeCta) subscribeCta.classList.add("hidden");

    if (pageTitle) pageTitle.textContent = item.title;
    if (pageSubtitle) pageSubtitle.textContent = ui.formatNewsDate(item.published_at);

    var imageHtml = ui.renderDetailGallery(item);
    var category = String(item.category || "").trim();
    var summary = String(item.summary || "").trim();
    var bodyHtml = ui.bodyToHtml(item.body);

    detailHost.innerHTML =
      '<article class="news-detail">' +
      '<a href="news.html" class="news-detail__back">' +
      t("news.back", "← All updates") +
      "</a>" +
      '<div class="news-detail__meta">' +
      (category ? '<span class="news-detail__tag">' + ui.escapeHtml(ui.translateCategory(category)) + "</span>" : "") +
      (item.published_at
        ? "<time datetime=\"" +
          ui.escapeHtml(item.published_at) +
          "\">" +
          ui.escapeHtml(ui.formatNewsDate(item.published_at)) +
          "</time>"
        : "") +
      "</div>" +
      "<h1 class=\"news-detail__title\">" +
      ui.escapeHtml(item.title) +
      "</h1>" +
      (summary ? '<p class="news-detail__summary">' + ui.escapeHtml(summary) + "</p>" : "") +
      imageHtml +
      '<div class="news-detail__body">' +
      bodyHtml +
      "</div></article>";
    detailHost.classList.remove("hidden");
    if (typeof window.initPhotoLightbox === "function") {
      window.initPhotoLightbox(detailHost);
    }
  }

  function init() {
    parseQuery();
    setLoading(true);

    api
      .fetchActiveNews()
      .then(function (news) {
        allNews = news || [];
        setLoading(false);
        if (detailId) {
          var item = allNews.find(function (n) {
            return String(n.id) === detailId;
          });
          renderDetail(item);
        } else {
          renderList(allNews);
        }
      })
      .catch(function (err) {
        setLoading(false);
        showError((err && err.message) || t("news.loadError", "Could not load updates right now. Please try again later."));
      });
  }

  init();

  if (window.GlobalHrI18n) {
    window.GlobalHrI18n.onChange(function () {
      if (!allNews.length && !detailId) return;
      if (detailId) {
        var item = allNews.find(function (n) {
          return String(n.id) === detailId;
        });
        renderDetail(item);
      } else {
        renderList(allNews);
      }
    });
  }
})();
