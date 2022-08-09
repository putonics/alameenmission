import Subject from 'app/redux/classes/students/exam/Subject'
import React from 'react'
import TextField from '../styledcomponents/TextField'
import { Box, Button, FormControl, Grid, Icon, MenuItem } from '@mui/material'
import { Span } from 'app/components/Typography'
import ExamType from 'app/redux/classes/students/exam/ExamType'
import ExamTypeForm from './ExamTypeForm'
import { subjectCodes } from 'app/redux/classes/Constants'
import InputLabel from '../styledcomponents/InputLabel'
import Select from '../styledcomponents/Select'
import ContentBox from '../styledcomponents/ContentBox'


const BGCOLORS = ['#ffeeee', '#eeffee', '#eeeeff', '#ffffee', '#eeffff', '#ffeeff']

/**
 * @param {{index: number, subject: Subject, onChange: (subject: Subject)=>{}, onDelete: Function}} props 
 */
const SubjectForm = props => {

    const [state, setState] = React.useState(props.subject)

    React.useEffect(() => {
        if (!Subject.equals(state, props.subject)) {
            setState(props.subject)
        }
    }, [props])

    const handleChange = (event) => {
        try { event.persist() } catch (ex) { }
        const newState = ({
            ...state,
            [event.target.name]: event.target.value,
        })
        setState(newState)
        props.onChange(newState)
    }

    return (
        <ContentBox sx={{
            p: 4, borderRadius: 4, backgroundColor: BGCOLORS[props.index % 6]
        }}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <FormControl sx={{ mb: 3, width: '100%' }}>
                        <InputLabel id="demo-simple-select-label">Subject code</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select-code"
                            name='code'
                            value={state.code}
                            label="Subject code"
                            onChange={handleChange}
                            required
                        >
                            {
                                subjectCodes.map(subjectCode => (
                                    <MenuItem
                                        key={subjectCode}
                                        value={subjectCode}
                                    >
                                        {subjectCode}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={9}>
                    <TextField
                        fullWidth
                        label="Subject name"
                        type="text"
                        name="name"
                        id="standard-basic-vill2"
                        onChange={handleChange}
                        value={state.name || ''}
                        validators={[
                            'required',
                        ]}
                        errorMessages={['this field is required']}
                    />
                </Grid>
            </Grid>
            <Box sx={{ pl: 4 }}>
                {
                    state.examTypes.map((examType, i) => (
                        <ExamTypeForm
                            key={`examType${i}`}
                            examType={examType}
                            onChange={examType => {
                                const newState = { ...state }
                                newState.examTypes[i] = examType
                                setState(newState)
                                props.onChange(newState)
                            }}
                        />
                    ))
                }
                <Grid container spacing={4}>
                    <Grid item>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button color="primary" variant="contained" type="button"
                                onClick={() => {
                                    const newState = { ...state }
                                    newState.examTypes.push(new ExamType().json())
                                    setState(newState)
                                    props.onChange(newState)
                                }}
                            >
                                <Icon>add</Icon>
                                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                    Exam Type, Date &amp; Time
                                </Span>
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button color="error" variant="contained" type="button"
                                onClick={props.onDelete}
                            >
                                <Icon>delete</Icon>
                                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                    Delete this subject
                                </Span>
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ContentBox>
    )
}

export default SubjectForm