import React from 'react'
import ExamType from 'app/redux/classes/students/exam/ExamType'
import TextField from '../styledcomponents/TextField'
import { FormControl, Grid, MenuItem } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker, TimePicker } from '@mui/lab'
import { EXAM_TYPE } from 'app/redux/classes/students/exam/ExamType'
import InputLabel from '../styledcomponents/InputLabel'
import Select from '../styledcomponents/Select'

/**
 * @param {{examType: ExamType, onChange: (examType: ExamType)=>{}}} props 
 */
const ExamTypeForm = props => {
    const [state, setState] = React.useState(props.examType)

    React.useEffect(() => {
        if (!ExamType.equals(props.examType, state)) {
            setState(props.examType)
        }
    }, [props])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        const newState = ({
            ...state,
            [event.target.name]: event.target.name === 'fullMarks' ? (+ event.target.value) : event.target.value,
        })
        setState(newState)
        props.onChange(newState)
    }

    const setDate = (timestamp) => {
        const sdt = new Date(state.timestamp)
        const ndt = new Date(timestamp)
        sdt.setFullYear(ndt.getFullYear())
        sdt.setMonth(ndt.getMonth())
        sdt.setDate(ndt.getDate())
        const newState = ({ ...state, timestamp: sdt.getTime() })
        setState(newState)
        props.onChange(newState)
    }

    const setTime = (timestamp) => {
        const sdt = new Date(state.timestamp)
        const ndt = new Date(timestamp)
        sdt.setHours(ndt.getHours())
        sdt.setMinutes(ndt.getMinutes())
        const newState = ({ ...state, timestamp: sdt.getTime() })
        setState(newState)
        props.onChange(newState)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <FormControl sx={{ mb: 3, width: '100%' }}>
                    <InputLabel id="demo-simple-select-label">Exam type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select-examtype"
                        name='type'
                        value={state.type || 'THEORY'}
                        label="Exam type"
                        onChange={handleChange}
                        required
                    >
                        {
                            EXAM_TYPE.map(examType => (
                                <MenuItem
                                    key={examType}
                                    value={examType}
                                >
                                    {examType}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Full marks"
                    type="number"
                    name="fullMarks"
                    id="standard-basic-fullMarks"
                    onChange={handleChange}
                    value={`${state.fullMarks || ''}`}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Pass marks"
                    type="number"
                    name="passMarks"
                    id="standard-basic-passMarks"
                    onChange={handleChange}
                    value={`${state.passMarks || ''}`}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        inputFormat='dd/MM/yyyy'
                        value={state.timestamp}
                        onChange={timestamp => setDate(timestamp)}
                        renderInput={(props) => (
                            <TextField
                                {...props}
                                // variant="Outlined"
                                id="mui-pickers-date-timestamp"
                                label="Date"
                                sx={{ mb: 2, width: '100%' }}
                            />
                        )}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                        inputFormat='hh:mm'
                        value={state.timestamp}
                        onChange={timestamp => setTime(timestamp)}
                        renderInput={(props) => (
                            <TextField
                                {...props}
                                // variant="Outlined"
                                id="mui-pickers-date-timestamp"
                                label="Time"
                                sx={{ mb: 2, width: '100%' }}
                            />
                        )}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Teacher id"
                    type="text"
                    name="teacherRegno"
                    id="standard-basic-teacherRegno"
                    onChange={handleChange}
                    value={`${state.teacherRegno || ''}`}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
        </Grid >
    )
}

export default ExamTypeForm