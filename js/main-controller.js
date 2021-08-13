'use-strict'
const gKeywords = { tv: 1, animals: 1, politics: 1, children: 1, laugh: 1 }
let gImgs;
let gCanvas;
let gCtx;
let gStyleOpts;
let gIsDrag;


function onInit() {
    createPics()
    renderPics()
    setCanvas()
    loadMemes()
    renderWords()
    gStyleOpts = { font: 'Impact', color: 'black' }
}

function renderWords() {
    const elWordContainer = document.querySelector('.word-list');
    elWordContainer.innerHTML = ''
    for (word in gKeywords) {
        elWordContainer.innerHTML += `<a class="keyword" style="font-size:${(gKeywords[word] * 5) + 11}px" onclick="onFilterPics('${word}')">${word}</a>`
    }
}

function renderPics(filter) {
    const elGallery = document.querySelector('.gallery');
    let imgs;
    if (filter) {
        imgs = gImgs.filter(img => {
            return img.categories.includes(filter)
        })
    } else imgs = gImgs
    elGallery.innerHTML = imgs.map((img, idx) => {
        return `<img data-imgNum=${idx + 1} onclick="onImgClick(this)" src="${img.url}">`
    }).join('')
}

function createPics() {
    gImgs = []
    const cats = {
        tv: [1, 7, 10, 11, 12, 18, 19, 20, 21, 22, 24],
        animals: [3, 4, 6, 16],
        politics: [2, 14, 17, 23],
        children: [4, 5, 8, 13, 15],
        laugh: [8, 17, 22]
    }
    for (var i = 1; i < 25; i++) {
        var categories = [];
        for (cat in cats) {
            if (cats[cat].includes(i)) categories.push(cat)
        }
        gImgs.push({ id: i, url: `img/${i}.jpg`, categories })
    }
}

function onGalleryClick() {
    document.querySelector('.meme-editor').classList.remove('show');
    document.querySelector('.saved-memes').style.display = 'none';
    document.querySelector('.photo-gallery').style.display = 'block';
    document.querySelector('[name="line"]').value = '';
    gEditIndex = -1;
}

function onImgClick(elImg, isEdit) {
    document.querySelector('.meme-editor').classList.add('show');
    document.querySelector('.saved-memes').style.display = 'none';
    document.querySelector('.photo-gallery').style.display = 'none';
    resizeCanvas(elImg)
    drawImg(elImg)
    setMeme(elImg, isEdit)
    renderCanvas()
}

function onSelectColor() {
    document.querySelector('#color').hidden = false;
}

function onChangeColor(color) {
    document.querySelector('#color').hidden = true;
    gStyleOpts.color = color
    changeColor(color);
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
    const meme = getMeme();
    const elInput = document.querySelector('[name="line"]')
    elInput.value = (!meme.lines || !meme.lines.length) ? '' : meme.lines[meme.selectedLineIdx].txt
    renderCanvas()
}

function onChangeText(text) {
    changeText(text);
    renderCanvas()
}

function onAlignText(direction) {
    textAlign(direction)
    renderCanvas()
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
        gCtx.strokeStyle = line.color
        gCtx.lineWidth = 4;
        gCtx.strokeText(line.txt, line.x, line.y);
        gCtx.fillStyle = 'white';
        gCtx.fillText(line.txt, line.x, line.y);
        if (meme.selectedLineIdx === idx && !isDownloading) markChoosenLine(line)
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
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height)
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

function onRemoveLine() {
    const meme = getMeme();
    if (!meme.lines || !meme.lines.length) return
    if (meme.lines.length === 1) document.querySelector('[name="line"]').value = ''
    meme.lines.splice(meme.selectedLineIdx, 1);
    switchLine()
    renderCanvas()
}

function onSelectFont(font) {
    gStyleOpts.font = font;
    renderCanvas();
}

function onDownload(elLink) {
    renderCanvas(true)
    const data = gCanvas.toDataURL()
    elLink.href = data;
    renderCanvas()
}

function onDrag(ev) {
    const pos = { x: ev.offsetX, y: ev.offsetY }
    const meme = getMeme();
    meme.lines.forEach((line, idx) => {
        let txtXStart;
        switch (line.align) {
            case 'left':
                txtXStart = line.x
                break;
            case 'center':
                txtXStart = line.x - line.width / 2
                break;
            case 'right':
                txtXStart = line.x - line.width
                break;
        }
        if (pos.x >= txtXStart && pos.x <= txtXStart + line.width && pos.y <= line.y && pos.y >= line.y - line.size) {
            meme.selectedLineIdx = idx
            document.querySelector('[name="line"]').value = line.txt
            renderCanvas()
            gIsDrag = true;
            return
        }
    })
}

function onMoveLine(ev) {
    if (!gIsDrag) return
    const pos = { x: ev.offsetX, y: ev.offsetY }
    const meme = getMeme()
    const currLine = meme.lines[meme.selectedLineIdx]
    currLine.x = pos.x
    currLine.y = pos.y
    renderCanvas()
}

function onCancelDrag() {
    gIsDrag = false
}

function resizeCanvas(elImg) {
    const imgH = elImg.height
    const imgW = elImg.width
    gCanvas.height = gCanvas.width * imgH / imgW;
}

function onFilterPics(filter) {
    const elSearch = document.querySelector('[name="search"]')
    if (gKeywords[filter] && gKeywords[filter] < 8) gKeywords[filter]++
    if (!filter) filter = elSearch.value.trim()
    else {
        renderWords()
        elSearch.value = filter
    }
    renderPics(filter)
}