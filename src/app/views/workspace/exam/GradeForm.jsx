import { Button, Grid, Icon } from '@mui/material'
import Grade from 'app/redux/classes/students/exam/Grade'
import React from 'react'
import TextField from '../styledcomponents/TextField'

/**
 * @param {{grade: Grade, onChange: (grade: Grade)=>{}, onDelete: ()=>{}}} props 
 */
const GradeForm = props => {

    const [state, setState] = React.useState(props.grade)

    React.useEffect(() => {
        if (!Grade.equals(props.grade, state)) {
            setState(props.grade)
        }
    }, [props])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        const newState = ({
            ...state,
            [event.target.name]: (event.target.name === 'min' || event.target.name === 'max') ? (+ event.target.value) : event.target.value,
        })
        setState(newState)
        props.onChange(newState)
    }


    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <TextField
                    label="Grade"
                    type="text"
                    name="code"
                    id="standard-basic-code"
                    onChange={handleChange}
                    value={state.code}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    label="Title"
                    type="text"
                    name="title"
                    id="standard-basic-title"
                    onChange={handleChange}
                    value={state.title}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Min marks"
                    type="number"
                    name="min"
                    id="standard-basic-min"
                    onChange={handleChange}
                    value={`${state.min || 0}`}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Max marks"
                    type="number"
                    name="max"
                    id="standard-basic-max"
                    onChange={handleChange}
                    value={`${state.max || ''}`}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <Button color="error" variant="contained" type="button"
                    onClick={props.onDelete}
                >
                    <Icon>delete</Icon>
                </Button>
            </Grid>
        </Grid>
    )
}

export default GradeForm