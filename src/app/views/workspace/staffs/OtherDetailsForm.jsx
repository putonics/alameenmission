import { Grid, MenuItem, Icon, FormControl } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import Select from '../styledcomponents/Select'
import InputLabel from '../styledcomponents/InputLabel'
import { bloodGroups, castes } from 'app/redux/classes/Constants'
import CasteCertificateForm from '../students/CasteCertificateForm'
import HandicappedCertificateForm from '../students/HandicappedCertificateForm'
import Staff from 'app/redux/classes/staffs/Staff'
import CasteCertificate from 'app/redux/classes/students/CasteCertificate'
import HandicappedCertificate from 'app/redux/classes/students/HandicappedCertificate'

const equals = (s1, s2) => Boolean(
    s1.caste === s2.caste
    && (s1.caste === 'GENERAL' || CasteCertificate.equals(s1.casteCertificate, s2.casteCertificate))
    && s1.bloodGroup === s2.bloodGroup
    && s1.handicapped + '' === s2.handicapped + ''
    && (!s1.handicapped || HandicappedCertificate.equals(s1.handicappedCertificate, s2.handicappedCertificate))
)

const isValid = (s) => Boolean(
    s.caste
    && (s.caste === 'GENERAL' || CasteCertificate.isValid(s.casteCertificate))
    && s.bloodGroup
    && (!s.handicapped || HandicappedCertificate.isValid(s.handicappedCertificate))
)

/**
 * @param {{ staff: Staff, edit: boolean, onChange: (state: any)=>void, title: string }} props 
 */
const OtherDetailsForm = props => {
    const [state, setState] = React.useState({
        caste: props.staff.caste || 'GENERAL',
        casteCertificate: props.staff.casteCertificate || {},
        bloodGroup: props.staff.bloodGroup || 'A+',
        handicapped: props.staff.handicapped || false,
        handicappedCertificate: props.staff.handicappedCertificate || {},
    })

    React.useEffect(() => {
        if (props.edit && props.staff && !equals(props.staff, state)) {
            setState({
                caste: props.staff.caste || 'GENERAL',
                casteCertificate: props.staff.casteCertificate || {},
                bloodGroup: props.staff.bloodGroup || 'A+',
                handicapped: props.staff.handicapped || false,
                handicappedCertificate: props.staff.handicappedCertificate || {},
            })
        }
    }, [props])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        setOk(isValid(state))
    }, [state])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        const newState = ({
            ...state,
            [event.target.name]: event.target.value,
        })
        if (event.target.name === 'caste' && event.target.value === 'GENERAL') {
            newState.casteCertificate = null
        }
        if (event.target.name === 'handicapped' && !event.target.value) {
            newState.handicappedCertificate = null
        }
        setState(newState)
        if (isValid(newState) && !equals(props.staff, newState)) {
            props.onChange(newState)
        }
    }

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <Box mb="12px">
                    <Heading sx={ok ? { color: '#00aa44' } : {}}>
                        {props.title || "Section-B: Other Details"}
                        {ok && <Icon fontSize='small'>task_alt</Icon>}
                    </Heading>
                </Box>
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
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
                            <InputLabel id="demo-simple-select-label">Caste</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-scaste"
                                name='caste'
                                value={state.caste || 'GENERAL'}
                                label="Caste"
                                onChange={handleChange}
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
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <FormControl sx={{ mb: 3, width: '100%' }}>
                            <InputLabel id="demo-simple-select-label-shc">Handicapped</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-shc"
                                id="demo-simple-select-shc"
                                name='handicapped'
                                value={`${state.handicapped}` || 'false'}
                                label="Handicapped"
                                onChange={handleChange}
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
                </Grid>
            </StyledCard>
        </ContentBox>
    )
}

export default OtherDetailsForm
