import { Autocomplete, Checkbox, FormControlLabel, FormGroup, Grid } from '@mui/material'
import Address from 'app/redux/classes/students/Address'
import React from 'react'
import TextField from '../styledcomponents/TextField'
import { searchByPin } from '../students/ApiCalls'

/**
 * @param {{ address: Address, edit: boolean, ok: boolean, addressPermanent: Address, onChange: (address: Address)=>void }} props  
 */
const AddressPresentForm = props => {
    const [sameAsPermanent, setSameAsPermanent] = React.useState(false)
    const [state, setState] = React.useState(props.address)

    React.useEffect(() => {
        if (props.edit && !Address.equals(props.address, state)) {
            setSameAsPermanent(false)
            setState(props.address)
        }
    }, [props])

    React.useEffect(() => {
        if (sameAsPermanent && Address.isValid(props.addressPermanent) && !Address.equals(state, props.addressPermanent)) {
            setState(props.addressPermanent)
        }
    }, [sameAsPermanent])


    React.useEffect(() => {
        if (Address.isValid(state) && !Address.equals(props.address, state)) {
            props.onChange(state)
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
        if (!sameAsPermanent && event.target.name === 'pin') {
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
            <FormGroup row>
                <FormControlLabel
                    sx={props.ok ? { color: '#00aa66' } : {}}
                    defaultValue={sameAsPermanent}
                    onChange={() => setSameAsPermanent(!sameAsPermanent)}
                    control={<Checkbox checked={sameAsPermanent} />}
                    label={`Present address ${sameAsPermanent ? '(Same as permanent)' : ''}`}
                />
            </FormGroup>
            <TextField
                disabled={sameAsPermanent}
                label="Village"
                type="text"
                name="vill"
                id="standard-basic-vill1"
                onChange={handleChange}
                value={state.vill || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                disabled={sameAsPermanent}
                label="Police station"
                type="text"
                name="ps"
                id="standard-basic-ps1"
                onChange={handleChange}
                value={state.ps || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                disabled={sameAsPermanent}
                label="Pin code"
                type="number"
                name="pin"
                id="standard-basic-pin1"
                onChange={handleChange}
                value={`${state.pin || ''}`}
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
                disabled={sameAsPermanent}
                id="free-solo-demo-pos-1"
                freeSolo
                options={pos}
                name='po'
                value={state.po || ''}
                onSelect={handleChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        disabled={sameAsPermanent}
                        label="Post office"
                        type="text"
                        name="po"
                        id="standard-basic-po1"
                        onChange={handleChange}
                        value={state.po || ''}
                        validators={[
                            'required',
                        ]}
                        errorMessages={['this field is required']}
                    />
                } />
            <Autocomplete
                disabled={sameAsPermanent}
                id="free-solo-demo-blocks1"
                freeSolo
                options={blocks}
                name="block"
                value={state.block || ''}
                onSelect={handleChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        disabled={sameAsPermanent}
                        label="Block"
                        type="text"
                        name="block"
                        id="standard-basic-block1"
                        onChange={handleChange}
                        value={state.block || ''}
                        validators={[
                            'required',
                        ]}
                        errorMessages={['this field is required']}
                    />
                } />
            <TextField
                disabled={sameAsPermanent}
                label="District"
                type="text"
                name="dist"
                id="standard-basic-dist1"
                onChange={handleChange}
                value={state.dist || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                disabled={sameAsPermanent}
                label="State"
                type="text"
                name="state"
                id="standard-basic-state1"
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

export default AddressPresentForm
