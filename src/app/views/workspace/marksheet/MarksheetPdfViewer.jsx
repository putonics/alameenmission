import React from 'react'
import TableSkeleton from '../skeleton/TableSkeleton'
import MarksheetPdf from './MarksheetPdf'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import Marksheet from 'app/redux/classes/students/result/Marksheet'
import { PDFViewer, Document } from '@react-pdf/renderer'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import { useInstitutes } from 'app/redux/classes/Institutes'
import { useResults } from 'app/redux/classes/students/result/Results'
import { useUser } from 'app/redux/classes/User'
import { generateCsv } from 'app/services/csv'

const MarksheetPdfViewer = props => {
    const results = useResults()

    const [busy, setBusy] = React.useState(false)

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
        snackbarControl.show('Please wait! Generating Marksheets...')
    }, [])

    const [marksheets, setMarksheets] = React.useState([])
    React.useEffect(() => {
        if (results.list.length) {
            setBusy(true)
            snackbarControl.show('Counting students...')
            if (results.pdf) {//--Generating pdf
                const marksheets = results.list[0].students
                    .sort((a, b) => a.regno.localeCompare(b.regno))
                    .map(s => Marksheet.create(s))//.splice(0, 1)
                snackbarControl.show('Generating Marksheets for ' + marksheets.length + ' students')
                results.list.forEach(result => {
                    // console.log(result.exam.json())
                    result.students
                        .sort((a, b) => a.regno.localeCompare(b.regno))
                        // .splice(0, 1)
                        .forEach((s, i) => {
                            // console.log(i, s.json())
                            marksheets[i].addMarks(result.exam, s.marks)
                        })
                })
                setMarksheets(marksheets)
            } else {//---Generating excel
                const heads = ['Reg. No.', 'Student Name']
                results.list.sort((a, b) => (
                    (a.exam.subjectGroup.subject.code + ' ' + a.exam.subjectGroup.subject.examType.type)
                        .localeCompare
                        (b.exam.subjectGroup.subject.code + ' ' + b.exam.subjectGroup.subject.examType.type)
                ))
                results.list.forEach(r => {
                    heads.push(r.exam.subjectGroup.subject.code + ' ' + r.exam.subjectGroup.subject.examType.type)
                })
                snackbarControl.show('Generating excel...')
                const data = []
                results.list[0].students.forEach(s => data.push([]))
                for (let i = 0; i < results.list.length; i++) {
                    for (let j = 0; j < results.list[i].students.length; j++) {
                        if (!i) {
                            data[j].push(results.list[i].students[j].regno)
                            data[j].push(results.list[i].students[j].name)
                        }
                        data[j].push(results.list[i].students[j].marks)
                    }
                }
                generateCsv(results.list[0].exam.name + '.csv', heads, data)
            }
            setBusy(false)
            snackbarControl.show('Please wait...')
        }
    }, [results])

    return (
        <ContentBox>
            <StyledCard sx={{ height: '100vh' }}>
                {
                    busy
                        ?
                        <TableSkeleton rows={10} cols={4} />
                        :
                        institute && marksheets.length
                            ?
                            <PDFViewer width='100%' height='100%'>
                                <Document
                                    author='alameenmission'
                                    title={`Marksheet-${results.list[0].exam.sessionFrom}-${results.list[0].exam.name}-Class${results.list[0].exam.pclass}`}
                                    creator='alameenmission'
                                    subject={`Marksheet-${results.list[0].exam.sessionFrom}-${results.list[0].exam.name}-Class${results.list[0].exam.pclass}`}
                                >
                                    {
                                        marksheets.map((marksheet, i) => (
                                            <MarksheetPdf
                                                key={`marksheet-${i}`}
                                                exam={results.list[0].exam}
                                                marksheet={marksheet.json()}
                                                institute={institute.json()}
                                            />
                                        ))
                                    }
                                </Document>
                            </PDFViewer>
                            : <></>
                }
            </StyledCard>
        </ContentBox>
    )
}

export default MarksheetPdfViewer