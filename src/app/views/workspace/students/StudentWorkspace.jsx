import React, { Fragment } from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import StudentTable from './StudentTable'
import { useStudents } from 'app/redux/classes/students/Students'
import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import TopBar from './TopBar'
import { useNotificationBarControl } from 'app/redux/classes/controls/NotificationBarControl'
import SelectColumns from './SelectColumns'
// import { fetchConstantData } from 'app/json/fetch'
// import { TextField } from '@mui/material'
// import { searchByRegno } from './ApiCalls'

const StudentWorkspace = props => {
    const [loading, setLoading] = React.useState(false)
    const students = useStudents()
    const topbarControl = useTopbarControl()//redux
    const notificationBarControl = useNotificationBarControl()//redux
    React.useEffect(() => {
        topbarControl.setControlBox(
            <TopBar
                startLoading={() => setLoading(true)}
                stopLoading={() => setLoading(false)}
            />,
            students.search
        )
        // topbarControl.setSearch()
        notificationBarControl.setContent("Student's columns", 'view_column', <SelectColumns />)
    }, [students])

    return (
        <Fragment>
            <ContentBox>
                {/* 
                    <TextField
                        onChange={e => {
                            if (e.target.value.length === 5) {
                                searchByRegno(e.target.value.trim()).then(s => {
                                    if (s) {
                                        alert(`${s.regno}: ${s.name}: Class: ${s.pclass} Exists`)
                                    } else {
                                        students.insert(user.subscriberdocid, fetchConstantData(e.target.value.trim()),
                                            () => { navigate('/students') },
                                            () => { }
                                        )
                                    }
                                })
                            }
                        }}
                    />
                */}
                <StudentTable loading={loading} />
            </ContentBox>
        </Fragment>
    )
}

export default StudentWorkspace