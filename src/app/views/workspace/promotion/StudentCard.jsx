import React from 'react'
import { Avatar, Typography, Box } from '@mui/material'
import { APIURL, images, months } from 'app/redux/classes/Constants'
import StyledCard from '../styledcomponents/StyledCard'

/**
 * @param {{ 
 *      name: string, regno: string, sessionFrom: number, 
 *      pclass: string, admissionDate: Date, fee: number, 
 *      feeStartingMonth: number
 * }} props 
 */
const StudentCard = props => {
    const [url, setUrl] = React.useState('')

    React.useEffect(() => {
        setUrl(`${APIURL}/avatars/${props?.regno}_${images[0].name}.jpg`)
    }, [props])

    return (
        <StyledCard>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2 }}>
                <Avatar src={url} />
                <Box>
                    <Typography>{props?.name}</Typography>
                    <Typography sx={{ color: '#444488', fontWeight: 800 }}>{props?.regno}</Typography>
                </Box>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#aaaacc' }}>Session: </Typography>
                    <Typography sx={{ color: '#444488', fontWeight: 800 }}>{`${props?.sessionFrom}-${props?.sessionFrom % 100 + 1}`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#aaaacc' }}>Class: </Typography>
                    <Typography sx={{ color: '#444488', fontWeight: 800 }}>{props?.pclass}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#aaaacc' }}>Admission date: </Typography>
                    <Typography sx={{ color: '#444488', fontWeight: 800 }}>{new Date(props?.admissionDate).toDateString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#aaaacc' }}>Fees starting month: </Typography>
                    <Typography sx={{ color: '#444488', fontWeight: 800 }}>{months[+ (props?.feeStartingMonth || 0)]}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#aaaacc' }}>Monthly fees: ₹ </Typography>
                    <Typography sx={{ color: '#444488', fontWeight: 800 }}>{props?.fee}</Typography>
                </Box>
            </Box>
        </StyledCard >
    )
}

export default StudentCard