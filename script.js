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

    setFocus(0); // İlk açılış YouTube odaklı

    document.addEventListener('keydown', (e) => {
        // Tizen Tuş Kodları: 37:Sol, 39:Sağ, 13:Enter, 10009:Geri
        switch(e.keyCode) {
            case 37: if (currentPos > 0) setFocus(currentPos - 1); break;
            case 39: if (currentPos < items.length - 1) setFocus(currentPos + 1); break;
            case 13: // Enter (Tamam)
                const link = items[currentPos].getAttribute('href');
                const type = items[currentPos].getAttribute('data-type');

                if (type === "internal") {
                    e.preventDefault();
                    ytLayer.style.display = 'block';
                    ytFrame.src = link;
                } else {
                    // Samsung TV Tarayıcısını Zorla Aç (AppControl)
                    if (window.tizen && tizen.application) {
                        try {
                            const appControl = new tizen.ApplicationControl(
                                "http://tizen.org/appcontrol/operation/view",
                                link
                            );
                            tizen.application.launchAppControl(appControl, "org.tizen.browser",
                                () => { console.log("Harici Tarayıcı Açıldı"); },
                                (err) => { window.location.href = link; }
                            );
                        } catch(e) { window.location.href = link; }
                    } else {
                        window.open(link, '_blank'); // PC için yeni sekme
                    }
                }
                break;
            case 10009: // Return (Geri Tuşu)
                if (ytLayer.style.display === 'block') {
                    ytLayer.style.display = 'none';
                    ytFrame.src = "";
                } else {
                    // Akıllı Geri Tuşu: 1 Basış = Başa Dön | 2 Basış = Çıkış
                    backPressCount++;
                    setFocus(0); // Odağı YouTube'a çek
                    
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

    // Logoya/Başlığa tıklayınca ana sayfayı yenile
    document.getElementById('main-nav').addEventListener('click', () => {
        window.location.reload();
    });
});
