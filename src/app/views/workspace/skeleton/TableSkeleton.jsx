import React from 'react'
import { Skeleton, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import { Box } from '@mui/system'
import StyledCard from '../styledcomponents/StyledCard'
import StyledTable from '../styledcomponents/StyledTable'

const TableSkeleton = ({ cols = 1, rows = 4 }) => {
    return (
        <StyledCard>
            <Box width="100%" overflow="auto">
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            {
                                Array.from(Array(cols).keys()).map((val, index) => (
                                    <TableCell key={'headcol' + index}>
                                        <Skeleton />
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Array.from(Array(rows).keys()).map((val, row) => (
                                <TableRow key={'bodyrow' + row}>
                                    {
                                        Array.from(Array(cols).keys()).map((val, index) => (
                                            <TableCell key={'headcol' + index}>
                                                <Skeleton />
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </StyledTable>
            </Box>
        </StyledCard>
    )
}

export default TableSkeleton