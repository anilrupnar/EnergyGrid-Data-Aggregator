const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const ENDPOINT_PATH = '/device/real/query';
const TOKEN = 'interview_token_123';

const TOTAL_DEVICES = 500;
const BATCH_SIZE = 10;
const MIN_GAP_MS = 1050; // keep > 950ms to avoid mock rate-limit

const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1200;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');

function genSNs() {
  const out = [];
  for (let i = 0; i < TOTAL_DEVICES; i++) out.push(`SN-${String(i).padStart(3, '0')}`);
  return out;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

let lastAt = 0;
async function gate() {
  const now = Date.now();
  const wait = Math.max(0, MIN_GAP_MS - (now - lastAt));
  if (wait) await sleep(wait);
  lastAt = Date.now();
}

async function fetchBatch(sn_list, attempt = 0) {
  await gate();
  const timestamp = String(Date.now());
  const signature = md5(ENDPOINT_PATH + TOKEN + timestamp);

  const res = await fetch(`${BASE_URL}${ENDPOINT_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      timestamp,
      signature,
    },
    body: JSON.stringify({ sn_list }),
  });

  if (res.ok) {
    const json = await res.json();
    return json.data;
  }

  const status = res.status;
  const body = await res.text().catch(() => '');
  const retryable = status === 429 || (status >= 500 && status <= 599);

  if (!retryable || attempt >= MAX_RETRIES) {
    throw new Error(`status ${status}: ${body}`);
  }

  const backoff = BASE_BACKOFF_MS * (2 ** attempt) + Math.floor(Math.random() * 250);
  console.log(`[Retry] status=${status}, attempt=${attempt + 1}/${MAX_RETRIES}, wait=${backoff}ms`);
  await sleep(backoff);
  return fetchBatch(sn_list, attempt + 1);
}

async function main() {
  const batches = chunk(genSNs(), BATCH_SIZE);
  const aggregated = {};
  let received = 0;

  console.log(`Total devices: ${TOTAL_DEVICES}`);
  console.log(`Batches: ${batches.length} (size ${BATCH_SIZE})`);
  console.log(`Min gap: ${MIN_GAP_MS}ms\n`);

  for (let i = 0; i < batches.length; i++) {
    const b = batches[i];
    const label = `${i + 1}/${batches.length} ${b[0]}..${b[b.length - 1]}`;
    try {
      const data = await fetchBatch(b);
      for (const item of data) aggregated[item.sn] = item;
      received += data.length;
      console.log(`[OK] ${label} (+${data.length}) total=${received}/${TOTAL_DEVICES}`);
    } catch (e) {
      console.error(`[FAIL] ${label}: ${e.message}`);
    }
  }

  const outPath = path.join(__dirname, 'output.json');
  fs.writeFileSync(outPath, JSON.stringify(aggregated, null, 2), 'utf8');

  console.log(`\nDone. Aggregated ${Object.keys(aggregated).length}/${TOTAL_DEVICES}.`);
  console.log(`Saved: ${outPath}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exitCode = 1;
});
