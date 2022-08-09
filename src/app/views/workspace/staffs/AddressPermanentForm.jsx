import { Box, Grid, Autocomplete, Icon } from '@mui/material'
import Address from 'app/redux/classes/students/Address'
import React from 'react'
import Heading from '../styledcomponents/Heading'
import TextField from '../styledcomponents/TextField'
import { searchByPin } from '../students/ApiCalls'
/**
 * @param {{address:Address, edit: boolean, ok: boolean, onChange: (address: Address)=>void, title: string }} props 
 */
const AddressPermanentForm = props => {
    const [state, setState] = React.useState(props.address)

    React.useEffect(() => {
        if (props.edit && !Address.equals(state, props.address)) {
            setState(props.address)
        }
    }, [props])

    React.useEffect(() => {
        if (Address.isValid(state) && !Address.equals(state, props.address)) {
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
        if (event.target.name === 'pin') {
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
            <Box mb="12px">
                <Heading sx={props.ok ? { color: '#00aa44' } : {}}>
                    {props.title || "Section-C: Permanent address"}
                    {props.ok && <Icon fontSize='small'>task_alt</Icon>}
                </Heading>
            </Box>
            <TextField
                label="Village"
                type="text"
                name="vill"
                id="standard-basic-vill2"
                onChange={handleChange}
                value={state.vill || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Police station"
                type="text"
                name="ps"
                id="standard-basic-ps2"
                onChange={handleChange}
                value={state.ps || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Pin code"
                type="number"
                name="pin"
                id="standard-basic-pin2"
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
                id="free-solo-demo-pos2"
                freeSolo
                options={pos}
                name='po'
                value={state.po || ''}
                onSelect={handleChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Post office"
                        type="text"
                        name="po"
                        id="standard-basic-po2"
                        onChange={handleChange}
                        value={state.po || ''}
                        validators={[
                            'required',
                        ]}
                        errorMessages={['this field is required']}
                    />
                } />
            <Autocomplete
                id="free-solo-demo-blocks2"
                freeSolo
                options={blocks}
                name="block"
                value={state.block || ''}
                onSelect={handleChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Block"
                        type="text"
                        name="block"
                        id="standard-basic-block2"
                        onChange={handleChange}
                        value={state.block || ''}
                        validators={[
                            'required',
                        ]}
                        errorMessages={['this field is required']}
                    />
                } />
            <TextField
                label="District"
                type="text"
                name="dist"
                id="standard-basic-dist2"
                onChange={handleChange}
                value={state.dist || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="State"
                type="text"
                name="state"
                id="standard-basic-state2"
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

export default AddressPermanentForm
