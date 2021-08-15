'use-strict'
const gKeywords = { all: 1, tv: 1, animals: 1, politics: 1, children: 1, laugh: 1 }
let gImgs;
let gStyleOpts;
const gItemPressed = { line: false, sticker: false, 'sticker-resize': false };
let gStickersPage = 0;

function onInit() {
    createPics()
    renderPics()
    setCanvas()
    loadMemes()
    renderWords()
    renderStickers()
    setListeners()
    gStyleOpts = { font: 'Impact', color: 'white' }
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
    if (filter && filter !== 'all') {
        imgs = gImgs.filter(img => {
            return img.categories.includes(filter)
        })
    } else imgs = gImgs
    elGallery.innerHTML = imgs.map((img, idx) => {
        return `<img data-imgNum=${idx + 1} onclick="onImgClick(this)" src="${img.url}">`
    }).reverse().join('')
    elGallery.innerHTML = `<div class="user-img">
        <label for="file-upload">Upload Custom Image</label>
        <input type="file" id="file-upload" onchange="onImgInput(event)" />
        </div>` + elGallery.innerHTML
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
    document.body.removeEventListener('keydown', onKeyPress, true);
    document.querySelector('[name="line"]').value = '';
    gEditIndex = -1;
}

function onImgClick(elImg, isEdit) {
    document.querySelector('.meme-editor').classList.add('show');
    document.body.addEventListener('keydown', onKeyPress, true);
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
    const data = getCanvas().toDataURL()
    elLink.href = data;
    renderCanvas()
}

function onMousePress(ev) {
    const pos = { x: ev.offsetX, y: ev.offsetY }
    onPress(pos);
}

function onPress(pos) {
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
            gItemPressed.line = true;
            return
        }
    })
    meme.stickers.forEach((sticker, idx) => {
        if (pos.x >= sticker.x + sticker.size && pos.x <= sticker.x + sticker.size + 14 && pos.y >= sticker.y + sticker.size && pos.y <= sticker.y + sticker.size + 14) {
            gItemPressed["sticker-resize"] = true;
            meme.selectedStickerIdx = idx;
            return;
        }
        if (pos.x >= sticker.x && pos.x <= sticker.x + sticker.size && pos.y >= sticker.y && pos.y <= sticker.y + sticker.size) {
            meme.selectedStickerIdx = idx
            gItemPressed.sticker = true;
            return
        }
    })

}

function onMoveItem(ev) {
    if (!gItemPressed.line && !gItemPressed.sticker && !gItemPressed["sticker-resize"]) return
    if (!ev.targetTouches) {
        var pos = { x: ev.offsetX, y: ev.offsetY }
    }
    else {
        var pos = { x: ev.targetTouches[0].clientX - ((window.innerWidth - getCanvasWidth()) / 2), y: ev.targetTouches[0].clientY - 70 }
    }
    const meme = getMeme()
    if (gItemPressed.line) {
        const currLine = meme.lines[meme.selectedLineIdx]
        currLine.x = pos.x
        currLine.y = pos.y
    }
    else if (gItemPressed.sticker) {
        const currSticker = meme.stickers[meme.selectedStickerIdx]
        currSticker.x = pos.x - currSticker.size / 2
        currSticker.y = pos.y - currSticker.size / 2
    } else {
        const currSticker = meme.stickers[meme.selectedStickerIdx]
        if (currSticker.y < pos.y) currSticker.size += (pos.y - (currSticker.y + currSticker.size + 7)) / 50;

    }
    renderCanvas()
}

function onCancelDrag() {
    gItemPressed.line = false
    gItemPressed.sticker = false
    gItemPressed["sticker-resize"] = false;
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

function renderStickers() {
    const elStickers = document.querySelector('.stickers-container')
    elStickers.innerHTML = ''
    for (let i = (gStickersPage * 3); i < (gStickersPage * 3) + 3; i++) {
        elStickers.innerHTML += `<img onclick="onStickerClick(this)" src="stickers/${i + 1}.png">`
    }
}

function onStickerClick(elSticker) {
    addSticker(elSticker)
    renderCanvas()
}

function onChangeStickerPage() {
    if (gStickersPage) gStickersPage = 0
    else gStickersPage = 1
    renderStickers()
}

function onTouch(ev) {
    ev.preventDefault()
    const touch = { x: ev.targetTouches[0].clientX - ((window.innerWidth - getCanvasWidth()) / 2), y: ev.targetTouches[0].clientY - 70 }
    onPress(touch)
}

function onResizeCanvas(elImg) {
    if (window.innerWidth < 560) {
        if (!getMeme().selectedImgId) return
        const selectedElImg = (!elImg) ? getElImage(getMeme().selectedImgId) : elImg
        getCanvasWidth() = window.innerWidth - 60
        resizeCanvas(selectedElImg)
        renderCanvas()
    }
}

function onImgInput(ev) {
    loadImageFromInput(ev, function () { onImgClick(document.querySelector(`[data-imgnum="${gImgs.length}"]`)) })
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()
    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
        img.setAttribute('onclick', `onImgClick(this)`)
        img.setAttribute('data-imgnum', `${gImgs.length + 1}`)
        gImgs.push({ id: gImgs.length + 1, url: img.src, categories: [] })
        const elGallery = document.querySelector('.gallery')
        renderPics()
    }
    reader.readAsDataURL(ev.target.files[0])
}

function onKeyPress() {
    const excludedKeys = ["Tab", "CapsLock", "Shift", "Control", "Alt", "ContextMenu", "Delete", "Insert", "Home", "End", "PageDown", "PageUp", "NumLock", "Enter", "Backspace", "Escape"]
    const elLine = document.querySelector('[name="line"]')
    if (!excludedKeys.includes(event.key)) {
        elLine.value += event.key
        onChangeText(elLine.value)
    } else if (event.key === 'Enter') onAddLine()
    else if (event.key === 'Backspace') {
        elLine.value = elLine.value.slice(0, elLine.value.length - 1)
        onChangeText(elLine.value)
    }
}