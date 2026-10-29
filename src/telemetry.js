export const PROVENANCE = Object.freeze({
  SIMULATED: "SIMULATED",
  MEASURED: "MEASURED",
  UNAVAILABLE: "UNAVAILABLE"
});

const VALID = new Set(Object.values(PROVENANCE));

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

export function provenanceBadge(status, source = "") {
  if (!VALID.has(status)) throw new TypeError(`Unknown provenance status: ${status}`);
  const detail = source ? ` <span class="provenance-source">${escapeHtml(source)}</span>` : "";
  return `<span class="provenance ${status.toLowerCase()}" data-provenance="${status}">${status}</span>${detail}`;
}

export function labeledValue(value, status, source = "") {
  const display = value === null || value === undefined || value === "" ? "—" : value;
  return `<span class="value-text">${escapeHtml(display)}</span> ${provenanceBadge(status, source)}`;
}

export function setLabeledValue(element, value, status, source = "") {
  if (!element) throw new TypeError("A dashboard value element is required");
  element.innerHTML = labeledValue(value, status, source);
  element.dataset.provenance = status;
}
