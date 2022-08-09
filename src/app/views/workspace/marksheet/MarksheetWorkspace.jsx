import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import { useResults } from 'app/redux/classes/students/result/Results'
import React from 'react'
import TableSkeleton from '../skeleton/TableSkeleton'
import ContentBox from '../styledcomponents/ContentBox'
import MarksheetPdfViewer from './MarksheetPdfViewer'
import TopBar from './TopBar'

const MarksheetWorkspace = props => {

    const topbarControl = useTopbarControl()//redux
    const [loading, setLoading] = React.useState(false)

    const results = useResults()

    React.useEffect(() => {
        topbarControl.setControlBox(
            <TopBar
                startLoading={() => setLoading(true)}
                stopLoading={() => setLoading(false)}
                onGenerateMarksheet={exam => {
                    setLoading(true)
                    results.load(exam, true).finally(() => setLoading(false))
                }}
                onGenerateExcel={exam => {
                    setLoading(true)
                    results.load(exam).finally(() => setLoading(false))
                }}
            />
        )
    }, [])

    return (
        <ContentBox>
            {
                loading
                    ? <TableSkeleton rows={4} cols={10} />
                    : results.list.length > 0
                        ? <MarksheetPdfViewer />
                        : <div>No result found</div>
            }
        </ContentBox>
    )
}

export default MarksheetWorkspace