import React from 'react'
import AuthGuard from "app/auth/AuthGuard"
import NotFound from "app/views/sessions/NotFound"
import workspaceRoutes from "app/views/workspace/WorkspaceRoutes"
import sessionRoutes from "app/views/sessions/SessionRoutes"
import MatxLayout from '../components/MatxLayout/MatxLayout'
import { useUser } from 'app/redux/classes/User'
import ConfirmationPasswordDialog from "app/views/workspace/ConfirmationPasswordDialog"
import { MatxSnackbar } from "app/components"
import PrintImageDialog from "app/views/workspace/PrintImageDialog"
import PdfImageDialog from "app/views/workspace/PdfImageDialog"
import { useFees } from "app/redux/classes/fees/Fees"

export const AllPages = () => {

  const user = useUser()
  const fees = useFees()

  React.useEffect(() => {
    if (user.loggedin) {
      fees.fetch(user.subscriberdocid)
    }
  }, [user])

  const all_routes = [
    {
      path: "/",
      element: (
        <AuthGuard>
          <MatxLayout />
          <PrintImageDialog />
          <PdfImageDialog />
          <ConfirmationPasswordDialog />
          <MatxSnackbar />
        </AuthGuard>
      ),
      children: user.loggedin ? [
        ...workspaceRoutes,
      ] : [],
    },
    ...(user.loggedin ? [] : sessionRoutes),
    {
      path: "*",
      element: <NotFound />,
    },
  ]

  return all_routes
}