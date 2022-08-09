import { Box, Button, FormControl, Icon, InputLabel, MenuItem, Select } from '@mui/material'
import styledEngine from '@mui/styled-engine'
import { Span } from 'app/components/Typography'
import { useFees } from 'app/redux/classes/fees/Fees'
import { useStudents } from 'app/redux/classes/students/Students'
import { useStudentCountReports } from 'app/redux/classes/report/StudentCountReports'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { generateCsv } from 'app/services/csv'
import { months } from 'app/redux/classes/Constants'
import ContentBox from '../../styledcomponents/ContentBox'
import StyledCard from '../../styledcomponents/StyledCard'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'

const StyledSpan = styledEngine('span')(({ theme }) => ({
    width: 32,
    borderRadius: 16,
    textAlign: 'center',
    marginRight: 3
}))

const FeesReport = ({ startLoading = () => { }, stopLoading = () => { }, onGenderChange = (gender) => { } }) => {

    const [busy, setBusy] = React.useState(false)

    const topbarControl = useTopbarControl()//redux
    React.useEffect(() => {
        topbarControl.setControlBox(<></>)
    }, [])

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


    const headings = [
        'Sl. No', 'Reg. No.', 'Name',
        'Onetime Fees (Paid)', 'Onetime fees (Due)',
        'Yearly Fees (Paid)', 'Yearly fees (Due)',
        // 'Monthly Fees (Paid)', 'Monthly fees (Due)',
    ]
    const generateReport = () => {
        const rows = []
        let monthlyHeadings = []
        students.list.filter(s => (s.gender === gender && s.status === 'ACTIVE')).forEach(student => {
            const fpis = fees.getFeePaidItems(student)
            const cols = []
            cols.push(rows.length + 1)
            cols.push(student.regno)
            cols.push(student.name)
            let opaid = 0, odue = 0
            let ypaid = 0, ydue = 0
            let mpaid = 0, mdue = 0
            const mfpis = []
            fpis.forEach(fpi => {
                if (fpi.group === 'ONETIME') {
                    if (fpi.paidon) {
                        opaid += fpi.amount
                    } else {
                        odue += fpi.amount
                    }
                } else if (fpi.group === 'YEARLY') {
                    if (fpi.paidon) {
                        ypaid += fpi.amount
                    } else {
                        ydue += fpi.amount
                    }
                } else {
                    mfpis.push(fpi)
                    if (fpi.paidon) {
                        mpaid += fpi.amount
                    } else {
                        mdue += fpi.amount
                    }
                }
            })
            cols.push(opaid)
            cols.push(odue)
            cols.push(ypaid)
            cols.push(ydue)
            mfpis.forEach(fpi => {
                // cols.push(fpi.paidon ? fpi.amount : '0')
                // if (monthlyHeadings.length < mfpis.length) {
                //     monthlyHeadings.push('MF ' + months[fpi.month % 12] + ' ' + fpi.year)
                // }
                ///--new code below
                if (!fpi.paidon) {
                    monthlyHeadings.push(months[fpi.month % 12])
                }
            })
            cols.push(monthlyHeadings.join(", "))
            monthlyHeadings = []
            cols.push(mpaid)
            cols.push(mdue)
            rows.push(cols)
        })

        generateCsv(students.pclass + '-' + gender + '-' + students.sessionFrom + '.csv',
            [...headings,
                // ...monthlyHeadings, 
                'Month dues',
                'Monthly Fees (Paid)', 'Monthly fees (Due)'],
            rows
        )
    }

    return (
        <>
            <ContentBox>
                <StyledCard>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <FormControl sx={{ mb: 3, width: '100%', mr: 1 }}>
                            <InputLabel id="demo-simple-select-label">Session</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-session"
                                name='session'
                                value={`${fees.sessionFrom}`}
                                label="Session"
                                onChange={e => loadFees(+e.target.value)}
                                required
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
                        </FormControl>
                        <FormControl sx={{ mb: 3, width: '100%', mr: 1 }}>
                            <InputLabel id="demo-simple-select-label">Class</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-pclass"
                                name='pclass'
                                value={students.pclass}
                                label="Class"
                                onChange={e => loadStudents(e.target.value)}
                                required
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
                        </FormControl>
                        <FormControl sx={{ mb: 3, width: '100%', mr: 1 }}>
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-gender"
                                name='gender'
                                value={gender}
                                label="Gender"
                                onChange={e => setGender(e.target.value)}
                                required
                            >
                                <MenuItem value='MALE'>Male [{students.list.filter(s => s.gender === 'MALE').length}]</MenuItem>
                                <MenuItem value='FEMALE'>Female [{students.list.filter(s => s.gender === 'FEMALE').length}]</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Button color="primary" variant='contained'
                            sx={{ ml: 2 }}
                            onClick={generateReport}
                            disabled={Boolean(!fees.docref || !students.list.filter(s => s.gender === gender).length)}
                        >
                            <Icon>download</Icon>
                            <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                Download Report
                            </Span>
                        </Button>
                    </Box>
                </StyledCard>
            </ContentBox>
        </>
    )
}

export default FeesReport