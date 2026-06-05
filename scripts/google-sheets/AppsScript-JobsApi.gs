/**
 * Global HR — Jobs API + Admin auth (Google Sheets CMS)
 *
 * SETUP (client Google account):
 * 1. Spreadsheet tabs: Jobs, Admins
 * 2. Script properties: SESSION_SECRET, PASSWORD_SALT (run generateScriptSecrets once)
 * 3. Run setupAdminPassword("username", "password") for each staff account (max 3)
 * 4. Deploy → Web app → Execute as: Me → Who has access: Anyone
 * 5. Copy /exec URL into js/cms-config.js on the website
 */

var JOBS_SHEET = "Jobs";
var ADMINS_SHEET = "Admins";
var SESSION_HOURS = 12;
var MAX_LOGIN_FAILURES = 5;
var LOGIN_LOCK_MINUTES = 15;

var JOB_HEADERS = [
  "id",
  "title",
  "company",
  "location",
  "job_type",
  "industry",
  "description",
  "apply_email",
  "status",
  "created_at",
];

function doGet(e) {
  try {
    var jobs = readJobsFromSheet_();
    var params = e && e.parameter ? e.parameter : {};
    var statusFilter = (params.status || "all").toLowerCase();

    if (statusFilter && statusFilter !== "all") {
      jobs = jobs.filter(function (job) {
        return (job.status || "").toLowerCase() === statusFilter;
      });
    }

    jobs.sort(sortJobsNewestFirst_);

    return jsonResponse_({ ok: true, jobs: jobs });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err.message || err) });
  }
}

function doPost(e) {
  try {
    var body = parsePostBody_(e);
    var action = (body.action || "").toLowerCase();

    if (action === "login") {
      return jsonResponse_(handleLogin_(body));
    }

    if (action === "logout") {
      revokeToken_(body.token);
      return jsonResponse_({ ok: true });
    }

    var session = requireSession_(body.token);
    if (!session) {
      return jsonResponse_({ ok: false, error: "Unauthorized. Please sign in again." });
    }

    if (action === "list") {
      var jobs = readJobsFromSheet_();
      jobs.sort(sortJobsNewestFirst_);
      return jsonResponse_({ ok: true, jobs: jobs, username: session.username });
    }

    if (action === "create") {
      var created = createJob_(body.job || {});
      return jsonResponse_({ ok: true, job: created });
    }

    if (action === "update") {
      var updated = updateJob_(body.id, body.job || {});
      return jsonResponse_({ ok: true, job: updated });
    }

    if (action === "delete") {
      deleteJob_(body.id);
      return jsonResponse_({ ok: true });
    }

    if (action === "togglestatus") {
      var toggled = toggleJobStatus_(body.id);
      return jsonResponse_({ ok: true, job: toggled });
    }

    return jsonResponse_({ ok: false, error: "Unknown action." });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err.message || err) });
  }
}

/** Run once: creates SESSION_SECRET and PASSWORD_SALT in Script properties. */
function generateScriptSecrets() {
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty("SESSION_SECRET")) {
    props.setProperty("SESSION_SECRET", Utilities.getUuid() + Utilities.getUuid());
  }
  if (!props.getProperty("PASSWORD_SALT")) {
    props.setProperty("PASSWORD_SALT", Utilities.getUuid());
  }
  Logger.log("SESSION_SECRET and PASSWORD_SALT are set.");
}

/**
 * Run from editor for each staff user (max 3).
 * Example: setupAdminPassword("josephine", "YourSecurePassword123");
 */
function setupAdminPassword(username, password) {
  if (!username || !password) {
    throw new Error("Provide username and password.");
  }
  ensureAdminsSheet_();
  var hash = hashPassword_(password);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ADMINS_SHEET);
  var data = sheet.getDataRange().getValues();
  var user = String(username).trim().toLowerCase();
  var rowIndex = -1;

  for (var r = 1; r < data.length; r++) {
    if (String(data[r][0] || "").trim().toLowerCase() === user) {
      rowIndex = r + 1;
      break;
    }
  }

  if (rowIndex === -1) {
    sheet.appendRow([user, hash, true]);
    Logger.log("Created admin: " + user);
  } else {
    sheet.getRange(rowIndex, 2, 1, 2).setValues([[hash, true]]);
    Logger.log("Updated password for: " + user);
  }
}

