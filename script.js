// script.js - Silverplay Pro için TAM KUMANDA + MOUSE + API + KAPAT + GERİ + FOCUS + YÜKSEK PERFORMANS

document.addEventListener('DOMContentLoaded', function () {
    // 1. Kumanda tuşlarını Tizen'e kaydet (gecikmeli - TV hazır olsun)
    setTimeout(function () {
        try {
            if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log('✅ Kumanda tuşları aktif: ok, enter, geri');
            } else {
                console.warn('⚠️ Tizen objesi yok - simülatörde mi çalışıyorsun?');
            }
        } catch (err) {
            console.error('❌ Kumanda hatası:', err.message);
        }
    }, 1200);  // 1.2 saniye bekle - çoğu TV'de yeterli

    // 2. Senin kutuları seç (grid-container içindeki .box'lar)
    const boxes = document.querySelectorAll('.grid-container .box');
    let currentIndex = 0;

    // 3. Odak fonksiyonu (focus + stil)
    function focusBox(index) {
        boxes.forEach(b => b.classList.remove('focused'));
        if (boxes ) {
            boxes .classList.add('focused');
            boxes .focus();
            currentIndex = index;
        }
    }

    // İlk kutuya odaklan
    if (boxes.length > 0) focusBox(0);

    // 4. Mouse desteği: hover + tıklama
    boxes.forEach((box, i) => {
        box.addEventListener('mouseover', () => focusBox(i));
        box.addEventListener('click', e => {
            e.preventDefault();
            openAPI(box.href, box.getAttribute('data-name') || box.querySelector('span')?.textContent);
        });
    });

    // 5. Kumanda tuş dinleyicisi (ok tuşları, enter, geri)
    document.addEventListener('keydown', e => {
        let handled = true;
        switch (e.keyCode) {
            case 37: // Sol
                if (currentIndex > 0) focusBox(currentIndex - 1);
                break;
            case 39: // Sağ
                if (currentIndex < boxes.length - 1) focusBox(currentIndex + 1);
                break;
            case 38: // Yukarı
                if (currentIndex >= 4) focusBox(currentIndex - 4);
                break;
            case 40: // Aşağı
                if (currentIndex + 4 < boxes.length) focusBox(currentIndex + 4);
                break;
            case 13: // Enter (OK)
                if (boxes ) {
                    const box = boxes ;
                    openAPI(box.href, box.getAttribute('data-name') || box.querySelector('span')?.textContent);
                }
                break;
            case 10009: // Return / Back
            case 461:   // Alternatif Back
                const videoContainer = document.getElementById('video
