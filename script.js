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
            case 37: if (currentIdx > 0) updateFocus(currentIdx - 1); break;
            case 39: if (currentIdx < cards.length - 1) updateFocus(currentIdx + 1); break;
            case 13: // Enter (Tamam) Tuşu
                const link = cards[currentIdx].getAttribute('href');
                const isInternal = cards[currentIdx].getAttribute('data-type') === "internal";

                if (isInternal) {
                    // YouTube TV'de Iframe içinde açılması için
                    e.preventDefault();
                    ytLayer.style.display = 'block';
                    // Alternatif ve daha kararlı bir API sunucusu kullanıyoruz
                    ytFrame.src = "https://invidious.lunar.icu/trending"; 
                } else {
                    // Samsung TV Tarayıcısını Zorla Fırlat (Deep Link)
                    if (window.tizen && tizen.application) {
                        try {
                            const control = new tizen.ApplicationControl(
                                "http://tizen.org/appcontrol/operation/view", 
                                link
                            );
                            tizen.application.launchAppControl(control, "org.tizen.browser",
                                () => { console.log("Tarayıcı Başlatıldı"); },
                                (err) => { window.location.href = link; }
                            );
                        } catch(e) { window.location.href = link; }
                    } else {
                        window.open(link, '_blank');
                    }
                }
                break;
            case 10009: // Return (Geri) Tuşu
                if (ytLayer.style.display === 'block') {
                    ytLayer.style.display = 'none';
                    ytFrame.src = "";
                } else {
                    backPressCount++;
                    updateFocus(0); // Tek basış ana sayfaya/başa atar
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
