// script.js - Silverplay Pro için Tizen TV: Kumanda + Mouse + Smooth Navigasyon + API entegrasyonu

document.addEventListener('DOMContentLoaded', function () {
    // Kumanda tuşlarını kaydet (gecikmeli – Tizen hazır olsun)
    setTimeout(function () {
        try {
            if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log('Kumanda tuşları kaydedildi → ok, enter, geri çalışıyor');
            } else {
                console.warn('Tizen objesi yok – privilege eksik olabilir');
            }
        } catch (err) {
            console.error('Kumanda kayıt hatası:', err.message);
        }
    }, 1200);  // 1.2 sn bekle – çoğu TV'de yeterli

    // Kutuları seç (senin .box class'lı a etiketleri)
    const boxes = document.querySelectorAll('.grid-container .box');
    let currentIndex = 0;

    // Focus stili uygula (CSS'e bağımlı değil, JS ile yönet)
    function focusCurrentBox() {
        boxes.forEach((b, idx) => {
            b.classList.toggle('focused', idx === currentIndex);
        });
        if (boxes[currentIndex]) {
            boxes[currentIndex].focus();
        }
    }

    // İlk kutuya odaklan
    if (boxes.length > 0) {
        focusCurrentBox();
    }

    // Mouse desteği: hover ile focus değiştir + tıklama ile aç
    boxes.forEach((box, index) => {
        box.addEventListener('mouseover', function () {
            currentIndex = index;
            focusCurrentBox();
        });

        box.addEventListener('click', function (e) {
            e.preventDefault();
            openAPI(box.href, box.getAttribute('data-name') || box.textContent.trim());
        });
    });

    // Kumanda tuş dinleyicisi
    document.addEventListener('keydown', function (e) {
        const key = e.keyCode;
        let handled = true;

        switch (key) {
            case 37: // Sol ←
                if (currentIndex > 0) {
                    currentIndex--;
                    focusCurrentBox();
                }
                break;

            case 39: // Sağ →
                if (currentIndex < boxes.length - 1) {
                    currentIndex++;
                    focusCurrentBox();
                }
                break;

            case 38: // Yukarı ↑
                if (currentIndex >= 4) {  // 4 sütun varsayımı (senin grid 4 tane)
                    currentIndex -= 4;
                    focusCurrentBox();
                }
                break;

            case 40: // Aşağı ↓
                if (currentIndex + 4 < boxes.length) {
                    currentIndex += 4;
                    focusCurrentBox();
                }
                break;

            case 13: // Enter (OK tuşu)
                if (boxes[currentIndex]) {
                    openAPI(boxes[currentIndex].href, boxes[currentIndex].getAttribute('data-name') || boxes[currentIndex].textContent.trim());
                }
                break;

            case 10009: // Return / Back (çoğu Tizen'de 10009)
            case 461:   // Bazı modellerde alternatif Back kodu
                if (!document.getElementById('video-container').classList.contains('hidden')) {
                    closeAPI();  // Videodan çık
                } else {
                    try {
                        tizen.application.getCurrentApplication().exit();  // Ana ekrandan app'i kapat
                    } catch (ex) {
                        console.warn('Çıkış yapılamadı:', ex);
                    }
                }
                break;

            default:
                handled = false;
        }

        if (handled) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Senin orijinal open/close fonksiyonları (window'a ekliyoruz ki HTML'deki onclick görsün)
    window.openAPI = function (url, title) {
        const frame = document.getElementById('api-frame');
        const container = document.getElementById('video-container');
        const apiTitle = document.getElementById('api-title');

        if (url && frame && container && apiTitle) {
            apiTitle.textContent = title || 'YÜKLENİYOR...';
            frame.src = url;
            container.classList.remove('hidden');
            frame.focus();  // iframe'e odaklan (kumanda orada devam etsin)
        }
    };

    window.closeAPI = function () {
        const container = document.getElementById('video-container');
        const frame = document.getElementById('api-frame');

        if (frame && container) {
            frame.src = '';  // temizle
            container.classList.add('hidden');
            focusCurrentBox();  // ana gride geri odaklan
        }
    };
});
