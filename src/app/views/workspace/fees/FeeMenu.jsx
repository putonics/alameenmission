import * as React from 'react'
import { Icon, Menu, MenuItem } from '@mui/material'
import { pclasses } from 'app/redux/classes/Constants'
import { useFees } from 'app/redux/classes/fees/Fees'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'

const FeeMenu = ({ anchorEl, onClose, pclass }) => {
    const fees = useFees()

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }

    const snackbarControl = useSnackbarControl()

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={onClose}
            onClick={onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 0,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {
                pclasses.filter(pc => pc !== pclass).map(pc => (
                    <MenuItem key={`menuitem${pc}`} sx={{ color: '#777777' }}
                        onClick={
                            () => confirm(() => {
                                fees.copy(
                                    pclass, pc,
                                    () => snackbarControl.show('Successfully copied'),
                                    () => snackbarControl.show('Error! unable to copy')
                                )
                            })
                        }
                    >
                        Copy from&nbsp;<span style={{ color: '#0088aa' }}>{pclass}</span>&nbsp;to&nbsp;<span style={{ color: '#ff0088' }}>{pc}</span>
                    </MenuItem>
                ))
            }
            <MenuItem
                onClick={
                    () => confirm(() => {
                        fees.delete(
                            pclass,
                            () => snackbarControl.show('Successfully deleted'),
                            () => snackbarControl.show('Error! unable to delete')
                        )
                    })
                }
            >
                <Icon>delete</Icon> Delete all fees of&nbsp;<span style={{ color: '#0088aa' }}>{pclass}</span>
            </MenuItem>
        </Menu>
    )
}

export default FeeMenu