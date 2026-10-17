# Market and paper-trading design

Quote adapter -> provenance validation -> rolling history -> momentum/SMA/RSI/volatility -> explainable heuristic score -> risk gate -> paper ledger -> audit export.

The score is rule-based logic, not a trained AI model or probability of profit. The server optionally requests Finnhub quotes when FINNHUB_API_KEY is set server-side. Provider rate limits, market hours, entitlements, and delays apply. When unavailable, the UI uses simulated prices and labels them SIMULATED.

Guardrails: paper cash only, no margin/leverage/shorting/live broker execution; default paper equity $10,000; risk input capped at 1%; position sizing based on stop distance and cash; concentration capped at 25% of paper equity.

These prototype controls do not establish that a strategy is safe or profitable. Before real-money integration, require independent review, broker-specific order validation, idempotency, kill switches, daily-loss limits, market-hours checks, stale-data rejection, paper forward-testing, and explicit user authorization.
