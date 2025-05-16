"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTabNotification, EmojiConfig, ManualConfig } from "next-tab-notifications";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export default function Home() {
  // Title can be a string or array for cycling
  const [titleInput, setTitleInput] = useState<string>(
    "📢 Come back to the app!"
  );
  const [titleArrayMode, setTitleArrayMode] = useState<boolean>(false);
  const [faviconType, setFaviconType] = useState<string>("emoji");
  const [emojiList, setEmojiList] = useState<string>("🔔,📬,🔔,📬");
  const [urlList, setUrlList] = useState<string>(
    "/favicon-1.ico,/favicon-2.ico"
  );
  const [faviconInterval, setFaviconInterval] = useState<number>(800);
  const [titleInterval, setTitleInterval] = useState<number>(2000);
  const [manualTitle, setManualTitle] = useState<boolean>(false);
  const [manualFavicon, setManualFavicon] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("#0078d4");

  // Parse titles for cycling
  const titles = useMemo(() => {
    if (titleArrayMode) {
      return titleInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    return titleInput;
  }, [titleInput, titleArrayMode]);

  // Parse favicons
  const favicons = useMemo<(string | EmojiConfig)[]>(() => {
    if (faviconType === "emoji") {
      return emojiList
        .split(",")
        .map((emoji) => emoji.trim())
        .filter(Boolean)
        .map((emoji) => ({ emoji, backgroundColor: bgColor, size: 32 }));
    } else {
      return urlList
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
    }
  }, [faviconType, emojiList, urlList, bgColor]);

  // Manual trigger config
  const manualTrigger: boolean | ManualConfig = useMemo(() => {
    if (manualTitle && manualFavicon) return true;
    if (!manualTitle && !manualFavicon) return false;
    return { title: manualTitle, favicon: manualFavicon };
  }, [manualTitle, manualFavicon]);

  const { isActive, startNotification, stopNotification, toggleNotification } =
    useTabNotification({
      titles,
      favicons,
      faviconInterval,
      titleInterval,
      manualTrigger,
    });

  // For code highlighting
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const codeString = `const { isActive, startNotification } = useTabNotification({\n  titles: ${titleArrayMode ? JSON.stringify(titles) : `"${titleInput}"`},\n  favicons: ${JSON.stringify(favicons, null, 2)},\n  faviconInterval: ${faviconInterval},\n  titleInterval: ${titleInterval},\n  manualTrigger: ${JSON.stringify(manualTrigger)},\n});`;
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [titleArrayMode, titles, favicons, faviconInterval, titleInterval, manualTrigger]);

  // Copy to clipboard handler
  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Next Tab Notifications
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A powerful Next.js / React hook that changes the tab title and
            favicon when the user switches to another tab. Perfect for
            notifications, alerts, and user engagement.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8 items-stretch">
          {/* Configuration & Preview Combined Panel */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="mb-1">Preview & Controls</span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: isActive
                      ? "linear-gradient(90deg,#22c55e33,#22d3ee33)"
                      : "linear-gradient(90deg,#3b82f633,#6366f133)",
                    color: isActive ? "#22c55e" : "#3b82f6",
                  }}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </h3>
              {/* Status Indicator */}
              <div
                className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${
                  isActive
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                }`}
              >
                <span className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{
                    background: isActive ? "#22c55e" : "#3b82f6",
                    boxShadow: isActive
                      ? "0 0 0 2px #bbf7d0"
                      : "0 0 0 2px #dbeafe",
                  }}
                />
                <span className="font-extrabold text-lg">
                  {isActive ? "Notification is running" : "Ready to start"}
                </span>
              </div>
              {/* Control Buttons */}
              <div className="space-y-4">
                <button
                  onClick={toggleNotification}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 shadow ${
                    isActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  {isActive ? "Stop Notification" : "Start Notification"}
                </button>
                {isActive && (
                  <button
                    onClick={stopNotification}
                    className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-all duration-200 text-gray-900 dark:text-gray-100"
                    style={{ cursor: "pointer" }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Configuration 
            </h2>
            {/* Manual Trigger Toggles at the top */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-4 cursor-pointer">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Manual Title Trigger
                  </span>
                  <span className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={manualTitle}
                      onChange={() => setManualTitle((v) => !v)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 dark:bg-gray-600 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 transition peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white" />
                  </span>
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 max-w-xs">
                  When enabled, the tab title will only change when you manually
                  start the notification (not on tab switch).
                </span>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-4 cursor-pointer">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Manual Favicon Trigger
                  </span>
                  <span className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={manualFavicon}
                      onChange={() => setManualFavicon((v) => !v)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 dark:bg-gray-600 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 transition peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white" />
                  </span>
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 max-w-xs">
                  When enabled, the favicon will only change when you manually
                  start the notification (not on tab switch).
                </span>
              </div>
            </div>
            {/* Configuration Section */}
            <div className="space-y-6">
              {/* Title Input & Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  Notification Title
                  <span className="ml-2 text-xs text-gray-500 flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={titleArrayMode}
                      onChange={() => setTitleArrayMode((v) => !v)}
                      className="mr-1"
                    />
                    <span>Cycle (comma - seperated)</span>
                  </span>
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                  Enter a single title or enable cycling to rotate between
                  multiple titles separated by ",".
                </span>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder={
                    titleArrayMode
                      ? "Title 1 | Title 2 | ..."
                      : "Enter notification title..."
                  }
                />
              </div>
              {/* Title Interval (if cycling) */}
              {titleArrayMode && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title Animation Interval: {titleInterval}ms
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    Adjust how quickly the title cycles through your list.
                  </span>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={titleInterval}
                    onChange={(e) => setTitleInterval(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}
              {/* Favicon Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Favicon Type
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                  Choose between emoji-based or image URL-based favicons for
                  your notification.
                </span>
                <div className="flex gap-4">
                  {["emoji", "url"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        checked={faviconType === type}
                        onChange={() => setFaviconType(type)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {type} Favicons
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Emoji Configuration */}
              {faviconType === "emoji" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Emoji List (comma-separated)
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                      Enter one or more emojis, separated by commas, to animate
                      as your favicon.
                    </span>
                    <input
                      type="text"
                      value={emojiList}
                      onChange={(e) => setEmojiList(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="🔔,📬,🔔,📬"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Background Color
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                      Set the background color for your emoji favicon.
                    </span>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-12 w-12 rounded-xl cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL List (comma-separated)
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    Enter one or more image URLs, separated by commas, to
                    animate as your favicon.
                  </span>
                  <input
                    type="text"
                    value={urlList}
                    onChange={(e) => setUrlList(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="/favicon-1.ico,/favicon-2.ico"
                  />
                </div>
              )}
              {/* Favicon Interval Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Favicon Animation Interval: {faviconInterval}ms
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                  Adjust how quickly the favicon cycles through your list.
                </span>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={faviconInterval}
                  onChange={(e) => setFaviconInterval(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
  
          </div>
        </div>

        {/* Quick Guide & Code Example as full-width row */}
        <div className="grid grid-cols-1 gap-8 mt-8">
          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl w-full">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Quick Guide
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-blue-800 dark:text-blue-200">
              <li>
                Adjust your notification settings in the configuration panel
              </li>
              <li>Click "Start Notification" to preview the changes</li>
              <li>
                Switch tabs to see it in action (if manual trigger is off)
              </li>
              <li>Try different emojis and colors for unique notifications</li>
              <li>Add and configure sounds for audio notifications</li>
            </ol>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl w-full relative">
            <h3 className="font-semibold text-gray-100 mb-4">Code Example</h3>

            <pre className="text-sm text-gray-300 overflow-x-auto rounded-xl mt-2" style={{borderRadius: '1rem'}}>
				            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 text-gray-100 text-xs px-3 py-1 rounded-lg shadow transition flex items-center gap-1"
              style={{ cursor: "pointer" }}
              aria-label="Copy code"
            >
              {copied ? (
                <span>Copied!</span>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block align-middle"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2"/></svg>
                  Copy
                </>
              )}
            </button>
              <code ref={codeRef} className="language-js">
                {codeString}
              </code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p>
            Made with{" "}
            <span role="img" aria-label="love">
              ❤️
            </span>{" "}
            by{" "}
            <a
              href="https://riteshprasad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
            >
              Ritesh P
            </a>
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <a
              href="https://github.com/Riteshp2001/tab-notifications"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
            >
              View on GitHub
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
