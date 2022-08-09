import { useSelector, useDispatch } from 'react-redux'
import { fetchFromFirestoreBySubscriber } from 'app/firebase/Firebase'
import Exam from './Exam'
import { pclasses } from '../../Constants'

export const COLLECTION_EXAMS = 'exams'

export default class Exams {
    subscriberdocid = ''
    sessionFrom = 0//sessionFrom of exam
    pclass = ''
    /**
     * @type {'MALE'|'FEMALE'}
     */
    gender = 'MALE'
    /**
     * @type {Array<Exam>}
     */
    list

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchExams = () =>
        this.dispatch({ type: 'dispatchExams', payload: new Exams(this) })

    /**
     * @param {Exams} exam
     */
    constructor(exam = null) {
        this.subscriberdocid = exam && exam.subscriberdocid ? exam.subscriberdocid : ''
        this.sessionFrom = exam && exam.sessionFrom ? exam.sessionFrom : new Date().getFullYear()
        this.pclass = exam && exam.pclass ? exam.pclass : pclasses[0]
        this.gender = exam && exam.gender ? exam.gender : 'MALE'
        this.list = exam && exam.list ? exam.list.map(e => new Exam(e)) : []
        this.dispatch = exam && exam.dispatch ? exam.dispatch : null
    }

    load = async (subscriberdocid, sessionFrom, pclass, gender) => {
        if (this.list.length > 0 && this.subscriberdocid === subscriberdocid
            && this.pclass === pclass && this.gender === gender && this.sessionFrom === sessionFrom) return
        this.subscriberdocid = subscriberdocid
        this.pclass = pclass
        this.gender = gender
        this.sessionFrom = sessionFrom
        this.list = []
        const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION_EXAMS, [
            { field: 'sessionFrom', operator: '==', value: (+sessionFrom) },
            { field: 'pclass', operator: '==', value: pclass },
            { field: 'gender', operator: '==', value: gender },
        ])
        if (snap && snap.docs && snap.docs.length > 0) {
            snap.docs.forEach(doc => {
                this.list.push(new Exam({ ...doc.data(), docref: doc.ref }))
            })
        }
        this.dispatchExams()
    }

    /**
     * @param {Exam} exam 
     * @param {()=>{}} onSuccess 
     * @param {()=>{}} onFailure 
     */
    insert = async (exam, onSuccess, onFailure) => {
        const newExam = new Exam(exam)
        newExam.subscriberdocid = this.subscriberdocid
        newExam.sessionFrom = this.sessionFrom
        newExam.pclass = this.pclass
        newExam.gender = this.gender
        if (await newExam.insert()) {
            this.list.push(newExam)
            this.dispatchExams()
            onSuccess()
        } else {
            onFailure()
        }
    }

    /**
     * @param {string} docid
     * @param {Exam} exam 
     * @param {()=>{}} onSuccess 
     * @param {()=>{}} onFailure 
     */
    update = async (docid, exam, onSuccess, onFailure) => {
        const index = this.list.findIndex(e => e.docref.id === docid)
        if (index < 0) {
            onFailure()
            return
        }
        const newExam = new Exam(this.list[index])
        newExam.subscriberdocid = this.subscriberdocid
        newExam.sessionFrom = this.sessionFrom
        newExam.pclass = this.pclass
        newExam.gender = this.gender
        // console.log(newExam)
        newExam.set(exam)
        if (await newExam.update()) {
            this.list[index] = newExam
            this.dispatchExams()
            onSuccess()
        } else {
            onFailure()
        }
    }
}

/**
 * @returns {Exams}
 */
export const useExams = () => {
    let exams = useSelector((state) => state.exams)
    if (!exams) exams = new Exams()
    exams.bindRedux(useDispatch())
    return exams
}