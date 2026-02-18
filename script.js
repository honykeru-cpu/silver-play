// script.js — Silverplay Pro (son stabil versiyon)
// Tizen kumanda + mouse desteği + grid navigasyon + API aç/kapat
// 2026 güncel hali — test edilmiş, hata loglu

document.addEventListener('DOMContentLoaded', () => {
    // 1. Kumanda tuşlarını kaydet (gecikmeli)
    setTimeout(() => {
        try {
            if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log('✔ Kumanda tuşları kaydedildi');
            } else {
                console.warn('⚠ Tizen nesnesi bulunamadı (simülatör?)');
            }
        } catch (err) {
            console.error('Kumanda kayıt hatası:', err.message);
        }
    }, 1500);

    // 2. Grid kutularını seç
    const kutular = document.querySelectorAll('.grid-container .box');
    let aktifIndex = 0;

    // 3. Odaklama fonksiyonu
    function odakla(index) {
        kutular.forEach(k => k.classList.remove('focused'));
        if (kutular[index]) {
            kutular[index].classList.add('focused');
            kutular[index].focus();
            aktifIndex = index;
        }
    }

    // İlk kutuya odaklan
    if (kutular.length > 0) odakla(0);

    // 4. Mouse desteği
    kutular.forEach((kutucuk, i) => {
        kutucuk.addEventListener('mouseover', () => odakla(i));
        kutucuk.addEventListener('click', e => {
            e.preventDefault();
            const url = kutucuk.href;
            const baslik = kutucuk.dataset.name || kutucuk.querySelector('span')?.textContent || 'API';
            openAPI(url, baslik);
        });
    });

    // 5. Kumanda tuş dinleyicisi
    document.addEventListener('keydown', e => {
        let handled = true;

        switch (e.keyCode) {
            case 37: // ← sol
                if (aktifIndex > 0) odakla(aktifIndex - 1);
                break;

            case 39: // → sağ
                if (aktifIndex < kutular.length - 1) odakla(aktifIndex + 1);
                break;

            case 38: // ↑ yukarı
                if (aktifIndex >= 4) odakla(aktifIndex - 4);
                break;

            case 40: // ↓ aşağı
                if (aktifIndex + 4 < kutular.length) odakla(aktifIndex + 4);
                break;

            case 13: // Enter / OK
                if (kutular[aktifIndex]) {
                    const k = kutular[aktifIndex];
                    openAPI(k.href, k.dataset.name || k.querySelector('span')?.textContent);
                }
                break;

            case 10009: // Return / Geri (çoğu model)
            case 461:   // Bazı modellerde alternatif geri kodu
                const container = document.getElementById('video-container');
                if (container && !container.classList.contains('hidden')) {
                    closeAPI();
                } else {
                    try {
                        tizen.application.getCurrentApplication().exit();
                    } catch {}
                }
                break;

            default:
                handled = false;
        }

        if (handled) e.preventDefault();
    });

    // 6. API açma / kapatma fonksiyonları
    window.openAPI = (url, baslik) => {
        const titleEl = document.getElementById('api-title');
        const frame = document.getElementById('api-frame');
        const cont = document.getElementById('video-container');

        if (titleEl) titleEl.textContent = baslik || 'YÜKLENİYOR...';
        if (frame) frame.src = url;
        if (cont) cont.classList.remove('hidden');
        if (frame) frame.focus();
    };

    window.closeAPI = () => {
        const frame = document.getElementById('api-frame');
        const cont = document.getElementById('video-container');
        if (frame) frame.src = '';
        if (cont) cont.classList.add('hidden');
        // Geri odaklan
        if (kutular[aktifIndex]) kutular[aktifIndex].focus();
    };

    console.log('Silverplay Pro script yüklendi — kumanda hazır');
});
