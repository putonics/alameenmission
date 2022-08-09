import { useSelector, useDispatch } from 'react-redux'
import { fetchFromFirestoreBySubscriber, insertIntoFirestore, updateIntoFirestore } from "app/firebase/Firebase"
import { onlyDate } from "app/utils/constant"
import { DocumentReference } from "firebase/firestore"
import { months, pclasses } from "../../Constants"
import ClassTaken from "./ClassTaken"

const COLLECTION = 'daily-class-taken'

export default class DailyClassTaken {
    timestamp = 0
    /**
     * @type {'MALE'|'FEMALE'}
     */
    gender = 'MALE'
    /**
     * @type {Array<ClassTaken>}
     */
    classTakens = []
    /////////////////
    createdon = 0
    modifiedon = 0
    subscriberdocid = ''
    /**
     * @type {DocumentReference}
     */
    docref

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchDailyClassTaken = () => this.dispatch({ type: 'dispatchDailyClassTaken', payload: new DailyClassTaken(this) })

    constructor(dct = null) {
        this.timestamp = dct && dct.timestamp ? onlyDate(dct.timestamp).getTime() : onlyDate().getTime()
        this.classTakens = dct && dct.classTakens ? dct.classTakens.map(ct => new ClassTaken(ct))
            : pclasses.map(pclass => new ClassTaken({ pclass, section: 'A' }))
        this.gender = dct && dct.gender ? dct.gender : 'MALE'
        this.createdon = dct && dct.createdon ? dct.createdon : 0
        this.modifiedon = dct && dct.modifiedon ? dct.modifiedon : 0
        this.subscriberdocid = dct && dct.subscriberdocid ? dct.subscriberdocid : ''
        this.docref = dct && dct.docref ? dct.docref : null
        this.dispatch = dct && dct.dispatch ? dct.dispatch : null
    }

    set = (dct = null) => {
        this.timestamp = dct && dct.timestamp ? onlyDate(dct.timestamp).getTime() : this.timestamp
        this.classTakens = dct && dct.classTakens ? dct.classTakens.map(ct => new ClassTaken(ct)) : this.classTakens
        this.gender = dct && dct.gender ? dct.gender : this.gender
        this.createdon = dct && dct.createdon ? dct.createdon : this.createdon
        this.modifiedon = dct && dct.modifiedon ? dct.modifiedon : this.modifiedon
        this.subscriberdocid = dct && dct.subscriberdocid ? dct.subscriberdocid : this.subscriberdocid
        this.docref = dct && dct.docref ? dct.docref : this.docref
    }

    json = () => {
        const { timestamp, gender } = this
        const classTakens = this.classTakens.map(ct => ct.json())
        return ({ timestamp, gender, classTakens })
    }

    /**
     * @param {string} subscriberdocid 
     * @param {number} timestamp 
     * @param {string} gender 
     */
    load = async (subscriberdocid, timestamp, gender) => {
        if (this.docref && this.subscriberdocid === subscriberdocid && this.timestamp === onlyDate(timestamp).getTime() && this.gender === gender)
            return
        this.set({ subscriberdocid, timestamp, gender, classTakens: pclasses.map(pclass => new ClassTaken({ pclass, section: 'A' })) })
        this.docref = null
        const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION, [
            { field: 'timestamp', operator: '==', value: this.timestamp },
            { field: 'gender', operator: '==', value: this.gender },
        ], [], null, 1)
        if (snap && snap.docs && snap.docs.length) {
            this.set({ ...snap.docs[0].data(), docref: snap.docs[0].ref })
        }
        this.dispatchDailyClassTaken()
    }

    /**
     * @param {string} subscriberdocid 
     * @param {number} timestamp 
     * @param {string} gender 
     * @returns {Promise<Array<DailyClassTaken>>}
     */
    static loadMonth = async (subscriberdocid, timestamp, gender) => {
        const dt = new Date(timestamp)
        const month = dt.getMonth()
        const year = dt.getFullYear()
        const fromDate = onlyDate(`01-${months[month]}-${year}`).getTime()
        const toDate = onlyDate(`01-${months[(month + 1) % 12]}-${month === 11 ? year + 1 : year}`).getTime()
        const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION, [
            { field: 'timestamp', operator: '>=', value: fromDate },
            { field: 'timestamp', operator: '<', value: toDate },
            { field: 'gender', operator: '==', value: gender },
        ])
        const list = []
        if (snap && snap.docs && snap.docs.length) {
            snap.docs.forEach(doc => {
                list.push(new DailyClassTaken({ ...doc.data(), docref: doc.ref }))
            })
        }
        return list
    }

    /**
     * @param {number} timestamp 
     */
    copyfrom = async (timestamp) => {
        const snap = await fetchFromFirestoreBySubscriber(this.subscriberdocid, COLLECTION, [
            { field: 'timestamp', operator: '==', value: onlyDate(timestamp).getTime() },
            { field: 'gender', operator: '==', value: this.gender },
        ], [], null, 1)
        if (snap && snap.docs && snap.docs.length) {
            this.classTakens = snap.docs[0].data().classTakens.map(ct => new ClassTaken(ct))
        }
        this.dispatchDailyClassTaken()
    }

    /**
     * @param {string} subscriberdocid 
     * @param {DailyClassTaken} dct 
     */
    insert = async (subscriberdocid, dct, onSuccess = () => { }, onError = () => { }) => {
        this.subscriberdocid = subscriberdocid
        const newDct = new DailyClassTaken(dct)
        newDct.docref = await insertIntoFirestore(subscriberdocid, COLLECTION, newDct.json())
        if (newDct.docref) {
            this.set(newDct)
            this.dispatchDailyClassTaken()
            onSuccess()
        } else {
            onError()
        }
    }

    /**
     * @param {DailyClassTaken} dct 
     * @returns {Promise<boolean>}
     */
    update = async (dct, onSuccess = () => { }, onError = () => { }) => {
        const newDct = new DailyClassTaken(dct)
        if (await updateIntoFirestore(this.docref, newDct.json())) {
            this.set(newDct)
            this.modifiedon = new Date().getTime()
            this.dispatchDailyClassTaken()
            onSuccess()
            return true
        }
        onError()
        return false
    }
}

/**
 * @returns {DailyClassTaken}
 */
export const useDailyClassTaken = () => {
    let dailyClassTaken = useSelector((state) => state.dailyClassTaken)
    dailyClassTaken.bindRedux(useDispatch())
    return dailyClassTaken
}