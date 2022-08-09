import React from 'react'
import { PDFViewer, Document } from '@react-pdf/renderer'
import StudentPdf from './StudentPdf'
import StyledCard from '../../styledcomponents/StyledCard'
import { useInstitutes } from 'app/redux/classes/Institutes'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import TableSkeleton from '../../skeleton/TableSkeleton'
import ContentBox from '../../styledcomponents/ContentBox'
import { useUser } from 'app/redux/classes/User'
import { useNavigate, useParams } from 'react-router-dom'
import { useStudents } from 'app/redux/classes/students/Students'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'

const StudentPdfViewer = props => {
    const { docid } = useParams()
    const students = useStudents()
    const selectedStudent = useSelectedStudent()
    const [busy, setBusy] = React.useState(false)
    const navigate = useNavigate()

    React.useEffect(() => {
        setBusy(true)
        if (docid) {
            const student = students.list.find(s => s.docref.id === docid)
            if (student) {
                selectedStudent.set(student)
            } else {
                selectedStudent.set(null)
                navigate('/students')
            }
        }
        setBusy(false)
    }, [docid])



    const institutes = useInstitutes()

    const [institute, setInstitute] = React.useState(null)

    const user = useUser()

    React.useEffect(() => {
        if (!institutes.list.length) {
            setBusy(true)
            institutes.load().finally(() => setBusy(false))
            return
        }
        if (institutes.list.length) {
            setInstitute(institutes.getInstitute(user.subscriberdocid))
        }
    }, [institutes])

    const snackbarControl = useSnackbarControl()
    React.useEffect(() => {
        snackbarControl.show('Please wait! Generating Admission form...')
    }, [])

    return (
        <ContentBox>
            <StyledCard sx={{ height: '100vh' }}>
                {
                    busy
                        ?
                        <TableSkeleton rows={10} cols={4} />
                        :
                        institute && selectedStudent.student
                            ?
                            <PDFViewer width='100%' height='100%'>
                                <Document
                                    author='alameenmission'
                                    title={`AmissionForm-${selectedStudent.student.regno}`}
                                    creator='alameenmission'
                                    subject={`AmissionForm-${selectedStudent.student.regno}`}
                                >
                                    <StudentPdf
                                        student={selectedStudent.student.json()}
                                        institute={institute.json()}
                                    />
                                </Document>
                            </PDFViewer>
                            : <></>
                }
            </StyledCard>
        </ContentBox>
    )
}

export default StudentPdfViewer