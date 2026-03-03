# 🏎️ Slow Roads Premium UI

A modern, feature-rich overlay system for Slow Roads with car customization, road textures, and multiplayer capabilities.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-CC%20BY--NC--ND%204.0-lightgrey)

## ✨ Features

### 🎨 Car Customization
- **12 Premium Colors** - From Rosso Corsa to Chrome Silver
- **Color Types** - Solid, Metallic, Pearl, Neon, and Chrome finishes
- **Live Preview** - Changes apply immediately to your vehicle
- **Neon Underglow** - Toggleable underglow effects (coming soon)

### 🛣️ Road Textures
- **6 Road Presets**:
  - Midnight Asphalt (classic dark)
  - Carbon Fiber (racing weave)
  - Neon Grid (cyberpunk)
  - Red Planet (Martian)
  - Arctic Ice (frozen)
  - Golden Highway (luxury)
- **Material Properties** - Each preset has unique roughness and metalness

### 👥 Multiplayer
- **P2P Connection** - WebRTC-based peer-to-peer networking
- **Host/Join System** - Easy session creation with shareable codes
- **Player Management** - See connected players with ping indicators
- **State Synchronization** - Share car colors and positions

### 🎯 Premium UI
- **Glassmorphism Design** - Modern translucent aesthetics
- **Animated Speedometer** - Cyan/Magenta/Gold gradient ring
- **Mini Stats** - Distance and time tracking
- **Toast Notifications** - Non-intrusive feedback system
- **Keyboard Shortcuts** - Quick access to features

## 🚀 Installation

### Option 1: Direct Include
Add to your `index.html` after the original game scripts:

```html
<!-- Premium UI -->
<link rel="stylesheet" href="premium-ui/assets/css/premium-ui.css">
<script src="premium-ui/assets/js/premium-ui.js"></script>
```

### Option 2: Auto-Injector (Recommended)
Replace your `index.html` with the provided `index-premium.html` which automatically loads all Premium UI features.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `C` | Toggle Customization Sidebar |
| `M` | Open Multiplayer Tab |
| `ESC` | Close Sidebar |

## 📁 File Structure

```
premium-ui/
├── assets/
│   ├── css/
│   │   └── premium-ui.css      # Main stylesheet
│   ├── js/
│   │   └── premium-ui.js       # Main JavaScript module
│   ├── fonts/                  # Custom fonts (optional)
│   ├── images/                 # UI images
│   └── textures/               # Road textures
├── docs/
│   ├── README.md               # This file
│   ├── API.md                  # API documentation
│   └── CHANGELOG.md            # Version history
├── themes/                     # Custom theme files
└── index.html                  # Demo/launcher
```

## 🔌 API Reference

### Global Object: `window.PremiumUI`

```javascript
// Set car color
PremiumUI.setCarColor('#ff0000', 'Rosso Corsa');

// Set road texture
PremiumUI.setRoadPreset('carbon');

// Show custom toast
PremiumUI.showToast('Hello!', 'success');

// Toggle sidebar
PremiumUI.toggleSidebar();

// Access state
console.log(PremiumUI.state.car.color);
console.log(PremiumUI.state.road.texture);
```

### Events

```javascript
// Listen for car color changes
window.addEventListener('premium:carColorChange', (e) => {
  console.log('New color:', e.detail.color);
});

// Listen for road texture changes
window.addEventListener('premium:roadTextureChange', (e) => {
  console.log('New preset:', e.detail.preset);
});
```

## 🎨 Customization

### Adding New Car Colors

Edit `premium-ui.js` and add to `CAR_COLORS` array:

```javascript
const CAR_COLORS = [
  // ... existing colors
  { name: 'Custom Color', hex: '#123456', type: 'metallic' }
];
```

### Adding New Road Presets

Add to `ROAD_PRESETS` array:

```javascript
const ROAD_PRESETS = [
  // ... existing presets
  {
    id: 'custom',
    name: 'Custom Road',
    desc: 'Description here',
    color: '#123456',
    roughness: 0.5,
    metalness: 0.5
  }
];
```

### Creating Custom Themes

Create a new CSS file in `themes/`:

```css
/* themes/custom-theme.css */
:root {
  --primary-cyan: #your-color;
  --primary-magenta: #your-color;
  --primary-gold: #your-color;
}
```

## 🛠️ Development

### Building
No build step required! Pure vanilla JavaScript and CSS.

### Debug Mode
Enable debug logging:

```javascript
// In browser console
PremiumUI.state.config.debug = true;
```

### File Structure for Contributors

```
src/
├── modules/
│   ├── CarModule.js        # Car customization
│   ├── RoadModule.js       # Road textures
│   ├── P2PModule.js        # Multiplayer networking
│   ├── UIController.js     # UI management
│   └── GameBridge.js       # Game integration
├── utils/
│   └── Utils.js            # Helper functions
└── index.js                # Entry point
```

## 📜 License

This project is licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)

- **BY** - Attribution required
- **NC** - Non-commercial use only
- **ND** - No derivative works

Original Slow Roads by [Anslo](https://slowroads.io)

## 🙏 Credits

- **Original Game**: Anslo (slowroads.io)
- **Premium UI**: Community enhancement
- **Fonts**: Orbitron, Rajdhani (Google Fonts)
- **Icons**: System emoji and custom SVG

## 🐛 Troubleshooting

### UI Not Appearing
1. Check browser console for errors
2. Ensure scripts load after game initialization
3. Verify file paths are correct

### Car Color Not Changing
1. Game may use different object naming
2. Check browser console for "scene traversal" logs
3. Some car models may have multiple materials

### Multiplayer Not Connecting
1. WebRTC requires HTTPS (except localhost)
2. Check firewall settings
3. Some networks block P2P connections

## 📞 Support

For issues and feature requests:
1. Check existing documentation
2. Search closed issues
3. Create a new issue with:
   - Browser version
   - Steps to reproduce
   - Console error messages

## 🗺️ Roadmap

- [ ] Additional car paint finishes (matte, chameleon)
- [ ] Custom decal system
- [ ] Replay/recording system
- [ ] Leaderboards
- [ ] Mobile-optimized UI
- [ ] VR support hints

---

**Enjoy your premium driving experience!** 🏎️✨
