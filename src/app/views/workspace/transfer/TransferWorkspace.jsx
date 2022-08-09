import { Box, Button, FormControl, Icon, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Span } from 'app/components/Typography'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import { useUser } from 'app/redux/classes/User'
import Student from 'app/redux/classes/students/Student'
import React from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator'
import TableSkeleton from '../skeleton/TableSkeleton'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import TopBar from './TopBar'
import Card from './Card'
import { useInstitutes } from 'app/redux/classes/Institutes'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'

const TransferWorkspace = props => {
    const [sessionFrom, setSessionFrom] = React.useState(new Date().getFullYear())
    const topbarControl = useTopbarControl()
    const [busy, setBusy] = React.useState(false)

    React.useEffect(() => {
        topbarControl.setControlBox(
            <TopBar
                disabled={busy}
                onSessionChange={sf => {
                    if (sessionFrom !== sf) setSessionFrom(sf)
                }}
            />
        )
    }, [busy])

    const [regno, setRegno] = React.useState('')

    const [student, setStudent] = React.useState(null)

    const user = useUser()

    const searchStudent = () => {
        setStudent(null)
        const newStudent = new Student()
        setBusy(true)
        newStudent.search(user.subscriberdocid, regno, sessionFrom).finally(() => {
            if (newStudent.docref) {
                setStudent(newStudent)
            }
            setBusy(false)
        })
    }

    const [transferTo, setTransferTo] = React.useState(user.subscriberdocid)
    const institutes = useInstitutes()
    React.useEffect(() => {
        if (!institutes.loaded) {
            institutes.load()
        }
    }, [institutes])

    const snackbarControl = useSnackbarControl()
    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }

    const submitTransfer = () => {
        if (student) {
            student.transferTo(transferTo,
                () => {
                    setStudent(null)
                    snackbarControl.show('Successfully transfrerred.')
                },
                () => {
                    snackbarControl.show('Unable to transfrerred..!')
                }
            )
        }
    }

    return (
        <ContentBox>
            {
                busy
                    ?
                    <TableSkeleton cols={3} rows={3} />
                    :
                    <StyledCard>
                        <ValidatorForm
                            onSubmit={searchStudent}
                            onError={errors => alert(JSON.stringify(errors))}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
                                <TextField
                                    label="Registration number"
                                    type="text"
                                    name="regno"
                                    onChange={e => setRegno(e.target.value)}
                                    value={regno || ''}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    fullWidth
                                    autoFocus
                                />
                                <Button color="primary" variant="contained" type="submit"
                                    sx={{ py: 1.5 }}
                                    disabled={!Boolean(regno)}
                                >
                                    <Icon>search</Icon>
                                    <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                        Search
                                    </Span>
                                </Button>
                            </Box>
                        </ValidatorForm>
                        {
                            student
                                ?
                                <>
                                    <Card student={student} />
                                    <Box sx={{ m: 2, p: 2, background: '#aa2255', borderRadius: 1 }}>
                                        <Typography sx={{ color: '#fff', fontSize: 15 }}>
                                            WARNING!
                                            If you transfer this student, then all the information of this student
                                            will be deleted from this institute; and this process cannot be reversed.
                                        </Typography>
                                        <Box
                                            sx={{
                                                m: 2, p: 2, background: '#aa6699', borderRadius: 2,
                                                display: 'flex', flexDirection: 'row'
                                            }}
                                        >
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Where to transfer?</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    label='Where to transfer?'
                                                    sx={{ mr: 1 }}
                                                    id="select-transferTo"
                                                    name='transferTo'
                                                    value={transferTo}
                                                    onChange={e => setTransferTo(e.target.value)}
                                                >
                                                    {
                                                        institutes.list
                                                            .filter(i => i.subscriberdocid !== user.subscriberdocid)
                                                            .map(i => (
                                                                <MenuItem
                                                                    key={i.subscriberdocid}
                                                                    value={i.subscriberdocid}
                                                                >
                                                                    {i.institute}, Branch: {i.branch}, Dist.: {i.district}
                                                                </MenuItem>
                                                            ))
                                                    }
                                                </Select>
                                            </FormControl>
                                            <Button color="error" variant="contained"
                                                sx={{ py: 1.5 }}
                                                onClick={() => confirm(submitTransfer)}
                                            >
                                                <Icon>send</Icon>
                                                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                                    Transfer
                                                </Span>
                                            </Button>
                                        </Box>
                                    </Box>
                                </>
                                : <></>
                        }
                    </StyledCard>
            }

        </ContentBox>
    )
}

export default TransferWorkspace