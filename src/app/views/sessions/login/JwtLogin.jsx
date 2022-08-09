import { Card, Grid, Button, Checkbox, CircularProgress, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, styled, useTheme } from '@mui/system'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { Paragraph } from 'app/components/Typography'
import { useInstitutes } from 'app/redux/classes/Institutes'
import { useUser } from 'app/redux/classes/User'
// import jwt from 'jsonwebtoken'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'center',
}))

const ContentBox = styled(Box)(() => ({
    height: '100%',
    padding: '32px',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const IMG = styled('img')(() => ({
    width: '100%',
}))

const JWTRoot = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100% !important',
    '& .card': {
        maxWidth: 800,
        borderRadius: 12,
        margin: '1rem',
    },
}))

const StyledProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '6px',
    left: '25px',
}))

const JwtLogin = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        subscriberdocid: ''
    })
    const [message, setMessage] = useState('')

    const handleChange = ({ target: { name, value } }) => {
        let temp = { ...userInfo }
        temp[name] = value
        setUserInfo(temp)
    }

    const { palette } = useTheme()
    const textError = palette.error.main
    const textPrimary = palette.primary.main

    const user = useUser()

    const handleFormSubmit = async (event) => {
        setLoading(true)
        try {
            await user.signin(userInfo.email, userInfo.password, userInfo.subscriberdocid)
            if (!user.loggedin) {
                setMessage('Wrong email or password')
                setLoading(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const institutes = useInstitutes()
    React.useEffect(() => {
        institutes.load().then(() => {
            if (institutes.loaded) {
                setUserInfo({ ...userInfo, subscriberdocid: institutes.list[0].subscriberdocid })
            }
        })
    }, [])

    React.useEffect(() => {
        if (!user.loggedin) {
            user.loadProfile()
        }
    }, [user])

    return (
        <JWTRoot>
            <Card className="card">
                {/* <h4>{jwt.sign('memarialameen@gmail.com', 'memarialameen@gmail.comALAMEENMISSION-PURBABARDHAMAN-DURGADANGA')}</h4> */}
                <Grid container>
                    <Grid item lg={5} md={5} sm={5} xs={12}>
                        <JustifyBox p={4} height="100%">
                            <IMG
                                src="/assets/images/illustrations/dreamer.svg"
                                alt=""
                            />
                        </JustifyBox>
                    </Grid>
                    <Grid item lg={7} md={7} sm={7} xs={12}>
                        <ContentBox>
                            <ValidatorForm onSubmit={handleFormSubmit}>
                                <FormControl sx={{ mb: 3, width: '100%' }}>
                                    <InputLabel id="demo-simple-select-label">Al Ameen Mission</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name='subscriberdocid'
                                        value={userInfo.subscriberdocid}
                                        label="Al Ameen Mission"
                                        size='small'
                                        onChange={handleChange}
                                        required
                                    >
                                        {
                                            institutes.list.map(institute => (
                                                <MenuItem
                                                    key={institute.subscriberdocid}
                                                    value={institute.subscriberdocid}
                                                >
                                                    {institute.branch}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <TextValidator
                                    sx={{ mb: 3, width: '100%' }}
                                    variant="outlined"
                                    size="small"
                                    label="Email"
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    validators={['required', 'isEmail']}
                                    errorMessages={[
                                        'this field is required',
                                        'email is not valid',
                                    ]}
                                />
                                <TextValidator
                                    sx={{ mb: '12px', width: '100%' }}
                                    label="Password"
                                    variant="outlined"
                                    size="small"
                                    onChange={handleChange}
                                    name="password"
                                    type="password"
                                    value={userInfo.password}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                                <FormControlLabel
                                    sx={{ mb: '12px', maxWidth: 288 }}
                                    name="agreement"
                                    onChange={handleChange}
                                    control={
                                        <Checkbox
                                            size="small"
                                            onChange={({
                                                target: { checked },
                                            }) =>
                                                handleChange({
                                                    target: {
                                                        name: 'agreement',
                                                        value: checked,
                                                    },
                                                })
                                            }
                                            checked={userInfo.agreement || true}
                                        />
                                    }
                                    label="Remeber me"
                                />

                                {message && (
                                    <Paragraph sx={{ color: textError }}>
                                        {message}
                                    </Paragraph>
                                )}

                                <FlexBox mb={2} flexWrap="wrap">
                                    <Box position="relative">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                            type="submit"
                                        >
                                            Sign in
                                        </Button>
                                        {loading && (
                                            <StyledProgress
                                                size={24}
                                                className="buttonProgress"
                                            />
                                        )}
                                    </Box>
                                </FlexBox>
                                <Button
                                    sx={{ color: textPrimary }}
                                    onClick={() =>
                                        navigate('/session/forgot-password')
                                    }
                                >
                                    Forgot password?
                                </Button>
                            </ValidatorForm>
                        </ContentBox>
                    </Grid>
                </Grid>
            </Card>
        </JWTRoot>
    )
}

export default JwtLogin
