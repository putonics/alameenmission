import React from 'react'
import StudentStatus from 'app/redux/classes/students/attendance/StudentStatus'
import { Box, Typography, Avatar } from '@mui/material'
import { APIURL, images } from 'app/redux/classes/Constants'
import './attendance.css'
/**
 * @param {{student:StudentStatus}} props 
 */
const StudentCard = props => {
    const [url, setUrl] = React.useState('')
    React.useEffect(() => {
        if (props.student && !url) {
            setUrl(`${APIURL}/avatars/${props.student.regno}_${images[0].name}.jpg`)
        }
    }, [props])

    return (
        <Box
            onClick={() => props.onAttendance(props.student)}
            className={props.student.present ? 'student-card-active' : 'student-card-inactive'}
            sx={{
                background: '#fff',
                overflow: 'clip', m: 0.5, borderRadius: 10,
                border: props.student.present ? '2px solid #00ffdd' : '2px solid #ff0088',
                display: 'flex', flexDirection: 'row', alignItems: 'center'
            }}>
            <Avatar src={url} />
            <Box sx={{ px: 2 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
                    {props.student.name}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: 10, color: '#000099' }}>
                        {props.student.regno}
                    </Typography>
                    {
                        props.student.present
                            ?
                            <Typography sx={{ fontSize: 10, color: '#00aa88', px: 1 }}>
                                Present
                            </Typography>
                            :
                            <Typography sx={{ fontSize: 10, color: '#fff', px: 1 }}>
                                Abscent
                            </Typography>
                    }
                </Box>
                {
                    props.student.abscentReason
                        ?
                        <Typography sx={{ fontSize: 10, color: '#fff' }}>
                            {props.student.abscentReason}
                        </Typography>
                        : <></>
                }
            </Box>
        </Box>
    )
}

export default StudentCard