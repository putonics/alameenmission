import { Box, Button, Grid, Icon, Typography } from '@mui/material'
import { Span } from 'app/components/Typography'
import Exam from 'app/redux/classes/students/exam/Exam'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import StyledCard from '../styledcomponents/StyledCard'
import GradeView from './GradeView'
import SubjectGroupView from './SubjectGroupView'

export const COLOR = { light: '#7777aa', dark: '#000044' }

/**
 * @param {{exam: Exam}} props 
 */
const ExamView = props => {
    const navigate = useNavigate()
    return (
        <StyledCard sx={{ p: 4 }}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={4} sx={{ display: 'flex' }}>
                        <Typography sx={{ color: COLOR.light }}>
                            Examination:
                        </Typography>
                        <Typography sx={{ color: COLOR.dark, fontWeight: 700, pl: 1 }}>
                            {props.exam.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ display: 'flex' }}>
                        <Typography sx={{ color: COLOR.light }}>
                            Class:
                        </Typography>
                        <Typography sx={{ color: COLOR.dark, fontWeight: 700, pl: 1 }}>
                            {props.exam.pclass}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ display: 'flex' }}>
                        <Typography sx={{ color: COLOR.light }}>
                            Gender:
                        </Typography>
                        <Typography sx={{ color: COLOR.dark, fontWeight: 700, pl: 1 }}>
                            {props.exam.gender}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ display: 'flex' }}>
                        <Typography sx={{ color: COLOR.light }}>
                            Session:
                        </Typography>
                        <Typography sx={{ color: COLOR.dark, fontWeight: 700, pl: 1 }}>
                            {props.exam.sessionFrom} - {props.exam.sessionFrom + 1}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button color='info' variant="contained" type="button"
                            onClick={() => navigate(`/exams/${props.exam.docref.id}`)}
                        >
                            <Icon>edit</Icon>
                            <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                Edit
                            </Span>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {
                props.exam.subjectGroups.map((subjectGroup, i) => (
                    <SubjectGroupView key={`sg-view-${i}`} subjectGroup={subjectGroup} />
                ))
            }
            <Box sx={{ p: 1 }}>
                <Typography sx={{ color: COLOR.light, fontWeight: 700, pt: 1 }}>Grades</Typography>
                <Grid container sx={{ m: 2 }}>
                    {
                        props.exam.grades.map((grade, i) => (
                            <GradeView key={`grade-view-${i}`} grade={grade} index={i} />
                        ))
                    }
                </Grid>
            </Box>
        </StyledCard>
    )
}

export default ExamView