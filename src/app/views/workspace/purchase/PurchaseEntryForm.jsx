import { Button, Icon, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Span } from 'app/components/Typography'
import { useItems } from 'app/redux/classes/Items'
import React, { Fragment } from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { useNavigate, useParams } from 'react-router-dom'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import TextField from '../styledcomponents/TextField'

const PurchaseEntryForm = () => {
    const { docid } = useParams()
    const items = useItems()
    const [state, setState] = React.useState({ edit: false })

    React.useEffect(() => {
        if (!items.loaded) {
            items.fetch()
        } else {
            const item = items.list.find(item => item.docref.id === docid)
            if (item) {
                setState({
                    itemname: item.itemname,
                    manufacturer: item.manufacturer,
                    itemdescription: item.itemdescription,
                    edit: true,
                    item: item,
                })
            } else {
                setState({ edit: false })
            }
        }
    }, [items])

    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        if (state.edit) {
            await items.update(state.item, state,
                () => { navigate('/items') },
                () => { }
            )
        } else {
            await items.insert(state,
                () => { navigate('/items') },
                () => { }
            )
        }
    }

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    return (
        <Fragment>
            <ContentBox>
                <StyledCard>
                    <Box mb="12px">
                        <Heading>{state.edit ? 'Edit item details' : 'Enter new Item'}</Heading>
                    </Box>
                    <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    label="Toy's name"
                                    type="text"
                                    name="itemname"
                                    id="standard-basic"
                                    onChange={handleChange}
                                    value={state.itemname || ''}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    label="Manufacturer's Name"
                                    type="text"
                                    name="manufacturer"
                                    onChange={handleChange}
                                    value={state.manufacturer || ''}
                                // validators={['required']}
                                // errorMessages={['this field is required']}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    sx={{ mb: 4 }}
                                    label="Toy's description"
                                    onChange={handleChange}
                                    type="text"
                                    name="itemdescription"
                                    value={state.itemdescription || ''}
                                // validators={['required']}
                                // errorMessages={['this field is required']}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} textAlign={{ xs: 'center', md: 'right' }}>
                                <Button color="primary" variant="contained" type="submit">
                                    <Icon>send</Icon>
                                    <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                                        Submit
                                    </Span>
                                </Button>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </StyledCard>
            </ContentBox>
        </Fragment>
    )
}

export default PurchaseEntryForm
