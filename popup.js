const toggle = document.getElementById('toggle');
const reloadToggle = document.getElementById('reloadToggle');

// Load current saved states (Redirect defaults to true, Reload defaults to false)
chrome.storage.local.get({ enabled: true, autoReloadEnabled: false }, (data) => {
    toggle.checked = data.enabled;
    reloadToggle.checked = data.autoReloadEnabled;
});

// Save state when user clicks the YouTube Redirect switch
toggle.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: toggle.checked });
});

// Save state when user clicks the Auto-Reload switch
reloadToggle.addEventListener('change', () => {
    chrome.storage.local.set({ autoReloadEnabled: reloadToggle.checked });
});