(function () {
  var root =
    document.getElementById("industries") ||
    document.getElementById("markets") ||
    document.getElementById("titp-categories");
  if (!root) return;

  var cards = root.querySelectorAll(".industry-card");
  if (!cards.length) return;

  function idFromHref(href) {
    if (!href) return "";
    var hashIndex = href.indexOf("#");
    if (hashIndex === -1) return "";
    return href.slice(hashIndex + 1);
  }

  function elById(id) {
    return id ? document.getElementById(id) : null;
  }

  function isIndustryCardId(id) {
    var el = elById(id);
    return Boolean(el && el.classList.contains("industry-card"));
  }

  function isProgramId(id) {
    var el = elById(id);
    return Boolean(el && el.classList.contains("industry-program"));
  }

  function isTargetId(id) {
    return isIndustryCardId(id) || isProgramId(id);
  }

  function programInsideCard(card) {
    var id = (location.hash || "").replace("#", "");
    var el = elById(id);
    if (el && card.contains(el) && el.classList.contains("industry-program")) return el;
    return null;
  }

  function closeNested(card, exceptId) {
    card.querySelectorAll(".industry-program").forEach(function (program) {
      if (program.id !== exceptId) program.open = false;
    });
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
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    cards.forEach(function (card) {
      card.open = card.id === id;
      if (card.id === id) closeNested(card);
    });
    if (scroll) {
      var el = elById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function openProgram(id, scroll) {
    var program = elById(id);
    if (!program || !program.classList.contains("industry-program")) return;
    var card = program.closest(".industry-card");
    if (!card) return;
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    cards.forEach(function (other) {
      other.open = other === card;
      if (other !== card) closeNested(other);
    });
    closeNested(card, id);
    program.open = true;
    if (scroll) program.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openFromHash(scroll) {
    var id = (location.hash || "").replace("#", "");
    if (isProgramId(id)) openProgram(id, scroll);
    else if (isIndustryCardId(id)) openCard(id, scroll);
    return Boolean(isProgramId(id) || isIndustryCardId(id));
  }

  cards.forEach(function (card) {
    card.addEventListener("toggle", function () {
      if (!card.open) return;
      cards.forEach(function (other) {
        if (other !== card) {
          other.open = false;
          closeNested(other);
        }
      });
      if (programInsideCard(card)) return;
      closeNested(card);
      if (history.replaceState) history.replaceState(null, "", "#" + card.id);
    });
  });

  root.querySelectorAll(".industry-program").forEach(function (program) {
    program.addEventListener("toggle", function () {
      if (!program.open) return;
      var card = program.closest(".industry-card");
      if (card) closeNested(card, program.id);
      if (program.id && history.replaceState) history.replaceState(null, "", "#" + program.id);
    });
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");
    var id = idFromHref(href);
    if (!isTargetId(id) || !sameDocumentHref(href)) return;
    event.preventDefault();
    if (isProgramId(id)) openProgram(id, true);
    else openCard(id, true);
  });

  window.addEventListener("hashchange", function () {
    openFromHash(true);
  });

  if (!openFromHash(true)) {
    cards.forEach(function (card) {
      card.open = false;
    });
  }
})();
