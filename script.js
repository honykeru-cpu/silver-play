// main.js - Sadece kumanda + mouse desteği (hiçbir şey eklemez, senin app'ine dokunmaz)

window.onload = function() {
    // 1. Kumanda tuşlarını aktif et (gecikmeli, Tizen hazır olsun)
    setTimeout(() => {
        try {
            if (tizen && tizen.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log("Kumanda tuşları aktif.");
            } else {
                console.error("Tizen objesi bulunamadı.");
            }
        } catch (e) {
            console.error("Kumanda hatası:", e.message);
        }
    }, 800);

    // 2. Mouse desteği (fareyi hareket ettirince hover/focus doğal çalışsın)
    document.body.style.cursor = 'default';
    document.addEventListener('pointermove', () => {
        // Mouse hareketi algılandı, TV pointer'ı aktif
        if (tizen && tizen.tvinputdevice) {
            tizen.tvinputdevice.registerKey('Pointer'); // fareyi TV kumandası gibi kullan
        }
    });

    // 3. Tuşları yakala (senin app'in zaten varsa, sadece bu event'i ekle)
    document.addEventListener('keydown', (e) => {
        console.log("Tuş basıldı:", e.keyCode); // test için, sonra silersin

        // Senin uygulamanın kendi tuş mantığını buraya bağla
        // Örnek: Enter'a basıldığında bir şey yap
        if (e.keyCode === 13) {
            console.log("Enter: Seçildi!");
            // buraya senin API çağrısını koy: mesela fetchSeasonStudio();
        }
        if (e.keyCode === 10009 || e.keyCode === 461) {
            console.log("Geri: Çıkılıyor...");
            tizen.application.getCurrentApplication().exit();
        }
    });

    // Mouse tıklamalarını da yakala (isteğe bağlı)
    document.addEventListener('click', (e) => {
        console.log("Mouse tıklandı:", e.target);
        // senin app'in tıklama mantığını buraya bağla
    });
};
