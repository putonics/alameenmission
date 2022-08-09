import React from 'react'
import { Box, styled, Typography, Avatar, Dialog, Button, TextField } from '@mui/material'
import { APIURL, images } from 'app/redux/classes/Constants'
import StudentStatus from 'app/redux/classes/students/attendance/StudentStatus'
import { useAttendance } from 'app/redux/classes/students/attendance/Attendance'

const DialogBox = styled('div')(() => ({
    width: 360,
    padding: '32px',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
}))

const Title = styled('h4')(() => ({
    margin: 0,
    marginBottom: '8px',
    textTransform: 'capitalize'
}))

const Controller = styled('div')(() => ({
    margin: '8px',
    paddingTop: '8px',
    display: 'flex',
    justifyContent: 'center',
}))

const StyledButton = styled(Button)(({ theme }) => ({
    margin: '8px',
    paddingLeft: '24px',
    paddingRight: '24px',
    overflow: 'hidden',
    borderRadius: '300px',
    transition: 'all 250ms',
    '&.yesBtn': {
        '&:hover': {
            color: '#ffffff',
            background: `${theme.palette.primary.main} !important`,
            backgroundColor: `${theme.palette.primary.main} !important`,
            fallbacks: [{ color: 'white !important' }],
        }
    },
    '&.noBtn': {
        '&:hover': {
            color: '#ffffff',
            background: `${theme.palette.secondary.main} !important`,
            backgroundColor: `${theme.palette.secondary.main} !important`,
            fallbacks: [{ color: 'white !important' }],
        }
    },
}))

/**
 * @param {{student: StudentStatus}} props 
 */
const AttendanceDialog = props => {
    const [url, setUrl] = React.useState('')
    React.useEffect(() => {
        if (props.student && !url) {
            setUrl(`${APIURL}/avatars/${props.student.regno}_${images[0].name}.jpg`)
        }
    }, [props])

    const [abscentReason, setAbscentReason] = React.useState(props.student.abscentReason)

    const attendance = useAttendance()

    return (
        <Dialog
            open={Boolean(props.student)}
            onClose={props.onClose}
        >
            <DialogBox>
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Avatar src={url} />
                    <Box sx={{ px: 2 }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                            {props.student.name}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography sx={{ fontSize: 15, color: '#000099' }}>
                                {props.student.regno}
                            </Typography>
                            {
                                props.student.present
                                    ?
                                    <Typography sx={{ fontSize: 15, color: '#00aa88', px: 1 }}>
                                        Present
                                    </Typography>
                                    :
                                    <Typography sx={{ fontSize: 15, color: '#ff0088', px: 1 }}>
                                        Abscent
                                    </Typography>
                            }
                        </Box>
                    </Box>
                </Box>
                <TextField
                    fullWidth
                    label="Abscent reason"
                    type="text"
                    id="standard-basic-skid"
                    onChange={e => setAbscentReason(e.target.value)}
                    name="abscentReason"
                    value={abscentReason || ''}
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', p: 2 }}>
                    <Button color="success" variant='contained'
                        disabled={props.student.present}
                        onClick={() => {
                            attendance.present(props.student)
                            props.onClose()
                        }}
                    >
                        Present
                    </Button>
                    <Button color="error" variant='contained'
                        disabled={!Boolean(abscentReason)}
                        onClick={() => {
                            attendance.abscent(props.student, abscentReason)
                            props.onClose()
                        }}
                    >
                        Abscent
                    </Button>
                </Box>
            </DialogBox>
        </Dialog>
    )
}

export default AttendanceDialog
