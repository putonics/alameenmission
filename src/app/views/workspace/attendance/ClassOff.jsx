import { Box, Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material'
import React from 'react'

const ClassOff = props => {

    const [state, setState] = React.useState({
        timestamp: new Date(),
        isInstructionalDay: true,
        schoolOffReason: ''
    })

    React.useEffect(() => {
        const { timestamp, schoolOffReason } = props
        const isInstructionalDay = Boolean(schoolOffReason)
        if (state.timestamp !== timestamp && state.schoolOffReason !== schoolOffReason) {
            setState({ isInstructionalDay, timestamp: new Date(timestamp), schoolOffReason })
        }
    }, [props])

    React.useEffect(() => {
        const { timestamp, schoolOffReason } = props
        if (state.timestamp !== timestamp && state.schoolOffReason !== schoolOffReason) {
            props.onChange(state.timestamp, state.schoolOffReason)
        }
    }, [state])

    const handleDateChange = (timestamp) => {
        setState({ ...state, timestamp: new Date(timestamp) })
    }

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item md={4} sm={1}>

                </Grid>
                <Grid item md={8} sm={1}>
                    <FormGroup row>
                        <FormControlLabel
                            sx={state.isInstructionalDay ? { color: '#00aa66' } : { color: '#ff4488' }}
                            defaultValue={state.isInstructionalDay}
                            onChange={() => setState({ ...state, isInstructionalDay: !state.isInstructionalDay })}
                            control={<Checkbox checked={state.isInstructionalDay} />}
                            label={state.isInstructionalDay ? 'Class open' : 'Class close'}
                        />
                    </FormGroup>
                    {
                        !state.isInstructionalDay &&
                        <TextField
                            disabled={state.isInstructionalDay}
                            label="Reason behind off-day"
                            type="text"
                            name="schoolOffReason"
                            onChange={handleChange}
                            value={state.schoolOffReason || ''}
                            validators={['required']}
                            errorMessages={['this field is required']}
                            fullWidth
                        />
                    }
                </Grid>
            </Grid>
        </Box>
    )
}

export default ClassOff