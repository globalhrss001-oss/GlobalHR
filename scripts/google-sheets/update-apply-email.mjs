/**
 * Update apply_email on all jobs in the sheet.
 * Usage: node scripts/google-sheets/update-apply-email.mjs
 */

const API_URL =
  "https://script.google.com/macros/s/AKfycbwKXVygBVz18kK5ezEhSC3rAHFbnXxUbVxNnpUo-onByd1A4HvWvhX1utn494UZcY3Idg/exec";

const USERNAME = process.env.GLOBALHR_ADMIN_USER || "admin";
const PASSWORD = process.env.GLOBALHR_ADMIN_PASS || "Globalhr2026";
const NEW_EMAIL = process.env.GLOBALHR_APPLY_EMAIL || "apply@globalhrss.com";

async function post(action, payload, token) {
  const body = { action, ...payload };
  if (token && action !== "login") body.token = token;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
    redirect: "follow",
  });

  const text = await res.text();
  const data = JSON.parse(text);
  if (!data || data.ok !== true) {
    throw new Error((data && data.error) || `Request failed: ${action}`);
  }
  return data;
}

async function main() {
  const login = await post("login", { username: USERNAME, password: PASSWORD });
  const token = login.token;
  const list = await post("list", {}, token);
  const jobs = list.jobs || [];

  for (const job of jobs) {
    if ((job.apply_email || "").trim() === NEW_EMAIL) {
      console.log("Skip (already set):", job.id, job.title);
      continue;
    }
    console.log("Updating:", job.id, job.title);
    await post("update", { id: job.id, job: { apply_email: NEW_EMAIL } }, token);
  }

  console.log("Done. All jobs now use", NEW_EMAIL);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
