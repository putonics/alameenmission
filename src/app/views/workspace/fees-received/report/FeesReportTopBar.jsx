import { MenuItem, Select } from '@mui/material'
import styledEngine from '@mui/styled-engine'
import { useFees } from 'app/redux/classes/fees/Fees'
import { useStudents } from 'app/redux/classes/students/Students'
import { useStudentCountReports } from 'app/redux/classes/report/StudentCountReports'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const StyledSpan = styledEngine('span')(({ theme }) => ({
    width: 32,
    borderRadius: 16,
    textAlign: 'center',
    marginRight: 3
}))

const FeesReportTopBar = ({ startLoading = () => { }, stopLoading = () => { }, onGenderChange = (gender) => { } }) => {
    const [gender, setGender] = React.useState('MALE')
    React.useEffect(() => onGenderChange(gender), [gender])

    const years = [new Date().getFullYear()]
    for (let i = 0; i < 16; i++) {
        years.push(years[i] - 1)
    }
    const [pclassItems, setPclassItems] = React.useState([])

    const navigate = useNavigate()
    const user = useUser()
    const fees = useFees()
    const students = useStudents()

    const scrs = useStudentCountReports()

    const revalidate = () => {
        const pclasses = fees.getPclasses()
        setPclassItems(
            pclasses.map(pclass => {
                const tc = scrs.getTotalCount(fees.sessionFrom, pclass)
                return ({ pclass: tc.pclass, count: tc.totalCount })
            })
        )
        // setAttributes(scrs.getTotalCount(fees.sessionFrom, students.pclass))
    }

    React.useEffect(() => {
        revalidate()
    }, [students])

    let loading = false

    const loadStudents = async (pclass) => {
        if (loading) return
        loading = true
        startLoading()
        await students.load(user.subscriberdocid, fees.sessionFrom, pclass, scrs)
        stopLoading()
        revalidate()
        loading = false
    }

    const loadFees = async (sessionFrom) => {
        await fees.fetch(user.subscriberdocid, sessionFrom)
    }

    React.useEffect(() => {
        const pclasses = fees.getPclasses()
        if (pclasses.length === 0) {
            navigate('/fees')
        } else if (students.sessionFrom !== fees.sessionFrom) {
            loadStudents(pclasses[0])
        }
    }, [fees])


    return (
        <>
            <Select
                sx={{ mr: 1 }}
                id="select-year"
                name='session'
                value={`${fees.sessionFrom}`}
                label="session"
                onChange={e => loadFees(+e.target.value)}
            >
                {
                    years.map((year, index) => (
                        <MenuItem
                            key={year}
                            value={`${year}`}
                        >
                            {year}
                        </MenuItem>
                    ))
                }
            </Select>
            <Select
                sx={{ py: 0, mr: 1 }}
                id="select-class"
                name='pclass'
                value={students.pclass}
                label="pclass"
                onChange={e => loadStudents(e.target.value)}
            >
                {
                    pclassItems.map((p, index) => (
                        <MenuItem
                            key={p.pclass}
                            value={`${p.pclass}`}
                        >
                            <StyledSpan
                                style={{
                                    background: p.count > 200 ? '#00ff8855' : p.count > 0 ? '#0088ff55' : '#ff558855',
                                    // display: p.pclass === state.pclass ? 'none' : 'block'
                                }}
                            >
                                {p.count}
                            </StyledSpan>
                            {p.pclass}
                        </MenuItem>
                    ))
                }
            </Select>
            <Select
                sx={{ mr: 1 }}
                id="select-gender"
                name='gender'
                value={gender}
                label="Gender"
                onChange={e => setGender(e.target.value)}
            >
                <MenuItem value='MALE'>Male [{students.list.filter(s => s.gender === 'MALE').length}]</MenuItem>
                <MenuItem value='FEMALE'>Female [{students.list.filter(s => s.gender === 'FEMALE').length}]</MenuItem>
            </Select>
        </>
    )
}

export default FeesReportTopBar