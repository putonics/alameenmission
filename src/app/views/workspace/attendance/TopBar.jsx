import React from 'react'
import { MenuItem, Select } from '@mui/material'
import styledEngine from '@mui/styled-engine'

const StyledSpan = styledEngine('span')(({ theme }) => ({
    width: 32,
    borderRadius: 16,
    textAlign: 'center',
    marginRight: 3
}))

const TopBar = ({ onGenderChange = (gender) => { } }) => {

    const [gender, setGender] = React.useState('MALE')
    React.useEffect(() => onGenderChange(gender), [gender])

    return (
        <>
            <Select
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
        </>
    )
}

export default TopBar