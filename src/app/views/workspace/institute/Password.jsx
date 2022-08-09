import { Box, Button, Icon, TextField } from '@mui/material'
import { Span } from 'app/components/Typography'
import { updateIntoFirestore } from 'app/firebase/Firebase'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { encryptPassword } from 'app/redux/classes/staffs/Staff'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'

const Password = props => {

    const [state, setState] = React.useState()
    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }

    const user = useUser()

    const handleSubmit = async () => {
        const password = encryptPassword(user.subscriberdocid, user.email, state)
        updateIntoFirestore(user.docref, { password: password }).then(v => {
            if (v) {
                alert('Password successfully changed')
            } else {
                alert("Unable to save data")
            }
        })
    }

    return (
        <ContentBox>
            <StyledCard>
                <ValidatorForm
                    onSubmit={() => confirm(handleSubmit)}
                    onError={errors => alert(JSON.stringify(errors))}
                >
                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                        <TextField
                            label="New password"
                            type="password"
                            name="password"
                            onChange={e => setState(e.target.value)}
                            value={state || ''}
                            validators={['required']}
                            fullWidth
                            autoFocus
                        />
                        <Button color="primary" variant="contained" type="submit" sx={{ ml: 4 }}>
                            <Icon>lock</Icon>
                            <Span sx={{ ml: 1, textTransform: 'capitalize' }}>
                                Change password
                            </Span>
                        </Button>
                    </Box>
                </ValidatorForm>
            </StyledCard>
        </ContentBox>
    )
}

export default Password