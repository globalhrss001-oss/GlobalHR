(function () {
  const SHEETS_NEWS_API_URL =
    (window.GLOBAL_HR_CMS_API_URL || "").replace(/\/$/, "") ||
    "https://script.google.com/macros/s/AKfycbwKbgMArssmh7d5uoJTzykiNWUhYcrGZFgfewt5EUnjBWtIWz29Wv4Q9T1pNB8wq6qy/exec";
  const CACHE_KEY = "globalhr_news_v12";
  const CACHE_TTL_MS = 10 * 60 * 1000;
  const EXHIBITION_NEWS_BASE = "assets/media/news/news-exhibition-labor-minister-2026";
  const DEPRECATED_NEWS_IMAGES = {
    "assets/images/training/jurong-arrival-01.png":
      "assets/images/photos/services/arrival/arrival-04-changi-red-team.jpg",
    "assets/images/training/jurong-shipyard-arrival.png":
      "assets/images/photos/services/arrival/arrival-04-changi-red-team.jpg",
  };

  const JOB_APPLY_BODY =
    "Interested candidates, please send your CV, relevant certificates, and a passport copy.\n\n" +
    "Email: apply@globalhrss.com\n" +
    "WhatsApp: +65 63384566\n" +
    "Website: www.globalhrss.com";

  const JOB_OPENINGS = [
    {
      id: "job-site-supervisor-2026",
      title: "Site Supervisor — Aluminium Window Installation (4 pax)",
      summary:
        "Urgently hiring site supervisors for a main contractor. BCA and BCSS certificates required. Open to all nationalities.",
      body:
        "Aluminium window installation company (main contractor) — urgently hiring Site Supervisors.\n\n" +
        "Requirements:\n" +
        "• BCA Skill Certificate\n" +
        "• BCSS Certificate\n" +
        "• Open to all nationalities\n\n" +
        JOB_APPLY_BODY,
      image: "assets/media/news/job-site-supervisor-2026/poster.jpeg",
      media: "assets/media/news/job-site-supervisor-2026/poster.jpeg",
      category: "Job opening",
      published_at: "2026-08-27",
      status: "active",
    },
    {
      id: "job-carpentry-2026",
      title: "Carpentry Job — Singapore",
      summary: "Carpentry roles with basic salary SGD 1,400–1,600 plus OT. BCA / CITI certificate and 3–5 years experience.",
      body:
        "Carpentry positions in Singapore.\n\n" +
        "Salary: SGD 1,400–1,600 + OT (negotiable with experience)\n\n" +
        "Requirements:\n" +
        "• CITI Low Levy (BCA Certificate)\n" +
        "• 3–5 years carpentry experience\n" +
        "• Able to read drawings and use power tools\n\n" +
        JOB_APPLY_BODY,
      image: "assets/media/news/job-carpentry-2026/poster.jpeg",
      media: "assets/media/news/job-carpentry-2026/poster.jpeg",
      category: "Job opening",
      published_at: "2026-08-27",
      status: "active",
    },
    {
      id: "job-maincon-me-2026",
      title: "Singapore Main Con — Building & M&E Technicians",
      summary:
        "Multiple technician and supervisor roles: building maintenance, M&E, ACMV, and fault response. BCA certificate required. No agency fee.",
      body:
        "Singapore main contractor hiring for multiple positions:\n\n" +
        "• Building Maintenance — Technician / Supervisor\n" +
        "• M&E / Mechanical / Electrical — Technicians & Senior Technician\n" +
        "• ACMV — Technician\n" +
        "• Fault Response / Control Centre — FRC, ICC, ORC roles\n" +
        "• Mech / Fire Alarm Technician\n\n" +
        "Must have BCA Certificate. No agency fee.\n\n" +
        JOB_APPLY_BODY,
      image: "assets/media/news/job-maincon-me-2026/poster.jpeg",
      media: "assets/media/news/job-maincon-me-2026/poster.jpeg",
      category: "Job opening",
      published_at: "2026-08-26",
      status: "active",
    },
    {
      id: "job-safety-coordinator-2026",
      title: "Safety Coordinator — Full-time",
      summary: "Safety coordinator with housing provided. Site inspections, compliance, training, and incident reporting.",
      body:
        "Full-time Safety Coordinator role with housing provided.\n\n" +
        "Key responsibilities include site safety inspections, compliance, record keeping, safety training, incident investigation, and promoting a strong safety culture.\n\n" +
        "Requirements: prior safety coordination experience, attention to detail, good communication, and willingness to live on-site.\n\n" +
        "Salary: negotiable (discuss during interview).\n\n" +
        JOB_APPLY_BODY,
      image: "assets/media/news/job-safety-coordinator-2026/poster.jpeg",
      media: "assets/media/news/job-safety-coordinator-2026/poster.jpeg",
      category: "Job opening",
      published_at: "2026-08-26",
      status: "active",
    },
    {
      id: "job-class3-driver-2026",
      title: "Class 3 Driver — Singapore",
      summary: "Hiring Class 3 drivers with BCA Skill (CITI) certificate. SG Class 3 licence required. Salary negotiable.",
      body:
        "Class 3 Driver positions in Singapore.\n\n" +
        "Requirements:\n" +
        "• Must possess Singapore Class 3 driving licence\n" +
        "• BCA Skill (CITI) Certificate\n" +
        "• No educational qualification required\n" +
        "• Prefer candidates with Singapore driving experience\n\n" +
        "Salary: negotiable based on experience.\n\n" +
        JOB_APPLY_BODY,
      image: "assets/media/news/job-class3-driver-2026/poster.jpeg",
      media: "assets/media/news/job-class3-driver-2026/poster.jpeg",
      category: "Job opening",
      published_at: "2026-08-25",
      status: "active",
    },
    {
      id: "job-plumbing-painting-2026",
      title: "Plumbing & Painting Workers",
      summary: "6 plumbing and 5 painting positions. BCA certificate required. Good company with OT available.",
      body:
        "We are hiring plumbing and painting workers for a reputable company with good overtime opportunities.\n\n" +
        "Positions:\n" +
        "• Plumbing — 6 pax\n" +
        "• Painting — 5 pax\n\n" +
        "Must have BCA Certificate.\n\n" +
        JOB_APPLY_BODY,
      image: "assets/media/news/job-plumbing-painting-2026/poster.jpeg",
      media: "assets/media/news/job-plumbing-painting-2026/poster.jpeg",
      category: "Job opening",
      published_at: "2026-08-25",
      status: "active",
    },
    {
      id: "job-hss-cleaner-2026",
      title: "HSS Cleaner — Household Services Scheme",
      summary: "Cleaner roles under Singapore HSS. Basic salary around SGD 1,800–2,000 plus OT. Training and support provided.",
      body:
        "Household Services Scheme (HSS) cleaner recruitment for Singapore placements.\n\n" +
        "Benefits include legal employment, basic salary around SGD 1,800–2,000 plus OT, and Global HR briefing support.\n\n" +
        "Apply with CV, passport copy, and relevant documents.\n\n" +
        JOB_APPLY_BODY,
      image: "assets/media/news/job-hss-cleaner-2026/poster.jpeg",
      media: "assets/media/news/job-hss-cleaner-2026/poster.jpeg",
      category: "Job opening",
      published_at: "2026-08-24",
      status: "active",
    },
  ];

  const SEED_NEWS = [
    {
      id: "news-myanmar-employment-fair-2026",
      title:
        "GlobalHR Joins Myanmar Employment and Skills Training Opportunities Fair 2026 as Silver Partner, in Collaboration with GIE",
      summary:
        "GlobalHR participated as a Silver Partner at the Myanmar Employment and Skills Training Opportunities Fair 2026 at the University of Yangon, in collaboration with GIE.",
      body:
        "Yangon, 12 July — GlobalHR proudly participated in the Myanmar Employment and Skills Training Opportunities Fair 2026 as a Silver Partner, held at the Recreation Centre, University of Yangon, Kamayut Township. In collaboration with GIE, GlobalHR supported the fair's mission of connecting talent with opportunity and strengthening Myanmar's workforce development ecosystem.\n\nAs part of the event, representatives from GlobalHR had the opportunity to meet with Union Minister for Labour U Khin Maung Soe, who officially opened the exhibition, delivered the opening address, and toured the exhibition booths. The occasion was also attended by the Karen Ethnic Affairs Minister of Yangon Region, members of the National Skills Standards Authority (NSSA), representatives from the UMFCCI and its affiliated associations, labour organizations, employment agencies, trainees, employers, and business representatives.\n\nIn the afternoon, the fair featured panel discussions on key career and skills topics, including an engineering graduate's transition from classroom to workplace, core skills for success in the hotel industry, an IT student's path to the global stage, and bridging classroom learning to career success through soft skills. Throughout the day, GlobalHR's booth, alongside GIE's, drew strong interest from students, trainees, employers, and the public, reflecting the growing demand for employment and skills development opportunities in Myanmar.\n\nThrough this collaboration, GlobalHR reaffirms its commitment to workforce development and to connecting talent with meaningful career opportunities across Myanmar.",
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
  ].concat(JOB_OPENINGS);

  let inFlight = null;

  function mergeWithSeed(apiNews) {
    var merged = {};
    getSeedNews().forEach(function (item) {
      merged[item.id] = item;
    });
    (apiNews || []).forEach(function (item) {
      merged[item.id] = item;
    });
    return sortNewestFirst(Object.values(merged));
  }

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
    const news = mergeWithSeed(normalizeNewsList(Array.isArray(data.news) ? data.news : []));
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
