import React from 'react'
import { Button, Icon } from '@mui/material'
import { Box } from '@mui/system'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import VisitingDayInput from './VisitingDayInput'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { useVisitingDays } from 'app/redux/classes/visiting-days/VisitingDays'
import VisitingDay from 'app/redux/classes/visiting-days/VisitingDay'
import { useUser } from 'app/redux/classes/User'
import { Span } from 'app/components/Typography'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'

const VisitingDaysWorkspace = props => {
    const user = useUser()

    const visitingDays = useVisitingDays()

    const [state, setState] = React.useState(visitingDays.list)

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        visitingDays.load(user.docref.id)
    }, [])

    React.useEffect(() => {
        setState(visitingDays.list)
    }, [visitingDays])

    React.useEffect(() => {
        setOk(state.filter(vd => vd.valid()).length === state.length)
    }, [state])

    const handleChange = (index, visitingDay) => {
        const start = state.filter((f, i) => i < index)
        const end = state.filter((f, i) => i > index)
        setState([...start, new VisitingDay(visitingDay), ...end])
    }

    const addAfter = index => {
        const start = state.filter((f, i) => i <= index)
        const end = state.filter((f, i) => i > index)
            .map(f => ({ ...f, index: f.index + 1 }))
        setState([...start, new VisitingDay(), ...end])
    }

    const deleteFrom = index => {
        const start = state.filter((f, i) => i < index)
        const end = state.filter((f, i) => i > index)
            .map(f => ({ ...f, index: f.index - 1 }))
        setState([...start, ...end])
    }

    const upFrom = index => {
        if (index === 0) return
        const start = state.filter((f, i) => i <= index - 2)
        const end = state.filter((f, i) => i > index)
        const f1 = { ...state[index], index: index - 1 }
        const f2 = { ...state[index - 1], index: index }
        setState([...start, f1, f2, ...end])
    }

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        if (state.edit) {
            confirmOnPassword.askForConfirmation(func)
        } else {
            func()
        }
    }

    const snackbarControl = useSnackbarControl()
    const handleSubmit = async (event) => {
        visitingDays.insert(user.docref.id, state,
            () => {
                snackbarControl.show('Successfully saved')
            },
            () => {
                snackbarControl.show('Error: Unable to save')
            }
        )
    }

    const topbarControl = useTopbarControl()

    React.useEffect(() => {
        topbarControl.setControlBox(<></>)
    }, [])


    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <Box mb="12px">
                    <Heading sx={ok ? { color: '#00aa44' } : {}}>
                        Visiting days
                        {ok && <Icon fontSize='small'>task_alt</Icon>}
                    </Heading>
                </Box>
                <ValidatorForm
                    onSubmit={() => confirm(handleSubmit)}
                    onError={errors => alert(JSON.stringify(errors))}
                >
                    {
                        state.map((visitingDay, index) => (
                            <VisitingDayInput
                                key={'visitingDayInput' + visitingDay.tempId}
                                visitingDay={visitingDay}
                                index={index}
                                onAdd={() => addAfter(index)}
                                onDelete={() => deleteFrom(index)}
                                onUp={() => upFrom(index)}
                                onChange={visitingDay => handleChange(index, visitingDay)}
                            />
                        ))
                    }
                    <ContentBox>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button color="primary" variant="contained" type="submit" disabled={!ok}>
                                <Icon>save</Icon>
                                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                    Save
                                </Span>
                            </Button>
                        </Box>
                    </ContentBox>
                </ValidatorForm>
            </StyledCard>
        </ContentBox>
    )
}

VisitingDaysWorkspace.propTypes = {

}

export default VisitingDaysWorkspace

//rafcp