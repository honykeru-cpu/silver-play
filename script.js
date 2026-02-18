document.addEventListener('DOMContentLoaded', () => {
    // 1. Kumanda tuşlarını kaydet (Tizen Standart)
    setTimeout(() => {
        try {
            if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
            }
        } catch (err) { console.error('Hata:', err); }
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

    // Mouse ve Tıklama Desteği
    kutular.forEach((kutucuk, i) => {
        kutucuk.addEventListener('mouseover', () => odakla(i));
        kutucuk.addEventListener('click', e => {
            e.preventDefault();
            openAPI(kutucuk.href, kutucuk.dataset.name);
        });
    });

    // Kumanda Navigasyonu
    document.addEventListener('keydown', e => {
        let handled = true;
        switch (e.keyCode) {
            case 37: if (aktifIndex > 0) odakla(aktifIndex - 1); break; // Sol
            case 39: if (aktifIndex < kutular.length - 1) odakla(aktifIndex + 1); break; // Sağ
            case 13: // Enter
                if (kutular[aktifIndex]) openAPI(kutular[aktifIndex].href, kutular[aktifIndex].dataset.name);
                break;
            case 10009: // Geri (Return)
                const cont = document.getElementById('video-container');
                if (cont && !cont.classList.contains('hidden')) {
                    closeAPI();
                } else {
                    try { tizen.application.getCurrentApplication().exit(); } catch(e) {}
                }
                break;
            default: handled = false;
        }
        if (handled) e.preventDefault();
    });

    // API Fonksiyonları (index.html'deki alanları kullanır)
    window.openAPI = (url, baslik) => {
        const frame = document.getElementById('api-frame');
        const cont = document.getElementById('video-container');
        const title = document.getElementById('api-title');
        if (title) title.textContent = baslik;
        if (frame) frame.src = url;
        if (cont) cont.classList.remove('hidden');
        if (frame) frame.focus();
    };

    window.closeAPI = () => {
        const frame = document.getElementById('api-frame');
        const cont = document.getElementById('video-container');
        if (frame) frame.src = '';
        if (cont) cont.classList.add('hidden');
        if (kutular[aktifIndex]) kutular[aktifIndex].focus();
    };
});
