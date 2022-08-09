import { Grid } from '@mui/material'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import React from 'react'
import TextField from '../styledcomponents/TextField'

/**
 * @param {{mobile:number, edit: boolean, onChange: (state: any)=>void }} props 
 */
const ParentsMotherForm = props => {
    const [state, setState] = React.useState({
        name: '',
        aadhar: '',
        qualification: '',
        occupation: '',
        annualIncome: '',
        mobile: '',
    })

    React.useEffect(() => {
        if (!state.mobile && props.mobile) {
            setState({ ...state, mobile: `${props.mobile}` })
        }
    }, [props])

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState({
                name: student && student.mother && student.mother.name ? student.mother.name : '',
                aadhar: student && student.mother && student.mother.aadhar ? student.mother.aadhar + '' : '',
                qualification: student && student.mother && student.mother.qualification ? student.mother.qualification : '',
                occupation: student && student.mother && student.mother.occupation ? student.mother.occupation : '',
                annualIncome: student && student.mother && student.mother.annualIncome ? student.mother.annualIncome + '' : '0',
                mobile: student && student.mother && student.mother.mobile ? student.mother.mobile + '' : '',
            })
        }
    }, [selectedStudent])

    React.useEffect(() => {
        props.onChange({ mother: state })
    }, [state])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    return (
        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
                label="Mother's name"
                type="text"
                name="name"
                id="standard-basic-mname"
                onChange={handleChange}
                value={state.name || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Mother's AADHAR no"
                type="number"
                name="aadhar"
                id="standard-basic-maadhar"
                onChange={handleChange}
                value={state.aadhar || ''}
                validators={[
                    'required',
                    'minStringLength: 12',
                    'maxStringLength: 12',
                ]}
                errorMessages={[
                    'this field is required',
                    'this must be a 12 digit number',
                    'this must be a 12 digit number',
                ]}
            />
            <TextField
                label="Mother's qualification"
                type="text"
                name="qualification"
                id="standard-basic-mqualification"
                onChange={handleChange}
                value={state.qualification || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Mother's occupation"
                type="text"
                name="occupation"
                id="standard-basic-moccupation"
                onChange={handleChange}
                value={state.occupation || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Mother's annual income"
                type="number"
                name="annualIncome"
                id="standard-basic-mannualIncome"
                onChange={handleChange}
                value={state.annualIncome || ''}
                validators={[
                    'required',
                    'minStringLength: 1',
                ]}
                errorMessages={[
                    'this field is required',
                    'this must be a number',
                ]}
            />
            <TextField
                label="Mother's mobile no"
                type="number"
                name="mobile"
                id="standard-basic-mmobile"
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

        </Grid>
    )
}

export default ParentsMotherForm
