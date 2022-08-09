import * as React from 'react'
import { Avatar, Menu, MenuItem, Divider, ListItemIcon, Icon } from '@mui/material'
import { NavLink } from 'react-router-dom'

const StudentMenu = ({ url, anchorEl, studentdocid, onClose, recentlyModified, onDelete }) => {
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
            <NavLink to={`/icard/${studentdocid}`}>
                <MenuItem>
                    <Avatar src={url} /> ICard
                </MenuItem>
            </NavLink>
            <Divider />
            <NavLink to={`/documents/${studentdocid}`}>
                <MenuItem>
                    <ListItemIcon>
                        <Icon>extension</Icon>
                    </ListItemIcon>
                    Documents
                </MenuItem>
            </NavLink>
            <NavLink to={`/students/entry/${studentdocid}`}>
                <MenuItem>
                    <ListItemIcon>
                        <Icon>edit</Icon>
                    </ListItemIcon>
                    Edit
                </MenuItem>
            </NavLink>
            <NavLink to={`/students/view-pdf/${studentdocid}`}>
                <MenuItem>
                    <ListItemIcon>
                        <Icon>assignment</Icon>
                    </ListItemIcon>
                    View
                </MenuItem>
            </NavLink>
            {
                !recentlyModified &&
                <MenuItem onClick={onDelete}>
                    <ListItemIcon>
                        <Icon>delete</Icon>
                    </ListItemIcon>
                    Delete
                </MenuItem>
            }
        </Menu>
    )
}

export default StudentMenu