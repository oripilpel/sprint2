'use-strict'

let gMeme = {};

function setMeme(elImg, isEdit) {
    gMeme.selectedImgId = +elImg.dataset.imgnum
    gMeme.selectedLineIdx = 0;
    if (!isEdit) gMeme.lines = [];
}

function addLine() {
    gMeme.selectedLineIdx++
}

function getMeme() {
    return gMeme
}

function ChangeFontSize(diff) {
    if (!gMeme.lines || !gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}

function switchLine() {
    if (!gMeme.lines || !gMeme.lines.length) return
    if (gMeme.selectedLineIdx >= gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx++
}

function changeText(text) {
    if (!gMeme.lines || !gMeme.lines[gMeme.selectedLineIdx]) {
        line = { txt: text }
        if (gMeme.lines) {
            if (!gMeme.lines.length) {
                gMeme.lines = []
                line.y = 40;
            }
            else if (gMeme.lines.length === 1) {
                line.y = getCanvasHeight() - 10
            }
            else {
                line.y = getCanvasHeight() / 2 + 30
            }
        }
        else {
            gMeme.lines = []
            line.y = 40;
        }
        line.x = getCanvasWidth() / 2
        line.align = 'center'
        line.size = 30
        line.color = gStyleOpts.color
        gMeme.lines.push(line);
    }
    else {
        gMeme.lines[gMeme.selectedLineIdx].txt = text;
    }
}

function textAlign(direction) {
    if (!gMeme.lines || !gMeme.lines.length) return
    const currLine = gMeme.lines[gMeme.selectedLineIdx]
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
    if (!gMeme.lines || !gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}