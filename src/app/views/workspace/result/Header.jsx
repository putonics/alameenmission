import React from 'react'
import StyledCard from '../styledcomponents/StyledCard'
import { Button, FormControl, Icon, MenuItem, Select } from '@mui/material'
import Exam from 'app/redux/classes/students/result/Exam'
import SubjectGroup from 'app/redux/classes/students/result/SubjectGroup'
import Subject from 'app/redux/classes/students/result/Subject'
import { useExams } from 'app/redux/classes/students/exam/Exams'
import InputLabel from '../styledcomponents/InputLabel'

/**
 * @param {{onSearch: (exam: Exam)=>{}}} props 
 */
const Header = props => {

    const exams = useExams()
    const [exam, setExam] = React.useState(new Exam().json())

    React.useEffect(() => {
        if (exams.list.length > 0) {
            setExam(Exam.parse(exams.list[0]).json())
        }
    }, [exams])

    return (
        <StyledCard sx={{ display: 'flex', flexDirection: 'row' }}>
            {
                exams.list.length > 0 && exam.docref.id
                    ? <>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-examName">Exam Name</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-examName"
                                sx={{ mr: 1 }}
                                id="select-examName"
                                name='examName'
                                value={exam.docref.id}
                                label="Exam Name"
                                onChange={e => {
                                    setExam(Exam.parse(exams.list.find(e => e.docref.id === e.target.value)).json())
                                }}
                            >
                                {
                                    exams.list.map(e => (
                                        <MenuItem key={e.docref.id} value={e.docref.id}>{e.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-subjectGroup">Subject group</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-subjectGroup"
                                sx={{ mr: 1 }}
                                id="select-subjectGroup"
                                name='subjectGroup'
                                value={exam.subjectGroup.name}
                                label="Subject group"
                                onChange={e => {
                                    const newExam = new Exam(exam)
                                    newExam.subjectGroup = SubjectGroup.parse(
                                        exams.list.find(e => e.docref.id === exam.docref.id)
                                            .subjectGroups.find(s => s.name === e.target.value)
                                    )
                                    setExam(newExam.json())
                                }}
                            >
                                {
                                    exams.list.find(e => e.docref.id === exam.docref.id)
                                        .subjectGroups.map(s => (
                                            <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-subject">Subject</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-subject"
                                sx={{ mr: 1 }}
                                id="select-subject"
                                name='subject'
                                value={exam.subjectGroup.subject.code}
                                label="Subject"
                                onChange={e => {
                                    const newExam = new Exam(exam)
                                    newExam.subjectGroup.subject = Subject.parse(
                                        exams.list.find(e => e.docref.id === exam.docref.id)
                                            .subjectGroups.find(s => s.name === exam.subjectGroup.name)
                                            .subjects.find(s => s.code === e.target.value)
                                    )
                                    setExam(newExam.json())
                                }}
                            >
                                {
                                    exams.list.find(e => e.docref.id === exam.docref.id)
                                        .subjectGroups.find(s => s.name === exam.subjectGroup.name)
                                        .subjects.map(s => (
                                            <MenuItem key={s.code} value={s.code}>{s.name}</MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-examType">Exam type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-examType"
                                sx={{ mr: 1 }}
                                id="select-examType"
                                name='examType'
                                value={exam.subjectGroup.subject.examType.type}
                                label="Exam type"
                                onChange={e => {
                                    const newExam = new Exam(exam)
                                    newExam.subjectGroup.subject.examType =
                                        exams.list.find(e => e.docref.id === exam.docref.id)
                                            .subjectGroups.find(s => s.name === exam.subjectGroup.name)
                                            .subjects.find(s => s.code === exam.subjectGroup.subject.code)
                                            .examTypes.find(ex => ex.type === e.target.value)
                                    setExam(newExam.json())
                                }}
                            >
                                {
                                    exams.list.find(e => e.docref.id === exam.docref.id)
                                        .subjectGroups.find(s => s.name === exam.subjectGroup.name)
                                        .subjects.find(s => s.code === exam.subjectGroup.subject.code)
                                        .examTypes.map(e => (
                                            <MenuItem key={e.type} value={e.type}>{e.type}</MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-code">Subject code</InputLabel>
                            <Select
                                readOnly
                                labelId="demo-simple-select-label-code"
                                sx={{ mr: 1 }}
                                id="select-code"
                                name='code'
                                value={exam.subjectGroup.subject.code}
                                label="Subject code"
                            >
                                <MenuItem value={exam.subjectGroup.subject.code}>
                                    {exam.subjectGroup.subject.code}
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-fullMarks">Full marks</InputLabel>
                            <Select
                                readOnly
                                labelId="demo-simple-select-label-fullMarks"
                                sx={{ mr: 1 }}
                                id="select-fullMarks"
                                name='fullMarks'
                                value={exam.subjectGroup.subject.examType.fullMarks}
                                label="Subject code"
                            >
                                <MenuItem value={exam.subjectGroup.subject.examType.fullMarks}>
                                    {exam.subjectGroup.subject.examType.fullMarks}
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="outlined" type="button" sx={{ py: 1.6 }} disabled={!exam}
                            onClick={() => props.onSearch(exam)}
                        >
                            <Icon>search</Icon>
                        </Button>
                    </>
                    : <></>
            }
        </StyledCard>
    )
}

export default Header