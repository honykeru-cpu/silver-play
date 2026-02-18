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

    setFocus(0); // İlk açılış odağı YouTube

    document.addEventListener('keydown', (e) => {
        // Tizen Kumanda Kodları: 37:Sol, 39:Sağ, 13:Enter, 10009:Geri
        switch(e.keyCode) {
            case 37: // Sol
                if (currentPos > 0) setFocus(currentPos - 1);
                break;
            case 39: // Sağ
                if (currentPos < items.length - 1) setFocus(currentPos + 1);
                break;
            case 13: // Tamam (Enter)
                const link = items[currentPos].getAttribute('href');
                const type = items[currentPos].getAttribute('data-type');

                if (type === "internal") {
                    e.preventDefault();
                    ytFrame.src = link;
                    ytLayer.style.display = 'block';
                } else {
                    // Samsung TV Tarayıcısını dışarıdan başlatma komutu
                    if (window.tizen) {
                        tizen.application.launch("org.tizen.browser", function() {
                            // Tarayıcı açıldıktan sonra linke yönlendir
                            window.location.href = link;
                        });
                    } else {
                        window.location.href = link;
                    }
                }
                break;
            case 10009: // Geri (Return)
                if (ytLayer.style.display === 'block') {
                    ytLayer.style.display = 'none';
                    ytFrame.src = "";
                } else {
                    // 2 Kere Basınca Çıkış / Tek basınca Ana Sayfaya Atma
                    backPressCount++;
                    setFocus(0); // Tek basışta odağı en başa atar
                    
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

    // Silver Play Pro başlığına tıklanınca ana sayfayı yenile
    document.getElementById('main-nav').addEventListener('click', () => {
        window.location.reload();
    });
});
