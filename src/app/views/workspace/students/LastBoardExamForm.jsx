import { Grid, Icon } from '@mui/material'
import { Box } from '@mui/system'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import MarksFormList from './MarksFormList'

/**
 * @param {{confirm, edit: boolean, onChange: (state: any)=>void }} props 
 */
const LastBoardExamForm = props => {
    const [state, setState] = React.useState({
        examName: 'MADHYAMIK PARIKSHA',
        board: 'WBBSE',
        institute: 'AL AMEEN MISSION',
        yearOfPassing: `${new Date().getFullYear() - 1}`,
        regNo: 'NO-REG',
        rollNo: 'NO-ROLL',
        fullMarks: '700',
        marksObtained: '700',
        marks: []
    })

    const [percentage, setPercentage] = React.useState(0)

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (
            props.edit && selectedStudent.student && selectedStudent.student.lastBoardExam
        ) {
            const student = selectedStudent.student
            setState({
                examName: student && student.lastBoardExam && student.lastBoardExam.examName ? student.lastBoardExam.examName : '',
                board: student && student.lastBoardExam && student.lastBoardExam.board ? student.lastBoardExam.board : '',
                institute: student && student.lastBoardExam && student.lastBoardExam.institute ? student.lastBoardExam.institute : '',
                yearOfPassing: student && student.lastBoardExam && student.lastBoardExam.yearOfPassing ? student.lastBoardExam.yearOfPassing + '' : `${new Date().getFullYear() - 1}`,
                regNo: student && student.lastBoardExam && student.lastBoardExam.regNo ? student.lastBoardExam.regNo : '',
                rollNo: student && student.lastBoardExam && student.lastBoardExam.rollNo ? student.lastBoardExam.rollNo : '',
                fullMarks: student && student.lastBoardExam && student.lastBoardExam.fullMarks ? student.lastBoardExam.fullMarks + '' : '700',
                marksObtained: student && student.lastBoardExam && student.lastBoardExam.marksObtained ? student.lastBoardExam.marksObtained + '' : '700',
                marks: student && student.lastBoardExam && student.lastBoardExam.marks ? student.lastBoardExam.marks : []
            })
        }
    }, [selectedStudent])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        let totalMarksObtained = 0
        let totalFullMarks = 0
        state.marks.forEach(mark => {
            totalMarksObtained += (+mark.marksObtained)
            totalFullMarks += (+mark.fullMarks)
        })
        setPercentage(Math.round((100 * totalMarksObtained) / totalFullMarks))
        if (state.examName && state.board && state.institute
            && (+state.yearOfPassing) > 2000
            && state.regNo && state.rollNo
            && (+state.fullMarks) > 0 && (+state.marksObtained) > 0
            && state.marks.length > 0
            && state.marks.length === state.marks.filter(marks => (marks.subject && (+marks.fullMarks) > 0 && (+marks.marksObtained) > 0)).length
            && (+state.marksObtained) === totalMarksObtained
            && (+state.fullMarks) === totalFullMarks
        ) {
            // console.log(state)
            props.onChange({ lastBoardExam: state })
            if (!ok) setOk(!ok)
        } else {
            if (ok) setOk(!ok)
        }
    }, [state])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <Box mb="12px">
                    <Heading sx={ok ? { color: '#00aa44' } : {}}>
                        Section-F: Last board exam
                        {ok && <Icon fontSize='small'>task_alt</Icon>}
                    </Heading>
                </Box>
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label="Exam Name"
                            type="text"
                            name="examName"
                            id="standard-basic-examName"
                            onChange={handleChange}
                            value={state.examName || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={['this field is required']}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                        <TextField
                            label="Board / Council / University"
                            type="text"
                            name="board"
                            id="standard-basic-board"
                            onChange={handleChange}
                            value={state.board || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={['this field is required']}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                        <TextField
                            label="Institute name"
                            type="text"
                            name="institute"
                            id="standard-basic-institute"
                            onChange={handleChange}
                            value={state.institute || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={['this field is required']}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                        <TextField
                            label="Year of passing"
                            type="number"
                            name="yearOfPassing"
                            id="standard-basic-yearOfPassing"
                            onChange={handleChange}
                            value={state.yearOfPassing || ''}
                            validators={[
                                'required',
                                'minStringLength: 4',
                                'maxStringLength: 4',
                            ]}
                            errorMessages={[
                                'this field is required',
                                'year should be 4 digit number',
                                'year should be 4 digit number',
                            ]}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label="Registration no."
                            type="text"
                            name="regNo"
                            id="standard-basic-regNo"
                            onChange={handleChange}
                            value={state.regNo || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={[
                                'this field is required',
                            ]}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                        <TextField
                            label="Roll no."
                            type="text"
                            name="rollNo"
                            id="standard-basic-rollNo"
                            onChange={handleChange}
                            value={state.rollNo || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={[
                                'this field is required',
                            ]}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                        <TextField
                            label="Full Marks"
                            type="number"
                            name="fullMarks"
                            id="standard-basic-fullMarks"
                            onChange={handleChange}
                            value={state.fullMarks || ''}
                            validators={[
                                'required',
                                'minStringLength: 1',
                            ]}
                            errorMessages={[
                                'this field is required',
                                'marks should be a number',
                            ]}
                        />
                        <Grid container>
                            <Grid item xs={6}>
                                <TextField
                                    label="Marks obtained"
                                    type="number"
                                    name="marksObtained"
                                    id="standard-basic-marksObtained"
                                    onChange={handleChange}
                                    value={state.marksObtained || ''}
                                    validators={[
                                        'required',
                                        'minStringLength: 1',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                        'marks should be a number',
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ pl: 1 }}>
                                <TextField
                                    disabled
                                    label="Percentage"
                                    type="text"
                                    name="percentage"
                                    id="standard-basic-percentage"
                                    value={`${percentage}%`}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <MarksFormList confirm={props.confirm} edit={props.edit}
                    onChange={marks => {
                        // console.log('y01')
                        setState({ ...state, marks })
                    }}
                />
            </StyledCard>
        </ContentBox>
    )
}

export default LastBoardExamForm
