// main.js - Samsung Tizen TV için temel uygulama (kumanda çalışır)

// Önce gerekli privilege'ları config.xml'de eklemeyi unutma:
// <tizen:privilege name="http://tizen.org/privilege/tv.inputdevice"/>

// Tuşları kaydet (app açıldığında çalışır)
window.onload = function() {
    // Kumanda tuşlarını aktif et
    tizen.tvinputdevice.registerKeyBatch([
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
        'Enter', 'Exit', 'Back', 'ColorF1Red', 'ColorF2Green', 'ColorF3Yellow', 'ColorF4Blue'
    ]);

    console.log("Kumanda tuşları aktif! Artık ok, Enter, Back çalışıyor.");

    // Ekranı hazırla (örnek bir mesaj)
    document.body.innerHTML = `
        <h1 style="color:white; text-align:center; margin-top:20vh;">
            Hoş geldin! Kumanda ile oynayabilirsin<br>
            Yukarı / Aşağı / Enter / Geri
        </h1>
        <p id="status" style="color:#00ff00; text-align:center; font-size:1.5em;">
            Şu an hiçbir tuşa basılmadı...
        </p>
    `;

    // Tuş olaylarını dinle
    document.addEventListener('keydown', function(e) {
        const status = document.getElementById('status');
        
        switch(e.keyCode) {
            case 37: // Sol
                status.innerText = "Sol tuşuna bastın!";
                break;
            case 38: // Yukarı
                status.innerText = "Yukarı tuşuna bastın!";
                break;
            case 39: // Sağ
                status.innerText = "Sağ tuşuna bastın!";
                break;
            case 40: // Aşağı
                status.innerText = "Aşağı tuşuna bastın!";
                break;
            case 13: // Enter
                status.innerText = "Enter'a bastın! (Seçildi)";
                break;
            case 10009: // Exit / Back tuşu (Tizen'de 10009)
                status.innerText = "Geri tuşuna bastın!";
                tizen.application.getCurrentApplication().exit(); // App'i kapat
                break;
            default:
                status.innerText = "Bilinmeyen tuş: " + e.keyCode;
        }
    });
};
