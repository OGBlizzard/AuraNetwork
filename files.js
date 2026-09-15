(function () {
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  function renderFiles(files) {
    const container = document.getElementById('files-grid');
    if (!container) return;

    container.innerHTML = '';
    if (!files.length) {
      container.innerHTML = '<div class="empty-state">No files yet. Upload a secure file to get started.</div>';
      return;
    }

    files.forEach((file) => {
      const card = document.createElement('article');
      card.className = 'file-card';
      card.innerHTML = `
        <div class="file-thumb">${getIcon(file.type)}</div>
        <div class="meta">
          <h4>${file.name}</h4>
          <p>${formatBytes(file.size)} • ${file.modified}</p>
          <div class="file-actions">
            <button class="button secondary tiny" data-action="download">Download</button>
            <button class="button ghost tiny" data-action="share">Share</button>
          </div>
        </div>
      `;

      card.querySelector('[data-action="download"]').addEventListener('click', () => showToast(`Preparing secure download for ${file.name}.`));
      card.querySelector('[data-action="share"]').addEventListener('click', () => showToast(`Sharing ${file.name} with selected friends.`));
      container.appendChild(card);
    });
  }

  function getIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.includes('pdf')) return '📄';
    if (type.includes('zip')) return '🗜️';
    return '📁';
  }

  function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
  }

  function bindUpload() {
    const input = document.getElementById('file-input');
    const trigger = document.getElementById('upload-trigger') || document.getElementById('upload-button');
    const dropzone = document.getElementById('upload-dropzone');

    if (trigger) {
      trigger.addEventListener('click', () => input.click());
    }

    if (input) {
      input.addEventListener('change', (event) => {
        const files = Array.from(event.target.files || []);
        handleUpload(files);
      });
    }

    if (dropzone) {
      ['dragover', 'dragenter'].forEach((eventName) => {
        dropzone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropzone.style.borderColor = 'rgba(110, 231, 255, 0.7)';
        });
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        dropzone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropzone.style.borderColor = 'rgba(110, 231, 255, 0.35)';
        });
      });

      dropzone.addEventListener('drop', (event) => {
        const files = Array.from(event.dataTransfer.files || []);
        handleUpload(files);
      });
    }
  }

  function handleUpload(files) {
    if (!files.length) return;
    const sample = files[0];
    showToast(`Uploading ${sample.name} securely via authenticated backend.`);

    setTimeout(() => {
      const fakeFiles = [
        ...files.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          modified: 'Today'
        })),
        { name: 'project-archive.zip', size: 4200000, type: 'application/zip', modified: 'Today' }
      ];
      renderFiles(fakeFiles);
    }, 600);
  }

  function bindViewToggle() {
    const toggleButton = document.getElementById('toggle-view-btn');
    const grid = document.getElementById('files-grid');
    if (!toggleButton || !grid) return;

    let listMode = false;
    toggleButton.addEventListener('click', () => {
      listMode = !listMode;
      grid.classList.toggle('list-view', listMode);
      toggleButton.textContent = listMode ? 'List' : 'Grid';
      grid.querySelectorAll('.file-card').forEach((card) => card.classList.toggle('list-card', listMode));
    });
  }

  function bindSearch() {
    const searchInput = document.getElementById('file-search');
    const cards = () => Array.from(document.querySelectorAll('#files-grid .file-card'));

    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.trim().toLowerCase();
      cards().forEach((card) => {
        const name = card.textContent.toLowerCase();
        card.style.display = !term || name.includes(term) ? 'block' : 'none';
      });
    });
  }

  function init() {
    renderFiles([
      { name: 'family-photo.jpg', size: 1840000, type: 'image/jpeg', modified: 'Today' },
      { name: 'roadmap.pdf', size: 920000, type: 'application/pdf', modified: 'Yesterday' },
      { name: 'vault.zip', size: 4200000, type: 'application/zip', modified: '2 days ago' }
    ]);
    bindUpload();
    bindViewToggle();
    bindSearch();
  }

  window.FileManager = {
    init,
    renderFiles,
    handleUpload,
  };
})();
