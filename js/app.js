(function () {
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  async function loadUserProfile() {
    const welcomeNode = document.getElementById('welcome-name');
    if (!welcomeNode) return;

    try {
      const user = await window.SHAÐOW_API.getCurrentUser();
      welcomeNode.textContent = `Welcome back, ${user.name || user.username || 'friend'}`;
    } catch (error) {
      welcomeNode.textContent = 'Welcome back';
      setTimeout(() => window.location.href = 'login.html', 300);
    }
  }

  function bindLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (!logoutButton) return;

    logoutButton.addEventListener('click', async () => {
      try {
        await window.SHAÐOW_API.logout();
        showToast('Logged out securely.');
        setTimeout(() => window.location.href = 'login.html', 250);
      } catch (error) {
        showToast(error.message || 'Unable to log out.', 'error');
      }
    });
  }

  function initDashboard() {
    loadUserProfile();
    bindLogout();
    renderPlaceholderList('recent-files-list', ['Latest private file', 'Friend-share archive', 'Design pack']);
    renderPlaceholderList('recent-conversations-list', ['Astra', 'Nova', 'Sigma']);
    renderPlaceholderList('community-files-list', ['Community gallery', 'Docs vault', 'Gaming pack']);
    renderPlaceholderList('friend-activity-list', ['Astra is online', 'Nova shared a file', 'Krystal is active'], true);
  }

  function initCommunity() {
    renderPlaceholderList('community-grid', ['Images', 'Videos', 'Documents', 'Gaming'], false, true);
    bindLogout();
  }

  function initSettings() {
    bindLogout();
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        showToast('Profile update queued for secure sync.');
      });
    }

    const securityForm = document.getElementById('security-form');
    if (securityForm) {
      securityForm.addEventListener('submit', (event) => {
        event.preventDefault();
        showToast('Password change requested securely.', 'success');
      });
    }

    const deleteButton = document.getElementById('delete-account-btn');
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        showToast('Account deletion must be confirmed server-side.', 'error');
      });
    }
  }

  function renderPlaceholderList(targetId, items, isActivity = false, isGrid = false) {
    const container = document.getElementById(targetId);
    if (!container) return;

    container.innerHTML = '';
    if (isGrid) {
      items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.innerHTML = `
          <div class="file-thumb">📁</div>
          <div class="meta">
            <h4>${item}</h4>
            <p>Authenticated members only</p>
            <div class="file-actions">
              <button class="button ghost tiny">Open</button>
              <button class="button secondary tiny">View</button>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
      return;
    }

    items.forEach((item) => {
      const row = document.createElement(isActivity ? 'div' : 'div');
      row.className = isActivity ? 'activity-item' : 'list-row';
      row.innerHTML = isActivity
        ? `<span class="dot cyan"></span><div><strong>${item}</strong><small>Now</small></div>`
        : `<span>${item}</span><span class="badge neutral">Shared</span>`;
      container.appendChild(row);
    });
  }

  window.AppShell = {
    initDashboard,
    initCommunity,
    initSettings,
    showToast,
  };
})();
