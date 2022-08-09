import { Grid, MenuItem, Icon, FormControl, FormControlLabel, Checkbox } from '@mui/material'
import { Box } from '@mui/system'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import Select from '../styledcomponents/Select'
import InputLabel from '../styledcomponents/InputLabel'
import { bloodGroups, castes, orphanRemarksList, pclasses } from 'app/redux/classes/Constants'
import CasteCertificateForm from './CasteCertificateForm'
import HandicappedCertificateForm from './HandicappedCertificateForm'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import { useStudents } from 'app/redux/classes/students/Students'

/**
 * @param {{confirm, edit: boolean, pclass: string, onChange: (state: any)=>void }} props 
 */
const StudentDetailsForm = props => {
    const students = useStudents()
    const [state, setState] = React.useState({
        dob: new Date(`01-Jan-${students.sessionFrom - (pclasses.findIndex(c => c === props.pclass) + 10)}`),
        aadhar: '',
        caste: 'GENERAL',
        casteCertificate: {},
        bloodGroup: 'A+',
        handicapped: 'false',
        handicappedCertificate: {},
        orphan: 'false',
        orphanRemarks: '',
        previousBranchName: '',
        banglarsikshaId: '',
        kanyashreeId: '',
        aikyashreeId: '',
        fc: 'false',
        nc: 'false',
        studentLogin: true
    })

    //update according to topbar -info
    React.useEffect(() => {
        if (!props.edit) {
            setState({
                ...state,
                dob: new Date(`01-Jan-${students.sessionFrom - (pclasses.findIndex(c => c === students.pclass) + 5)}`)
            })
        }
    }, [students])

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState({
                dob: student && student.dob ? new Date(student.dob) : new Date(`01-Jan-${students.sessionFrom - (pclasses.findIndex(c => c === props.pclass) + 5)}`),
                aadhar: student && student.aadhar ? student.aadhar + '' : '',
                caste: student && student.caste ? student.caste : 'GENERAL',
                casteCertificate: student && student.casteCertificate ? student.casteCertificate : {},
                bloodGroup: student && student.bloodGroup ? student.bloodGroup : 'A+',
                handicapped: student && student.handicapped ? student.handicapped + '' : 'false',
                handicappedCertificate: student && student.handicappedCertificate ? student.handicappedCertificate : {},
                orphan: student && student.orphan ? student.orphan + '' : 'false',
                orphanRemarks: student && student.orphanRemarks ? student.orphanRemarks : '',
                previousBranchName: student && student.previousBranchName ? student.previousBranchName : '',
                banglarsikshaId: student && student.banglarsikshaId ? student.banglarsikshaId : '',
                kanyashreeId: student && student.kanyashreeId ? student.kanyashreeId : '',
                aikyashreeId: student && student.aikyashreeId ? student.aikyashreeId : '',
                fc: student && student.fc ? student.fc : 'false',
                nc: student && student.nc ? student.nc : 'false',
                studentLogin: student && student.studentLogin ? student.studentLogin : false,
            })
        }
    }, [selectedStudent])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            if (state.aadhar.length === 12 && (state.caste === 'GENERAL' || state.casteCertificate.certificateNo)
                && (state.handicapped === 'false' || state.handicappedCertificate.certificateNo)
                && (state.orphan === 'false' || state.orphanRemarks.length > 4)
            ) {
                props.onChange(state)
                if (!ok) setOk(!ok)
            } else {
                if (ok) setOk(!ok)
            }
        })()
    }, [state])

    const [dobError, setDobError] = React.useState(false)
    const checkDob = async () => {
        const year1 = new Date(state.dob).getFullYear()
        const year2 = new Date(`01-Jan-${students.sessionFrom - (pclasses.findIndex(c => c === props.pclass) + 5)}`).getFullYear()
        setDobError(year1 > year2)
    }
    React.useEffect(() => {
        checkDob()
    }, [props, state])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleDateChange = (dob) => {
        setState({ ...state, dob: new Date(dob) })
    }

    return (
        <>
            <ContentBox>
                <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                    <Box mb="12px">
                        <Heading sx={ok ? { color: '#00aa44' } : {}}>
                            Section-B: Student's Information Details
                            {ok && <Icon fontSize='small'>task_alt</Icon>}
                            {dobError && <span style={{ color: '#ff8800' }}>&nbsp;Warning! DOB. Class is {props.pclass}</span>}
                        </Heading>
                    </Box>
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    inputFormat='dd/MM/yyyy'
                                    value={state.dob}
                                    onChange={dob => handleDateChange(dob)}
                                    renderInput={(props) => (
                                        <TextField
                                            {...props}
                                            // variant="Outlined"
                                            id="mui-pickers-date-dob"
                                            label="Date of birth"
                                            sx={{ mb: 2, width: '100%' }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                            <TextField
                                label="Aadhar No."
                                type="number"
                                name="aadhar"
                                id="standard-basic-saadhar"
                                onChange={handleChange}
                                value={state.aadhar || ''}
                                validators={[
                                    'required',
                                    'minStringLength: 12',
                                    'maxStringLength: 12',
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'aadhar must be a 12 digit number',
                                    'aadhar must be a 12 digit number',
                                ]}
                            />
                            <FormControl sx={{ mb: 3, width: '100%' }}>
                                <InputLabel id="demo-simple-select-label">Caste</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select-scaste"
                                    name='caste'
                                    value={state.caste || 'GENERAL'}
                                    label="Caste"
                                    onChange={e => props.confirm(() => handleChange(e))}
                                    required
                                >
                                    {
                                        castes.map(caste => (
                                            <MenuItem
                                                key={caste}
                                                value={caste}
                                            >
                                                {caste}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            {
                                /*
                                casteCertificate,
                                */
                            }
                            {
                                state.caste && state.caste !== 'GENERAL' &&
                                <CasteCertificateForm edit={props.edit} onChange={handleChange} />
                            }
                            <FormControl sx={{ mb: 3, width: '100%' }}>
                                <InputLabel id="demo-simple-select-label-sbg">Blood Group</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label-sbg"
                                    id="demo-simple-select-sbg"
                                    name='bloodGroup'
                                    value={state.bloodGroup || 'A+'}
                                    label="Blood Group"
                                    onChange={handleChange}
                                    required
                                >
                                    {
                                        bloodGroups.map(bloodGroup => (
                                            <MenuItem
                                                key={bloodGroup}
                                                value={bloodGroup}
                                            >
                                                {bloodGroup}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <FormControl sx={{ mb: 3, width: '100%' }}>
                                <InputLabel id="demo-simple-select-label-shc">Handicapped</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label-shc"
                                    id="demo-simple-select-shc"
                                    name='handicapped'
                                    value={state.handicapped || 'false'}
                                    label="Handicapped"
                                    onChange={e => props.confirm(() => handleChange(e))}
                                    required
                                >
                                    <MenuItem value='true'>Yes</MenuItem>
                                    <MenuItem value='false'>No</MenuItem>
                                </Select>
                            </FormControl>
                            {
                                /*
                                handicappedCertificate,
                                */
                            }
                            {
                                state.handicapped && state.handicapped === 'true' &&
                                <HandicappedCertificateForm edit={props.edit} onChange={handleChange} />
                            }
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <FormControl sx={{ mb: 3, width: '100%' }}>
                                <InputLabel id="demo-simple-select-label-sop">Orphan</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label-sop"
                                    id="demo-simple-select-sop"
                                    name='orphan'
                                    value={state.orphan || 'false'}
                                    label="Orphan"
                                    onChange={e => props.confirm(() => handleChange(e))}
                                    required
                                >
                                    <MenuItem value='true'>Yes</MenuItem>
                                    <MenuItem value='false'>No</MenuItem>
                                </Select>
                            </FormControl>
                            {
                                /*
                                orphanRemarks,
                                */
                            }
                            {
                                state.orphan && state.orphan === 'true' &&
                                <FormControl sx={{ mb: 3, width: '100%' }}>
                                    <InputLabel id="demo-simple-select-label-swd">Who died?</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-swd"
                                        id="demo-simple-select-swd"
                                        name='orphanRemarks'
                                        value={state.orphanRemarks || 'false'}
                                        label="Who died?"
                                        onChange={handleChange}
                                        required
                                    >
                                        {
                                            orphanRemarksList.map(or => (
                                                <MenuItem key={or} value={or}>{or}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            }
                            <TextField
                                label="Previous branch name"
                                type="text"
                                id="standard-basic-spbnm"
                                onChange={handleChange}
                                name="previousBranchName"
                                value={state.previousBranchName || ''}
                                inputProps={{ style: { textTransform: "uppercase" } }}
                            />
                            <TextField
                                label="Banglarsiksha Id"
                                type="text"
                                id="standard-basic-sbsid"
                                onChange={handleChange}
                                name="banglarsikshaId"
                                value={state.banglarsikshaId || ''}
                            />
                            <TextField
                                label="Kanyashree Id"
                                type="text"
                                id="standard-basic-skid"
                                onChange={handleChange}
                                name="kanyashreeId"
                                value={state.kanyashreeId || ''}
                            />
                            <TextField
                                label="Aikyashree Id"
                                type="text"
                                id="standard-basic-akid"
                                onChange={handleChange}
                                name="aikyashreeId"
                                value={state.aikyashreeId || ''}
                            />
                            <FormControl sx={{ mb: 3, width: '100%' }}>
                                <InputLabel id="demo-simple-select-label-sfc">F.C</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label-sfc"
                                    id="demo-simple-select-sfc"
                                    name='fc'
                                    value={state.fc || 'false'}
                                    label="F.C"
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value='true'>Yes</MenuItem>
                                    <MenuItem value='false'>No</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ mb: 3, width: '100%' }}>
                                <InputLabel id="demo-simple-select-label-snc">N.C</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label-snc"
                                    id="demo-simple-select-snc"
                                    name='nc'
                                    value={state.nc || 'false'}
                                    label="N.C"
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value='true'>Yes</MenuItem>
                                    <MenuItem value='false'>No</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name='studentLogin'
                                            value={state.studentLogin}
                                            checked={state.studentLogin}
                                            onChange={() => setState({ ...state, studentLogin: !state.studentLogin })}
                                        />
                                    }
                                    label={`Student login ${state.studentLogin ? 'enabled' : 'disabled'}`}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </StyledCard>
            </ContentBox>
        </>
    )
}

export default StudentDetailsForm
