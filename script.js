// Tizen Remote and Mouse Support (Televizyon Kumanda ve Mouse Desteği)

// 1. Kumanda Tuşlarını Tanımlama (Key Mapping)
document.addEventListener('keydown', function(e) {
    // Tuş kodunu ekrana basar (Hata ayıklama için)
    console.log("Basılan Tuş: " + e.keyCode);

    switch(e.keyCode) {
        case 37: // Sol (Left)
            navigate('left');
            break;
        case 38: // Yukarı (Up)
            navigate('up');
            break;
        case 39: // Sağ (Right)
            navigate('right');
            break;
        case 40: // Aşağı (Down)
            navigate('down');
            break;
        case 13: // Tamam (Enter/OK)
            const selected = document.querySelector('.selected');
            if(selected) selected.click();
            break;
        case 10009: // Geri (Return/Back)
            if(window.tizen) tizen.application.getCurrentApplication().hide();
            break;
    }
});

// 2. Mouse ve Fokus Sistemi (Navigation Logic)
function navigate(direction) {
    const cards = document.querySelectorAll('.card'); // Senin arayüzündeki kutular
    let currentIndex = Array.from(cards).findIndex(card => card.classList.contains('selected'));
    
    if (currentIndex === -1) {
        cards[0].classList.add('selected');
        return;
    }

    cards[currentIndex].classList.remove('selected');

    if (direction === 'right' && currentIndex < cards.length - 1) currentIndex++;
    if (direction === 'left' && currentIndex > 0) currentIndex--;
    
    cards[currentIndex].classList.add('selected');
    cards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 3. Sayfa Yüklendiğinde İlk Kutuyu Seç (Initialization)
window.onload = function() {
    const firstCard = document.querySelector('.card');
    if(firstCard) firstCard.classList.add('selected');
};
