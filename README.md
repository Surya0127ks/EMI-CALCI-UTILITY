# EMICalc Pro

A static, client-side loan EMI calculator built with Next.js App Router, TypeScript and Tailwind CSS. The calculator supports home, car and personal loan scenarios, monthly and annual amortization views, CSV export, prepayment estimates, local input persistence and share/copy actions. No calculator inputs are sent to a backend.

## Requirements

- Node.js 18.17 or later and npm
- A real production domain before publishing
- (Optional) an approved Google AdSense publisher account and ad-unit IDs

## Configure the site

1. In `src/lib/config.ts`, update `SITE_NAME`, `DOMAIN` (include `https://`; a trailing slash is fine) and `CONTACT_EMAIL`. Canonical links, metadata and sitemap URLs use these constants.
2. Copy `.env.example` to `.env.local` for local development or set the variables in Cloudflare Pages. Leave the AdSense values blank until you have real account IDs.
3. In AdSense, add and verify your production domain. Create the three responsive display ad units and set `NEXT_PUBLIC_ADSENSE_CLIENT` to your `ca-pub-...` publisher ID. Set `NEXT_PUBLIC_ADSENSE_SLOT_TOOL`, `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT` and `NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM` to their 10-digit ad-unit IDs. The example IDs are intentionally blank, so no invalid ad request is made.
4. Replace the publisher placeholder in `public/ads.txt` with your AdSense `pub-...` ID. Google requires the publisher ID to match this file for ads.txt authorization. Update the file and environment values together before rebuilding. Without an approved AdSense account and real unit IDs, the site deliberately displays no ads.
5. In AdSense **Privacy & messaging**, configure and publish the consent messages required for your traffic regions. Google requires a certified CMP integrated with IAB TCF to serve personalized ads in the EEA, UK and Switzerland. The site's basic Accept/Reject preference gate does not replace a certified CMP. Ads are requested only after this site's visitor accepts.
4. Review the legal pages and replace the sample contact address and any policy details that do not reflect your organization.

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build and deploy

```sh
npm run build
```

The `output: 'export'` setting writes a static site to `out/`. Deploy the contents of `out/` to Cloudflare Pages or Vercel as a static site. No Next.js server or API routes are required. Configure the same `NEXT_PUBLIC_ADSENSE_CLIENT` build variable in the hosting environment before building if ads are enabled. The generated `sitemap.xml`, `robots.txt`, `ads.txt` and static route directories are included in the export.

For Cloudflare Pages, push the project to a GitHub repository, then connect it in **Workers & Pages → Create application → Pages → Import an existing Git repository**. Select **Next.js (Static HTML Export)** as the framework preset. Use `npx next build` as the build command and `out` as the output directory, matching Cloudflare's current static-export guide. Every deployment rebuilds the static pages, sitemap and robots file. In Pages settings, set the production `NEXT_PUBLIC_ADSENSE_*` variables before building. Add the site's custom domain in Pages and ensure `DOMAIN` in `src/lib/config.ts` matches the canonical public URL. The `public/_headers` file adds security headers and long caching only for hashed static assets.

For a manual static upload, first run `npm run build`, then upload the contents of `out/` (not the source folder) to Cloudflare Pages. Do not use Workers' Next.js SSR adapter for this static export.

For Vercel, keep the project framework as Next.js, retain the static export configuration, and deploy the generated export.

## Privacy behavior

Loan inputs, theme and consent choice are kept in browser localStorage. Calculations and CSV generation run on the device. The optional AdSense script is not inserted unless affirmative consent is stored. Visitors can reopen the choice from the footer’s **Ad preferences** link. The contact form opens the visitor’s email app using `mailto:` and does not submit data to this site.
