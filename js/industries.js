(function () {
  var root = document.getElementById("industries");
  if (!root) return;

  var cards = root.querySelectorAll(".industry-card");
  if (!cards.length) return;

  function idFromHref(href) {
    if (!href) return "";
    var hashIndex = href.indexOf("#");
    if (hashIndex === -1) return "";
    return href.slice(hashIndex + 1);
  }

  function isIndustryCardId(id) {
    var el = id && document.getElementById(id);
    return Boolean(el && el.classList.contains("industry-card"));
  }

  function cardIdFromHash() {
    return isIndustryCardId((location.hash || "").replace("#", ""))
      ? location.hash.replace("#", "")
      : "";
  }

  function sameDocumentHref(href) {
    if (!href) return false;
    if (href.charAt(0) === "#") return true;
    try {
      var url = new URL(href, location.href);
      return url.pathname === location.pathname;
    } catch (e) {
      var file = href.split("#")[0].split("/").pop();
      var current = location.pathname.split("/").pop();
      return !file || file === current;
    }
  }

  function openCard(id, scroll) {
    if (!isIndustryCardId(id)) return;
    cards.forEach(function (card) {
      card.open = card.id === id;
    });
    if (scroll) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  cards.forEach(function (card) {
    card.addEventListener("toggle", function () {
      if (!card.open) return;
      cards.forEach(function (other) {
        if (other !== card) other.open = false;
      });
      if (history.replaceState) history.replaceState(null, "", "#" + card.id);
    });
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");
    var id = idFromHref(href);
    if (!isIndustryCardId(id) || !sameDocumentHref(href)) return;
    event.preventDefault();
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    else location.hash = id;
    openCard(id, true);
  });

  window.addEventListener("hashchange", function () {
    var id = cardIdFromHash();
    if (id) openCard(id, true);
  });

  var initial = cardIdFromHash();
  if (initial) openCard(initial, true);
  else {
    cards.forEach(function (card) {
      card.open = false;
    });
  }
})();
