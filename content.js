let currentSpeed = null;

function findPlayingVideo() {
  const videos = document.querySelectorAll('video');

  for (const video of videos) {
    if (!video.paused && video.currentTime > 0 && video.readyState >= 2) {
      return video;
    }
  }

  for (const video of videos) {
    if (!video.paused) {
      return video;
    }
  }

  return videos.length > 0 ? videos[0] : null;
}

function showToast(message, type) {
  const existing = document.querySelector('.playrate-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'playrate-toast';
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: '2147483647',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#fff',
    backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    transition: 'opacity 0.3s ease',
    opacity: '1',
    pointerEvents: 'none',
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function applySpeed(speed) {
  const video = findPlayingVideo();

  if (!video) {
    showToast('No playing video found', 'error');
    return false;
  }

  try {
    video.playbackRate = speed;
    showToast('Speed set to ' + speed + 'x', 'success');
    currentSpeed = speed;
    return true;
  } catch (_) {
    showToast('Failed to set playback speed', 'error');
    return false;
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'setSpeed') {
    const success = applySpeed(message.speed);
    sendResponse({ success });
  }
});

const observer = new MutationObserver(() => {
  if (currentSpeed === null) return;

  const videos = document.querySelectorAll('video');
  for (const video of videos) {
    if (!video.paused && video.playbackRate !== currentSpeed) {
      video.playbackRate = currentSpeed;
    }
  }
});

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}
