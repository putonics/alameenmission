import React from 'react'
import { TableHead, TableBody, TableRow, TableCell, Stack, Button, Icon } from '@mui/material'
import { Box } from '@mui/system'
import StyledTable from '../styledcomponents/StyledTable'
import StyledCard from '../styledcomponents/StyledCard'
import TableSkeleton from '../skeleton/TableSkeleton'
import { pclasses } from 'app/redux/classes/Constants'
import ContentBox from '../styledcomponents/ContentBox'
import { H4 } from 'app/components/Typography'
import { generateCsv } from 'app/services/csv'
import { useStudentCountReports } from 'app/redux/classes/report/StudentCountReports'
/**
 * @param {Array<{ pclass: string, maleCount: number, femaleCount: number, otherCount: number }>} count 
 * @returns {Array<{ pclass: string, maleCount: number, femaleCount: number, otherCount: number }>}
 */
const getRow = (count) => pclasses.map(pclass => {
    const pclassCount = count.find(c => c.pclass === pclass)
    if (pclassCount) {
        const { pclass, maleCount, femaleCount, otherCount } = pclassCount
        return ({ pclass, maleCount, femaleCount, otherCount })
    } else {
        return ({ pclass, maleCount: 0, femaleCount: 0, otherCount: 0 })
    }
})

const CurrentYearFeesStatistics = props => {
    const tableHead = { title: 'Fees \\ Class', color: '#ffffff', data: getRow([]) }

    const [table, setTable] = React.useState([{
        title: '', color: '#ffffff',
        data: [{ pclass: '', maleCount: 0, femaleCount: 0, otherCount: 0 }],
        total: 0
    }])

    const scrs = useStudentCountReports()

    React.useEffect(() => {
        if (!scrs.selected) return
        const cws = scrs.selected.classWiseStudents
        if (cws.length === 0) return
        const t = []
        const fees = []
        cws.forEach(cw => {
            cw.feeCount.forEach(fc => {
                if (!fees.includes(fc.category)) {
                    fees.push(fc.category)
                }
            })
        })
        const fees2 = fees.sort((a, b) => a - b)
        const feeCount = []
        cws.forEach(cws1 => {
            cws1.getFeeCount().forEach(c => {
                feeCount.push(c)
            })
        })
        fees2.forEach(fee => {
            const data = getRow(feeCount.filter(c => c.fee === fee))
            if (data.filter(d => (d.femaleCount + d.maleCount + d.otherCount) > 0).length > 0) {
                let total = 0
                data.forEach(d => total += (d.femaleCount + d.maleCount + d.otherCount))
                t.push({ title: fee, color: '#ddddff', data, total })
            }
        })
        setTable(t)
    }, [scrs])

    const downloadCsv = () => {
        if (!scrs.selected) return
        generateCsv(
            `${scrs.selected.sessionFrom}FeesInfo.csv`,
            [tableHead.title, ...tableHead.data.map(th => th.pclass), 'Total'],
            table.map(tr => [tr.title, ...tr.data.map(td => (td.maleCount + td.femaleCount + td.otherCount)), tr.total])
        )
    }

    return (
        <ContentBox>
            {
                props.loading
                    ?
                    <TableSkeleton cols={4} rows={6} />
                    :
                    scrs.list.length > 0
                        ?
                        <StyledCard>
                            {/* {studentsByYears.selected.lastModifiedStudent.docref.id} */}
                            <Stack direction='row' spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <H4>
                                    Fees statistics
                                </H4>
                                <Button onClick={downloadCsv}>
                                    <Icon>download</Icon>
                                </Button>
                            </Stack>
                            <Box width="100%" overflow="auto">
                                <StyledTable>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={150} sx={{ fontSize: 16, textAlign: 'center', borderRight: '1px solid #cccccc' }}>{tableHead.title}</TableCell>
                                            {
                                                tableHead.data.map(th =>
                                                    <TableCell sx={{ fontSize: 16, textAlign: 'center', borderRight: '1px solid #cccccc' }} key={`th${th.pclass}`}>{th.pclass}</TableCell>
                                                )
                                            }
                                            <TableCell sx={{ fontSize: 16, textAlign: 'center', borderRight: '1px solid #cccccc' }}>Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            table.map((tr, i) => (
                                                <TableRow key={`tr${i}`}>
                                                    <TableCell
                                                        sx={{ textAlign: 'center', fontWeight: '700', borderTopColor: tr.color, borderBottomColor: tr.color, backgroundColor: tr.color + '99' }}
                                                    >
                                                        {tr.title}
                                                    </TableCell>
                                                    {
                                                        tr.data.map((td, k) => (
                                                            <TableCell key={`td${i}${k}`}
                                                                sx={{ textAlign: 'right', borderTopColor: tr.color, borderBottomColor: tr.color, backgroundColor: tr.color + '55', color: td.maleCount + td.femaleCount + td.otherCount === 0 ? '#ccc' : '#000' }}
                                                            >
                                                                {td.maleCount + td.femaleCount + td.otherCount}
                                                            </TableCell>
                                                        ))
                                                    }
                                                    <TableCell
                                                        sx={{ textAlign: 'right', fontWeight: '700', borderTopColor: tr.color, borderBottomColor: tr.color, backgroundColor: tr.color + '99' }}
                                                    >
                                                        {tr.total}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </StyledTable>
                            </Box>
                        </StyledCard>
                        :
                        <></>
            }
        </ContentBox>
    )
}

export default CurrentYearFeesStatistics