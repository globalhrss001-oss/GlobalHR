(function () {
  var panel = document.getElementById("heroNewsPanel");
  if (!panel) return;

  var api = window.globalHrSheetsNews;
  var ui = window.globalHrNewsUi;
  if (!api || !ui) return;

  function showPanel(html) {
    panel.innerHTML = html;
    panel.classList.remove("hero-news-panel--loading", "hidden");
    panel.removeAttribute("aria-busy");
    panel.setAttribute("aria-hidden", "false");
  }

  api
    .fetchActiveNews()
    .then(function (news) {
      if (!news || !news.length) {
        showPanel(ui.renderSidebarPanelEmpty());
        return;
      }
      showPanel(ui.renderSidebarPanel(news));
    })
    .catch(function () {
      showPanel(ui.renderSidebarPanelEmpty());
    });
})();
