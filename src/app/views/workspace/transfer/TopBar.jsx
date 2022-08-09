import React from 'react'
import { MenuItem, Select } from '@mui/material'

const TopBar = ({ disabled = false, onSessionChange = (sessionFrom) => { } }) => {
    const dt = new Date()
    const [sessionFrom, setSessionFrom] = React.useState(dt.getFullYear() - (dt.getMonth() < 3 ? 1 : 0))
    React.useEffect(() => {
        onSessionChange(sessionFrom)
    }, [sessionFrom])

    return (
        <Select
            disabled={disabled}
            sx={{ mr: 1 }}
            id="select-sessionFrom"
            name='sessionFrom'
            value={sessionFrom}
            onChange={e => setSessionFrom((+e.target.value))}
        >
            <MenuItem value={`${dt.getFullYear()}`}>{dt.getFullYear()}</MenuItem>
            <MenuItem value={`${dt.getFullYear() - 1}`}>{dt.getFullYear() - 1}</MenuItem>
        </Select>
    )
}

export default TopBar