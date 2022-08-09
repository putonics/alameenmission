import React, { Fragment } from 'react'
// import { useTheme } from '@mui/system'
import ItemList from './PurchaseList'
import ContentBox from '../styledcomponents/ContentBox'

const PurchaseWorkspace = props => {
    // const { palette } = useTheme()
    return (
        <Fragment>
            <ContentBox>
                <ItemList />
            </ContentBox>
        </Fragment>
    )
}

export default PurchaseWorkspace