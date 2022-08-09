import { useStudentCountReports } from 'app/redux/classes/report/StudentCountReports'
import React from 'react'
import ClassWiseAttendance from 'app/redux/classes/students/attendance/ClassWiseAttendance'
import { Box, Button, Icon, MenuItem, Select, Typography } from '@mui/material'
import StyledCard from '../styledcomponents/StyledCard'
/**
 * @param {{exceptCwas: ClassWiseAttendance[], gender:'MALE'|'FEMALE'}} props 
 */
const AddClass = props => {

    const [list, setList] = React.useState([{ pclass: '', sessionFrom: 0, totalCount: 0, modifiedon: 0 }])
    const scrs = useStudentCountReports()

    React.useEffect(() => {
        const list = []
        const cwas = props.exceptCwas
        scrs.list.forEach(scr => {
            scr.classWiseStudents.forEach(cws => {
                if (
                    list.findIndex(x => x.pclass === cws.pclass && x.sessionFrom === scr.sessionFrom) < 0
                    && cwas.findIndex(y => y.pclass === cws.pclass) < 0
                ) {
                    list.push({ pclass: cws.pclass, sessionFrom: scr.sessionFrom, totalCount: cws.getTotal(props.gender), modifiedon: cws.modifiedon })
                }
            })
        })
        setList(list.filter(x => x.pclass !== 'PASSED OUT'))
    }, [scrs])

    const [pclassList, setPclassList] = React.useState([''])
    const [sessionFromList, setSessionFromList] = React.useState([0])
    const setLists = (listx = list) => {
        const pclassList = []
        const sessionFromList = []
        listx.forEach(x => {
            if (!pclassList.includes(x.pclass)) pclassList.push(x.pclass)
            if (!sessionFromList.includes(x.sessionFrom)) sessionFromList.push(x.sessionFrom)
        })
        setPclassList(pclassList)
        setSessionFromList(sessionFromList)
    }
    React.useEffect(() => {
        setLists(list)
    }, [list])

    const [pclass, setPclass] = React.useState('')
    const [sessionFrom, setSessionFrom] = React.useState(0)
    const [totalCount, setTotalCount] = React.useState(0)
    const [modifiedon, setModifiedon] = React.useState(0)

    React.useEffect(() => {
        if (pclass && sessionFrom) {
            const y = list.find(x => x.pclass === pclass && x.sessionFrom === sessionFrom)
            if (y) {
                setTotalCount(y.totalCount)
                setModifiedon(y.modifiedon)
            } else {
                setTotalCount(0)
                setModifiedon(0)
            }
        } else {
            setTotalCount(0)
            setModifiedon(0)
        }
    }, [pclass, sessionFrom])

    React.useEffect(() => {
        if (pclassList.length > 0 && pclassList.findIndex(x => x.pclass === pclass) < 0) {
            setPclass(pclassList[0])
        } else if (pclass) {
            setPclass('')
        }
    }, [pclassList])

    React.useEffect(() => {
        if (sessionFromList.length > 0 && sessionFromList.findIndex(x => x.sessionFrom === sessionFrom) < 0) {
            setSessionFrom(sessionFromList[0])
        } else if (sessionFrom) {
            setSessionFrom(0)
        }
    }, [sessionFromList])

    return (
        <StyledCard sx={{ border: '1px solid #ccc', background: '#aaddff', mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Select
                    sx={{ mr: 1 }}
                    id="select-pclass"
                    name='pclass'
                    value={`${pclass}`}
                    label="Class"
                    onChange={e => setPclass(e.target.value)}
                    disabled={!pclassList.length}
                >
                    {
                        pclassList.map((pc, index) => (
                            <MenuItem
                                key={pc}
                                value={`${pc}`}
                            >
                                {pc}
                            </MenuItem>
                        ))
                    }
                </Select>
                <Select
                    sx={{ mr: 1 }}
                    id="select-sessionFrom"
                    name='sessionFrom'
                    value={`${sessionFrom}`}
                    label="From Session"
                    onChange={e => setSessionFrom((+e.target.value))}
                    disabled={!sessionFromList.length}
                >
                    {
                        sessionFromList.map((year, index) => (
                            <MenuItem
                                key={year}
                                value={`${year}`}
                            >
                                {year}
                            </MenuItem>
                        ))
                    }
                </Select>
                <Typography sx={{ fontSize: 20, color: '#777', ml: 10 }}>
                    Total students:
                </Typography>
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#ff0088', ml: 1, mr: 10 }}>{totalCount}</Typography>
                <Button color="primary" variant='contained'
                    onClick={() => {
                        props.onProceed({ pclass, sessionFrom, modifiedon })
                    }}
                    disabled={!totalCount}
                >
                    <Icon fontSize='20px'>add</Icon>
                    Add to attendance list
                </Button>
            </Box>
        </StyledCard>
    )
}

export default AddClass