let mediaPreview = document.querySelector('#media-preview');
let mediaPreviewImage = mediaPreview.querySelector('.image');
let zoomBox = document.querySelector('#media-zoom-box');
let zoomImage = document.querySelector('#media-zoom-image');
let lens = document.querySelector('#zoom-lens');
let config = {
    halfLensWidth: 0,
    halfLensHeight: 0,
    zoomedImage: {
        width: 0,
        height: 0,
    },
    lens: {
        left: 0,
        top: 0
    }
}

document.querySelector('#media-preview').addEventListener('mouseenter', (event) => {
    zoomBox.classList.remove('none');
    lens.classList.remove('none');
    // Lens dimensions will be able to be updated once we'll add lens precision increment/decrement
    config.halfLensWidth = lens.clientWidth / 2;
    config.halfLensHeight = lens.clientHeight / 2;

    /**
     * To handle zoom section, we need to perform two key steps:
     *  1. Zoom the image first by increasing background size of image
     *  2. Find the background position to only display the hovered section of the image
     */
    let zoomImageWidth = mediaPreviewImage.clientWidth / lens.clientWidth * mediaPreviewImage.clientWidth;
    let zoomImageHeight = mediaPreviewImage.clientHeight / lens.clientHeight * mediaPreviewImage.clientHeight;

    zoomImage.style.backgroundSize = `${zoomImageWidth}px ${zoomImageHeight}px`;
    
    config.zoomedImage.width = zoomImageWidth;
    config.zoomedImage.height = zoomImageHeight;
});

document.querySelector('#media-preview').addEventListener('mousemove', (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;

    moveLens(x, y);
    moveImage();
});

document.querySelector('#media-preview').addEventListener('mouseleave', (event) => {
    zoomBox.classList.add('none');
    lens.classList.add('none');
});

function moveLens(x, y) {
    // Handling lens bounderies to keep it inside the media box
    if(x <= config.halfLensWidth) x = config.halfLensWidth;
    if(y <= config.halfLensHeight) y = config.halfLensHeight;
    if(x >= mediaPreview.clientWidth - config.halfLensWidth) x = mediaPreview.clientWidth - config.halfLensWidth;
    if(y >= mediaPreview.clientHeight - config.halfLensHeight) y = mediaPreview.clientHeight - config.halfLensHeight;
    
    let lensLeft = x - config.halfLensWidth;
    let lensTop = y - config.halfLensHeight;

    lens.style.left = `${lensLeft}px`;
    lens.style.top = `${lensTop}px`;

    // Set lens details to config
    config.lens.left = lensLeft;
    config.lens.top = lensTop;
}

/**
 * This function basically move the background zoom image to only show the portion covered
 * by the lens. It takes the coordinates of the lens and calculate that coordinates relatively 
 * in the zoomed image and use those values to set the background position.
 */
function moveImage() {
    let left = config.lens.left;
    let top = config.lens.top;

    let coordinates = {
        x: config.zoomedImage.width * left / mediaPreview.clientWidth,
        y: config.zoomedImage.height * top / mediaPreview.clientHeight,
    }
    zoomImage.style.backgroundPosition = `${-coordinates.x}px ${-coordinates.y}px`;
}

document.querySelectorAll('.center-image').forEach(image => {
    image.addEventListener('load', (event) => {
        if(image.clientWidth > image.clientHeight) {
            image.style.width = '100%';
        } else {
            image.style.height = '100%';
        }
    });
});

document.querySelectorAll('#media-container .box').forEach(box => {
    box.addEventListener('click', (event) => {
        // Here media could be an image or a video (we're using only images here for simplicity)
        let image = box.querySelector('.media');
        let mediaPreviewImage = document.querySelector('#media-preview .image');
        let zoomImage = document.querySelector('#media-zoom-image');

        document.querySelectorAll('#media-container .box').forEach(box => { box.classList.remove('selected') });
        box.classList.add('selected');

        console.log(image.naturalWidth);
        console.log(image.naturalHeight);

        if(image.clientWidth > image.clientHeight) {
            mediaPreviewImage.style.width = '100%';
            mediaPreviewImage.style.height = 'auto';
        } else {
            mediaPreviewImage.style.width = 'auto';
            mediaPreviewImage.style.height = '100%';
        }
        mediaPreviewImage.src = image.src;
        zoomImage.style.backgroundImage = `url('${image.src}')`;

    });
});