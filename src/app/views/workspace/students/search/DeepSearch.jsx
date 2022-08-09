import { Box, Button, Icon, Typography } from '@mui/material'
import { useStudents } from 'app/redux/classes/students/Students'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import StyledCard from '../../styledcomponents/StyledCard'

const DeepSearch = ({ startLoading = () => { }, stopLoading = () => { } }) => {

    const students = useStudents()
    const user = useUser()

    const deepSearch = async (field = '', value = '') => {
        startLoading()
        await students.deepSearch(user.subscriberdocid, field, value)
        stopLoading()
    }

    return (
        <StyledCard>
            <Typography sx={{ color: '#7777cc' }}>Search from all students</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', py: 2 }}>
                <Button variant='outlined' color='error'
                    onClick={() => deepSearch('regno', students.searchText.toUpperCase())}
                >
                    <Icon>search</Icon>
                    Reg. No.
                </Button>
                <Button variant='outlined' color='warning'
                    onClick={() => deepSearch('aadhar', (+students.searchText))}
                >
                    <Icon>search</Icon>
                    Aadhar No.
                </Button>
                <Button variant='outlined' color='success'
                    onClick={() => deepSearch('mobile', (+students.searchText))}
                >
                    <Icon>search</Icon>
                    Phone No.
                </Button>
                <Button variant='outlined' color='info'
                    onClick={() => deepSearch('name', students.searchText.toUpperCase())}
                >
                    <Icon>search</Icon>
                    Student's name
                </Button>
                <Button variant='outlined' color='primary'
                    onClick={() => deepSearch('father.name', students.searchText.toUpperCase())}
                >
                    <Icon>search</Icon>
                    Father's name
                </Button>
            </Box>
        </StyledCard>
    )
}

export default DeepSearch