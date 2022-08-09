import { useSelector, useDispatch } from 'react-redux'
import Student from './Student'

export default class SelectedStudent {

    student = new Student()

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchSelectedStudent = () =>
        this.dispatch({ type: 'dispatchSelectedStudent', payload: new SelectedStudent(this) })

    /**
     * @param {SelectedStudent} ss 
     */
    constructor(ss = null) {
        this.student = ss && ss.student ? ss.student : null
        this.dispatch = ss && ss.dispatch ? ss.dispatch : null
    }

    /**
     * @param {Student} student 
     */
    set = (student) => {
        this.student = student
        this.dispatchSelectedStudent()
    }
}

/**
 * @returns {SelectedStudent}
 */
export const useSelectedStudent = () => {
    let selectedStudent = useSelector((state) => state.selectedStudent)
    if (!selectedStudent) selectedStudent = new SelectedStudent()
    selectedStudent.bindRedux(useDispatch())
    return selectedStudent
}
