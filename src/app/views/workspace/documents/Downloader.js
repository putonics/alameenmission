const toDataURL = async (url) => {
    return fetch(url).then((response) => {
        return response.blob();
    }).then(blob => {
        return URL.createObjectURL(blob);
    });
}
// URL.revokeObjectURL(blobURL);//to release url created by URL.createObjectURL
const toFileUrl = async (url, filename) => {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new File([blob], filename, { type: "image/jpg" }))
        .then(file => URL.createObjectURL(file))
}

/**
* @param {string} filename 
* @param {string} url
*/
export const downloadImageFile = async (url, filename) => {
    const a = document.createElement("a");
    const urlx = await toFileUrl(url);
    a.href = urlx;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(urlx);
        document.body.removeChild(a);
    }, 300)
}

export const toFile = async (url, filename) => {
    return fetch(url).then((response) => {
        return response.blob();
    }).then(blob => {
        return new File([blob], filename, { type: "image/jpg" });
    }).catch(() => {
        return null
    })
}