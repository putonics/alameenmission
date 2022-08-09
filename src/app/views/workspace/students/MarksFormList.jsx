import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import MarksForm from './MarksForm'

const MP = [
    { subject: 'BNGA', fullMarks: '100', marksObtained: '100' },
    { subject: 'ENGB', fullMarks: '100', marksObtained: '100' },
    { subject: 'MATH', fullMarks: '100', marksObtained: '100' },
    { subject: 'PHYS', fullMarks: '100', marksObtained: '100' },
    { subject: 'BIOS', fullMarks: '100', marksObtained: '100' },
    { subject: 'HIST', fullMarks: '100', marksObtained: '100' },
    { subject: 'GEGR', fullMarks: '100', marksObtained: '100' },
]

/**
 * @param {{confirm, edit: boolean, onChange: (state: any)=> void }} props 
 */
const MarksFormList = props => {

    const [state, setState] = React.useState(MP)

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState(student && student.lastBoardExam && student.lastBoardExam.marks && student.lastBoardExam.marks.length > 0
                ? student.lastBoardExam.marks.map(m => ({ subject: m.subject, fullMarks: m.fullMarks + '', marksObtained: m.marksObtained + '' }))
                : MP)
        }
    }, [selectedStudent])

    React.useEffect(() => {
        if (state.length === state.filter(marks => (marks.subject && parseInt(marks.fullMarks) >= parseInt(marks.marksObtained))).length) {
            props.onChange(state)
        }
    }, [state])

    return (
        <ContentBox sx={{ p: 2, m: 0, border: '1px solid #3366aa22' }}>
            {
                state.map((marks, i) => (
                    <MarksForm
                        confirm={props.confirm}
                        edit={props.edit}
                        key={`marksform${i}`}
                        marks={marks}
                        index={i}
                        onChange={marks => setState(state.map((m, index) => (index === i) ? marks : m))}
                        onAdd={() => setState([
                            ...state.filter((val, index) => index <= i),
                            { subject: '', fullMarks: '0', marksObtained: '0' },
                            ...state.filter((val, index) => index > i),
                        ])}
                        onDelete={() => setState(state.filter((val, index) => index !== i))}
                    />
                ))
            }
        </ContentBox>
    )
}

export default MarksFormList