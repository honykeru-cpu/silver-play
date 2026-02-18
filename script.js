let currentIndex = 0;

document.addEventListener('keydown', function(e) {
    const cards = document.querySelectorAll('.selectable');
    if (cards.length === 0) return;

    // Seçimi temizle
    cards[currentIndex].classList.remove('selected');

    switch(e.keyCode) {
        case 37: // Sol (Left)
            if (currentIndex > 0) currentIndex--;
            break;
        case 39: // Sağ (Right)
            if (currentIndex < cards.length - 1) currentIndex++;
            break;
        case 13: // Tamam (Enter)
            // Doğrudan siteye yönlendiren o basit ama etkili komut
            window.location.href = cards[currentIndex].getAttribute('href');
            break;
        case 10009: // Geri (Return)
            if (window.tizen) {
                tizen.application.getCurrentApplication().hide();
            } else {
                window.history.back();
            }
            break;
    }

    // Yeni kutuyu seç
    cards[currentIndex].classList.add('selected');
    cards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Sayfa açıldığında ilk kutuyu parlat
window.onload = function() {
    setTimeout(() => {
        const firstCard = document.querySelector('.selectable');
        if (firstCard) firstCard.classList.add('selected');
    }, 500);
};
