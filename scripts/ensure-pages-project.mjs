import { appendFileSync } from 'node:fs';

// Create the Pages target on the first workflow run, then reuse it on later pushes.
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const projectName = process.env.CLOUDFLARE_PAGES_PROJECT || 'emi-calci-utility';
if (!accountId || !apiToken) throw new Error('Cloudflare account credentials are required.');

const apiRoot = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`;
const headers = { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' };
let response = await fetch(`${apiRoot}/${encodeURIComponent(projectName)}`, { headers });

if (response.status === 404) {
  response = await fetch(apiRoot, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: projectName, production_branch: 'main' })
  });
}

const result = await response.json();
if (!response.ok || !result.success) {
  throw new Error(`Cloudflare Pages project setup failed (HTTP ${response.status}). Check the Pages Edit token and project name.`);
}

const subdomain = result.result?.subdomain;
if (!subdomain) throw new Error('Cloudflare did not return the Pages project hostname.');
const canonicalOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim() || `https://${subdomain}`;

// Pass the real Pages hostname into Next.js at build time so SEO URLs are correct on first deploy.
if (process.env.GITHUB_ENV) appendFileSync(process.env.GITHUB_ENV, `NEXT_PUBLIC_SITE_URL=${canonicalOrigin}\n`);
process.stdout.write(`Pages project ready: ${projectName}\n`);
