import { Typography } from '@mui/material'
import React from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { MenuItem, FormControl } from '@mui/material'
import { pclasses } from 'app/redux/classes/Constants'
import StyledCard from '../styledcomponents/StyledCard'
import Select from '../styledcomponents/Select'
import InputLabel from '../styledcomponents/InputLabel'

/**
 * @param {{pclass: string, sessionFrom: number, onChange:Function, year: number }} props 
 */
const OldClassForm = props => {
    return (
        <StyledCard sx={{ width: 200 }}>
            <Typography sx={{ color: '#ccccdd' }}>Old class info</Typography>
            <FormControl sx={{ mt: 3, width: '100%' }}>
                <InputLabel id="demo-simple-select-label">Session</InputLabel>
                <Select
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
                    <MenuItem value={props.year - 2}>
                        {`${props.year - 2}-${(props.year - 2) % 100 + 1}`}
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
                        pclasses.map(pclass => (
                            <MenuItem
                                key={pclass}
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

export default OldClassForm