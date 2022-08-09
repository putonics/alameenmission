import React from 'react'
import { Redirect } from 'react-router-dom'
import workspaceRoutes from './views/workspace/WorkspaceRoutes'

const redirectRoute = [
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/dashboard" />,
    },
]

const errorRoute = [
    {
        component: () => <Redirect to="/session/404" />,
    },
]

const routes = [
    ...workspaceRoutes,
    ...redirectRoute,
    ...errorRoute,
]

export default routes
