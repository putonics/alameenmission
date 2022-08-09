import { Box, Button, Grid, Icon } from '@mui/material'
import { Span } from 'app/components/Typography'
import Subject from 'app/redux/classes/students/exam/Subject'
import SubjectGroup from 'app/redux/classes/students/exam/SubjectGroup'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import SubjectForm from './SubjectForm'

/**
 * @param {{subjectGroup: SubjectGroup, onChange: (subjectGroup: SubjectGroup)=>{}, onDelete:Function }} props 
 */
const SubjectGroupForm = props => {
    const [state, setState] = React.useState(props.subjectGroup)

    React.useEffect(() => {
        if (!SubjectGroup.equals(state, props.subjectGroup)) {
            setState(props.subjectGroup)
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
        <ContentBox>
            <StyledCard >
                <TextField
                    label="Subject group name"
                    type="text"
                    name="name"
                    id="standard-basic-vill2"
                    placeholder='Eg.: Laguage group'
                    onChange={handleChange}
                    value={state.name || ''}
                    validators={[
                        'required',
                    ]}
                    errorMessages={['this field is required']}
                />
                {
                    state.subjects.map((subject, i) => (
                        <SubjectForm
                            key={`subject-form-${i}`}
                            index={i}
                            subject={subject}
                            onChange={subject => {
                                const newState = ({ ...state })
                                newState.subjects[i] = subject
                                setState(newState)
                                props.onChange(newState)
                            }}
                            onDelete={() => {
                                const newState = ({ ...state })
                                newState.subjects = newState.subjects.filter((s2, i2) => i2 !== i)
                                setState(newState)
                                props.onChange(newState)
                            }}
                        />
                    ))
                }
                <Grid container spacing={2}>
                    <Grid item>
                        <Button color="primary" variant="contained" type="button"
                            onClick={() => {
                                const newState = { ...state }
                                newState.subjects.push(new Subject().json())
                                setState(newState)
                                props.onChange(newState)
                            }}
                        >
                            <Icon>add</Icon>
                            <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                Add new subject
                            </Span>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button color="error" variant="contained" type="button"
                                onClick={props.onDelete}
                            >
                                <Icon>delete</Icon>
                                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                    Delete this group
                                </Span>
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </StyledCard>
        </ContentBox>
    )
}

export default SubjectGroupForm