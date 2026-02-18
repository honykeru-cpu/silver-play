// Tizen Remote and Mouse Support (Kumanda ve Fare Desteği)

// 1. Kumanda Tuşlarını Tanımlama (Key Mapping)
document.addEventListener('keydown', function(e) {
    console.log("Basılan Tuş: " + e.keyCode);

    switch(e.keyCode) {
        case 37: // Sol
            moveSelection('left');
            break;
        case 38: // Yukarı
            moveSelection('up');
            break;
        case 39: // Sağ
            moveSelection('right');
            break;
        case 40: // Aşağı
            moveSelection('down');
            break;
        case 13: // Tamam (OK)
            const selected = document.querySelector('.selected');
            if(selected) selected.click();
            break;
        case 10009: // Geri (Return)
            if(window.tizen) tizen.application.getCurrentApplication().hide();
            break;
    }
});

// 2. Gezinme Fonksiyonu (Navigation - Gezinme)
function moveSelection(direction) {
    // Görsel yapını bozmamak için sadece seçili elemanı değiştirir
    const cards = document.querySelectorAll('.card'); 
    let currentIndex = Array.from(cards).findIndex(c => c.classList.contains('selected'));
    
    if (currentIndex === -1) {
        if(cards[0]) cards[0].classList.add('selected');
        return;
    }

    cards[currentIndex].classList.remove('selected');

    if (direction === 'right' && currentIndex < cards.length - 1) currentIndex++;
    if (direction === 'left' && currentIndex > 0) currentIndex--;
    
    cards[currentIndex].classList.add('selected');
}
