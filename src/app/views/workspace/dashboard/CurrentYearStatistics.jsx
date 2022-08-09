import React from 'react'
import { TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import { Box } from '@mui/system'
import StyledTable from '../styledcomponents/StyledTable'
import StyledCard from '../styledcomponents/StyledCard'
import TableSkeleton from '../skeleton/TableSkeleton'
import { mediums, pclasses, streams, castes } from 'app/redux/classes/Constants'
import ContentBox from '../styledcomponents/ContentBox'
import { useStudentCountReports } from 'app/redux/classes/report/StudentCountReports'
///////////////////////////////////////////////////////////////////

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

const CurrentYearStatistics = props => {

    const tableHead = { title: 'Category \\ Class', color: '#ffffff', data: getRow([]) }
    const [table, setTable] = React.useState([{
        title: '', color: '#ffffff',
        data: [{ pclass: '', maleCount: 0, femaleCount: 0, otherCount: 0 }],
        total: 0
    }])

    const scrs = useStudentCountReports()

    React.useEffect(() => {
        const cws = scrs.selected.classWiseStudents
        if (cws.length > 0) {
            const t = []
            const totalCount = cws.map(cws1 => cws1.getTotalCount())
            const handicappedCount = cws.map(cws1 => cws1.getHandicappedCount())
            const orphanCount = cws.map(cws1 => cws1.getOrphanCount())
            const statusCount = []
            cws.forEach(cws1 => {
                cws1.getStatusCount().forEach(c => {
                    statusCount.push(c)
                })
            })
            const casteCount = []
            cws.forEach(cws1 => {
                cws1.getCasteCount().forEach(c => {
                    casteCount.push(c)
                })
            })
            const mediumCount = []
            cws.forEach(cws1 => {
                cws1.getMediumCount().forEach(c => {
                    mediumCount.push(c)
                })
            })
            const streamCount = []
            cws.forEach(cws1 => {
                cws1.getStreamCount().forEach(c => {
                    streamCount.push(c)
                })
            })
            {//simple block
                const data = getRow(totalCount)
                let total = 0
                data.forEach(d => total += d.maleCount)
                const maleData = data.map(d => ({ ...d, femaleCount: 0, otherCount: 0 }))
                t.push({ title: 'Male', color: '#0088ff', data: maleData, total })
            }
            {//simple block
                const data = getRow(totalCount)
                let total = 0
                data.forEach(d => total += d.femaleCount)
                const femaleData = data.map(d => ({ ...d, maleCount: 0, otherCount: 0 }))
                t.push({ title: 'Female', color: '#ff0088', data: femaleData, total })
            }
            {//simple block
                const data = getRow(totalCount)
                let total = 0
                data.forEach(d => total += (d.femaleCount + d.maleCount + d.otherCount))
                t.push({ title: 'Total', color: '#666666', data, total })
            }
            t.push({ title: 'SUB-HEADING', heading: 'Status wise students', color: '#ddddff' })
            {//simple block
                const data = getRow(statusCount.filter(c => c.status === 'ACTIVE'))
                let total = 0
                data.forEach(d => total += (d.femaleCount + d.maleCount + d.otherCount))
                t.push({ title: 'ACTIVE', color: '#88ff88', data, total })
            }
            {//simple block
                const data = getRow(statusCount.filter(c => c.status !== 'ACTIVE'))
                let total = 0
                data.forEach(d => total += (d.femaleCount + d.maleCount + d.otherCount))
                t.push({ title: 'DROPOUT', color: '#ff8888', data, total })
            }
            t.push({ title: 'SUB-HEADING', heading: 'Caste wise students', color: '#ddddff' })
            castes.forEach(caste => {
                const data = getRow(casteCount.filter(c => c.caste === caste))
                let total = 0
                data.forEach(d => total += (d.femaleCount + d.maleCount + d.otherCount))
                if (data.filter(d => (d.femaleCount + d.maleCount + d.otherCount) > 0).length > 0) {
                    t.push({ title: caste, color: '#ddddff', data, total })
                }
            })
            t.push({ title: 'SUB-HEADING', heading: 'Medium wise students', color: '#ff88ff' })
            mediums.forEach(medium => {
                const data = getRow(mediumCount.filter(c => c.medium === medium))
                let total = 0
                data.forEach(d => total += (d.femaleCount + d.maleCount + d.otherCount))
                if (data.filter(d => (d.femaleCount + d.maleCount + d.otherCount) > 0).length > 0) {
                    t.push({ title: medium, color: '#ff88ff', data, total })
                }
            })
            t.push({ title: 'SUB-HEADING', heading: 'Stream wise students', color: '#ffff88' })
            streams.forEach(stream => {
                const data = getRow(streamCount.filter(c => c.stream === stream))
                let total = 0
                data.forEach(d => total += (d.femaleCount + d.maleCount + d.otherCount))
                if (data.filter(d => (d.femaleCount + d.maleCount + d.otherCount) > 0).length > 0) {
                    t.push({ title: stream, color: '#ffff88', data, total })
                }
            })
            t.push({ title: 'SUB-HEADING', heading: 'Others', color: '#999999' })
            {//simple block
                const data = getRow(handicappedCount)
                let total = 0
                data.forEach(d => total += (d.femaleCount + d.maleCount + d.otherCount))
                t.push({ title: "Handicapped", color: '#999999', data, total })
            }
            {//simple block
                const data = getRow(orphanCount)
                let total = 0
                data.forEach(d => total += (d.femaleCount + d.maleCount + d.otherCount))
                t.push({ title: "Orphan", color: '#999999', data, total })
            }
            setTable(t)
        }
    }, [scrs])

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
                            <Box width="100%" overflow="auto">
                                <StyledTable>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                width={150}
                                                sx={{ fontSize: 16, textAlign: 'center', borderRight: '1px solid #cccccc' }}
                                            >
                                                {tableHead.title}
                                            </TableCell>
                                            {
                                                tableHead.data.map(th =>
                                                    <TableCell
                                                        sx={{ fontSize: 16, textAlign: 'center', borderRight: '1px solid #cccccc' }}
                                                        key={`th${th.pclass}`}
                                                    >
                                                        {th.pclass}
                                                    </TableCell>
                                                )
                                            }
                                            <TableCell sx={{ fontSize: 16, textAlign: 'center', borderRight: '1px solid #cccccc' }}>
                                                Total
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            table.map((tr, i) => (
                                                <TableRow key={`tr${i}`}>
                                                    {
                                                        tr.title === 'SUB-HEADING'
                                                            ?
                                                            <TableCell colSpan={pclasses.length + 2}
                                                                sx={{
                                                                    textAlign: 'center',
                                                                    color: '#777777',
                                                                    borderTopColor: tr.color,
                                                                    borderBottomColor: tr.color,
                                                                    backgroundColor: tr.color + '99'
                                                                }}
                                                            >
                                                                {tr.heading}
                                                            </TableCell>
                                                            :
                                                            <>
                                                                <TableCell sx={{ fontWeight: '700', borderTopColor: tr.color, borderBottomColor: tr.color, backgroundColor: tr.color + '99' }}>
                                                                    &nbsp;{tr.title}
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
                                                                <TableCell sx={{ textAlign: 'right', fontWeight: '700', borderTopColor: tr.color, borderBottomColor: tr.color, backgroundColor: tr.color + '99' }}>
                                                                    &nbsp;{tr.total}
                                                                </TableCell>
                                                            </>
                                                    }
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

export default CurrentYearStatistics