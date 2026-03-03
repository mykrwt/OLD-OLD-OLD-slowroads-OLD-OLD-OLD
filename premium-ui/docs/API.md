# Premium UI API Documentation

Complete API reference for Slow Roads Premium UI v2.0.0

## Table of Contents

- [Global API](#global-api)
- [State Management](#state-management)
- [Car Module](#car-module)
- [Road Module](#road-module)
- [P2P Module](#p2p-module)
- [UI Controller](#ui-controller)
- [Toast System](#toast-system)
- [Events](#events)

---

## Global API

### `window.PremiumUI`

Main entry point for all Premium UI functionality.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `version` | `string` | Current version (e.g., "2.0.0") |
| `state` | `Object` | Reactive state object |

#### Methods

##### `setCarColor(color, name)`

Changes the player's car color.

**Parameters:**
- `color` (string): Hex color code (e.g., "#ff0000")
- `name` (string, optional): Display name for the color

**Example:**
```javascript
PremiumUI.setCarColor('#00f0ff', 'Electric Cyan');
```

##### `setRoadPreset(presetId)`

Applies a road texture preset.

**Parameters:**
- `presetId` (string): Preset identifier (e.g., "carbon", "neon")

**Example:**
```javascript
PremiumUI.setRoadPreset('mars');
```

##### `showToast(message, type, duration)`

Displays a toast notification.

**Parameters:**
- `message` (string): Message to display
- `type` (string): One of "info", "success", "error", "warning"
- `duration` (number): Duration in milliseconds (default: 3000)

**Example:**
```javascript
PremiumUI.showToast('Connected!', 'success', 5000);
```

##### `toggleSidebar()`

Toggles the customization sidebar visibility.

**Example:**
```javascript
PremiumUI.toggleSidebar();
```

---

## State Management

### `PremiumUI.state`

Centralized state object that updates reactively.

#### Structure

```javascript
{
  ui: {
    sidebarOpen: boolean,
    activeTab: string,
    toastQueue: Array
  },
  car: {
    color: string,        // Hex color
    texture: string,      // Texture ID
    neonEnabled: boolean,
    neonColor: string
  },
  road: {
    texture: string,      // Preset ID
    theme: string
  },
  multiplayer: {
    connected: boolean,
    peers: Array,
    isHost: boolean,
    localCode: string|null
  }
}
```

#### Usage

```javascript
// Read state
console.log(PremiumUI.state.car.color);

// Watch for changes (using Proxy)
// Changes automatically update the UI
```

---

## Car Module

### Car Colors

Available colors in `CAR_COLORS` array:

| Name | Hex | Type |
|------|-----|------|
| Rosso Corsa | #ff0000 | solid |
| Midnight Blue | #001f3f | solid |
| Gunmetal | #2c3e50 | metallic |
| Pearl White | #f5f5f0 | pearl |
| Liquid Gold | #ffd700 | metallic |
| Cyber Pink | #ff00aa | neon |
| Electric Cyan | #00f0ff | neon |
| Purple Haze | #8b5cf6 | metallic |
| Sunset Orange | #ff6b35 | solid |
| Forest Green | #228b22 | solid |
| Midnight Black | #0a0a0a | metallic |
| Chrome Silver | #c0c0c0 | chrome |

### Methods

##### `CarModule.setCarColor(hex, name)`

Sets the car color and applies it to the game.

##### `CarModule.applyCarColor(hex)`

Directly applies color to game meshes (internal use).

---

## Road Module

### Road Presets

Available presets in `ROAD_PRESETS` array:

| ID | Name | Description |
|----|------|-------------|
| asphalt | Midnight Asphalt | Classic dark road |
| carbon | Carbon Fiber | Racing weave pattern |
| neon | Neon Grid | Cyberpunk aesthetic |
| mars | Red Planet | Martian surface |
| ice | Arctic Ice | Frozen tundra |
| gold | Golden Highway | Luxury gold finish |

### Preset Structure

```javascript
{
  id: string,
  name: string,
  desc: string,
  color: string,           // Hex color
  roughness: number,       // 0-1
  metalness: number,       // 0-1
  emissive?: string,       // Optional glow color
  emissiveIntensity?: number
}
```

---

## P2P Module

### Connection States

- `offline` - Not connected
- `hosting` - Creating a game session
- `connecting` - Attempting to join
- `connected` - Successfully connected

### Methods

##### `P2PModule.hostGame()`

Creates a new game session and generates a connection code.

**Returns:** `Promise<void>`

##### `P2PModule.joinGame()`

Connects to a game using the code from the input field.

**Returns:** `Promise<void>`

##### `P2PModule.disconnect()`

Disconnects from the current session.

##### `P2PModule.broadcast(data)`

Sends data to all connected peers.

**Parameters:**
- `data` (Object): Data to broadcast

**Example:**
```javascript
PremiumUI.state.multiplayer.peers.forEach(peer => {
  // Send to each peer
});
```

---

## UI Controller

### Methods

##### `UIController.openSidebar()`

Opens the customization sidebar.

##### `UIController.closeSidebar()`

Closes the customization sidebar.

##### `UIController.switchTab(tabId)`

Switches to a specific tab.

**Parameters:**
- `tabId` (string): "customization", "multiplayer", or "settings"

##### `UIController.updateSpeed(kmh)`

Updates the speedometer display.

**Parameters:**
- `kmh` (number): Speed in kilometers per hour

##### `UIController.updateDistance(meters)`

Updates the distance display.

**Parameters:**
- `meters` (number): Distance in meters

##### `UIController.updateTime(seconds)`

Updates the time display.

**Parameters:**
- `seconds` (number): Elapsed time in seconds

---

## Toast System

### Toast Types

| Type | Icon | Use Case |
|------|------|----------|
| info | ℹ️ | General information |
| success | ✓ | Successful operations |
| error | ✕ | Error messages |
| warning | ⚠️ | Warnings |

### Methods

##### `Toast.show(message, type, duration)`

Displays a toast notification.

**Example:**
```javascript
// Simple toast
Toast.show('Hello!');

// Error with custom duration
Toast.show('Connection failed', 'error', 5000);
```

---

## Events

### Custom Events

Premium UI dispatches custom events for integration:

#### `premium:carColorChange`

Fired when car color changes.

**Detail:**
```javascript
{
  color: string  // Hex color code
}
```

**Example:**
```javascript
window.addEventListener('premium:carColorChange', (e) => {
  console.log('Color changed to:', e.detail.color);
});
```

#### `premium:roadTextureChange`

Fired when road texture changes.

**Detail:**
```javascript
{
  preset: Object  // Full preset object
}
```

**Example:**
```javascript
window.addEventListener('premium:roadTextureChange', (e) => {
  console.log('New road:', e.detail.preset.name);
});
```

---

## CSS Variables

Customizable CSS custom properties:

```css
:root {
  /* Primary Colors */
  --primary-cyan: #00f0ff;
  --primary-magenta: #ff00aa;
  --primary-gold: #ffd700;
  
  /* Background Colors */
  --bg-dark: #0a0a0f;
  --bg-card: rgba(15, 15, 25, 0.85);
  --bg-glass: rgba(20, 20, 35, 0.6);
  
  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.5);
}
```

---

## Utility Functions

### `Utils`

Internal utility functions:

##### `Utils.generateId()`

Generates a random ID string.

**Returns:** `string` (8-character uppercase)

##### `Utils.throttle(fn, limit)`

Throttles a function call.

##### `Utils.debounce(fn, delay)`

Debounces a function call.

##### `Utils.hexToRgb(hex)`

Converts hex to RGB object.

**Returns:** `{ r, g, b }` or `null`

##### `Utils.lerp(start, end, t)`

Linear interpolation.

---

## Configuration

### Config Object

```javascript
const CONFIG = {
  version: '2.0.0',
  debug: false,        // Enable console logging
  animations: true,    // Enable CSS animations
  syncRate: 20,        // Network sync rate (Hz)
  maxPeers: 8          // Maximum multiplayer connections
};
```

### Changing Config

```javascript
// Enable debug mode
// Edit premium-ui.js and set:
const CONFIG = {
  debug: true,
  // ...
};
```

---

## Error Handling

### Common Errors

#### "Game canvas not found"
- Game hasn't loaded yet
- Wait for initialization

#### "Could not apply car color"
- Car mesh naming differs
- Check browser console for object names

#### "Failed to copy code"
- Clipboard API requires HTTPS
- User interaction required

### Debug Logging

Enable debug mode to see detailed logs:

```javascript
// In browser console after page load
const originalLog = console.log;
console.log = (...args) => {
  if (args[0]?.includes?.('[PREMIUM]')) {
    originalLog(...args);
  }
};
```

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Glassmorphism | 76+ | 70+ | 15+ | 79+ |
| WebRTC | 23+ | 22+ | 11+ | 79+ |
| Clipboard API | 66+ | 63+ | 13.1+ | 79+ |
| CSS Variables | 49+ | 31+ | 9.1+ | 15+ |

---

## TypeScript Declarations

```typescript
declare namespace PremiumUI {
  interface State {
    ui: {
      sidebarOpen: boolean;
      activeTab: string;
    };
    car: {
      color: string;
      texture: string;
      neonEnabled: boolean;
    };
    road: {
      texture: string;
    };
    multiplayer: {
      connected: boolean;
      peers: Array<{ id: string; ping: number }>;
    };
  }

  function setCarColor(color: string, name?: string): void;
  function setRoadPreset(presetId: string): void;
  function showToast(message: string, type?: string, duration?: number): void;
  function toggleSidebar(): void;
  
  const state: State;
  const version: string;
}
```
