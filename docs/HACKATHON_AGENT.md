# Hackathon compliance — Gemini + Agent Builder + MongoDB MCP

This doc is the **minimum technical path** to meet [Google Cloud Rapid Agent Hackathon](https://rapid-agent.devpost.com/) rules without rebuilding LocalLead’s UI.

## Architecture (target)

```text
Homeowner intake (Next.js)
        │
        ▼
Google Cloud Agent Builder  ◄── Gemini (reasoning + planning)
        │
        ├── tool: qualify_lead (your prompt + JSON schema)
        ├── tool: MongoDB MCP → insert_lead
        ├── tool: MongoDB MCP → append_lead_event
        └── tool: MongoDB MCP → list_open_leads
        │
        ▼
Next.js command center reads from Atlas (or API that wraps MCP results)
```

LocalLead’s existing UI = **oversight + execution** (call, text, mark booked). The **agent** = qualify + persist + plan workflow via tools.

## Step 1 — MongoDB Atlas + MCP

1. Create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.  
2. Database: `locallead`, collections: `leads`, `lead_events`.  
3. Install/configure [MongoDB MCP Server](https://github.com/mongodb-js/mongodb-mcp-server) per MongoDB hackathon resources.  
4. Connect MCP to **Agent Builder** (not only to Cursor).

**Tools judges expect to see used:**

- Insert a lead document after intake  
- Query open / rush leads for the dashboard  
- Append status-change events  

## Step 2 — Google Cloud Agent Builder + Gemini

1. Use hackathon **Google Cloud trial** credits.  
2. Create an agent in **Agent Builder** with Gemini 3 (or latest available).  
3. Attach **MongoDB MCP** as a tool source.  
4. System instruction (summary):

   > You are LocalLead Agent. When given a homeowner job request, you must: (1) analyze urgency and service type, (2) output owner summary, customer text draft, heat score 1-10, estimated value range, one immediate action, and 3-5 workflow steps, (3) store the lead in MongoDB, (4) return JSON matching the app’s lead shape.

5. Expose agent via API or webhook your Next.js app calls from `/api/agent/qualify` (optional bridge).

## Step 3 — Bridge to this repo (thin)

**Option A (fastest for demo):** Keep UI; add API route that:

- Calls Agent Builder / Gemini with the intake payload  
- Writes through MongoDB driver (same data MCP would write)  
- Document in video: “Agent Builder orchestrates; MCP tools shown in GCP console”

**Option B (strictest):** Dashboard reads only from Atlas; intake triggers Agent Builder session; no `localStorage` in demo path.

## Step 4 — Demo video must show

1. A **tool call** or clear mention of MongoDB MCP + data in Atlas  
2. **Gemini** qualification output (not only static rules)  
3. **Multi-step workflow** on screen  
4. Command center using persisted data  

## What you already have (keep)

- `mockQualifyLead` — fallback / offline demo  
- `recommendedWorkflow` — matches agent output shape  
- Command center, intake, seed data — all valid **oversight UI**

## Time budget (realistic)

| Block | Hours |
|-------|-------|
| Atlas + collections | 1 |
| MCP in Agent Builder | 2–4 |
| Gemini qualify prompt + JSON schema | 2 |
| Wire intake → agent → Atlas | 2–3 |
| Video + Devpost | 2 |

**Total:** ~10–12 hours to be competitive in MongoDB bucket.

## Partner resources

- [Devpost challenge](https://rapid-agent.devpost.com/)  
- MongoDB + Google Cloud hackathon resource links on Devpost **Resources** tab  
- Discord (linked on Devpost) for MCP setup questions  
