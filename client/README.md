# EnergyGrid Data Aggregator (Client)

This client fetches telemetry for **500** devices from the mock EnergyGrid API while respecting:
- **Rate limit:** 1 request/sec
- **Batch size:** max 10 serial numbers per request
- **Security headers:** `signature = MD5(urlPath + token + timestamp)`

## Prerequisites
- Node.js **18+** (for built-in `fetch`)

## Run
1. Start the mock API first (see `../mock-api/README.md`).
2. In a new terminal:

```bash
cd client
npm start
```

## Output
After completion, the aggregated result is saved to:
- `client/output.json`
