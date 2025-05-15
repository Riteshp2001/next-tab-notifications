"use client";

/**
 * @file useTabNotification.ts
 * @description A React hook that changes the tab title and favicon when the user switches to another tab.
 * Supports text, emoji, and image URLs for favicons.
 * @version 1.0.0
 * @license MIT
 */

import { useEffect, useRef, useState } from "react";

/**
 * Configuration options for the useTabNotification hook
 *
 * @interface UseTabNotificationOptions
 * @property {string} [title] - The title to display when the tab is hidden or notification is active
 * @property {(string | EmojiConfig)[]} [favicons] - Array of favicon URLs or emoji configurations to cycle through
 * @property {number} [faviconInterval] - Interval in milliseconds for cycling through favicons (default: 1000ms)
 * @property {boolean} [manualTrigger] - If true, the notification will only be triggered manually, not on tab visibility change
 */
export interface UseTabNotificationOptions {
	/** The title to display when the tab is hidden or notification is active */
	title?: string;
	/** Array of favicon URLs or emoji configurations to cycle through */
	favicons?: (string | EmojiConfig)[];
	/** Interval in milliseconds for cycling through favicons (default: 1000ms) */
	faviconInterval?: number;
	/** If true, the notification will only be triggered manually, not on tab visibility change */
	manualTrigger?: boolean;
}

/**
 * Configuration for emoji favicons
 *
 * @interface EmojiConfig
 * @property {string} emoji - The emoji character to use as favicon
 * @property {string} [backgroundColor] - Optional background color for the emoji (default: 'transparent')
 * @property {number} [size] - Optional size for the emoji favicon (default: 32)
 */
export interface EmojiConfig {
	/** The emoji character to use as favicon */
	emoji: string;
	/** Optional background color for the emoji (default: 'transparent') */
	backgroundColor?: string;
	/** Optional size for the emoji favicon (default: 32) */
	size?: number;
}

/**
 * A React hook that changes the tab title and favicon when the user switches to another tab
 * or when manually triggered.
 *
 * @example
 * // Basic usage with just a title change
 * const { startNotification, stopNotification } = useTabNotification({
 *   title: "Come back! 👋",
 *   manualTrigger: true
 * });
 *
 * @example
 * // Advanced usage with emoji favicons
 * const { isActive } = useTabNotification({
 *   title: "You have unread messages!",
 *   favicons: [
 *     { emoji: "🔔", backgroundColor: "#0078d4" },
 *     { emoji: "📬", backgroundColor: "#0078d4" }
 *   ],
 *   faviconInterval: 500 // Faster animation
 * });
 *
 * @param {UseTabNotificationOptions} options - Configuration options
 * @returns {Object} Control methods and state for the notification
 */
