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
            case 39: if (aktifIndex < kutular.length - 1) odakla(akt
