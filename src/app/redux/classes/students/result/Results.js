import { fetchFromFirestore } from 'app/firebase/Firebase'
import { useSelector, useDispatch } from 'react-redux'
import Exam from "./Exam"
import Result from "./Result"
const COLLECTION = 'results'

export default class Results {
    examdocid
    /**
     * @type {Array<Result>}
     */
    list = []

    pdf = false

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchResults = () =>
        this.dispatch({ type: 'dispatchResults', payload: new Results(this) })

    /**
     * @param {Results} r 
     */
    constructor(r) {
        this.examdocid = r && r.examdocid ? r.examdocid : ''
        this.list = r && r.list && r.list.length > 0 ? r.list.map(s => new Result(s)) : []
        this.pdf = r && r.pdf ? r.pdf : false
        this.dispatch = r && r.dispatch ? r.dispatch : null
    }

    set = (r) => {
        this.examdocid = r && r.examdocid ? r.examdocid : ''
        this.list = r && r.list && r.list.length > 0 ? r.list.map(s => new Result(s)) : []
    }

    json = () => {
        const list = this.list.map(s => s.json())
        return ({ list })
    }

    /**
     * @param {Exam} exam 
     * @param {boolean} pdf
     */
    load = async (exam, pdf = false) => {
        if (!(exam.docref.id === this.examdocid && this.list.length > 0)) {
            this.examdocid = exam.docref.id
            this.list = []
            const snap = await fetchFromFirestore(COLLECTION, [
                { field: 'exam.docref.id', operator: '==', value: exam.docref.id },
            ])
            if (snap && snap.docs && snap.docs.length > 0) {
                snap.docs.forEach(doc => {
                    this.list.push(new Result({ ...doc.data(), docref: doc.ref }))
                })
            }
        }
        this.pdf = pdf
        this.dispatchResults()
    }
}

/**
 * @returns {Results}
 */
export const useResults = () => {
    let results = useSelector((state) => state.results)
    if (!results) results = new Results()
    results.bindRedux(useDispatch())
    return results
}