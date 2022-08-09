import { Grid, Typography } from '@mui/material'
import Subject from 'app/redux/classes/students/exam/Subject'
import { format } from 'date-fns'
import React from 'react'
import { COLOR } from './ExamView'
import { Box } from '@mui/system'

/**
 * @param {{subject: Subject}} props 
 */
const SubjectView = props => {
    return (
        <Box sx={{ borderRadius: 2, my: 1, overflow: 'hidden' }}>
            {
                props.subject.examTypes.map((examType, i) => (
                    <Box key={`exmtype-view-${i}`} sx={{ p: 1, backgroundColor: i % 2 ? '#ffeeee' : '#eeeeff' }}>
                        <Grid container spacing={1} >
                            <Grid item xs={1}>
                                <Typography sx={{ color: COLOR.dark }}>{props.subject.code}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography sx={{ color: COLOR.dark }}>{props.subject.name}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography sx={{ color: COLOR.dark }}>{examType.type}</Typography>
                            </Grid>
                            <Grid item xs={1} sx={{ display: 'flex' }}>
                                <Typography sx={{ color: COLOR.light }}>F.M.: </Typography>
                                <Typography sx={{ color: COLOR.dark, fontWeight: 700 }}>{examType.fullMarks}</Typography>
                            </Grid>
                            <Grid item xs={1} sx={{ display: 'flex' }}>
                                <Typography sx={{ color: COLOR.light }}>P.M.: </Typography>
                                <Typography sx={{ color: COLOR.dark, fontWeight: 700 }}>{examType.passMarks}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography sx={{ color: COLOR.dark }}>{format(new Date(examType.timestamp), 'dd-MMM-yyyy')}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography sx={{ color: COLOR.dark }}>{format(new Date(examType.timestamp), 'hh:mm a')}</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography sx={{ color: COLOR.dark }}>{examType.teacherRegno}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                ))
            }
        </Box>
    )
}

export default SubjectView