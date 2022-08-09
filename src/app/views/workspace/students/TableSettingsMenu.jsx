import * as React from 'react'
import { Menu, MenuItem, Divider, ListItemIcon, Icon } from '@mui/material'
import { useNotificationBarControl } from 'app/redux/classes/controls/NotificationBarControl'
const TableSettingsMenu = ({ anchorEl, onClose }) => {
    const notificationBarControl = useNotificationBarControl()
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
            <MenuItem onClick={() => notificationBarControl.setopen(true)}>
                <ListItemIcon>
                    <Icon>view_column</Icon>
                </ListItemIcon>
                Columns
            </MenuItem>
            <Divider />
            <MenuItem>
                <ListItemIcon>
                    <Icon>badge</Icon>
                </ListItemIcon>
                ICards
            </MenuItem>
        </Menu>
    )
}

export default TableSettingsMenu