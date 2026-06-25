# YouTube to Nadeko (Universal Redirector)

A lightweight WebExtension (Manifest V3) that automatically intercepts and redirects YouTube video and Shorts links to the privacy-friendly Nadeko Invidious instance. 

## Features
- **Instant Redirection:** Network-level interception using `declarativeNetRequest`.
- **Auto-Reload:** Automatically detects Invidious player append errors and refreshes the stream.
- **Dynamic Popup UI:** Toggle redirection or error-recovery on/off dynamically.
- **Works for Firefox and Chrome.**
  
Does not redirect the front page or playlists. It only redirects Youtube /watch? links and Shorts.

<img width="513" height="362" alt="redirect" src="https://github.com/user-attachments/assets/a980a501-e381-47d4-96d4-dae58c410a33" />
