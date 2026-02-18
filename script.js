let currentIndex = 0;

document.addEventListener('keydown', function(e) {
    const cards = document.querySelectorAll('.selectable');
    const container = document.getElementById('video-container');
    const frame = document.getElementById('api-frame');

    // Eğer YouTube açıksa Geri tuşuyla kapat
    if (container.style.display === 'block' && (e.keyCode === 10009 || e.keyCode === 27)) {
        container.style.display = 'none';
        frame.src = "";
        return;
    }

    if (cards.length === 0) return;
    cards[currentIndex].classList.remove('selected');

    switch(e.keyCode) {
        case 37: // Sol
            if (currentIndex > 0) currentIndex--;
            break;
        case 39: // Sağ
            if (currentIndex < cards.length - 1) currentIndex++;
            break;
        case 13: // Tamam (Enter)
            const url = cards[currentIndex].getAttribute('href');
            const type = cards[currentIndex].getAttribute('data-type');

            if (type === "api") {
                // YouTube'u içeride aç (Reklam engelleme için en iyi yol)
                frame.src = url;
                container.style.display = 'block';
            } else {
                // Diğerlerini normal aç
                window.location.href = url;
            }
            break;
        case 10009: // Geri (Uygulamadan çıkış)
            if (window.tizen) tizen.application.getCurrentApplication().exit();
            break;
    }

    cards[currentIndex].classList.add('selected');
});

// İlk odağı ver
window.onload = () => {
    setTimeout(() => {
        const first = document.querySelector('.selectable');
        if (first) first.classList.add('selected');
    }, 500);
};
