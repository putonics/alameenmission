import React from 'react'
import Cropper from 'react-easy-crop'
import { Box } from '@mui/system'
import { Button, Grid } from '@mui/material'
import { getStorage, ref, uploadBytes } from "firebase/storage"
/**
 * 
 * @param {{
 * resolution:{width: number, height: number}, 
 * firebaseStoragePath: string, 
 * onComplete: (downloadUrl: string) => { }
 * }} props 
 */
const UploadPicture = props => {

    const fileRef = React.createRef()

    const [cropperProps, setCropperProps] = React.useState({
        image: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 1,
        croppedAreaPixels: { x: 0, y: 0, width: 0, height: 0 },
        cropShape: 'rect'
    })

    React.useEffect(() => {
        setCropperProps({
            image: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: props.resolution.width / props.resolution.height,
            croppedAreaPixels: { x: 0, y: 0, width: 0, height: 0 },
            cropShape: props.round ? 'round' : 'rect'
        })
    }, [props])

    const onSelectImage = e => {
        if (e.target.files[0]) {
            setCropperProps({ ...cropperProps, image: URL.createObjectURL(e.target.files[0]) })
        }
    }

    const [progress, setProgress] = React.useState(0)

    const onUpload = () => {
        if (cropperProps.image && cropperProps.croppedAreaPixels.width && cropperProps.croppedAreaPixels.height) {
            upload(
                cropperProps.image, cropperProps.croppedAreaPixels, props.resolution, props.firebaseStoragePath,
                setProgress,
                props.onComplete
            )
        }
    }

    return (
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
            <Box sx={{ position: 'relative', display: 'flex', flexGrow: 1, height: '50vh', backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
                {
                    cropperProps.image &&
                    <Cropper
                        cropShape={cropperProps.cropShape}
                        image={cropperProps.image}
                        crop={cropperProps.crop}
                        zoom={cropperProps.zoom}
                        aspect={cropperProps.aspect}
                        onCropChange={crop => setCropperProps({ ...cropperProps, crop: crop })}
                        onCropComplete={(croppedArea, croppedAreaPixels) => setCropperProps({ ...cropperProps, croppedAreaPixels: croppedAreaPixels })}
                        onZoomChange={zoom => setCropperProps({ ...cropperProps, zoom: zoom })}
                    />
                }
            </Box>
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileRef}
                            style={{ display: 'none' }}
                            onChange={onSelectImage}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            component="span"
                            // startIcon={<PhotoCamera />}
                            onClick={e => fileRef.current.click(e)}
                        >
                            Image
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            component="span"
                            // startIcon={<Backup />}
                            onClick={e => {
                                e.preventDefault()
                                if (window.confirm('Are you sure want to upload this picture?')) {
                                    onUpload()
                                }
                            }}
                        >
                            Upload
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    )
}

export default UploadPicture

const createImage = url =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues
        image.src = url
    })


/**
 * @param {HTMLCanvasElement} canvas 
 * @returns {Promise<Blob>}
 */
const getBlob = async (canvas) => new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
        resolve(blob)
    }, 'image/jpg', 1)
})

/**
 * @param {HTMLCanvasElement} canvas 
 * @param {number} nextWidth 
 * @param {number} nextHeight 
 * @returns {HTMLCanvasElement}
 */
const compress = (canvas, nextWidth, nextHeight) => {
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    c.width = nextWidth
    c.height = nextHeight
    ctx.drawImage(canvas, 0, 0, nextWidth, nextHeight)
    return c
}

/**
 * @param {string} imageSrc - Image File url
 * @param {{ x: number, y: number, width: number, height: number }} crop - crop Object provided by react-easy-crop
 * @param {{ width: number, height: number }} resolution - optional resolution parameter
 */
const getCroppedImg = async (imageSrc, cropArea, resolution) => {
    const img = await createImage(imageSrc)
    let canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = cropArea.width
    canvas.height = cropArea.height
    ctx.drawImage(img, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, canvas.width, canvas.height)
    // if (cropArea.width > resolution.width && cropArea.height > resolution.height) {
    //     const dWidth = cropArea.width - resolution.width
    //     const dHeight = cropArea.height - resolution.height
    //     const wFactor = dWidth / 4
    //     const hFactor = dHeight / 4
    //     let w1 = cropArea.width, h1 = cropArea.height
    //     for (let w = w1 - wFactor, h = h1 - hFactor; w > resolution.width; w -= wFactor, h -= hFactor) {
    //         if (w1 - Math.ceil(w) > 0 && h1 - Math.ceil(h) > 0) {
    //             w1 = w
    //             h1 = h
    //             console.log("resolution: (" + w1 + ", " + h1 + ")")
    //             canvas = compress(canvas, w1, h1)
    //         }
    //     }
    //     if (w1 !== resolution.width || h1 !== resolution.height) {
    //         canvas = compress(canvas, resolution.width, resolution.height)
    //     }
    // }
    canvas = compress(canvas, resolution.width, resolution.height)
    return await getBlob(canvas)
}

const getBlobFromImageUrl = async (url) => {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
}

/**
 * @param {string} imageSrc
 * @param {{ x: number, y: number, width: number, height: number }} croppedArea
 * @param {{ width: number, height: number }} resolution
 * @param {string} firebaseStoragePath
 * @param {(progress: number) => { }} onProgress
 * @param {(downloadUrl: string) => { }} onCompleted
 */
const upload = async (imageSrc, croppedArea, resolution, firebaseStoragePath, onProgress, onCompleted) => {

    const croppedImage = await getBlobFromImageUrl(imageSrc) //await getCroppedImg(imageSrc, croppedArea, resolution)
    try {
        const snap = await uploadBytes(ref(getStorage(), firebaseStoragePath), croppedImage)
        if (snap && snap.ref) {
            onCompleted()
        }
    } catch (e) {
        alert(e)
    }
}