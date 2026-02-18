let currentIdx = 0;
let backPress = 0;
let timer;

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.selectable');
    const layer = document.getElementById('yt-layer');
    const frame = document.getElementById('yt-frame');

    function updateFocus(idx) {
        cards.forEach(c => c.classList.remove('selected'));
        if (cards[idx]) { cards[idx].classList.add('selected'); currentIdx = idx; }
    }
    updateFocus(0);

    document.addEventListener('keydown', (e) => {
        switch(e.keyCode) {
            case 37: if (currentIdx > 0) updateFocus(currentIdx - 1); break;
            case 39: if (currentIdx < cards.length - 1) updateFocus(currentIdx + 1); break;
            case 13: 
                const link = cards[currentIdx].getAttribute('href');
                if (cards[currentIdx].getAttribute('data-type') === "internal") {
                    layer.style.display = 'block'; frame.src = link;
                } else {
                    if (window.tizen) {
                        const control = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", link);
                        tizen.application.launchAppControl(control, "org.tizen.browser", null, null);
                    } else { window.open(link, '_blank'); }
                }
                break;
            case 10009: 
                if (layer.style.display === 'block') { layer.style.display = 'none'; frame.src = ""; } 
                else {
                    backPress++; updateFocus(0); // Tek basış başa atar
                    if (backPress === 1) { timer = setTimeout(() => { backPress = 0; }, 1500); } 
                    else if (backPress === 2) { if (window.tizen) tizen.application.getCurrentApplication().exit(); }
                }
                break;
        }
    });
    document.getElementById('logo-home').addEventListener('click', () => { window.location.reload(); });
});
