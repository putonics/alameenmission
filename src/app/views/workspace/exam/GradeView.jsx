import { Box, Grid, Typography } from '@mui/material'
import Grade from 'app/redux/classes/students/exam/Grade'
import React from 'react'
import { COLOR } from './ExamView'

/**
 * @param {{index: number, grade: Grade}} props 
 */
const GradeView = props => {
    return (
        <Grid item xs={4} sx={{ p: 1, backgroundColor: props.index % 2 ? '#ffeeee' : '#eeffee' }}>
            <Box sx={{ display: 'flex' }}>
                <Typography sx={{ color: COLOR.dark, fontWeight: 700 }}>{props.grade.code}&nbsp;</Typography>
                (<Typography sx={{ color: COLOR.light }}>{props.grade.title}</Typography>)
                <Typography sx={{ color: COLOR.light }}>&nbsp;for marks&nbsp;</Typography>
                <Typography sx={{ color: COLOR.dark, fontWeight: 700 }}>{props.grade.min}</Typography>
                <Typography sx={{ color: COLOR.light }}>&nbsp;to&nbsp;</Typography>
                <Typography sx={{ color: COLOR.dark, fontWeight: 700 }}>{props.grade.max}</Typography>
            </Box>
        </Grid>
    )
}

export default GradeView