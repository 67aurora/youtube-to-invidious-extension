function checkAndRedirect() {
    chrome.storage.local.get({ enabled: true, autoReloadEnabled: false, instance: 'inv.nadeko.net' }, (data) => {
        const host = window.location.hostname;
        const path = window.location.pathname;
        const search = window.location.search;

        // --- YOUTUBE REDIRECTION LOGIC ---
        if (data.enabled && host.includes('youtube.com')) {
            if (search.includes('list=') || search.includes('bypass=true')) {
                return;
            }

            if (path === '/watch' && search.includes('v=')) {
                window.stop();
                window.location.replace(`https://${data.instance}/watch` + search);
            } 
            else if (path.startsWith('/shorts/')) {
                const videoId = path.split('/')[2];
                window.stop();
                window.location.replace(`https://${data.instance}/watch?v=` + videoId);
            }
        }

        // --- INVIDIOUS LOGIC ---
        if (host === data.instance) {
            
            // --- LIVESTREAM BOUNCE-BACK FIX ---
            if (data.enabled && path === '/watch') {
                const checkLiveStream = () => {
                    const pageText = document.body ? document.body.textContent.toLowerCase() : "";
                    const hasLiveIcon = document.querySelector('.ion-ios-people') !== null;
                    const hasLiveBadge = document.querySelector('.label-danger') && document.querySelector('.label-danger').textContent.toLowerCase().includes('live');
                    
                    // NEW: Updated to catch the exact error phrases from your crash report
                    if (hasLiveIcon || 
                        hasLiveBadge || 
                        pageText.includes('watching now') || 
                        pageText.includes('livestreams are disabled') || 
                        pageText.includes('not working with invidious-companion')) {
                        
                        console.log("Livestream detected! Bouncing back to YouTube...");
                        window.location.replace(`https://www.youtube.com/watch${search}&bypass=true`);
                        return true;
                    }
                    return false;
                };

                if (!checkLiveStream()) {
                    setTimeout(checkLiveStream, 800);
                    setTimeout(checkLiveStream, 2000);
                }
            }

            // --- AUTO-RELOAD LOGIC ---
            if (data.autoReloadEnabled && path === '/watch') {
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
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndRedirect);
} else {
    checkAndRedirect();
}

window.addEventListener('yt-navigate-start', checkAndRedirect);
