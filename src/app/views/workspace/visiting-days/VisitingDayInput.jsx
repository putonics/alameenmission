import React from 'react'
import { Grid, Icon, Button } from '@mui/material'
import TextField from '../styledcomponents/TextField'
import VisitingDay from 'app/redux/classes/visiting-days/VisitingDay'

/**
 * @param {{visitingDay: VisitingDay, index: number, onChange, onAdd, onDelete, onUp }} props 
 */
const VisitingDayInput = props => {

    const [state, setState] = React.useState(new VisitingDay(props.visitingDay))

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    React.useEffect(() => {
        if (!props.visitingDay.equals(state)) {
            setState(props.visitingDay)
        }
    }, [props])

    React.useEffect(() => {
        const s = state
        const p = props.visitingDay
        if (
            s.index !== p.index
            || s.pclass !== p.pclass
            || s.sessionFrom !== p.sessionFrom
            || s.maleVisitingDays !== p.maleVisitingDays
            || s.femaleVisitingDays !== p.femaleVisitingDays
        ) {
            props.onChange(state)
        }
    }, [state])

    return (
        <Grid container spacing={1}>
            <Grid item xs={2}>
                <TextField
                    label={"Session from"}
                    type="number"
                    name="sessionFrom"
                    id="standard-basic"
                    onChange={handleChange}
                    value={`${state.sessionFrom}` || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label={"Class"}
                    type="text"
                    name="pclass"
                    id="standard-basic"
                    onChange={handleChange}
                    value={state.pclass || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label={"Male visiting days"}
                    type="text"
                    name="maleVisitingDays"
                    id="standard-basic"
                    onChange={handleChange}
                    value={state.maleVisitingDays || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label={"Female visiting days"}
                    type="text"
                    name="femaleVisitingDays"
                    id="standard-basic"
                    onChange={handleChange}
                    value={state.femaleVisitingDays || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={4} textAlign='center'>
                <Button disabled={!props.index} variant="outlined" aria-label="remove" sx={{ py: 1.5 }}
                    onClick={props.onDelete}
                >
                    <Icon>remove</Icon>
                </Button>
                <Button variant="outlined" aria-label="add" sx={{ py: 1.5, ml: 1 }}
                    onClick={props.onAdd}
                >
                    <Icon>add</Icon>
                </Button>
                <Button disabled={!props.index} variant="outlined" aria-label="up" sx={{ py: 1.5, ml: 1 }}
                    onClick={props.onUp}
                >
                    UP
                </Button>
            </Grid>
        </Grid >
    )
}

export default VisitingDayInput