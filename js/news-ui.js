(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatNewsDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function shortCategory(value) {
    const cat = String(value || "").trim();
    if (!cat) return "";
    if (cat.length <= 10) return cat;
    if (/certification/i.test(cat)) return "Cert";
    return cat.slice(0, 10);
  }

  function newsDetailUrl(id) {
    return "news.html?id=" + encodeURIComponent(String(id || ""));
  }

  function newsListUrl(category) {
    if (!category) return "news.html";
    return "news.html?category=" + encodeURIComponent(String(category));
  }

  function resolveImagePath(image) {
    const src = String(image || "").trim();
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src;
    return src.replace(/^\//, "");
  }

  function parseMediaList(value) {
    return String(value || "")
      .split(/[\n|]+/)
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean);
  }

  function isVideoPath(src) {
    const path = String(src || "").trim();
    if (!path) return false;
    if (/youtube\.com|youtu\.be|vimeo\.com/i.test(path)) return true;
    return /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(path);
  }

  function isYoutubeUrl(src) {
    return /youtube\.com|youtu\.be/i.test(String(src || ""));
  }

  function youtubeEmbedUrl(src) {
    const url = String(src || "").trim();
    let id = "";
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) id = watchMatch[1];
    else if (/youtu\.be\//i.test(url)) id = url.split("/").pop().split("?")[0];
    else if (/youtube\.com\/embed\//i.test(url)) return url;
    if (!id) return "";
    return "https://www.youtube.com/embed/" + encodeURIComponent(id);
  }

  function getNewsMedia(item) {
    if (!item) return [];
    const seen = {};
    const entries = [];
    const rawList = parseMediaList(item.media);
    if (!rawList.length && item.image) rawList.push(String(item.image).trim());

    rawList.forEach(function (raw) {
      const src = resolveImagePath(raw);
      if (!src || seen[src]) return;
      seen[src] = true;
      entries.push({
        type: isVideoPath(src) ? "video" : "image",
        src: src,
      });
    });
    return entries;
  }

  function getCoverImage(item) {
    const cover = resolveImagePath(item && item.image);
    if (cover) return cover;
    const media = getNewsMedia(item);
    for (let i = 0; i < media.length; i++) {
      if (media[i].type === "image") return media[i].src;
    }
    return "";
  }

  function renderMediaItem(entry, index) {
    if (!entry || !entry.src) return "";
    if (entry.type === "video" && isYoutubeUrl(entry.src)) {
      const embed = youtubeEmbedUrl(entry.src);
      if (!embed) return "";
      return (
        '<div class="news-detail__media-item news-detail__media-item--video">' +
        '<iframe class="news-detail__iframe" src="' +
        escapeHtml(embed) +
        '" title="News video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
      );
    }
    if (entry.type === "video") {
      return (
        '<div class="news-detail__media-item news-detail__media-item--video">' +
        '<video class="news-detail__video" controls preload="metadata" playsinline src="' +
        escapeHtml(entry.src) +
        '"></video></div>'
      );
    }
    return (
      '<div class="news-detail__media-item">' +
      '<img class="news-detail__img" src="' +
      escapeHtml(entry.src) +
      '" alt="" width="1200" height="675" loading="' +
      (index === 0 ? "eager" : "lazy") +
      '" decoding="async" /></div>'
    );
  }

  function renderDetailGallery(item) {
    const media = getNewsMedia(item);
    if (!media.length) return "";
    return (
      '<div class="news-detail__gallery" aria-label="News photos and videos">' +
      media.map(renderMediaItem).join("") +
      "</div>"
    );
  }

  function bodyToHtml(body) {
    const text = String(body || "").trim();
    if (!text) return "";
    return text
      .split(/\n{2,}/)
      .map(function (para) {
        return "<p>" + escapeHtml(para.trim()).replace(/\n/g, "<br />") + "</p>";
      })
      .join("");
  }

  function renderPanelItem(item) {
    const img = getCoverImage(item);
    const thumb = img
      ? '<img class="hero-news-panel__thumb" src="' +
        escapeHtml(img) +
        '" alt="" width="200" height="56" loading="lazy" decoding="async" />'
      : "";
    const date = formatNewsDate(item.published_at);
    const category = shortCategory(item.category);
    const tag = category
      ? '<span class="hero-news-panel__tag">' + escapeHtml(category) + "</span>"
      : "";

    return (
      "<li>" +
      '<a href="' +
      newsDetailUrl(item.id) +
      '" class="hero-news-panel__item">' +
      thumb +
      '<div class="hero-news-panel__meta">' +
      (date ? "<span>" + escapeHtml(date) + "</span>" : "") +
      tag +
      "</div>" +
      '<p class="hero-news-panel__headline">' +
      escapeHtml(item.title) +
      "</p>" +
      "</a></li>"
    );
  }

  function renderSidebarPanelItem(item) {
    const img = getCoverImage(item);
    const thumb = img
      ? '<img class="hero-news-panel__thumb" src="' +
        escapeHtml(img) +
        '" alt="" width="320" height="180" loading="lazy" decoding="async" />'
      : "";
    const date = formatNewsDate(item.published_at);
    const category = shortCategory(item.category);
    const tag = category
      ? '<span class="hero-news-panel__tag">' + escapeHtml(category) + "</span>"
      : "";
    const summary = String(item.summary || "").trim();
    const summaryBlock = summary
      ? '<p class="hero-news-panel__summary">' + escapeHtml(summary) + "</p>"
      : "";

    return (
      "<li>" +
      '<a href="' +
      newsDetailUrl(item.id) +
      '" class="hero-news-panel__item">' +
      thumb +
      '<div class="hero-news-panel__meta">' +
      (date ? "<span>" + escapeHtml(date) + "</span>" : "") +
      tag +
      "</div>" +
      '<p class="hero-news-panel__headline">' +
      escapeHtml(item.title) +
      "</p>" +
      summaryBlock +
      "</a></li>"
    );
  }

  function renderSidebarPanel(items) {
    const list = (items || [])
      .slice(0, 3)
      .map(renderSidebarPanelItem)
      .join("");
    return (
      '<div class="hero-news-panel__head">' +
      '<h2 id="heroNewsTitle" class="hero-news-panel__title">Latest updates</h2>' +
      '<a href="news.html" class="hero-news-panel__all">View all →</a>' +
      "</div>" +
      '<ul class="hero-news-panel__list">' +
      list +
      "</ul>"
    );
  }

  function renderSidebarPanelEmpty() {
    return (
      '<div class="hero-news-panel__head">' +
      '<h2 id="heroNewsTitle" class="hero-news-panel__title">Latest updates</h2>' +
      '<a href="news.html" class="hero-news-panel__all">View all →</a>' +
      "</div>" +
      '<div class="hero-news-panel__empty" role="status">' +
      '<p class="hero-news-panel__empty-title">No updates yet</p>' +
      '<p class="hero-news-panel__empty-text">Check back soon for activities, job openings, and company news.</p>' +
      "</div>"
    );
  }

  function renderHeroPanel(items) {
    const list = (items || [])
      .slice(0, 3)
      .map(renderPanelItem)
      .join("");
    return (
      '<div class="hero-news-panel__head">' +
      '<h2 id="heroNewsTitle" class="hero-news-panel__title">Latest updates</h2>' +
      '<a href="news.html" class="hero-news-panel__all">View all →</a>' +
      "</div>" +
      '<ul class="hero-news-panel__list">' +
      list +
      "</ul>"
    );
  }

  function renderHeroPanelEmpty() {
    return (
      '<div class="hero-news-panel__head">' +
      '<h2 id="heroNewsTitle" class="hero-news-panel__title">Latest updates</h2>' +
      '<a href="news.html" class="hero-news-panel__all">View all →</a>' +
      "</div>" +
      '<div class="hero-news-panel__empty" role="status">' +
      '<p class="hero-news-panel__empty-title">No updates yet</p>' +
      '<p class="hero-news-panel__empty-text">Check back soon for activities, job openings, and company news.</p>' +
      "</div>"
    );
  }

  function renderNewsCard(item) {
    const img = getCoverImage(item);
    const imageBlock = img
      ? '<img class="news-card__img" src="' +
        escapeHtml(img) +
        '" alt="" width="640" height="360" loading="lazy" decoding="async" />'
      : '<div class="news-card__img news-card__img--placeholder" aria-hidden="true"></div>';
    const date = formatNewsDate(item.published_at);
    const category = String(item.category || "").trim();
    const summary = String(item.summary || "").trim();

    return (
      '<article class="news-card">' +
      '<a href="' +
      newsDetailUrl(item.id) +
      '" class="news-card__link">' +
      imageBlock +
      '<div class="news-card__body">' +
      '<div class="news-card__meta">' +
      (date ? "<time datetime=\"" + escapeHtml(item.published_at) + "\">" + escapeHtml(date) + "</time>" : "") +
      (category ? '<span class="news-card__tag">' + escapeHtml(category) + "</span>" : "") +
      "</div>" +
      "<h2 class=\"news-card__title\">" +
      escapeHtml(item.title) +
      "</h2>" +
      (summary ? '<p class="news-card__summary">' + escapeHtml(summary) + "</p>" : "") +
      '<span class="news-card__more">Read more →</span>' +
      "</div></a></article>"
    );
  }

  window.globalHrNewsUi = {
    bodyToHtml: bodyToHtml,
    escapeHtml: escapeHtml,
    formatNewsDate: formatNewsDate,
    getCoverImage: getCoverImage,
    getNewsMedia: getNewsMedia,
    newsDetailUrl: newsDetailUrl,
    newsListUrl: newsListUrl,
    parseMediaList: parseMediaList,
    renderDetailGallery: renderDetailGallery,
    renderHeroPanel: renderHeroPanel,
    renderHeroPanelEmpty: renderHeroPanelEmpty,
    renderSidebarPanel: renderSidebarPanel,
    renderSidebarPanelEmpty: renderSidebarPanelEmpty,
    renderNewsCard: renderNewsCard,
    resolveImagePath: resolveImagePath,
    shortCategory: shortCategory,
  };
})();
