chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) {
        const isEnabled = changes.enabled.newValue;
        if (isEnabled) {
            chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: ["ruleset_1"] });
        } else {
            chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ["ruleset_1"] });
        }
    }
});

// Set extension to active on very first installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true });
});