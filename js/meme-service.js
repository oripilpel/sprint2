'use-strict'

let gMeme = {};

function setMeme(elImg, isEdit) {
    gMeme.selectedImgId = +elImg.dataset.imgnum
    gMeme.linesCnt = 0;
    gMeme.selectedItemIdx = 0;
    if (!isEdit) {
        gMeme.items = []
    }
}

function addLine() {
    gMeme.selectedItemIdx = gMeme.items.length
    setLinesCount()
}

function getMeme() {
    return gMeme
}

function ChangeFontSize(diff) {
    if (!gMeme.items || !gMeme.items.length) return
    gMeme.items[gMeme.selectedItemIdx].size += diff;
}

function switchItem() {
    if (!gMeme.items || !gMeme.items.length) return
    if (gMeme.selectedItemIdx >= gMeme.items.length - 1) gMeme.selectedItemIdx = 0;
    else gMeme.selectedItemIdx++
}

function changeText(text) {
    if (!gMeme.items || !gMeme.items[gMeme.selectedItemIdx]) {
        const line = { txt: text }
        if (gMeme.items) {

            if (!gMeme.linesCnt) {
                line.y = 40;
            }
            else if (gMeme.linesCnt === 1) {
                line.y = getCanvasHeight() - 10;
            }
            else {
                line.y = getCanvasHeight() / 2 + 30;
            }
        }
        else {
            gMeme.items = [];
            line.y = 40;
        }
        line.type = 'line';
        line.x = getCanvasWidth() / 2;
        line.align = 'center';
        line.size = 30;
        line.color = gStyleOpts.color;
        gMeme.items.push(line);
    }
    else if (gMeme.items[gMeme.selectedItemIdx].type !== 'sticker') {
        gMeme.items[gMeme.selectedItemIdx].txt = text;
    }
}

function textAlign(direction) {
    if (!gMeme.items || !gMeme.items.length || gMeme.items[gMeme.selectedItemIdx].type === 'sticker') return
    const currLine = gMeme.items[gMeme.selectedItemIdx]
    switch (direction) {
        case 'right':
            currLine.x = getCanvasWidth() - 10
            currLine.align = 'right'
            break;
        case 'left':
            currLine.x = 10
            currLine.align = 'left'
            break;
        case 'center':
            currLine.x = getCanvasWidth() / 2
            currLine.align = 'center'
            break;
    }
}

function reSetMeme(meme) {
    gMeme = meme
}

function changeColor(color) {
    if (!gMeme.items || !gMeme.items.length || gMeme.items[gMeme.selectedItemIdx].type === 'sticker') return
    gMeme.items[gMeme.selectedItemIdx].color = color;
}

function addSticker(elImg) {
    setLinesCount();
    gMeme.items.push({ type: 'sticker', src: elImg.src, x: (getCanvasWidth() / 2) - 20, y: (getCanvasHeight() / 2) - 20, size: 40 })
    if (!gMeme.selectedItemIdx && gMeme.items.length === 1) return
    gMeme.selectedItemIdx = gMeme.items.length - 1
}

function setLinesCount() {
    var count = 0
    gMeme.items.forEach(item => {
        if (item.type === 'line') count++
    })
    gMeme.linesCnt = count
}