import React from 'react'
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom'
import { SettingsProvider } from 'app/contexts/SettingsContext'
import { MatxTheme } from 'app/components'
import { AllPages } from './routes/routes'
import { useUser } from 'app/redux/classes/User'
// import { uploadAdminData } from 'app/json/admin'
const App = () => {
    const all_pages = useRoutes(AllPages())
    const user = useUser()
    user.loadProfile()
    // uploadAdminData()
    return (
        <SettingsProvider>
            <MatxTheme>
                {all_pages}
                <Routes>
                    <Route path='/' element={<Navigate to="/session/signin" />} />
                </Routes>
            </MatxTheme>
        </SettingsProvider>
    )
}

export default App
