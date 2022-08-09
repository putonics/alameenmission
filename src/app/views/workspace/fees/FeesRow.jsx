import React from 'react'
import { IconButton, TableRow, TableCell, Icon } from '@mui/material'
import Fee from 'app/redux/classes/fees/Fee'
import { useNavigate } from 'react-router-dom'

/**
 * @param {{fee :Fee, index: number}} props 
 * @returns 
 */
const FeesRow = props => {

    const [state, setState] = React.useState({
        totalOneTimeFees: 0,
        totalYearlyFees: 0,
        totalMonthlyFees: 0,
        totalFees: 0,
    })

    React.useEffect(() => {
        setState({
            totalOneTimeFees: props.fee.totalOneTimeFees(),
            totalYearlyFees: props.fee.totalYearlyFees(),
            totalMonthlyFees: props.fee.totalMonthlyFees(),
            totalFees: props.fee.totalFees(),
        })
    }, [props])

    const navigate = useNavigate()

    return (
        <TableRow>
            <TableCell align="center">
                {props.index + 1}
            </TableCell>
            <TableCell align="center">
                ₹{state.totalOneTimeFees}
            </TableCell>
            <TableCell align="center">
                ₹{state.totalYearlyFees}
            </TableCell>
            <TableCell align="center">
                ₹{state.totalMonthlyFees}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: '700' }}>
                ₹{state.totalFees}
            </TableCell>
            <TableCell>
                <IconButton
                    onClick={e => navigate(`/fees/entry/${props.fee.pclass}/${props.fee.totalMonthlyFees()}`)}
                >
                    <Icon>edit</Icon>
                </IconButton>
            </TableCell>
        </TableRow >
    )
}

export default FeesRow