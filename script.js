// Tizen YouTube Style Navigation (YouTube Tarzı Gezinme Sistemi)
let currentIndex = 0;

document.addEventListener('keydown', function(e) {
    const cards = document.querySelectorAll('.card'); // Kutucukların sınıfı
    if (cards.length === 0) return;

    // Önceki seçili olanın stilini kaldır
    cards[currentIndex].classList.remove('selected');

    switch(e.keyCode) {
        case 37: // Sol (Left)
            if (currentIndex > 0) currentIndex--;
            break;
        case 39: // Sağ (Right)
            if (currentIndex < cards.length - 1) currentIndex++;
            break;
        case 13: // Tamam (Enter/OK)
            cards[currentIndex].click(); // Seçili kutuya tıklar
            break;
        case 10009: // Geri (Return/Back)
            if (window.tizen) tizen.application.getCurrentApplication().hide();
            break;
    }

    // Yeni seçilen kutuyu işaretle ve ekrana odakla
    cards[currentIndex].classList.add('selected');
    cards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
});

// Sayfa ilk açıldığında ilk kutuyu seç
window.onload = function() {
    const firstCard = document.querySelector('.card');
    if (firstCard) firstCard.classList.add('selected');
};
