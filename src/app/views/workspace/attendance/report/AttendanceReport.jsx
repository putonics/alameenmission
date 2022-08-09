import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import React from 'react'
import ContentBox from '../../styledcomponents/ContentBox'
import StyledCard from '../../styledcomponents/StyledCard'
import { Button, Icon, MenuItem, Select, TextField } from '@mui/material'
import styledEngine from '@mui/styled-engine'
import { Span } from 'app/components/Typography'
import { useUser } from 'app/redux/classes/User'
import { generateCsv } from 'app/services/csv'
import {
    // months, 
    pclasses
} from 'app/redux/classes/Constants'
import { getAttendances } from 'app/redux/classes/students/attendance/Attendances'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import { onlyDate } from 'app/utils/constant'
import { format } from 'date-fns'

const StyledSpan = styledEngine('span')(({ theme }) => ({
    width: 32,
    borderRadius: 16,
    textAlign: 'center',
    marginRight: 3
}))

const AttendanceReport = props => {
    const topbarControl = useTopbarControl()//redux
    React.useEffect(() => {
        topbarControl.setControlBox(<></>)
    }, [])

    const [gender, setGender] = React.useState('MALE')
    // React.useEffect(() => onGenderChange(gender), [gender])
    const [pclass, setPclass] = React.useState(pclasses[0])

    // const [month, setMonth] = React.useState(new Date().getMonth())
    const [dtFrom, setDtFrom] = React.useState(onlyDate())
    const [dtTo, setDtTo] = React.useState(onlyDate())
    // const [year, setYear] = React.useState(onlyDate())

    // const years = [new Date().getFullYear()]
    // for (let i = 0; i < 16; i++) {
    //     years.push(years[i] - 1)
    // }
    const user = useUser()

    const generateReport = async () => {
        const headings = [
            'Class', 'Reg. No.', 'Student name',
            // dates...
        ]
        // const endDate = new Date(`01-${months[(month + 1) % 12]}-${month === 11 ? year + 1 : year}`)
        // endDate.setDate(0)
        // const end = endDate.getDate()
        // for (let i = 1; i <= end; i++) {
        //     headings.push(`${i < 10 ? '0' + i : i}-${months[month]}-${year}`)
        // }
        const lastDate = new Date(dtTo)
        lastDate.setDate(dtTo.getDate() + 1)
        for (let i = new Date(dtFrom); i.getTime() < lastDate.getTime(); i.setDate(i.getDate() + 1)) {
            headings.push(format(i, 'dd-MMM-yy'))
        }
        headings.push('Total Attendance')
        //////////////////////////////////////////////////////////////////////////
        const attendances = await getAttendances(user.subscriberdocid, gender, dtFrom.getTime(), lastDate.getTime())
        const rows = []
        if (attendances.length > 0) {
            const a = attendances[0]
            a.classWiseAttendances.filter(c => c.pclass === pclass).forEach(cwa => {
                cwa.students.forEach(s => {
                    const cols = [cwa.pclass, s.regno, s.name]
                    let total = 0
                    for (let i = new Date(dtFrom); i.getTime() < lastDate.getTime(); i.setDate(i.getDate() + 1)) {
                        const ax = attendances.find(ay => onlyDate(ay.timestamp).getTime() === i.getTime())
                        if (ax) {
                            const cwax = ax.classWiseAttendances.find(cway => cway.pclass === cwa.pclass)
                            if (cwax) {
                                const sx = cwax.students.find(sy => sy.regno === s.regno)
                                if (sx) {
                                    total += (sx.present ? 1 : 0)
                                    cols.push(sx.present ? 1 : 0)
                                } else {
                                    cols.push(0)
                                }
                            } else {
                                cols.push(0)
                            }
                        } else {
                            cols.push(0)
                        }
                    }
                    cols.push(total)
                    rows.push(cols)
                })
            })
        }
        generateCsv(`Attendance${gender}${format(dtFrom, 'ddMMMyy')}TO${format(dtTo, 'ddMMMyy')}.csv`, headings, rows)
    }

    return (
        <ContentBox>
            <StyledCard sx={{ display: 'flex', justifyContent: 'space-around' }}>
                {/* <Select
                    sx={{ mr: 1 }}
                    id="select-year"
                    name='session'
                    value={`${year}`}
                    label="session"
                    onChange={e => setYear(+e.target.value)}
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
                </Select> */}
                <Select
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
                {/* <Select
                    sx={{ mr: 1 }}
                    id="select-month"
                    name='month'
                    value={`${month}`}
                    label="month"
                    onChange={e => setMonth(+e.target.value)}
                >
                    {
                        months.map((m, index) => (
                            <MenuItem
                                key={m}
                                value={`${index}`}
                            >
                                {months[index]}
                            </MenuItem>
                        ))
                    }
                </Select> */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        inputFormat='dd/MM/yyyy'
                        value={dtFrom}
                        onChange={dtFrom => setDtFrom(onlyDate(dtFrom))}
                        renderInput={(props) => (
                            <TextField
                                {...props}
                                id="mui-pickers-date-dtFrom"
                                label="From"
                            />
                        )}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        inputFormat='dd/MM/yyyy'
                        value={dtTo}
                        minDate={dtFrom}
                        onChange={dtTo => setDtTo(onlyDate(dtTo))}
                        renderInput={(props) => (
                            <TextField
                                {...props}
                                id="mui-pickers-date-dtTo"
                                label="To"
                            />
                        )}
                    />
                </LocalizationProvider>
                <Button color="primary" variant='contained'
                    disabled={dtFrom.getTime() > dtTo.getTime()}
                    sx={{ ml: 2 }}
                    onClick={generateReport}
                >
                    <Icon>download</Icon>
                    <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                        Download Report
                    </Span>
                </Button>
            </StyledCard>
        </ContentBox>
    )
}

export default AttendanceReport