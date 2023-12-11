chrome.tabs.onCreated.addListener(function() {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: 'new tab info. ',
        message: 'new tab success!!!!!!!!!!!!'
    });
    console.log('new tab success');
});


// recv message

let lastNotificationTime = 0;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.message);
        const currentTime = Date.now();
        if(request.message === "find ad text" && currentTime - lastNotificationTime > 20000){
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icon48.png',
                title: '反廣告錦囊開啟!!!',
                message: '自動翻頁書籤 連線中...'
            });
            lastNotificationTime = currentTime;
        }
    }
);

  