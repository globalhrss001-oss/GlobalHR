(function () {
  var panel = document.getElementById("heroNewsPanel");
  if (!panel) return;

  var api = window.globalHrSheetsNews;
  var ui = window.globalHrNewsUi;
  if (!api || !ui) return;

  var lastNews = null;

  function showPanel(html) {
    panel.innerHTML = html;
    panel.classList.remove("hero-news-panel--loading", "hidden");
    panel.removeAttribute("aria-busy");
    panel.setAttribute("aria-hidden", "false");
  }

  function renderNews(news) {
    lastNews = news;
    if (!news || !news.length) {
      showPanel(ui.renderSidebarPanelEmpty());
      return;
    }
    showPanel(ui.renderSidebarPanel(news));
  }

  api
    .fetchActiveNews()
    .then(function (news) {
      renderNews(news);
    })
    .catch(function () {
      renderNews([]);
    });

  if (window.GlobalHrI18n) {
    window.GlobalHrI18n.onChange(function () {
      if (lastNews) renderNews(lastNews);
    });
  }
})();
