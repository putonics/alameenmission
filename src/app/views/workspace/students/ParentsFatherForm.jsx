import { Grid } from '@mui/material'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import React from 'react'
import TextField from '../styledcomponents/TextField'
/**
 * @param {{mobile:number, edit: boolean, onChange: (state: any)=>void }} props 
 */
const ParentsFatherForm = props => {
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
                name: student && student.father && student.father.name ? student.father.name : '',
                aadhar: student && student.father && student.father.aadhar ? student.father.aadhar + '' : '',
                qualification: student && student.father && student.father.qualification ? student.father.qualification : '',
                occupation: student && student.father && student.father.occupation ? student.father.occupation : '',
                annualIncome: student && student.father && student.father.annualIncome ? student.father.annualIncome + '' : '0',
                mobile: student && student.father && student.father.mobile ? student.father.mobile + '' : '',
            })
        }
    }, [selectedStudent])

    React.useEffect(() => {
        props.onChange({ father: state })
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
                label="Father's name"
                type="text"
                name="name"
                id="standard-basic-fname"
                onChange={handleChange}
                value={state.name || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Father's AADHAR no"
                type="number"
                name="aadhar"
                id="standard-basic-faadhar"
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
                label="Father's qualification"
                type="text"
                name="qualification"
                id="standard-basic-fqualification"
                onChange={handleChange}
                value={state.qualification || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Father's occupation"
                type="text"
                name="occupation"
                id="standard-basic-foccupation"
                onChange={handleChange}
                value={state.occupation || ''}
                validators={[
                    'required',
                ]}
                errorMessages={['this field is required']}
            />
            <TextField
                label="Father's annual income"
                type="number"
                name="annualIncome"
                id="standard-basic-fannualIncome"
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
                label="Father's mobile no"
                type="number"
                name="mobile"
                id="standard-basic-fmobile"
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

export default ParentsFatherForm
