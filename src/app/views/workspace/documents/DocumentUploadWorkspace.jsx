import React, { Fragment, lazy } from 'react'
import { Grid } from '@mui/material'
import { useStudents } from 'app/redux/classes/students/Students'
import { useSelectedStudent } from 'app/redux/classes/students/SelectedStudent'
import { useNavigate, useParams } from 'react-router-dom'
import ContentBox from '../styledcomponents/ContentBox'
import Loadable from 'app/components/Loadable/Loadable'
import { images } from 'app/redux/classes/Constants'
const ImageCard = Loadable(lazy(() => import('./ImageCard')))

const DocumentUploadWorkspace = props => {
    const { docid } = useParams()
    const students = useStudents()
    const selectedStudent = useSelectedStudent()
    const navigate = useNavigate()

    React.useEffect(() => {
        if (docid) {
            const student = students.list.find(s => s.docref.id === docid)
            if (student) {
                // alert(student.modifiedon)
                selectedStudent.set(student)
            } else {
                selectedStudent.set(null)
                navigate('/students')
            }
        }
    }, [docid])

    return (
        <Fragment>
            <ContentBox>
                <Grid container spacing={{ xs: 1, sm: 2, md: 4 }} >
                    {
                        images.map(image => (
                            <Grid item key={image.name} xs={12} sm={6} md={4} lg={3}>
                                <ImageCard image={image} />
                            </Grid>
                        ))
                    }
                </Grid>
            </ContentBox>
        </Fragment>
    )
}

export default DocumentUploadWorkspace