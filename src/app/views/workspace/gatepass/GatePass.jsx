import { Box, Button, Icon } from '@mui/material'
import { Span } from 'app/components/Typography'
import Student from 'app/redux/classes/students/Student'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator'
import TableSkeleton from '../skeleton/TableSkeleton'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import { images } from 'app/redux/classes/Constants'
import { useVisitingDays } from 'app/redux/classes/visiting-days/VisitingDays'
import Card from './Card'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'

const GatePass = props => {

    const topbarControl = useTopbarControl()//redux
    React.useEffect(() => {
        topbarControl.setControlBox(<></>)
    }, [])

    const [regno, setRegno] = React.useState('')

    const [student, setStudent] = React.useState(null)

    const user = useUser()

    const [busy, setBusy] = React.useState(false)
    const handleSubmit = () => {
        setStudent(null)
        const newStudent = new Student()
        setBusy(true)
        newStudent.search(user.subscriberdocid, regno).finally(() => {
            setBusy(false)
            if (newStudent.docref) {
                setStudent(newStudent)
            }
        })
    }

    const visitingDays = useVisitingDays()
    const [visitingDay, setVisitingDay] = React.useState('2nd & 4th Sunday')
    React.useEffect(() => {
        if (visitingDays.docref && student) {
            const vida = visitingDays.list.find(vd => vd.sessionFrom === student.sessionFrom && vd.pclass === student.pclass)
            if (vida) {
                setVisitingDay(
                    student.gender === 'FEMALE'
                        ? vida.femaleVisitingDays
                        : vida.maleVisitingDays
                )
            }
        } else {
            visitingDays.load(user.subscriberdocid)
        }
    }, [visitingDays, student])

    return (
        <ContentBox>
            <StyledCard>
                {
                    busy
                        ?
                        <TableSkeleton cols={3} rows={3} />
                        :
                        <ValidatorForm
                            onSubmit={handleSubmit}
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
                                    disabled={!regno}
                                >
                                    <Icon>search</Icon>
                                    <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                        Search
                                    </Span>
                                </Button>
                            </Box>
                        </ValidatorForm>
                }
            </StyledCard>
            {
                student
                    ?
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        <Card student={student} />
                        <Card student={student} visitingDay={visitingDay} imageName={images[1].name} visitor={{ ...student?.father, relation: 'FATHER' }} />
                        <Card student={student} visitingDay={visitingDay} imageName={images[2].name} visitor={{ ...student?.mother, relation: 'MOTHER' }} />
                        <Card student={student} visitingDay={visitingDay} imageName={images[3].name} visitor={student?.visitor1} />
                        <Card student={student} visitingDay={visitingDay} imageName={images[4].name} visitor={student?.visitor2} />
                    </Box>
                    :
                    <></>
            }
        </ContentBox>
    )
}

export default GatePass