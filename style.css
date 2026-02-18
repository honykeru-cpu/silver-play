let currentPos = 0;
let backPressCount = 0;
let backTimer;

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.selectable');
    const ytLayer = document.getElementById('yt-layer');
    const ytFrame = document.getElementById('yt-frame');

    function setFocus(idx) {
        items.forEach(item => item.classList.remove('selected'));
        if (items[idx]) {
            items[idx].classList.add('selected');
            currentPos = idx;
        }
    }

    setFocus(0);

    document.addEventListener('keydown', (e) => {
        switch(e.keyCode) {
            case 37: if (currentPos > 0) setFocus(currentPos - 1); break;
            case 39: if (currentPos < items.length - 1) setFocus(currentPos + 1); break;
            case 13: // Enter
                const link = items[currentPos].getAttribute('href');
                const type = items[currentPos].getAttribute('data-type');

                if (type === "internal") {
                    e.preventDefault();
                    ytLayer.style.display = 'block';
                    ytFrame.src = link;
                } else {
                    // Tarayıcıya zorla fırlat
                    if (window.tizen) {
                        try {
                            const appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", link);
                            tizen.application.launchAppControl(appControl, "org.tizen.browser", null, null);
                        } catch(i) { window.location.href = link; }
                    } else { window.open(link, '_blank'); }
                }
                break;
            case 10009: // Geri
                if (ytLayer.style.display === 'block') {
                    ytLayer.style.display = 'none';
                    ytFrame.src = "";
                } else {
                    backPressCount++;
                    setFocus(0); // Tek tuş başa atar
                    if (backPressCount === 1) {
                        backTimer = setTimeout(() => { backPressCount = 0; }, 1500);
                    } else if (backPressCount === 2) {
                        clearTimeout(backTimer);
                        if (window.tizen) tizen.application.getCurrentApplication().exit();
                    }
                }
                break;
        }
    });

    document.getElementById('main-nav').addEventListener('click', () => { window.location.reload(); });
});
