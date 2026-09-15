# SHAÐØW Network

A premium dark cyber-themed private communications and file-sharing application designed for deployment as a static website with Cloudflare Workers, D1, and R2.

## Important constraints

- No Node.js, npm, Electron, Vite, Next.js, or local build step is required.
- This project is static HTML, CSS, and vanilla JavaScript.
- Authentication uses secure server-side sessions and never stores plain-text passwords.
- Cloudflare-specific services are documented and implemented as deployable code, but they require Cloudflare dashboard configuration.

## Project structure

- `index.html` — landing page
- `login.html` — sign-in page
- `register.html` — account creation page
- `app.html` — main application shell
- `messages.html` — messaging dashboard
- `files.html` — private file manager
- `community.html` — shared community files
- `settings.html` — account and security settings
- `css/` — styles
- `js/` — browser logic
- `pwa/` — manifest and service worker
- `cloudflare/` — backend schema and deployment guide

## Security architecture summary

- HTTPS required everywhere.
- HttpOnly, Secure, SameSite cookies are expected at the API layer.
- Passwords are hashed server-side before storage.
- File requests are authorized on the backend and never granted by browser-supplied IDs.
- Private files should be encrypted in the browser before upload and decrypted in the browser after retrieval.
- Community content is separate from private content and uses a permission model.

## Cloudflare deployment

See `cloudflare/README.md` for step-by-step configuration and required Cloudflare resources.

## Local testing

Open `index.html` directly or serve the folder with a simple static HTTP server, such as Python:

```bash
cd "c:\Users\trent.brown\OneDrive - Department of Education NT\Desktop\ABYSS"
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Notes

This front-end provides the UI and browser-side security patterns. The actual authentication, file authorization, and messaging infrastructure must be completed in the Cloudflare Worker and D1 database configured per the README.
