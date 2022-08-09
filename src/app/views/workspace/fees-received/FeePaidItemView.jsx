import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { months } from 'app/redux/classes/Constants'
import FeePaidItem from 'app/redux/classes/fees-received/FeePaidItem'
import { format } from 'date-fns'
import DateDialog from './DateDialog'
/**
* @param {{index:number, feePaidItem: FeePaidItem, onChange: (paidon: Date)=>{}, , onCancel: ()=>{} }} props 
*/
const FeePaidItemView = props => {

    const [paidon, setPaidon] = React.useState(new Date())

    const reset = () => {
        if (props.feePaidItem.paidon) {
            setPaidon(new Date(props.feePaidItem.paidon))
        } else {
            setPaidon(new Date())
        }
    }

    React.useEffect(() => {
        reset()
    }, [props])

    const [open, setOpen] = React.useState(false)
    const [changed, setChanged] = React.useState(false)

    return (
        <Box sx={{ background: props.index % 2 ? '#ddddff99' : '#eeeeff99' }}>
            <Grid container>
                <Grid item xs={2}>
                    <Typography>
                        {props.feePaidItem.month >= 0 ? months[props.feePaidItem.month % 12] : ''} {props.feePaidItem.year}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>{props.feePaidItem.head}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography sx={{ textAlign: 'right' }}>{props.feePaidItem.amount}</Typography>
                </Grid>
                <Grid item xs={4}
                    sx={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                        pl: 1, cursor: 'pointer',
                        background: changed || open ? '#ffffaa88' : 'inherit'
                    }}
                >
                    {
                        props.feePaidItem.paidon
                            ?
                            <Typography sx={{ color: '#00bb66' }} onClick={() => {
                                if (changed) {
                                    setOpen(true)
                                }
                            }}>
                                {changed ? '' : '✅'}
                                PAID on {format(paidon, "dd/MM/yyyy")}
                            </Typography>
                            :
                            <Typography sx={{ color: '#ff0066' }} onClick={() => setOpen(true)}>
                                ❗DUE
                            </Typography>
                    }
                    {
                        props.feePaidItem.paidon && changed
                            ?
                            <Typography sx={{ color: '#ff0066', px: 1 }} onClick={props.onCancel}>
                                Cancel
                            </Typography>
                            : <></>
                    }
                </Grid>
            </Grid>
            <DateDialog
                date={paidon}
                open={open}
                onClose={() => setOpen(false)}
                onChange={date => {
                    setOpen(false)
                    setChanged(true)
                    props.onChange(date)
                }}
            />
        </Box >
    )
}

export default FeePaidItemView