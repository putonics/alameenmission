import React from 'react'
import ContentBox from '../../styledcomponents/ContentBox'
import StyledCard from '../../styledcomponents/StyledCard'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import DailyClassTaken, { useDailyClassTaken } from 'app/redux/classes/staffs/classtaken/DailyClassTaken'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import TopBar from './TopBar'
import { useUser } from 'app/redux/classes/User'
import StyledTable from '../../styledcomponents/StyledTable'
import { Box, Button, Icon, IconButton, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import ClassTakenForm from './ClassTakenForm'
import ClassTaken from 'app/redux/classes/staffs/classtaken/ClassTaken'
import { Span } from 'app/components/Typography'

const DailyClassTakenForm = props => {

    const [state, setState] = React.useState(new DailyClassTaken().json())
    const snackbarControl = useSnackbarControl()
    const topbarControl = useTopbarControl()
    React.useEffect(() => {
        topbarControl.setControlBox(<TopBar />)
    }, [])

    const dct = useDailyClassTaken()
    React.useEffect(() => {
        setState(dct.json())
    }, [dct])

    const user = useUser()

    const handleSubmit = async (event) => {
        if (dct.docref) {
            await dct.update(state,
                () => {
                    snackbarControl.show('Successfully updated')
                },
                () => {
                    snackbarControl.show('Error: Unable to save')
                }
            )
        } else {
            await dct.insert(user.subscriberdocid, state,
                () => {
                    snackbarControl.show('Successfully created')
                },
                () => {
                    snackbarControl.show('Error: Unable to save')
                }
            )
        }
    }
    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }
    return (
        < ContentBox >
            <ValidatorForm onSubmit={() => confirm(handleSubmit)} onError={errors => alert(JSON.stringify(errors))}>
                <StyledCard>
                    <StyledTable>
                        <TableHead>
                            <TableRow>
                                <TableCell>Class</TableCell>
                                <TableCell>Section</TableCell>
                                <TableCell>Period-1</TableCell>
                                <TableCell>Period-2</TableCell>
                                <TableCell>Period-3</TableCell>
                                <TableCell>Period-4</TableCell>
                                <TableCell>Period-5</TableCell>
                                <TableCell>Period-6</TableCell>
                                <TableCell>Period-7</TableCell>
                                <TableCell>Period-8</TableCell>
                                <TableCell sx={{ width: '50px' }}>
                                    <IconButton color='default'
                                        onClick={() => {
                                            const newState = { ...state }
                                            const classTakens = [...state.classTakens]
                                            classTakens.push(new ClassTaken())
                                            newState.classTakens = classTakens
                                            setState(newState)
                                        }}
                                    >
                                        <Icon>add</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                state.classTakens.map((ct, i) => (
                                    <ClassTakenForm
                                        key={i}
                                        index={i}
                                        ct={ct}
                                        onChange={ct => {
                                            const newState = { ...state }
                                            const classTakens = [...state.classTakens]
                                            classTakens[i] = ct
                                            newState.classTakens = classTakens
                                            setState(newState)
                                        }}
                                        onDelete={() => {
                                            if (state.classTakens.length < 2) return
                                            const newState = { ...state }
                                            const classTakens = state.classTakens.filter((v, index) => i !== index)
                                            newState.classTakens = classTakens
                                            setState(newState)
                                        }}
                                    />
                                ))
                            }
                        </TableBody>
                    </StyledTable>
                </StyledCard>
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
        </ContentBox >
    )
}

export default DailyClassTakenForm