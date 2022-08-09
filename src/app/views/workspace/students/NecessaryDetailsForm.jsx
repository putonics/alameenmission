import { Grid, Radio, RadioGroup, MenuItem, FormControl, FormControlLabel, FormGroup, Icon } from '@mui/material'
import { Box } from '@mui/system'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import React from 'react'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import Select from '../styledcomponents/Select'
import InputLabel from '../styledcomponents/InputLabel'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import { mediums, pclasses, streams, months } from 'app/redux/classes/Constants'
import { searchByRegno, searchGenderByName } from './ApiCalls'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import { useStudents } from 'app/redux/classes/students/Students'
import { useFees } from 'app/redux/classes/fees/Fees'

/**
 * @param {{ confirm, edit: boolean, onChange: (state: any)=>void }} props 
 * @returns 
 */
const NecessaryDetailsForm = props => {
    const students = useStudents()
    const [state, setState] = React.useState({
        regno: '',
        name: '',
        admissionDate: new Date('01-Apr-' + students.sessionFrom),
        pclass: students.pclass,
        stream: 'SCIENCE',
        medium: 'BENGALI',
        sessionFrom: '' + students.sessionFrom,
        sessionTo: '' + (students.sessionFrom + 1),
        fee: '0',
        feeStartingMonth: '3',
        mobile: '',
        whatsapp: '',
        email: '',
        status: 'ACTIVE',
        dropoutRemarks: '',
        gender: 'MALE',
    })

    //update according to topbar -info
    React.useEffect(() => {
        if (!props.edit) {
            setState({
                ...state,
                sessionFrom: `${students.sessionFrom}`,
                pclass: students.pclass,
                sessionTo: `${students.sessionFrom + 1}`,
                admissionDate: new Date(`01-Apr-${students.sessionFrom}`),
            })
        }
    }, [students])

    const feesDoc = useFees()
    const [fees, setFees] = React.useState([0])
    React.useEffect(() => {
        setFees(feesDoc.getMonthlyFees(students.pclass))
    }, [feesDoc, students])

    React.useEffect(() => {
        setState({ ...state, fee: '' + fees[0], pclass: students.pclass })
    }, [fees])

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState({
                regno: student && student.regno ? student.regno : '',
                name: student && student.name ? student.name : '',
                admissionDate: student && student.admissionDate ? new Date(student.admissionDate) : new Date('01-Jan-' + (new Date().getFullYear())),
                pclass: student && student.pclass ? student.pclass : 'V',
                stream: student && student.stream ? student.stream : 'ARTS',
                medium: student && student.medium ? student.medium : 'BENGALI',
                sessionFrom: student && student.sessionFrom ? student.sessionFrom + '' : '' + (new Date().getFullYear()),
                sessionTo: student && student.sessionTo ? student.sessionTo + '' : '' + (new Date().getFullYear()),
                fee: student && student.fee ? student.fee + '' : fees[0] + '',
                feeStartingMonth: student && student.feeStartingMonth ? student.feeStartingMonth + '' : '0',
                mobile: student && student.mobile ? student.mobile + '' : '',
                whatsapp: student && student.whatsapp ? student.whatsapp + '' : '',
                email: student && student.email ? student.email : '',
                status: student && student.status ? student.status : 'ACTIVE',
                dropoutRemarks: student && student.dropoutRemarks ? student.dropoutRemarks : '',
                gender: student && student.gender ? student.gender : 'MALE',
            })
        }
    }, [selectedStudent])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            if (state.regno && state.name.length > 4 && state.mobile.length === 10
                && parseInt(state.sessionFrom) > 2000 && parseInt(state.sessionTo) > 2000
                && (state.status === 'ACTIVE' || state.dropoutRemarks.length > 4)) {
                props.onChange(state)
                if (!ok) setOk(!ok)
            } else {
                if (ok) setOk(!ok)
            }
        })()
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
        if (!props.edit && event.target.name === 'regno' && event.target.value.length > 4) {
            searchByRegno(event.target.value).then(s => {
                if (s) {
                    setState({ ...state, regno: '' })
                    alert(`${s.regno}: ${s.name}: Class: ${s.pclass} Exists`)
                }
            })
        }
    }

    const handleDateChange = (admissionDate) => {
        setState({ ...state, admissionDate: new Date(admissionDate) })
    }

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <Box mb="12px" >
                    <Heading sx={ok ? { color: '#00aa44' } : {}}>
                        Section-A: Necessary Details
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
                            onChange={e => props.confirm(() => handleChange(e))}
                            value={state.regno || ''}
                            validators={['required']}
                            label="Registration no."
                            errorMessages={['this field is required']}
                        />
                        <TextField
                            label="Student's Name"
                            onChange={handleChange}
                            type="text"
                            name="name"
                            value={state.name || ''}
                            validators={['required']}
                            errorMessages={['this field is required']}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                inputFormat='dd/MM/yyyy'
                                value={state.admissionDate}
                                onChange={handleDateChange}
                                renderInput={(props) => (
                                    <TextField
                                        {...props}
                                        // variant="Outlined"
                                        id="mui-pickers-date"
                                        label="Admission date"
                                        sx={{ mb: 2, width: '100%' }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <FormControl sx={{ mb: 3, width: '100%' }}>
                            <InputLabel id="demo-simple-select-label">Present Class</InputLabel>
                            <Select
                                disabled={true}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='pclass'
                                value={state.pclass || ''}
                                label="Present Class"
                                onChange={e => props.confirm(() => handleChange(e))}
                                required
                            >
                                {
                                    pclasses.map(pclass => (
                                        <MenuItem
                                            key={pclass}
                                            value={pclass}
                                        >
                                            {pclass}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        {
                            state && state.pclass && pclasses.findIndex(p => state.pclass === p) > pclasses.findIndex(p => 'X' === p)
                                ?
                                <FormControl sx={{ mb: 3, width: '100%' }}>
                                    <InputLabel id="demo-simple-select-label-stream">Stream</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-stream"
                                        id="demo-simple-select-stream"
                                        name='stream'
                                        value={state.stream || ''}
                                        label="Stream"
                                        onChange={e => props.confirm(() => handleChange(e))}
                                        required
                                    >
                                        {
                                            streams.map(stream => (
                                                <MenuItem
                                                    key={stream}
                                                    value={stream}
                                                >
                                                    {stream}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                : <></>
                        }
                        <FormControl sx={{ mb: 3, width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-medium">Medium</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-medium"
                                id="demo-simple-select-medium"
                                name='medium'
                                value={state.medium || ''}
                                label="Medium"
                                onChange={e => props.confirm(() => handleChange(e))}
                                required
                            >
                                {
                                    mediums.map(medium => (
                                        <MenuItem
                                            key={medium}
                                            value={medium}
                                        >
                                            {medium}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormGroup row sx={{ gap: 2 }}>
                            <TextField
                                disabled={true}
                                sx={{ mb: 4 }}
                                label="Session From"
                                onChange={handleChange}
                                type="number"
                                name="sessionFrom"
                                value={state.sessionFrom || ''}
                                validators={[
                                    'required',
                                    'minStringLength:4',
                                    'maxStringLength: 4',
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'this should be a year',
                                    'this should be a year',
                                ]}
                            />
                            <TextField
                                sx={{ mb: 4 }}
                                label="Session To"
                                onChange={handleChange}
                                type="number"
                                name="sessionTo"
                                value={state.sessionTo || ''}
                                validators={[
                                    'required',
                                    'minStringLength:4',
                                    'maxStringLength: 4',
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'this should be a year',
                                    'this should be a year',
                                ]}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <FormControl sx={{ mb: 3, width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-fees">Monthly fees</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-fees"
                                id="demo-simple-select-fees"
                                name='fee'
                                value={state.fee || fees[0]}
                                label="Monthly fees"
                                onChange={e => props.confirm(() => handleChange(e))}
                                required
                            >
                                {
                                    fees.map(fee => (
                                        <MenuItem
                                            key={fee}
                                            value={fee}
                                        >
                                            {fee}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{ mb: 3, width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-feeStartingMonth">Fees starting month</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-feeStartingMonth"
                                id="demo-simple-select-feeStartingMonth"
                                name='feeStartingMonth'
                                value={state.feeStartingMonth || ''}
                                label="Fees starting month"
                                onChange={e => props.confirm(() => handleChange(e))}
                                required
                            >
                                {
                                    months.map((month, index) => (
                                        <MenuItem
                                            key={month}
                                            value={`${index}`}
                                        >
                                            {month}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <TextField
                            label="Mobile Nubmer"
                            onChange={handleChange}
                            name="mobile"
                            value={state.mobile || ''}
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
                            value={state.whatsapp || ''}
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
                        <TextField
                            label="Email id"
                            onChange={handleChange}
                            name="email"
                            value={state.email || ''}
                            type="email"
                        />
                        <RadioGroup
                            sx={{ mb: 2 }}
                            value={state.status || 'ACTIVE'}
                            name="status"
                            onChange={e => props.confirm(() => handleChange(e))}
                            row
                        >
                            <FormControlLabel
                                value="ACTIVE"
                                control={<Radio color="primary" />}
                                label="Active"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="DROPOUT"
                                control={<Radio color="secondary" />}
                                label="Dropout"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                        {
                            state.status === 'DROPOUT' &&
                            <TextField
                                label="Remarks of dropout"
                                onChange={handleChange}
                                type="text"
                                name="dropoutRemarks"
                                value={state.dropoutRemarks || ''}
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />
                        }
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
                    </Grid>
                </Grid>
            </StyledCard>
        </ContentBox >
    )
}

export default NecessaryDetailsForm
