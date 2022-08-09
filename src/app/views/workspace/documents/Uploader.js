import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

/**
 * @param {Blob} blob 
 * @param {string} firebaseStoragePath
 * @param {(progress: number, status: string)=>void} onProgress 
 * @param {()=>void} onSuccess 
 * @param {(error: string)=>void} onError 
 */
const uploadToFirebaseStorage = (blob, firebaseStoragePath, onProgress, onSuccess, onError) => {
    const uploadTask = uploadBytesResumable(
        ref(getStorage(), firebaseStoragePath),
        blob,
        { contentType: 'image/jpeg' }
    )
    // console.log(firebaseStoragePath)
    // Listen for state changes, errors, and completion of the upload.
    const unsubscribe = uploadTask.on(
        'state_changed',
        (snapshot) => {
            onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100, snapshot.state)
        },
        (error) => { onError(error.code) },
        () => {
            onSuccess()
            unsubscribe()
        }
    )
}

/**
* @param {string} imageUrl
* @returns {Promise<Blob>}
*/
const getBlob = async (imageUrl) => {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return blob
}

/**
* @param {string} imageUrl
* @param {{ x: number, y: number, width: number, height: number }} croppedRect
* @param {{width: number, height: number}} resolution
* @returns {Promise<Blob>}
*/
const getBlobCropped = async (imageUrl, croppedRect, resolution) => new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = resolution.width
        canvas.height = resolution.height
        ctx.drawImage(image,
            croppedRect.x, croppedRect.y, croppedRect.width, croppedRect.height,
            0, 0, canvas.width, canvas.height
        )
        canvas.toBlob(blob => { resolve(blob) }, 'image/jpg', 1)
    })
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues
    image.src = imageUrl
})

/**
* @param {string} imageUrl
* @param {{width: number, height: number}} resolution
* @returns {Promise<Blob>}
*/
const getBlobCompressed = async (imageUrl, resolution) => new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (image.width >= image.height && resolution.width >= resolution.height) {
            canvas.width = resolution.width
            canvas.height = resolution.height
        } else {
            canvas.width = resolution.height
            canvas.height = resolution.width
        }
        ctx.drawImage(image,
            0, 0, image.width, image.height,
            0, 0, canvas.width, canvas.height
        )
        canvas.toBlob(blob => { resolve(blob) }, 'image/jpg', 1)
    })
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues
    image.src = imageUrl
})


/**
 * photo size < 100KB && document size < 700KB
 * @param {string} url 
 * @param {string} imageName
 * @param {(progress: number, status: string)=>void} onProgress 
 * @param {(n: number)=>void} onSuccess 
 * @param {(error: string)=>void} onError 
 */
export const upload = async (url, imageName, onProgress, onSuccess, onError) => {
    const imageBlob = await getBlob(url)
    const sizeInKB = imageBlob.size / 1024
    const isPhoto = imageName.includes('photo')
    if (isPhoto && sizeInKB > 100) {
        onError('Photo size should be less than 100KB')
        return
    }
    if (!isPhoto && sizeInKB > 700) {
        onError('Document size should be less than 700KB')
        return
    }
    const avatarPath = `/avatars/${imageName}.jpg`
    const imagePath = `/documents/${imageName}.jpg`
    const avatarBlob = await getBlobCompressed(url, isPhoto ? { width: 64, height: 64 } : { width: 150, height: 212 })
    uploadToFirebaseStorage(avatarBlob, avatarPath,
        onProgress,
        () => {
            onSuccess(1)
            uploadToFirebaseStorage(imageBlob, imagePath,
                onProgress,
                () => onSuccess(2),
                onError
            )
        },
        onError
    )
}

export const avatarPath = (imageName = '') => `/avatars/${imageName}.jpg`
export const imagePath = (imageName = '') => `/documents/${imageName}.jpg`