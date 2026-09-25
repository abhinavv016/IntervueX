# IntervueX — Collaborative Technical Interview Platform

<div align="center">

![IntervueX Banner](https://img.shields.io/badge/IntervueX-v1.0.0-06b6d4?style=for-the-badge&logo=codeforces&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![GetStream](https://img.shields.io/badge/Stream_Video_%26_Chat-005FFF?style=for-the-badge&logo=stream&logoColor=white)
![Inngest](https://img.shields.io/badge/Inngest-FF4088?style=for-the-badge&logo=inngest&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<p align="center">
  A state-of-the-art technical interview platform featuring <b>peer-to-peer WebRTC video calling</b>, an interactive <b>Monaco code editor with remote multi-language compilation</b>, <b>real-time in-session chat</b>, and <b>event-driven user lifecycle orchestration</b>.
</p>

</div>

---

## Table of Contents

1. [Overview](#1-overview)
2. [System Architecture & Visual Flowchart](#2-system-architecture--visual-flowchart)
3. [How Everything is Connected](#3-how-everything-is-connected)
   - [A. Authentication & Security Lifecycle](#a-authentication--security-lifecycle)
   - [B. Event-Driven User Synchronization](#b-event-driven-user-synchronization)
   - [C. Interview Session Lifecycle](#c-interview-session-lifecycle)
   - [D. Remote Code Execution Pipeline](#d-remote-code-execution-pipeline)
4. [Tech Stack & Infrastructure](#4-tech-stack--infrastructure)
5. [Database Schema (Prisma ORM)](#5-database-schema-prisma-orm)
6. [API Endpoints Reference](#6-api-endpoints-reference)
7. [Frontend Architecture & Component Structure](#7-frontend-architecture--component-structure)
8. [Environment Variables Setup](#8-environment-variables-setup)
9. [Step-by-Step Installation & Local Execution](#9-step-by-step-installation--local-execution)
10. [Production Deployment & Cross-Origin Troubleshooting](#10-production-deployment--cross-origin-troubleshooting)

---

## 1. Overview

**IntervueX** is engineered for companies, interviewers, and candidates who require an authentic engineering interview environment. Rather than relying on separate third-party meeting tools and disconnected code editors, IntervueX unifies the entire workflow into a cohesive single interface:

- **Live WebRTC Video & Audio**: Crystal-clear peer audio/video with mute/unmute, camera toggle, active speaker detection, and screen sharing.
- **Monaco Code Editor**: VS Code's core editor running directly in the browser with syntax highlighting, indentation, and custom editor configurations.
- **Sandboxed Code Execution**: Run solutions in real-time across multiple programming languages through the Piston remote execution engine.
- **Real-Time Synchronized Chat**: Dedicated chat room attached to every interview session for exchanging test inputs, hints, and notes.
- **Curated Problem Catalog**: Built-in library of Data Structures & Algorithms problems categorized by topic and difficulty (`EASY`, `MEDIUM`, `HARD`).
- **Solo Practice Sandbox**: Candidates can practice problems independently before participating in live paired sessions.
- **Dynamic Active Pool**: Live session discovery where interviewers or candidates can see ongoing rooms and enter seamlessly.

---

## 2. System Architecture & Visual Flowchart

The system is architected as a modern decoupled client-server platform interacting with specialized microservices for identity, media, background event processing, and code execution:

![IntervueX System Architecture & Data Flow](assets/architecture-flowchart.jpg)

### Component Interconnection Map

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           INTERVUEX ECOSYSTEM MAP                              │
├─────────────────────┬──────────────────────────────────────────────────────────┤
│ COMPONENT           │ ROLE IN ARCHITECTURE                                     │
├─────────────────────┼──────────────────────────────────────────────────────────┤
│ 1) Client Frontend  │ React 19 SPA (Monaco Editor, Stream Video UI & Chat UI)  │
│ 2) Clerk Auth       │ Issues Session JWTs, multi-tenant sign-in & webhooks     │
│ 3) Express 5 API    │ Core REST server, route protection, session coordinator  │
│ 4) PostgreSQL DB    │ Relational store managed via Prisma 7 ORM                │
│ 5) Inngest Workers  │ Reliable asynchronous background job runner & webhook queue│
│ 6) GetStream Servers│ WebRTC video infrastructure & real-time messaging mesh   │
│ 7) Piston Sandbox   │ Multilingual code execution engine                       │
└─────────────────────┴──────────────────────────────────────────────────────────┘
```

---

## 3. How Everything is Connected

### A. Authentication & Security Lifecycle

In a decoupled production environment (e.g. Frontend on **Vercel**, Backend on **Render**), browsers block third-party cookies across differing domains. IntervueX resolves this with an **Axios Bearer Token Request Interceptor**:

```
[User Signs In via Clerk]
           │
           ▼
[Clerk Issues JWT Session Token]
           │
           ▼
[Frontend: axios.interceptors.request]
   └─ Dynamically calls window.Clerk.session.getToken()
   └─ Injects header: `Authorization: Bearer <JWT>`
           │
           ▼ (HTTPS Request)
[Backend: clerkMiddleware()]
   └─ Validates cryptographic signature using CLERK_SECRET_KEY
   └─ Decodes user identity into `req.auth`
           │
           ▼
[Backend: protectRoute Middleware]
   └─ Extracts clerkId = getAuth(req).userId
   └─ Verifies User existence in PostgreSQL via `prisma.user.findUnique`
   └─ Attaches database user to `req.user`
           │
           ▼
[Target Controller Executes]
```

### B. Event-Driven User Synchronization

To guarantee that the PostgreSQL database and GetStream user directory stay completely in sync with Clerk without blocking user requests, IntervueX employs **Inngest**:

1. **Webhook Reception**: When an account is created or deleted, Clerk dispatches an HTTP POST event to `/webhooks/clerk`.
2. **Event Ingestion**: Express immediately passes the payload to Inngest (`inngest.send({ name: 'clerk/user.created', data: event.data })`) and responds with `200 OK`.
3. **Background Execution**:
   - `syncUser`: Inngest worker executes `prisma.user.create()` to store the user in PostgreSQL, then calls `upsertStreamUser()` to register their profile in GetStream's chat and video systems.
   - `deleteUser`: Inngest worker removes the user record via `prisma.user.delete()` and cleans up their data from GetStream via `deleteStreamUser()`.
4. **Resilience**: If the database or external API temporarily experiences downtime, Inngest automatically retries with exponential backoff.

### C. Interview Session Lifecycle

```
[Host Creates Session]
       │
       ├─► 1. Generates unique callId (e.g., session_1740...)
       ├─► 2. Creates DB record in PostgreSQL (`status: ACTIVE`, `hostId: userId`)
       ├─► 3. Initializes Video Call on GetStream (`streamClient.video.call("default", callId)`)
       └─► 4. Initializes Chat Channel on GetStream (`chatClient.channel("messaging", callId)`)
       │
[Candidate Discovers & Joins]
       │
       ├─► 1. Fetches active sessions via `GET /api/sessions/active`
       ├─► 2. Clicks "Join Session" (`POST /api/sessions/:id/join`)
       ├─► 3. Backend binds candidate's ID to `participantId`
       └─► 4. Both peers connect WebRTC streams and join the synchronized chat room
       │
[In-Session Collaboration]
       │
       ├─► Audio & Video exchanged via GetStream WebRTC SFU mesh
       ├─► Instant messages exchanged via GetStream Chat WebSockets
       └─► Code typed in Monaco Editor and tested via Piston Sandbox
       │
[Host Ends Session]
       │
       └─► `POST /api/sessions/:id/end` updates session status to `COMPLETED`
```

### D. Remote Code Execution Pipeline

When a candidate or interviewer executes code in the Monaco Editor:
1. The code string, selected language (JavaScript, Python, C++, Java, etc.), and optional test inputs are packaged into a payload.
2. The client submits the code to the **Piston API** (`POST https://emkc.org/api/v2/piston/execute`).
3. Piston spins up an isolated ephemeral Docker container, compiles/executes the code against memory and time limits, and captures stdout and stderr.
4. The output payload is returned to the client and rendered in the terminal-style `OutputPanel` with execution time and error formatting.

---

## 4. Tech Stack & Infrastructure

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Real-Time Video**: [@stream-io/video-react-sdk](https://getstream.io/video/)
- **Real-Time Chat**: [stream-chat-react](https://getstream.io/chat/)
- **Data Fetching & Cache**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **Client Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Server Runtime**: [Node.js](https://nodejs.org/) with [Express 5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) with [tsx](https://github.com/privatenumber/tsx)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) + [Prisma 7](https://www.prisma.io/)
- **Authentication**: [@clerk/express](https://clerk.com/docs/references/express/overview)
- **Background Jobs**: [Inngest SDK](https://www.inngest.com/)
- **Video & Chat Services**: [@stream-io/node-sdk](https://www.npmjs.com/package/@stream-io/node-sdk) & [stream-chat](https://www.npmjs.com/package/stream-chat)
- **CORS Handling**: [cors](https://www.npmjs.com/package/cors)

---

## 5. Database Schema (Prisma ORM)

The relational schema is defined in [backend/prisma/schema.prisma](backend/prisma/schema.prisma):

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum Status {
  ACTIVE
  COMPLETED
}

model User {
  id                   String    @id @default(cuid())
  name                 String
  email                String    @unique
  profileImage         String?
  clerkId              String    @unique

  hostedSessions       Session[] @relation("HostSessions")
  participatedSessions Session[] @relation("ParticipantSessions")

  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
}

model Session {
  id                   String     @id @default(cuid())
  problem              String
  difficulty           Difficulty

  hostId               String
  host                 User       @relation("HostSessions", fields: [hostId], references: [id])

  participantId        String?
  participant          User?      @relation("ParticipantSessions", fields: [participantId], references: [id])

  status               Status     @default(ACTIVE)
  callId               String     @default("")

  createdAt            DateTime   @default(now())
  updatedAt            DateTime   @updatedAt
}
```

---

## 6. API Endpoints Reference

### Sessions API (`/api/sessions`)

| HTTP Method | Route | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/sessions` | `protectRoute` | Creates a new interview session, allocates `callId`, initializes Stream Video and Chat rooms. |
| `GET` | `/api/sessions/active` | `protectRoute` | Fetches the latest 20 active sessions with host & candidate details. |
| `GET` | `/api/sessions/my-recent` | `protectRoute` | Fetches the latest 20 completed sessions for the authenticated user. |
| `GET` | `/api/sessions/:id` | `protectRoute` | Retrieves details and participants for a specific session ID. |
| `POST` | `/api/sessions/:id/join` | `protectRoute` | Adds the authenticated user as the participant to an active session. |
| `POST` | `/api/sessions/:id/end` | `protectRoute` | Updates the session status from `ACTIVE` to `COMPLETED`. |

### Chat & Token API (`/api/chat`)

| HTTP Method | Route | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chat/token` | `protectRoute` | Generates a scoped user token for initializing the Stream Chat client. |

### Webhooks & Health

| HTTP Method | Route | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/webhooks/clerk` | Clerk Signature | Ingests Clerk events (`user.created`, `user.deleted`) and dispatches them to Inngest. |
| `ALL` | `/api/inngest` | Inngest Handshake | Handles background function execution and orchestration. |
| `GET` | `/health` | Public | Healthcheck endpoint (`200 OK`). |

---

## 7. Frontend Architecture & Component Structure

```
frontend/src/
├── api/
│   └── sessions.ts           # Axios API abstraction for all session operations
├── component/
│   ├── ActiveSessions.tsx     # Active sessions grid with 1-click join
│   ├── CodeEditorPanel.tsx    # Monaco editor container with language selection & run trigger
│   ├── CreateSessionModal.tsx # Room creation modal (problem selection & difficulty)
│   ├── OutputPanel.tsx        # Terminal console rendering stdout, execution duration, and errors
│   ├── ProblemDescription.tsx # Interactive problem description, test cases, and constraints
│   ├── RecentSessions.tsx     # Historical completed sessions cards
│   ├── StatsCards.tsx         # Dashboard metrics (total active, completed interviews)
│   ├── VideoCallUI.tsx        # Stream Video audio/video grid with hardware controls
│   ├── WelcomeSection.tsx     # Hero banner with user details & quick actions
│   ├── foot.tsx               # Technical footer
│   └── navbar.tsx             # Navbar with brand logo, links, and Clerk UserButton
├── data/
│   └── problems.ts            # Curated catalog of standard DSA problems & test cases
├── hooks/
│   └── useSessions.ts         # React Query hooks with automatic cache invalidation
├── lib/
│   ├── axios.ts               # Axios instance with Clerk Bearer token interceptor
│   ├── piston.ts              # Piston API client for remote code compilation
│   └── stream.ts              # Stream client helper factories
├── pages/
│   ├── DashboardPage.tsx      # Main authenticated dashboard
│   ├── HomePage.tsx           # High-impact landing page
│   ├── ProblemPage.tsx        # Solo practice coding room
│   ├── ProblemsPage.tsx       # Searchable problem catalog
│   └── SessionPage.tsx        # Live paired collaborative interview room
├── App.tsx                    # Routes & authentication guards
└── main.tsx                   # ClerkProvider & QueryClientProvider setup
```

---

## 8. Environment Variables Setup

### 1. Backend (`backend/.env`)

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# PostgreSQL Database
DATABASE_URL="postgresql://username:password@localhost:5432/intervuex?schema=public"

# Clerk Authentication (From Clerk Dashboard > API Keys)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# GetStream (From Stream Dashboard)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Inngest Background Tasks
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
INNGEST_BASE_URL=http://localhost:8288
```

### 2. Frontend (`frontend/.env`)

```env
# Clerk Authentication (Must match backend instance)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Backend API Base URL
VITE_API_URL=http://localhost:3000/api

# GetStream API Key
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 9. Step-by-Step Installation & Local Execution

### Option A: Run Both Together from the Root (Simplest)

```bash
# 1. Clone the repository
git clone https://github.com/abhinavv016/IntervueX.git
cd IntervueX

# 2. Install dependencies across root, backend, and frontend
npm install
npm install --prefix backend
npm install --prefix frontend

# 3. Generate Prisma client
cd backend && npx prisma generate && cd ..

# 4. Start backend and frontend concurrently
npm run dev
```

### Option B: Run in Separate Terminals

#### Terminal 1 — Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```
> Backend runs at `http://localhost:3000` (Healthcheck: `http://localhost:3000/health`)

#### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`

#### Terminal 3 — Inngest Dev Server (Optional, for Webhooks)
```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```
> Inngest dashboard runs at `http://localhost:8288`

---

## 10. Production Deployment & Cross-Origin Troubleshooting

### Recommended Hosting Services
- **Frontend**: [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)
- **Backend**: [Render](https://render.com/), [Railway](https://railway.app/), or [Fly.io](https://fly.io/)
- **Database**: [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Aiven](https://aiven.io/)

### Critical Deployment Checklist

1. **Cross-Origin Authentication (401 Fix)**:
   - In deployment, the frontend and backend are hosted on separate domains. Browsers block cross-site cookies.
   - IntervueX resolves this via the request interceptor in `frontend/src/lib/axios.ts`, which attaches `Authorization: Bearer <session_token>` to every request.
   - Backend `protectRoute` verifies this token using `@clerk/express`.
2. **CORS Configuration**:
   - Set `CLIENT_URL` in your backend deployment environment variables to your exact frontend domain (e.g., `https://intervuex.vercel.app` without trailing slash).
3. **Clerk Matching Keys**:
   - Ensure the frontend `VITE_CLERK_PUBLISHABLE_KEY` and the backend `CLERK_PUBLISHABLE_KEY`/`CLERK_SECRET_KEY` belong to the **exact same Clerk instance** (both Development `pk_test_...` or both Production `pk_live_...`).
4. **Clerk Webhook**:
   - In your Clerk Dashboard, go to **Webhooks** > **Add Endpoint**.
   - Set the Endpoint URL to: `https://<your-backend-domain>/webhooks/clerk`.
   - Subscribe to `user.created` and `user.deleted` events. This ensures users are automatically inserted into your PostgreSQL database.

---

<div align="center">
  <b>Built with ❤️ by Abhinav Chaurasia</b>
</div>
