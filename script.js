let currentIdx = 0;
let backPressCount = 0;
let backTimer;

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.selectable');
    const ytLayer = document.getElementById('yt-layer');
    const ytFrame = document.getElementById('yt-frame');

    function updateFocus(idx) {
        cards.forEach(c => c.classList.remove('selected'));
        if (cards[idx]) {
            cards[idx].classList.add('selected');
            currentIdx = idx;
        }
    }
    updateFocus(0);

    document.addEventListener('keydown', (e) => {
        switch(e.keyCode) {
            case 37: if (currentIdx > 0) updateFocus(currentIdx - 1); break; // Sol
            case 39: if (currentIdx < cards.length - 1) updateFocus(currentIdx + 1); break; // Sağ
            case 13: // Enter
                const link = cards[currentIdx].getAttribute('href');
                if (cards[currentIdx].getAttribute('data-type') === "internal") {
                    ytLayer.style.display = 'block';
                    ytFrame.src = link;
                } else {
                    // Samsung TV Tarayıcısını Zorla Aç
                    if (window.tizen) {
                        const control = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", link);
                        tizen.application.launchAppControl(control, "org.tizen.browser", null, null);
                    } else { window.open(link, '_blank'); }
                }
                break;
            case 10009: // Return (Geri Tuşu)
                if (ytLayer.style.display === 'block') {
                    ytLayer.style.display = 'none';
                    ytFrame.src = "";
                } else {
                    // Tek basış: Ana Sayfaya Dön | İki basış: Uygulamadan Çık
                    backPressCount++;
                    updateFocus(0);
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

    document.getElementById('logo-home').onclick = () => window.location.reload();
});
