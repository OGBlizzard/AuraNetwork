(function () {
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function buildSearchResults() {
    const results = [
      { name: 'Astra Nova', email: 'astra@shadow.local', status: 'online' },
      { name: 'Rin Kestrel', email: 'rin@shadow.local', status: 'online' },
      { name: 'Vex Mercer', email: 'vex@shadow.local', status: 'offline' }
    ];

    const container = document.getElementById('friend-search-results');
    if (!container) return;

    container.innerHTML = '';
    results.forEach((person) => {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.innerHTML = `
        <div>
          <strong>${person.name}</strong>
          <small>${person.email}</small>
        </div>
        <div>
          <button class="button secondary tiny">Add</button>
        </div>
      `;
      item.querySelector('button').addEventListener('click', () => showToast(`Friend request sent to ${person.name}.`));
      container.appendChild(item);
    });
  }

  function buildRequests() {
    const container = document.getElementById('friend-request-list');
    if (!container) return;

    const requests = [
      { name: 'Violet', note: 'Wants to share private files' },
      { name: 'Talon', note: 'Mutual gaming community' }
    ];

    container.innerHTML = '';
    requests.forEach((request) => {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.innerHTML = `
        <div>
          <strong>${request.name}</strong>
          <small>${request.note}</small>
        </div>
        <div class="row compact">
          <button class="button primary tiny">Accept</button>
          <button class="button ghost tiny">Reject</button>
        </div>
      `;
      item.querySelector('.button.primary').addEventListener('click', () => showToast(`${request.name} accepted.`));
      item.querySelector('.button.ghost').addEventListener('click', () => showToast(`${request.name} declined.`));
      container.appendChild(item);
    });
  }

  function init() {
    buildSearchResults();
    buildRequests();
    const input = document.getElementById('friend-search');
    if (input) {
      input.addEventListener('input', (event) => {
        const term = event.target.value.trim().toLowerCase();
        const items = Array.from(document.querySelectorAll('#friend-search-results .result-item'));
        items.forEach((item) => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(term) || !term ? 'flex' : 'none';
        });
      });
    }
  }

  window.FriendManager = {
    init,
  };
})();
