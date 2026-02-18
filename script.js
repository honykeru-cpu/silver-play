// script.js - Son hali: yewtu.be ile YouTube, diğer siteler soru sormadan Samsung tarayıcısında açılır
// Kumanda orijinal YouTube gibi çalışır
// Geri tuşu: 1 kez ana sayfaya, 2 kez çıkış
// Ana Sayfa butonu: ana sayfaya yönlendir

let geriSayac = 0;
let geriTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    // Kumanda tuşlarını kaydet
    setTimeout(() => {
        try {
            if (tizen && tizen.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log('Kumanda tuşları kaydedildi');
            }
        } catch (err) {
            console.error('Kumanda kayıt hatası:', err.message);
        }
    }, 1500);

    const kutular = document.querySelectorAll('.grid-container .box');
    let aktifIndex = 0;

    function odakla(i) {
        kutular.forEach(k => k.classList.remove('focused'));
        if (kutular[i]) {
            kutular[i].classList.add('focused');
            kutular[i].focus();
            aktifIndex = i;
        }
    }

    if (kutular.length > 0) odakla(0);

    // Mouse desteği
    kutular.forEach((kutu, i) => {
        kutu.addEventListener('mouseover', () => odakla(i));
        kutu.addEventListener('click', e => {
            e.preventDefault();
            const tip = kutu.dataset.type || 'site';
            const url = kutu.href;
            const ad = kutu.dataset.name || 'Site';

            if (tip === 'youtube') {
                youtubeBaslat();
            } else {
                // Diğer siteler - soru sormadan Samsung tarayıcısında aç
                try {
                    tizen.application.launchAppControl(
                        new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", null, null, null, [{name: "url", value: url}]),
                        null,
                        () => console.log('Tarayıcı açıldı: ' + url),
                        (err) => console.error('Tarayıcı hatası:', err.message),
                        null
                    );
                } catch (err) {
                    console.error('Launch hatası:', err.message);
                }
            }
        });
    });

    // Kumanda tuşları
    document.addEventListener('keydown', e => {
        let handled = true;

        switch (e.keyCode) {
            case 37: // Sol
                if (aktifIndex > 0) odakla(aktifIndex - 1);
                break;
            case 39: // Sağ
                if (aktifIndex < kutular.length - 1) odakla(aktifIndex + 1);
                break;
            case 38: // Yukarı
                if (aktifIndex >= 4) odakla(aktifIndex - 4);
                break;
            case 40: // Aşağı
                if (aktifIndex + 4 < kutular.length) odakla(aktifIndex + 4);
                break;
            case 13: // Enter
                const kutu = kutular[aktifIndex];
                const tip = kutu.dataset.type || 'site';
                const url = kutu.href;
                const ad = kutu.dataset.name;

                if (tip === 'youtube') {
                    youtubeBaslat();
                } else {
                    try {
                        tizen.application.launchAppControl(
                            new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", null, null, null, [{name: "url", value: url}]),
                            null,
                            () => console.log('Tarayıcı açıldı: ' + url),
                            (err) => console.error('Tarayıcı hatası:', err.message),
                            null
                        );
                    } catch (err) {
                        console.error('Launch hatası:', err.message);
                    }
                }
                break;
            case 10009: // Return / Back
            case 461:
                geriSayac++;
                if (geriSayac === 1) {
                    // 1 kez - ana sayfaya dön
                    closeAPI();
                    geriTimer = setTimeout(() => { geriSayac = 0; }, 800);
                } else if (geriSayac >= 2) {
                    // 2 kez - çıkış
                    clearTimeout(geriTimer);
                    geriSayac = 0;
                    tizen.application.getCurrentApplication().exit();
                }
                break;
            default:
                handled = false;
        }

        if (handled) e.preventDefault();
    });

    // YouTube - yewtu.be ile açılıyor
    function youtubeBaslat() {
        // Doğrudan yewtu.be ana sayfasına yönlendir (reklamsız YouTube)
        const url = 'https://yewtu.be';
        try {
            tizen.application.launchAppControl(
                new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", null, null, null, [{name: "url", value: url}]),
                null,
                () => console.log('yewtu.be tarayıcıda açıldı'),
                (err) => console.error('yewtu.be hatası:', err.message),
                null
            );
        } catch (err) {
            console.error('Launch hatası:', err.message);
        }
    }

    // Iframe kapat
    window.closeAPI = () => {
        document.getElementById('api-frame').src = '';
        document.getElementById('video-container').classList.add('hidden');
        odakla(aktifIndex);
    };

    // Ana Sayfa butonu
    document.querySelector('.main-home').addEventListener('click', () => {
        closeAPI();
        odakla(0);
    });

    console.log('Silverplay Pro yüklendi - YouTube yewtu.be ile açılır');
});
