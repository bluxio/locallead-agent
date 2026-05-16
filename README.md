# LocalLead Agent

AI-powered lead qualification and follow-up dashboard for home-service businesses, built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

| | |
|---|---|
| **GitHub** | [github.com/bluxio/locallead-agent](https://github.com/bluxio/locallead-agent) |
| **Live demo** | Deploy on Vercel (see below), then add your URL here |

LocalLead Agent helps **local trades** (HVAC, plumbing, roofing, electrical, and more) **capture homeowner requests**, **summarize urgency and value**, and **work leads on one command center**—in the browser for this MVP.

Run from `locadle-agent/`:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What it does

1. **Homeowner intake** — trade, location, urgency, contact preference, and job details.  
2. **Owner packet** — alert copy, customer text draft, heat score, estimated value, and recommended next step (rules-based today; same shape for AI later).  
3. **Command center** — today’s priority, metrics, charts, rush/new queues, and a full lead table with call, text, booking link, and status updates.

Data stays in **this browser** (`localStorage`). No sign-in, no SMS sent, no backend required for the MVP.

## Demo script (~3 minutes)

Use this flow when recording for recruiters or a hackathon:

1. **Landing page** (`/`)  
   - Point to the hero: win the first five minutes after a lead.  
   - Click **Log a job request**.

2. **Submit an urgent HVAC lead** (`/demo`)  
   - Example: *Jordan Martinez*, Plano TX, **Emergency / same day**, HVAC, text preferred.  
   - Description: upstairs AC not cooling since last night.  
   - Show the **owner preview** updating on the right (desktop).  
   - Click **Generate lead packet**.

3. **Owner alert + auto-text** (success screen)  
   - Read the **Owner alert** and **Customer auto-text** (not sent—preview only).  
   - Call out **Recommended next action** and heat score.

4. **Command center** (`/dashboard`)  
   - Click **Open command center**.  
   - **Today’s priority** should surface your new lead (or the hottest rush job).  
   - Note sample jobs (Plano, Dallas, Frisco, McKinney) if the board was empty before.

5. **Text customer**  
   - On the priority panel or table row, click **Text customer** (opens the device SMS app with a draft).  
   - Mention production would send via Twilio from your business number.

6. **Mark booked**  
   - Click **Mark contacted**, then **Mark booked**.  
   - Refresh the page—status and activity should persist.

7. **Close**  
   - Optional: filter by status or search by city/name.  
   - Say next step: Supabase persistence + Twilio + OpenAI on the same UX.

## Screenshots (add before sharing)

| Screen | Suggested file |
|--------|----------------|
| Landing hero | `docs/screenshots/home-hero.png` |
| Intake + live preview | `docs/screenshots/demo-intake.png` |
| Lead packet success | `docs/screenshots/demo-packet.png` |
| Today’s priority | `docs/screenshots/dashboard-priority.png` |
| Full command center | `docs/screenshots/dashboard-full.png` |

## Sample data

On first visit with an empty board, the app loads **six realistic North Texas sample jobs** (HVAC, plumbing, roofing, electrical across Plano, Dallas, Frisco, McKinney, Allen, Richardson).  
**New submissions are prepended** and appear alongside samples.

To reset: clear site data for localhost in your browser, then reload.

## Scripts

```bash
npm run lint
npm run build
npm run start   # production server after build
```

## Deploy (Vercel)

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import** the GitHub repo `bluxio/locallead-agent`.
3. Framework should auto-detect **Next.js** — leave defaults, click **Deploy**.
4. Copy the production URL (e.g. `https://locallead-agent.vercel.app`) into this README and your resume.

Optional CLI (after `vercel login`):

```bash
cd locadle-agent
npx vercel --prod
```

## Stack

Next.js App Router · TypeScript · Tailwind v4 · shadcn/ui · localStorage

## Out of scope (by design)

Authentication · payments · real Twilio · real OpenAI · multi-tenant backend

## Future (same UX)

- **OpenAI** — replace `mockQualifyLead()` with an API returning the same fields.  
- **Supabase** — persist leads and activity per company.  
- **Twilio** — send owner alerts and customer texts from the command center actions.
