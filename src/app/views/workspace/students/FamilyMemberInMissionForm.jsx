import { Checkbox, FormControlLabel } from '@mui/material'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import FamilyMemberForm from './FamilyMemberForm'

/**
 * @param {{confirm, edit, onChange }} props 
 */
const FamilyMemberInMissionForm = props => {
    const [enabled, setEnabled] = React.useState(false)
    const [state, setState] = React.useState([])

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState(
                student && student.familyMembersFromMission && student.familyMembersFromMission.length > 0
                    ? student.familyMembersFromMission.map(f => ({ ...f }))
                    : []
            )
            setEnabled(student && student.familyMembersFromMission && student.familyMembersFromMission.length > 0)
        }
    }, [selectedStudent])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            if (!enabled || (state.length > 0
                && state.length === state.filter(m => m.relation && m.name && m.empid && m.branch && m.dept).length)) {
                props.onChange({ familyMembersFromMission: state })
                if (!ok) setOk(!ok)
            } else {
                if (ok) setOk(!ok)
            }
        })()
    }, [state])

    React.useEffect(() => {
        if (enabled && state.length === 0) {
            setState([{ relation: '', name: '', empid: '', branch: '', dept: '' }])
        }
        if (!enabled && state.length > 0) {
            setState([])
        }
    }, [enabled])

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <FormControlLabel
                    sx={ok ? { color: '#00aa66' } : {}}
                    defaultValue={enabled}
                    onChange={() => props.confirm(() => setEnabled(!enabled))}
                    control={<Checkbox checked={enabled} />}
                    label={enabled ? 'Some relatives are employees of mission.' : 'No relative is employee of mission'}
                />
                {
                    enabled &&
                    <ContentBox sx={{ p: 2, m: 0, border: '1px solid #3366aa22' }}>
                        {
                            state.map((familyMembersFromMission, i) => (
                                <FamilyMemberForm
                                    confirm={props.confirm}
                                    edit={props.edit}
                                    key={`familyMembersFromMissionForm${i}`}
                                    familyMembersFromMission={familyMembersFromMission}
                                    index={i}
                                    onChange={familyMembersFromMission => setState(state.map((m, index) => (index === i) ? familyMembersFromMission : m))}
                                    onAdd={() => setState([
                                        ...state.filter((val, index) => index <= i),
                                        { relation: '', name: '', empid: '', branch: '', dept: '' },
                                        ...state.filter((val, index) => index > i),
                                    ])}
                                    onDelete={() => setState(state.filter((val, index) => index !== i))}
                                />
                            ))
                        }
                    </ContentBox>
                }
            </StyledCard>
        </ContentBox>
    )
}

export default FamilyMemberInMissionForm
