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

## Telemetry provenance: read the label before the number

Every dashboard value must carry one of these labels. The label tells you where the value came from, not how impressive it looks.

- **SIMULATED** means GhostNet generated the value or calculated it from a model. Examples: RF activity, modeled energy reserve/harvest/consumption, synthetic backtests, heuristic scores, and paper-trading fills. These are not hardware measurements or real money.
- **MEASURED** means the app actually observed a value or received it from a named external data provider. The dashboard shows the source where available. Market-provider quotes are provider-supplied data, not measurements made by your phone. Local API round-trip time is measured only for that browser request.
- **UNAVAILABLE** means no usable reading was obtained or the browser does not expose that sensor/API. A dash means unknown, not zero. The app must not silently substitute generated numbers and call them measured.

The **Simulation layer** and **Real systems layer** are separate panels. Simulated values stay in the simulation panel. The real-systems panel reports only browser-observed network/API health and supported battery information; unsupported readings remain UNAVAILABLE. A successful local API request does not prove Internet-wide connectivity, radio signal strength, or physical RF activity.

### Provenance build gate

Run the complete build check and tests with:

```sh
npm run build
```

The build fails if a statically declared dashboard value lacks a valid `data-status`, if a declared value is written directly with `.textContent` instead of the shared label renderer, or if the required separate panels are missing. Dynamic dashboard values must use the shared helpers in `src/telemetry.js`; CI runs this check before tests. If you add a new value, label its provenance and add a test when appropriate. Do not weaken the check to make an unlabeled value pass.

## Barcode Intelligence workbench

The dashboard includes a browser-side barcode workspace for data you own or are authorized to process.

- Scan supported formats with the browser `BarcodeDetector` API when the device/browser exposes it. A hardware scanner in keyboard-wedge mode can enter data into the input field.
- Preserve the original scanned/entered payload while previewing transformations: trim control characters, change letter case, add a prefix/suffix, and replace matching text.
- Validate Code 39 character support, EAN-13 check digits, and UPC-A check digits.
- Generate and download a **custom Code 39 SVG** for internal labels.
- EAN-13 and UPC-A are validation-only. This tool does not rewrite official retail product identifiers or represent custom labels as manufacturer-issued codes.
- Camera access requires browser permission and a secure context (normally HTTPS or localhost). BarcodeDetector format support varies by browser/device; manual entry remains available.

Barcode transformation changes the payload used for a custom output. It does not rewrite a physical barcode or alter a manufacturer's product database. Test labels against your actual scanner and workflow before operational use.
