import { Button, Icon } from '@mui/material'
import styledEngine from '@mui/styled-engine'
import { Span } from 'app/components/Typography'
import { useStaffs } from 'app/redux/classes/staffs/Staffs'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const StyledSpan = styledEngine('span')(({ theme }) => ({
    width: 32,
    borderRadius: 16,
    textAlign: 'center',
    marginRight: 3
}))

const TopBar = ({ startLoading = () => { }, stopLoading = () => { }, onGenderChange = (gender) => { } }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const user = useUser()
    const staffs = useStaffs()

    React.useEffect(() => {
        if (user.loggedin) {
            staffs.load(user.subscriberdocid)
        }
    }, [user])

    return (
        <>
            <Button color="primary" variant='contained'
                disabled={location.pathname.startsWith('/staffs/')}
                sx={{ ml: 2 }}
                onClick={() => navigate('/staffs/new')}
            >
                <Icon>add</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                    Add Staff
                </Span>
            </Button>
        </>
    )
}

export default TopBar