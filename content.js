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
    watchVideoRateChange(video);
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

function applySpeedToVideo(video, speed) {
  if (video.playbackRate !== speed) {
    video.playbackRate = speed;
  }
}

function watchVideoRateChange(video) {
  if (video.dataset.playrateWatching) return;
  video.dataset.playrateWatching = 'true';
  video.addEventListener('ratechange', () => {
    if (currentSpeed !== null && video.playbackRate !== currentSpeed) {
      currentSpeed = video.playbackRate;
    }
  });
}

const observer = new MutationObserver((mutations) => {
  if (currentSpeed === null) return;

  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      if (node.tagName === 'VIDEO') {
        applySpeedToVideo(node, currentSpeed);
        watchVideoRateChange(node);
      }

      for (const video of node.querySelectorAll?.('video') ?? []) {
        applySpeedToVideo(video, currentSpeed);
        watchVideoRateChange(video);
      }
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
