import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import TopBar from './TopBar'
import TableSkeleton from '../skeleton/TableSkeleton'
import { useExams } from 'app/redux/classes/students/exam/Exams'
import ResultForm from './ResultForm'

const ResultWorkspace = props => {

    const topbarControl = useTopbarControl()//redux
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        topbarControl.setControlBox(<TopBar startLoading={() => setLoading(true)} stopLoading={() => setLoading(false)} />)
    }, [])

    const exams = useExams()

    return (
        <ContentBox>
            {
                loading
                    ? <TableSkeleton rows={4} cols={4} />
                    : exams.list.length
                        ? <ResultForm />
                        : <div>Please add an exam first</div>
            }
        </ContentBox>
    )
}

export default ResultWorkspace