import React from 'react'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import TopBar from './TopBar'
import StyledTable from '../styledcomponents/StyledTable'
import ContentBox from '../styledcomponents/ContentBox'
// import StaffView from './StaffView'
import { useStaffs } from 'app/redux/classes/staffs/Staffs'
import { Button, Icon, IconButton, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { NavLink } from 'react-router-dom'
import StaffView from './StaffView'

const StaffWorkspace = props => {

    const topbarControl = useTopbarControl()

    React.useEffect(() => {
        topbarControl.setControlBox(<TopBar />)
    }, [])

    const staffs = useStaffs()

    return (
        <ContentBox>
            {
                staffs.list.length
                    ?
                    <StyledTable>
                        <TableHead>
                            <TableRow>
                                <TableCell width='50px'>
                                    <NavLink to='/staffs/new'>
                                        <IconButton color='default'>
                                            <Icon>add</Icon>
                                        </IconButton>
                                    </NavLink>
                                </TableCell>
                                <TableCell>
                                    Staff id
                                </TableCell>
                                <TableCell>
                                    Staff's name
                                </TableCell>
                                <TableCell>
                                    Designation
                                </TableCell>
                                <TableCell>
                                    Mobile No
                                </TableCell>
                                <TableCell>
                                    Email id
                                </TableCell>
                                <TableCell>
                                    Caste
                                </TableCell>
                                <TableCell>
                                    Sex
                                </TableCell>
                                <TableCell width='50px'>
                                    <IconButton
                                        color='default'
                                    // onClick={e => setAnchorEl(e.currentTarget)}
                                    >
                                        <Icon>settings</Icon>
                                    </IconButton>
                                    {/* <TableSettingsMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} /> */}
                                </TableCell>
                            </TableRow>
                        </TableHead >
                        <TableBody>
                            {
                                staffs.list.map((staff, i) => (
                                    <StaffView key={`staff-view-${i}`} staff={staff} />
                                ))
                            }
                        </TableBody>
                    </StyledTable >
                    :
                    <div>Please add a staff first</div>
            }
        </ContentBox>
    )
}

export default StaffWorkspace