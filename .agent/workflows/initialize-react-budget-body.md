---
description: Budget Buddy Initializer (React + TanStack + Vitest)
---

Task: Scaffold a professional React Web Application for "Budget Buddy" using Vite and a strict folder architecture.

1. Technical Stack Configuration:

Framework: React 18+ (Vite)

Language: TypeScript (Strict Mode)

Routing: TanStack Router (File-based routing)

Data Fetching: TanStack Query

Styling: Tailwind CSS + shadcn/ui

Testing: Vitest + React Testing Library

2. Project Tree Structure:
Initialize the workspace with the following hierarchy:

Plaintext
src/
├── assets/             # Global static assets
├── components/         # Shared UI components (Buttons, Inputs, Gauges)
├── hooks/              # Custom React hooks
├── pages/              # Page-level components & logic
│   ├── dashboard/      # Overview, Charts, Summary
│   ├── fixed-costs/    # Replication logic & Fixed List
│   └── variable-costs/ # Budget vs Actual & Variable List
├── routes/             # TanStack Router Definitions (__root.tsx + index.tsx)
├── services/           # Logic for calculations & API (Supabase)
├── types/              # TypeScript Interfaces (Business Logic)
└── __tests__/          # Unit tests with Vitest

3. Execution Steps for the Agent:

Initialize Vite: Run npm create vite@latest . -- --template react-ts.

Install Dependencies:

@tanstack/react-router, @tanstack/react-query, lucide-react, clsx, tailwind-merge.

DevDeps: vitest, @testing-library/react, @testing-library/jest-dom, jsdom.

Tailwind Setup: Configure tailwind.config.js with the Midnight & Mint palette:

primary: "#6366F1", success: "#10B981", warning: "#F59E0B", danger: "#F43F5E".

Testing Setup: Create a vitest.config.ts and a sample test in src/__tests__/math.test.ts to verify the environment.

Router Setup: Initialize src/routes/__root.tsx with a standard Sidebar layout.

4. Quality Gate:
The agent must verify that the project compiles (npm run build) and tests pass (npm run test) before finishing the workflow.