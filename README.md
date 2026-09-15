# Cloudflare Worker implementation notes

This folder is reserved for the Cloudflare Worker source that enforces the API and security rules.

## Recommended Worker responsibilities

- Validate origin, method, and auth cookie
- Initialize D1 database access with `DB`
- Use `R2` for private file storage
- Use `MESSAGE_HUB` for Durable Object WebSocket sessions
- Rate-limit login and upload endpoints
- Check file permissions before every file response
- Return secure headers for every response
- Write audit logs for privileged operations

## Endpoint contract

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/friends`
- `POST /api/friends/request`
- `POST /api/friends/accept`
- `POST /api/friends/remove`
- `GET /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages`
- `POST /api/files/upload`
- `GET /api/files`
- `GET /api/files/:id`
- `DELETE /api/files/:id`
- `POST /api/files/:id/share`
- `POST /api/files/:id/revoke`
- `GET /api/community/files`
- `POST /api/community/files`
- `DELETE /api/community/files/:id`

## Notes

- Files are not publicly readable.
- Do not trust user-provided file IDs, names, or extension values.
- All file-serving requests should verify ownership or permission server-side.
- Use secure session cookies with expiry and revocation checks.
- Use server-side hashing for passwords and tokens.

## Example environment values

- `SESSION_SECRET`
- `TURNSTILE_SECRET_KEY`
- `APP_URL`
- `API_BASE_URL`
- `ADMIN_EMAIL`

## Deployment method

Use the Cloudflare dashboard to create the Worker, attach the D1, R2, and Durable Object bindings, and deploy the code bundle with a configured route.
