import { useSelector, useDispatch } from 'react-redux'
import { fetchFromFirestoreBySubscriber } from 'app/firebase/Firebase'
import StudentCountReport from './StudentCountReport'

const COLLECTION = 'student-count-reports'
export default class StudentCountReports {
    /**
     * @type {Array<StudentCountReport>}
     */
    list

    selected = new StudentCountReport()

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchStudentCountReports = () =>
        this.dispatch({ type: 'dispatchStudentCountReports', payload: new StudentCountReports(this) })

    constructor(scr) {
        this.list = scr && scr.list ? scr.list.map((src) => new StudentCountReport(src)) : []
        this.selected = scr && scr.selected ? scr.selected : new StudentCountReport()
        this.dispatch = scr && scr.dispatch ? scr.dispatch : null
    }

    /**
     * @param {string} subscriberdocid 
     * @param {number} sessionFrom 
     */
    load = async (subscriberdocid, sessionFrom) => {
        const snap = await fetchFromFirestoreBySubscriber(
            subscriberdocid, COLLECTION,
            sessionFrom ? [{ field: 'sessionFrom', operator: '==', value: (+sessionFrom) }] : null,
            sessionFrom ? null : [{ field: 'sessionFrom', order: 'desc' }],
            null, null, 4
        )
        if (snap && snap.docs && snap.docs.length > 0) {
            if (sessionFrom) {
                const index = this.list.findIndex(scr => scr.sessionFrom === (+sessionFrom))
                const newScr = new StudentCountReport(snap.docs[0].data())
                newScr.docref = snap.docs[0].ref
                if (index >= 0) {
                    this.list[index] = newScr
                } else {
                    this.list.push(newScr)
                }
                this.selected = newScr
            } else {
                this.list = []
                snap.docs.forEach(doc => {
                    const newScr = new StudentCountReport(doc.data())
                    newScr.docref = doc.ref
                    this.list.push(newScr)
                })
                this.selected = this.list[0]
            }
            this.dispatchStudentCountReports()
        }
    }

    /**
     * @param {number} sessionFrom 
     * @param {string} pclass 
     */
    getTotalCount = (sessionFrom, pclass) => {
        let totalCount = { pclass, maleCount: 0, femaleCount: 0, otherCount: 0, totalCount: 0 }
        if (this.list && this.list.length > 0) {
            const scr = this.list.find(s => s.sessionFrom === sessionFrom)
            if (scr && scr.classWiseStudents && scr.classWiseStudents.length > 0) {
                const cws = scr.classWiseStudents.find(c => c.pclass === pclass)
                if (cws && cws.totalCount) {
                    totalCount = { ...cws.totalCount.get(), pclass }
                }
            }
        }
        return totalCount
    }
}

/**
 * @returns {StudentCountReports}
 */
export const useStudentCountReports = () => {
    let studentCountReports = useSelector((state) => state.studentCountReports)
    if (!studentCountReports) studentCountReports = new StudentCountReports()
    studentCountReports.bindRedux(useDispatch())
    return studentCountReports
}