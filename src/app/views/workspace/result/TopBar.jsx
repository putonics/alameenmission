import { MenuItem, Select } from '@mui/material'
import styledEngine from '@mui/styled-engine'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { pclasses } from 'app/redux/classes/Constants'
import { useExams } from 'app/redux/classes/students/exam/Exams'
import Exam from 'app/redux/classes/students/result/Exam'

const StyledSpan = styledEngine('span')(({ theme }) => ({
    width: 32,
    borderRadius: 16,
    textAlign: 'center',
    marginRight: 3
}))

const TopBar = ({ startLoading = () => { }, stopLoading = () => { }, onGenderChange = (gender) => { } }) => {
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
                .finally(() => {
                    setLoading(false)
                })
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
        </>
    )
}

export default TopBar