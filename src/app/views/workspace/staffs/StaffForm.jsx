import { Button, Icon } from '@mui/material'
import { Span } from 'app/components/Typography'
import React, { Fragment } from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { useNavigate, useParams } from 'react-router-dom'
import ContentBox from '../styledcomponents/ContentBox'
import { Box } from '@mui/system'
import NecessaryDetailsForm from './NecessaryDetailsForm'
import OtherDetailsForm from './OtherDetailsForm'
import AddressForm from './AddressForm'
import BankDetailsForm from './BankDetailsForm'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import Staff from 'app/redux/classes/staffs/Staff'
import { useStaffs } from 'app/redux/classes/staffs/Staffs'
import PrivilegeForm from './PrivilegeForm'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import ShowInAttendanceListForm from './ShowInAttendanceListForm'

const StaffForm = () => {
    const { docid } = useParams()
    const staffs = useStaffs()
    const [state, setState] = React.useState({ ...new Staff().json(), edit: false })

    React.useEffect(() => {
        if (docid !== 'new' && !state.regno) {
            const staff = staffs.list.find(s => s.docref.id === docid)
            if (staff && staff.regno && staff.regno !== state.regno) {
                setState({ ...staff.json(), edit: true })
            }
        }
    }, [docid])

    const snackbarControl = useSnackbarControl()
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        if (state.edit) {
            await staffs.update(docid, state,
                () => {
                    snackbarControl.show('Successfully updated')
                    navigate('/staffs')
                },
                () => {
                    snackbarControl.show('Error: Unable to save')
                }
            )
        } else {
            await staffs.insert(state,
                () => {
                    snackbarControl.show('Successfully created')
                    navigate('/staffs')
                },
                () => {
                    snackbarControl.show('Error: Unable to save')
                }
            )
        }
    }

    ///Some fields need password confirmation while updating.
    ///This function will ensure that.
    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        if (state.edit) {
            confirmOnPassword.askForConfirmation(func)
        } else {
            func()
        }
    }

    return (
        <Fragment>
            <ValidatorForm onSubmit={() => confirm(handleSubmit)} onError={errors => alert(JSON.stringify(errors))}>
                <NecessaryDetailsForm
                    title='Section-A: Necessary Details'
                    staff={state}
                    edit={state.edit}
                    onChange={s => setState({ ...state, ...s })}
                />
                <OtherDetailsForm
                    title='Section-B: Other details'
                    staff={state}
                    edit={state.edit}
                    onChange={s => setState({ ...state, ...s })}
                />
                <AddressForm
                    title='Section-C: Permanent Address'
                    edit={state.edit}
                    address={{ addressPermanent: state.addressPermanent, addressPresent: state.addressPresent }}
                    onChange={s => setState({ ...state, ...s })}
                />
                <BankDetailsForm
                    title='Section-D: Bank A/C Details'
                    bankAccount={state.bankAccount}
                    edit={state.edit}
                    onChange={bankAccount => setState({ ...state, bankAccount })}
                />
                <PrivilegeForm
                    title='Section-E: User Privileges'
                    privilege={state.privilege}
                    onChange={privilege => setState({ ...state, privilege })}
                />
                <ShowInAttendanceListForm
                    showInAttendanceList={state.showInAttendanceList}
                    onChange={showInAttendanceList => setState({ ...state, showInAttendanceList })}
                    nickname={state.nickname}
                    onNicknameChange={nickname => setState({ ...state, nickname })}
                />
                <ContentBox>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button color="primary" variant="contained" type="submit">
                            <Icon>send</Icon>
                            <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                Submit
                            </Span>
                        </Button>
                    </Box>
                </ContentBox>
            </ValidatorForm>
        </Fragment>
    )
}

export default StaffForm