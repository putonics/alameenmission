import { Checkbox, FormControlLabel, FormGroup, Grid } from '@mui/material'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'

/**
 * @param {{showInAttendanceList: boolean, onChange:(showInAttendanceList: boolean)=>{}, 
 * onNicknameChange:()=>{}, nickname: string,
 * title: string }} props 
 */
const ShowInAttendanceListForm = props => {
    return (
        <ContentBox>
            <StyledCard sx={{ border: '2px solid #00aa44', borderBottomWidth: '6px' }}>
                <Grid container>
                    <Grid item>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={props.showInAttendanceList}
                                        onChange={e => props.onChange(!props.showInAttendanceList)}
                                    />
                                }
                                label={'Show in attendance list'}
                                value={'Show in attendance list'}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item>
                        {
                            props.showInAttendanceList
                                ?
                                <TextField
                                    label="Short name"
                                    onChange={e => props.onNicknameChange(e.target.value)}
                                    type="text"
                                    name="nickname"
                                    value={props.nickname || ''}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    inputProps={{ style: { textTransform: "uppercase" } }}
                                />
                                : <></>
                        }
                    </Grid>
                </Grid>
            </StyledCard>
        </ContentBox>
    )
}

export default ShowInAttendanceListForm