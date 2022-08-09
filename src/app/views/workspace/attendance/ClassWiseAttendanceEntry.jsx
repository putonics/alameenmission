import { Grid, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Icon, TextField } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ClassWiseAttendance from 'app/redux/classes/students/attendance/ClassWiseAttendance'
import React from 'react'
import StudentCard from './StudentCard'

/**
 * @param {{cwa: ClassWiseAttendance}} props 
 */
const ClassWiseAttendanceEntry = props => {

    const handleChange = e => {
        const student = props.cwa.students.find(s => s.regno === e.target.value)
        if (student) {
            props.onAttendance(student)
        }
    }

    return (
        <Accordion expanded={props.expanded} onChange={props.onChange} sx={{ my: 0.5 }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Grid container>
                    <Grid item sm={12} md={3}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography sx={{ color: '#777', fontSize: 20, mr: 2 }}>
                                CLASS
                            </Typography>
                            <Typography sx={{ color: '#ff0088', fontSize: 20, fontWeight: 700 }}>
                                {props.cwa.pclass}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={3}>
                        <Box sx={{ display: 'flex' }}>
                            {
                                props.gender === 'MALE'
                                    ? <Icon sx={{ color: '#00aaff' }} >boy</Icon>
                                    : <Icon sx={{ color: '#ff00aa' }} >girl</Icon>
                            }
                            <Typography sx={{ color: '#777777', fontSize: 18 }}>{props.gender}</Typography>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={3}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography sx={{ color: '#777', fontSize: 20, mr: 2 }}>
                                SESSION
                            </Typography>
                            <Typography sx={{ color: '#ff00ff', fontSize: 20, fontWeight: 700 }}>
                                {props.cwa.sessionFrom}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={3}>
                        <Box sx={{ display: 'flex' }}>
                            <TextField
                                inputProps={{ sx: { py: 1 } }}
                                onClick={e => e.stopPropagation()}
                                label="Reg no."
                                type="regno"
                                onChange={handleChange}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ background: '#333355', p: 2, borderRadius: 2, border: '1px solid #ccc', m: 2, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {
                        props.cwa.students.sort((a, b) => a.present - b.present).map(student => (
                            <StudentCard student={student} key={student.regno} onAttendance={props.onAttendance} />
                        ))
                    }
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

export default ClassWiseAttendanceEntry