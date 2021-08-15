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
    if (!meme.lines) return;
    meme.lines.forEach((line, idx) => {
        setAlign(line.align);
        gCtx.save();
        gCtx.font = `${line.size}px ${gStyleOpts.font}`
        gCtx.fillStyle = line.color
        gCtx.lineWidth = 4;
        gCtx.strokeText(line.txt, line.x, line.y);
        gCtx.fillText(line.txt, line.x, line.y);
        if (meme.selectedLineIdx === idx && !isDownloading) markChoosenLine(line)
    })
    if (meme.stickers && meme.stickers.length) {
        meme.stickers.forEach(sticker => {
            const img = new Image();
            img.src = sticker.src
            gCtx.drawImage(img, sticker.x, sticker.y, sticker.size, sticker.size)
            gCtx.beginPath();
            if (!isDownloading) {
                gCtx.arc(sticker.x + sticker.size + 7, sticker.y + sticker.size + 7, 7, 0, 2 * Math.PI);
                gCtx.fillStyle = 'pink'
                gCtx.fill();
            }
        })
    }
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

function markChoosenLine(line) {
    const txtWidth = gCtx.measureText(line.txt).width;
    line.width = txtWidth;
    gCtx.save()
    gCtx.strokeStyle = '#ffffff'
    gCtx.lineWidth = 3;
    gCtx.beginPath();
    switch (line.align) {
        case 'right':
            var rectStart = line.x - txtWidth
            break;
        case 'left':
            var rectStart = line.x
            break;
        case 'center':
            var rectStart = line.x - txtWidth / 2
            break;
    }
    gCtx.strokeRect(rectStart - 5, line.y - line.size, txtWidth + 10, line.size + 5)
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