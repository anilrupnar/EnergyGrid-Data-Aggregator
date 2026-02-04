# EnergyGrid Data Aggregator

**Project Overview**

This backend assignment simulates a real-world EnergyGrid system. The goal is to fetch real-time telemetry data for 500 solar inverters from a rate-limited API, aggregate all responses, and demonstrate robust backend design.

## Problem Statement
- **Total Devices:** 500 (IDs: SN-000 → SN-499)
- **API Constraints:**
  - Max 1 request per second
  - Max 10 device serials per request
  - MD5 signature required for every request
  - API returns HTTP 429 if rate limit is violated

## Tech Stack
- Node.js
- Express.js (Mock API)
- Axios (HTTP Client)
- Crypto (MD5 Signature)

## Project Structure
```bash
  energygrid-aggregator/
  │
  ├── mock-api/
  │   ├── server.js          # Mock EnergyGrid API
  │   ├── package.json
  │
  ├── client/
  │   ├── index.js           # Aggregator client logic
  │   ├── output.json        # Final aggregated result
  │   ├── package.json
  │
  ├── instructions.md        # Assignment description
  └── README.md              # Project documentation
```

## How to Run the Project
### Prerequisites
- Node.js v16 or above
- npm installed

### 1. Start the Mock API Server
Open Terminal 1:
```bash
cd energygrid-aggregator/mock-api
npm install
npm start
```
Expected output:
```
   EnergyGrid Mock API running on port 3000
   Constraints: 1 req/sec, Max 10 items/batch
```

### 2. Run the Client Aggregator
Open Terminal 2:
```bash
cd energygrid-aggregator/client
npm install
npm start

```

## Output
- Final aggregated data is stored in: `client/output.json`
- Contains combined telemetry data for all 500 devices

## Security Implementation
Each request includes:
- `timestamp` (current time in ms)
- `signature` header

**Signature Logic:**
```
MD5( URL + TOKEN + TIMESTAMP )
```
Where:
- URL = `/device/real/query`
- TOKEN = `interview_token_123`

## Key Features
- Device ID generation (SN-000 → SN-499)
- Batch processing (10 devices/request)
- Rate limiting (1 request/second)
- Retry handling for HTTP 429
- Fault-tolerant execution
- Clean and modular code

## Error Handling
Automatically retries on:
- Rate limit errors (429)
- Temporary network failures
- Uses delay/backoff to prevent API blocking

## What This Assignment Demonstrates
- Backend system design
- Handling real-world API constraints
- Writing production-grade Node.js code
- Secure request signing
- Data aggregation at scale

## Author
- Anil Rupnar
- ( Backend / Full-Stack Developer )
