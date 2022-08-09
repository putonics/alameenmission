import React from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import { useParams } from 'react-router-dom'
import ICardPdf from './ICardPdf'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import { useStudents } from 'app/redux/classes/students/Students'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import { Institute, useInstitutes } from 'app/redux/classes/Institutes'
import { useVisitingDays } from 'app/redux/classes/visiting-days/VisitingDays'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import { Checkbox, FormGroup, FormControlLabel } from '@mui/material'

const ICardPdfViewer = props => {
    const { docid } = useParams()
    const students = useStudents()
    const selectedStudent = useSelectedStudent()
    const institutes = useInstitutes()
    const visitingDays = useVisitingDays()

    const [institute, setInstitute] = React.useState(new Institute())
    const [visitingDay, setVisitingDay] = React.useState('2nd & 4th Sunday')

    React.useEffect(() => {
        if (!institutes.list.length) {
            institutes.load()
        }
    }, [])

    React.useEffect(() => {
        if (students.subscriberdocid) {
            setInstitute(institutes.list.find(institute => institute.subscriberdocid === students.subscriberdocid))
        }
    }, [students, institutes])

    React.useEffect(() => {
        if (visitingDays.docref) {
            const vida = visitingDays.list.find(vd => vd.sessionFrom === students.sessionFrom && vd.pclass === students.pclass)
            if (vida) {
                setVisitingDay(
                    selectedStudent.student.gender === 'FEMALE'
                        ? vida.femaleVisitingDays
                        : vida.maleVisitingDays
                )
            }
        } else {
            visitingDays.load(students.subscriberdocid)
        }
    }, [visitingDays, selectedStudent])

    React.useEffect(() => {
        if (docid) {
            const student = students.list.find(s => s.docref.id === docid)
            if (student) {
                selectedStudent.set(student)
            } else {
                selectedStudent.set(null)
            }
        }
    }, [docid])

    const snackbarControl = useSnackbarControl()
    React.useEffect(() => {
        snackbarControl.show('Please wait! Generating ICards...')
    }, [])

    const [cards, setCards] = React.useState(['student', 'father', 'mother', 'visitor1', 'visitor2'])

    const toggle = card => {
        if (cards.includes(card)) {
            setCards(cards.filter(c => c !== card))
        } else {
            setCards([...cards, card])
        }
    }

    return (
        <ContentBox>
            <StyledCard sx={{ height: '100vh' }}>
                <FormGroup row>
                    <FormControlLabel
                        // sx={props.ok ? { color: '#00aa66' } : {}}
                        // defaultValue={sameAsPermanent}
                        onChange={() => toggle('student')}
                        control={<Checkbox checked={cards.includes('student')} />}
                        label='Student'
                    />
                    <FormControlLabel
                        onChange={() => toggle('father')}
                        control={<Checkbox checked={cards.includes('father')} />}
                        label='Father'
                    />
                    <FormControlLabel
                        onChange={() => toggle('mother')}
                        control={<Checkbox checked={cards.includes('mother')} />}
                        label='Mother'
                    />
                    <FormControlLabel
                        onChange={() => toggle('visitor1')}
                        control={<Checkbox checked={cards.includes('visitor1')} />}
                        label='Visitor-1'
                    />
                    <FormControlLabel
                        onChange={() => toggle('visitor2')}
                        control={<Checkbox checked={cards.includes('visitor2')} />}
                        label='Visitor-2'
                    />
                </FormGroup>

                <PDFViewer width='100%' height='100%'>
                    <ICardPdf
                        cards={cards}
                        student={selectedStudent?.student?.json()}
                        institute={institute?.json()}
                        visitingDay={visitingDay}
                    />
                </PDFViewer>
            </StyledCard>
        </ContentBox>
    )
}

export default ICardPdfViewer