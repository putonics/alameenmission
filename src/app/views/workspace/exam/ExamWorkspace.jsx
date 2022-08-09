import React from 'react'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import TopBar from './TopBar'
import { useExams } from 'app/redux/classes/students/exam/Exams'
import ContentBox from '../styledcomponents/ContentBox'
import ExamView from './ExamView'
import TableSkeleton from '../skeleton/TableSkeleton'

const ExamWorkspace = props => {

    const topbarControl = useTopbarControl()

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
                    :
                    exams.list.length
                        ?
                        exams.list.map((exam, i) => (
                            <ExamView key={`exam-${i}`} exam={exam} />
                        ))
                        : <div>Please add an exam first</div>
            }
        </ContentBox>
    )
}

export default ExamWorkspace