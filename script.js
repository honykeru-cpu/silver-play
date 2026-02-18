// script.js - Silverplay Pro - YouTube yewtu.be ile, diğer siteler Samsung tarayıcıda, kumanda orijinal YouTube gibi, geri tuşu 1 kez ana sayfa, 2 kez çıkış

let geriSayac = 0;
let geriTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    // Kumanda tuşlarını kaydet
    setTimeout(() => {
        try {
            if (tizen?.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log('Kumanda aktif');
            }
        } catch (e) { console.log('Kumanda hatası:', e.message); }
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
            const name = kutu.dataset.name || 'Site';

            if (tip === 'youtube') {
                youtubeAc();
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

    // Kumanda tuşları (orijinal YouTube gibi akıcı navigasyon)
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
                const name = kutu.dataset.name;

                if (tip === 'youtube') {
                    youtubeAc();
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
                    geriTimer = setTimeout(() => { geriSayac = 0; }, 1000); // 1 sn içinde 2. basmazsa sıfırla
                } else if (geriSayac === 2) {
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

    // YouTube - yewtu.be ile reklamsız
    function youtubeAc() {
        const grid = document.querySelector('.grid-container');
        grid.innerHTML = '<p>Trend videolar yükleniyor...</p>';

        fetch('https://yewtu.be/feed/trending')
            .then(r => r.text())
            .then(data => {
                // Yewtu.be RSS parse et (basit HTML parse)
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, "text/html");
                const videolar = doc.querySelectorAll('.video-item');
                grid.innerHTML = '';
                videolar.forEach((v, i) => {
                    const baslik = v.querySelector('a').textContent;
                    const thumbnail = v.querySelector('img').src;
                    const videoUrl = 'https://yewtu.be' + v.querySelector('a').href;
                    const kutu = document.createElement('div');
                    kutu.className = 'video-kutu';
                    kutu.innerHTML = `
                        <img src="${thumbnail}" alt="${baslik}">
                        <span>${baslik}</span>
                    `;
                    kutu.onclick = () => oynat(videoUrl, baslik);
                    grid.appendChild(kutu);
                });
                odakla(0);
            })
            .catch(err => {
                grid.innerHTML = '<p>Hata: Videolar yüklenemedi</p>';
                console.error(err);
            });
    }

    function oynat(url, baslik) {
        const title = document.getElementById('api-title');
        const frame = document.getElementById('api-frame');
        const container = document.getElementById('video-container');

        title.textContent = baslik;
        frame.src = url;
        container.classList.remove('hidden');
        frame.focus();
    }

    // Iframe kapat
    window.closeAPI = () => {
        document.getElementById('api-frame').src = '';
        document.getElementById('video-container').classList.add('hidden');
        odakla(aktifIndex);
    };

    // Ana sayfa butonu
    document.querySelector('.main-home').addEventListener('click', () => {
        closeAPI();
        odakla(0);
    });
});
