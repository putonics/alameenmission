import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Button, CardActionArea, CardActions } from '@mui/material'
import { alameenLogo, APIURL } from 'app/redux/classes/Constants'
import { upload, avatarPath, imagePath } from './Uploader'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import { useLocalImageCache } from 'app/redux/classes/LocalImageCache'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import { usePrintImageControl } from 'app/redux/classes/controls/PrintImageControl'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useStudents } from 'app/redux/classes/students/Students'
// import { usePdfImageControl } from 'app/redux/classes/controls/PdfImageControl'

/**
 * @param {{image: {title: string, name: string}}} props 
 */
const ImageCard = props => {
    const fileRef = React.createRef()
    const [url, setUrl] = React.useState(alameenLogo)

    const selectedStudent = useSelectedStudent()

    const lic = useLocalImageCache()
    React.useEffect(() => {
        if (selectedStudent && selectedStudent.student) {
            // lic.getUrl(avatarPath(`${selectedStudent.student.regno}_${props.image.name}`))
            //     .then(url => setUrl(url ? url : alameenLogo))
            setUrl(`${APIURL}/avatars/${selectedStudent.student.regno}_${props.image.name}.jpg?${selectedStudent.student.modifiedon}`)
        }
    }, [selectedStudent])

    const snakbarControl = useSnackbarControl()
    const students = useStudents()
    const onSelectImage = e => {
        let i = 0
        if (e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0])
            setUrl(url)
            upload(url, `${selectedStudent.student.regno}_${props.image.name}`,
                (progress, status) => snakbarControl.show(`Uploading ${status}: ${i ? progress : Math.ceil(progress / 4)}%`),
                n => {
                    i = n
                    if (n === 1) {
                        lic.resetUrl(avatarPath(`${selectedStudent.student.regno}_${props.image.name}`))
                    }
                    if (n === 2) {
                        lic.resetUrl(imagePath(`${selectedStudent.student.regno}_${props.image.name}`))
                    }
                    if (i > 1) {
                        snakbarControl.show('Successfully uploaded')
                        students.uptodate(selectedStudent.student)
                    }
                },
                error => snakbarControl.show(error)
            )
        }
    }

    // const pdfImageControl = usePdfImageControl()
    const download = () => {
        if (selectedStudent && selectedStudent.student) {
            const imgPath = imagePath(`${selectedStudent.student.regno}_${props.image.name}`)
            lic.getUrl(imgPath)
                .then(url => {
                    setUrl(url ? url : alameenLogo)
                    if (url) {
                        // pdfImageControl.print(url)
                        document.getElementById(`anchor${selectedStudent.student.regno}_${props.image.name}`).click()
                    }
                })
        }
    }

    const printImageControl = usePrintImageControl()
    const print = () => {
        if (selectedStudent && selectedStudent.student) {
            const imgPath = imagePath(`${selectedStudent.student.regno}_${props.image.name}`)
            lic.getUrl(imgPath)
                .then(url => {
                    setUrl(url ? url : alameenLogo)
                    if (url) {
                        printImageControl.print(url)
                    }
                })
        }
    }

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }

    return (
        <>
            <Card>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height={{ md: 200, xs: 300 }}
                        image={url}
                        alt={props.image.title}
                        onError={() => setUrl(alameenLogo)}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            {props.image.title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" onClick={e => fileRef.current.click(e)}>
                        Upload
                    </Button>
                    <Button size="small" color="primary" disabled={url === alameenLogo} onClick={download}>
                        Download
                    </Button>
                    <a
                        id={`anchor${selectedStudent.student.regno}_${props.image.name}`}
                        style={{ display: 'none' }}
                        href={url}
                        download={`${selectedStudent.student.regno}_${props.image.name}.jpg`}
                        target='_blank'
                    >
                        Download
                    </a>
                    <Button size="small" color="primary" disabled={url === alameenLogo} onClick={print}>
                        Print
                    </Button>
                </CardActions>
            </Card>
            <input
                type="file"
                accept="image/*"
                ref={fileRef}
                style={{ display: 'none' }}
                onChange={e => {
                    if (url === alameenLogo) {
                        onSelectImage(e)
                    } else {
                        confirm(() => onSelectImage(e))
                    }
                }}
            />
        </>
    )
}

export default ImageCard