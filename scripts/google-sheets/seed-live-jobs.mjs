/**
 * One-time helper: replace demo-* sheet rows with live job listings.
 * Usage: node scripts/google-sheets/seed-live-jobs.mjs
 * Requires network access to the deployed Apps Script Web App.
 */

const API_URL =
  "https://script.google.com/macros/s/AKfycbwKXVygBVz18kK5ezEhSC3rAHFbnXxUbVxNnpUo-onByd1A4HvWvhX1utn494UZcY3Idg/exec";

const USERNAME = process.env.GLOBALHR_ADMIN_USER || "admin";
const PASSWORD = process.env.GLOBALHR_ADMIN_PASS || "Globalhr2026";

const LIVE_JOBS = [
  {
    title: "Marine Fitter",
    company: "Jurong Shipyard (via Global HR)",
    location: "Singapore",
    job_type: "Full-time",
    industry: "Marine / Shipyard",
    description:
      "Experienced marine fitters for vessel repair and new-build projects. Must pass client interview briefing and medical checks before deployment.",
    apply_email: "apply@globalhrss.com",
    status: "active",
  },
  {
    title: "Certified Welder (6G)",
    company: "Keppel / Nakilat Projects",
    location: "Singapore",
    job_type: "Contract",
    industry: "Marine / Shipyard",
    description:
      "Welders with proven 6G certification and shipyard safety training. Pre-departure briefing and skills assessment provided by Global HR in Myanmar.",
    apply_email: "apply@globalhrss.com",
    status: "active",
  },
  {
    title: "Forklift Operator",
    company: "Sankyu Singapore",
    location: "Singapore",
    job_type: "Full-time",
    industry: "Logistics / Warehousing",
    description:
      "Licensed forklift drivers for warehouse and port operations. Selected candidates attend Global HR pre-placement briefing before mobilisation.",
    apply_email: "apply@globalhrss.com",
    status: "active",
  },
  {
    title: "Healthcare Assistant (HSS)",
    company: "Healthcare Placement Partner",
    location: "Singapore",
    job_type: "Full-time",
    industry: "Healthcare",
    description:
      "Patient-care support roles in hospital and community settings. HSS training and interview preparation available through Global HR.",
    apply_email: "apply@globalhrss.com",
    status: "active",
  },
  {
    title: "Mechanical Technician",
    company: "Industrial Client — Myanmar",
    location: "Yangon",
    job_type: "Full-time",
    industry: "Engineering",
    description:
      "Maintenance and production technicians for manufacturing plants. Interview coaching and screening support at our Yangon office.",
    apply_email: "apply@globalhrss.com",
    status: "active",
  },
  {
    title: "Scaffolding Supervisor",
    company: "Singapore Worksites",
    location: "Singapore",
    job_type: "Full-time",
    industry: "Construction",
    description:
      "Supervisors with scaffolding safety training and site leadership experience. Practical scaffolding training can be arranged before deployment.",
    apply_email: "apply@globalhrss.com",
    status: "active",
  },
];

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
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 300)}`);
  }
  if (!data || data.ok !== true) {
    throw new Error((data && data.error) || `Request failed: ${action}`);
  }
  return data;
}

function isDemoJob(job) {
  const id = String(job.id || "");
  return /^demo-/i.test(id);
}

async function main() {
  console.log("Logging in…");
  const login = await post("login", { username: USERNAME, password: PASSWORD });
  const token = login.token;
  console.log("Signed in as", login.username);

  const list = await post("list", {}, token);
  const jobs = list.jobs || [];
  console.log(`Found ${jobs.length} job(s) in sheet.`);

  const demoJobs = jobs.filter(isDemoJob);
  const liveExisting = jobs.filter((j) => !isDemoJob(j) && (j.status || "").toLowerCase() === "active");

  for (const job of demoJobs) {
    console.log("Deleting demo job:", job.id, "-", job.title);
    await post("delete", { id: job.id }, token);
  }

  if (liveExisting.length > 0) {
    console.log(`Already have ${liveExisting.length} live active job(s). Skipping create.`);
  } else {
    for (const job of LIVE_JOBS) {
      console.log("Creating:", job.title);
      const created = await post("create", { job }, token);
      console.log("  → id:", created.job && created.job.id);
    }
  }

  const verify = await fetch(`${API_URL}?status=active&_=${Date.now()}`);
  const verifyData = await verify.json();
  const active = (verifyData.jobs || []).filter((j) => (j.status || "").toLowerCase() === "active");
  const stillDemo = active.some(isDemoJob);

  console.log("\nActive jobs on public API:", active.length);
  active.forEach((j) => console.log(`  - ${j.id}: ${j.title}`));
  if (stillDemo) {
    console.warn("Warning: demo jobs still visible on public API.");
    process.exitCode = 1;
  } else {
    console.log("Done — jobs are live (no demo-* ids).");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
