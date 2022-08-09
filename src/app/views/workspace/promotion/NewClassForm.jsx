import { Typography } from '@mui/material'
import React from 'react'
import { MenuItem, FormControl } from '@mui/material'
import StyledCard from '../styledcomponents/StyledCard'
import Select from '../styledcomponents/Select'
import InputLabel from '../styledcomponents/InputLabel'

/**
 * @param {{pclass: string, sessionFrom: number, onChange:Function, year: number }} props 
 */
const NewClassForm = props => {
    return (
        <StyledCard sx={{ width: 200 }}>
            <Typography sx={{ color: '#ccccdd' }}>New class info</Typography>
            <FormControl sx={{ mt: 3, width: '100%' }}>
                <InputLabel id="demo-simple-select-label">Session</InputLabel>
                <Select
                    readOnly
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name='sessionFrom'
                    value={props.sessionFrom || ''}
                    label="Session"
                    onChange={e => props.onChange({ ...props, sessionFrom: (+e.target.value) })}
                    required
                >
                    <MenuItem value={props.year - 1}>
                        {`${props.year - 1}-${(props.year - 1) % 100 + 1}`}
                    </MenuItem>
                    <MenuItem value={props.year}>
                        {`${props.year}-${(props.year) % 100 + 1}`}
                    </MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ mt: 3, width: '100%' }}>
                <InputLabel id="demo-simple-select-label">Present Class</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name='pclass'
                    value={props.pclass || ''}
                    label="Present Class"
                    onChange={e => props.onChange({ ...props, pclass: e.target.value })}
                    required
                >
                    {
                        [props.pclass, 'PASSED OUT'].filter((p, i) => i < 13).map((pclass, i) => (
                            <MenuItem
                                key={pclass + i}
                                value={pclass}
                            >
                                {pclass}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </StyledCard>
    )
}

export default NewClassForm