// Kırık'ın openAPI fonksiyonunu şu şekilde güncelle:
window.openAPI = (url, baslik) => {
    const titleEl = document.getElementById('api-title');
    const frame = document.getElementById('api-frame');
    const cont = document.getElementById('video-container');

    if (titleEl) titleEl.textContent = baslik || 'YÜKLENİYOR...';
    
    // EĞER TV IFRAME ENGELLEYERSE DOĞRUDAN SİTEYE GİT (Burası kritik!)
    if (cont) {
        cont.classList.remove('hidden');
        if (frame) {
            frame.src = url;
            frame.focus();
        }
    } else {
        window.location.href = url; // Katman yoksa direkt siteye uçur
    }
};
