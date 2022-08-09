import { Box, Grid, Radio, RadioGroup, FormControlLabel, Icon, Typography } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import React from 'react'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import { searchGenderByName } from '../students/ApiCalls'
import Staff from 'app/redux/classes/staffs/Staff'

const equals = (s1, s2) => Boolean(
    s1.regno === s2.regno
    && s1.name === s2.name
    && s1.designation === s2.designation
    && s1.father === s2.father
    && s1.mother === s2.mother
    && s1.mobile + '' === s2.mobile + ''
    && s1.whatsapp + '' === s2.whatsapp + ''
    && s1.email === s2.email
    && s1.password === s2.password
    && s1.role === s2.role
    && s1.status === s2.status
    && s1.gender === s2.gender
    && s1.dob + '' === s2.dob + ''
    && s1.aadhar + '' === s2.aadhar + ''
    && s1.pan === s2.pan
)

const isValid = (s) => Boolean(
    s.regno
    && s.name
    && s.designation
    && s.father
    && s.mother
    && s.mobile
    && (s.mobile + '').length === 10
    && s.email
    && s.password
    && s.role
    && s.status
    && s.gender
    && s.dob
    && s.aadhar
    && (s.aadhar + '').length === 12
    && s.pan
    && s.pan.length === 10
)

/**
 * @param {{ staff: Staff, edit: boolean, onChange: (state: any)=>void, title: string }} props 
 */
