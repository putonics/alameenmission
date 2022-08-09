import { Box } from '@mui/system'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import React from 'react'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'

/**
 * @param {{ edit: boolean, onChange: (state: any)=>void }} props 
 */
const CasteCertificateForm = props => {
    const [state, setState] = React.useState({
        certificateNo: 'UNKNOWN',
        issuingAuthority: 'UNKNOWN',
        issuingDate: new Date(`01-Jan-${new Date().getFullYear() - 1}`),
    })

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState({
                certificateNo: student && student.casteCertificate && student.casteCertificate.certificateNo ? student.casteCertificate.certificateNo : 'UNKNOWN',
                issuingAuthority: student && student.casteCertificate && student.casteCertificate.issuingAuthority ? student.casteCertificate.issuingAuthority : 'UNKNOWN',
                issuingDate: student && student.casteCertificate && student.casteCertificate.issuingDate ? new Date(student.casteCertificate.issuingDate) : new Date(`01-Jan-${new Date().getFullYear() - 1}`),
            })
        }
    }, [selectedStudent])

    React.useEffect(() => {
        if (state.certificateNo.length > 2 && state.issuingAuthority.length > 2) {
            props.onChange({ target: { name: 'casteCertificate', value: state } })
        }
    }, [state])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleDateChange = (issuingDate) => {
        setState({ ...state, issuingDate: new Date(issuingDate) })
    }

    return (
        <StyledCard>
            <Box mb="12px">
                <Heading>Caste Certificate details</Heading>
            </Box>
            <TextField
                label="Certificate No."
                type="text"
                id="standard-basic-certificateNo"
                onChange={handleChange}
                name="certificateNo"
                value={state.certificateNo || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Issuing Authority"
                type="text"
                id="standard-basic-issuingAuthority"
                onChange={handleChange}
                name="issuingAuthority"
                value={state.issuingAuthority || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    inputFormat='dd/MM/yyyy'
                    value={state.issuingDate}
                    onChange={handleDateChange}
                    renderInput={(props) => (
                        <TextField
                            {...props}
                            // variant="Outlined"
                            id="mui-pickers-date"
                            label="Date of issue"
                            sx={{ mb: 2, width: '100%' }}
                        />
                    )}
                />
            </LocalizationProvider>
        </StyledCard>
    )
}

export default CasteCertificateForm
