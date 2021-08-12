'use strict'

let gSavedMemes = [];
let gEditIndex = -1;

function onMemesClick() {
    document.querySelector('.meme-editor').classList.remove('show');
    document.querySelector('.saved-memes').style.display = 'grid';
    document.querySelector('.photo-gallery').style.display = 'none';
    gEditIndex = -1;
    renderSavedMemes()
}

function renderSavedMemes() {
    var elSavedMemes = document.querySelector('.saved-memes');
    elSavedMemes.innerHTML = '';
    let html = gSavedMemes.map((meme, idx) => {
        return `<div class="card=${idx}">
        <img src="${meme.img}">
        <a class="download-meme-btn" href="${meme.img}" download="Meme">Download</a>
        <a class="edit-meme-btn" onclick="onEditMeme(${idx})">Edit</a>
        </div>`
    }).join('');
    elSavedMemes.innerHTML = html;
}

function onEditMeme(index) {
    gEditIndex = index;
    reSetMeme(gSavedMemes[index].meme);
    const meme = getMeme()
    const elImg = getElImage(meme.selectedImgId)
    onImgClick(elImg, true)
}

function saveMemes() {
    saveToStorage('Memes', gSavedMemes)
}

function loadMemes() {
    const savedMemes = loadFromStorage('Memes')
    if (!savedMemes || !savedMemes.length) gSavedMemes = []
    else gSavedMemes = savedMemes
}

function onSave() {
    renderCanvas(true)
    if (gEditIndex < 0) {
        const data = gCanvas.toDataURL()
        gSavedMemes.push({
            img: data, meme: JSON.parse(JSON.stringify(getMeme()))
        })
    }
    else {
        gSavedMemes[gEditIndex].img = gCanvas.toDataURL()
        gSavedMemes[gEditIndex].meme = JSON.parse(JSON.stringify(getMeme()))
    }
    saveMemes()
}
