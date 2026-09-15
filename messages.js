(function () {
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  function createFriendList() {
    const list = document.getElementById('friend-list');
    if (!list) return;

    const friends = [
      { name: 'Astra', status: 'online' },
      { name: 'Nova', status: 'online' },
      { name: 'Kite', status: 'offline' },
      { name: 'Riven', status: 'online' }
    ];

    list.innerHTML = '';
    friends.forEach((friend) => {
      const item = document.createElement('div');
      item.className = 'friend-item';
      item.innerHTML = `
        <div>
          <strong>${friend.name}</strong>
          <small>${friend.status === 'online' ? 'Online now' : 'Offline'}</small>
        </div>
        <span class="presence"></span>
      `;
      item.addEventListener('click', () => openConversation(friend.name));
      list.appendChild(item);
    });
  }

  function openConversation(name) {
    const header = document.getElementById('chat-header');
    const thread = document.getElementById('chat-thread');
    if (!header || !thread) return;

    header.innerHTML = `
      <div>
        <strong>${name}</strong>
        <small>Encrypted private chat</small>
      </div>
      <span class="badge success">Online</span>
    `;

    thread.innerHTML = `
      <div class="message-row">
        <div class="message-bubble">
          <div class="message-meta"><span>${name}</span><span>Now</span></div>
          <div>Hey, are you ready to share the archive?</div>
        </div>
      </div>
      <div class="message-row mine">
        <div class="message-bubble">
          <div class="message-meta"><span>You</span><span>Now</span></div>
          <div>Yes. I can send it once the secure upload is ready.</div>
        </div>
      </div>
    `;
  }

  function bindMessageForm() {
    const form = document.getElementById('message-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = document.getElementById('message-input');
      const thread = document.getElementById('chat-thread');
      if (!input || !thread || !input.value.trim()) {
        showToast('Type a message before sending.', 'error');
        return;
      }

      const row = document.createElement('div');
      row.className = 'message-row mine';
      row.innerHTML = `
        <div class="message-bubble">
          <div class="message-meta"><span>You</span><span>Now</span></div>
          <div>${input.value}</div>
        </div>
      `;
      thread.appendChild(row);
      input.value = '';
      showToast('Message sent to secure conversation.');
    });
  }

  function init() {
    createFriendList();
    bindMessageForm();
    const newChatButton = document.getElementById('new-message-btn');
    if (newChatButton) {
      newChatButton.addEventListener('click', () => showToast('Start a new secure conversation from your friends list.', 'success'));
    }
  }

  window.MessageApp = {
    init,
    openConversation,
  };
})();
