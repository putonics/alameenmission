import React from 'react'
import { IconButton, TableRow, TableCell, Icon, Tooltip, Avatar, Stack, Typography } from '@mui/material'
import StudentMenu from './StudentMenu'
import { useStudents } from 'app/redux/classes/students/Students'
import Student from 'app/redux/classes/students/Student'
import { format } from 'date-fns'
// import { useLocalImageCache } from 'app/redux/classes/LocalImageCache'
// import { avatarPath } from '../documents/Uploader'
import { APIURL, images, months } from 'app/redux/classes/Constants'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import { useUser } from 'app/redux/classes/User'

/**
 * @param {{student :Student, columns}} props 
 */
const StudentRow = props => {
    const [url, setUrl] = React.useState('')
    // const lic = useLocalImageCache()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const students = useStudents()

    const [recentlyModified, setRecentlyModified] = React.useState(false)
    React.useEffect(() => {
        if (props.student.recentlyUpdatedRecord && !recentlyModified) {
            setRecentlyModified(true)
        } else if (recentlyModified) {
            setRecentlyModified(false)
        }
        if (props.student && !url) {
            // lic.getUrl(avatarPath(`${s.regno}_${images[0].name}`))
            //     .then(url => setUrl(url ? url : ''))
            setUrl(`${APIURL}/avatars/${props.student.regno}_${images[0].name}.jpg`)
        }
    }, [students])

    ///Some fields need password confirmation while updating.
    ///This function will ensure that.
    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => confirmOnPassword.askForConfirmation(func)
    const snackbarControl = useSnackbarControl()
    const user = useUser()
    const deleteStudent = () => {
        if (user.role !== 'BRANCH ADMIN') {
            snackbarControl.show('Only admin has the privilege to delete student.')
            return
        }
        students.delete(props.student,
            () => snackbarControl.show('Successfully deleted.'),
            () => snackbarControl.show('Cannot be deleted!'),
        )
    }

    return (
        <TableRow>
            <TableCell align="center">
                <Avatar src={url} />
            </TableCell>
            <TableCell align="left">
                <Stack direction='row' sx={{ alignItems: 'center' }}>
                    <Tooltip title={props.student.gender} placement='left'>
                        <Icon sx={{ color: props.student.gender === 'FEMALE' ? '#ff00aa' : '#00aaff' }} >{props.student.gender === 'FEMALE' ? 'girl' : 'boy'}</Icon>
                    </Tooltip>
                    <Typography sx={{ fontWeight: '600' }}>
                        {props.student.regno}
                    </Typography>
                </Stack>
            </TableCell>
            {
                props.columns.map(col => (
                    <TableCell key={col.field} align="left">
                        {
                            col.field === 'feeStartingMonth'
                                ?
                                months[+props.student[col.field]]
                                :
                                ['handicapped', 'orphan', 'fc', 'nc'].includes(col.field)
                                    ?
                                    (props.student[col.field] ? 'YES' : 'NO')
                                    :
                                    ['admissionDate', 'dob'].includes(col.field)
                                        ?
                                        format(new Date(props.student[col.field] || 0), "dd/MM/yyyy")
                                        :
                                        props.student[col.field]
                        }
                    </TableCell>
                ))
            }
            {/* <TableCell align="left">
                {props.student.sessionFrom}-{('' + props.student.sessionTo).substring(2, 4)}
            </TableCell>
            <TableCell align="left">
                {props.student.mobile}
            </TableCell>
            <TableCell align="left">{props.student.stream}</TableCell>
            <TableCell align="left">{props.student.fee}</TableCell>
            <TableCell align="left">{props.student.caste}</TableCell> */}
            <TableCell>
                <IconButton
                    color={recentlyModified ? 'secondary' : 'default'}
                    onClick={e => setAnchorEl(e.currentTarget)}
                >
                    <Icon>more_vert</Icon>
                </IconButton>
                <StudentMenu
                    url={url}
                    studentdocid={props.student.docref.id}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    recentlyModified={recentlyModified}
                    onDelete={() => confirm(deleteStudent)}
                />
            </TableCell>
        </TableRow >
    )
}

export default StudentRow