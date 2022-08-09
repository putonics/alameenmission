import { Checkbox, FormControlLabel } from '@mui/material'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import SiblingStudyingForm from './SiblingStudyingForm'

/**
 * @param {{confirm, edit, onChange }} props 
 */
const SiblingsStudyingInMissionForm = props => {
    const [enabled, setEnabled] = React.useState(false)
    const [state, setState] = React.useState([])

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState(
                student && student.siblingsStudyingInMission && student.siblingsStudyingInMission.length > 0
                    ? student.siblingsStudyingInMission.map(s => ({ ...s, fee: s.fee + '' }))
                    : []
            )
            setEnabled(student && student.siblingsStudyingInMission && student.siblingsStudyingInMission.length > 0)
        }
    }, [selectedStudent])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            if (!enabled || (state.length > 0
                && state.length === state.filter(m => m.regno && m.name && m.branch && parseInt(m.fee) > 0).length)) {
                props.onChange({ siblingsStudyingInMission: state })
                if (!ok) setOk(!ok)
            } else {
                if (ok) setOk(!ok)
            }
        })()
    }, [state])

    React.useEffect(() => {
        if (enabled && state.length === 0) {
            setState([{ regno: '', name: '', branch: '', fee: '0' }])
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
                    label={enabled ? 'Some brothers or sisters studying in mission.' : 'No brother or sister studying in mission'}
                />
                {
                    enabled &&
                    <ContentBox sx={{ p: 2, m: 0, border: '1px solid #3366aa22' }}>
                        {
                            state.map((siblingsStudyingInMission, i) => (
                                <SiblingStudyingForm
                                    confirm={props.confirm}
                                    edit={props.edit}
                                    key={`familyMembersFromMissionForm${i}`}
                                    siblingsStudyingInMission={siblingsStudyingInMission}
                                    index={i}
                                    onChange={siblingsStudyingInMission => setState(state.map((m, index) => (index === i) ? siblingsStudyingInMission : m))}
                                    onAdd={() => setState([
                                        ...state.filter((val, index) => index <= i),
                                        { regno: '', name: '', branch: '', fee: '0' },
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

export default SiblingsStudyingInMissionForm
