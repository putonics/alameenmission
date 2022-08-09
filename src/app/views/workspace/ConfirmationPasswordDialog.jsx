import React from 'react'
import { Box, styled } from '@mui/system'
import { Dialog, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, Icon } from '@mui/material'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useUser } from 'app/redux/classes/User'

const DialogBox = styled('div')(() => ({
    width: 360,
    padding: '32px',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
}))

const Title = styled('h4')(() => ({
    margin: 0,
    marginBottom: '8px',
    textTransform: 'capitalize'
}))

const Controller = styled('div')(() => ({
    margin: '8px',
    paddingTop: '8px',
    display: 'flex',
    justifyContent: 'center',
}))

const StyledButton = styled(Button)(({ theme }) => ({
    margin: '8px',
    paddingLeft: '24px',
    paddingRight: '24px',
    overflow: 'hidden',
    borderRadius: '300px',
    transition: 'all 250ms',
    '&.yesBtn': {
        '&:hover': {
            color: '#ffffff',
            background: `${theme.palette.primary.main} !important`,
            backgroundColor: `${theme.palette.primary.main} !important`,
            fallbacks: [{ color: 'white !important' }],
        }
    },
    '&.noBtn': {
        '&:hover': {
            color: '#ffffff',
            background: `${theme.palette.secondary.main} !important`,
            backgroundColor: `${theme.palette.secondary.main} !important`,
            fallbacks: [{ color: 'white !important' }],
        }
    },
}))

const ConfirmationPasswordDialog = props => {

    const confirmOnPassword = useConfirmOnPassword()
    const user = useUser()

    const [password, setPassword] = React.useState('')

    const verify = () => {
        confirmOnPassword.verify(user, password)
    }

    return (
        <Dialog maxWidth="xs"
            open={confirmOnPassword.open}
            onClose={confirmOnPassword.reset}
        >
            <DialogBox>
                <Title sx={{ color: '#cc0000', fontSize: 20 }}>Do you confirm!</Title>
                <p style={{ color: confirmOnPassword.error ? '#cc2244' : '#000' }}>
                    {
                        confirmOnPassword.error
                            ? 'Wrong password given!'
                            : 'Please confirm your submission.'
                    }
                </p>
                <Box>
                    <FormControl sx={{ m: 1, width: '30ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type='password'
                            onChange={e => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Icon>lock</Icon>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                </Box>
                <Controller>
                    <StyledButton
                        className="yesBtn"
                        variant="outlined"
                        color="primary"
                        onClick={verify}
                    >
                        Yes
                    </StyledButton>
                    <StyledButton
                        className="noBtn"
                        variant="outlined"
                        color="secondary"
                        onClick={confirmOnPassword.reset}
                    >
                        No
                    </StyledButton>
                </Controller>
            </DialogBox>
        </Dialog>
    )
}

export default ConfirmationPasswordDialog
