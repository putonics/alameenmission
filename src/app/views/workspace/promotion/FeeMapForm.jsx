import React from 'react'
import { TextField } from '@mui/material'
import { TableRow, TableCell } from '@mui/material'

/**
 * @param {{oldFee: number, newFee: number, onChange:Function}} props 
 */
const FeeMapForm = props => {
    return (
        <TableRow>
            <TableCell>
                <TextField
                    disabled
                    type="number"
                    name="oldFee"
                    value={`${props.oldFee}`}
                    validators={[
                        'required',
                    ]}
                />
            </TableCell>
            <TableCell>
                <TextField
                    type="number"
                    name="newFee"
                    onChange={e => props.onChange({ oldFee: props.oldFee, newFee: (+e.target.value) })}
                    value={`${props.newFee}`}
                    validators={[
                        'required',
                    ]}
                />
            </TableCell>
        </TableRow>
    )
}

export default FeeMapForm