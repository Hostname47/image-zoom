let zoomConfig = {}
let zoomBox = document.querySelector('#media-zoom-box');
let lens = document.querySelector('#zoom-lens');

document.querySelector('#media-preview').addEventListener('mouseenter', (event) => {
    zoomBox.classList.remove('none');
    lens.classList.remove('none');
});

document.querySelector('#media-preview').addEventListener('mousemove', (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;

    moveLens(lens, x, y);
});

document.querySelector('#media-preview').addEventListener('mouseleave', (event) => {
    zoomBox.classList.add('none');
    lens.classList.add('none');
});

function moveLens(lens, x, y) {
    // Handling lens bounderies to keep it inside the media box
    if(x <= 70) x = 70;
    if(y <= 70) y = 70;
    if(x >= zoomBox.clientWidth - 70) x = zoomBox.clientWidth - 70;
    if(y >= zoomBox.clientHeight - 70) y = zoomBox.clientHeight - 70;
    
    lens.style.cssText = `left: ${x - 70}px; top: ${y - 70}px;`;
}