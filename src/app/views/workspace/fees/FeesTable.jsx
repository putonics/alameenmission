import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, TableHead, TableBody, TableRow, TableCell, Icon, IconButton, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/system'
import StyledTable from '../styledcomponents/StyledTable'
import { NavLink } from 'react-router-dom'
import FeesRow from './FeesRow'
import Fee from 'app/redux/classes/fees/Fee'
import { useFees } from 'app/redux/classes/fees/Fees'
import ContentBox from '../styledcomponents/ContentBox'
import FeeMenu from './FeeMenu'

/**
 * @parents FeesWorkspace
 * @param {{pclass: string, confirm}} props 
 */
const FeesTable = props => {
    const [fees, setFees] = React.useState([new Fee({ pclass: props.pclass })])
    const feesDoc = useFees()
    React.useEffect(() => {
        setFees(feesDoc.getAllFees(props.pclass))
    }, [props])

    const [anchorEl, setAnchorEl] = React.useState(null)
    return (
        <ContentBox>
            <Accordion expanded={props.expanded} onChange={props.onChange} sx={{ my: 0.5 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ fontWeight: '800' }}>
                        Class {props.pclass} : Fees Structures
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box width="100%" overflow="auto">
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell width='50px'>
                                        <NavLink to={`/fees/entry/${props.pclass}/new`}>
                                            <IconButton color='default'>
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </NavLink>
                                    </TableCell>
                                    <TableCell align="center">One-time fees</TableCell>
                                    <TableCell align="center">Yearly fees</TableCell>
                                    <TableCell align="center">Monthly fees</TableCell>
                                    <TableCell align="center">Total fees</TableCell>
                                    <TableCell width='50px'>
                                        <IconButton
                                            color='default'
                                            onClick={e => setAnchorEl(e.currentTarget)}
                                        >
                                            <Icon>content_copy</Icon>
                                        </IconButton>
                                        <FeeMenu pclass={props.pclass} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    fees.map((fee, index) => (
                                        <FeesRow key={`feesrow${props.pclass}${index}`} fee={fee} index={index} />
                                    ))
                                }
                            </TableBody>
                        </StyledTable>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </ContentBox>
    )
}

export default FeesTable