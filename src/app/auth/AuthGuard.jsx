import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from 'app/redux/classes/User'

const AuthGuard = ({ children }) => {
    const user = useUser()
    const redirect = useNavigate()
    return <>{user.loggedin ? children : redirect("/session/signin")}</>;
}

export default AuthGuard
