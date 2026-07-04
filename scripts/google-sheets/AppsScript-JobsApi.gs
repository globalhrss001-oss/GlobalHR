/**
 * Global HR — Jobs API + Admin auth (Google Sheets CMS)
 *
 * SETUP (client Google account):
 * 1. Spreadsheet tabs: Jobs, Admins, Leads
 * 2. Script properties: SESSION_SECRET, PASSWORD_SALT (run generateScriptSecrets once)
 * 3. Run setupAdminPassword("username", "password") for each staff account (max 3)
 * 4. Deploy → Web app → Execute as: Me → Who has access: Anyone
 * 5. Copy /exec URL into js/cms-config.js on the website
 */

var JOBS_SHEET = "Jobs";
var ADMINS_SHEET = "Admins";
var LEADS_SHEET = "Leads";
var SESSION_HOURS = 12;
var MAX_LOGIN_FAILURES = 5;
var LOGIN_LOCK_MINUTES = 15;
var MAX_LEADS_PER_EMAIL_PER_HOUR = 3;

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

var LEAD_HEADERS = [
  "id",
  "name",
  "email",
  "phone",
  "source",
  "campaign",
  "consent",
  "created_at",
  "status",
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

    if (action === "lead" || action === "subscribe") {
      return jsonResponse_(handleLeadSubmit_(body));
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

/**
 * Public marketing signup — no login required.
 * POST body: { action: "lead", name?, email?, phone?, source?, campaign?, consent?, _hp? }
 * Honeypot: if _hp is non-empty, returns ok without saving (spam trap).
 */
function handleLeadSubmit_(body) {
  body = body || {};

  if (String(body._hp || body.website || "").trim()) {
    return { ok: true, lead: { id: "ignored" } };
  }

  var name = sanitizeLeadField_(body.name, 120);
  var email = normalizeEmail_(body.email);
  var phone = normalizePhone_(body.phone);
  var source = sanitizeLeadField_(body.source, 64) || "website";
  var campaign = sanitizeLeadField_(body.campaign, 128);
  var consent = parseConsent_(body.consent);

  if (!name && !email && !phone) {
    return { ok: false, error: "Please enter at least your name, email, or phone." };
  }
  if (email && !isValidEmail_(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (phone && phone.replace(/\D/g, "").length > 0 && phone.replace(/\D/g, "").length < 6) {
    return { ok: false, error: "Please enter a valid phone number." };
  }
  if (!consent) {
    return { ok: false, error: "Please agree to be contacted about jobs and services." };
  }

  var rateKey = email || phone.replace(/\D/g, "") || name.toLowerCase();
  if (isLeadRateLimited_(rateKey)) {
    return { ok: false, error: "Too many signups. Please try again later." };
  }
  if (email && findLeadByEmail_(email)) {
    return { ok: false, error: "This email is already registered for updates." };
  }

  var lead = createLead_({
    name: name,
    email: email,
    phone: phone,
    source: source,
    campaign: campaign,
    consent: "yes",
    status: "new",
  });

  recordLeadSubmission_(rateKey);
  return { ok: true, lead: lead };
}

function createLead_(lead) {
  ensureLeadsSheet_();
  var sheet = getLeadsSheet_();
  var id = generateLeadId_();
  var row = leadToRow_(id, lead);
  sheet.appendRow(row);
  return rowToLead_(row);
}

function ensureLeadsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LEADS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(LEADS_SHEET);
    sheet.appendRow(LEAD_HEADERS);
    formatLeadsPhoneColumn_(sheet);
    return;
  }

  var firstRow = sheet.getRange(1, 1, 1, LEAD_HEADERS.length).getValues()[0];
  var headers = normalizeHeaders_(firstRow);
  var needsHeader = false;
  for (var i = 0; i < LEAD_HEADERS.length; i++) {
    if (headers[i] !== LEAD_HEADERS[i]) {
      needsHeader = true;
      break;
    }
  }
  if (needsHeader && sheet.getLastRow() === 0) {
    sheet.appendRow(LEAD_HEADERS);
  }

  formatLeadsPhoneColumn_(sheet);
  ensureLeadsNameColumn_(sheet);
}

function ensureLeadsNameColumn_(sheet) {
  if (!sheet || sheet.getLastRow() < 1) return;
  var colCount = Math.max(sheet.getLastColumn(), LEAD_HEADERS.length);
  var headers = normalizeHeaders_(sheet.getRange(1, 1, 1, colCount).getValues()[0]);
  if (headers.indexOf("name") !== -1) return;
  sheet.insertColumnAfter(1);
  sheet.getRange(1, 2).setValue("name");
}

function formatLeadsPhoneColumn_(sheet) {
  var phoneCol = LEAD_HEADERS.indexOf("phone") + 1;
  if (phoneCol < 1) return;
  sheet.getRange(2, phoneCol, sheet.getMaxRows(), 1).setNumberFormat("@");
}

function getLeadsSheet_() {
  ensureLeadsSheet_();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEADS_SHEET);
  if (!sheet) {
    throw new Error('Sheet tab "' + LEADS_SHEET + '" not found.');
  }
  return sheet;
}

function findLeadByEmail_(email) {
  var sheet = getLeadsSheet_();
  var values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) return null;

  var headerRow = normalizeHeaders_(values[0]);
  var emailCol = headerRow.indexOf("email");
  if (emailCol === -1) return null;

  var want = normalizeEmail_(email);
  for (var r = 1; r < values.length; r++) {
    if (normalizeEmail_(values[r][emailCol]) === want) {
      return { row: r + 1, email: want };
    }
  }
  return null;
}

