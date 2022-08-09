import React from 'react'
import { Grid, Autocomplete } from '@mui/material'
import { isAllFilled, isNotEqual } from 'app/redux/classes/EqualityChecker'
import TextField from '../styledcomponents/TextField'
import { searchByPin } from '../students/ApiCalls'
import Address from 'app/redux/classes/students/Address'
/**
 * @param {{disabled: boolean, address: Address, onChange: ({target:{name: string, value: Address}})=>void }} props 
 */
const VisitorAddressForm = props => {
    const [state, setState] = React.useState({
        vill: '',
        po: '',
        ps: '',
        block: '',
        dist: '',
        state: '',
        pin: '',
    })

    React.useEffect(() => {
        const p = props.address
        if (p && isNotEqual(state, p, ['vill', 'po', 'ps', 'block', 'dist', 'state', 'pin'])
            && isAllFilled(p.vill, p.po, p.ps, p.block, p.dist, p.state, p.pin)) {
            // alert(JSON.stringify(p))
            setState(p)
        }
    }, [props])

    React.useEffect(() => {
        const s = state
        if (isNotEqual(state, props.address, ['vill', 'po', 'ps', 'block', 'dist', 'state', 'pin'])
            && isAllFilled(s.vill, s.po, s.ps, s.block, s.dist, s.state, s.pin)) {
            props.onChange({ target: { name: 'address', value: state } })
        }
    }, [state])

    const [pos, setPos] = React.useState([])

    const [blocks, setBlocks] = React.useState([])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
        if (!props.disabled && event.target.name === 'pin') {
            searchByPin(event.target.value).then(pos => {
                if (pos) {
                    setPos(pos.map(p => p.po))
                    const blocks = []
                    pos.forEach(p => {
                        if (!blocks.includes(p.block)) {
                            blocks.push(p.block)
                        }
                    })
                    setBlocks(blocks.sort((a, b) => a.localeCompare(b)))
                    setState({ ...state, ...pos[0], pin: event.target.value })
                }
            })
        }
    }

    return (
        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
                disabled={Boolean(props.disabled)}
                label="Village"
                type="text"
                name="vill"
                id="standard-basic"
                onChange={handleChange}
                value={state.vill || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                disabled={Boolean(props.disabled)}
                label="Police station"
                type="text"
                name="ps"
                id="standard-basic"
                onChange={handleChange}
                value={state.ps || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                disabled={Boolean(props.disabled)}
                label="Pin code"
                type="number"
                name="pin"
                id="standard-basic"
                onChange={handleChange}
                value={`${state.pin}` || ''}
                validators={[
                    'required',
                    'minStringLength: 6',
                    'maxStringLength: 6',
                ]}
                errorMessages={[
                    'this field is required',
                    'this must be a 6 digit number',
                    'this must be a 6 digit number',
                ]}
            />
            <Autocomplete
                disabled={Boolean(props.disabled)}
                id="free-solo-demo"
                freeSolo
                options={pos}
                name='po'
                value={state.po || ''}
                onSelect={handleChange}
                renderInput={(params) =>
                    <TextField
                        disabled={Boolean(props.disabled)}
                        {...params}
                        label="Post office"
                        type="text"
                        name="po"
                        id="standard-basic"
                        onChange={handleChange}
                        value={state.po || ''}
                        validators={[
                            'required',
                        ]}
                        errorMessages={['this field is required']}
                    />
                } />
            <Autocomplete
                disabled={Boolean(props.disabled)}
                id="free-solo-demo"
                freeSolo
                options={blocks}
                name="block"
                value={state.block || ''}
                onSelect={handleChange}
                renderInput={(params) =>
                    <TextField
                        disabled={Boolean(props.disabled)}
                        {...params}
                        label="Block"
                        type="text"
                        name="block"
                        id="standard-basic"
                        onChange={handleChange}
                        value={state.block || ''}
                        validators={[
                            'required',
                        ]}
                        errorMessages={['this field is required']}
                    />
                } />
            <TextField
                disabled={Boolean(props.disabled)}
                label="District"
                type="text"
                name="dist"
                id="standard-basic"
                onChange={handleChange}
                value={state.dist || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                disabled={Boolean(props.disabled)}
                label="State"
                type="text"
                name="state"
                id="standard-basic"
                onChange={handleChange}
                value={state.state || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
        </Grid>
    )
}

export default VisitorAddressForm
