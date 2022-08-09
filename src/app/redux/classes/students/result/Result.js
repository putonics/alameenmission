import { fetchFromFirestore, insertIntoFirestore, updateIntoFirestore } from 'app/firebase/Firebase'
import { useSelector, useDispatch } from 'react-redux'
import Student from '../Student'
import Exam from "./Exam"
import StudentResult from "./StudentResult"
const COLLECTION = 'results'
/*
Result document should be created subject-wise so that the teacher
assigned for a particular subject can independently and securely put
the marks of the students.
ADMIN can put all the marks at the same time.
After each 30 entry there should be a save button to avoid data loss
of the entered marks. 
*/
export default class Result {
    exam = new Exam()
    /**
     * @type {Array<StudentResult>}
     */
    students = []
    ////////////////
    createdon = 0
    modifiedon = 0
    subscriberdocid = ''
    ////////////////
    docref

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchResult = () =>
        this.dispatch({ type: 'dispatchResult', payload: new Result(this) })

    /**
     * @param {Result} r 
     */
    constructor(r) {
        this.exam = r && r.exam ? new Exam(r.exam) : new Exam()
        this.students = r && r.students && r.students.length > 0 ? r.students.map(s => new StudentResult(s)) : []
        this.createdon = r && r.createdon ? (+r.createdon) : 0
        this.modifiedon = r && r.modifiedon ? (+r.modifiedon) : 0
        this.subscriberdocid = r && r.subscriberdocid ? r.subscriberdocid : 0
        this.docref = r && r.docref ? r.docref : null
        this.dispatch = r && r.dispatch ? r.dispatch : null
    }

    set = (r) => {
        this.exam = r && r.exam ? new Exam(r.exam) : this.exam
        this.students = r && r.students && r.students.length > 0 ? r.students.map(s => new StudentResult(s)) : this.students
        this.createdon = r && r.createdon ? (+r.createdon) : this.createdon
        this.modifiedon = r && r.modifiedon ? (+r.modifiedon) : this.modifiedon
        this.subscriberdocid = r && r.subscriberdocid ? r.subscriberdocid : this.subscriberdocid
        this.docref = r && r.docref ? r.docref : this.docref
    }

    json = () => {
        const exam = this.exam.json()
        const students = this.students.map(s => s.json())
        return ({ exam, students })
    }

    /**
     * @param {Exam} exam 
     */
    load = async (exam) => {
        this.exam = new Exam(exam)
        // console.log('Loading result...')
        this.docref = null
        const snap = await fetchFromFirestore(COLLECTION, [
            { field: 'exam.docref.id', operator: '==', value: exam.docref.id },
            { field: 'exam.subjectGroup.subject.code', operator: '==', value: exam.subjectGroup.subject.code },
            { field: 'exam.subjectGroup.subject.examType.type', operator: '==', value: exam.subjectGroup.subject.examType.type },
        ])
        if (snap && snap.docs && snap.docs.length > 0) {
            // console.log('Result doc found')
            this.set({ ...snap.docs[0].data(), docref: snap.docs[0].ref })
        }
        this.dispatchResult()
    }


    /**
     * @param {Array<Student>} students 
     */
    setStudents = (students = []) => {
        this.students = []
        students
            .filter(s => s.gender === this.exam.gender)
            .sort((a, b) => a.regno.localeCompare(b.regno))
            .forEach(s => {
                this.students.push(new StudentResult(s))
            })
        this.dispatchResult()
    }

    /**
     * @param {string} subscriberdocid
     * @param {Result} result 
     * @param {()=>{}} onSuccess
     * @param {()=>{}} onError
     */
    submit = async (subscriberdocid, result, onSuccess = () => { }, onError = () => { }) => {
        const newResult = new Result(this)
        newResult.set(result)
        if (this.docref) {
            const flag = await updateIntoFirestore(this.docref, newResult.json())
            if (flag) {
                this.set(newResult)
                this.dispatchResult()
                onSuccess()
            } else {
                onError()
            }
        } else {
            const docref = await insertIntoFirestore(subscriberdocid, COLLECTION, newResult.json())
            if (docref) {
                this.set(newResult)
                this.docref = docref
                this.dispatchResult()
                onSuccess()
            } else {
                onError()
            }
        }
    }
}

/**
 * @returns {Result}
 */
export const useResult = () => {
    let result = useSelector((state) => state.result)
    if (!result) result = new Result()
    result.bindRedux(useDispatch())
    return result
}