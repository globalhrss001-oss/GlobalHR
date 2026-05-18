/**
 * Global HR — Jobs API (Google Sheets CMS)
 *
 * SETUP:
 * 1. Create a Google Sheet with tab name: Jobs
 * 2. Row 1 = headers (see jobs-sheet-template.csv in this repo)
 * 3. Paste this file into Extensions → Apps Script
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL (ends with /exec) for the website
 */

var SHEET_NAME = "Jobs";

var HEADERS = [
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
    var statusFilter = (params.status || "active").toLowerCase();

    if (statusFilter && statusFilter !== "all") {
      jobs = jobs.filter(function (job) {
        return (job.status || "").toLowerCase() === statusFilter;
      });
    }

    jobs.sort(function (a, b) {
      var da = a.created_at ? new Date(a.created_at).getTime() : 0;
      var db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });

    return jsonResponse_({ ok: true, jobs: jobs });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err.message || err) });
  }
}

function readJobsFromSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet tab "' + SHEET_NAME + '" not found. Create a tab named Jobs.');
  }

  var values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) {
    return [];
  }

  var headerRow = values[0].map(function (h) {
    return String(h || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
  });

  var jobs = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (!row || !row.length) continue;

    var job = {};
    for (var c = 0; c < headerRow.length; c++) {
      var key = headerRow[c];
      if (!key) continue;
      var val = row[c];
      if (key === "created_at" && val instanceof Date) {
        job[key] = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        job[key] = val === "" || val === null || val === undefined ? "" : String(val).trim();
      }
    }

    if (!job.title && !job.id) continue;
    if (!job.id) job.id = "row-" + (r + 1);
    if (!job.status) job.status = "active";
    jobs.push(job);
  }

  return jobs;
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
