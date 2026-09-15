# Cloudflare deployment guide for SHAÐØW Network

This project is designed as a static HTML/CSS/JS frontend and a Cloudflare Worker/API backend. HTML files are browser-rendered, while auth, file access control, messaging, and enforcement logic happen in Cloudflare services.

## What you must create in Cloudflare

### 1) Cloudflare Pages project
- Create a new Cloudflare Pages project in the Cloudflare dashboard.
- Connect it to your GitHub repository or upload the static folder directly.
- Set the production branch or use a direct upload deployment.
- Set the project root to the static site folder that contains `index.html` and the `css`, `js`, and `pwa` directories.
- Name it: `shadow-network-static`

### 2) Cloudflare Worker for the API and auth layer
- In Cloudflare Workers, create a new Worker.
- Name it: `shadow-network-api`
- Route it to your Pages site domain or custom domain such as `api.yourdomain.com`.
- Add a route like:
  - `https://api.yourdomain.com/*`
- Configure it to serve API endpoints such as:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
  - `GET /api/friends`
  - etc.

### 3) Cloudflare D1 database
- Create a D1 database in Cloudflare dashboard.
- Name it: `shadow-network-db`
- Use the SQL schema in `cloudflare/database-schema.sql`.
- Add the `d1` binding in the Worker configuration with the binding name:
  - `DB`

### 4) Cloudflare R2 bucket
- Create a private R2 bucket.
- Name it: `shadow-network-files`
- Do not make the bucket public.
- Create a bucket policy with no public access.
- Add the binding name in the Worker config:
  - `R2`

### 5) Durable Objects for real-time messaging
- Create a Durable Object namespace.
- Name it: `MESSAGE_HUB`
- Bind it to the Worker as:
  - `MESSAGE_HUB`
- Use the object to handle WebSocket connections and message fanout.

### 6) Turnstile for bot protection
- Add Cloudflare Turnstile to login, registration, and upload flows.
- Add site keys in the frontend and secret keys in the Worker.
- Use environment bindings like:
  - `TURNSTILE_SECRET_KEY`

### 7) Optional KV namespace for session cache or rate limiting
- Create a KV namespace if you want a faster auth/session cache or abuse monitoring state.
- Name it: `SHADOW_SESSION_CACHE`

## Required Worker config bindings

In the Cloudflare dashboard Worker configuration, set the following bindings:

- `DB` → D1 database
- `R2` → R2 bucket
- `MESSAGE_HUB` → Durable Object namespace
- `TURNSTILE_SECRET_KEY` → secret value
- Optional: `SHADOW_SESSION_CACHE` → KV namespace

## Important backend rules

- Never trust any ID or filename from the browser.
- Verify authentication on every protected route.
- Verify authorization on every file request.
- Verify the file belongs to the user, is shared with them, or is in a community area.
- Store password hashes with a slow adaptive algorithm such as Argon2id or bcrypt.
- Use HttpOnly, Secure, SameSite cookies for session storage.
- Reject public access to R2. Files must be streamed through a Worker with auth checks.
- Store encryption keys outside the encrypted object, never alongside the file.

## Browser-side encryption guidance

The front-end includes a browser encryption helper in `js/encryption.js` for practical client-side encryption before upload. The intended pattern is:

1. User selects file.
2. Browser encrypts file with Web Crypto API.
3. Worker validates auth and permission.
4. Worker stores encrypted object in private R2 bucket.
5. Browser later requests a file.
6. Worker retrieves encrypted object.
7. Browser decrypts locally with a user-held key.

This is not the same as end-to-end encryption for all content unless the user supplies and manages a private key outside the server. The server secures the object, but the browser must keep the decryption material.

## Required SQL schema

Use the contents of `cloudflare/database-schema.sql` as the initial database schema. It includes tables for:

- users
- sessions
- friendships
- conversations
- conversation_members
- messages
- files
- file_permissions
- community_files
- audit_logs

## Worker code

The Worker source code is intended to live in `cloudflare/worker/` and is written to be deployed using the Cloudflare dashboard or an uploaded Worker bundle. Because we are avoiding Node and npm, direct dashboard upload is the appropriate deployment method.

## Security headers

The static site should be served over HTTPS and the Worker should set secure headers including but not limited to:

- Content-Security-Policy
- X-Frame-Options
- Referrer-Policy
- X-Content-Type-Options
- Permissions-Policy
- Strict-Transport-Security

## Rate limiting and abuse protection

- Apply rate limits to login, registration, and upload requests.
- Use Turnstile for bot protection on public forms.
- Audit all privileged actions in `audit_logs`.
- Revoke stale or compromised sessions.

## Deployment sequence

1. Create Cloudflare Pages project.
2. Create D1 database and apply schema.
3. Create private R2 bucket.
4. Create Worker and bind DB, R2, MESSAGE_HUB, and secret keys.
5. Set routes and custom domain.
6. Configure Turnstile site keys and secret.
7. Upload static site bundle.
8. Test login, friends, messaging, file upload, community, and permissions flows.

## Files intentionally left out of local execution

This project deliberately avoids pretending the browser alone can securely store or authorize files. The Cloudflare service layer is the correct place for authentication, file authorization, permissions, and secure storage management.
