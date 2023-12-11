// content.js
// --- css and html 
var newDiv = document.createElement("div");
newDiv.innerHTML = `
<div class="main"></div>
<button id="open-popup" style="position: fixed; bottom: 1px; right: 1px; z-index: 0;"> </button>
<div class="popup">
  <button class="close-btn">&times;</button>
  <h1>⚠️請打開反廣告錦囊</h1>
  <p>自動翻頁書籤 連線中...</p>
</div>
`;
document.body.appendChild(newDiv);

const cssContent = `
.main {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: none;
    background-color: rgba(0, 0, 0, 0.1);
  }
  

.popup {
    position: absolute;
    top: -100%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 98%;
    max-width: 450px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 5px 5px rgba(255, 0, 0, 0.1);
    margin-top: -25px;
    opacity: 0;
    z-index: 999;
    transition: top 0ms ease-in-out 300ms, opacity 300ms ease-in-out,
      margin-top 300ms ease-in-out;
  }

  .popup .close-btn {
    position: absolute;
    top: -5px;
    right: 10px;
    width: 20px;
    height: 20px;
    background: #eee;
    color: #111;
    border: none;
    outline: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1000;
  }
  body.active-popup {
    filter: blur(5px);
  }
  body.active-popup .main {
    display: block;
    filter: blur(50px);
    background: rgba(255, 0, 0, 0.1);
    transition: filter 0ms ease-in-out 0ms;
  }
  body.active-popup .popup {
    top: 50%;
    opacity: 1;
    margin-top: 0px;
    filter: none; 
    transition: top 0ms ease-in-out 0ms, opacity 300ms ease-in-out,
      margin-top 300ms ease-in-out;
  }  
`;
const styleEl = document.createElement('style');
styleEl.textContent = cssContent;





let isAD = false;
let isMute = false;
let muteInterval = null;

function muteVideo() {
    const muteButton = document.querySelector('.ytp-mute-button.ytp-button');
    if (muteButton && !muteButton.title.includes('解除靜音')) { 
        muteButton.click(); 
        isMute = true;
        chrome.runtime.sendMessage({ message: "Mute" });
    }
}

function checkForPlayer() {
    const videoContainer = document.getElementById("movie_player");
    if (videoContainer) {
        chrome.runtime.sendMessage({ message: "find movie_player" });
        clearInterval(playerInterval); 
        checkForAdText();
    }
}

const playerInterval = setInterval(checkForPlayer, 500);

function checkForAdText() {
    const checkInterval = setInterval(function() {
        const adTextElements = document.querySelectorAll('[id*="ad-text"]');
        if (adTextElements.length > 0) {
            isAD = true;
            chrome.runtime.sendMessage({ message: "find ad text" });
            if (!muteInterval) {
                muteInterval = setInterval(muteVideo, 500);
                if(isMute == true) clearInterval(muteInterval);
            }
            document.head.appendChild(styleEl);
            document.body.classList.add("active-popup");
        }
        else if (isAD && isMute) {
            const muteButton = document.querySelector('.ytp-mute-button.ytp-button');
            if (muteButton && muteButton.title.includes('解除靜音')) {
                muteButton.click();
                isMute = false;
                document.body.classList.remove("active-popup");
                chrome.runtime.sendMessage({ message: "Unmute" });
            }
            isAD = false;
            clearInterval(muteInterval);
            muteInterval = null;
            // clearInterval(checkInterval);
        }
    }, 500);
}