function handleLogin_(body) {
  var username = String(body.username || "").trim().toLowerCase();
  var password = String(body.password || "");

  if (!username || !password) {
    return { ok: false, error: "Username and password are required." };
  }

  if (isLoginLocked_(username)) {
    return { ok: false, error: "Too many failed attempts. Try again later." };
  }

  var admin = findAdmin_(username);
  if (!admin || !admin.active) {
    recordLoginFailure_(username);
    return { ok: false, error: "Invalid username or password." };
  }

  if (admin.password_hash !== hashPassword_(password)) {
    recordLoginFailure_(username);
    return { ok: false, error: "Invalid username or password." };
  }

  clearLoginFailures_(username);
  var token = createSessionToken_(username);
  return { ok: true, token: token, username: username };
}

function createJob_(job) {
  var sheet = getJobsSheet_();
  var id = String(job.id || "").trim() || generateJobId_();
  var row = jobToRow_(id, job, false);
  sheet.appendRow(row);
  return rowToJob_(row);
}

function updateJob_(id, job) {
  if (!id) throw new Error("Job id is required.");
  var sheet = getJobsSheet_();
  var rowIndex = findJobRowIndex_(sheet, id);
  if (rowIndex === -1) throw new Error("Job not found.");

  var existing = readJobAtRow_(sheet, rowIndex);
  var merged = {
    id: id,
    title: job.title !== undefined ? job.title : existing.title,
    company: job.company !== undefined ? job.company : existing.company,
    location: job.location !== undefined ? job.location : existing.location,
    job_type: job.job_type !== undefined ? job.job_type : existing.job_type,
    industry: job.industry !== undefined ? job.industry : existing.industry,
    description: job.description !== undefined ? job.description : existing.description,
    apply_email: job.apply_email !== undefined ? job.apply_email : existing.apply_email,
    status: job.status !== undefined ? job.status : existing.status,
    created_at: existing.created_at || todayIso_(),
  };

  var row = jobToRow_(id, merged, true);
  sheet.getRange(rowIndex, 1, 1, JOB_HEADERS.length).setValues([row]);
  return rowToJob_(row);
}

function deleteJob_(id) {
  if (!id) throw new Error("Job id is required.");
  var sheet = getJobsSheet_();
  var rowIndex = findJobRowIndex_(sheet, id);
  if (rowIndex === -1) throw new Error("Job not found.");
  sheet.deleteRow(rowIndex);
}

function toggleJobStatus_(id) {
  if (!id) throw new Error("Job id is required.");
  var sheet = getJobsSheet_();
  var rowIndex = findJobRowIndex_(sheet, id);
  if (rowIndex === -1) throw new Error("Job not found.");
  var job = readJobAtRow_(sheet, rowIndex);
  var next = (job.status || "active").toLowerCase() === "active" ? "hidden" : "active";
  return updateJob_(id, { status: next });
}

function readJobsFromSheet_() {
  var sheet = getJobsSheet_();
  var values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) return [];

  var headerRow = normalizeHeaders_(values[0]);
  var jobs = [];

  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (!row || !row.length) continue;
    var job = rowValuesToJob_(headerRow, row, r + 1);
    if (!job.title && !job.id) continue;
    if (!job.id) job.id = "row-" + (r + 1);
    if (!job.status) job.status = "active";
    jobs.push(job);
  }

  return jobs;
}

function getJobsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(JOBS_SHEET);
  if (!sheet) {
    throw new Error('Sheet tab "' + JOBS_SHEET + '" not found.');
  }
  return sheet;
}

function ensureAdminsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(ADMINS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(ADMINS_SHEET);
    sheet.appendRow(["username", "password_hash", "active"]);
  }
}

function findAdmin_(username) {
  ensureAdminsSheet_();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ADMINS_SHEET);
  var values = sheet.getDataRange().getValues();
  var want = String(username).trim().toLowerCase();

  for (var r = 1; r < values.length; r++) {
    var rowUser = String(values[r][0] || "").trim().toLowerCase();
    if (rowUser === want) {
      return {
        username: rowUser,
        password_hash: String(values[r][1] || "").trim(),
        active: parseActive_(values[r][2]),
      };
    }
  }
  return null;
}

function parseActive_(value) {
  if (value === true || value === 1) return true;
  var s = String(value || "").trim().toLowerCase();
  return s === "true" || s === "yes" || s === "1";
}

