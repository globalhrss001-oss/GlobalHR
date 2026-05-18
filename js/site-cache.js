(function (window, document) {
  var BUILD = "20260522";

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });

  function publicHtmlName(pathname) {
    var last = (pathname || "").replace(/\\/g, "/").split("/").filter(Boolean).pop() || "";
    last = last.split("?")[0].toLowerCase();
    if (!last || !/\.html$/i.test(last)) return "index.html";
    return last;
  }

  function isHomeUrl(href) {
    if (!href || href.charAt(0) === "#" || /^mailto:/i.test(href)) return false;
    try {
      return publicHtmlName(new URL(href, window.location.href).pathname) === "index.html";
    } catch (e) {
      return href === "index.html" || href === "./";
    }
  }

  function withBuild(href) {
    try {
      var url = new URL(href, window.location.href);
      url.searchParams.set("v", BUILD);
      return url.pathname + url.search + url.hash;
    } catch (e) {
      return "index.html?v=" + BUILD;
    }
  }

  function isCurrentHome() {
    return publicHtmlName(window.location.pathname) === "index.html";
  }

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target.closest && event.target.closest("a[href]");
      if (!link || link.target === "_blank") return;
      var href = link.getAttribute("href");
      if (!isHomeUrl(href)) return;
      if (new RegExp("[?&]v=" + BUILD, "i").test(href || "")) return;
      event.preventDefault();
      window.location.href = withBuild(href);
    },
    true
  );

  if (isCurrentHome() && !document.querySelector("[data-hero-slideshow]")) {
    if (!new RegExp("[?&]v=" + BUILD, "i").test(window.location.search || "")) {
      window.location.replace(withBuild("index.html"));
    }
  }
})(window, document);
