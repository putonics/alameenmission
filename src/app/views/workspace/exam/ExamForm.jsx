import React from 'react'
import { Button, Icon, Typography } from '@mui/material'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useNavigate, useParams } from 'react-router-dom'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import { Box } from '@mui/system'
import { Span } from 'app/components/Typography'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import { useExams } from 'app/redux/classes/students/exam/Exams'
import Exam from 'app/redux/classes/students/exam/Exam'
import TextField from '../styledcomponents/TextField'
import SubjectGroupForm from './SubjectGroupForm'
import SubjectGroup from 'app/redux/classes/students/exam/SubjectGroup'
import GradeForm from './GradeForm'

const ExamForm = props => {
    const { docid } = useParams()
    const [state, setState] = React.useState({
        ...new Exam().json(),
        edit: false
    })

    const [error, setError] = React.useState('')
    const [ok, setOk] = React.useState(false)

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        if (state.edit) {
            confirmOnPassword.askForConfirmation(func)
        } else {
            func()
        }
    }

    const snackbarControl = useSnackbarControl()
    const navigate = useNavigate()

    const exams = useExams()

    React.useEffect(() => {
        if (docid === 'new') {
            const exam = new Exam()
            exam.sessionFrom = exams.sessionFrom
            exam.pclass = exams.pclass
            exam.gender = exams.gender
            setState({ ...exam.json(), edit: false })
        } else {
            const exam = exams.list.find(e => e.docref.id === docid)
            if (exam) {
                setState({ ...exam.json(), edit: true })
            } else {
                snackbarControl.show('Invalid exam!')
                navigate('/exams/')
            }
        }
    }, [docid])

    const handleSubmit = async (event) => {
        if (state.edit) {
            await exams.update(docid, state,
                () => {
                    snackbarControl.show('Successfully updated')
                    navigate('/exams')
                },
                () => {
                    snackbarControl.show('Error: Unable to save')
                }
            )
        } else {
            await exams.insert(state,
                () => {
                    snackbarControl.show('Successfully added')
                    navigate('/exams')
                },
                () => {
                    snackbarControl.show('Error: Unable to save')
                }
            )
        }
    }

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    React.useEffect(async () => {
        setOk(Exam.isOk(state))
    }, [state])

    return (
        <ContentBox>
            <ValidatorForm onSubmit={() => confirm(handleSubmit)} onError={errors => alert(JSON.stringify(errors))}>
                <StyledCard
                    sx={ok ? { backgroundColor: '#eeeeff', border: '2px solid #00aa44', borderBottomWidth: '6px' }
                        : { backgroundColor: '#eeeeff' }
                    }
                >
                    {
                        error &&
                        <Typography sx={{ color: '#ff4488', textAlign: 'center' }}>
                            {error}
                        </Typography>
                    }
                    <TextField
                        label="Examination name"
                        type="text"
                        name="name"
                        id="standard-basic"
                        onChange={handleChange}
                        value={state.name || ''}
                        validators={[
                            'required',
                        ]}
                        errorMessages={['this field is required']}
                    />
                    {
                        state.subjectGroups.map((sg, i) => (
                            <SubjectGroupForm
                                key={`subject-group-form-${i}`}
                                subjectGroup={sg}
                                onChange={subjectGroup => {
                                    const newState = { ...state }
                                    newState.subjectGroups[i] = subjectGroup
                                    setState(newState)
                                }}
                                onDelete={() => {
                                    const newState = { ...state }
                                    newState.subjectGroups = newState.subjectGroups.filter((sg2, i2) => i2 !== i)
                                    setState(newState)
                                }}
                            />
                        ))
                    }
                    <ContentBox>
                        <StyledCard>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button color="primary" variant="contained" type="button"
                                    onClick={() => {
                                        const newState = { ...state }
                                        newState.subjectGroups.push(new SubjectGroup().json())
                                        setState(newState)
                                    }}
                                >
                                    <Icon>add</Icon>
                                    <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                        Add New Subject Group
                                    </Span>
                                </Button>
                            </Box>
                        </StyledCard>
                    </ContentBox>
                    <ContentBox>
                        <StyledCard>
                            {
                                state.grades.map((grade, i) => (
                                    <GradeForm
                                        key={`grade-form-${i}`}
                                        grade={grade}
                                        onChange={grade => {
                                            const newState = { ...state }
                                            newState.grades[i] = grade
                                            setState(newState)
                                        }}
                                        onDelete={() => {
                                            const newState = { ...state }
                                            newState.grades = newState.grades.filter((g2, i2) => i2 !== i)
                                            setState(newState)
                                        }}
                                    />
                                ))
                            }
                        </StyledCard>
                    </ContentBox>
                    <ContentBox>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button color="primary" variant="contained" type="submit" disabled={!ok}>
                                <Icon>save</Icon>
                                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                    {state.edit ? 'Update & Save' : 'Create & Save'}
                                </Span>
                            </Button>
                        </Box>
                    </ContentBox>
                </StyledCard>
            </ValidatorForm>
        </ContentBox>
    )
}

export default ExamForm