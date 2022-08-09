import { Box, Typography } from '@mui/material'
import React from 'react'
import Assets from '../../../../assets'
import { APIURL, images } from 'app/redux/classes/Constants'
import { format } from 'date-fns'

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

const BottomField = props => {
    return (
        <Box sx={{
            paddingHorizontal: '4px', backgroundColor: props.backColor, width: '100%',
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            fontSize: '8px', paddingVertical: '1px'
        }}>
            <Typography sx={{ color: '#000000' }}>{props?.val1}</Typography>
            <Typography sx={{ color: '#777777', fontStyle: 'italic' }}>{props?.val2}</Typography>
        </Box>
    )
}

const Card = props => {
    return (
        <Box sx={{
            width: '10cm',
            backgroundColor: '#ffffff',
            border: '1px solid #cccccc',
            margin: '0.5cm',
            padding: '4px'
        }}>
            {/* <Box
                sx={{
                    flexDirection: 'row', alignItems: 'center',
                    paddingVertical: '4px', paddingHorizontal: '2px',
                    backgroundColor: props.visitor ? ['FATHER', 'MOTHER'].includes(props.visitor.relation) ? '#00ff88' : '#ffffff' : '#440099',
                    color: props.visitor ? '#000066' : '#ffffff'
                }}
            >
                <img src={Assets.logo} style={{ width: 40, height: 40 }} />
                <Box sx={{ flexGrow: 1, marginLeft: '4px' }}>
                    <Box sx={styles.title}><Typography>{props?.institute?.institute}</Typography></Box>
                    <Box sx={styles.subtitle}><Typography>{props?.institute?.place}</Typography></Box>
                    <Box sx={styles.subtitle2}>
                        <Typography>{props?.institute?.phone} {props?.institute?.email}</Typography>
                    </Box>
                </Box>
            </Box> */}
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                <img
                    src={`${APIURL}/avatars/${props?.student?.regno}_${images[0].name}.jpg?${props?.student?.modifiedon}`}
                    style={{ width: '2cm', height: '2cm' }}
                />
                <Box sx={{ flexGrow: 1, marginLeft: '2px' }}>
                    <Field backColor='#ccffdd88' name='Name' value={props?.student?.name} />
                    <Field backColor='#ccddff88' name='C/O' value={props?.student?.father?.name} />
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Field backColor='#ffccee88' name='Reg. no.' value={props?.student?.regno} />
                        <Field backColor='#ffccee88' name='Year' value={props?.student?.sessionFrom} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Field backColor='#ccffdd88' name='Class' value={props?.student?.pclass} />
                        <Field backColor='#ccffdd88' name='D.O.B' value={format(new Date(props?.student?.dob || 0), "dd/MM/yyyy")} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Field backColor='#ccddff88' name='Blood gr.' value={props?.student?.bloodGroup} />
                        <Field backColor='#ccddff88' name='Mob.' value={props?.student?.mobile} />
                    </Box>
                </Box>
            </Box>
            {
                props?.visitor
                    ?
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <img
                                src={`${APIURL}/avatars/${props?.student?.regno}_${props?.imageName}.jpg?${props?.student?.modifiedon}`}
                                sx={{ width: '2cm', height: '2cm' }}
                            />
                            <Box sx={{ flexGrow: 1, marginLeft: '2px' }}>
                                <Field backColor='#ffccee88' name={`Visitor (${props?.visitor?.relation})`} value={props?.visitor?.name} />
                                <Field backColor='#ccddff88' name="Visitor's mob." value={props?.visitor?.mobile} />
                                <Field backColor='#ccffdd88' name='Vill.' value={props?.student?.addressPresent.vill} />
                                <Field backColor='#ccddff88' name='P.S' value={props?.student?.addressPresent.ps} />
                                <Field backColor='#ccffdd88' name='Dist.' value={props?.student?.addressPresent.dist} />
                            </Box>
                        </Box>
                        <BottomField backColor='#ccddff88' val1={`Visit: ${props?.visitingDay}`} val2='' />
                    </>
                    :
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Field backColor='#ccffdd88' name='Vill.' value={props?.student?.addressPresent.vill} />
                                <Field backColor='#ccddff88' name='P.S' value={props?.student?.addressPresent.ps} />
                                <Field backColor='#ccffdd88' name='Dist.' value={props?.student?.addressPresent.dist} />
                            </Box>
                        </Box>
                        {/* <BottomField backColor='#ccddff88' val1=' ' val2=' ' />
                        <BottomField backColor='#ccffdd88' val1=' ' val2=' ' />
                        <BottomField backColor='#ccddff88' val1=' ' val2='Signature of Incharge' /> */}
                    </>
            }
        </Box>
    )
}

export default Card