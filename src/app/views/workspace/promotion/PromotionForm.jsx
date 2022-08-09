import { Box, Button, Typography } from '@mui/material'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { pclasses } from 'app/redux/classes/Constants'
import { useStudentCountReports } from 'app/redux/classes/report/StudentCountReports'
import Students, { useStudents } from 'app/redux/classes/students/Students'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import TableSkeleton from '../skeleton/TableSkeleton'
import StyledCard from '../styledcomponents/StyledCard'
import NewClassForm from './NewClassForm'
import OldClassForm from './OldClassForm'
import FeesMapForm from './FeesMapForm'
import AdmissionForm from './AdmissionForm'
import StudentPromotion from './StudentPromotion'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'

/**
 * @param {{gender: string, onChange: Function}} props 
 */
const PromotionForm = props => {

    const year = new Date().getFullYear()
    const [oldstate, setOldstate] = React.useState({ pclass: 'PP', sessionFrom: year - 1 })
    const [newstate, setNewstate] = React.useState({ pclass: 'I', sessionFrom: year })

    React.useEffect(() => {
        setNewstate({ pclass: pclasses[pclasses.findIndex(pclass => pclass === oldstate.pclass) + 1], sessionFrom: oldstate.sessionFrom + 1 })
    }, [oldstate])

    const [step, setStep] = React.useState(1)
    React.useEffect(() => props.onChange(step), [step])
    const [busy, setBusy] = React.useState(false)
    const [error, setError] = React.useState('')
    const students = useStudents()
    const user = useUser()
    const scrs = useStudentCountReports()
    const [fees, setFees] = React.useState([{ oldFee: 0, newFee: 0 }])
    const [admission, setAdmission] = React.useState({ admissionDate: new Date(), feeStartingMonth: 3 })
    const loadStudents = async () => {
        setBusy(true)
        const alreadyDone = await Students.isExist(user.subscriberdocid, newstate.sessionFrom, newstate.pclass, props.gender)
        if (alreadyDone) {
            setError('Error: It seems to be already been promoted!')
            setBusy(false)
            return
        }
        setError('')
        await scrs.load(user.subscriberdocid, oldstate.sessionFrom)
        if (scrs.list.length) {
            await students.load(user.subscriberdocid, oldstate.sessionFrom, oldstate.pclass, scrs)
            const list = students.list.filter(s => s.gender === props.gender)
            if (list.length) {
                const fees = []
                list.forEach(s => {
                    if (!fees.find(f => f.oldFee === s.fee)) {
                        fees.push({ oldFee: s.fee, newFee: 0 })
                    }
                })
                if (fees.length) {
                    setFees(fees)
                    setAdmission({ admissionDate: new Date(`01-APR-${newstate.sessionFrom}`), feeStartingMonth: 3 })
                    setStep(2)
                } else {
                    setError('No students found!')
                }
            }
        } else {
            setError('No students found!')
        }
        setBusy(false)
    }

    const promoteStudents = () => {
        if (newstate.pclass !== 'PASSED OUT' && fees.filter(f => f.newFee <= 0).length > 0) {
            setError('Please provide all the fees')
        } else {
            setStep(3)
            setError('')
        }
    }

    const confirmOnPassword = useConfirmOnPassword()
    const submit = () => {
        if (step === 1) {
            loadStudents()
        } else if (step === 2) {
            confirmOnPassword.askForConfirmation(promoteStudents)
        }
    }

    return (
        <ValidatorForm onSubmit={submit} >
            {
                busy
                    ?
                    <TableSkeleton rows={4} cols={2} />
                    : step === 1 ?
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                <OldClassForm {...oldstate} year={year} onChange={state => setOldstate(state)} />
                                <NewClassForm {...newstate} year={year} onChange={state => setNewstate(state)} />
                            </Box>
                            {
                                error ? <Typography sx={{ mt: 3, color: '#aa6666', textAlign: 'center', fontSize: 20 }}>{error}</Typography> : <></>
                            }
                            <Button sx={{ mt: 3 }} variant='contained' type='submit' >Next</Button>
                        </Box>
                        : step === 2 ?
                            <Box sx={{ textAlign: 'center' }}>
                                <StyledCard>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                        <Typography sx={{ color: '#aaaacc' }}>Promotion from Class </Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: 20 }}>{oldstate.pclass} </Typography>
                                        <Typography sx={{ color: '#aaaacc' }}>of </Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: 20 }}>{`${oldstate.sessionFrom}-${oldstate.sessionFrom % 100 + 1}`} </Typography>
                                        <Typography sx={{ color: '#aaaacc' }}>to Class </Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: 20 }}>{newstate.pclass} </Typography>
                                        <Typography sx={{ color: '#aaaacc' }}>of </Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: 20 }}>{`${newstate.sessionFrom}-${newstate.sessionFrom % 100 + 1}`} </Typography>
                                    </Box>
                                </StyledCard>
                                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                    <StyledCard sx={{ width: 300 }}>
                                        <FeesMapForm fees={fees} onChange={fees => setFees(fees)} />
                                    </StyledCard>
                                    <Box>
                                        <StyledCard>
                                            <AdmissionForm
                                                {...admission}
                                                onChange={admission => setAdmission(admission)}
                                            />
                                        </StyledCard>
                                        {
                                            error ? <Typography sx={{ mt: 3, color: '#aa6666', textAlign: 'center', fontSize: 20 }}>{error}</Typography> : <></>
                                        }
                                        <Button sx={{ mt: 3 }} variant='contained' type='submit'>Submit</Button>
                                    </Box>
                                </Box>
                            </Box>
                            : step === 3 ?
                                <StudentPromotion fees={fees} {...admission} {...newstate} gender={props.gender} />
                                : <></>
            }
        </ValidatorForm>
    )
}

export default PromotionForm