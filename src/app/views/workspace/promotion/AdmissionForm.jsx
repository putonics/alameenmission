import React from 'react'
import { MenuItem, FormControl } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import TextField from '../styledcomponents/TextField'
import Select from '../styledcomponents/Select'
import InputLabel from '../styledcomponents/InputLabel'
import { months } from 'app/redux/classes/Constants'

/**
 * @param {{admissionDate: Date, feeStartingMonth: string, onChange: Function}} props 
 */
const AdmissionForm = props => {
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    inputFormat='dd/MM/yyyy'
                    value={new Date(props.admissionDate)}
                    onChange={dt => props.onChange({ feeStartingMonth: props.feeStartingMonth, admissionDate: new Date(dt) })}
                    renderInput={(props) => (
                        <TextField
                            {...props}
                            // variant="Outlined"
                            id="mui-pickers-date"
                            label="Admission date"
                            sx={{ mb: 2, width: '100%' }}
                        />
                    )}
                />
            </LocalizationProvider>
            <FormControl sx={{ mb: 3, width: '100%' }}>
                <InputLabel id="demo-simple-select-label-feeStartingMonth">Fees starting month</InputLabel>
                <Select
                    labelId="demo-simple-select-label-feeStartingMonth"
                    id="demo-simple-select-feeStartingMonth"
                    name='feeStartingMonth'
                    value={`${props.feeStartingMonth}`}
                    label="Fees starting month"
                    onChange={e => props.onChange({ feeStartingMonth: (+e.target.value), admissionDate: props.admissionDate })}
                    required
                >
                    {
                        months.map((month, index) => (
                            <MenuItem
                                key={month}
                                value={`${index}`}
                            >
                                {month}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </>
    )
}

export default AdmissionForm