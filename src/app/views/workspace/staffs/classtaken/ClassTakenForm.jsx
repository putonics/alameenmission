import { Icon, IconButton, MenuItem, Select, TableCell, TableRow, TextField } from '@mui/material'
import { pclasses } from 'app/redux/classes/Constants'
import ClassTaken from 'app/redux/classes/staffs/classtaken/ClassTaken'
import { useStaffs } from 'app/redux/classes/staffs/Staffs'
import React from 'react'

/**
 * @param {{index:number, ct: ClassTaken, onChange: ()=>{}, onDelete:()=>{}}} props 
 */
const ClassTakenForm = props => {

    const staffs = useStaffs()

    const set = (index, value) => {
        const periodTeacherCodes = [...props.ct.periodTeacherCodes]
        periodTeacherCodes[index] = value
        props.onChange({ ...props.ct, periodTeacherCodes })
    }

    return (
        <TableRow>
            <TableCell>
                <Select
                    sx={{ mx: 1, width: '100%' }}
                    name='pclass'
                    value={props.ct.pclass}
                    onChange={e => props.onChange({ ...props.ct, pclass: e.target.value })}
                >
                    {
                        pclasses.map(pclass => (
                            <MenuItem value={pclass} key={props.index + pclass}>{pclass}</MenuItem>
                        ))
                    }
                    <MenuItem value='OTHER'>OTHER</MenuItem>
                </Select>
            </TableCell>
            <TableCell>
                <TextField
                    name='section'
                    value={props.ct.section}
                    type='text'
                    onChange={e => props.onChange({ ...props.ct, section: e.target.value })}
                />
            </TableCell>
            {
                props.ct.periodTeacherCodes.map((p, pi) => (
                    <TableCell key={props.index + '' + pi}>
                        <Select
                            sx={{ mx: 1, width: '100%' }}
                            value={p}
                            onChange={e => set(pi, e.target.value)}
                        >
                            <MenuItem value=''>None</MenuItem>
                            {
                                staffs.list.filter(s => s.showInAttendanceList).map((s, i) => (
                                    <MenuItem value={s.regno} key={props.index + '' + pi + s.regno}>
                                        {s.nickname || s.regno}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </TableCell>
                ))
            }
            <TableCell>
                <IconButton color='default' onClick={props.onDelete}>
                    <Icon>delete</Icon>
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

export default ClassTakenForm