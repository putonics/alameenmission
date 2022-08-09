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
const HandicappedCertificateForm = props => {
    const [state, setState] = React.useState({
        bodyPartsName: '',
        percentage: '0',
        certificateNo: '',
        issuingAuthority: '',
        issuingDate: new Date(`01-Jan-${new Date().getFullYear()}`),
    })

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState({
                bodyPartsName: student && student.handicappedCertificate && student.handicappedCertificate.bodyPartsName ? student.handicappedCertificate.bodyPartsName : '',
                percentage: student && student.handicappedCertificate && student.handicappedCertificate.percentage ? student.handicappedCertificate.percentage + '' : '',
                certificateNo: student && student.handicappedCertificate && student.handicappedCertificate.certificateNo ? student.handicappedCertificate.certificateNo : '',
                issuingAuthority: student && student.handicappedCertificate && student.handicappedCertificate.issuingAuthority ? student.handicappedCertificate.issuingAuthority : '',
                issuingDate: student && student.handicappedCertificate && student.handicappedCertificate.issuingDate ? new Date(student.handicappedCertificate.issuingDate) : new Date(`01-Jan-${new Date().getFullYear() - 1}`),
            })
        }
    }, [selectedStudent])

    React.useEffect(() => {
        if (state.bodyPartsName.length > 2 && parseInt(state.percentage) > 0 && state.certificateNo && state.issuingAuthority) {
            props.onChange({ target: { name: 'handicappedCertificate', value: state } })
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
                <Heading>Handicapped Certificate details</Heading>
            </Box>
            <TextField
                label="Disable body part"
                type="text"
                id="standard-basic-bodyPartsName"
                onChange={handleChange}
                name="bodyPartsName"
                value={state.bodyPartsName || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Disablility percentage"
                type="number"
                id="standard-basic-percentage"
                onChange={handleChange}
                name="percentage"
                value={state.percentage || ''}
                validators={[
                    'required',
                    'minStringLength: 1',
                    'maxStringLength: 2',
                ]}
                errorMessages={[
                    'this field is required',
                    'must be number between 1 to 99',
                    'must be number between 1 to 99',
                ]}
            />
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

export default HandicappedCertificateForm
