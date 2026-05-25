function sendSpeed(speed) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(tab.id, { action: 'setSpeed', speed }, (_response) => {
      if (chrome.runtime.lastError) {
        showError('Cannot access this page. Try refreshing.');
      }
      // Toast is handled by content.js
    });
  });
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 2500);
}

document.querySelectorAll('.speed-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const speed = parseFloat(btn.dataset.speed);
    sendSpeed(speed);
  });
});

document.getElementById('apply-custom').addEventListener('click', () => {
  const input = document.getElementById('custom-speed');
  const raw = input.value.trim();

  if (!raw) {
    showError('Enter a speed value');
    return;
  }

  const speed = parseFloat(raw);

  if (isNaN(speed) || speed <= 0) {
    showError('Enter a valid positive number');
    return;
  }

  sendSpeed(speed);
  input.value = '';
});

document.getElementById('custom-speed').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('apply-custom').click();
  }
});
