import { Button, Icon } from '@mui/material'
import { Span } from 'app/components/Typography'
import { useStudents } from 'app/redux/classes/students/Students'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import { useUser } from 'app/redux/classes/User'
import React, { Fragment } from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { useNavigate, useParams } from 'react-router-dom'
import NecessaryDetailsForm from './NecessaryDetailsForm'
import StudentDetailsForm from './StudentDetailsForm'
import ContentBox from '../styledcomponents/ContentBox'
import { Box } from '@mui/system'
import AddressForm from './AddressForm'
import ParentsForm from './ParentsForm'
import BankDetailsForm from './BankDetailsForm'
import LastBoardExamForm from './LastBoardExamForm'
import FamilyMemberInMissionForm from './FamilyMemberInMissionForm'
import SiblingsStudyingInMissionForm from './SiblingsStudyingInMissionForm'
import { pclasses } from 'app/redux/classes/Constants'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import Visitor1EntryForm from './Visitor1EntryForm'
import Visitor2EntryForm from './Visitor2EntryForm'
import { useFees } from 'app/redux/classes/fees/Fees'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'

const StudentEntryForm = () => {
    const { docid } = useParams()
    const students = useStudents()
    const [state, setState] = React.useState({ edit: false })

    const user = useUser()
    const selectedStudent = useSelectedStudent()

    const fees = useFees()

    React.useEffect(() => {
        if (docid === 'new') {
            selectedStudent.set(null)
            setState({ edit: false, pclass: students.pclass })
        } else {
            const student = students.list.find(s => s.docref.id === docid)
            if (student) {
                fees.fetch(user.subscriberdocid, student.sessionFrom)
                    .then(() => {
                        students.setHeaders(user.subscriberdocid, student.sessionFrom, student.pclass)
                        setState({ ...student, edit: true })
                        selectedStudent.set(student)
                    })
            } else {
                selectedStudent.set(null)
                setState({ edit: false })
            }
        }
    }, [docid])

    const snackbarControl = useSnackbarControl()
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        if (state.edit) {
            await students.update(selectedStudent.student, state,
                () => {
                    snackbarControl.show('Successfully updated')
                    navigate('/students')
                },
                () => {
                    snackbarControl.show('Error: Unable to save')
                }
            )
        } else {
            await students.insert(user.subscriberdocid, state,
                () => {
                    snackbarControl.show('Successfully created')
                    navigate('/students')
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
                <NecessaryDetailsForm confirm={confirm} edit={state.edit}
                    onChange={s => {
                        // console.log('x1')
                        setState({ ...state, ...s })
                    }}
                />
                <StudentDetailsForm confirm={confirm} edit={state.edit}
                    onChange={s => {
                        // console.log('x2')
                        setState({ ...state, ...s })
                    }}
                    pclass={state.pclass || 'V'}
                />
                <AddressForm edit={state.edit}
                    onChange={s => {
                        // console.log('x3')
                        setState({ ...state, ...s })
                    }}
                />
                <ParentsForm mobile={state.mobile} edit={state.edit}
                    onChange={s => {
                        // console.log('x4')
                        setState({ ...state, ...s })
                    }}
                />
                <Visitor1EntryForm
                    mobile={state.mobile}
                    addressPresent={state.addressPresent}
                    addressPermanent={state.addressPermanent}
                    edit={state.edit}
                    onChange={s => {
                        // console.log('x5')
                        setState({ ...state, ...s })
                    }} />
                <Visitor2EntryForm
                    mobile={state.mobile}
                    addressPresent={state.addressPresent}
                    addressPermanent={state.addressPermanent}
                    edit={state.edit}
                    onChange={s => {
                        // console.log('x6')
                        setState({ ...state, ...s })
                    }}
                />
                <BankDetailsForm bankAccount={state.bankAccount} edit={state.edit}
                    onChange={s => {
                        // console.log('x7')
                        setState({ ...state, ...s })
                    }}
                />
                {
                    state && state.pclass && pclasses.findIndex(p => state.pclass === p) > pclasses.findIndex(p => 'X' === p) &&
                    <LastBoardExamForm confirm={confirm} edit={state.edit}
                        onChange={s => {
                            // console.log('x8')
                            setState({ ...state, ...s })
                        }}
                    />
                }
                <FamilyMemberInMissionForm confirm={confirm} edit={state.edit}
                    onChange={s => {
                        // console.log('x9')
                        setState({ ...state, ...s })
                    }}
                />
                <SiblingsStudyingInMissionForm confirm={confirm} edit={state.edit}
                    onChange={s => {
                        // console.log('x10')
                        setState({ ...state, ...s })
                    }}
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

export default StudentEntryForm
