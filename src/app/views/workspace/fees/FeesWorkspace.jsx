import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import { useFees } from 'app/redux/classes/fees/Fees'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import FeesTable from './FeesTable'
import TopBar from './TopBar'

const FeesWorkspace = props => {
    const topbarControl = useTopbarControl()

    React.useEffect(() => {
        topbarControl.setControlBox(<TopBar />)
    }, [])

    const navigate = useNavigate()
    const fees = useFees()
    const [pclasses, setPclasses] = React.useState([])
    React.useEffect(() => {
        if (fees.fees.length === 0) {
            navigate(`/fees/entry/new/new`)
        } else {
            setPclasses(fees.getPclasses())
        }
    }, [fees])

    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }
    const [expanded, setExpanded] = React.useState(false)
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }
    return (
        <>
            {
                pclasses.map(pclass =>
                    <FeesTable
                        key={`feesTable${pclass}`}
                        pclass={pclass}
                        confirm={confirm}
                        expanded={expanded === `accordion-panel-cwa-${pclass}`}
                        onChange={handleChange(`accordion-panel-cwa-${pclass}`)}
                    />
                )
            }
        </>
    )
}

export default FeesWorkspace