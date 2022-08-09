import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import SubjectGroup from 'app/redux/classes/students/exam/SubjectGroup'
import React from 'react'
import { COLOR } from './ExamView'
import SubjectView from './SubjectView'

/**
 * @param {{subjectGroup: SubjectGroup}} props 
 */
const SubjectGroupView = props => {
    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={1}>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ color: COLOR.dark, fontWeight: 700 }}>{props.subjectGroup.name}</Typography>
                </Grid>
                <Grid item xs={10} sx={{ borderRadius: 4, borderLeft: '2px solid #77aaaa' }}>
                    {
                        props.subjectGroup.subjects.map((subject, i) => (
                            <SubjectView subject={subject} key={`subject-view-${i}`} />
                        ))
                    }
                </Grid>
            </Grid>
        </Box>
    )
}

export default SubjectGroupView