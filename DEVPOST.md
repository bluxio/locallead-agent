# Devpost submission — Google Cloud Rapid Agent Hackathon

**Track:** MongoDB  
**Repo:** https://github.com/bluxio/locallead-agent  
**Live URL:** _add after Vercel deploy_

---

## Honest fit check (read this first)

| Requirement | LocalLead today | To qualify |
|-------------|-----------------|------------|
| Functional **agent** (not just chat) | ✅ Multi-step qualify → workflow → ops UI | Keep; emphasize in video |
| **Gemini** reasoning | ⚠️ Rules-based `mockQualifyLead` | Add Gemini API route or Agent Builder agent |
| **Google Cloud Agent Builder** | ❌ Not wired yet | Agent orchestration in GCP (see `docs/HACKATHON_AGENT.md`) |
| **Partner MCP** (MongoDB) | ❌ `localStorage` only | MongoDB MCP tools: store/list/update leads |
| Public repo + **license** | ✅ MIT `LICENSE` | Set license in GitHub repo **About** |
| Hosted URL + ~3 min video | ⚠️ Your action | Vercel + Loom/YouTube |

**Do not submit as-is** without Gemini + MongoDB MCP (or judges will score “Technological Implementation” low). Your UI is the **human oversight layer**; the hackathon agent lives in Agent Builder + MCP.

---

## Devpost form — copy/paste

### Project name

**LocalLead Agent**

### Tagline (one line)

AI operational agent for home-service businesses—qualifies inbound leads, prioritizes urgency, and orchestrates follow-up workflows.

### Elevator pitch (~600 chars)

LocalLead Agent helps HVAC, plumbing, roofing, and electrical crews win the first five minutes after a homeowner request. Instead of a passive CRM, it runs a **multi-step qualification mission**: analyze the job, score urgency, estimate value, draft owner alerts and customer texts, and output a **recommended workflow** (text now → same-day diagnostic → escalate rush → update the board).

Built for the **MongoDB track**: lead records and activity events persist in Atlas via the **MongoDB MCP server**, while **Gemini** powers reasoning inside **Google Cloud Agent Builder**. The Next.js command center keeps the owner in control with one-tap call, text, and status updates.

### What it does

- Captures homeowner intake (trade, location, urgency, contact preference)  
- **Agent qualifies** the lead (summary, heat 1–10, value range, next action, step-by-step workflow)  
- Surfaces **owner alert** and **customer auto-text** previews  
- **Command center**: today’s priority, KPIs, rush/new queues, searchable lead table  
- **MongoDB** stores leads and timeline events; sample DFW jobs seed an empty board  

### How we built it

- **Frontend:** Next.js, TypeScript, Tailwind, shadcn/ui (Vercel)  
- **Agent brain:** Gemini (qualification + workflow planning)  
- **Orchestration:** Google Cloud Agent Builder  
- **Superpowers:** MongoDB MCP server (Atlas) — insert lead, query open jobs, append activity events  
- **Oversight UI:** LocalLead command center for dispatchers/owners  

### Built with

- Google Gemini  
- Google Cloud Agent Builder  
- MongoDB Atlas + MongoDB MCP Server  
- Next.js  
- TypeScript  
- Tailwind CSS  

### Challenges we ran into

- Designing agent steps that feel operational (not chatbot) for non-technical trade owners  
- Keeping the oversight UI fast while the agent writes to MongoDB asynchronously  
- Framing multi-step workflows so judges see **plan → act → persist** not a single LLM reply  

### Accomplishments we're proud of

- End-to-end flow from homeowner form → agent packet → command center in one session  
- Workflow recommendations that change with urgency (e.g. no-AC in heat → same-day + 10-min callback)  
- Polished product UI suitable for client demos and recruiting  

### What we learned

- Agents win when they **change backend state** (MongoDB) and **surface next actions**, not when they only summarize text  
- Local service businesses need **speed + clarity**, not enterprise CRM complexity  

### What's next

- Twilio for real owner SMS and customer texts  
- Per-company branding and multi-tenant Atlas collections  
- Technician assignment rules on top of workflow steps  

---

## ~3 minute video script (judging criteria)

| Time | Shot | Say |
|------|------|-----|
| 0:00–0:25 | Landing | “LocalLead Agent is an AI operational assistant for home-service businesses. Problem: missed calls and slow follow-up lose jobs.” |
| 0:25–1:10 | Demo intake + preview | “A homeowner submits an urgent HVAC job. The agent qualifies it—heat score, value, owner alert, text draft, and a **multi-step workflow**.” |
| 1:10–1:45 | Success packet | “Here’s the lead packet: what the owner gets, what the customer would receive, and the recommended playbook.” |
| 1:45–2:30 | Dashboard | “Command center: today’s priority, rush queue, call/text actions, mark booked. Data lives in **MongoDB via MCP**; reasoning is **Gemini** in **Agent Builder**.” |
| 2:30–3:00 | Architecture slide | Show diagram: Intake → Agent Builder + Gemini → MongoDB MCP → Command center. “Built for the MongoDB track. Links in description.” |

**Score each criterion explicitly in narration:**

- **Tech:** Gemini + Agent Builder + MongoDB MCP (show Atlas or MCP tool call if possible)  
- **Design:** Quick pan of landing + dashboard  
- **Impact:** “Small businesses lose jobs to whoever texts back first”  
- **Idea:** “Agent + oversight UI for trades, not another generic chatbot”  

---

## MongoDB track narrative (judges)

**Problem:** Home-service SMBs lose revenue when leads sit in voicemail/text chaos.  
**Agent mission:** On new intake → (1) qualify with Gemini, (2) persist lead + event in Atlas via **MongoDB MCP**, (3) return workflow + comms copy.  
**Human control:** Command center lets the owner call, text, and move status without losing agent context.  
**Why MongoDB:** Document model fits variable job descriptions; activity arrays; geo/trade filters for “rush open in Plano.”

---

## Submission checklist

- [ ] Vercel production URL live  
- [ ] GitHub public; **About → License: MIT**  
- [ ] Video uploaded (YouTube unlisted / Loom)  
- [ ] Devpost: track = **MongoDB**  
- [ ] Gemini + Agent Builder + MongoDB MCP demonstrated in video or README  
- [ ] Register for Google Cloud trial (hackathon banner)  

---

## Links to wire in Devpost

| Field | Value |
|-------|--------|
| Hosted project | `https://YOUR-APP.vercel.app` |
| Repository | `https://github.com/bluxio/locallead-agent` |
| Demo video | `https://youtu.be/...` |