export function useTabNotification({
	title: notificationTitle,
	favicons: notificationFavicons = [],
	faviconInterval = 1000,
	manualTrigger = false,
}: UseTabNotificationOptions = {}) {
	// Track if the notification is currently active
	const [isActive, setIsActive] = useState<boolean>(false);

	// Store the original document title to restore it later
	const originalTitleRef = useRef<string>("");

	// Store the original favicon elements to restore them later
	const originalIconsRef = useRef<HTMLLinkElement[]>([]);

	// Track the current index in the favicons array
	const faviconIndexRef = useRef<number>(0);

	// Store the interval ID for the favicon animation
	const intervalIdRef = useRef<number | null>(null);

	/**
	 * Converts an emoji to a data URL that can be used as a favicon
	 *
	 * @param {string} emoji - The emoji character to convert
	 * @param {string} backgroundColor - Background color for the emoji
	 * @param {number} size - Size of the emoji favicon in pixels
	 * @returns {string} Data URL for the emoji favicon
	 */
	const emojiToDataURL = (
		emoji: string,
		backgroundColor = "transparent",
		size = 32
	): string => {
		// Create a canvas element to draw the emoji
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;

		const ctx = canvas.getContext("2d");
		if (!ctx) return "";

		// Fill background if specified
		if (backgroundColor !== "transparent") {
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, size, size);
		}

		// Draw the emoji centered on the canvas
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = `${Math.floor(size * 0.7)}px Arial`;
		ctx.fillText(emoji, size / 2, size / 2);

		// Convert canvas to data URL
		return canvas.toDataURL("image/png");
	};

	/**
	 * Helper function to get existing favicon link elements or create new ones if none exist
	 * @returns {HTMLLinkElement[]} Array of favicon link elements
	 */
	const ensureFaviconLinks = (): HTMLLinkElement[] => {
		// Ensure we're in a browser environment
		if (typeof document === "undefined") return [];

		const head = document.head || document.getElementsByTagName("head")[0];
		const existing: HTMLLinkElement[] = [];

		// Find all existing favicon links
		Array.from(head.querySelectorAll('link[rel*="icon"]')).forEach((link) => {
			existing.push(link as HTMLLinkElement);
		});

		// If we found existing favicon links, return them
		if (existing.length) return existing;

		// Otherwise, create default icons
		const icon = document.createElement("link");
		icon.rel = "icon";
		icon.type = "image/x-icon";
		head.appendChild(icon);

		const apple = document.createElement("link");
		apple.rel = "apple-touch-icon";
		head.appendChild(apple);

		return [icon, apple];
	};

	/**
	 * Sets a favicon URL or emoji to all favicon link elements
	 * @param {string | EmojiConfig} favicon - The favicon URL or emoji configuration to set
	 */
	const setFavicon = (favicon: string | EmojiConfig): void => {
		const links = ensureFaviconLinks();

		// Convert the favicon to a URL if it's an emoji configuration
		let faviconUrl: string;
		if (typeof favicon === "string") {
			faviconUrl = favicon;
		} else {
			// It's an emoji configuration
			faviconUrl = emojiToDataURL(
				favicon.emoji,
				favicon.backgroundColor,
				favicon.size
			);
		}

		// Set the favicon URL to all link elements
		links.forEach((link) => {
			link.href = faviconUrl;
		});
	};

	/**
	 * Starts the favicon animation cycle
	 */
	const startFaviconAnimation = (): void => {
		// Don't do anything if no favicons were provided
		if (!notificationFavicons.length) return;

		// Reset the index and set the first favicon
		faviconIndexRef.current = 0;
		setFavicon(notificationFavicons[0]);

		// Set up an interval to cycle through the favicons
		intervalIdRef.current = window.setInterval(() => {
			faviconIndexRef.current =
				(faviconIndexRef.current + 1) % notificationFavicons.length;
			setFavicon(notificationFavicons[faviconIndexRef.current]);
		}, faviconInterval);
	};

	/**
	 * Stops the favicon animation and restores the original favicons
	 */
	const stopFaviconAnimation = (): void => {
		// Clear the interval if it exists
		if (intervalIdRef.current !== null) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}

		// Restore original icons
		originalIconsRef.current.forEach((orig, idx) => {
			const currentLinks = ensureFaviconLinks();
			if (currentLinks[idx]) currentLinks[idx].href = orig.href;
		});
	};

	/**
	 * Starts the tab notification (changes title and favicon)
	 */
	const startNotification = (): void => {
		// Skip if already active or if we're not in a browser environment
		if (isActive || typeof document === "undefined") return;

		// Save original title if not already saved
		if (!originalTitleRef.current) {
			originalTitleRef.current = document.title;
		}

		// Save original favicons if not already saved
		if (originalIconsRef.current.length === 0) {
			originalIconsRef.current = ensureFaviconLinks().map(
				(link) => link.cloneNode(true) as HTMLLinkElement
			);
		}

		// Change title if one was provided
		if (notificationTitle) {
			document.title = notificationTitle;
		}

		// Start favicon animation if favicons were provided
		if (notificationFavicons.length > 0) {
			startFaviconAnimation();
		}

		// Update active state
		setIsActive(true);
	};

	/**
	 * Stops the tab notification and restores the original title and favicon
	 */
	const stopNotification = (): void => {
		// Skip if not active or if we're not in a browser environment
		if (!isActive || typeof document === "undefined") return;

		// Restore original title
		document.title = originalTitleRef.current;

		// Stop animation & restore favicons
		stopFaviconAnimation();

		// Update active state
		setIsActive(false);
	};

	/**
	 * Toggle the notification state
	 */
	const toggleNotification = (): void => {
		if (isActive) {
			stopNotification();
		} else {
			startNotification();
		}
	};

	useEffect(() => {
		// Skip if we're not in a browser environment
		if (typeof document === "undefined") return;

		// Save original title
		originalTitleRef.current = document.title;

		// Save original favicons
		originalIconsRef.current = ensureFaviconLinks().map(
			(link) => link.cloneNode(true) as HTMLLinkElement
		);

		// If manual trigger is enabled, don't set up visibility change handler
		if (manualTrigger) return;

		/**
		 * Handler for the visibilitychange event
		 * Changes the title and favicon when the tab is hidden,
		 * and restores them when the tab becomes visible again
		 */
		const onVisibilityChange = (): void => {
			if (document.hidden) {
				startNotification();
			} else {
				stopNotification();
			}
		};

		// Add event listener for tab visibility changes
		document.addEventListener("visibilitychange", onVisibilityChange);

		// Clean up event listener and animations when the component unmounts
		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			stopNotification();
		};
	}, [manualTrigger]); // Only re-run if manualTrigger changes

	// Return control methods and state
	return {
		isActive,
		startNotification,
		stopNotification,
		toggleNotification,
	};
}

// Default export for easier importing
export default useTabNotification;
