import React, { useState } from 'react'
import { styled, useTheme } from '@mui/system'
import { Icon, IconButton } from '@mui/material'
import { topBarHeight } from 'app/utils/constant'

const SearchContainer = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: topBarHeight,
    background: theme.palette.primary.main,
    color: theme.palette.text.primary,
    '&::placeholder': {
        color: theme.palette.text.primary,
    },
}))

const SearchInput = styled('input')(({ theme }) => ({
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    paddingLeft: '20px',
    height: 'calc(100% - 5px)',
    background: theme.palette.primary.main,
    color: theme.palette.text.primary,
    '&::placeholder': {
        color: theme.palette.text.primary,
    },
}))

const MatxSearchBox = props => {
    const [open, setOpen] = useState(false)
    const toggle = () => {
        setOpen(!open)
    }

    React.useEffect(() => {
        if (!open) {
            props.onChange({ target: { value: '' } })
        }
    }, [open])

    const { palette } = useTheme()
    const textColor = palette.text.primary

    return (
        <React.Fragment>
            {!open && (
                <IconButton onClick={toggle}>
                    <Icon sx={{ color: textColor }}>search</Icon>
                </IconButton>
            )}

            {open && (
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="Search here..."
                        onChange={props.onChange}
                        autoFocus
                    />
                    <IconButton
                        onClick={toggle}
                        sx={{ mx: 2, verticalAlign: 'middle' }}
                    >
                        <Icon sx={{ color: textColor }}>close</Icon>
                    </IconButton>
                </SearchContainer>
            )}
        </React.Fragment>
    )
}

export default MatxSearchBox
