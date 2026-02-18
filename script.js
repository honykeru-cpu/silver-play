// main.js - Tizen TV kumanda için garanti çalışır versiyon

window.onload = function() {
    // Kumanda tuşlarını kaydet (gecikmeli yapıyoruz, hazır olsun diye)
    setTimeout(function() {
        try {
            if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log("Tuşlar kaydedildi, artık çalışıyor!");
            } else {
                console.error("Tizen objesi yok—privilege mı eksik?");
            }
        } catch (err) {
            console.error("Hata:", err.message);
        }
    }, 1000); // 1 saniye bekle, TV hazır olsun

    // Ekranı basit tutalım, test için
    document.body.innerHTML = '<div style="color:white; font-size:3em; text-align:center; padding-top:30vh;">' +
        'Kumanda Testi<br>' +
        '<span id="key">Henüz basılmadı...</span>' +
        '</div>';

    // Tuşları dinle
    document.addEventListener('keydown', function(e) {
        var key = document.getElementById('key');
        var code = e.keyCode;

        if (code === 37) key.innerText = "← Sol";
        else if (code === 38) key.innerText = "↑ Yukarı";
        else if (code === 39) key.innerText = "→ Sağ";
        else if (code === 40) key.innerText = "↓ Aşağı";
        else if (code === 13) key.innerText = "Enter - Seçildi!";
        else if (code === 10009 || code === 461) key.innerText = "Geri/Exit - Çıkıyor...";
        else key.innerText = "Tuş kodu: " + code;
    });
};
