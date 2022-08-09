import { Button, Grid, Icon } from '@mui/material'
import React from 'react'
import TextField from '../styledcomponents/TextField'
/**
 * @param {{confirm, familyMembersFromMission, index, onChange, onAdd, onDelete, edit }} props 
 */
const FamilyMemberForm = props => {
    const [state, setState] = React.useState({
        relation: '',
        name: '',
        empid: '',
        branch: '',
        dept: '',
    })

    React.useEffect(() => {
        (async () => {
            if (state.relation && state.name && state.empid && state.branch && state.dept) {
                props.onChange(state)
            }
        })()
    }, [state])

    React.useEffect(() => {
        if (state !== props.familyMembersFromMission) {
            setState(props.familyMembersFromMission)
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
                    label="Relation"
                    type="text"
                    name="relation"
                    id="standard-basic-relation"
                    onChange={handleChange}
                    value={state.relation || ''}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Name"
                    type="text"
                    name="name"
                    id="standard-basic-fmname"
                    onChange={handleChange}
                    value={state.name || ''}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Emp.Id."
                    type="text"
                    name="empid"
                    id="standard-basic-fmempid"
                    onChange={handleChange}
                    value={state.empid || ''}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Branch"
                    type="text"
                    name="branch"
                    id="standard-basic-fmbranch"
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
                    label="Department"
                    type="text"
                    name="dept"
                    id="standard-basic-fmdept"
                    onChange={handleChange}
                    value={state.dept || ''}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
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

export default FamilyMemberForm
