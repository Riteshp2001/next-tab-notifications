> # next-tab-notification

A lightweight, versatile Next.js/React hook that updates the browser tab's title and favicon—emoji or image—when users navigate away or via manual triggers. Keep your app top‑of‑mind and boost engagement with minimal dependencies and full TypeScript support.

<div align="center">
  <h2>
      🎯 Try it Live! ✨
  </h2>
  <p align="center">
    <strong>Ready to supercharge your web app?</strong><br/>
    See how tab notifications can transform your user experience with our interactive demo.<br/>
    <em>Click, explore, and watch the magic happen! ✨🚀</em>
  </p>
  <a href="https://next-tab-notifications.vercel.app" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/LIVE_DEMO-Try_Now!-blue?style=for-the-badge&logo=react" alt="Live Demo" />
  </a>
</div>
---

## 🚀 Table of Contents

1. [Features](#-features)
2. [Installation](#-installation)
3. [Usage](#-usage)
   - [Basic](#basic-usage)
   - [Emoji Favicons](#using-emoji-favicons)
   - [Manual Trigger](#manual-trigger)
   - [Demo Component](#using-the-demo-component)
4. [API Reference](#-api-reference)
   - [`useTabNotification(options)`](#usetabnotificationoptions)
   - [Options](#options)
   - [Return Value](#return-value)
5. [How It Works](#-how-it-works)
6. [Use Cases](#-use-cases)
7. [Browser Compatibility](#-browser-compatibility)
8. [Advanced Usage](#-advanced-usage)
9. [License](#-license)

---

## ✨ Features

- 🔔 **Title Change**: Auto-update the document title when the page is hidden or via manual trigger.
- 😀 **Emoji Favicons**: Render and animate emojis as favicons with customizable background.
- 🖼️ **Image Favicons**: Cycle through custom image URLs.
- 🔄 **Animation**: Control favicon animation speed via interval.
- 🔙 **Auto-Restore**: Revert to original title and favicon on focus.
- 🎮 **Manual Control**: Programmatically start, stop, or toggle notifications.
- 🎨 **Customization**: Specify background color and size for emoji favicons.
- 🪶 **Lightweight**: Minimal footprint with no external dependencies.
- 📱 **Universal**: Compatible with all modern browsers.
- 📦 **TypeScript**: Fully typed for seamless integration.
- 🎯 **Demo Included**: Fluent UI–based component showcasing core functionality.

---

## 📦 Installation

```bash
# npm
tpn install next-tab-notification

# yarn
yarn add next-tab-notification

# pnpm
pnpm add next-tab-notification
```

---

## 🚀 Usage

### Basic Usage

```jsx
import { useTabNotification } from "next-tab-notification";

function MyComponent() {
	const { isActive } = useTabNotification({ title: "Come back! 👋" });

	return (
		<div>
			<h1>My App</h1>
			<p>Switch tabs to see the title change.</p>
			<p>Status: {isActive ? "Active" : "Inactive"}</p>
		</div>
	);
}
```

### Using Emoji Favicons

```jsx
import { useTabNotification } from "next-tab-notification";

function ChatApp() {
	useTabNotification({
		title: "New messages! 📬",
		favicons: [
			{ emoji: "🔔", backgroundColor: "#0078d4" },
			{ emoji: "📬", backgroundColor: "#0078d4" },
		],
		faviconInterval: 500,
	});

	return null;
}
```

### Manual Trigger

```jsx
import { useTabNotification } from "next-tab-notification";
import { Button } from "@fluentui/react";

function NotificationDemo() {
	const { isActive, startNotification, stopNotification, toggleNotification } =
		useTabNotification({
			title: "Notification is active! 🔔",
			favicons: [
				{ emoji: "🔔", backgroundColor: "#0078d4" },
				{ emoji: "🔕", backgroundColor: "#0078d4" },
			],
			faviconInterval: 800,
			manualTrigger: true,
		});

	return (
		<div>
			<h1>Manual Notification Demo</h1>
			<p>Status: {isActive ? "Active" : "Inactive"}</p>
			<Button onClick={toggleNotification}>
				{isActive ? "Stop" : "Start"} Notification
			</Button>
			{isActive && <Button onClick={stopNotification}>Reset</Button>}
		</div>
	);
}
```

### Using the Demo Component

```jsx
import { TabNotificationDemo } from "next-tab-notification";

function App() {
	return (
		<div>
			<h1>My App</h1>
			<TabNotificationDemo />
		</div>
	);
}
```

---

## 📚 API Reference

### `useTabNotification(options)`

Main hook to control tab notifications.

#### Options

| Property          | Type                        | Default | Description                                                                       |
| ----------------- | --------------------------- | ------- | --------------------------------------------------------------------------------- |
| `title`           | `string`                    | `''`    | Title to display when notification is active.                                     |
| `favicons`        | `(string \| EmojiConfig)[]` | `[]`    | Array of image URLs or emoji objects to cycle.                                    |
| `faviconInterval` | `number`                    | `1000`  | Interval in milliseconds for favicon animation.                                   |
| `manualTrigger`   | `boolean`                   | `false` | If `true`, notifications only start via API calls, not on tab visibility changes. |

##### `EmojiConfig`

| Property          | Type     | Default         | Description                          |
| ----------------- | -------- | --------------- | ------------------------------------ |
| `emoji`           | `string` | **required**    | Emoji character for favicon.         |
| `backgroundColor` | `string` | `'transparent'` | Canvas background color.             |
| `size`            | `number` | `32`            | Size of generated favicon in pixels. |

#### Return Value

| Property             | Type         | Description                                   |
| -------------------- | ------------ | --------------------------------------------- |
| `isActive`           | `boolean`    | Notification state (active/inactive).         |
| `startNotification`  | `() => void` | Manually start the notification.              |
| `stopNotification`   | `() => void` | Stop notification and restore original state. |
| `toggleNotification` | `() => void` | Toggle between active and inactive states.    |

---

## 🔍 How It Works

1. **Page Visibility API**: Monitors `document.visibilityState` to detect tab changes.
2. **Dynamic Favicons**: Uses HTML5 Canvas to generate image blobs from emojis.
3. **Title Management**: Stores original `document.title` and restores it on focus.
4. **Animation Loop**: `setInterval` cycles through `favicons` array for animation.

---

## 🧪 Use Cases

- Chat and messaging apps for new message alerts.
- Email clients to highlight incoming mail.
- Social networks to notify mentions or likes.
- E‑commerce reminders for abandoned carts or completed orders.
- Dashboards for critical status updates.
- Collaboration tools to signal comments or edits.

---

## 🌐 Browser Compatibility

Supported in all modern browsers via the Page Visibility API:

- Chrome 33+
- Firefox 10+
- Safari 7+
- Edge 12+
- Opera 20+
- iOS Safari 7+
- Android Browser 4.4+

---

## 🛠️ Advanced Usage

Customize animation sequences or integrate with notification systems:

```jsx
// Alternating pattern
const favicons = [
	{ emoji: "🔔", backgroundColor: "#0078d4" },
	{ emoji: "🔕", backgroundColor: "#0078d4" },
];

// Counting pattern
const counting = [
	{ emoji: "1️⃣", backgroundColor: "#0078d4" },
	{ emoji: "2️⃣", backgroundColor: "#0078d4" },
	{ emoji: "3️⃣", backgroundColor: "#0078d4" },
];

// Mixed URLs and emojis
const mixed = ["/icon1.ico", { emoji: "📬", backgroundColor: "#0078d4" }];
```

Integrate with state management or effect hooks to trigger based on real events.

---

## 📝 License

MIT © [Ritesh Pandit](https://github.com/Riteshp2001)

> Also Last Thing Check out my [<span style="color: #0078d4">Portfolio</span>](https://riteshdpandit.vercel.app)
