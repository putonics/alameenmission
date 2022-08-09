import { Grid } from '@mui/material'
import Address from 'app/redux/classes/students/Address'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import AddressPermanentForm from './AddressPermanentForm'
import AddressPresentForm from './AddressPresentForm'
/**
 * @param {{ edit, address: {addressPermanent: Address, addressPresent: Address}, onChange: (address:any)=>{}, title: string }} props  
 */
const AddressForm = props => {
    const [state, setState] = React.useState(props.address)

    React.useEffect(() => {
        const { edit, address } = props
        if (
            edit && address && address.addressPermanent && address.addressPresent
            &&
            (
                !Address.equals(address.addressPermanent, state.addressPermanent)
                || !Address.equals(address.addressPresent, state.addressPresent)
            )
        ) {
            setState(props.address)
        }
    }, [props])

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            const { address } = props
            if (state.addressPermanent && state.addressPresent
                && Address.isValid(state.addressPermanent)
                && Address.isValid(state.addressPresent)
            ) {
                if (
                    !Address.equals(address.addressPermanent, state.addressPermanent)
                    || !Address.equals(address.addressPresent, state.addressPresent)
                ) props.onChange(state)
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
                    <AddressPermanentForm
                        title={props.title} ok={ok} edit={props.edit}
                        onChange={s => setState({ ...state, addressPermanent: s })}
                        address={state.addressPermanent}
                    />
                    <AddressPresentForm
                        ok={ok} edit={props.edit}
                        onChange={s => setState({ ...state, addressPresent: s })}
                        address={state.addressPresent}
                        addressPermanent={state.addressPermanent}
                    />
                </Grid>
            </StyledCard>
        </ContentBox>
    )
}

export default AddressForm
