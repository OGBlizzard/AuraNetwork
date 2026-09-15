(function () {
  async function deriveKey(password, salt) {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 250000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptFile(file, password) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(password, salt);
    const buffer = await file.arrayBuffer();
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, buffer);
    const encryptedBlob = new Blob([
      new Uint8Array(salt),
      new Uint8Array(iv),
      new Uint8Array(encrypted)
    ]);

    return new File([encryptedBlob], `${file.name}.enc`, { type: 'application/octet-stream' });
  }

  async function decryptFile(file, password) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const ciphertext = bytes.slice(28);
    const key = await deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    const mimeType = file.type || 'application/octet-stream';
    return new File([decrypted], file.name.replace(/\.enc$/i, ''), { type: mimeType });
  }

  window.SHAÐOW_ENCRYPTION = {
    encryptFile,
    decryptFile,
  };
})();
