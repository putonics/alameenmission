import { Box, Button, Icon, Typography } from '@mui/material'
import { Span } from 'app/components/Typography'
import Student from 'app/redux/classes/students/Student'
import React from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator'
import TableSkeleton from '../skeleton/TableSkeleton'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import { useUser } from 'app/redux/classes/User'
import { useFees } from 'app/redux/classes/fees/Fees'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import FeePaidItemView from './FeePaidItemView'
import { onlyDate } from 'app/utils/constant'
import Card from './Card'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import FeesReportTopBar from './report/FeesReportTopBar'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'

const FeesReceived = props => {

    const topbarControl = useTopbarControl()//redux
    React.useEffect(() => {
        topbarControl.setControlBox(<FeesReportTopBar />)
    }, [])

    const [regno, setRegno] = React.useState('')

    const [student, setStudent] = React.useState(null)

    const user = useUser()

    const fees = useFees()

    const [busy, setBusy] = React.useState(false)
    const searchStudent = () => {
        setStudent(null)
        const newStudent = new Student()
        setBusy(true)
        newStudent.search(user.subscriberdocid, regno, fees.sessionFrom).finally(() => {
            if (newStudent.docref) {
                setStudent(newStudent)
            }
        })
    }

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
                // alert(user.subscriberdocid + "<<<<>>>>" + student.sessionFrom)
                fees.fetch(user.subscriberdocid, student.sessionFrom)
            }
        }
    }
    React.useEffect(loadFees, [student, fees])

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }

    const snackbarControl = useSnackbarControl()
    const handlePayment = () => {
        setBusy(true)
        student
            .makePayment(onetimeFeePaidItems, yearlyFeePaidItems, monthlyFeePaidItems)
            .then(() => {
                snackbarControl.show('Fees saved')
            })
            .finally(searchStudent)
    }

    return (
        <ContentBox>
            <StyledCard>
                {
                    busy
                        ?
                        <TableSkeleton cols={3} rows={3} />
                        :
                        <>
                            <ValidatorForm
                                onSubmit={searchStudent}
                                onError={errors => alert(JSON.stringify(errors))}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
                                    <TextField
                                        label="Registration number"
                                        type="text"
                                        name="regno"
                                        onChange={e => setRegno(e.target.value)}
                                        value={regno || ''}
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                        fullWidth
                                        autoFocus
                                    />
                                    <Button color="primary" variant="contained" type="submit"
                                        sx={{ mb: 2 }}
                                        disabled={!Boolean(regno)}
                                    >
                                        <Icon>search</Icon>
                                        <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                            Search
                                        </Span>
                                    </Button>
                                </Box>
                            </ValidatorForm>
                            {
                                student
                                    ? <Card
                                        student={student}
                                        paid={amount.opaid + amount.ypaid + amount.mpaid}
                                        due={amount.odue + amount.ydue + amount.mdue}
                                        cashPaid={amount.cashPaid}
                                    />
                                    : <></>
                            }
                        </>
                }
            </StyledCard>
            <StyledCard sx={{ my: 1 }}>
                <Box sx={{ py: 1, display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#000044' }}>
                        One-time Fees (₹ {amount.opaid + amount.odue})
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#00aa44', px: 2 }}>
                        Paid ₹ {amount.opaid}
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#ff0044', px: 2 }}>
                        Due ₹ {amount.odue}
                    </Typography>
                </Box>
                {
                    busy
                        ?
                        <TableSkeleton cols={4} rows={3} />
                        :
                        onetimeFeePaidItems.map((ofp, index) => (
                            <FeePaidItemView
                                index={index}
                                feePaidItem={ofp}
                                key={ofp.group + ofp.head + ofp.month + ofp.year}
                                onChange={
                                    paidon => {
                                        const fpi = onetimeFeePaidItems.map(ofpi => ofpi)
                                        if (!fpi[index].paidon) {
                                            setAmount({
                                                ...amount,
                                                opaid: amount.opaid + fpi[index].amount,
                                                odue: amount.odue - fpi[index].amount,
                                                cashPaid: amount.cashPaid + fpi[index].amount
                                            })
                                        }
                                        fpi[index].paidon = onlyDate(paidon).getTime()
                                        setOnetimeFeePaidItems(fpi)
                                    }
                                }
                                onCancel={
                                    () => {
                                        const fpi = onetimeFeePaidItems.map(ofpi => ofpi)
                                        if (fpi[index].paidon) {
                                            setAmount({
                                                ...amount,
                                                opaid: amount.opaid - fpi[index].amount,
                                                odue: amount.odue + fpi[index].amount,
                                                cashPaid: amount.cashPaid - fpi[index].amount
                                            })
                                        }
                                        fpi[index].paidon = 0
                                        setOnetimeFeePaidItems(fpi)
                                    }
                                }
                            />
                        ))
                }
            </StyledCard>
            <StyledCard sx={{ my: 1 }}>
                <Box sx={{ py: 1, display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#000044' }}>
                        Yearly Fees (₹ {amount.ypaid + amount.ydue})
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#00aa44', px: 2 }}>
                        Paid ₹ {amount.ypaid}
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#ff0044', px: 2 }}>
                        Due ₹ {amount.ydue}
                    </Typography>
                </Box>
                {
                    busy
                        ?
                        <TableSkeleton cols={4} rows={6} />
                        :
                        yearlyFeePaidItems.map((yfp, index) => (
                            <FeePaidItemView
                                index={index}
                                feePaidItem={yfp}
                                key={yfp.group + yfp.head + yfp.month + yfp.year}
                                onChange={
                                    paidon => {
                                        const fpi = yearlyFeePaidItems.map(ofpi => ofpi)
                                        if (!fpi[index].paidon) {
                                            setAmount({
                                                ...amount,
                                                ypaid: amount.ypaid + fpi[index].amount,
                                                ydue: amount.ydue - fpi[index].amount,
                                                cashPaid: amount.cashPaid + fpi[index].amount
                                            })
                                        }
                                        fpi[index].paidon = onlyDate(paidon).getTime()
                                        setYearlyFeePaidItems(fpi)
                                    }
                                }
                                onCancel={
                                    () => {
                                        const fpi = yearlyFeePaidItems.map(ofpi => ofpi)
                                        if (fpi[index].paidon) {
                                            setAmount({
                                                ...amount,
                                                ypaid: amount.ypaid - fpi[index].amount,
                                                ydue: amount.ydue + fpi[index].amount,
                                                cashPaid: amount.cashPaid - fpi[index].amount
                                            })
                                        }
                                        fpi[index].paidon = 0
                                        setYearlyFeePaidItems(fpi)
                                    }
                                }
                            />
                        ))
                }
            </StyledCard>
            <StyledCard sx={{ my: 1 }}>
                <Box sx={{ py: 1, display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#000044' }}>
                        Monthly Fees (₹ {amount.mpaid + amount.mdue})
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#00aa44', px: 2 }}>
                        Paid ₹ {amount.mpaid}
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#ff0044', px: 2 }}>
                        Due ₹ {amount.mdue}
                    </Typography>
                </Box>
                {
                    busy
                        ?
                        <TableSkeleton cols={4} rows={2} />
                        :
                        monthlyFeePaidItems.map((mfp, index) => (
                            <FeePaidItemView
                                index={index}
                                feePaidItem={mfp}
                                key={mfp.group + mfp.head + mfp.month + mfp.year}
                                onChange={
                                    paidon => {
                                        const fpi = monthlyFeePaidItems.map(ofpi => ofpi)
                                        if (!fpi[index].paidon) {
                                            setAmount({
                                                ...amount,
                                                mpaid: amount.mpaid + fpi[index].amount,
                                                mdue: amount.mdue - fpi[index].amount,
                                                cashPaid: amount.cashPaid + fpi[index].amount
                                            })
                                        }
                                        fpi[index].paidon = onlyDate(paidon).getTime()
                                        setMonthlyFeePaidItems(fpi)
                                    }
                                }
                                onCancel={
                                    () => {
                                        const fpi = monthlyFeePaidItems.map(ofpi => ofpi)
                                        if (fpi[index].paidon) {
                                            setAmount({
                                                ...amount,
                                                mpaid: amount.mpaid - fpi[index].amount,
                                                mdue: amount.mdue + fpi[index].amount,
                                                cashPaid: amount.cashPaid - fpi[index].amount
                                            })
                                        }
                                        fpi[index].paidon = 0
                                        setMonthlyFeePaidItems(fpi)
                                    }
                                }
                            />
                        ))
                }
            </StyledCard>
            <StyledCard sx={{ my: 1, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#000044' }}>
                        Total ₹ {amount.opaid + amount.odue + amount.ypaid + amount.ydue + amount.mpaid + amount.mdue}
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#00aa44', px: 2 }}>
                        Paid ₹ {amount.opaid + amount.ypaid + amount.mpaid}
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#ff0044', px: 2 }}>
                        Due ₹ {amount.odue + amount.ydue + amount.mdue}
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#000044', px: 2 }}>
                        Cash ₹ {amount.cashPaid}
                    </Typography>
                    <Button color="primary" variant="contained" type="submit"
                        disabled={!Boolean(amount.cashPaid)}
                        onClick={() => confirm(handlePayment)}
                    >
                        <Icon>send</Icon>
                        <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                            Save
                        </Span>
                    </Button>
                </Box>
            </StyledCard>
        </ContentBox>
    )
}

export default FeesReceived