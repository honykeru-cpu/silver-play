// Tizen Remote and Mouse Integration (Kumanda ve Fare Entegrasyonu)

let currentIndex = 0;
const cards = document.querySelectorAll('.card');

// 1. Seçimi Güncelleme Fonksiyonu (Selection Update)
function updateSelection(index) {
    if (cards.length === 0) return;
    
    // Eski seçimi kaldır
    cards.forEach(card => card.classList.remove('selected'));
    
    // Yeni seçimi ekle
    currentIndex = index;
    if (cards[currentIndex]) {
        cards[currentIndex].classList.add('selected');
        // YouTube tarzı otomatik kaydırma (Scroll)
        cards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
}

// 2. Kumanda Tuş Kontrolü (Remote Control Logic)
document.addEventListener('keydown', function(e) {
    // Tuş kodlarını konsola yazar (Hata ayıklama için)
    console.log("Tuş Basıldı: " + e.keyCode);

    switch(e.keyCode) {
        case 37: // Sol (Left)
            if (currentIndex > 0) updateSelection(currentIndex - 1);
            break;
        case 39: // Sağ (Right)
            if (currentIndex < cards.length - 1) updateSelection(currentIndex + 1);
            break;
        case 13: // Tamam (Enter/OK)
            if (cards[currentIndex]) cards[currentIndex].click();
            break;
        case 10009: // Geri (Return/Back)
            if (window.tizen) tizen.application.getCurrentApplication().hide();
            break;
    }
});

// 3. Mouse/Fare Uyumu (Mouse Hover Support)
// Mouse bir kutunun üzerine geldiğinde kumanda odağını oraya taşır
cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        updateSelection(index);
    });
});

// 4. Sayfa Açıldığında İlk Kutuyu Seç (Auto Focus)
window.onload = () => {
    if (cards.length > 0) {
        setTimeout(() => updateSelection(0), 500);
    }
};