function hashPassword_(password) {
  var salt = PropertiesService.getScriptProperties().getProperty("PASSWORD_SALT");
  if (!salt) {
    throw new Error("PASSWORD_SALT is not set. Run generateScriptSecrets() first.");
  }
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    salt + String(password),
    Utilities.Charset.UTF_8
  );
  return bytes
    .map(function (b) {
      var v = b < 0 ? b + 256 : b;
      return ("0" + v.toString(16)).slice(-2);
    })
    .join("");
}

function createSessionToken_(username) {
  var secret = PropertiesService.getScriptProperties().getProperty("SESSION_SECRET");
  if (!secret) {
    throw new Error("SESSION_SECRET is not set. Run generateScriptSecrets() first.");
  }
  var token = Utilities.getUuid() + Utilities.getUuid();
  var cache = CacheService.getScriptCache();
  var payload = JSON.stringify({
    username: username,
    exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
  });
  cache.put("sess:" + token, payload, SESSION_HOURS * 60 * 60);
  return token;
}

function requireSession_(token) {
  if (!token) return null;
  var cache = CacheService.getScriptCache();
  var raw = cache.get("sess:" + token);
  if (!raw) return null;
  try {
    var data = JSON.parse(raw);
    if (!data || !data.username || !data.exp || Date.now() > data.exp) {
      revokeToken_(token);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

function revokeToken_(token) {
  if (!token) return;
  CacheService.getScriptCache().remove("sess:" + token);
}

function isLoginLocked_(username) {
  var cache = CacheService.getScriptCache();
  var count = parseInt(cache.get("fail:" + username) || "0", 10);
  return count >= MAX_LOGIN_FAILURES;
}

function recordLoginFailure_(username) {
  var cache = CacheService.getScriptCache();
  var key = "fail:" + username;
  var count = parseInt(cache.get(key) || "0", 10) + 1;
  cache.put(key, String(count), LOGIN_LOCK_MINUTES * 60);
}

function clearLoginFailures_(username) {
  CacheService.getScriptCache().remove("fail:" + username);
}

function parsePostBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Missing POST body.");
  }
  return JSON.parse(e.postData.contents);
}

function normalizeHeaders_(row) {
  return row.map(function (h) {
    return String(h || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
  });
}

function rowValuesToJob_(headerRow, row, rowNumber) {
  var job = {};
  for (var c = 0; c < headerRow.length; c++) {
    var key = headerRow[c];
    if (!key) continue;
    var val = row[c];
    if (key === "created_at" && val instanceof Date) {
      job[key] = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } else if (key === "status") {
      job[key] = val === "" || val === null || val === undefined ? "active" : String(val).trim();
    } else {
      job[key] = val === "" || val === null || val === undefined ? "" : String(val).trim();
    }
  }
  return job;
}

function findJobRowIndex_(sheet, id) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return -1;
  var headerRow = normalizeHeaders_(values[0]);
  var idCol = headerRow.indexOf("id");
  if (idCol === -1) return -1;

  for (var r = 1; r < values.length; r++) {
    if (String(values[r][idCol] || "").trim() === String(id).trim()) {
      return r + 1;
    }
  }
  return -1;
}

function readJobAtRow_(sheet, rowIndex) {
  var values = sheet.getRange(rowIndex, 1, 1, JOB_HEADERS.length).getValues()[0];
  return rowValuesToJob_(JOB_HEADERS, values, rowIndex);
}

function jobToRow_(id, job, keepCreatedAt) {
  var created = keepCreatedAt && job.created_at ? job.created_at : todayIso_();
  return [
    id,
    String(job.title || "").trim(),
    String(job.company || "").trim(),
    String(job.location || "").trim(),
    String(job.job_type || "").trim(),
    String(job.industry || "").trim(),
    String(job.description || "").trim(),
    job.apply_email ? String(job.apply_email).trim() : "",
    String(job.status || "active").trim(),
    created,
  ];
}

function rowToJob_(row) {
  var job = {};
  for (var i = 0; i < JOB_HEADERS.length; i++) {
    job[JOB_HEADERS[i]] = row[i] === undefined || row[i] === null ? "" : String(row[i]);
  }
  return job;
}

function generateJobId_() {
  return "job-" + new Date().getTime();
}

function todayIso_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function sortJobsNewestFirst_(a, b) {
  var da = a.created_at ? new Date(a.created_at).getTime() : 0;
  var db = b.created_at ? new Date(b.created_at).getTime() : 0;
  return db - da;
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
