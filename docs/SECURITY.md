# Security and privacy

- Browser state stays local unless exported.
- Market API tokens belong in server environment variables, never frontend assets or committed files.
- The local server binds to 127.0.0.1 by default.
- Quote symbols are validated and upstream requests time out.
- Simulated/provider data provenance remains explicit.
- Paper trading is the only execution mode; no broker order endpoint exists.
- Treat market data and imported files as untrusted input.
- Before remote deployment, add authentication, HTTPS, rate limiting, and hardened deployment controls.
