(function () {
  const API_BASE = '/api';

  function request(path, options = {}) {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      ...options,
    };

    if (config.body && typeof config.body !== 'FormData') {
      config.body = JSON.stringify(config.body);
    }

    return fetch(`${API_BASE}${path}`, config).then(async (response) => {
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : null;

      if (!response.ok) {
        const message = data && data.error ? data.error : 'Request failed.';
        throw new Error(message);
      }

      return data;
    });
  }

  function getCurrentUser() {
    return request('/auth/me');
  }

  function login(data) {
    return request('/auth/login', {
      method: 'POST',
      body: data,
    });
  }

  function register(data) {
    return request('/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  function logout() {
    return request('/auth/logout', {
      method: 'POST',
    });
  }

  window.SHAÐOW_API = {
    API_BASE,
    request,
    getCurrentUser,
    login,
    register,
    logout,
  };
})();
