import { Typography } from '@mui/material'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'

const UnderMaintanance = props => {
    return (
        <ContentBox>
            <Typography sx={{ fontSize: 20, color: '#ffffff' }}>This page is under maintanance</Typography>
        </ContentBox>
    )
}

export default UnderMaintanance