# Quantum Risk Simulation and Analytics Engine

A React + TypeScript + Vite simulation dashboard for evaluating post-quantum cryptography migration risk in a banking infrastructure environment.

This project models a cyber-risk decision game where the player:

- monitors critical banking systems
- scans for vulnerabilities
- chooses migration vendors and strategies
- tracks budget, uptime, and day-by-day progress
- manages a 15-day Q-Day countdown and execution strategy
- uses AI-assisted analysis tools for operational reporting

## Overview

The application presents a "Quantum Risk Analyst" experience for financial institutions undergoing a migration away from legacy cryptography. It simulates operational pressure, financial trade-offs, system risk, and mission-driven remediation planning.

## Features

- Cyberpunk fintech dashboard layout
- Real-time stats for budget, uptime, migration progress, and critical systems
- Q-Day countdown and 15-day mission timeline
- System scanning and vulnerability assessment workflow
- Vendor selection modal for migration strategy trade-offs
- Security, analytics, and missions panels
- AI assistant / AI tools panel
- Responsive UI built in React
- Vite-based front-end tooling and TypeScript support

## Tech Stack

- React 19
- TypeScript
- Vite
- ESLint
- Lucide React
- react-markdown

## Project Structure

```text
quantum-risk-simulation/
├── .env.example
├── .gitignore
├── README.md
├── STRUCTURE.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── api/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── assets/
└── ...
```

## Local Setup

1. Open the app directory:

```bash
cd quantum-risk-simulation
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
cp .env.example .env.local
```

4. Fill in the required values in `.env.local` if you are using the AI integration endpoints.

Example:

```dotenv
VITE_PICO_API_KEY=
VITE_LLM_API_URL=
VITE_IMAGE_API_URL=
VITE_ENABLE_CLIENT_LOGS=false
```

## Run the app

```bash
npm run dev
```

The app will be served by Vite, typically at:

- http://localhost:5173

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Security Note

Do not commit real API keys or secrets into client-side environment files. Prefer a backend or proxy endpoint for AI-related requests and keep secrets server-side.

## Notes

- `STRUCTURE.md` contains the project design and timeline context for the simulation.
- The simulation is intended as a prototype and strategy dashboard rather than a production financial-risk engine.
- This project is designed for demonstrating a banking Q-Day migration scenario and operational decision-making under uncertainty.

## License

This project does not currently declare a license in the repository metadata. If you plan to share or distribute it publicly, you may want to add an explicit open-source license.
