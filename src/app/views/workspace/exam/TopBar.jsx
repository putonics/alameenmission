import { Button, Icon, MenuItem, Select } from '@mui/material'
import styledEngine from '@mui/styled-engine'
import { Span } from 'app/components/Typography'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { pclasses } from 'app/redux/classes/Constants'
import { useLocation, useNavigate } from 'react-router-dom'
import { useExams } from 'app/redux/classes/students/exam/Exams'

const StyledSpan = styledEngine('span')(({ theme }) => ({
    width: 32,
    borderRadius: 16,
    textAlign: 'center',
    marginRight: 3
}))

const TopBar = ({ startLoading = () => { }, stopLoading = () => { }, onGenderChange = (gender) => { } }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = React.useState(false)

    const [gender, setGender] = React.useState('MALE')
    React.useEffect(() => onGenderChange(gender), [gender])
    const [sessionFrom, setSessionFrom] = React.useState(new Date().getFullYear())
    const [pclass, setPclass] = React.useState(pclasses[0])

    const years = [new Date().getFullYear()]
    for (let i = 0; i < 16; i++) {
        years.push(years[i] - 1)
    }
    const user = useUser()
    const exams = useExams()

    React.useEffect(() => {
        if (user.loggedin) {
            setLoading(true)
            exams.load(user.subscriberdocid, sessionFrom, pclass, gender)
                .finally(() => setLoading(false))
        }
    }, [sessionFrom, pclass, gender, user])

    React.useEffect(() => {
        if (loading) {
            startLoading()
        } else {
            stopLoading()
        }
    }, [loading])

    return (
        <>
            <Select
                disabled={location.pathname.startsWith('/exams/') || loading}
                sx={{ mr: 1 }}
                id="select-sessionFrom"
                name='session'
                value={`${sessionFrom}`}
                label="session"
                onChange={e => setSessionFrom(+e.target.value)}
            >
                {
                    years.map((sessionFrom, index) => (
                        <MenuItem
                            key={sessionFrom}
                            value={`${sessionFrom}`}
                        >
                            {sessionFrom}
                        </MenuItem>
                    ))
                }
            </Select>
            <Select
                disabled={location.pathname.startsWith('/exams/') || loading}
                sx={{ mr: 1 }}
                id="select-pclass"
                name='pclass'
                value={`${pclass}`}
                label="pclass"
                onChange={e => setPclass(e.target.value)}
            >
                {
                    pclasses.map((pclass, index) => (
                        <MenuItem
                            key={pclass}
                            value={`${pclass}`}
                        >
                            {pclass}
                        </MenuItem>
                    ))
                }
            </Select>
            <Select
                disabled={location.pathname.startsWith('/exams/') || loading}
                sx={{ mr: 1 }}
                id="select-gender"
                name='gender'
                value={gender}
                label="Gender"
                onChange={e => setGender(e.target.value)}
            >
                <MenuItem value='MALE'>Male</MenuItem>
                <MenuItem value='FEMALE'>Female</MenuItem>
            </Select>
            <Button color="primary" variant='contained'
                disabled={location.pathname.startsWith('/exams/') || loading}
                sx={{ ml: 2 }}
                onClick={() => navigate('/exams/new')}
            >
                <Icon>add</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                    Add Exam
                </Span>
            </Button>
        </>
    )
}

export default TopBar