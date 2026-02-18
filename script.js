let currentIndex = 0;

document.addEventListener('keydown', function(e) {
    const cards = document.querySelectorAll('.selectable');
    const container = document.getElementById('api-container');
    const frame = document.getElementById('api-frame');

    // Eğer bir site açıksa, Geri tuşuyla kapat
    if (container.classList.contains('active') && (e.keyCode === 10009 || e.keyCode === 27)) {
        container.classList.remove('active');
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
        case 13: // Tamam (Enter) - İŞTE AÇAN KOMUT
            const url = cards[currentIndex].getAttribute('href');
            frame.src = url;
            container.classList.add('active');
            break;
    }

    cards[currentIndex].classList.add('selected');
});

// İlk odağı ver
window.onload = () => {
    const first = document.querySelector('.selectable');
    if (first) first.classList.add('selected');
};
