

export function createModal(billUrl, imgWidth) {
    let content = null
    if(billUrl !== 'null') {
        content = `<img width=${imgWidth} src=${billUrl} />`
    } else {
        content = `<p>Il n'y a aucune image ici...`
    }
    return content
}