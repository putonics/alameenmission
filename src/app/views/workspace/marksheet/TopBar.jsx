import { Button, Icon, MenuItem, Select } from '@mui/material'
import styledEngine from '@mui/styled-engine'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { pclasses } from 'app/redux/classes/Constants'
import { useExams } from 'app/redux/classes/students/exam/Exams'
import Exam from 'app/redux/classes/students/result/Exam'
import { Span } from 'app/components/Typography'

const StyledSpan = styledEngine('span')(({ theme }) => ({
    width: 32,
    borderRadius: 16,
    textAlign: 'center',
    marginRight: 3
}))

const TopBar = ({
    startLoading = () => { }, stopLoading = () => { },
    onGenerateMarksheet = (exam) => { },
    onGenerateExcel = (exam) => { }
}) => {
    const [loading, setLoading] = React.useState(false)

    const [gender, setGender] = React.useState('MALE')
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

    const [exam, setExam] = React.useState(new Exam().json())

    React.useEffect(() => {
        if (exams.list.length > 0) {
            setExam(Exam.parse(exams.list[0]).json())
        }
    }, [exams])

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
            <Select
                disabled={loading || !exams.list.length || !exam.docref.id}
                labelId="demo-simple-select-label-examName"
                sx={{ mr: 1 }}
                id="select-examName"
                name='examName'
                value={exam.docref.id}
                label="Exam Name"
                onChange={e => {
                    setExam(Exam.parse(exams.list.find(e => e.docref.id === e.target.value)).json())
                }}
            >
                {
                    exams.list.map(e => (
                        <MenuItem key={e.docref.id} value={e.docref.id}>{e.name}</MenuItem>
                    ))
                }
            </Select>
            <Button color="primary" variant='contained'
                sx={{ ml: 2 }}
                onClick={() => onGenerateMarksheet(exam)}
                disabled={loading || !exams.list.length || !exam.docref.id}
            >
                <Icon>download</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                    Marksheets
                </Span>
            </Button>
            <Button color="primary" variant='contained'
                sx={{ ml: 2 }}
                onClick={() => onGenerateExcel(exam)}
                disabled={loading || !exams.list.length || !exam.docref.id}
            >
                <Icon>download</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                    Excel
                </Span>
            </Button>
        </>
    )
}

export default TopBar