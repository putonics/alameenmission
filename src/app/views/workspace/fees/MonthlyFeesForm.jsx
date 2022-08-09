import React from 'react'
import { Icon, Typography } from '@mui/material'
import { Box } from '@mui/system'
import FeeItem from 'app/redux/classes/fees/FeeItem'
import ContentBox from '../styledcomponents/ContentBox'
import Heading from '../styledcomponents/Heading'
import StyledCard from '../styledcomponents/StyledCard'
import FeeItemForm from './FeeItemForm'
import { useFees } from 'app/redux/classes/fees/Fees'

/**
 * @param {{monthlyFees:Array<FeeItem>, confirm, edit: boolean, onChange: (state: any)=>void }} props 
 */
const MonthlyFeesForm = props => {
    const [state, setState] = React.useState(props.monthlyFees)

    const [ok, setOk] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            if (
                state.length > 0
                && state.filter(f => f.head && (+f.amount) > 0).length === state.length
            ) {
                props.onChange({ target: { name: 'monthlyFees', value: state } })
                if (!ok) setOk(!ok)
            } else {
                if (ok) setOk(!ok)
            }
        })()
    }, [state])

    const handleChange = (index, feeItem) => {
        const start = state.filter((f, i) => i < index)
        const end = state.filter((f, i) => i > index)
        setState([...start, feeItem, ...end])
    }

    const addAfter = index => {
        const start = state.filter((f, i) => i <= index)
        const end = state.filter((f, i) => i > index)
            .map(f => ({ ...f, index: f.index + 1 }))
        setState([...start, new FeeItem({ index: index + 1 }).json(), ...end])
    }

    const deleteFrom = index => {
        const start = state.filter((f, i) => i < index)
        const end = state.filter((f, i) => i > index)
            .map(f => ({ ...f, index: f.index - 1 }))
        setState([...start, ...end])
    }

    const upFrom = index => {
        if (index === 0) return
        const start = state.filter((f, i) => i <= index - 2)
        const end = state.filter((f, i) => i > index)
        const f1 = { ...state[index], index: index - 1 }
        const f2 = { ...state[index - 1], index: index }
        setState([...start, f1, f2, ...end])
    }

    const fees = useFees()
    const [heads, setHeads] = React.useState([new FeeItem()])
    React.useEffect(() => {
        setHeads([new FeeItem(), ...fees.getMonthlyFeesHeads().filter(f => !state.find(s => s.head === f.head))])
    }, [fees, state])

    const [totalFees, setTotalFess] = React.useState(0)
    React.useEffect(() => {
        let t = 0
        state.forEach(f => t += (+f.amount))
        setTotalFess(t)
    }, [state])

    return (
        <ContentBox>
            <StyledCard sx={ok ? { border: '2px solid #00aa44', borderBottomWidth: '6px' } : {}}>
                <Box mb="12px">
                    <Heading sx={ok ? { color: '#00aa44' } : {}}>
                        Monthly fees
                        {ok && <Icon fontSize='small'>task_alt</Icon>}
                    </Heading>
                </Box>
                {
                    state.map((feeItem, index) => (
                        <FeeItemForm
                            key={'monthlyFeeItemForm' + index}
                            heads={heads}
                            feeItem={feeItem}
                            index={index}
                            edit={props.edit}
                            lastIndex={state.length - 1}
                            onAdd={() => addAfter(index)}
                            onDelete={() => props.confirm(() => deleteFrom(index))}
                            onUp={() => upFrom(index)}
                            onChange={feeItem => handleChange(index, feeItem)}
                        />
                    ))
                }
                <Typography>Total Monthly fees: ₹{totalFees}</Typography>
            </StyledCard>
        </ContentBox>
    )
}

export default MonthlyFeesForm
