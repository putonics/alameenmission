import { Box, Button, Checkbox, FormControlLabel, FormGroup, Icon, TextField, Typography } from '@mui/material'
import React from 'react'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import StyledCard from '../styledcomponents/StyledCard'

const SchoolOff = props => {

    const [state, setState] = React.useState({
        isInstructionalDay: true,
        schoolOffReason: ''
    })

    React.useEffect(() => {
        const { schoolOffReason } = props
        const isInstructionalDay = !Boolean(schoolOffReason)
        if (state.schoolOffReason !== schoolOffReason) {
            setState({ isInstructionalDay, schoolOffReason })
        }
    }, [props])

    const handleDateChange = (timestamp) => {
        props.onDateChange(timestamp)
    }

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
        props.onSchoolOffReason(event.target.value)
    }

    React.useEffect(() => {
        props.onSchoolOff(!state.isInstructionalDay)
    }, [state])

    return (
        <StyledCard sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                <Box sx={{ px: 4, py: 1, textAlign: 'center' }}>
                    {
                        props.gender === 'MALE'
                            ? <Icon sx={{ color: '#00aaff' }} >boy</Icon>
                            : <Icon sx={{ color: '#ff00aa' }} >girl</Icon>
                    }
                    <Typography sx={{ color: '#777777' }}>{props.gender}</Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        inputFormat='dd/MM/yyyy'
                        value={props.timestamp}
                        onChange={timestamp => handleDateChange(timestamp)}
                        renderInput={(props) => (
                            <TextField
                                {...props}
                                id="mui-pickers-date-timestamp"
                                label="Date of attendance"
                            />
                        )}
                    />
                </LocalizationProvider>
                {
                    state.isInstructionalDay
                        ?
                        <Button variant='outlined' onClick={props.pickFromPrevious}>Pick attendance from previous date</Button>
                        :
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
                <FormGroup row>
                    <FormControlLabel
                        sx={state.isInstructionalDay ? { color: '#00aa66' } : { color: '#ff4488' }}
                        defaultValue={state.isInstructionalDay}
                        onChange={e => setState({ ...state, isInstructionalDay: !state.isInstructionalDay })}
                        control={<Checkbox checked={state.isInstructionalDay} />}
                        label={state.isInstructionalDay ? 'School open' : 'School off'}
                    />
                </FormGroup>
            </Box>
        </StyledCard>
    )
}

export default SchoolOff