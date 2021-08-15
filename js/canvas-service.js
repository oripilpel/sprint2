let gCanvas;
let gCtx;
function setListeners() {
    gCanvas.addEventListener("touchstart", onTouch, false);
    gCanvas.addEventListener("touchmove", onMoveItem, false);
    gCanvas.addEventListener("touchend", onCancelDrag, false);
}

function setCanvas() {
    gCanvas = document.querySelector('.canvas')
    gCtx = gCanvas.getContext('2d');
    gCanvas.width = ((window.innerWidth - 60) > 500) ? 500 : window.innerWidth - 60
}

function renderCanvas(isDownloading) {
    const meme = getMeme();
    gCtx.clearRect(0, 0, gCanvas.height, gCanvas.width)
    drawImg(getElImage(meme.selectedImgId))
    if (!meme.items) return;
    meme.items.forEach((item, idx) => {
        if (item.type === 'line') {
            setAlign(item.align);
            gCtx.save();
            gCtx.font = `${item.size}px ${gStyleOpts.font}`
            gCtx.fillStyle = item.color
            gCtx.lineWidth = 4;
            gCtx.strokeText(item.txt, item.x, item.y);
            gCtx.fillText(item.txt, item.x, item.y);
            if (meme.selectedItemIdx === idx && !isDownloading) markChoosenItem(item)
        }
        else {
            const img = new Image();
            img.src = item.src
            gCtx.drawImage(img, item.x, item.y, item.size, item.size)
            gCtx.beginPath();
            if (!isDownloading) {
                gCtx.arc(item.x + item.size + 7, item.y + item.size + 7, 7, 0, 2 * Math.PI);
                gCtx.fillStyle = 'pink'
                gCtx.fill();
            }
            if (meme.selectedItemIdx === idx && !isDownloading) markChoosenItem(item)
        }
    })

}

function drawImg(elImg) {
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height)
}

function getCanvas() {
    return gCanvas
}

function getCanvasWidth() {
    return gCanvas.width
}

function getCanvasHeight() {
    return gCanvas.height
}

function setAlign(direction) {
    switch (direction) {
        case 'right':
            gCtx.textAlign = 'end'
            break;
        case 'left':
            gCtx.textAlign = 'start'
            break;
        case 'center':
            gCtx.textAlign = 'center'
            break;
    }
}

function markChoosenItem(item) {
    gCtx.save()
    gCtx.strokeStyle = '#ffffff'
    gCtx.lineWidth = 3;
    gCtx.beginPath();
    if (item.type === 'line') {
        const txtWidth = gCtx.measureText(item.txt).width;
        item.width = txtWidth;
        switch (item.align) {
            case 'right':
                var rectStart = item.x - txtWidth
                break;
            case 'left':
                var rectStart = item.x
                break;
            case 'center':
                var rectStart = item.x - txtWidth / 2
                break;
        }
        gCtx.strokeRect(rectStart - 5, item.y - item.size, txtWidth + 10, item.size + 5)
    } else {

        gCtx.strokeRect(item.x, item.y, item.size, item.size)
    }
    gCtx.closePath();
    gCtx.restore()
}

function getElImage(imgId) {
    return document.querySelector(`[data-imgNum="${imgId}"]`)
}

function resizeCanvas(elImg) {
    const imgH = elImg.height
    const imgW = elImg.width
    gCanvas.height = gCanvas.width * imgH / imgW;
}