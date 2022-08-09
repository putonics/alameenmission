import React from 'react'
import { useStudents } from 'app/redux/classes/students/Students'
import { TableHead, TableBody, TableRow, TableCell, Icon, TablePagination, IconButton, Button } from '@mui/material'
import { Box } from '@mui/system'
import StyledTable from '../styledcomponents/StyledTable'
import StyledCard from '../styledcomponents/StyledCard'
import { NavLink } from 'react-router-dom'
import TableSkeleton from '../skeleton/TableSkeleton'
import StudentRow from './StudentRow'
import TableSettingsMenu from './TableSettingsMenu'
import { useStudentTableHandler } from 'app/redux/classes/controls/StudentTableHandler'
import DeepSearch from './search/DeepSearch'
import { Institute, useInstitutes } from 'app/redux/classes/Institutes'
import { useUser } from 'app/redux/classes/User'
import { COLS } from './SelectColumns'

const StudentTable = props => {
    const [loading, setLoading] = React.useState(false)

    const students = useStudents()

    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [page, setPage] = React.useState(0)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const [count, setCount] = React.useState({ male: 0, female: 0 })
    const studentTableHandler = useStudentTableHandler()
    React.useEffect(() => {
        if (rowsPerPage > students.list.length) {
            setPage(0)
        } else if (studentTableHandler.page !== page) {
            studentTableHandler.setPage(page, students.sessionFrom, students.pclass)
        }
        if (students && students.list && students.list.length) {
            let m = 0, f = 0
            students.list.forEach(s => {
                m += s.gender === 'MALE' ? 1 : 0
                f += s.gender === 'FEMALE' ? 1 : 0
            })
            setCount({ male: m, female: f })
        }
    }, [page, students])

    React.useEffect(() => {
        if (studentTableHandler.page !== page) {
            setPage(studentTableHandler.page)
        }
    }, [studentTableHandler])

    ///TABLE COLUMN CREATION
    const [columns, setColumns] = React.useState(COLS.filter(col => col.checked))
    const user = useUser()
    const institutes = useInstitutes()
    const [institute, setInstitute] = React.useState(null)

    React.useEffect(() => {
        if (user.loggedin && institutes.loaded) {
            setInstitute(new Institute(institutes.getInstitute(user.subscriberdocid)))
        } else {
            institutes.load()
        }
    }, [user, institutes])

    React.useEffect(() => {
        if (institute && institute.studentTableCols) {
            setColumns(institute.studentTableCols.filter(col => col.checked))
        }
    }, [institute])
    //////////////////////////////

    const [anchorEl, setAnchorEl] = React.useState(null)
    return (
        !students.loaded || props.loading || loading
            ?
            <TableSkeleton cols={4} rows={6} />
            :
            students.list.length > 0
                ?
                <StyledCard>
                    <Box sx={{ pb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <Box sx={{ color: '#777777' }}>Male: <span style={{ color: '#443333', fontWeight: '700' }}>{count.male}</span></Box>
                        <Box sx={{ color: '#777777' }}>Female: <span style={{ color: '#443333', fontWeight: '700' }}>{count.female}</span></Box>
                        <Box sx={{ color: '#777777' }}>Total: <span style={{ color: '#443333', fontWeight: '700' }}>{count.male + count.female}</span></Box>
                    </Box>
                    <Box width="100%" overflow="auto">
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell width='50px'>
                                        <NavLink to='/students/entry/new'>
                                            <IconButton color='default'>
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </NavLink>
                                    </TableCell>
                                    {
                                        columns.map(col => (
                                            <TableCell key={col.field} onClick={() => students.toggleOrder(col.field)}>
                                                <Button size='small'>
                                                    {col.label}
                                                    {
                                                        students.viewOrder.field === col.field
                                                            ? students.viewOrder.order === 'ascending' ? '↾' : '⇂'
                                                            : ''
                                                    }
                                                </Button>
                                            </TableCell>
                                        ))
                                    }
                                    {/* <TableCell onClick={() => students.toggleOrder('name')}>
                                        <Button size='small'>
                                            Student's name
                                            {
                                                students.viewOrder.field === 'name'
                                                    ? students.viewOrder.order === 'ascending' ? '↾' : '⇂'
                                                    : ''
                                            }
                                        </Button>
                                    </TableCell>
                                    <TableCell >Session</TableCell>
                                    <TableCell onClick={() => students.toggleOrder('mobile')}>
                                        <Button size='small'>
                                            Mobile No
                                            {
                                                students.viewOrder.field === 'mobile'
                                                    ? students.viewOrder.order === 'ascending' ? '↾' : '⇂'
                                                    : ''
                                            }
                                        </Button>
                                    </TableCell>
                                    <TableCell onClick={() => students.toggleOrder('stream')}>
                                        <Button size='small'>
                                            Stream
                                            {
                                                students.viewOrder.field === 'stream'
                                                    ? students.viewOrder.order === 'ascending' ? '↾' : '⇂'
                                                    : ''
                                            }
                                        </Button>
                                    </TableCell>
                                    <TableCell onClick={() => students.toggleOrder('fee')}>
                                        <Button size='small'>
                                            Monthly Fees
                                            {
                                                students.viewOrder.field === 'fee'
                                                    ? students.viewOrder.order === 'ascending' ? '↾' : '⇂'
                                                    : ''
                                            }
                                        </Button>
                                    </TableCell>
                                    <TableCell onClick={() => students.toggleOrder('caste')}>
                                        <Button size='small'>
                                            Caste
                                            {
                                                students.viewOrder.field === 'caste'
                                                    ? students.viewOrder.order === 'ascending' ? '↾' : '⇂'
                                                    : ''
                                            }
                                        </Button>
                                    </TableCell> */}
                                    <TableCell width='50px'>
                                        <IconButton
                                            color='default'
                                            onClick={e => setAnchorEl(e.currentTarget)}
                                        >
                                            <Icon>settings</Icon>
                                        </IconButton>
                                        <TableSettingsMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
                                    </TableCell>
                                </TableRow>
                            </TableHead >
                            <TableBody>
                                {students.list
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((student, index) => (
                                        <StudentRow columns={columns.filter((c, i) => i > 0)} key={student.docref.id} student={student} />
                                    ))}
                            </TableBody>
                        </StyledTable >
                        <TablePagination
                            sx={{ px: 2 }}
                            rowsPerPageOptions={[10, 25, 50, 100, 999999]}
                            component="div"
                            count={students.list.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                </StyledCard>
                :
                <DeepSearch startLoading={() => setLoading(true)} stopLoading={() => setLoading(false)} />
    )
}

export default StudentTable