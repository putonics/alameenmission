import { Button, Icon, Box, Grid, Typography, IconButton } from '@mui/material'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useStudentCountReports } from 'app/redux/classes/report/StudentCountReports'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import Exam from 'app/redux/classes/students/result/Exam'
import { ValidatorForm } from 'react-material-ui-form-validator'
import Result, { useResult } from 'app/redux/classes/students/result/Result'
import { useStudents } from 'app/redux/classes/students/Students'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import TableSkeleton from '../skeleton/TableSkeleton'
import StyledCard from '../styledcomponents/StyledCard'
import Header from './Header'
import MarksForm from './MarksForm'
import StudentResult from 'app/redux/classes/students/result/StudentResult'

const ResultForm = props => {

    const [exam, setExam] = React.useState(new Exam().json())

    const [busy, setBusy] = React.useState(false)

    const [error, setError] = React.useState('')


    const user = useUser()
    const scrs = useStudentCountReports()
    const students = useStudents()
    const result = useResult()

    const [state, setState] = React.useState(result.json())

    React.useEffect(() => {
        setError('')
        // console.log(1, 'Exam changed')
        if (exam.docref.id) {
            // console.log(2, 'Exam has document')
            if (user.role === 'BRANCH ADMIN' ||
                (user.regno && exam.subjectGroup.subject.examType.teacherRegno === user.regno)
            ) {
                // console.log(3, 'Authentication-approved')
                setBusy(true)
                result.load(exam)
                    .finally(() => {
                        if (!result.docref) {
                            // console.log(4, 'Result has document')
                            scrs.load(user.subscriberdocid, exam.sessionFrom)
                                .finally(() => {
                                    students.load(user.subscriberdocid, exam.sessionFrom, exam.pclass, scrs)
                                        .finally(() => {
                                            if (students.list.length > 0) {
                                                // console.log(5)
                                                result.setStudents(students.list)
                                            } else {
                                                setError(`No students exist in this ${exam.sessionFrom} ${exam.pclass} class!`)
                                            }
                                            setState(result.json())
                                            setBusy(false)
                                        })
                                })
                        } else {
                            // console.log(6)
                            setState(result.json())
                            setBusy(false)
                        }
                    })
            } else {
                // console.log(7)
                setState(result.json())
                setError('Unauthorised access!')
            }
        } else {
            // console.log(8)
            setState(result.json())
            setError('Please select a valid exam.')
        }
    }, [exam])

    const snackbarControl = useSnackbarControl()

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => confirmOnPassword.askForConfirmation(func)

    const handleSubmit = async (event) => {
        await result.submit(user.subscriberdocid, state,
            () => {
                snackbarControl.show('Successfully updated')
            },
            () => {
                snackbarControl.show('Error: Unable to save')
            }
        )
    }

    const [gridView, setGridView] = React.useState(false)

    return (
        <>
            <Header onSearch={setExam} />
            <Box sx={{ mt: 2 }}>
                {
                    busy
                        ? <TableSkeleton rows={4} cols={3} />
                        :
                        state.students.length > 0
                            ?
                            <ValidatorForm
                                onSubmit={() => confirm(handleSubmit)}
                            // onError={errors => alert(JSON.stringify(errors))}
                            >
                                <StyledCard>
                                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', my: -2, mr: -3 }}>
                                        <IconButton onClick={() => setGridView(!gridView)} color={gridView ? 'primary' : 'default'}>
                                            <Icon>grid_view</Icon>
                                        </IconButton>
                                    </Box>
                                    <Grid container>
                                        {
                                            state.students.map((s, i) => (
                                                <MarksForm
                                                    gridView={gridView}
                                                    key={s.regno}
                                                    index={i + 1}
                                                    fullMarks={exam.subjectGroup.subject.examType.fullMarks}
                                                    student={s}
                                                    onChange={s => {
                                                        const result = new Result(state)
                                                        result.students[i] = new StudentResult(s)
                                                        setState(result.json())
                                                    }}
                                                />
                                            ))
                                        }
                                    </Grid>
                                </StyledCard>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                                    <Button color="primary" variant="contained" type="submit">
                                        <Icon>save</Icon>
                                        {result.docref ? 'Update & Save' : 'Create & Save'}
                                    </Button>
                                </Box>
                            </ValidatorForm>
                            :
                            <Typography sx={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                color: '#aa0000', p: 4
                            }}>
                                {error}
                            </Typography>
                }
            </Box>
        </>
    )
}

export default ResultForm