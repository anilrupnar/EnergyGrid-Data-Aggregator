# Coding Assignment: EnergyGrid Data Aggregator

## Objective
Build a robust client application (Node.js/Python/Go) to fetch real-time telemetry from 500 solar inverters, navigating strict strict rate limits and security protocols.

## The Challenge
we are integrating with a legacy "EnergyGrid" API with the following strict constraints:
1.  **Rate Limit**: Strictly **1 request per second**. Exceeding this returns `HTTP 429`.
2.  **Batch Limit**: Maximum **10 devices (Serial Numbers)** per request.
3.  **Security**: Every request requires a custom `Signature` header: `MD5(URL + Token + Timestamp)`.

##  Task 
1.  **Generate** a list of 500 dummy Serial Numbers (`SN-000` to `SN-499`).
2.  **Fetch** data for all 500 devices from the Mock Server.
3.  **Aggregate** the results into a single object or report.
4.  **Optimize** throughput while respecting the 1s rate limit (use batching).
5.  **Handle Errors**: Gracefully handle `429`s or network failures (e.g., retries).


**API Meta:**
-   **URL**: `http://localhost:3000/device/real/query`
-   **Method**: `POST`
-   **Token**: `interview_token_123`

## Requirements
-   **Language**: Node.js, Python, or Go.
-   **No External Tools**: Logic (rate limiting, signing) must be in your code.
-   **Clean Code**: Modular structure (separation of API logic vs business logic).
