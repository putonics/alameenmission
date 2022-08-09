import React from 'react'
import { Grid, Icon, Box } from '@mui/material'
import BankAccount from 'app/redux/classes/students/BankAccount'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import { searchByIfsc } from '../students/ApiCalls'

/**
 * @param {{bankAccount: BankAccount, edit: boolean, onChange: (bankAccount: BankAccount)=>void, title: string }} props 
 */
const BankDetailsForm = props => {
    const [state, setState] = React.useState(props.bankAccount)

    React.useEffect(() => {
        if (props.edit && !BankAccount.equals(state, props.bankAccount)) {
            setState(props.bankAccount)
        }
    }, [props])


    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            if (BankAccount.isValid(state)) {
                if (!BankAccount.equals(state, props.bankAccount)) props.onChange(state)
                if (!ok) setOk(!ok)
            } else {
                if (ok) setOk(!ok)
            }
        })()
    }, [state])

    const [ifscError, setIfscError] = React.useState(false)

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
        if (event.target.name === 'ifsc') {
            searchByIfsc(('' + event.target.value).toLocaleUpperCase()).then(b => {
                if (b && state.ifsc !== b.ifsc) {
                    setState({ ...state, ...b })
                    setIfscError(false)
                } else {
                    setIfscError(true)
                }
            })
        }
    }

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <Box mb="12px">
                    <Heading sx={ok ? { color: '#00aa44' } : {}}>
                        {props.title || "Section-E : Student's Bank Details"}
                        {ok && <Icon fontSize='small'>task_alt</Icon>}
                    </Heading>
                </Box>
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label="Account No."
                            type="number"
                            name="accountNo"
                            id="standard-basic-accountNo"
                            onChange={handleChange}
                            value={state.accountNo || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={['this field is required']}
                        />
                        <TextField
                            label="IFSC"
                            type="text"
                            name="ifsc"
                            id="standard-basic-ifsc"
                            onChange={handleChange}
                            value={state.ifsc || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={['this field is required']}
                        />
                        <TextField
                            label="Bank Name"
                            type="text"
                            name="bankName"
                            id="standard-basic-bankName"
                            onChange={handleChange}
                            value={state.bankName || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={['this field is required']}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label="Branch Name"
                            type="text"
                            name="branchName"
                            id="standard-basic-branchName"
                            onChange={handleChange}
                            value={state.branchName || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={['this field is required']}
                        />
                        <TextField
                            label="Branch Address"
                            type="text"
                            name="branchAddress"
                            id="standard-basic-branchAddress"
                            onChange={handleChange}
                            value={state.branchAddress || ''}
                            validators={[
                                'required',
                            ]}
                            errorMessages={['this field is required']}
                        />
                        {ifscError && <h4 style={{ color: '#ff8800' }}>Warning! IFSC may wrong</h4>}
                    </Grid>
                </Grid>
            </StyledCard>
        </ContentBox>
    )
}

export default BankDetailsForm
