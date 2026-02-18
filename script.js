// script.js - Silverplay Pro - Klasör Yapısına Bağımsız, Kumanda + API + Geri + Mouse

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            if (tizen?.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter','Return','Exit','Back']);
                console.log('Kumanda aktif.');
            }
        } catch (e) { console.log('Kumanda hata:', e.message); }
    }, 1500);

    const boxes = document.querySelectorAll('.box');
    let idx = 0;

    function odakla(i) {
        boxes.forEach(b => b.classList.remove('focused'));
        if (boxes ) {
            boxes .classList.add('focused');
            boxes .focus();
            idx = i;
        }
    }

    if (boxes.length) odakla(0);

    boxes.forEach((b, i) => {
        b.addEventListener('mouseover', () => odakla(i));
        b.addEventListener('click', e => {
            e.preventDefault();
            openAPI(b.href, b.dataset.name);
        });
    });

    document.addEventListener('keydown', e => {
        let hareket = true;
        switch(e.keyCode) {
            case 37: idx > 0 && odakla(idx-1); break;
            case 39: idx < boxes.length-1 && odakla(idx+1); break;
            case 38: idx >= 4 && odakla(idx-4); break;
            case 40: idx+4 < boxes.length && odakla(idx+4); break;
            case 13: boxes && openAPI(boxes .href, boxes .dataset.name); break;
            case 10009: case 461:
                document.getElementById('video-container')?.classList.contains('hidden')
                    ? tizen.application.getCurrentApplication().exit()
                    : closeAPI();
                break;
            default: hareket = false;
        }
        hareket && e.preventDefault();
    });

    window.openAPI = (url, title) => {
        document.getElementById('api-title').textContent = title || 'Yükleniyor...';
        document.getElementById('api-frame').src = url;
        document.getElementById('video-container').classList.remove('hidden');
    };

    window.closeAPI = () => {
        document.getElementById('api-frame').src = '';
        document.getElementById('video-container').classList.add('hidden');
        odakla(idx);
    };
});
