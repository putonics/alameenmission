import React from 'react'
import { Autocomplete, Button, Icon, Typography } from '@mui/material'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useNavigate, useParams } from 'react-router-dom'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import { Box } from '@mui/system'
import Heading from '../styledcomponents/Heading'
import { pclasses } from 'app/redux/classes/Constants'
import Fee from 'app/redux/classes/fees/Fee'
import { useFees } from 'app/redux/classes/fees/Fees'
import OneTimeFeesForm from './OneTimeFeesForm'
import YearlyFeesForm from './YearlyFeesForm'
import MonthlyFeesForm from './MonthlyFeesForm'
import { Span } from 'app/components/Typography'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'

const FeeEntryForm = props => {
    const { pclass, monthlyFee } = useParams()
    const [state, setState] = React.useState({
        edit: false
    })

    const fees = useFees()
    React.useEffect(() => {
        fees.load(monthlyFee, pclass)
    }, [])

    React.useEffect(() => {
        if (!state.edit) {
            if (fees.selectedIndex >= 0) {
                setState({ ...fees.fees[fees.selectedIndex].json(), edit: true })
            } else {
                setState({ ...new Fee(pclass !== 'new' ? { pclass: pclass } : {}).json(), edit: false })
            }
        }
    }, [fees])

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        if (state.edit) {
            confirmOnPassword.askForConfirmation(func)
        } else {
            func()
        }
    }

    const snackbarControl = useSnackbarControl()
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        if (state.edit) {
            await fees.update(monthlyFee, pclass, state,
                () => {
                    snackbarControl.show('Successfully updated')
                    navigate('/fees')
                },
                () => {
                    snackbarControl.show('Error: Unable to save')
                }
            )
        } else {
            await fees.insert(state,
                () => {
                    snackbarControl.show('Successfully added')
                    navigate('/fees')
                },
                () => {
                    snackbarControl.show('Error: Unable to save')
                }
            )
        }
    }

    const [error, setError] = React.useState('')
    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        let flag = Boolean(
            state.pclass
            && state.oneTimeFees.length > 0
            && state.yearlyFees.length > 0
            && state.monthlyFees.length > 0
            && state.oneTimeFees.filter(f => f.head && (+f.amount) >= 0).length === state.oneTimeFees.length
            && state.yearlyFees.filter(f => f.head && (+f.amount) >= 0).length === state.yearlyFees.length
            && state.monthlyFees.filter(f => f.head && (+f.amount) >= 0).length === state.monthlyFees.length
        )
        const c1 = new Fee(state).totalMonthlyFees()
        const c2 = fees.getMonthlyFeesExceptSelected(pclass === 'new' ? state.pclass : pclass)
        if (c2.includes(c1)) {
            setError(`Error: Same monthly-fees ₹${c1} for this class already exists. Please change it.`)
            flag = false
        } else {
            setError('')
        }
        if (flag !== ok) setOk(flag)
    }, [state])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <ValidatorForm onSubmit={() => confirm(handleSubmit)} onError={errors => alert(JSON.stringify(errors))}>
                    <Box mb="12px" >
                        <Heading sx={ok ? { color: '#00aa44' } : {}}>
                            Fees details
                            {ok && <Icon fontSize='small'>task_alt</Icon>}
                        </Heading>
                    </Box>
                    <Autocomplete
                        disabled={pclass !== 'new'}
                        id="free-solo-demo"
                        freeSolo
                        options={pclasses}
                        name='pclass'
                        value={state.pclass || ''}
                        onSelect={handleChange}
                        renderInput={(params) =>
                            <TextField
                                disabled={pclass !== 'new'}
                                {...params}
                                label="Fees for class"
                                type="text"
                                name="pclass"
                                id="standard-basic"
                                onChange={handleChange}
                                value={state.pclass || ''}
                                validators={[
                                    'required',
                                ]}
                                errorMessages={['this field is required']}
                            />
                        } />
                    {
                        state.oneTimeFees &&
                        <OneTimeFeesForm
                            oneTimeFees={state.oneTimeFees}
                            onChange={handleChange}
                            edit={state.edit}
                            confirm={confirm}
                        />
                    }
                    {
                        state.yearlyFees &&
                        <YearlyFeesForm
                            yearlyFees={state.yearlyFees}
                            onChange={handleChange}
                            edit={state.edit}
                            confirm={confirm}
                        />
                    }
                    {
                        state.monthlyFees &&
                        <MonthlyFeesForm
                            monthlyFees={state.monthlyFees}
                            onChange={handleChange}
                            edit={state.edit}
                            confirm={confirm}
                        />
                    }
                    {
                        error &&
                        <Typography sx={{ color: '#ff4488', textAlign: 'center' }}>
                            {error}
                        </Typography>
                    }
                    <ContentBox>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button color="primary" variant="contained" type="submit" disabled={!ok}>
                                <Icon>save</Icon>
                                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                    {state.edit ? 'Update' : 'Add'}
                                </Span>
                            </Button>
                        </Box>
                    </ContentBox>
                </ValidatorForm>
            </StyledCard>
        </ContentBox>
    )
}

export default FeeEntryForm