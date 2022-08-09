import React from 'react'
import { useItems } from 'app/redux/classes/Items'
import { IconButton, TableHead, TableBody, TableRow, TableCell, Icon, TablePagination } from '@mui/material'
import { Box } from '@mui/system'
import StyledTable from '../styledcomponents/StyledTable'
import StyledCard from '../styledcomponents/StyledCard'
import { NavLink } from 'react-router-dom'

const PurchaseList = props => {
    const items = useItems()

    React.useEffect(() => {
        items.fetch()
    }, [])

    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [page, setPage] = React.useState(0)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    return (
        items.list.length > 0
            ?
            <StyledCard>
                <Box width="100%" overflow="auto">
                    <StyledTable>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item's Name</TableCell>
                                <TableCell>Manufacturer</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell width='50px'>
                                    <NavLink to='/items/entry/new'>
                                        <IconButton
                                            className="button"
                                            aria-label="Add new item"
                                            color="primary"
                                        >
                                            <Icon>add</Icon>
                                        </IconButton>
                                    </NavLink>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.list
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left">
                                            {item.itemname}
                                        </TableCell>
                                        <TableCell align="left">
                                            {item.manufacturer}
                                        </TableCell>
                                        <TableCell align="left">
                                            {item.itemdescription}
                                        </TableCell>
                                        <TableCell>
                                            <NavLink to={`/items/entry/${item.docref.id}`}>
                                                <IconButton
                                                    color='default'
                                                >
                                                    <Icon>edit</Icon>
                                                </IconButton>
                                            </NavLink>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </StyledTable>
                    <TablePagination
                        sx={{ px: 2 }}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        component="div"
                        count={items.list.length}
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
            <></>
    )
}

export default PurchaseList