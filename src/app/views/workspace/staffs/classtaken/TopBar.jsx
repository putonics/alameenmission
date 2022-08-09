import { Box, Button, Icon, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Span } from 'app/components/Typography'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import { onlyDate } from 'app/utils/constant'
import DailyClassTaken, { useDailyClassTaken } from 'app/redux/classes/staffs/classtaken/DailyClassTaken'
import { useStaffs } from 'app/redux/classes/staffs/Staffs'
import ClassTakenReport from 'app/redux/classes/staffs/classtaken/ClassTakenReport'
import { generateCsv } from 'app/services/csv'
import { months } from 'app/redux/classes/Constants'
// import { format } from 'date-fns'

const TopBar = () => {
    const user = useUser()

    const [timestamp, setTimestamp] = React.useState(onlyDate())
    const [copyfrom, setCopyfrom] = React.useState(onlyDate())
    const [gender, setGender] = React.useState('MALE')
    const dct = useDailyClassTaken()
    React.useEffect(() => {
        dct.load(user.subscriberdocid, timestamp, gender)
        setCopyfrom(timestamp)
    }, [timestamp])

    const staffs = useStaffs()

    React.useEffect(() => {
        staffs.load(user.subscriberdocid)
    }, [user])

    const downloadCsv = async () => {
        const classTakens = staffs.list
            .filter(s => s.role === 'TEACHING STAFF')
            .map(s => new ClassTakenReport({ staff: s }))
        const list = await DailyClassTaken.loadMonth(user.subscriberdocid, timestamp, gender)
        list.forEach(dct => {
            classTakens.forEach(ct => {
                ct.add(dct)
            })
        })
        const headings = ['Teacher code', 'Teacher name', 'Mobile', 'Total class taken', 'A/C No', 'IFSC', 'Bank Name']
        const rows = []
        classTakens.forEach(ct => {
            rows.push([
                ct.staff.regno, ct.staff.name, ct.staff.mobile,
                ct.totalClassTaken,
                ct.staff.bankAccount.accountNo, ct.staff.bankAccount.ifsc, ct.staff.bankAccount.bankName
            ])
        })
        generateCsv(`MonthlyClassTakenReport-${gender}-${months[new Date(timestamp).getMonth()]}.csv`, headings, rows)
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    inputFormat='dd/MM/yyyy'
                    value={timestamp}
                    onChange={timestamp => setTimestamp(onlyDate(timestamp))}
                    renderInput={(props) => (
                        <TextField
                            sx={{ width: 140 }}
                            {...props}
                            id="mui-pickers-date-timestamp"
                        />
                    )}
                />
            </LocalizationProvider>
            <Select
                sx={{ mx: 1 }}
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
                sx={{ mx: 2 }}
                onClick={downloadCsv}
            >
                <Icon>download</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                    Monthly report
                </Span>
            </Button>
            <Box sx={{ border: '1px solid #aaa', borderRadius: 1, pl: 1, display: 'flex', alignItems: 'center', background: '#aaaaff' }}>
                <Typography>Copy-from&nbsp;</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        disabled={Boolean(dct.docref)}
                        inputFormat='dd/MM/yyyy'
                        value={copyfrom}
                        onChange={copyfrom => {
                            dct.copyfrom(copyfrom)
                            setCopyfrom(onlyDate(copyfrom))
                        }}
                        renderInput={(props) => (
                            <TextField
                                sx={{ width: 140 }}
                                {...props}
                                id="mui-pickers-date-copyfrom"
                            />
                        )}
                    />
                </LocalizationProvider>
            </Box>
        </>
    )
}

export default TopBar