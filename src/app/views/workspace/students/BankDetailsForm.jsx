import { Grid, Icon } from '@mui/material'
import { Box } from '@mui/system'
import { isNotEqual } from 'app/redux/classes/EqualityChecker'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import { searchByIfsc } from './ApiCalls'

/**
 * @param {{ edit: boolean, onChange: (state: any)=>void, title: string }} props 
 */
const BankDetailsForm = props => {
    const [state, setState] = React.useState({
        accountNo: '00000000000000',
        bankName: 'UNKNOWN BANK',
        branchName: 'UNKNOWN BRANCH',
        ifsc: 'UNKNOWN IFSC',
        branchAddress: 'UNKNOWN ADDRESS'
    })

    const selectedStudent = useSelectedStudent()
    React.useEffect(() => {
        if (props.edit && selectedStudent.student) {
            const student = selectedStudent.student
            setState({
                accountNo: student && student.bankAccount && student.bankAccount.accountNo ? `${student.bankAccount.accountNo}` : '',
                bankName: student && student.bankAccount && student.bankAccount.bankName ? student.bankAccount.bankName : '',
                branchName: student && student.bankAccount && student.bankAccount.branchName ? student.bankAccount.branchName : '',
                ifsc: student && student.bankAccount && student.bankAccount.ifsc ? student.bankAccount.ifsc : '',
                branchAddress: student && student.bankAccount && student.bankAccount.branchAddress ? student.bankAccount.branchAddress : ''
            })
        }
    }, [selectedStudent])


    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            if (state.accountNo.length > 9 && state.bankName && state.branchName && state.ifsc && state.branchAddress) {
                const b1 = props.bankAccount
                const b2 = state
                if (isNotEqual(b1, b2, ['accountNo', 'bankName', 'branchName', 'ifsc', 'branchAddress'])) {
                    props.onChange({ bankAccount: state })
                }
                if (!ok) setOk(!ok)
            } else {
                if (ok) setOk(!ok)
            }
        })()
    }, [state, props])

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
