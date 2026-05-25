# PlayRate — Brave Video Speed Controller

A Brave/Chrome browser extension to control video playback speed on any page.

## Features

- Preset speed buttons: **2.5x / 3x / 3.5x / 4x**
- Custom speed input for any value
- Auto-applies speed to dynamically loaded videos via MutationObserver
- Toast notifications for success/failure feedback
- Dark theme popup UI

## Quick Start

1. Open Brave and go to `brave://extensions`
2. Enable **Developer mode** (toggle top-right)
3. Click **Load unpacked** and select the `playrate` directory
4. The PlayRate icon appears in the toolbar — click it on any page with a video

## Project Structure

```
playrate/
├── manifest.json    # MV3 extension config
├── popup.html       # Popup panel UI
├── popup.js         # Popup interaction logic
├── popup.css        # Dark theme styles
├── content.js       # Video speed control + toast + MutationObserver
├── icons/           # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## How It Works

1. Click the extension icon → popup opens
2. Choose a preset speed or enter a custom value → Apply
3. `popup.js` sends the speed to `content.js` via `chrome.tabs.sendMessage`
4. `content.js` finds the currently playing `<video>`, sets `playbackRate`, and shows a toast
5. `MutationObserver` watches for new `<video>` elements and auto-applies the speed