const NecessaryDetailsForm = props => {
    const [state, setState] = React.useState({
        regno: props.staff.regno || '',
        name: props.staff.name || '',
        designation: props.staff.designation || '',
        father: props.staff.father || '',
        mother: props.staff.mother || '',
        mobile: props.staff.mobile || 0,
        whatsapp: props.staff.whatsapp || 0,
        email: props.staff.email || '',
        password: props.staff.password || '',
        role: props.staff.role || 'GATEKEEPER',
        status: props.staff.status || 'ACTIVE',
        gender: props.staff.gender || 'MALE',
        dob: new Date(props.staff.dob || '01-01-2000'),
        aadhar: props.staff.aadhar || 0,
        pan: props.staff.pan || '',
    })

    React.useEffect(() => {
        if (props.edit && props.staff && !equals(props.staff, state)) {
            setState({
                regno: props.staff.regno || '',
                name: props.staff.name || '',
                designation: props.staff.designation || '',
                father: props.staff.father || '',
                mother: props.staff.mother || '',
                mobile: props.staff.mobile || 0,
                whatsapp: props.staff.whatsapp || 0,
                email: props.staff.email || '',
                password: props.staff.password || '',
                role: props.staff.role || 'GATEKEEPER',
                status: props.staff.status || 'ACTIVE',
                gender: props.staff.gender || 'MALE',
                dob: new Date(props.staff.dob || '01-01-2000'),
                aadhar: props.staff.aadhar || 0,
                pan: props.staff.pan || '',
            })
        }
    }, [props])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        if (isValid(state)) {
            if (!equals(props.staff, state)) props.onChange(state)
            if (!ok) setOk(!ok)
        } else {
            if (ok) setOk(!ok)
        }
    }, [state])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
        if (event.target.name === 'mobile' && event.target.value.length === 10 && state.whatsapp.length < 10) {
            setState({ ...state, mobile: event.target.value, whatsapp: event.target.value })
        }
        if (!props.edit && event.target.name === 'name') {
            searchGenderByName(event.target.value).then(gender => {
                if (gender !== state.gender) {
                    setState({ ...state, name: event.target.value, gender })
                }
            })
        }
    }

    const handleDateChange = (dob) => {
        setState({ ...state, dob: new Date(dob) })
    }

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <Box mb="12px" >
                    <Heading sx={ok ? { color: '#00aa44' } : {}}>
                        {props.title || "Section-A: Necessary Details"}
                        {ok && <Icon fontSize='small'>task_alt</Icon>}
                    </Heading>
                </Box>
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <TextField
                            disabled={props.edit}
                            type="text"
                            name="regno"
                            id="standard-basic"
                            onChange={handleChange}
                            value={state.regno || ''}
                            validators={['required']}
                            label="Staff id"
                            errorMessages={['this field is required']}
                        />
                        <TextField
                            label="Staff Name"
                            onChange={handleChange}
                            type="text"
                            name="name"
                            value={state.name || ''}
                            validators={['required']}
                            errorMessages={['this field is required']}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                        <TextField
                            label="Designation"
                            onChange={handleChange}
                            type="text"
                            name="designation"
                            value={state.designation || ''}
                            validators={['required']}
                            errorMessages={['this field is required']}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                        <TextField
                            label="AADHAR Nubmer"
                            onChange={handleChange}
                            name="aadhar"
                            value={`${state.aadhar || ''}`}
                            type="number"
                            validators={[
                                'required',
                                'minStringLength:12',
                                'maxStringLength:12',
                            ]}
                            errorMessages={[
                                'this field is required',
                                'this must be 12 digit number',
                                'this must be 12 digit number',
                            ]}
                        />
                        <TextField
                            label="PAN"
                            onChange={handleChange}
                            name="pan"
                            value={state.pan || ''}
                            type="text"
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            validators={[
                                'required',
                                'minStringLength:10',
                                'maxStringLength:10',
                            ]}
                            errorMessages={[
                                'this field is required',
                                'this must be 10 digit number',
                                'this must be 10 digit number',
                            ]}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                inputFormat='dd/MM/yyyy'
                                value={state.dob}
                                onChange={handleDateChange}
                                renderInput={(props) => (
                                    <TextField
                                        {...props}
                                        // variant="Outlined"
                                        id="mui-pickers-date"
                                        label="Date of birth"
                                        sx={{ mb: 2, width: '100%' }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Father's name"
                            onChange={handleChange}
                            type="text"
                            name="father"
                            value={state.father || ''}
                            validators={['required']}
                            errorMessages={['this field is required']}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                        <TextField
                            label="Mother's name"
                            onChange={handleChange}
                            type="text"
                            name="mother"
                            value={state.mother || ''}
                            validators={['required']}
                            errorMessages={['this field is required']}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label="Mobile Nubmer"
                            onChange={handleChange}
                            name="mobile"
                            value={`${state.mobile || ''}`}
                            type="number"
                            validators={[
                                'required',
                                'minStringLength:10',
                                'maxStringLength:10',
                            ]}
                            errorMessages={[
                                'this field is required',
                                'this must be 10 digit number',
                                'this must be 10 digit number',
                            ]}
                        />
                        <TextField
                            label="WhatsApp Nubmer"
                            onChange={handleChange}
                            name="whatsapp"
                            value={`${state.whatsapp || ''}`}
                            type="number"
                            validators={[
                                'minStringLength:10',
                                'maxStringLength:10',
                            ]}
                            errorMessages={[
                                'this should be 10 digit number',
                                'this should be 10 digit number',
                            ]}
                        />
                        <RadioGroup
                            sx={{ mb: 2 }}
                            value={state.role || 'GATEKEEPER'}
                            name="role"
                            onChange={handleChange}
                            row
                        >
                            <FormControlLabel
                                value="TEACHING STAFF"
                                control={<Radio color="primary" />}
                                label="Teacher"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="NON-TEACHING STAFF"
                                control={<Radio color="secondary" />}
                                label="Non-Teaching staff"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="GATEKEEPER"
                                control={<Radio color="secondary" />}
                                label="Gatekeeper"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                        <RadioGroup
                            sx={{ mb: 2 }}
                            value={state.gender || 'MALE'}
                            name="gender"
                            onChange={handleChange}
                            row
                        >
                            <FormControlLabel
                                value="MALE"
                                control={<Radio color="primary" />}
                                label="Male"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="FEMALE"
                                control={<Radio color="primary" />}
                                label="Female"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="OTHERS"
                                control={<Radio color="primary" />}
                                label="Others"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                        <Box sx={{ p: 2, border: '1px solid #dddddd', borderRadius: 4 }}>
                            <Typography sx={{ fontWeight: 700, color: '#777777', my: 2 }}>
                                Login info
                            </Typography>
                            <TextField
                                label="Email id"
                                onChange={handleChange}
                                name="email"
                                value={state.email || ''}
                                type="email"
                            />
                            <TextField
                                label="Password"
                                onChange={handleChange}
                                name="password"
                                value={state.password || ''}
                                type="password"
                            />
                            <RadioGroup
                                sx={{ mb: 2 }}
                                value={state.status || ''}
                                name="status"
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel
                                    value="ACTIVE"
                                    control={<Radio color="primary" />}
                                    label="Active"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value=""
                                    control={<Radio color="secondary" />}
                                    label="Inactive"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </Box>
                    </Grid>
                </Grid>
            </StyledCard>
        </ContentBox >
    )
}

export default NecessaryDetailsForm
