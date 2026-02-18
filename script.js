let currentIndex = 0;
let lastBackClick = 0;

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.selectable');
    const ytLayer = document.getElementById('youtube-layer');
    const ytFrame = document.getElementById('yt-frame');

    function updateSelection(index) {
        cards.forEach(c => c.classList.remove('selected'));
        if (cards[index]) {
            cards[index].classList.add('selected');
            currentIndex = index;
        }
    }

    updateSelection(0); // İlk açılışta YouTube'u seç

    document.addEventListener('keydown', (e) => {
        // Kumanda Kodları: 37:Sol, 39:Sağ, 13:Enter, 10009:Back
        switch(e.keyCode) {
            case 37: // Sol
                if (currentIndex > 0) updateSelection(currentIndex - 1);
                break;
            case 39: // Sağ
                if (currentIndex < cards.length - 1) updateSelection(currentIndex + 1);
                break;
            case 13: // Enter (Tamam)
                const target = cards[currentIndex];
                const url = target.getAttribute('href');
                const type = target.getAttribute('data-type');

                if (type === "youtube") {
                    e.preventDefault();
                    ytFrame.src = url;
                    ytLayer.style.display = 'block';
                } else {
                    // Diğer siteleri normal tarayıcıda açar
                    window.location.href = url;
                }
                break;
            case 10009: // Return (Geri)
            case 27:    // ESC
                if (ytLayer.style.display === 'block') {
                    // YouTube açıksa kapat ve ana menüye dön
                    ytLayer.style.display = 'none';
                    ytFrame.src = "";
                } else {
                    // Uygulamadan Çıkış Mantığı: 2 kere hızlı basınca çıkar
                    let currentTime = new Date().getTime();
                    if (currentTime - lastBackClick < 500) {
                        if (window.tizen) tizen.application.getCurrentApplication().exit();
                    } else {
                        lastBackClick = currentTime;
                        // Tek basışta en başa (Ana Sayfa başlığına) odaklanmış gibi yap
                        updateSelection(0);
                    }
                }
                break;
        }
    });

    // Başlığa tıklayınca ana sayfaya yönlendir
    document.getElementById('nav-home').addEventListener('click', () => {
        window.location.reload();
    });
});
