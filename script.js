let focusIdx = 0;
let backPresses = 0;
let backResetTimer;

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.selectable');
    const layer = document.getElementById('yt-layer');
    const frame = document.getElementById('yt-frame');

    function applyFocus(idx) {
        cards.forEach(c => c.classList.remove('selected'));
        if (cards[idx]) {
            cards[idx].classList.add('selected');
            focusIdx = idx;
        }
    }

    applyFocus(0); // Başlangıç odağı YouTube

    document.addEventListener('keydown', (e) => {
        // Tizen Tuş Kodları: 37:Sol, 39:Sağ, 13:Enter, 10009:Geri
        switch(e.keyCode) {
            case 37: if (focusIdx > 0) applyFocus(focusIdx - 1); break;
            case 39: if (focusIdx < cards.length - 1) applyFocus(focusIdx + 1); break;
            case 13: // Enter (Tamam)
                const url = cards[focusIdx].getAttribute('href');
                const targetType = cards[focusIdx].getAttribute('data-type');

                if (targetType === "internal") {
                    e.preventDefault();
                    layer.style.display = 'block';
                    frame.src = url;
                } else {
                    // Samsung TV Tarayıcısını Zorla Aç (AppControl Metodu)
                    if (window.tizen && tizen.application) {
                        try {
                            const control = new tizen.ApplicationControl(
                                "http://tizen.org/appcontrol/operation/view",
                                url
                            );
                            tizen.application.launchAppControl(control, "org.tizen.browser",
                                null, (err) => { window.location.href = url; }
                            );
                        } catch(h) { window.location.href = url; }
                    } else { window.open(url, '_blank'); }
                }
                break;
            case 10009: // Return (Geri)
                if (layer.style.display === 'block') {
                    layer.style.display = 'none';
                    frame.src = "";
                } else {
                    // Tek basış: Ana Sayfaya At | İkinci basış: Çıkış
                    backPresses++;
                    applyFocus(0); // Odağı YouTube'a (başa) çek
                    
                    if (backPresses === 1) {
                        backResetTimer = setTimeout(() => { backPresses = 0; }, 1500);
                    } else if (backPresses === 2) {
                        clearTimeout(backResetTimer);
                        if (window.tizen) tizen.application.getCurrentApplication().exit();
                    }
                }
                break;
        }
    });

    // Logo'ya tıklanınca sayfayı yenile (Ana Sayfa yönlendirme)
    document.getElementById('logo-nav').addEventListener('click', () => {
        window.location.reload();
    });
});
