# 🏎️ Slow Roads Premium

A completely redesigned, feature-rich premium overlay for Slow Roads with advanced car customization, road textures, and multiplayer capabilities.

![Premium UI](https://img.shields.io/badge/UI-Premium%202.0-00f0ff)
![Status](https://img.shields.io/badge/Status-Active-success)

## ✨ What's New in Premium 2.0

### 🎨 Complete UI Overhaul
- **Glassmorphism Design** - Modern translucent aesthetics with depth
- **Animated Speedometer** - Cyan/Magenta/Gold gradient ring with real-time updates
- **Premium Color Scheme** - Carefully curated palette for luxury feel
- **Smooth Animations** - 60fps transitions and micro-interactions

### 🚗 Car Customization
- **12 Premium Paint Colors** from Rosso Corsa to Chrome Silver
- **5 Finish Types**: Solid, Metallic, Pearl, Neon, Chrome
- **Neon Underglow** - Toggleable underglow effects
- **Live Preview** - Changes apply immediately to your vehicle

### 🛣️ Road Texture System
- **6 Unique Road Presets**:
  - 🌑 Midnight Asphalt (classic)
  - ⚡ Carbon Fiber (racing)
  - 💜 Neon Grid (cyberpunk)
  - 🔴 Red Planet (Martian)
  - ❄️ Arctic Ice (frozen)
  - 👑 Golden Highway (luxury)

### 👥 Multiplayer Foundation
- Host/Join system with shareable codes
- Connection status indicators
- Player list with ping display
- Toast notification system

## 🚀 Quick Start

### Installation

1. **Clone or download** this repository
2. **Open** `index.html` in a modern browser
3. **Press `C`** to open the customization panel
4. **Enjoy** the premium experience!

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `C` | Toggle Customization Sidebar |
| `M` | Open Multiplayer Tab |
| `ESC` | Close Sidebar |

## 📁 Project Structure

```
/
├── index.html                    # Main entry point
├── favicon_circle.svg           # App icon
├── manifest.json                # PWA manifest
├── img.jpg                      # Social preview
├── static/                      # Original game files
│   ├── css/
│   │   └── main.*.chunk.css    # Original styles
│   ├── js/
│   │   ├── 2.*.chunk.js        # Game engine
│   │   └── main.*.chunk.js     # Game logic
│   └── media/                   # Assets (textures, models, audio)
│       ├── Dosis.*.ttf
│       ├── Jura.*.ttf
│       ├── *.obj               # 3D models
│       ├── *.jpg/*.png         # Textures
│       └── *.mp3/*.wav         # Audio
│
└── premium-ui/                  # 🎨 PREMIUM UI MODULE
    ├── assets/
    │   ├── css/
    │   │   └── premium-ui.css  # Main stylesheet (25KB+)
    │   ├── js/
    │   │   └── premium-ui.js   # Main module (32KB+)
    │   ├── fonts/              # Custom fonts
    │   ├── images/             # UI images
    │   └── textures/           # Road textures
    ├── themes/
    │   └── cyberpunk.css       # Cyberpunk theme
    └── docs/
        ├── README.md           # UI documentation
        ├── API.md              # API reference
        └── CHANGELOG.md        # Version history
```

## 🎨 Customization

### Car Colors

The Premium UI includes 12 carefully selected colors:

| Color | Hex | Type |
|-------|-----|------|
| Rosso Corsa | `#ff0000` | Solid |
| Midnight Blue | `#001f3f` | Solid |
| Gunmetal | `#2c3e50` | Metallic |
| Pearl White | `#f5f5f0` | Pearl |
| Liquid Gold | `#ffd700` | Metallic |
| Cyber Pink | `#ff00aa` | Neon |
| Electric Cyan | `#00f0ff` | Neon |
| Purple Haze | `#8b5cf6` | Metallic |
| Sunset Orange | `#ff6b35` | Solid |
| Forest Green | `#228b22` | Solid |
| Midnight Black | `#0a0a0a` | Metallic |
| Chrome Silver | `#c0c0c0` | Chrome |

### Road Textures

Each road preset has unique material properties:

| Preset | Roughness | Metalness | Special |
|--------|-----------|-----------|---------|
| Asphalt | 0.9 | 0.1 | - |
| Carbon | 0.7 | 0.3 | Pattern |
| Neon | 0.5 | 0.5 | Emissive |
| Mars | 1.0 | 0.0 | - |
| Ice | 0.2 | 0.1 | - |
| Gold | 0.3 | 0.8 | - |

### Themes

Activate themes by including the CSS file:

```html
<!-- Default theme (built-in) -->
<link href="premium-ui/assets/css/premium-ui.css" rel="stylesheet">

<!-- Cyberpunk theme (add after default) -->
<link href="premium-ui/themes/cyberpunk.css" rel="stylesheet">
```

## 🔌 API Usage

### Global API

```javascript
// Change car color
PremiumUI.setCarColor('#ff0000', 'Rosso Corsa');

// Change road texture
PremiumUI.setRoadPreset('carbon');

// Show notification
PremiumUI.showToast('Hello!', 'success');

// Toggle sidebar
PremiumUI.toggleSidebar();
```

### Events

```javascript
// Listen for changes
window.addEventListener('premium:carColorChange', (e) => {
  console.log('New color:', e.detail.color);
});

window.addEventListener('premium:roadTextureChange', (e) => {
  console.log('New road:', e.detail.preset.name);
});
```

See [API.md](premium-ui/docs/API.md) for complete documentation.

## 🛠️ Development

### File Structure

```
premium-ui/
├── assets/css/premium-ui.css    # All styles (modular sections)
├── assets/js/premium-ui.js      # Main module
│   ├── State Management
│   ├── Car Module
│   ├── Road Module
│   ├── P2P Module
│   ├── UI Controller
│   └── Game Bridge
└── docs/                        # Documentation
```

### Adding Features

1. **New Car Color**:
   ```javascript
   // In premium-ui.js, CAR_COLORS array
   { name: 'Custom', hex: '#123456', type: 'metallic' }
   ```

2. **New Road Preset**:
   ```javascript
   // In premium-ui.js, ROAD_PRESETS array
   {
     id: 'custom',
     name: 'Custom Road',
     desc: 'Description',
     color: '#123456',
     roughness: 0.5,
     metalness: 0.5
   }
   ```

3. **Custom Theme**:
   Create a new file in `themes/`:
   ```css
   :root {
     --primary-cyan: #your-color;
     --primary-magenta: #your-color;
     /* ... */
   }
   ```

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 76+ | ✅ Full Support |
| Firefox | 70+ | ✅ Full Support |
| Safari | 15+ | ✅ Full Support |
| Edge | 79+ | ✅ Full Support |

## 📜 License

This project is licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)

- **BY** - Attribution required
- **NC** - Non-commercial use only  
- **ND** - No derivative works

**Original Game**: [Anslo](https://slowroads.io) - slowroads.io

**Premium UI**: Community enhancement project

## 🙏 Credits

- **Game Engine**: Anslo (slowroads.io)
- **Original DRIFTFUSION**: Multiplayer foundation
- **Fonts**: 
  - Orbitron (Google Fonts)
  - Rajdhani (Google Fonts)
  - Inter (Google Fonts)
- **Icons**: System emoji + Custom SVG

## 🗺️ Roadmap

### Version 2.1 (Planned)
- [ ] Additional paint finishes (matte, chameleon)
- [ ] Custom wheel colors
- [ ] Window tint options
- [ ] Spoiler customization

### Version 2.2 (Planned)
- [ ] Replay/recording system
- [ ] Ghost car racing
- [ ] Time trial mode
- [ ] Best lap tracking

### Version 3.0 (Future)
- [ ] Full WebRTC multiplayer
- [ ] Voice chat
- [ ] Persistent profiles
- [ ] Global leaderboards
- [ ] Custom track sharing

## 🐛 Troubleshooting

### UI Not Appearing
1. Check browser console for errors
2. Ensure all files are in correct locations
3. Try clearing browser cache

### Car Color Not Changing
- Some car models may have multiple materials
- Check console for "scene traversal" messages
- Game must be fully loaded

### Performance Issues
- Disable animations in settings
- Close other browser tabs
- Update graphics drivers

## 📞 Support

For issues:
1. Check [Documentation](premium-ui/docs/)
2. Review [Changelog](premium-ui/docs/CHANGELOG.md)
3. Search existing issues
4. Create new issue with details

---

**Enjoy your premium driving experience!** 🏎️✨

*Version 2.0.0 | Premium Edition*
