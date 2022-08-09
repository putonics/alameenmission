import { Grid, Icon } from '@mui/material'
import { Box } from '@mui/system'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import ParentsFatherForm from './ParentsFatherForm'
import ParentsMotherForm from './ParentsMotherForm'

/**
 * @param {{mobile:number, edit: boolean, onChange: (state: any)=>void }} props 
 */
const ParentsForm = props => {
    const [state, setState] = React.useState({})

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState({
                father: student && student.father ? { ...student.father.json(), aadhar: student.father.json().aadhar + '', mobile: student.father.json().mobile + '', annualIncome: student.father.json().annualIncome + '' } : {},
                mother: student && student.mother ? { ...student.mother.json(), aadhar: student.mother.json().aadhar + '', mobile: student.mother.json().mobile + '', annualIncome: student.mother.json().annualIncome + '' } : {},
            })
        }
    }, [selectedStudent])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            if (state.mother && state.father
                && state.mother.name && state.mother.aadhar && state.mother.mobile
                && state.mother.qualification && state.mother.occupation
                && state.mother.annualIncome
                && state.mother.mobile.length === 10
                && state.mother.aadhar.length === 12
                && state.father.name && state.father.aadhar && state.father.mobile
                && state.father.qualification && state.father.occupation
                && state.father.annualIncome
                && state.father.mobile.length === 10
                && state.father.aadhar.length === 12
            ) {
                props.onChange(state)
                if (!ok) setOk(!ok)
            } else {
                if (ok) setOk(!ok)
            }
        })()
    }, [state])

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <Box mb="12px">
                    <Heading sx={ok ? { color: '#00aa44' } : {}}>
                        Section-D : Parent's information
                        {ok && <Icon fontSize='small'>task_alt</Icon>}
                    </Heading>
                </Box>
                <Grid container spacing={6}>
                    <ParentsFatherForm mobile={props.mobile} ok={ok} edit={props.edit} onChange={s => setState({ ...state, ...s })} />
                    <ParentsMotherForm mobile={props.mobile} ok={ok} edit={props.edit} onChange={s => setState({ ...state, ...s })} />
                </Grid>
            </StyledCard>
        </ContentBox>
    )
}

export default ParentsForm
