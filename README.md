# GhostNet

Offline-first RF observatory, market research dashboard, and risk-controlled paper-trading lab.

## Included
- RF observations and energy reserve simulator, explicitly labelled simulated.
- Explainable AI-inspired stock scoring using momentum, moving averages, RSI, and volatility.
- Optional server-side live quote adapter; API tokens stay on the server.
- Paper portfolio, cash-only order sizing, stop/target planning, concentration cap, audit ledger, and JSON export.
- Synthetic strategy replay and automated tests.
- No live brokerage order execution.

## Run
Requires Node.js 18+.
```sh
npm test
npm start
```
Open http://localhost:8787.

Optional quotes: set FINNHUB_API_KEY in your local environment. Provider availability, delay, market hours, and permitted usage depend on your provider and plan. Without a key or when quotes fail, the app falls back to clearly labelled simulated data.

## Important
No strategy can guarantee maximum income. The score is a transparent heuristic, not a trained model or probability of profit. This is a research and paper-trading tool, not personalized financial advice. Paper results do not establish future performance. Real-money order routing is intentionally disabled.

## Architecture
- src/core.js — features, scoring, position sizing, and risk gates
- src/app.js — dashboard, paper ledger, RF simulator, and audit loop
- server/server.js — local static server and optional quote adapter
- tests/core.test.js — automated unit tests
- docs/ — trading, RF hardware, and security notes

The RF module is simulated; real RF measurements require compatible hardware. Ambient RF harvesting generally cannot continuously power a phone or general-purpose computer.
