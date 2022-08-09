import React from 'react'
import { Autocomplete, Checkbox, FormControlLabel, FormGroup, Grid } from '@mui/material'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import VisitorAddressForm from './VisitorAddressForm'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import Address from 'app/redux/classes/students/Address'
import { isAllFilled } from 'app/redux/classes/EqualityChecker'
import { nonParentRelationships } from 'app/redux/classes/Constants'
import { searchGenderByName } from './ApiCalls'
/**
 * @param {{mobile:number,addressPresent: Address, addressPermanent: Address, edit: boolean, onChange: (state: any)=>void }} props 
 */
const Visitor2EntryForm = (props) => {
    const [state, setState] = React.useState({
        name: '',
        relation: '',
        mobile: '',
        email: '',
        address: {},
    })

    React.useEffect(() => {
        if (!state.mobile && props.mobile) {
            setState({ ...state, mobile: `${props.mobile}` })
        }
    }, [props])

    const [enabled, setEnabled] = React.useState(false)

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            if (student.visitor2) {
                setEnabled(true)
                setState({
                    name: student && student.visitor2 && student.visitor2.name ? student.visitor2.name : '',
                    relation: student && student.visitor2 && student.visitor2.relation ? student.visitor2.relation + '' : '',
                    mobile: student && student.visitor2 && student.visitor2.mobile ? `${student.visitor2.mobile}` : '',
                    email: student && student.visitor2 && student.visitor2.email ? student.visitor2.email : '',
                    address: student && student.visitor2 && student.visitor2.address ? student.visitor2.address.json() : {},
                })
            }
        }
    }, [selectedStudent])

    React.useEffect(() => {
        (async () => {
            if (!enabled) {
                props.onChange({ visitor2: null })
                if (!ok) setOk(!ok)
                return
            }
            const s = state
            const a = s.address
            if (s && a && isAllFilled(s.name, s.relation, s.mobile, a.vill, a.po, a.ps, a.block, a.dist, a.state, a.pin)) {
                props.onChange({ visitor2: state })
                if (!ok) setOk(!ok)
            } else {
                if (ok) setOk(!ok)
            }
        })()
    }, [state])

    const [ok, setOk] = React.useState(false)
    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
        if (event.target.name === 'name') {
            searchGenderByName(event.target.value).then(gender => {
                if (gender === 'MALE') {
                    setState({ ...state, name: event.target.value, relation: 'UNCLE (PATERNAL)' })
                } else {
                    setState({ ...state, name: event.target.value, relation: 'AUNT (PATERNAL)' })
                }
            })
        }
    }

    const [addressType, setAddressType] = React.useState(null)//'PRESENT'|'PERMANENT'

    React.useEffect(() => {
        setState(
            props.addressPermanent && addressType === 'PERMANENT' ? { ...state, address: props.addressPermanent }
                : props.addressPresent && addressType === 'PRESENT' ? { ...state, address: props.addressPresent }
                    : props.edit && selectedStudent && selectedStudent.student && selectedStudent.student.visitor2
                        ? { ...state, address: selectedStudent.student.visitor2.address }
                        : {}
        )
    }, [addressType])

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <FormGroup row>
                    <FormControlLabel
                        sx={ok ? { color: '#00aa66' } : enabled ? { color: '#dd3366' } : {}}
                        defaultValue={enabled}
                        onChange={() => setEnabled(!enabled)}
                        control={<Checkbox checked={enabled} />}
                        label='Visitor-2 information'
                    />
                </FormGroup>
                {
                    !enabled
                        ? <></>
                        :
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Name"
                                    type="text"
                                    name="name"
                                    id="standard-basic"
                                    onChange={handleChange}
                                    value={state.name || ''}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={['this field is required']}
                                />
                                <Autocomplete
                                    id="free-solo-demo"
                                    freeSolo
                                    options={nonParentRelationships}
                                    name='relation'
                                    value={state.relation || ''}
                                    onSelect={handleChange}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label='Relation'
                                            type="text"
                                            name="relation"
                                            id="standard-basic"
                                            onChange={handleChange}
                                            value={state.relation || ''}
                                            validators={[
                                                'required',
                                            ]}
                                            errorMessages={['this field is required']}
                                        />
                                    } />
                                <TextField
                                    label="Mobile no."
                                    type="number"
                                    name="mobile"
                                    id="standard-basic"
                                    onChange={handleChange}
                                    value={state.mobile || ''}
                                    validators={[
                                        'required',
                                        'minStringLength: 10',
                                        'maxStringLength: 10',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                        'this must be a 10 digit number',
                                        'this must be a 10 digit number',
                                    ]}
                                />
                                <TextField
                                    label="Email id"
                                    type="email"
                                    name="email"
                                    id="standard-basic"
                                    onChange={handleChange}
                                    value={state.email || ''}
                                />
                                <FormGroup row>
                                    {
                                        props.addressPermanent &&
                                        <FormControlLabel
                                            defaultValue={addressType === 'PERMANENT'}
                                            onChange={() => setAddressType(addressType !== 'PERMANENT' ? 'PERMANENT' : null)}
                                            control={<Checkbox checked={addressType === 'PERMANENT'} />}
                                            label='Visitor-2 address is same as PERMANENT Address'
                                        />
                                    }
                                    {
                                        props.addressPresent &&
                                        <FormControlLabel
                                            defaultValue={addressType === 'PRESENT'}
                                            onChange={() => setAddressType(addressType !== 'PRESENT' ? 'PRESENT' : null)}
                                            control={<Checkbox checked={addressType === 'PRESENT'} />}
                                            label='Visitor-2 address is same as PRESENT Address'
                                        />
                                    }
                                </FormGroup>
                            </Grid>
                            <VisitorAddressForm
                                disabled={addressType}
                                address={state.address}
                                onChange={handleChange}
                            />
                        </Grid>
                }
            </StyledCard>
        </ContentBox>
    )
}

export default Visitor2EntryForm
