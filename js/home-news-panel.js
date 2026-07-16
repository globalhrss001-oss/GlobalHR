(function () {
  var panel = document.getElementById("heroNewsPanel");
  if (!panel) return;

  var api = window.globalHrSheetsNews;
  var ui = window.globalHrNewsUi;
  if (!api || !ui) return;

  function hidePanel() {
    panel.classList.add("hidden");
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = "";
  }

  function showPanel(html) {
    panel.innerHTML = html;
    panel.classList.remove("hidden");
    panel.setAttribute("aria-hidden", "false");
  }

  api
    .fetchActiveNews()
    .then(function (news) {
      if (!news || !news.length) news = api.getDemoNews();
      showPanel(ui.renderHeroPanel(news));
    })
    .catch(function () {
      showPanel(ui.renderHeroPanel(api.getDemoNews()));
    });
})();
