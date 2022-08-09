import { Grid } from '@mui/material'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import AddressPermanentForm from './AddressPermanentForm'
import AddressPresentForm from './AddressPresentForm'
/**
 * @param {{ edit, onChange: (address:any)=>{}, title: string }} props  
 */
const AddressForm = props => {
    const [state, setState] = React.useState({})

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState({
                addressPresent: student && student.addressPresent ? { ...student.addressPresent.json(), pin: student.addressPresent.json().pin + '' } : {},
                addressPermanent: student && student.addressPermanent ? { ...student.addressPermanent.json(), pin: student.addressPermanent.json().pin + '' } : {}
            })
        }
    }, [selectedStudent])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            if (state.addressPermanent && state.addressPresent
                && state.addressPermanent.vill && state.addressPermanent.po && state.addressPermanent.ps
                && state.addressPermanent.block && state.addressPermanent.dist && state.addressPermanent.state
                && state.addressPermanent.pin.length === 6
                && state.addressPresent.vill && state.addressPresent.po && state.addressPresent.ps
                && state.addressPresent.block && state.addressPresent.dist && state.addressPresent.state
                && state.addressPresent.pin.length === 6
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
                <Grid container spacing={6}>
                    <AddressPermanentForm title={props.title} ok={ok} edit={props.edit} onChange={s => setState({ ...state, ...s })} />
                    <AddressPresentForm ok={ok} edit={props.edit} onChange={s => setState({ ...state, ...s })}
                        addressPermanent={state.addressPermanent} />
                </Grid>
            </StyledCard>
        </ContentBox>
    )
}

export default AddressForm
