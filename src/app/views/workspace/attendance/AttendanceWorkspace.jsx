import { Box, Button, Icon } from '@mui/material'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import SchoolOff from './SchoolOff'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useAttendance } from 'app/redux/classes/students/attendance/Attendance'
import { useUser } from 'app/redux/classes/User'
import TableSkeleton from '../skeleton/TableSkeleton'
import ClassWiseAttendanceEntry from './ClassWiseAttendanceEntry'
import AddClass from './AddClass'
import { Span } from 'app/components/Typography'
import AttendanceDialog from './AttendanceDialog'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import TopBar from './TopBar'
import { onlyDate } from 'app/utils/constant'
import DateDialog from '../fees-received/DateDialog'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'

const AttendanceWorkspace = props => {

    const [loading, setLoading] = React.useState(false)
    const attendance = useAttendance()
    const user = useUser()
    const [state, setState] = React.useState({ gender: 'MALE', timestamp: new Date() })
    React.useEffect(() => {
        setLoading(true)
        // alert(user.subscriberdocid + ', ' + state.gender + ', ' + state.timestamp)
        attendance.reload(user.subscriberdocid, state.gender, state.timestamp)
    }, [state])

    React.useEffect(() => setLoading(false), [attendance])

    const topbarControl = useTopbarControl()//redux
    React.useEffect(() => {
        topbarControl.setControlBox(
            <TopBar onGenderChange={gender => {
                // alert(JSON.stringify(state))
                setState({ ...state, gender })
            }} />
        )
    }, [state])

    const snackbarControl = useSnackbarControl()
    const handleSubmit = async (event) => {
        setLoading(true)
        await attendance.update()
        snackbarControl.show('Attendance saved')
    }

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }

    const [schoolOff, setSchoolOff] = React.useState(false)

    const [selectedStudent, setSelectedStudent] = React.useState(null)

    const [expanded, setExpanded] = React.useState(false)
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }
    const [addClassBusy, setAddClassBusy] = React.useState(false)

    const [prevTimestamp, setPrevTimestamp] = React.useState(new Date())
    const [open, setOpen] = React.useState(false)

    return (
        <ContentBox>
            <Box>
                <ValidatorForm
                    onSubmit={() => confirm(handleSubmit)}
                    onError={errors => alert(JSON.stringify(errors))}
                >
                    <SchoolOff
                        hasDocument={attendance.docref !== null}
                        pickFromPrevious={() => setOpen(true)}
                        gender={state.gender}
                        timestamp={state.timestamp}
                        schoolOffReason={attendance.schoolOffReason}
                        onDateChange={timestamp => {
                            setState({ ...state, timestamp })
                        }}
                        onSchoolOffReason={schoolOffReason => attendance.setSchoolOffReason(schoolOffReason)}
                        onSchoolOff={flag => setSchoolOff(flag)}
                    />
                    {
                        loading
                            ?
                            <TableSkeleton cols={1} rows={20} />
                            :
                            <>
                                {
                                    // attendance.classWiseAttendances.includes(cwa=>{})
                                    attendance.classWiseAttendances.map((cwa, index) => (
                                        <ClassWiseAttendanceEntry
                                            gender={state.gender}
                                            cwa={cwa}
                                            key={'cwa' + index}
                                            onAttendance={student => setSelectedStudent(student)}
                                            expanded={expanded === `accordion-panel-cwa-${cwa.pclass}`}
                                            onChange={handleChange(`accordion-panel-cwa-${cwa.pclass}`)}
                                        />
                                    ))
                                }
                                {
                                    schoolOff ? <></> :
                                        addClassBusy ?
                                            <TableSkeleton cols={3} rows={1} sx={{ h: 10 }} />
                                            :
                                            <AddClass
                                                gender={state.gender}
                                                exceptCwas={attendance.classWiseAttendances}
                                                onProceed={({ pclass, sessionFrom, modifiedon }) => {
                                                    setAddClassBusy(true)
                                                    attendance.addClass(pclass, sessionFrom, modifiedon).finally(() => setAddClassBusy(false))
                                                }}
                                            />
                                }
                            </>
                    }
                    <ContentBox>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button color="primary" variant="contained" type="submit"
                                disabled={!((schoolOff && attendance.schoolOffReason) || attendance.classWiseAttendances.length > 0)}
                            >
                                <Icon>send</Icon>
                                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                    Save
                                </Span>
                            </Button>
                        </Box>
                    </ContentBox>
                </ValidatorForm>
            </Box>
            {
                selectedStudent
                    ?
                    <AttendanceDialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
                    : <></>
            }
            <DateDialog
                date={prevTimestamp}
                open={open}
                onClose={() => setOpen(false)}
                onChange={previousDate => {
                    setOpen(false)
                    if (onlyDate(previousDate).getTime() !== onlyDate(prevTimestamp).getTime()) {
                        setLoading(true)
                        setPrevTimestamp(previousDate)
                        attendance.copyPreviousDay(previousDate)
                    }
                }}
            />
        </ContentBox>
    )
}

export default AttendanceWorkspace