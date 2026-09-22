(function () {
  var grid = document.getElementById("highlightsNewsGrid");
  var loadingEl = document.getElementById("highlightsNewsLoading");
  var emptyEl = document.getElementById("highlightsNewsEmpty");
  var errorEl = document.getElementById("highlightsNewsError");
  if (!grid) return;

  var api = window.globalHrSheetsNews;
  var ui = window.globalHrNewsUi;
  if (!api || !ui) return;

  var lastNews = null;

  function t(key, fallback) {
    return window.GlobalHrI18n ? window.GlobalHrI18n.t(key, fallback) : fallback || key;
  }

  function show(which) {
    if (loadingEl) {
      loadingEl.classList.toggle("hidden", which !== "loading");
      if (which === "loading") loadingEl.setAttribute("aria-busy", "true");
      else loadingEl.removeAttribute("aria-busy");
    }
    grid.classList.toggle("hidden", which !== "grid");
    if (emptyEl) {
      emptyEl.classList.toggle("hidden", which !== "empty");
      emptyEl.classList.toggle("flex", which === "empty");
    }
    if (errorEl) errorEl.classList.toggle("hidden", which !== "error");
  }

  function render(news) {
    lastNews = news || [];
    if (!lastNews.length) {
      grid.innerHTML = "";
      show("empty");
      return;
    }
    grid.innerHTML = lastNews.slice(0, 3).map(ui.renderNewsCard).join("");
    show("grid");
  }

  api
    .fetchActiveNews()
    .then(render)
    .catch(function () {
      if (errorEl) {
        errorEl.textContent = t(
          "news.loadError",
          "Could not load updates right now. Please try again later."
        );
      }
      show("error");
    });

  if (window.GlobalHrI18n) {
    window.GlobalHrI18n.onChange(function () {
      if (lastNews) render(lastNews);
    });
  }
})();
