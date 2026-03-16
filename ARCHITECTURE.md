# Architecture — AI-Assisted Journal System

---

## 1. How would you scale this to 100k users?

Right now the app runs on a single Express server with a local MongoDB — that won't hold up at scale. Here's how I'd approach it:

**Run multiple backend instances**
Instead of one server, run several Express instances behind a load balancer (like Nginx). Since we're using JWT for auth (stateless), any instance can handle any request without worrying about sessions.

**Move MongoDB to Atlas**
Switch from local MongoDB to MongoDB Atlas which gives you a replica set out of the box — one primary handles writes, secondaries handle reads. Also add indexes on the fields we query the most: `userId` and `createdAt`.(_which i have already added just indexing is left_)

**Don't call Gemini synchronously**
The biggest bottleneck at scale is the AI call — it blocks the request for 2-3 seconds. The fix is a job queue (like BullMQ + Redis). When a user saves an entry:
1. Save the entry right away with `status: "pending"`
2. Push an analysis job to the queue
3. A background worker picks it up and calls Gemini
4. Frontend polls or uses SSE to get the result

**Deploy frontend on a CDN**
The React/Vite build is just static files — no reason to serve them from Express. Deploy to Vercel or Cloudflare Pages so users get them from the nearest edge server.

```
User → CDN (frontend)
     → Load Balancer → Express instances → Redis (cache + queue)
                                        → BullMQ workers → Gemini
                                        → MongoDB Atlas
```

---

## 2. How would you reduce LLM cost?

Every Analyze click hits the Gemini API. At scale that gets expensive fast. A few things I'd do:

**Stop calling it on every preview**
Currently the "Analyze" button fires an API call every time it's clicked. I'd debounce it (wait until the user stops typing for ~1.5s) or just merge it into the Save action so we only call Gemini once per entry.

**Cache results** (see Q3)
Same text should never hit the API twice.

**Keep prompts short**
Right now we're sending the full journal text. For most entries, the first 300-400 characters carry most of the emotional signal. Truncating long entries reduces token usage.

**Add a per-user daily limit**
A simple rate limit (e.g. 20 analyses/day) prevents one user from burning through the quota and also protects against abuse.

**Use a smaller model if quality holds**
`emini-3-flash-preview` is already the lighter model. Worth testing if an even smaller one gives acceptable results for this simple task.

---

## 3. How would you cache repeated analysis?

**The problem:** If someone analyzes the same (or very similar) text twice, we're paying for the same Gemini call twice.

**The solution:** Hash the text and use it as a cache key in Redis (or even in-memory with `node-cache` for a simpler setup).

```js
import crypto from "crypto";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 * 7 }); // 7 days

function getCacheKey(text) {
  return crypto.createHash("sha256").update(text.trim().toLowerCase()).digest("hex");
}

async function analyzeWithCache(text) {
  const key = getCacheKey(text);

  const cached = cache.get(key);
  if (cached) return cached; // no API call

  const result = await callGemini(text);
  cache.set(key, result);
  return result;
}
```

The TTL is set to 7 days since the same text will always produce the same result — there's nothing to invalidate unless the prompt changes. Normalizing the text (trim + lowercase) before hashing avoids unnecessary cache misses from minor formatting differences.

---

## 4. How would you protect sensitive journal data?

Journal entries are personal so this matters more than in a typical app.

**HTTPS + secure cookies**
All traffic should go over HTTPS. The auth cookie already has `httpOnly` set — I'd also add `Secure` (only sent over HTTPS) and `SameSite: Strict` to prevent CSRF.

**Shorter JWT expiry**
The current JWT probably lives for a long time. I'd shorten it to 15–30 minutes and use a refresh token to get a new one silently. This limits how long a stolen token is useful.

**Rate limit login attempts**
After 5 failed login attempts, lock that account out for 15 minutes. Stops brute-force attacks on passwords.

**Don't log journal content**
Server logs should never contain the actual journal text — only metadata like user ID and timestamp. If logs get leaked, entry content stays private.

**Keep secrets out of code**
`GEMINI_API_KEY`, JWT secret, and MongoDB URI should only live in environment variables — never committed to the repo. On a real deployment I'd use something like AWS Secrets Manager.

**Sanitize inputs**
Since we're using MongoDB, I'd sanitize request bodies to block NoSQL injection (`$where`, `$gt` etc. in unexpected places). A library like `express-mongo-sanitize` handles this in one line.

**Let users delete their data**
Add a "Delete my account" option that wipes all their entries too. Basic privacy expectation.
