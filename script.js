// script.js – Silverplay Pro | YouTube API + Diğer Siteler Tarayıcıda Açılır

document.addEventListener('DOMContentLoaded', () => {
    // Kumanda tuşlarını kaydet
    setTimeout(() => {
        try {
            if (tizen?.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log('Kumanda aktif.');
            }
        } catch (e) { console.log('Kumanda hatası:', e.message); }
    }, 1500);

    const kutular = document.querySelectorAll('.grid-container .box');
    let aktifIndex = 0;
    let youtubeModu = false;

    function odakla(i) {
        kutular.forEach(k => k.classList.remove('focused'));
        if (kutular ) {
            kutular .classList.add('focused');
            kutular .focus();
            aktifIndex = i;
        }
    }

    if (kutular.length) odakla(0);

    // Mouse desteği
    kutular.forEach((kutu, i) => {
        kutu.addEventListener('mouseover', () => odakla(i));
        kutu.addEventListener('click', e => {
            e.preventDefault();
            ac(kutu.dataset.api, kutu.href, kutu.dataset.name);
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
                const kutu = kutular ;
                ac(kutu.dataset.api, kutu.href, kutu.dataset.name);
                break;
            case 10009: case 461:
                if (youtubeModu) {
                    ytGeri();
                } else {
                    tizen?.application?.getCurrentApplication()?.exit();
                }
                break;
            default: handled = false;
        }

        if (handled) e.preventDefault();
    });

    // Ana işlem: API'ye göre ne yapılacak
    function ac(apiTuru, url, baslik) {
        if (apiTuru === 'youtube') {
            youtubeModu = true;
            youtubeAc();
        } else if (apiTuru === 'browser') {
            // Uygulamayı kapat, Samsung tarayıcıyı kullanıcı açsın
            alert(`"${baslik}" sitesini açmak için Samsung Web Tarayıcıyı açın: ${url}`);
            tizen.application.getCurrentApplication().exit();
        }
    }

    // YouTube – Piped API ile reklamsız
    const PIPED = "https://pipedapi.kavin.rocks";
    let youtubeVideolari = [];

    function youtubeAc() {
        const grid = document.querySelector('.grid-container');
        grid.innerHTML = '<p>Trend Videolar Yükleniyor...</p>';

        fetch(`${PIPED}/trending`)
            .then(r => r.json())
            .then(data => {
                youtubeVideolari = data;
                grid.innerHTML = '';
                data.forEach((v, i) => {
                    const kutu = document.createElement('div');
                    kutu.className = 'video-kutu';
                    kutu.innerHTML = `
                        <img src="${v.thumbnail[0].url}" alt="${v.title}">
                        <span>${v.title}</span>
                    `;
                    kutu.onclick = () => youtubeOyna(i);
                    grid.appendChild(kutu);
                });
                odakla(0);
            })
            .catch(err => {
                grid.innerHTML = '<p>Hata: Videolar yüklenemedi</p>';
                console.error(err);
            });
    }

    function youtubeOyna(i) {
        const v = youtubeVideolari ;
        const video = document.getElementById('yt-video');
        const title = document.getElementById('yt-title');
        const player = document.getElementById('youtube-player');

        title.textContent = v.title;
        video.src = v.streams?.hls || v.streams?.audioOnly[0]?.url;
        player.classList.remove('hidden');
        video.play();
    }

    function ytGeri() {
        const video = document.getElementById('yt-video');
        video.pause();
        video.src = '';
        document.getElementById('youtube-player').classList.add('hidden');
        // Ana menüyü geri yükle (manuel ekle)
        const grid = document.querySelector('.grid-container');
        grid.innerHTML = `
            <a href="#" class="box" data-api="youtube" data-name="YouTube (No-Ads)"><img src="youtube.png" alt="YT"><span>YouTube (No-Ads)</span></a>
            <a href="https://www.hdfilmcehennemi.nl/" class="box" data-api="browser" data-name="HD Film"><img src="hdfilmcehennemi.png" alt="HF"><span>HD Film</span></a>
            <a href="https://dizipal1539.com/" class="box" data-api="browser" data-name="Dizipal"><img src="dizipal.png" alt="DP"><span>Dizipal</span></a>
            <a href="https://www.dizibox.live/" class="box" data-api="browser" data-name="Dizibox"><img src="dizibox.png" alt="DB"><span>Dizibox</span></a>
        `;
        youtubeModu = false;
        odakla(0);
    }

    console.log('Silverplay Pro – YouTube API + Tarayıcı Yönlendirme aktif');
});