function isLeadRateLimited_(key) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "lead:rate:" + String(key || "").toLowerCase();
  var count = parseInt(cache.get(cacheKey) || "0", 10);
  return count >= MAX_LEADS_PER_EMAIL_PER_HOUR;
}

function recordLeadSubmission_(key) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "lead:rate:" + String(key || "").toLowerCase();
  var count = parseInt(cache.get(cacheKey) || "0", 10) + 1;
  cache.put(cacheKey, String(count), 60 * 60);
}

function normalizeEmail_(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function normalizePhone_(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

/** Sheets treats leading + as a formula — store as plain text. */
function phoneForSheet_(phone) {
  phone = normalizePhone_(phone);
  if (!phone) return "";
  if (phone.charAt(0) === "+" || phone.charAt(0) === "=" || phone.charAt(0) === "-") {
    return "'" + phone;
  }
  return phone;
}

function phoneFromSheet_(value) {
  var phone = String(value || "").trim();
  if (phone.charAt(0) === "'") phone = phone.slice(1);
  return normalizePhone_(phone);
}

function sanitizeLeadField_(value, maxLen) {
  var text = String(value || "")
    .trim()
    .replace(/[\r\n\t]+/g, " ");
  if (!text) return "";
  if (text.length > maxLen) text = text.slice(0, maxLen);
  return text;
}

function parseConsent_(value) {
  if (value === true || value === 1) return true;
  var s = String(value || "")
    .trim()
    .toLowerCase();
  return s === "yes" || s === "true" || s === "1" || s === "on";
}

function leadToRow_(id, lead) {
  return [
    id,
    sanitizeLeadField_(lead.name, 120),
    normalizeEmail_(lead.email),
    phoneForSheet_(lead.phone),
    sanitizeLeadField_(lead.source, 64) || "website",
    sanitizeLeadField_(lead.campaign, 128),
    lead.consent ? "yes" : "no",
    nowIso_(),
    sanitizeLeadField_(lead.status, 32) || "new",
  ];
}

function rowToLead_(row) {
  var lead = {};
  for (var i = 0; i < LEAD_HEADERS.length; i++) {
    var val = row[i] === undefined || row[i] === null ? "" : String(row[i]);
    if (LEAD_HEADERS[i] === "phone") val = phoneFromSheet_(val);
    lead[LEAD_HEADERS[i]] = val;
  }
  return lead;
}

function generateLeadId_() {
  return "lead-" + new Date().getTime();
}

function nowIso_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

/** Run from Apps Script editor to verify the Leads tab and API logic. */
function testSubmitLead() {
  var result = handleLeadSubmit_({
    name: "Test User",
    email: "test-lead+" + new Date().getTime() + "@example.com",
    phone: "+65 9123 4567",
    source: "script-test",
    campaign: "manual",
    consent: "yes",
  });
  Logger.log(JSON.stringify(result));
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
