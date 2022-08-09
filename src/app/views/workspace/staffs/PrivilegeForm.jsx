import { Checkbox, FormControlLabel, FormGroup, Grid, Icon, Typography } from '@mui/material'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import workspaceRoutes from '../WorkspaceRoutes'

const equals = (ps1, ps2) => Boolean(
    ps1 && ps2
    && ps1.length === ps2.length
    && ps1.filter(p1 => ps2.includes(p1)).length === ps1.length
)

/**
 * @param {{privilege: Array<string>, onChange:(privilege: Array<string>)=>{}, title: string }} props 
 */
const PrivilegeForm = props => {
    const [state, setState] = React.useState(props.privilege)

    React.useEffect(() => {
        if (!equals(props.privilege, state)) {
            setState(props.privilege)
        }
    }, [props])

    React.useEffect(() => {
        if (!equals(props.privilege, state)) {
            props.onChange(state)
        }
    }, [state])

    return (
        <ContentBox>
            <StyledCard sx={{ border: '2px solid #00aa44', borderBottomWidth: '6px' }}>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#555577' }}>
                    <Icon>security</Icon>
                    {props.title || "User Privileges"}
                </Typography>
                <FormGroup>
                    <Grid container>
                        {
                            workspaceRoutes.filter(r => r.privilege).map(r => (
                                <Grid item xs={4} key={'privilege' + r.privilege}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={state.includes(r.privilege)}
                                                onChange={e => {
                                                    if (state.includes(r.privilege) && !e.target.checked) {
                                                        setState(state.filter(p => p !== r.privilege))
                                                    } else if (!state.includes(r.privilege) && e.target.checked) {
                                                        setState([...state, r.privilege])
                                                    }
                                                }}
                                            />
                                        }
                                        label={r.privilege}
                                        value={r.privilege}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                </FormGroup>
            </StyledCard>
        </ContentBox>
    )
}

export default PrivilegeForm