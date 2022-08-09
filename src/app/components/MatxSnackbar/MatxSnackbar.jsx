import React from 'react'
import { IconButton, Icon, Snackbar } from '@mui/material'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'

const MatxSnackbar = props => {
    const snackbarControl = useSnackbarControl()
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={snackbarControl.visible}
            autoHideDuration={6000}
            onClose={snackbarControl.hide}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{snackbarControl.message}</span>}
            action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={snackbarControl.hide}
                >
                    <Icon>close</Icon>
                </IconButton>,
            ]}
        />
    )
}

export default MatxSnackbar
