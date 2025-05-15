"use client";

import React, { useState } from "react";
import { useTabNotification, type EmojiConfig } from "next-tab-notifications";

export default function Home() {
	const [title, setTitle] = useState<string>("📢 Come back to the app!");
	const [faviconType, setFaviconType] = useState<string>("emoji");
	const [emojiList, setEmojiList] = useState<string>("🔔,📬,🔔,📬");
	const [urlList, setUrlList] = useState<string>(
		"/favicon-1.ico,/favicon-2.ico"
	);
	const [interval, setInterval] = useState<number>(800);
	const [manualTrigger, setManualTrigger] = useState<boolean>(true);
	const [bgColor, setBgColor] = useState<string>("#0078d4");

	const getFavicons = (): (string | EmojiConfig)[] => {
		if (faviconType === "emoji") {
			return emojiList
				.split(",")
				.map((emoji) => emoji.trim())
				.filter(Boolean)
				.map((emoji) => ({
					emoji,
					backgroundColor: bgColor,
					size: 32,
				}));
		} else {
			return urlList
				.split(",")
				.map((url) => url.trim())
				.filter(Boolean);
		}
	};

	const { isActive, startNotification, stopNotification, toggleNotification } =
		useTabNotification({
			title,
			favicons: getFavicons(),
			faviconInterval: interval,
			manualTrigger,
		});

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
				<div className="grid lg:grid-cols-2 gap-8">
					{/* Configuration Panel */}
					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
							Configuration
						</h2>

						<div className="space-y-6">
							{/* Title Input */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Notification Title
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
									placeholder="Enter notification title..."
								/>
							</div>

							{/* Favicon Type Selection */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Favicon Type
								</label>
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
									<input
										type="text"
										value={urlList}
										onChange={(e) => setUrlList(e.target.value)}
										className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
										placeholder="/favicon-1.ico,/favicon-2.ico"
									/>
								</div>
							)}

							{/* Interval Slider */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Animation Interval: {interval}ms
								</label>
								<input
									type="range"
									min="100"
									max="2000"
									step="100"
									value={interval}
									onChange={(e) => setInterval(Number(e.target.value))}
									className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
								/>
							</div>

							{/* Manual Trigger Toggle */}
							<div className="flex items-center justify-between">
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Manual Trigger
								</label>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={manualTrigger}
										onChange={(e) => setManualTrigger(e.target.checked)}
										className="sr-only peer"
									/>
									<div className="w-14 h-7 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
								</label>
							</div>
						</div>
					</div>

					{/* Preview Panel */}
					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
							Preview & Controls
						</h2>

						{/* Status Indicator */}
						<div
							className={`p-4 rounded-xl mb-8 ${
								isActive
									? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
									: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
							}`}
						>
							<div className="flex items-center justify-between">
								<span className="font-medium">
									Status: {isActive ? "Active" : "Inactive"}
								</span>
								<span className="text-sm">
									{isActive ? "Notification is running" : "Ready to start"}
								</span>
							</div>
						</div>

						{/* Control Buttons */}
						<div className="space-y-4">
							<button
								onClick={toggleNotification}
								className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
									isActive
										? "bg-red-600 hover:bg-red-700 text-white"
										: "bg-blue-600 hover:bg-blue-700 text-white"
								}`}
							>
								{isActive ? "Stop Notification" : "Start Notification"}
							</button>
							{isActive && (
								<button
									onClick={stopNotification}
									className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-all duration-200 text-gray-900 dark:text-gray-100"
								>
									Reset
								</button>
							)}
						</div>

						{/* Quick Guide */}
						<div className="mt-8 bg-blue-50 dark:bg-blue-900 p-6 rounded-xl">
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
								<li>
									Try different emojis and colors for unique notifications
								</li>
								<li>Add and configure sounds for audio notifications</li>
							</ol>
						</div>

						{/* Code Example */}
						<div className="mt-8 bg-gray-900 p-6 rounded-xl">
							<h3 className="font-semibold text-gray-100 mb-4">Code Example</h3>
							<pre className="text-sm text-gray-300 overflow-x-auto">
								{`const { isActive, startNotification } = useTabNotification({
  title: "${title}",
  favicons: ${JSON.stringify(getFavicons(), null, 2)},
  faviconInterval: ${interval},
  manualTrigger: ${manualTrigger},
});`}
							</pre>
						</div>
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
