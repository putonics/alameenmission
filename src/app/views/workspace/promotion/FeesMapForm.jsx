import React from 'react'
import { TableHead, TableBody, TableRow, TableCell, Typography } from '@mui/material'
import StyledTable from '../styledcomponents/StyledTable'
import FeeMapForm from './FeeMapForm'
/**
 * @param {{fees: Array<{oldFee:number, newFee: number}>, onChange: Function}} props 
 */
const FeesMapForm = props => {
    return (
        <>
            <Typography sx={{ mb: 1, textAlign: 'center', color: '#aaaacc' }}>Fees mapping</Typography>
            <StyledTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Old fees</TableCell>
                        <TableCell>New fees</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.fees.map((f, i) => (
                            <FeeMapForm {...f} key={f.oldFee}
                                onChange={fee => {
                                    const fees = [...props.fees]
                                    fees[i] = fee
                                    props.onChange(fees)
                                }}
                            />
                        ))
                    }
                </TableBody>
            </StyledTable>
        </>
    )
}

export default FeesMapForm