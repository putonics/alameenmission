import { Card } from '@mui/material'
import { styled } from '@mui/system'

const StyledCard = styled(Card)(({ theme }) => ({
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px !important',
    background: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
        padding: '16px !important',
    }
}))

export default StyledCard