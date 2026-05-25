<p align="center">
  <img src="icons/icon128.png" width="80" alt="PlayRate">
</p>

<h3 align="center">PlayRate</h3>
<p align="center">High-speed video playback control for Brave / Chrome</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=flat-square" alt="MV3">
  <img src="https://img.shields.io/badge/Brave-compatible-orange?style=flat-square" alt="Brave">
  <img src="https://img.shields.io/badge/Chrome-compatible-green?style=flat-square" alt="Chrome">
</p>

---

## Why

Most video platforms cap playback speed at 2x. PlayRate removes that limit — dial up to **4x and beyond** on any `<video>`-based player with a single click.

## Confirmed Sites

| Site | Status |
|------|--------|
| [YouTube](https://youtube.com) | confirmed |
| [Bilibili](https://bilibili.com) | confirmed |

> More sites to be tested. If a site uses a standard `<video>` element, it should work out of the box.

## Features

- **Preset speeds** — 2.5x / 3x / 3.5x / 4x, one click
- **Custom speed** — enter any value (e.g. 5.5x, 10x)
- **Auto-apply** — `MutationObserver` catches dynamically loaded videos (SPA navigation, lazy-loaded embeds)
- **Toast feedback** — green / red notification on the page tells you whether it worked
- **Zero config** — no settings, no memory, just click and go

## Install

### Load Unpacked (Developer Mode)

1. Open Brave or Chrome and navigate to `brave://extensions` / `chrome://extensions`
2. Toggle **Developer mode** (top-right corner)
3. Click **Load unpacked**
4. Select the `playrate` directory
5. The PlayRate icon appears in your toolbar

### From Chrome Web Store

> Coming soon.

## Usage

1. Open any page with a video (YouTube, Bilibili, etc.)
2. Click the PlayRate icon in the toolbar
3. Choose a preset speed or type a custom value → **Apply**
4. A toast confirms the speed change

## How It Works

```
popup.html
  │  click preset / custom + Apply
  ▼
popup.js
  │  validate input → chrome.tabs.sendMessage({ action: "setSpeed", speed })
  ▼
content.js
  │  findPlayingVideo() → video.playbackRate = speed
  │  showToast("Speed set to Xx")
  │  MutationObserver → re-apply on dynamically inserted <video>
```

## Project Structure

```
playrate/
├── manifest.json      # MV3 extension config
├── content.js         # Core: video finder, speed control, toast, MutationObserver
├── popup.html         # Popup UI
├── popup.js           # Popup logic: validation, messaging
├── popup.css          # Dark theme styles
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Tech

- **Manifest V3** — current Chromium extension standard
- **Plain JavaScript** — no build step, no dependencies
- **`MutationObserver`** — watches for dynamic `<video>` injection
- **`chrome.tabs.sendMessage`** — popup-to-content-script communication

## License

MIT
