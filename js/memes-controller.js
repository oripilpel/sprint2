'use strict'

let gSavedMemes = [];

function onMemesClick() {
    document.querySelector('.meme-editor').classList.remove('show');
    document.querySelector('.saved-memes').style.display = 'grid';
    document.querySelector('.photo-gallery').style.display = 'none';
    renderSavedMemes()
}

function renderSavedMemes() {
    var elSavedMemes = document.querySelector('.saved-memes');
    elSavedMemes.innerHTML = ''
    gSavedMemes.forEach((data, idx) => {
        const image = new Image();
        image.src = data.img;
        const newDiv = document.createElement("div");
        newDiv.classList.add(`card-${idx}`);
        newDiv.appendChild(image)
        const elEditBtn = document.createElement("a");
        elEditBtn.textContent = 'Edit'
        elEditBtn.setAttribute('class', 'edit-meme-btn')
        elEditBtn.setAttribute('onclick', `onEditMeme(${idx})`)
        const elDownloadBtn = document.createElement("a");
        elDownloadBtn.textContent = 'Download'
        elDownloadBtn.setAttribute('class', 'download-meme-btn')
        elDownloadBtn.setAttribute('href', data.img)
        elDownloadBtn.setAttribute('download', 'myphoto')
        newDiv.appendChild(elDownloadBtn)
        newDiv.appendChild(elEditBtn)
        elSavedMemes.appendChild(newDiv)
    })
}

function onEditMeme(index) {
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
    const data = gCanvas.toDataURL()
    gSavedMemes.push({
        img: data, meme: JSON.parse(JSON.stringify(getMeme()))
    })
    saveMemes()
}
