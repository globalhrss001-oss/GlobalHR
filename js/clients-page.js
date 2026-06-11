(function () {
  if (!window.GLOBAL_HR_CLIENTS) return;

  var clients = window.GLOBAL_HR_CLIENTS;
  var grids = document.querySelectorAll("#clientsGrid, #homeClientsGrid");
  if (!grids.length) return;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCard(client) {
    var inner =
      '<div class="client-logo-card__inner">' +
      '<div class="client-logo-card__logo-wrap">' +
      '<img src="' +
      escapeHtml(client.logo) +
      '" alt="' +
      escapeHtml(client.name) +
      '" class="client-logo-card__logo" loading="lazy" decoding="async" />' +
      "</div>" +
      "</div>";

    if (client.url) {
      return (
        '<a href="' +
        escapeHtml(client.url) +
        '" class="client-logo-card client-logo-card--linked" target="_blank" rel="noopener noreferrer" data-client-id="' +
        escapeHtml(client.id) +
        '">' +
        inner +
        "</a>"
      );
    }

    return (
      '<article class="client-logo-card" tabindex="0" role="img" aria-label="' +
      escapeHtml(client.name) +
      '" data-client-id="' +
      escapeHtml(client.id) +
      '">' +
      inner +
      "</article>"
    );
  }

  function bindPressFeedback(el) {
    function press() {
      el.classList.add("is-pressed");
    }
    function release() {
      el.classList.remove("is-pressed");
    }
    el.addEventListener("mousedown", press);
    el.addEventListener("mouseup", release);
    el.addEventListener("mouseleave", release);
    el.addEventListener("touchstart", press, { passive: true });
    el.addEventListener("touchend", release);
    el.addEventListener("touchcancel", release);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        press();
      }
    });
    el.addEventListener("keyup", function (e) {
      if (e.key === "Enter" || e.key === " ") release();
    });
    el.addEventListener("blur", release);
  }

  grids.forEach(function (grid) {
    grid.innerHTML = clients.map(renderCard).join("");
    grid.querySelectorAll(".client-logo-card").forEach(bindPressFeedback);
  });
})();
