import Loadable from 'app/components/Loadable/Loadable'
import React, { Fragment, lazy } from 'react'
import TopBar from './TopBar'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'

const CurrentYearStatistics = Loadable(lazy(() => import('./CurrentYearStatistics')))
const CurrentYearFeesStatistics = Loadable(lazy(() => import('./CurrentYearFeesStatistics')))

const DashboardWorkspace = props => {

    const [loading, setLoading] = React.useState(false)

    const topbarControl = useTopbarControl()

    React.useEffect(() => {
        topbarControl.setControlBox(
            <TopBar
                onStartLoading={() => setLoading(true)}
                onStopLoading={() => setLoading(false)}
            />
        )
    }, [])

    return (
        <Fragment>
            <CurrentYearStatistics loading={loading} />
            <CurrentYearFeesStatistics loading={loading} />
        </Fragment>
    )
}

export default DashboardWorkspace