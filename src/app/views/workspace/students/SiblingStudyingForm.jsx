import { Button, Grid, Icon } from '@mui/material'
import React from 'react'
import TextField from '../styledcomponents/TextField'
/**
 * @param {{ siblingsStudyingInMission, index, onChange, onAdd, onDelete, edit }} props 
 */
const SiblingStudyingForm = props => {
    const [state, setState] = React.useState({
        regno: '',
        name: '',
        branch: '',
        fee: '0',
    })

    React.useEffect(() => {
        (async () => {
            if (state.regno && state.name && state.branch && parseInt(state.fee) > 0) {
                props.onChange(state)
            }
        })()
    }, [state])

    React.useEffect(() => {
        if (state !== props.siblingsStudyingInMission) {
            setState(props.siblingsStudyingInMission)
        }
    }, [props])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={2}>
                <TextField
                    label="Reg. No."
                    type="text"
                    name="regno"
                    id={"standard-basic-regno" + props.index}
                    onChange={handleChange}
                    value={state.regno || ''}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Name"
                    type="text"
                    name="name"
                    id={"standard-basic-name" + props.index}
                    onChange={handleChange}
                    value={state.name || ''}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Branch"
                    type="text"
                    name="branch"
                    id={"standard-basic-branch" + props.index}
                    onChange={handleChange}
                    value={state.branch || ''}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Fees"
                    type="number"
                    name="fee"
                    id={"standard-basic-fee" + props.index}
                    onChange={handleChange}
                    value={state.fee || ''}
                    validators={[
                        'required',
                        'minStringLength: 1',
                    ]}
                    errorMessages={[
                        'this field is required',
                        'fees should be a number'
                    ]}
                />
            </Grid>
            <Grid item xs={2} textAlign='center'>
                <Button disabled={!props.index} variant="outlined" aria-label="remove" sx={{ py: 1.5 }}
                    onClick={() => props.confirm(props.onDelete)}
                >
                    <Icon>remove</Icon>
                </Button>
                <Button variant="outlined" aria-label="add" sx={{ py: 1.5, ml: 1 }}
                    onClick={props.onAdd}
                >
                    <Icon>add</Icon>
                </Button>
            </Grid>
        </Grid>
    )
}

export default SiblingStudyingForm
