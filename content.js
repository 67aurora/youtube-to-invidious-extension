function checkAndRedirect() {
    // Fetch both settings from storage
    chrome.storage.local.get({ enabled: true, autoReloadEnabled: false }, (data) => {
        const host = window.location.hostname;
        const path = window.location.pathname;
        const search = window.location.search;

        // --- PART 1: YOUTUBE REDIRECTION LOGIC ---
        // Only run if the Redirect toggle is ON
        if (data.enabled && host.includes('youtube.com')) {
            if (path === '/watch' && search.includes('v=') && !search.includes('list=')) {
                window.stop();
                window.location.href = 'https://inv.nadeko.net/watch' + search;
            } 
            else if (path.startsWith('/shorts/')) {
                const videoId = path.split('/')[2];
                window.stop();
                window.location.href = 'https://inv.nadeko.net/watch?v=' + videoId;
            }
        }

        // --- PART 2: INVIDIOUS MULTI-RETRY LOGIC ---
        // Only run if the Auto-Reload toggle is ON
        if (data.autoReloadEnabled && host.includes('inv.nadeko.net')) {
            const reloadKey = 'yt_nav_retry_count_' + path + search;

            setTimeout(() => {
                sessionStorage.removeItem(reloadKey);
            }, 8000);

            const observer = new MutationObserver(() => {
                const pageText = document.body ? document.body.textContent.toLowerCase() : "";
                
                if (pageText.includes('video append of') && pageText.includes('failed for segment')) {
                    observer.disconnect(); 
                    
                    let retryCount = parseInt(sessionStorage.getItem(reloadKey) || "0", 10);
                    
                    if (retryCount < 6) {
                        sessionStorage.setItem(reloadKey, (retryCount + 1).toString());
                        window.location.reload(true); 
                    } else {
                        console.log("Max retries hit. All available backends are currently choked.");
                    }
                }
            });

            observer.observe(document.documentElement, { 
                childList: true, 
                subtree: true, 
                characterData: true 
            });
        }
    });
}

// Initial fire
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndRedirect);
} else {
    checkAndRedirect();
}

// Listen for navigation
window.addEventListener('yt-navigate-start', checkAndRedirect);