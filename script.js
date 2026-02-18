// script.js - Silverplay Pro - Son hali: YouTube Piped ile açılıyor, diğer siteler soru sormadan Samsung tarayıcısında açılıyor, geri tuşu 1 kez ana sayfa, 2 kez çıkış

let geriSayac = 0;
let geriTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    // Kumanda tuşlarını kaydet (gecikmeli)
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
    let youtubeModu = false;

    function odakla(i) {
        kutular.forEach(k => k.classList.remove('focused'));
        if (kutular[i]) {
            kutular[i].classList.add('focused');
            kutular[i].focus();
            aktifIndex = i;
        }
    }

    if (kutular.length > 0) odakla(0);

    kutular.forEach((kutu, i) => {
        kutu.addEventListener('mouseover', () => odakla(i));
        kutu.addEventListener('click', e => {
            e.preventDefault();
            const tip = kutu.dataset.type || 'site';
            const url = kutu.href;
            const ad = kutu.dataset.name || 'Site';

            if (tip === 'youtube') {
                youtubeModu = true;
                youtubeBaslat();
            } else {
                // Diğer siteler → Samsung tarayıcıyı doğrudan aç (soru sormadan)
                try {
                    tizen.application.launchAppControl(
                        new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", null, null, null, [{name: "url", value: url}]),
                        null,
                        () => console.log('Tarayıcı açıldı'),
                        (err) => console.error('Tarayıcı açma hatası:', err),
                        null
                    );
                } catch (err) {
                    console.error('Launch hatası:', err);
                    alert('Tarayıcı açılamadı: ' + url);
                }
            }
        });
    });

    document.addEventListener('keydown', e => {
        let handled = true;

        switch (e.keyCode) {
            case 37: if (aktifIndex > 0) odakla(aktifIndex - 1); break;
            case 39: if (aktifIndex < kutular.length - 1) odakla(aktifIndex + 1); break;
            case 38: if (aktifIndex >= 4) odakla(aktifIndex - 4); break;
            case 40: if (aktifIndex + 4 < kutular.length) odakla(aktifIndex + 4); break;
            case 13:
                const kutu = kutular[aktifIndex];
                const tip = kutu.dataset.type || 'site';
                const url = kutu.href;
                const ad = kutu.dataset.name;

                if (tip === 'youtube') {
                    youtubeModu = true;
                    youtubeBaslat();
                } else {
                    try {
                        tizen.application.launchAppControl(
                            new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", null, null, null, [{name: "url", value: url}]),
                            null,
                            () => console.log('Tarayıcı açıldı'),
                            (err) => console.error('Tarayıcı hatası:', err),
                            null
                        );
                    } catch (err) {
                        console.error('Launch hatası:', err);
                    }
                }
                break;

            case 10009: // Return / Back tuşu
            case 461:
                if (youtubeModu) {
                    youtubeModu = false;
                    document.getElementById('video-container').classList.add('hidden');
                    odakla(aktifIndex);
                } else {
                    geriSayac++;
                    if (geriSayac === 1) {
                        // 1 kez basıldı → ana sayfaya dön (iframe varsa kapat)
                        document.getElementById('video-container').classList.add('hidden');
                        odakla(aktifIndex);
                        geriTimer = setTimeout(() => { geriSayac = 0; }, 800);
                    } else if (geriSayac >= 2) {
                        // 2 kez basıldı → uygulamadan çık
                        clearTimeout(geriTimer);
                        try {
                            tizen.application.getCurrentApplication().exit();
                        } catch {}
                    }
                }
                break;

            default:
                handled = false;
        }

        if (handled) e.preventDefault();
    });

    // YouTube modu başlat (trend videolar)
    function youtubeBaslat() {
        const grid = document.querySelector('.grid-container');
        grid.innerHTML = '<p>Trend videolar yükleniyor...</p>';

        fetch('https://pipedapi.kavin.rocks/trending')
            .then(r => r.json())
            .then(videolar => {
                grid.innerHTML = '';
                videolar.forEach((v, i) => {
                    const kutu = document.createElement('div');
                    kutu.className = 'video-kutu';
                    kutu.innerHTML = `
                        <img src="${v.thumbnail}" alt="${v.title}">
                        <span>${v.title}</span>
                    `;
                    kutu.onclick = () => oynat(v);
                    grid.appendChild(kutu);
                });
                odakla(0);
            })
            .catch(err => {
                grid.innerHTML = '<p>Videolar yüklenemedi</p>';
                console.error(err);
            });
    }

    function oynat(video) {
        const title = document.getElementById('api-title');
        const frame = document.getElementById('api-frame');
        const container = document.getElementById('video-container');

        title.textContent = video.title;
        frame.src = `https://piped.kavin.rocks/embed/${video.url.split('v=')[1]}`;
        container.classList.remove('hidden');
        frame.focus();
    }

    // Eski iframe fonksiyonları
    window.openAPI = (url, title) => {
        document.getElementById('api-title').textContent = title || 'YÜKLENİYOR...';
        document.getElementById('api-frame').src = url;
        document.getElementById('video-container').classList.remove('hidden');
    };

    window.closeAPI = () => {
        document.getElementById('api-frame').src = '';
        document.getElementById('video-container').classList.add('hidden');
        odakla(aktifIndex);
    };
});
