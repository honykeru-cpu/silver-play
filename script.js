// script.js - Silverplay Pro | Kumanda + YouTube No-Ads + Diğerleri Tarayıcıda

document.addEventListener('DOMContentLoaded', () => {
    // Kumanda tuşlarını kaydet
    setTimeout(() => {
        try {
            if (tizen?.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log('Kumanda tuşları aktif');
            }
        } catch (e) {
            console.log('Kumanda hatası:', e.message);
        }
    }, 1500);

    const kutular = document.querySelectorAll('.grid-container .box');
    let aktifIndex = 0;

    function odakla(index) {
        kutular.forEach(k => k.classList.remove('focused'));
        if (kutular[index]) {
            kutular[index].classList.add('focused');
            kutular[index].focus();
            aktifIndex = index;
        }
    }

    if (kutular.length > 0) odakla(0);

    // Mouse desteği
    kutular.forEach((kutu, i) => {
        kutu.addEventListener('mouseover', () => odakla(i));
        kutu.addEventListener('click', e => {
            e.preventDefault();
            const type = kutu.dataset.type;
            const url = kutu.href;
            const name = kutu.dataset.name;

            if (type === 'youtube') {
                youtubeBaslat();
            } else if (type === 'site') {
                tarayiciAc(url, name);
            }
        });
    });

    // Kumanda tuşları
    document.addEventListener('keydown', e => {
        let handled = true;

        switch (e.keyCode) {
            case 37: if (aktifIndex > 0) odakla(aktifIndex - 1); break;
            case 39: if (aktifIndex < kutular.length - 1) odakla(aktifIndex + 1); break;
            case 38: if (aktifIndex >= 4) odakla(aktifIndex - 4); break;
            case 40: if (aktifIndex + 4 < kutular.length) odakla(aktifIndex + 4); break;
            case 13:
                const kutu = kutular[aktifIndex];
                const type = kutu.dataset.type;
                const url = kutu.href;
                const name = kutu.dataset.name;

                if (type === 'youtube') {
                    youtubeBaslat();
                } else if (type === 'site') {
                    tarayiciAc(url, name);
                }
                break;
            case 10009: case 461:
                tizen.application.getCurrentApplication().exit();
                break;
            default:
                handled = false;
        }

        if (handled) e.preventDefault();
    });

    // YouTube No-Ads (Piped API)
    const PIPED = "https://pipedapi.kavin.rocks";

    function youtubeBaslat() {
        const grid = document.querySelector('.grid-container');
        grid.innerHTML = '<p>Trend Videolar Yükleniyor...</p>';

        fetch(`${PIPED}/trending`)
            .then(r => r.json())
            .then(data => {
                grid.innerHTML = '';
                data.forEach((v, i) => {
                    const kutu = document.createElement('div');
                    kutu.className = 'video-kutu';
                    kutu.innerHTML = `
                        <img src="${v.thumbnail[0].url}" alt="${v.title}">
                        <span>${v.title}</span>
                    `;
                    kutu.onclick = () => oynat(v);
                    grid.appendChild(kutu);
                });
                odakla(0);
            })
            .catch(err => {
                grid.innerHTML = '<p>Hata: Videolar yüklenemedi</p>';
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

    // Diğer siteler için tarayıcı aç (uygulama kapanır)
    function tarayiciAc(url, name) {
        alert(`"${name}" sitesini Samsung Web Tarayıcıda açın: ${url}`);
        tizen.application.getCurrentApplication().exit();
    }

    // Eski API fonksiyonları (iframe için)
    window.openAPI = (url, title) => {
        document.getElementById('api-title').textContent = title;
        document.getElementById('api-frame').src = url;
        document.getElementById('video-container').classList.remove('hidden');
    };

    window.closeAPI = () => {
        document.getElementById('api-frame').src = '';
        document.getElementById('video-container').classList.add('hidden');
        odakla(aktifIndex);
    };

    console.log('Silverplay Pro yüklendi');
});
