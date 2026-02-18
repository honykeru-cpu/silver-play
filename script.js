let currentPos = 0;
let backPressCount = 0;
let backTimer;

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.selectable');
    const ytLayer = document.getElementById('yt-layer');
    const ytFrame = document.getElementById('yt-frame');

    function setFocus(idx) {
        items.forEach(item => item.classList.remove('selected'));
        if (items[idx]) {
            items[idx].classList.add('selected');
            currentPos = idx;
        }
    }

    // İlk açılış odağı
    setFocus(0);

    document.addEventListener('keydown', (e) => {
        // Tizen Kumanda Kodları: 37:Sol, 39:Sağ, 13:Tamam, 10009:Geri
        switch(e.keyCode) {
            case 37: // Sol
                if (currentPos > 0) setFocus(currentPos - 1);
                break;
            case 39: // Sağ
                if (currentPos < items.length - 1) setFocus(currentPos + 1);
                break;
            case 13: // Tamam (Enter)
                const link = items[currentPos].getAttribute('href');
                const targetType = items[currentPos].getAttribute('data-target');

                if (targetType === "internal") {
                    e.preventDefault();
                    ytFrame.src = link;
                    ytLayer.style.display = 'block';
                } else {
                    // TV Tarayıcısında doğrudan aç
                    window.location.href = link;
                }
                break;
            case 10009: // Geri (Return)
            case 27:    // PC için ESC
                if (ytLayer.style.display === 'block') {
                    ytLayer.style.display = 'none';
                    ytFrame.src = "";
                } else {
                    // 2 Kere Basınca Çıkış Mantığı
                    backPressCount++;
                    setFocus(0); // Tek basışta odağı YouTube'a (başa) çeker
                    
                    if (backPressCount === 1) {
                        backTimer = setTimeout(() => { backPressCount = 0; }, 1500);
                    } else if (backPressCount === 2) {
                        clearTimeout(backTimer);
                        if (window.tizen) tizen.application.getCurrentApplication().exit();
                    }
                }
                break;
        }
    });

    // Ana Sayfa başlığına basınca her şeyi sıfırla
    document.getElementById('main-nav').addEventListener('click', () => {
        window.location.reload();
    });
});
