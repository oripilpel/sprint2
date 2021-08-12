'use-strict'

let gImgs;
let gStyleOpts;
let gCanvas;
let gCtx;


function onInit() {
    createPics()
    renderPics()
    setCanvas()
}

function renderPics() {
    const elGallery = document.querySelector('.gallery');
    gImgs.forEach((img, idx) => {
        elGallery.innerHTML += `<img data-imgNum=${idx + 1} onclick="onImgClick(this)" src="${img.url}">`
    })
}

function createPics() {
    gImgs = []
    for (var i = 1; i < 19; i++) {
        gImgs.push({ id: i, url: `img/${i}.jpg` })
    }
}

function onGalleryClick() {
    document.querySelector('.meme-editor').classList.remove('show');
    document.querySelector('.photo-gallery').style.display = 'flex';
}

function onImgClick(elImg) {
    document.querySelector('.meme-editor').classList.add('show');
    document.querySelector('.photo-gallery').style.display = 'none';
    drawImg(elImg)
    setMeme(elImg)
    renderCanvas()
}

function onAddLine() {
    const elInput = document.querySelector('[name="line"]');
    if (!elInput.value.trim()) return
    elInput.value = ''
    addLine();
    renderCanvas();
}

function onChangeFontSize(diff) {
    ChangeFontSize(diff)
    renderCanvas()
}

function onSwitchLine() {
    switchLine();
    renderCanvas()
}

function onChangeText(text) {
    if (!text.trim()) return
    changeText(text);
    renderCanvas()
}

function onAlignText(direction) {
    textAlign(direction)

    renderCanvas()
}

function renderCanvas() {
    const meme = getMeme();
    gCtx.clearRect(0, 0, gCanvas.height, gCanvas.width)
    drawImg(getElImage(meme.selectedImgId))
    if (!meme.lines) return;
    meme.lines.forEach((line, idx) => {
        setAlign(line.align);
        gCtx.save();
        gCtx.font = `${line.size}px Impact`
        gCtx.lineWidth = 4;
        gCtx.strokeText(line.txt, line.x, line.y);
        gCtx.fillStyle = 'white';
        gCtx.fillText(line.txt, line.x, line.y);
        if (meme.selectedLineIdx === idx) markChoosenLine(line)
    })
}

function setCanvas() {
    gCanvas = document.querySelector('.canvas')
    gCtx = gCanvas.getContext('2d');
}

function getElImage(imgId) {
    return document.querySelector(`[data-imgNum="${imgId}"]`)
}

function drawImg(elImg) {
    gCtx.drawImage(elImg, 0, 0, gCanvas.height, gCanvas.width)
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
}

function onRemoveLine() {
    const meme = getMeme();
    if (!meme.lines) return;
    meme.lines.splice(meme.selectedLineIdx, 1);

    switchLine()
    renderCanvas()
}