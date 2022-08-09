import { Button, Icon, MenuItem, Select } from '@mui/material'
import { Span } from 'app/components/Typography'
import { useConfirmOnPassword } from 'app/redux/classes/ConfirmOnPassword'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import { useFees } from 'app/redux/classes/fees/Fees'
import { useUser } from 'app/redux/classes/User'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const TopBar = () => {

    const years = [new Date().getFullYear()]
    for (let i = 0; i < 16; i++) {
        years.push(years[i] - 1)
    }

    const user = useUser()
    const fees = useFees()
    const loadFees = async (sessionFrom) => {
        await fees.fetch(user.subscriberdocid, sessionFrom)
    }

    const snackbarControl = useSnackbarControl()
    const confirmOnPassword = useConfirmOnPassword()
    const confirm = (func) => {
        confirmOnPassword.askForConfirmation(func)
    }

    const navigate = useNavigate()
    const location = useLocation()
    return (
        <>
            <Select
                sx={{ mr: 1 }}
                id="select-year"
                name='session'
                value={`${fees.sessionFrom}`}
                label="session"
                onChange={e => loadFees(+e.target.value)}
                disabled={location.pathname.startsWith('/fees/entry')}
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
            <Button color="primary" variant='contained' onClick={() => navigate('/fees/entry/new/new')}
                disabled={location.pathname.startsWith('/fees/entry')}
            >
                <Icon>add</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                    Add fee (any class)
                </Span>
            </Button>
            {//by developer only
                fees.fees.length === 0 &&
                <Button color="primary" variant='contained'
                    onClick={() => {
                        confirm(() =>
                            fees.copyFromMemaryBranch(
                                () => snackbarControl.show('Successfully copied'),
                                () => snackbarControl.show('Error! Not copied'),
                            )
                        )
                    }}
                >
                    <Icon>content_copy</Icon>
                    <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                        Copy from MEMARY branch
                    </Span>
                </Button>
            }
        </>
    )
}

export default TopBar