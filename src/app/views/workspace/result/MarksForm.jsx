import React from 'react'
import StudentResult from 'app/redux/classes/students/result/StudentResult'
import { Grid, Typography } from '@mui/material'
import TextField from '../styledcomponents/TextField'

/**
 * @param {{ student: StudentResult, index: number, fullMarks: number }} props 
 */
const MarksForm = props => {
    const [state, setState] = React.useState(props.student)

    React.useEffect(() => {
        if (!StudentResult.equals(state, props.student)) {
            setState(props.student)
        }
    }, [props])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        if ((+event.target.value) < 0 || (+event.target.value) > (+props.fullMarks)) return
        const newState = new StudentResult(state).json()
        newState.marks = (+event.target.value)
        setState(newState)
        if (!StudentResult.equals(newState, props.student)) {
            props.onChange(newState)
        }
    }

    return (
        <Grid item xs={12} md={props.gridView ? 4 : 12} key={state.regno}>
            <Grid container sx={{ pb: 1 }} >
                <Grid item xs={3} sx={{ pr: 1 }}>
                    <TextField
                        label="Marks"
                        type="number"
                        name="marks"
                        onChange={handleChange}
                        value={`${state.marks || ''}`}
                    />
                </Grid>
                <Grid item xs={9}>
                    <Typography sx={{ color: '#777788' }}>{props.index}.{state.name}</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                        {state.regno}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default MarksForm
