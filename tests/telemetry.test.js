import test from "node:test";
import assert from "node:assert/strict";
import { labeledValue, provenanceBadge, setLabeledValue } from "../src/telemetry.js";

test("only the three documented provenance statuses are accepted", () => {
  for (const status of ["SIMULATED", "MEASURED", "UNAVAILABLE"]) {
    assert.match(provenanceBadge(status), new RegExp(status));
  }
  assert.throws(() => provenanceBadge("GUESSED"), /Unknown provenance status/);
});

test("values and source labels are HTML-escaped", () => {
  const html = labeledValue("<script>", "MEASURED", "<provider>");
  assert.doesNotMatch(html, /<script>|<provider>/);
  assert.match(html, /&lt;script&gt;/);
});

test("setLabeledValue records status on the element", () => {
  const element = { dataset: {}, innerHTML: "" };
  setLabeledValue(element, 12.5, "SIMULATED", "demo model");
  assert.equal(element.dataset.provenance, "SIMULATED");
  assert.match(element.innerHTML, /12\.5/);
  assert.match(element.innerHTML, /SIMULATED/);
});
