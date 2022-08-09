import { Grid, Icon, Button, Autocomplete } from '@mui/material'
import { subjectCodes } from 'app/redux/classes/Constants'
import React from 'react'
import TextField from '../styledcomponents/TextField'

const equals = (m1, m2) => Boolean(
    m1 && m2 &&
    m1.subject === m2.subject &&
    (+m1.fullMarks) === (+m2.fullMarks) &&
    (+m1.marksObtained) === (+m2.marksObtained)
)

/**
 * @param {{ edit: boolean, marks, index, onChange, onAdd, onDelete }} props 
 */
const MarksForm = props => {
    const [state, setState] = React.useState({
        subject: '',
        fullMarks: '100',
        marksObtained: '0'
    })

    React.useEffect(() => {
        if (!equals(props.marks, state)) {
            setState(props.marks)
        }
    }, [props])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        const newState = ({
            ...state,
            [event.target.name]: event.target.value,
        })
        setState(newState)
        props.onChange(newState)
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Autocomplete
                    id={"free-solo-demo-subjectCodes" + props.index}
                    freeSolo
                    options={subjectCodes}
                    name='subject'
                    value={state.subject || ''}
                    onSelect={handleChange}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            inputProps={{ ...params.inputProps, tabIndex: -1 }}
                            label={"Subject-" + (props.index + 1)}
                            type="text"
                            name="subject"
                            id={"standard-basic-subject" + props.index}
                            onChange={handleChange}
                            value={state.subject || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={['this field is required']}
                        />
                    } />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    inputProps={{ tabIndex: -1 }}
                    label="Full Marks"
                    type="number"
                    name="fullMarks"
                    id={"standard-basic-fullMarks" + props.index}
                    onChange={handleChange}
                    value={state.fullMarks || '100'}
                    validators={[
                        'required',
                        'minStringLength: 1',
                    ]}
                    errorMessages={[
                        'this field is required',
                        'marks should be a number',
                    ]}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Marks Obtained"
                    type="number"
                    name="marksObtained"
                    id={"standard-basic-marksObtained" + props.index}
                    onChange={handleChange}
                    value={state.marksObtained || ''}
                    validators={[
                        'required',
                        'minStringLength: 1',
                    ]}
                    errorMessages={[
                        'this field is required',
                        'marks should be a number',
                    ]}
                />
            </Grid>
            <Grid item xs={2} textAlign='center'>
                <Button disabled={!props.index} variant="outlined" aria-label="remove" sx={{ py: 1.5 }}
                    onClick={() => props.confirm(props.onDelete)}
                    tabIndex={-1}
                >
                    <Icon>remove</Icon>
                </Button>
                <Button variant="outlined" aria-label="add" sx={{ py: 1.5, ml: 1 }}
                    onClick={props.onAdd}
                    tabIndex={-1}
                >
                    <Icon>add</Icon>
                </Button>
            </Grid>
        </Grid >
    )
}

export default MarksForm
