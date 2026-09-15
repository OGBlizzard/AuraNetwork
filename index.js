addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.cloudflare.com; font-src 'self' data:; upgrade-insecure-requests",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/health') {
    return jsonResponse({ ok: true, service: 'shadow-network-api' }, 200);
  }

  if (!path.startsWith('/api/')) {
    return new Response('Not found', { status: 404, headers: SECURITY_HEADERS });
  }

  const headers = new Headers(SECURITY_HEADERS);
  headers.set('Cache-Control', 'no-store');

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return jsonResponse({ error: 'Authentication required.' }, 401, headers);
    }

    if (path === '/api/auth/me') {
      return jsonResponse({
        id: authResult.user.id,
        username: authResult.user.username,
        email: authResult.user.email,
        name: `${authResult.user.first_name || ''} ${authResult.user.last_name || ''}`.trim() || authResult.user.username,
        role: authResult.user.role || 'user',
      }, 200, headers);
    }

    if (path === '/api/auth/logout') {
      return jsonResponse({ ok: true, message: 'Session revoked.' }, 200, headers);
    }

    if (path === '/api/files') {
      return jsonResponse({
        files: [],
        pagination: { page: 1, total: 0 },
      }, 200, headers);
    }

    if (path.startsWith('/api/community/files')) {
      return jsonResponse({
        files: [],
      }, 200, headers);
    }

    if (path === '/api/auth/register' || path === '/api/auth/login') {
      const body = await request.clone().json().catch(() => ({}));

      if (path === '/api/auth/register') {
        return jsonResponse({
          ok: true,
          message: 'Register endpoint ready for D1-backed user creation.',
          payload: {
            username: body.username || null,
            email: body.email || null,
          },
        }, 200, headers);
      }

      return jsonResponse({
        ok: true,
        message: 'Login endpoint ready for secure server-side session creation.',
      }, 200, headers);
    }

    return jsonResponse({ error: 'Endpoint not implemented in this stub deployment.' }, 501, headers);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Server error.' }, 500, headers);
  }
}

async function requireAuth(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  const sessionToken = match ? decodeURIComponent(match[1]) : null;

  if (!sessionToken || sessionToken.length < 32) {
    return { authorized: false, user: null };
  }

  return {
    authorized: true,
    user: {
      id: 'user_123',
      username: 'shadow-user',
      email: 'user@shadow.local',
      first_name: 'Shadow',
      last_name: 'User',
      role: 'user',
    },
  };
}

function jsonResponse(data, status = 200, headers = new Headers()) {
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data), { status, headers });
}
