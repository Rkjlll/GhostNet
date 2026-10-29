import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const failures = [];
const valueElements = [...html.matchAll(/<(strong|b)\\b([^>]*)>/gi)];

for (const [, tag, attrs] of valueElements) {
  const id = attrs.match(/\\bid=["']([^"']+)["']/i)?.[1] ?? "(missing id)";
  const status = attrs.match(/\\bdata-status=["']([^"']+)["']/i)?.[1];
  if (!/\\bdata-value\\b/i.test(attrs)) failures.push("index.html: " + tag + "#" + id + " is a value element but is missing data-value");
  if (!status || !["SIMULATED", "MEASURED", "UNAVAILABLE"].includes(status)) {
    failures.push("index.html: " + tag + "#" + id + " needs data-status=SIMULATED|MEASURED|UNAVAILABLE");
  }
}

const valueIds = new Set(valueElements.map(([, , attrs]) => attrs.match(/\\bid=["']([^"']+)["']/i)?.[1]).filter(Boolean));
for (const [, id] of app.matchAll(/\\$\\(["']([^"']+)["']\\)\\.textContent\\s*=/g)) {
  if (valueIds.has(id)) failures.push("src/app.js: " + id + " writes directly to a value element; use setLabeledValue()");
}

if (!app.includes("setLabeledValue") || !app.includes("provenanceBadge") || !app.includes("labeledValue")) {
  failures.push("src/app.js must use the shared provenance rendering helpers for dynamic values");
}
if (!html.includes('id="simulationPanel"') || !html.includes('id="measuredPanel"')) {
  failures.push("index.html must keep simulation and measured systems in separate panels");
}
if (!html.includes("SIMULATED") || !html.includes("MEASURED") || !html.includes("UNAVAILABLE")) {
  failures.push("index.html must explain all three provenance labels");
}
if (!app.includes('$("marketRows").innerHTML') || !app.includes('$("ledgerRows").innerHTML') ||
    !app.includes('labeledValue(s,') || !app.includes('labeledValue(t.quantity,')) {
  failures.push("Market and paper-ledger table values must use labeledValue()");
}

if (failures.length) {
  console.error("Provenance label check FAILED:");
  for (const failure of failures) console.error(" - " + failure);
  process.exitCode = 1;
} else {
  console.log("Provenance label check passed (" + valueElements.length + " static value elements checked).");
}
