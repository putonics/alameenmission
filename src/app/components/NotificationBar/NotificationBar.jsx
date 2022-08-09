import React, { Fragment } from 'react'
import { themeShadows } from '../MatxTheme/themeColors'
import useSettings from 'app/hooks/useSettings'
import { styled, Box, useTheme } from '@mui/system'
import {
    Icon,
    Button,
    IconButton,
    Drawer,
    ThemeProvider,
    Typography,
} from '@mui/material'
import { sideNavWidth, topBarHeight } from 'app/utils/constant'
import { useNotificationBarControl } from 'app/redux/classes/controls/NotificationBarControl'

const Notification = styled('div')(() => ({
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    height: topBarHeight,
    boxShadow: themeShadows[6],
    '& h5': {
        marginLeft: '8px',
        marginTop: 0,
        marginBottom: 0,
        fontWeight: '500',
    },
}))

const NotificationCard = styled(Box)(({ theme }) => ({
    position: 'relative',
    '&:hover': {
        '& .messageTime': {
            display: 'none',
        },
        '& .deleteButton': {
            opacity: '1',
        },
    },
    '& .messageTime': {
        color: theme.palette.text.secondary,
    },
    '& .icon': { fontSize: '1.25rem' }
}))

const DeleteButton = styled(IconButton)(({ theme }) => ({
    opacity: '0',
    position: 'absolute',
    right: 5,
    marginTop: 9,
    marginRight: '24px',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const NotificationBar = ({ container }) => {
    const { settings } = useSettings()
    const theme = useTheme()
    const secondary = theme.palette.text.secondary

    const notificationBarControl = useNotificationBarControl()
    return (
        <Fragment>
            <ThemeProvider theme={settings.themes[settings.activeTheme]}>
                <Drawer
                    width={'100px'}
                    container={container}
                    variant="temporary"
                    anchor={'right'}
                    open={notificationBarControl.open}
                    onClose={() => notificationBarControl.setopen(false)}
                    ModalProps={{
                        keepMounted: true,
                    }}
                >
                    <Box sx={{ width: sideNavWidth }}>
                        <Notification>
                            <Icon color="primary">{notificationBarControl.icon}</Icon>
                            <Typography sx={{ ml: 1, fontWeight: 600, color: '#005599' }}>{notificationBarControl.title}</Typography>
                        </Notification>
                        <NotificationCard >
                            {notificationBarControl.content}
                        </NotificationCard>
                    </Box>
                </Drawer>
            </ThemeProvider>
        </Fragment>
    )
}

export default NotificationBar
