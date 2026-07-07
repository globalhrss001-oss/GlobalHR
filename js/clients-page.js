(function () {
  if (!window.GLOBAL_HR_CLIENTS) return;

  var clients = window.GLOBAL_HR_CLIENTS;
  var grids = document.querySelectorAll("#homeClientsGrid");
  if (!grids.length) return;

  var reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCard(client, options) {
    options = options || {};
    var hiddenAttr = options.hidden ? ' aria-hidden="true"' : "";

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
        '" class="client-logo-card client-logo-card--linked clients-marquee__item"' +
        hiddenAttr +
        ' target="_blank" rel="noopener noreferrer" data-client-id="' +
        escapeHtml(client.id) +
        '">' +
        inner +
        "</a>"
      );
    }

    return (
      '<article class="client-logo-card clients-marquee__item" tabindex="0" role="img" aria-label="' +
      escapeHtml(client.name) +
      '"' +
      hiddenAttr +
      ' data-client-id="' +
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

  function renderStaticGrid(grid) {
    grid.className = "clients-grid";
    grid.innerHTML = clients.map(function (client) {
      return renderCard(client);
    }).join("");
    grid.querySelectorAll(".client-logo-card").forEach(bindPressFeedback);
  }

  function renderMarqueeTrack(rowClients, durationSeconds, reverse) {
    var duplicated = rowClients.concat(rowClients);
    var cards = duplicated
      .map(function (client, index) {
        return renderCard(client, { hidden: index >= rowClients.length });
      })
      .join("");

    return (
      '<div class="clients-marquee__viewport">' +
      '<div class="clients-marquee__track' +
      (reverse ? " clients-marquee__track--reverse" : "") +
      '" style="--marquee-duration:' +
      durationSeconds +
      's">' +
      cards +
      "</div></div>"
    );
  }

  function splitIntoRows(items, rowCount) {
    var rows = [];
    var perRow = Math.ceil(items.length / rowCount);
    for (var i = 0; i < rowCount; i++) {
      rows.push(items.slice(i * perRow, (i + 1) * perRow));
    }
    return rows.filter(function (row) {
      return row.length > 0;
    });
  }

  function renderMarquee(grid) {
    grid.className = "clients-marquee";
    var rows = splitIntoRows(clients, 3);
    var rowConfig = [
      { duration: 52, reverse: false },
      { duration: 58, reverse: true },
      { duration: 48, reverse: false },
    ];

    grid.innerHTML = rows
      .map(function (rowClients, index) {
        var config = rowConfig[index] || rowConfig[0];
        return (
          '<div class="clients-marquee__row' +
          (index > 0 ? " clients-marquee__row--offset" : "") +
          '">' +
          renderMarqueeTrack(rowClients, config.duration, config.reverse) +
          "</div>"
        );
      })
      .join("");

    grid.querySelectorAll(".client-logo-card").forEach(bindPressFeedback);
  }

  grids.forEach(function (grid) {
    if (reducedMotion) {
      renderStaticGrid(grid);
      return;
    }
    renderMarquee(grid);
  });
})();
