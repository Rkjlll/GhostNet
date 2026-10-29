import { PROVENANCE } from "./telemetry.js";

export async function measureLocalSystems({ endpoint = "/api/health", timeoutMs = 2500 } = {}) {
  const result = {
    browserNetwork: {
      value: typeof navigator.onLine === "boolean" ? (navigator.onLine ? "ONLINE" : "OFFLINE") : null,
      status: typeof navigator.onLine === "boolean" ? PROVENANCE.MEASURED : PROVENANCE.UNAVAILABLE,
      source: "Browser network status"
    },
    localApi: { value: "UNAVAILABLE", status: PROVENANCE.UNAVAILABLE, source: "Local API health endpoint" },
    localRttMs: { value: null, status: PROVENANCE.UNAVAILABLE, source: "Timed local API request" },
    battery: { value: null, status: PROVENANCE.UNAVAILABLE, source: "Battery API not available" }
  };

  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, { cache: "no-store", signal: controller.signal });
    result.localRttMs = {
      value: Number((performance.now() - started).toFixed(1)),
      status: PROVENANCE.MEASURED,
      source: "Browser-timed request"
    };
    result.localApi = {
      value: response.ok ? `HTTP ${response.status} OK` : `HTTP ${response.status}`,
      status: PROVENANCE.MEASURED,
      source: "Local API response"
    };
  } catch {
    result.localApi = { value: "UNAVAILABLE", status: PROVENANCE.UNAVAILABLE, source: "Local API request failed or timed out" };
  } finally {
    clearTimeout(timeout);
  }

  if (typeof navigator.getBattery === "function") {
    try {
      const battery = await navigator.getBattery();
      result.battery = {
        value: battery.level === null ? null : `${Math.round(battery.level * 100)}%${battery.charging ? " (charging)" : ""}`,
        status: battery.level === null ? PROVENANCE.UNAVAILABLE : PROVENANCE.MEASURED,
        source: "Browser Battery Status API"
      };
    } catch {
      result.battery = { value: null, status: PROVENANCE.UNAVAILABLE, source: "Battery API permission or read failed" };
    }
  }
  return result;
}
