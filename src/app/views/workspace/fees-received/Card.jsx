import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { APIURL, images } from 'app/redux/classes/Constants'
import { format } from 'date-fns'
import { Span } from 'app/components/Typography'
import { useNavigate } from 'react-router-dom'

const Field = props => {
    return (
        <Box sx={{
            paddingHorizontal: '4px', backgroundColor: props.backColor, width: '100%',
            display: 'flex', flexDirection: 'row', fontSize: '8px', paddingVertical: '1px'
        }}>
            <Typography sx={{ color: '#777777' }}>{props?.name}:</Typography>
            <Typography sx={{ color: '#000000', marginLeft: '4px' }}>{props?.value}</Typography>
        </Box>
    )
}

const Card = props => {

    const navigate = useNavigate()

    return (
        <Box sx={{
            backgroundColor: '#ffffff',
            border: '1px solid #cccccc',
            margin: '0.5cm',
            padding: '4px',
            display: 'flex', flexDirection: 'row'
        }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <img
                    src={`${APIURL}/avatars/${props?.student?.regno}_${images[0].name}.jpg?${props?.student?.modifiedon}`}
                    style={{ width: '2cm', height: '2cm' }}
                />
                <Box sx={{ flexGrow: 1, marginLeft: '2px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Field backColor='#ffccee88' name='Name' value={props?.student?.name} />
                        <Field backColor='#ccffdd88' name='Class' value={props?.student?.pclass} />
                        <Field backColor='#ffccee88' name='D.O.B' value={format(new Date(props?.student?.dob || 0), "dd/MM/yyyy")} />
                        <Field backColor='#ccddff88' name='C/O' value={props?.student?.father?.name} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Field backColor='#ccddff88' name='Reg. no.' value={props?.student?.regno} />
                        <Field backColor='#ffccee88' name='Session from ' value={props?.student?.sessionFrom} />
                        <Field backColor='#ccddff88' name='to ' value={props?.student?.sessionTo} />
                        <Field backColor='#ffccee88' name='Mob.' value={props?.student?.mobile} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: 1 }}>
                        <Field backColor='#ffccee88' name='Total ₹' value={props?.paid + props?.due} />
                        <Field backColor='#ccddff88' name='Paid ₹' value={props?.paid} />
                        <Field backColor='#ffccee88' name='Due ₹' value={props?.due} />
                    </Box>
                </Box>
            </Box>
            <Button color="success" variant="outlined" type="submit"
                disabled={!Boolean(props.paid) || Boolean(props.cashPaid)}
                onClick={() => navigate(`bill/${props.student.docref.id}`)}
            >
                <Span sx={{ textTransform: 'capitalize' }}>
                    Generate bill
                </Span>
            </Button>
        </Box>
    )
}

export default Card