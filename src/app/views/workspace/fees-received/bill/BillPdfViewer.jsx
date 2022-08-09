import React from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import { useParams } from 'react-router-dom'
import BillPdf from './BillPdf'
import ContentBox from '../../styledcomponents/ContentBox'
import StyledCard from '../../styledcomponents/StyledCard'
import { useInstitutes } from 'app/redux/classes/Institutes'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import TableSkeleton from '../../skeleton/TableSkeleton'
import Student from 'app/redux/classes/students/Student'
import { useFees } from 'app/redux/classes/fees/Fees'

const BillPdfViewer = props => {
    const { docid } = useParams()

    const [student, setStudent] = React.useState(null)

    const [busy, setBusy] = React.useState(false)

    const searchStudent = () => {
        setStudent(null)
        const newStudent = new Student()
        setBusy(true)
        newStudent.load(docid).finally(() => {
            if (newStudent.docref) {
                setStudent(newStudent)
            }
        })
    }

    React.useEffect(searchStudent, [])

    const fees = useFees()
    const [onetimeFeePaidItems, setOnetimeFeePaidItems] = React.useState([])
    const [yearlyFeePaidItems, setYearlyFeePaidItems] = React.useState([])
    const [monthlyFeePaidItems, setMonthlyFeePaidItems] = React.useState([])
    const [amount, setAmount] = React.useState({
        opaid: 0, odue: 0,
        ypaid: 0, ydue: 0,
        mpaid: 0, mdue: 0,
        cashPaid: 0
    })
    const loadFees = () => {
        if (student) {
            if (student.sessionFrom === fees.sessionFrom) {
                const fpis = fees.getFeePaidItems(student)
                const ofpis = []
                const yfpis = []
                const mfpis = []
                let opaid = 0, odue = 0
                let ypaid = 0, ydue = 0
                let mpaid = 0, mdue = 0
                let cashPaid = 0
                fpis.forEach(fpi => {
                    if (fpi.group === 'ONETIME') {
                        ofpis.push(fpi)
                        if (fpi.paidon) {
                            opaid += fpi.amount
                        } else {
                            odue += fpi.amount
                        }
                    } else if (fpi.group === 'YEARLY') {
                        yfpis.push(fpi)
                        if (fpi.paidon) {
                            ypaid += fpi.amount
                        } else {
                            ydue += fpi.amount
                        }
                    } else {
                        mfpis.push(fpi)
                        if (fpi.paidon) {
                            mpaid += fpi.amount
                        } else {
                            mdue += fpi.amount
                        }
                    }
                })
                setOnetimeFeePaidItems(ofpis)//fpis.filter(fpi => fpi.group === 'ONETIME'))
                setYearlyFeePaidItems(yfpis)//fpis.filter(fpi => fpi.group === 'YEARLY'))
                setMonthlyFeePaidItems(mfpis)//fpis.filter(fpi => fpi.group === 'MONTHLY'))
                setAmount({ opaid, odue, ypaid, ydue, mpaid, mdue, cashPaid })
                setBusy(false)
            } else {
                fees.fetch(student.subscriberdocid, student.sessionFrom)
            }
        }
    }
    React.useEffect(loadFees, [student, fees])

    /////////////////////////////////////////////////

    const institutes = useInstitutes()

    const [institute, setInstitute] = React.useState(null)

    React.useEffect(() => {
        if (!institutes.list.length) {
            setBusy(true)
            institutes.load().finally(() => setBusy(false))
            return
        }
        if (institutes.list.length && student && student.subscriberdocid) {
            setInstitute(institutes.getInstitute(student.subscriberdocid))
        }
    }, [student, institutes])

    const snackbarControl = useSnackbarControl()
    React.useEffect(() => {
        snackbarControl.show('Please wait! Generating bill...')
    }, [])

    return (
        <ContentBox>
            <StyledCard sx={{ height: '100vh' }}>
                {
                    busy
                        ?
                        <TableSkeleton rows={10} cols={4} />
                        :
                        student && institute
                            ?
                            <PDFViewer width='100%' height='100%'>
                                <BillPdf
                                    student={student.json()}
                                    institute={institute.json()}
                                    ofpis={onetimeFeePaidItems}
                                    yfpis={yearlyFeePaidItems}
                                    mfpis={monthlyFeePaidItems}
                                    amount={amount}
                                />
                            </PDFViewer>
                            : <></>
                }
            </StyledCard>
        </ContentBox>
    )
}

export default BillPdfViewer