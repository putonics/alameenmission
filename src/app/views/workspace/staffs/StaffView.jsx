import { Button, Icon, IconButton, TableCell, TableRow } from '@mui/material'
import Staff from 'app/redux/classes/staffs/Staff'
import React from 'react'
import { NavLink } from 'react-router-dom'

/**
 * @param {{staff: Staff, onDelete:()=>{}}} props 
 */
const StaffView = props => {
    return (
        <TableRow>
            <TableCell sx={{ textAlign: 'center' }}>
                {
                    props.staff.status === 'ACTIVE'
                        ? <Icon sx={{ color: '#00ffaa' }}>radio_button_checked</Icon>
                        : <Icon sx={{ color: '#cccccc' }}>radio_button_unchecked</Icon>
                }
            </TableCell>
            <TableCell>{props.staff.regno}</TableCell>
            <TableCell>{props.staff.name}</TableCell>
            <TableCell>{props.staff.designation}</TableCell>
            <TableCell>{props.staff.mobile}</TableCell>
            <TableCell>{props.staff.email}</TableCell>
            <TableCell>{props.staff.caste}</TableCell>
            <TableCell>{props.staff.gender}</TableCell>
            <TableCell>
                <NavLink to={`/staffs/${props.staff.docref.id}`}>
                    <IconButton color='default'>
                        <Icon>edit</Icon>
                    </IconButton>
                </NavLink>
            </TableCell>
        </TableRow>
    )
}

export default StaffView