(function () {
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function redirectToApp() {
    window.location.href = 'app.html';
  }

  function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = {
        identifier: String(formData.get('identifier') || '').trim(),
        password: String(formData.get('password') || ''),
      };

      if (!payload.identifier || !payload.password) {
        showToast('Please enter both your identifier and password.', 'error');
        return;
      }

      try {
        await window.SHAÐOW_API.login(payload);
        showToast('Logged in successfully.');
        setTimeout(redirectToApp, 350);
      } catch (error) {
        showToast(error.message || 'Unable to log in.', 'error');
      }
    });
  }

  function initRegister() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const password = String(formData.get('password') || '');
      const confirmPassword = String(formData.get('confirmPassword') || '');
      const payload = {
        firstName: String(formData.get('firstName') || '').trim(),
        lastName: String(formData.get('lastName') || '').trim(),
        username: String(formData.get('username') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        password,
      };

      if (!payload.firstName || !payload.lastName || !payload.username || !payload.email) {
        showToast('Please complete all required fields.', 'error');
        return;
      }

      if (password.length < 12) {
        showToast('Passwords must be at least 12 characters long.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      try {
        await window.SHAÐOW_API.register(payload);
        showToast('Account created successfully.');
        setTimeout(() => window.location.href = 'login.html', 350);
      } catch (error) {
        showToast(error.message || 'Registration failed.', 'error');
      }
    });
  }

  window.AuthHandler = {
    initLogin,
    initRegister,
  };
})();
