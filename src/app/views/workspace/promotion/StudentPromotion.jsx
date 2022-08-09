import { Box, Icon, Typography } from '@mui/material'
import { useStudents } from 'app/redux/classes/students/Students'
import React from 'react'
import StyledCard from '../styledcomponents/StyledCard'
import StudentCard from './StudentCard'

/**
 * @param {{
 *   admissionDate: Date, feeStartingMonth: number,
 *   pclass: string, sessionFrom: number,
 *   fees: Array<{oldFee: number, newFee: number}>,
 *   gender: string
 * }} props 
 */
const StudentPromotion = props => {
    const [list, setList] = React.useState([])
    const students = useStudents()
    React.useEffect(() => {
        setList(students.list.filter(s => s.gender === props.gender))
    }, [students])

    const [index, setIndex] = React.useState(0)
    const [message, setMessage] = React.useState("")

    React.useEffect(() => {
        // console.log('list:', list.length)
        if (index < list.length - 1) {
            // console.log('index:', index)
            list[index].promote(
                props.sessionFrom, props.pclass, props.admissionDate,
                props.feeStartingMonth, props.fees.find(f => f.oldFee === list[index].fee).newFee,
                (done) => {
                    setMessage(`${index + 1}. ${done ? 'Successfully promoted' : 'Error! Unable to promote'}: ${list[index].name} [ ${list[index].regno} ]`)
                    setIndex(index + 1)
                }
            )
        }
    }, [index, list])

    return (
        list.length
            ?
            <>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                    <StudentCard
                        name={list[index].name}
                        regno={list[index].regno}
                        sessionFrom={list[index].sessionFrom}
                        pclass={list[index].pclass}
                        admissionDate={list[index].admissionDate}
                        feeStartingMonth={list[index].feeStartingMonth}
                        fee={list[index].fee}
                    />
                    <Box sx={{ p: 4 }}>
                        <Typography sx={{ fontSize: 20, textAlign: 'center', color: '#aaaacc' }}>PROMOTING</Typography>
                        <Typography sx={{ fontSize: 20, textAlign: 'center', my: 2 }}>
                            <Icon>arrow_circle_right</Icon>
                        </Typography>
                        <Typography sx={{ fontSize: 20, textAlign: 'center' }}>{index + 1} / {list.length}</Typography>
                    </Box>
                    {
                        list[index].status === 'ACTIVE'
                            ?
                            <StudentCard
                                name={list[index].name}
                                regno={list[index].regno}
                                sessionFrom={props.sessionFrom}
                                pclass={props.pclass}
                                admissionDate={props.admissionDate}
                                feeStartingMonth={props.feeStartingMonth}
                                fee={props.fees.find(f => f.oldFee === list[index].fee).newFee}
                            />
                            :
                            <StyledCard>
                                <Typography sx={{ fontSize: 30 }}>{list[index].status}</Typography>
                            </StyledCard>
                    }
                </Box>
                {
                    index === list.length - 1
                        ?
                        <Typography sx={{ m: 3, fontSize: 25, color: '#44aa66', textAlign: 'center' }}>Successfully finished.</Typography>
                        :
                        <>
                            <Typography sx={{ m: 3, fontSize: 12, color: '#005599', textAlign: 'center', fontWeight: 700 }}>{message}</Typography>
                            <Typography sx={{ m: 3, fontSize: 25, color: index % 2 ? '#ff4466' : '#ff0066', textAlign: 'center' }}>Please do not close the page until finished.</Typography>
                        </>
                }
            </>
            : <></>
    )
}

export default StudentPromotion