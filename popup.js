const toggle = document.getElementById('toggle');
const reloadToggle = document.getElementById('reloadToggle');
const instanceSelect = document.getElementById('instanceSelect');

// Load current saved states
chrome.storage.local.get({ enabled: true, autoReloadEnabled: false, instance: 'inv.nadeko.net' }, (data) => {
    toggle.checked = data.enabled;
    reloadToggle.checked = data.autoReloadEnabled;
    instanceSelect.value = data.instance;
});

// Listeners to save states
toggle.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: toggle.checked });
});

reloadToggle.addEventListener('change', () => {
    chrome.storage.local.set({ autoReloadEnabled: reloadToggle.checked });
});

instanceSelect.addEventListener('change', () => {
    chrome.storage.local.set({ instance: instanceSelect.value });
});
