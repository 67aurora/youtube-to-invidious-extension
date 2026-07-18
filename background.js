function updateDNRRules(isEnabled, instance) {
    if (isEnabled) {
        chrome.action.setBadgeText({ text: '•' });
        chrome.action.setBadgeBackgroundColor({ color: '#00b359' }); // Green background
        
        // NEW: Makes the text the exact same green color as the background to hide the dot
        if (chrome.action.setBadgeTextColor) {
            chrome.action.setBadgeTextColor({ color: '#00b359' }); 
        }
    } else {
        // Clear the badge completely when turned off
        chrome.action.setBadgeText({ text: '' });
    }

    if (!isEnabled) {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1, 2, 3, 4]
        });
        return;
    }

    const rules = [
        {
            "id": 3,
            "priority": 2,
            "action": { "type": "allow" },
            "condition": { "urlFilter": "*youtube.com/watch*list=*", "resourceTypes": ["main_frame"] }
        },
        {
            "id": 4,
            "priority": 2,
            "action": { "type": "allow" },
            "condition": { "urlFilter": "*bypass=true*", "resourceTypes": ["main_frame"] }
        },
        {
            "id": 1,
            "priority": 1,
            "action": { "type": "redirect", "redirect": { "regexSubstitution": `https://${instance}/watch?\\1` } },
            "condition": { "regexFilter": "^https?://(?:[a-z0-9-]+\\.)?youtube\\.com/watch\\?(.*v=.*)", "resourceTypes": ["main_frame"] }
        },
        {
            "id": 2,
            "priority": 1,
            "action": { "type": "redirect", "redirect": { "regexSubstitution": `https://${instance}/watch?v=\\1` } },
            "condition": { "regexFilter": "^https?://(?:[a-z0-9-]+\\.)?youtube\\.com/shorts/([^/?#]+)", "resourceTypes": ["main_frame"] }
        }
    ];

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2, 3, 4], 
        addRules: rules
    });
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
        chrome.storage.local.get({ enabled: true, instance: 'inv.nadeko.net' }, (data) => {
            if (changes.enabled || changes.instance) {
                updateDNRRules(data.enabled, data.instance);
            }
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get({ enabled: true, instance: 'inv.nadeko.net' }, (data) => {
        chrome.storage.local.set({ enabled: data.enabled, instance: data.instance });
        updateDNRRules(data.enabled, data.instance);
    });
});
