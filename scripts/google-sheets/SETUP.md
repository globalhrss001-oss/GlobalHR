# Google Sheets CMS — Setup (client account)

Do this on the **client Google account** (e.g. `Globalhrss001@gmail.com`), not a personal developer account.

## 1. Create the spreadsheet

1. Google Drive → **New** → **Google Sheets**
2. Name: `Global HR - Jobs CMS`
3. Create two tabs: **Jobs** and **Admins**

## 2. Jobs tab

Copy row 1 headers from [`jobs-sheet-template.csv`](jobs-sheet-template.csv):

`id | title | company | location | job_type | industry | description | apply_email | status | created_at`

For production, leave data rows empty (or add real jobs only). Set `status` to `active` or `hidden`.

## 3. Admins tab (max 3 staff)

Copy row 1 headers from [`admins-sheet-template.csv`](admins-sheet-template.csv):

`username | password_hash | active`

- Do **not** type real passwords in the sheet.
- Developer runs `setupAdminPassword()` to fill `password_hash`.
- Set `active` to `FALSE` to disable an account without deleting it.

## 4. Install Apps Script

1. **Extensions** → **Apps Script**
2. Replace default code with [`AppsScript-JobsApi.gs`](AppsScript-JobsApi.gs)
3. Save the project

## 5. Script properties (one-time)

In **Project Settings** → **Script properties**, run `generateScriptSecrets()` from the editor first (creates both properties), or add manually:

| Property | Purpose |
|----------|---------|
| `SESSION_SECRET` | Random long string for session tokens |
| `PASSWORD_SALT` | Random salt for password hashing |

## 6. Set staff passwords (one-time)

In the Apps Script editor, run for each user (max 3):

```javascript
setupAdminPassword("josephine", "YourSecurePassword123");
```

Communicate passwords to staff privately. Never store plain passwords in the sheet or GitHub.

## 7. Deploy Web App

1. **Deploy** → **New deployment** → **Web app**
2. **Execute as:** Me (spreadsheet owner)
3. **Who has access:** Anyone
4. Copy the **Web App URL** (ends with `/exec`)
5. Send URL to developer → update `js/cms-config.js` → `GLOBAL_HR_CMS_API_URL`

After any script change: **Manage deployments** → **Edit** → **New version** → **Deploy**.

## 8. Verify

1. Open `https://www.globalhrss.com/admin/`
2. Sign in with username + password
3. Add a test job → set `active` → check `/jobs.html` (hard refresh; cache ~10 min)
4. Hide/delete test job from dashboard

### Go live (replace demo rows)

If the Jobs tab still has `demo-001` … `demo-006` from an old template import, run once from the project folder:

```bash
node scripts/google-sheets/seed-live-jobs.mjs
```

Optional env vars: `GLOBALHR_ADMIN_USER`, `GLOBALHR_ADMIN_PASS`. The script deletes `demo-*` rows and creates live listings with `job-*` ids. Edit listings anytime in `/admin/`.

## 9. Clean up (after handover)

- Cancel old Supabase project (if used)
- Remove old Apps Script deployment on non-client Google accounts
