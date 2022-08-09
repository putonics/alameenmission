import React from 'react'
import { MenuItem, Select } from '@mui/material'

const TopBar = ({ disabled, onGenderChange = (gender) => { } }) => {

    const [gender, setGender] = React.useState('MALE')
    React.useEffect(() => onGenderChange(gender), [gender])

    return (
        <Select
            disabled={disabled}
            sx={{ mr: 1 }}
            id="select-gender"
            name='gender'
            value={gender}
            label="Gender"
            onChange={e => setGender(e.target.value)}
        >
            <MenuItem value='MALE'>Male</MenuItem>
            <MenuItem value='FEMALE'>Female</MenuItem>
        </Select>
    )
}

export default TopBar