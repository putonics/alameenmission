import { MenuItem, Select } from '@mui/material'
import { useStudentCountReports } from 'app/redux/classes/report/StudentCountReports'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
/**
 * @param {} props
 * @returns 
 */
const TopBar = ({ startLoading = () => { }, stopLoading = () => { } }) => {

    const [years, setYears] = React.useState([new Date().getFullYear() - 1])

    const [state, setState] = React.useState({ year: 0 })

    const scrs = useStudentCountReports()
    const user = useUser()

    React.useEffect(() => {
        if (state.year === 0) {
            startLoading()
            scrs.load(user.subscriberdocid)
                .then(() => {
                    stopLoading()
                })
        } else if (!scrs.selected || scrs.selected.sessionFrom !== state.year) {
            startLoading()
            scrs.load(user.subscriberdocid, state.year)
                .then(() => {
                    stopLoading()
                })
        }
    }, [state])

    React.useEffect(() => {
        if (scrs.list.length > 0) {
            setYears(scrs.list.map(scr => scr.sessionFrom))
            setState({ year: scrs.selected.sessionFrom })
        }
    }, [scrs])

    return (
        <>
            <Select
                sx={{ mr: 1 }}
                id="select-year"
                name='session'
                value={`${state.year}`}
                label="session"
                onChange={e => setState({ year: parseInt(`${e.target.value}`) })}
                required
            >
                {
                    years.map((year, index) => (
                        <MenuItem
                            key={year}
                            value={`${year}`}
                        >
                            {year}
                        </MenuItem>
                    ))
                }
            </Select>
        </>
    )
}

export default TopBar