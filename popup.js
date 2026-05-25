function sendSpeed(speed: number): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, { action: 'setSpeed', speed }, (response) => {
      if (chrome.runtime.lastError) {
        showError('Cannot access this page. Try refreshing.');
        return;
      }
      // Toast notification is handled by content.js
    });
  });
}

function showError(msg: string): void {
  const el = document.getElementById('error-msg')!;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 2500);
}

document.querySelectorAll('.speed-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const speed = parseFloat((btn as HTMLElement).dataset.speed!);
    sendSpeed(speed);
  });
});

document.getElementById('apply-custom')!.addEventListener('click', () => {
  const input = document.getElementById('custom-speed') as HTMLInputElement;
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

document.getElementById('custom-speed')!.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('apply-custom')!.click();
  }
});
