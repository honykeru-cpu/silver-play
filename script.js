// main.js - Tizen TV için Netflix benzeri grid navigasyon (kumanda + mouse)

window.onload = function() {
    // Kumanda tuşlarını aktif et (1 sn gecikmeyle)
    setTimeout(() => {
        try {
            if (tizen && tizen.tvinputdevice) {
                tizen.tvinputdevice.registerKeyBatch([
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Enter', 'Return', 'Exit', 'Back'
                ]);
                console.log("Kumanda hazır!");
            }
        } catch (e) { console.error("Tizen hatası:", e); }
    }, 1000);

    // Grid oluştur (örnek 4x3 kutu - sen kendi içeriğini koy)
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid; grid-template-columns:repeat(4,1fr); gap:20px; padding:40px; max-width:90%; margin:auto;';
    
    const items = [
        'Film 1', 'Dizi 2', 'Belgesel 3', 'Canlı TV',
        'Yeni', 'Popüler', 'Çocuk', 'Favoriler',
        'Ayarlar', 'Profil', 'Arama', 'Çıkış'
    ];

    items.forEach((text, i) => {
        const box = document.createElement('div');
        box.className = 'grid-item';
        box.tabIndex = i === 0 ? 0 : -1; // ilk kutu odaklansın
        box.textContent = text;
        box.style.cssText = 'background:#333; color:white; height:150px; display:flex; align-items:center; justify-content:center; border-radius:12px; font-size:1.5em; transition:0.3s; outline:none;';
        box.dataset.row = Math.floor(i / 4);
        box.dataset.col = i % 4;
        grid.appendChild(box);
    });

    document.body.appendChild(grid);
    document.body.style.background = '#000';
    document.body.style.margin = '0';
    document.body.style.fontFamily = 'Arial, sans-serif';

    // Focus stili
    const style = document.createElement('style');
    style.textContent = `
        .grid-item:focus, .grid-item.focused {
            outline: 4px solid #00ffea !important;
            transform: scale(1.05);
            box-shadow: 0 0 20px #00ffea;
        }
    `;
    document.head.appendChild(style);

    // Şu anki focus'u takip et
    let currentFocus = grid.querySelector('.grid-item ');

    // Kumanda + klavye için navigasyon
    document.addEventListener('keydown', (e) => {
        if (!currentFocus) return;
        const row = parseInt(currentFocus.dataset.row);
        const col = parseInt(currentFocus.dataset.col);
        let next = null;

        switch(e.keyCode) {
            case 37: // Sol
                next = document.querySelector(`[data-row="${row}" data-row="${row-1}" data-row="${row}" data-row="${row+1}"] `);
                break;
            case 13: // Enter
                alert('Seçildi: ' + currentFocus.textContent); // buraya kendi aksiyonunu koy
                return;
            case 10009: case 461: // Back/Exit
                tizen.application.getCurrentApplication().exit();
                return;
        }

        if (next) {
            currentFocus.classList.remove('focused');
            currentFocus = next;
            currentFocus.classList.add('focused');
            currentFocus.focus();
            e.preventDefault();
        }
    });

    // Mouse desteği: hover'la focus değiştir
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('mouseover', () => {
            if (currentFocus) currentFocus.classList.remove('focused');
            currentFocus = item;
            item.classList.add('focused');
            item.focus();
        });
        item.addEventListener('click', () => {
            alert('Tıklanan: ' + item.textContent); // buraya aksiyon
        });
    });

    // İlk kutuyu focus'la
    currentFocus.focus();
    currentFocus.classList.add('focused');
};
