import { Button, Icon, MenuItem, Select, Typography } from '@mui/material'
import styledEngine from '@mui/styled-engine'
import { Span } from 'app/components/Typography'
import { useFees } from 'app/redux/classes/fees/Fees'
import { useStudents } from 'app/redux/classes/students/Students'
import { useStudentCountReports } from 'app/redux/classes/report/StudentCountReports'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const StyledSpan = styledEngine('span')(({ theme }) => ({
    width: 32,
    borderRadius: 16,
    textAlign: 'center',
    marginRight: 3
}))

const TopBar = ({ startLoading = () => { }, stopLoading = () => { } }) => {

    const years = [new Date().getFullYear()]
    for (let i = 0; i < 16; i++) {
        years.push(years[i] - 1)
    }
    const [pclassItems, setPclassItems] = React.useState([])
    const [attributes, setAttributes] = React.useState({
        maleCount: 0,
        femaleCount: 0,
        otherCount: 0,
    })

    const navigate = useNavigate()
    const location = useLocation()
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
        setAttributes(scrs.getTotalCount(fees.sessionFrom, students.pclass))
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
        students.toogleFilterStatus('STATUS:ACTIVE')
        stopLoading()
        revalidate()
        if (students.list.length === 0 && location.pathname !== '/students/entry/new') {
            // navigate('/students/entry/new')
        } else if (location.pathname !== '/students') {
            navigate('/students')
        }
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
                disabled={location.pathname.startsWith('/students/entry/')}
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
                sx={{ py: 0 }}
                id="select-class"
                name='pclass'
                value={students.pclass}
                label="pclass"
                onChange={e => loadStudents(e.target.value)}
                disabled={location.pathname.startsWith('/students/entry/')}
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
            <Button color="primary" variant='contained'
                sx={{
                    ml: 2,
                    color: students.filterGender === 'GENDER:FEMALE'
                        ? '#ccc'
                        : '#000',
                    borderLeft: students.filterGender === 'GENDER:FEMALE'
                        ? '3px solid #fff'
                        : '3px solid #00ff88',
                    borderRight: students.filterGender === 'GENDER:FEMALE'
                        ? '3px solid #fff'
                        : '3px solid #00ff88'
                }}
                onClick={() => students.toogleFilterGender('GENDER:MALE')}
                disabled={location.pathname.startsWith('/students/entry/')}
            >
                <Icon fontSize='20px' sx={{ color: students.filterGender === 'GENDER:FEMALE' ? '#ccc' : '#00aaff' }} >boy</Icon>
                {/* {attributes.maleCount} */}
            </Button>
            <Button color="primary" variant='contained'
                sx={{
                    ml: 2,
                    color: students.filterGender === 'GENDER:MALE'
                        ? '#ccc'
                        : '#000',
                    borderLeft: students.filterGender === 'GENDER:MALE'
                        ? '3px solid #fff'
                        : '3px solid #00ff88',
                    borderRight: students.filterGender === 'GENDER:MALE'
                        ? '3px solid #fff'
                        : '3px solid #00ff88'
                }}
                onClick={() => students.toogleFilterGender('GENDER:FEMALE')}
                disabled={location.pathname.startsWith('/students/entry/')}
            >
                <Icon sx={{ color: students.filterGender === 'GENDER:MALE' ? '#ccc' : '#ff00aa' }} >girl</Icon>
                {/* {attributes.femaleCount} */}
            </Button>
            <Button color="primary" variant='contained'
                sx={{
                    ml: 2, flexDirection: 'column',
                }}
                onClick={() => students.toogleFilterStatus()}
                disabled={location.pathname.startsWith('/students/entry/')}
            >
                <Typography sx={{ color: '#0066ee' }}>
                    {!students.filterStatus ? 'ALL' : students.filterStatus === 'STATUS:ACTIVE' ? 'ACTIVE' : 'DROPOUT'}
                </Typography>
                <Typography sx={{ fontSize: 10, color: '#0066ee55' }}>
                    Next: {!students.filterStatus ? 'ACTIVE' : students.filterStatus === 'STATUS:ACTIVE' ? 'DROPOUT' : 'ALL'}
                </Typography>
            </Button>
            <Button color="primary" variant='contained'
                sx={{ ml: 2 }}
                onClick={() => navigate('/students/entry/new')}
                disabled={location.pathname.startsWith('/students/entry/')}
            >
                <Icon>add</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                    Add Student
                </Span>
            </Button>
        </>
    )
}

export default TopBar