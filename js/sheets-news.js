(function () {
  const SHEETS_NEWS_API_URL =
    (window.GLOBAL_HR_CMS_API_URL || "").replace(/\/$/, "") ||
    "https://script.google.com/macros/s/AKfycbwKbgMArssmh7d5uoJTzykiNWUhYcrGZFgfewt5EUnjBWtIWz29Wv4Q9T1pNB8wq6qy/exec";
  const CACHE_KEY = "globalhr_news_v10";
  const CACHE_TTL_MS = 10 * 60 * 1000;
  const EXHIBITION_NEWS_BASE = "assets/media/news/news-exhibition-labor-minister-2026";
  const DEPRECATED_NEWS_IMAGES = {
    "assets/images/training/jurong-arrival-01.png":
      "assets/images/photos/services/arrival/arrival-04-changi-red-team.jpg",
    "assets/images/training/jurong-shipyard-arrival.png":
      "assets/images/photos/services/arrival/arrival-04-changi-red-team.jpg",
  };

  const SEED_NEWS = [
    {
      id: "news-myanmar-employment-fair-2026",
      title:
        "GlobalHR Joins Myanmar Employment and Skills Training Opportunities Fair 2026, Collaborates with GIE as Silver Partner",
      summary:
        "GlobalHR participated in the Myanmar Employment and Skills Training Opportunities Fair 2026 at the University of Yangon, collaborating with GIE as Silver Partners.",
      body:
        "Yangon, 12 July — GlobalHR proudly participated in the Myanmar Employment and Skills Training Opportunities Fair 2026, held today at the Recreation Centre, University of Yangon, Kamayut Township. Collaborating with GIE as Silver Partners, GlobalHR supported the fair's mission of connecting talent with opportunity and strengthening Myanmar's workforce development ecosystem.\n\nAs part of the event, representatives from GlobalHR had the opportunity to meet with Union Minister for Labour U Khin Maung Soe, who officially opened the exhibition, delivered the opening address, and toured the exhibition booths. The occasion was also attended by the Karen Ethnic Affairs Minister of Yangon Region, members of the National Skills Standards Authority (NSSA), representatives from the UMFCCI and its affiliated associations, labour organizations, employment agencies, trainees, employers, and business representatives.\n\nIn the afternoon, the fair featured panel discussions on key career and skills topics, including an engineering graduate's transition from classroom to workplace, core skills for success in the hotel industry, an IT student's path to the global stage, and bridging classroom learning to career success through soft skills. Throughout the day, GlobalHR's booth, alongside GIE's, drew strong interest from students, trainees, employers, and the public, reflecting the growing demand for employment and skills development opportunities in Myanmar.\n\nThrough this collaboration, GlobalHR reaffirms its commitment to workforce development and to connecting talent with meaningful career opportunities across Myanmar.",
      image: EXHIBITION_NEWS_BASE + "/cover.jpg",
      media: [
        EXHIBITION_NEWS_BASE + "/cover.jpg",
        EXHIBITION_NEWS_BASE + "/01-booth.jpg",
        EXHIBITION_NEWS_BASE + "/02-booth.jpg",
        EXHIBITION_NEWS_BASE + "/03-exhibition.jpg",
        EXHIBITION_NEWS_BASE + "/04-exhibition.jpg",
        EXHIBITION_NEWS_BASE + "/05-minister-meeting.jpg",
        EXHIBITION_NEWS_BASE + "/06-exhibition.jpg",
        EXHIBITION_NEWS_BASE + "/07-exhibition.jpg",
        EXHIBITION_NEWS_BASE + "/exhibition-video.mp4",
      ].join("|"),
      category: "Exhibition",
      published_at: "2026-07-12",
      status: "active",
    },
  ];

  let inFlight = null;

  function getSeedNews() {
    return normalizeNewsList(sortNewestFirst(SEED_NEWS.slice()));
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
    return getSeedNews();
  }

  async function fetchAllNewsFromNetworkSafe(forceRefresh) {
    try {
      return await fetchAllNewsFromNetwork(forceRefresh);
    } catch (e) {
      return getSeedNews();
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
      news = [];
    }
    news = filterByStatus(news || [], status || "active");
    if (!news.length) return getSeedNews();
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
    prefetch: prefetch,
    sortNewestFirst: sortNewestFirst,
  };
})();
