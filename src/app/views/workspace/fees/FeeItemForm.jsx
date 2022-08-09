import { Grid, Icon, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import FeeItem from 'app/redux/classes/fees/FeeItem'
import React from 'react'
import TextField from '../styledcomponents/TextField'

/**
 * @param {{ edeItem: FeeIteindex, lastIndex, onChange, onAdd, onDelete, onUp, heads: Array<FeeItem> }} props 
 */
const FeeItemForm = props => {
    const [state, setState] = React.useState({
        index: 0,
        head: '',
        amount: 0
    })

    React.useEffect(() => {
        const s = state
        const p = props.feeItem
        if (s.head && s.amount >= 0 && (s.index !== p.index || s.head !== p.head || s.amount !== p.amount)) {
            props.onChange(state)
        }
    }, [state])

    React.useEffect(() => {
        const s = state
        const p = props.feeItem
        if (s.index !== p.index || s.head !== p.head || s.amount !== p.amount) {
            setState(props.feeItem)
        }
    }, [props])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
        if (event.target.name === 'headSuggest') {
            setState({ ...JSON.parse(event.target.value), index: props.index })
        }
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={3}>
                <FormControl sx={{ mb: 3, width: '100%' }}>
                    <InputLabel id="demo-simple-select-label">Suggestion</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name='headSuggest'
                        value={''}
                        label="Suggestion"
                        onChange={handleChange}
                        inputProps={{ tabIndex: -1 }}
                    >
                        {
                            props.heads.map(h => (
                                <MenuItem
                                    key={h.text()}
                                    value={JSON.stringify(h.json())}
                                >
                                    {h.text()}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label={"Fee head-" + (props.index + 1)}
                    type="text"
                    name="head"
                    id="standard-basic"
                    onChange={handleChange}
                    value={state.head || ''}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                    inputProps={{ tabIndex: -1 }}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Amount (₹)"
                    type="number"
                    name="amount"
                    id="standard-basic"
                    onChange={handleChange}
                    value={`${state.amount}` || '0'}
                    validators={[
                        'required',
                        'minStringLength: 1',
                    ]}
                    errorMessages={[
                        'this field is required',
                        'amount should be a number',
                    ]}
                />
            </Grid>
            <Grid item xs={4} textAlign='center'>
                <Button disabled={!props.index} variant="outlined" aria-label="remove" sx={{ py: 1.5 }}
                    onClick={props.onDelete}
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
                <Button disabled={!props.index} variant="outlined" aria-label="up" sx={{ py: 1.5, ml: 1 }}
                    onClick={props.onUp}
                    tabIndex={-1}
                >
                    UP
                </Button>
            </Grid>
        </Grid >
    )
}

export default FeeItemForm
