# DeepScan – System Architecture  
*(DeepSeek-only, Milestone 1 and beyond)*  

## 1  Purpose  
DeepScan is a web application that lets job-seekers upload a resume, chat with an AI about improvements, and receive an ATS-friendly rewrite plus rationale.  
The stack is deliberately simple:

* **Front-end** – static Single-Page App (React + Vite).  
* **Back-end** – minimal Node 18 / Express API that proxies requests to **DeepSeek**.  
* **LLM provider** – DeepSeek’s `deepseek-chat` (for general rewriting) or `deepseek-reasoner` (for step-by-step rationales).  No OpenAI dependency as cost are to high. 

---

## 2  High-Level Component Diagram
┌───────────────────────┐ HTTPS ┌──────────────────────┐
│ Browser │ ───────────────────────▶│ Front-End (Vite) │
│ · Upload résumé │ │ · React components │
│ · Chat UI │ ←─────────SSE────────── │ · Tailwind styles │
└───────────────────────┘ streaming edits └────────────┬─────────┘
│ fetch /api/chat
▼
┌───────────────────┐
│ Back-End (Express)│
│ · /api/chat │
│ · resumeParser │
└────────┬──────────┘
│ JSON
▼
┌───────────────────┐
│ DeepSeek API │
│ deepseek-chat │
└───────────────────┘
## 3  Repository / Folder Structure
DeepScan/
│
├── frontend/ # Vite + React SPA
│ ├── public/
│ └── src/
│ ├── components/ # ChatWindow, ResumeUpload, FeedbackPanel…
│ ├── pages/ # Home.jsx
│ ├── App.jsx
│ └── main.jsx
│
├── backend/ # Node 18 / Express API
│ ├── src/
│ │ ├── routes/
│ │ │ └── chat.js
│ │ ├── services/
│ │ │ └── deepseekClient.js
│ │ ├── utils/
│ │ │ └── resumeParser.js
│ │ └── app.js
│ ├── package.json
│ └── .env.example # DEEPSEEK_API_KEY, DEEPSEEK_MODEL, PORT
│
├── docs/
│ ├── architecture.md
│ └── research/ # competitor PDFs
│
├── .gitignore
└── README.md

## 4  Front-End Details  

| Concern     | Decision |
|-------------|----------|
| Framework   | **React 18** via Vite (fast dev server, simple build). |
| Styling     | **Tailwind CSS** utilities. |
| State       | Local component state; no global store yet. |
| File upload | Native `<input type="file">` → client converts PDF/DOCX to plain text or sends raw file to back-end. |
| Streaming   | Browser consumes `/api/chat` via **EventSource** (SSE) for real-time token display. |

---

## 5  Back-End Details  

| Concern          | Decision |
|------------------|----------|
| Runtime          | **Node 18** on Vercel/Netlify serverless function or small container. |
| Framework        | **Express** (minimal). |
| Primary route    | `POST /api/chat` → body `{ resume, field }`. |
| DeepSeek client  | `deepseekClient.js` wraps fetch to `https://api.deepseek.com/v1/chat/completions`. |
| Resume parsing   | `resumeParser.js` (placeholder) – integrates `pdf-parse`, `mammoth` (DOCX), and SpaCy for skill extraction. |
| Streaming proxy  | Reads the DeepSeek response stream and forwards as SSE. |
| Security         | API key stored only in host-level env vars; never shipped to client; CORS locked to site origin. |

---

## 6  Data Flow (Request Lifecycle)

1. **User** selects résumé file in the browser.  
2. **Front-End** sends `{resumePlainText, desiredField}` to `/api/chat`.  
3. **Back-End** validates input (≤ 16 k chars), constructs DeepSeek prompt.  
4. **DeepSeek** streams revised résumé + rationale tokens.  
5. **Back-End** pipes the stream to the browser via SSE.  
6. **Front-End** updates chat window and highlights differences live.

---

## 7  Deployment Pipeline  

| Stage            | Tool / Service |
|------------------|----------------|
| Source control   | GitHub repo **BryceLucas/DeepScan**. |
| Continuous CI    | GitHub Actions → builds both `frontend` and `backend`. |
| Preview deploy   | Vercel Preview URLs on every PR. |
| Production       | Merge into `main` triggers build → `https://deepscan.ai` (Vercel or Netlify). |
| Env variables    | `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL=deepseek-chat`, `NEXT_PUBLIC_API_BASE`. |

---

## 8  Environment Variables Example
```env
# backend/.env (never commit this file)
DEEPSEEK_API_KEY=sk-***********************
DEEPSEEK_MODEL=deepseek-chat
PORT=3000
