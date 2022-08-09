import React from 'react'
import { Box, styled, Dialog, Button, TextField } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'

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

const DateDialog = ({ open, date, onClose, onChange }) => {

    const handleDateChange = (date) => {
        onChange(new Date(date))
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogBox>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', p: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            inputFormat='dd/MM/yyyy'
                            value={date}
                            onChange={date => handleDateChange(date)}
                            renderInput={(props) => (
                                <TextField
                                    {...props}
                                    // variant="Outlined"
                                    id="mui-pickers-date-dob"
                                    label="Payment date"
                                    sx={{ mb: 2, width: '100%' }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <Button color="success" variant='contained'
                        sx={{ mb: 2, mx: 1 }}
                        onClick={() => handleDateChange(new Date())}
                    >
                        Today
                    </Button>
                </Box>
            </DialogBox>
        </Dialog>
    )
}

export default DateDialog
