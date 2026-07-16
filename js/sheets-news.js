(function () {
  const SHEETS_NEWS_API_URL =
    (window.GLOBAL_HR_CMS_API_URL || "").replace(/\/$/, "") ||
    "https://script.google.com/macros/s/AKfycbwKbgMArssmh7d5uoJTzykiNWUhYcrGZFgfewt5EUnjBWtIWz29Wv4Q9T1pNB8wq6qy/exec";
  const CACHE_KEY = "globalhr_news_v5";
  const CACHE_TTL_MS = 10 * 60 * 1000;
  const DEPRECATED_NEWS_IMAGES = {
    "assets/images/training/jurong-arrival-01.png":
      "assets/images/photos/services/arrival/arrival-04-changi-red-team.jpg",
    "assets/images/training/jurong-shipyard-arrival.png":
      "assets/images/photos/services/arrival/arrival-04-changi-red-team.jpg",
  };

  const DEMO_NEWS = [
    {
      id: "news-jurong-arrival-2026",
      title: "Jurong Shipyard staff welcomed at Changi Airport",
      summary: "Global HR greeted one of our largest group arrivals from India for Jurong Shipyard.",
      body: "",
      image: "assets/images/photos/services/arrival/arrival-04-changi-red-team.jpg",
      media:
        "assets/images/photos/services/arrival/arrival-04-changi-red-team.jpg|assets/images/photos/services/arrival/arrival-01-changi-welcome.jpg|assets/images/photos/services/arrival/arrival-02-airport-group.jpg",
      category: "Arrival",
      published_at: "2026-06-06",
      status: "active",
    },
    {
      id: "news-cvt-cert-2026",
      title: "CVT electrical course graduation ceremony",
      summary: "Graduates completed the electrical installation course and received certificates.",
      body: "",
      image: "assets/images/training/cvt-cert-01.jpg",
      media:
        "assets/images/training/cvt-cert-01.jpg|assets/images/training/cvt-cert-02.jpg|assets/images/training/cvt-cert-03.jpg",
      category: "Certification",
      published_at: "2026-06-02",
      status: "active",
    },
    {
      id: "news-forklift-sankyu-2026",
      title: "Forklift drivers briefing by Sankyu Singapore",
      summary: "Selected forklift driver candidates attended a pre-departure briefing.",
      body: "",
      image: "assets/images/training/forklift-drivers-sankyu.JPG",
      category: "Training",
      published_at: "2026-05-28",
      status: "active",
    },
  ];

  let inFlight = null;

  function getDemoNews() {
    return normalizeNewsList(sortNewestFirst(DEMO_NEWS.slice()));
  }

  function replaceDeprecatedMediaPath(path) {
    const image = String(path || "").trim();
    return DEPRECATED_NEWS_IMAGES[image] || image;
  }

  function splitMediaField(value) {
    return String(value || "")
      .split(/[\n|]+/)
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean);
  }

  function normalizeMediaField(value) {
    if (!value) return value;
    return splitMediaField(value).map(replaceDeprecatedMediaPath).join("|");
  }

  function normalizeNewsItem(item) {
    if (!item) return item;
    const next = Object.assign({}, item);
    next.image = replaceDeprecatedMediaPath(next.image);
    next.media = normalizeMediaField(next.media);
    return next;
  }

  function normalizeNewsList(news) {
    return (news || []).map(normalizeNewsItem);
  }

  function buildUrl(forceRefresh) {
    const base = SHEETS_NEWS_API_URL.replace(/\/$/, "");
    let url = base + "?feed=news&status=active";
    if (forceRefresh) url += "&_=" + Date.now();
    return url;
  }

  function normalizeStatus(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function filterByStatus(news, status) {
    if (!status || status === "all") return news;
    const want = normalizeStatus(status);
    return news.filter(function (item) {
      return normalizeStatus(item.status || "active") === want;
    });
  }

  function sortNewestFirst(news) {
    return news.slice().sort(function (a, b) {
      const da = a.published_at ? new Date(a.published_at).getTime() : 0;
      const db = b.published_at ? new Date(b.published_at).getTime() : 0;
      return db - da;
    });
  }

  function readCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.news) || !parsed.ts) return null;
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      if (!parsed.news.length) return null;
      return normalizeNewsList(parsed.news);
    } catch (e) {
      return null;
    }
  }

  function writeCache(news) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), news: news }));
    } catch (e) {
      /* quota or private mode */
    }
  }

  function isCacheStale() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return true;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts) return true;
      return Date.now() - parsed.ts > CACHE_TTL_MS;
    } catch (e) {
      return true;
    }
  }

  async function fetchAllNewsFromNetwork(forceRefresh) {
    const url = buildUrl(!!forceRefresh);
    const res = await fetch(url, { method: "GET", cache: "no-store", credentials: "omit" });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("News API response was not JSON:", text.slice(0, 200));
      throw new Error("Invalid response from Google Sheets news API.");
    }
    if (!data || data.ok !== true) {
      const msg = (data && data.error) || "Could not load news from Google Sheets.";
      throw new Error(msg);
    }
    const news = normalizeNewsList(sortNewestFirst(Array.isArray(data.news) ? data.news : []));
    if (news.length) {
      writeCache(news);
      return news;
    }
    return getDemoNews();
  }

  async function fetchAllNewsFromNetworkSafe(forceRefresh) {
    try {
      return await fetchAllNewsFromNetwork(forceRefresh);
    } catch (e) {
      return getDemoNews();
    }
  }

  function revalidateInBackground() {
    if (inFlight) return;
    inFlight = fetchAllNewsFromNetwork(true)
      .catch(function () {
        /* keep showing cached data */
      })
      .finally(function () {
        inFlight = null;
      });
  }

  async function fetchAllNewsFromApi() {
    if (inFlight) return inFlight;

    const cached = readCache();
    if (cached) {
      if (isCacheStale()) revalidateInBackground();
      return cached;
    }

    inFlight = fetchAllNewsFromNetworkSafe(false).finally(function () {
      inFlight = null;
    });
    return inFlight;
  }

  async function fetchNews(status) {
    let news;
    try {
      news = await fetchAllNewsFromApi();
    } catch (e) {
      news = getDemoNews();
    }
    news = filterByStatus(news, status || "active");
    if (!news.length) return getDemoNews();
    return news;
  }

  function prefetch() {
    if (readCache() && !isCacheStale()) return;
    if (inFlight) return;
    if (readCache()) {
      revalidateInBackground();
      return;
    }
    inFlight = fetchAllNewsFromNetworkSafe(false).finally(function () {
      inFlight = null;
    });
  }

  function clearCache() {
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  window.globalHrSheetsNews = {
    apiUrl: SHEETS_NEWS_API_URL,
    clearCache: clearCache,
    fetchNews: fetchNews,
    fetchActiveNews: function () {
      return fetchNews("active");
    },
    fetchAllNews: function () {
      return fetchNews("all");
    },
    getDemoNews: getDemoNews,
    prefetch: prefetch,
    sortNewestFirst: sortNewestFirst,
  };
})();
