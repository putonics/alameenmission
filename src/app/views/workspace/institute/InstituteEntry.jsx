import { Box, Button, Grid, Icon } from '@mui/material'
import { Span } from 'app/components/Typography'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import { useInstitutes } from 'app/redux/classes/Institutes'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator'
import TableSkeleton from '../skeleton/TableSkeleton'
import ContentBox from '../styledcomponents/ContentBox'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'
import Password from './Password'

const InstituteEntry = props => {

    const topbarControl = useTopbarControl()//redux
    React.useEffect(() => {
        topbarControl.setControlBox(<></>)
    }, [])

    const [busy, setBusy] = React.useState(false)

    const [state, setState] = React.useState({
        institute: '', district: '', branch: '', place: '',
        email: '', phone: ''
    })

    const user = useUser()
    const institutes = useInstitutes()
    React.useEffect(() => {
        setBusy(true)
        if (!institutes.list.length) {
            institutes.load()
        } else {
            const institute = institutes.getInstitute(user.subscriberdocid)
            if (institute) {
                setState(institute.json())
                setBusy(false)
            }
        }
    }, [institutes])

    const handleSubmit = () => {
        setBusy(true)
        const institute = institutes.getInstitute(user.subscriberdocid)
        institutes.update(institute, state).finally(() => setBusy(false))
    }

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }

    return (
        <ContentBox>
            <StyledCard>
                {
                    busy
                        ?
                        <TableSkeleton cols={3} rows={4} />
                        :
                        <ValidatorForm
                            onSubmit={() => confirm(handleSubmit)}
                            onError={errors => alert(JSON.stringify(errors))}
                        >
                            <TextField
                                label="Institute name"
                                type="text"
                                name="institute"
                                onChange={e => setState({ ...state, institute: e.target.value })}
                                value={state.institute || ''}
                                validators={['required']}
                                errorMessages={['this field is required']}
                                fullWidth
                                autoFocus
                            />
                            <TextField
                                label="Institute address"
                                type="text"
                                name="place"
                                onChange={e => setState({ ...state, place: e.target.value })}
                                value={state.place || ''}
                                validators={['required']}
                                errorMessages={['this field is required']}
                                fullWidth
                                autoFocus
                            />
                            <Grid container gap={2}>
                                <Grid item>
                                    <TextField
                                        label="District"
                                        type="text"
                                        name="district"
                                        // onChange={e => setState({ ...state, district: e.target.value })}
                                        value={state.district || ''}
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Branch"
                                        type="text"
                                        name="branch"
                                        // onChange={e => setState({ ...state, branch: e.target.value })}
                                        value={state.branch || ''}
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Email"
                                        type="email"
                                        name="email"
                                        onChange={e => setState({ ...state, email: e.target.value })}
                                        value={state.email || ''}
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Contact no."
                                        type="text"
                                        name="phone"
                                        onChange={e => setState({ ...state, phone: e.target.value })}
                                        value={state.phone || ''}
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item>
                                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button color="primary" variant="contained" type="submit"
                                            disabled={!(state.institute && state.district && state.branch && state.place && state.email && state.phone)}
                                        >
                                            <Icon>send</Icon>
                                            <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                                Save
                                            </Span>
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                }
            </StyledCard>
            {user.role === 'BRANCH ADMIN' ? <Password /> : <></>}
        </ContentBox>
    )
}

export default InstituteEntry