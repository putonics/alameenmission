import { fetchFromFirestoreByDocid, insertIntoFirestoreByDocid, updateIntoFirestore } from 'app/firebase/Firebase'
import { DocumentReference } from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import VisitingDay from './VisitingDay'

export default class VisitingDays {
    subscriberdocid = ''
    createdon = 0
    modifiedon = 0
    /**
     * @type {Array<VisitingDay>}
     */
    list = []
    /**
     * @type {DocumentReference}
     */
    docref

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchVisitingDays = () =>
        this.dispatch({ type: 'dispatchVisitingDays', payload: new VisitingDays(this) })

    /**
     * @param {VisitingDays} vd 
     */
    constructor(vd = null) {
        this.subscriberdocid = vd && vd.subscriberdocid ? vd.subscriberdocid : ''
        this.createdon = vd && vd.createdon ? vd.createdon : 0
        this.modifiedon = vd && vd.modifiedon ? vd.modifiedon : 0
        this.list = vd && vd.list ? vd.list.map(v => new VisitingDay(v)) : []
        this.dispatch = vd && vd.dispatch ? vd.dispatch : null
        this.docref = vd && vd.docref ? vd.docref : null
        if (this.list.length === 0) {
            this.list.push(new VisitingDay())
        }
    }

    set = (vd = null) => {
        this.subscriberdocid = vd && vd.subscriberdocid ? vd.subscriberdocid : ''
        this.createdon = vd && vd.createdon ? vd.createdon : 0
        this.modifiedon = vd && vd.modifiedon ? vd.modifiedon : 0
        this.list = vd && vd.list ? vd.list.map(v => new VisitingDay(v)) : []
        this.docref = vd && vd.docref ? vd.docref : null
        if (this.list.length === 0) {
            this.list.push(new VisitingDay())
        }
    }

    json = () => {
        const { subscriberdocid, createdon, modifiedon } = this
        const list = this.list.map(v => v.json())
        return ({ subscriberdocid, createdon, modifiedon, list })
    }

    load = async (subscriberdocid = '') => {
        const doc = await fetchFromFirestoreByDocid('visiting-days', subscriberdocid)
        if (doc && doc.exists()) {
            this.set({ ...doc.data(), docref: doc.ref })
            this.dispatchVisitingDays()
        }
    }

    insert = async (subscriberdocid = '', list = [new VisitingDay()], onSuccess = () => { }, onError = () => { }) => {
        const newVisitingDays = new VisitingDays(this)
        newVisitingDays.list = list.map(vd => new VisitingDay(vd))
        try {
            if (this.docref) {
                if (await updateIntoFirestore(this.docref, newVisitingDays.json())) {
                    this.list = newVisitingDays.list
                    this.dispatchVisitingDays()
                    onSuccess()
                } else {
                    onError()
                }
            } else {
                if (await insertIntoFirestoreByDocid(subscriberdocid, subscriberdocid, 'visiting-days', newVisitingDays.json())) {
                    this.list = newVisitingDays.list
                    this.dispatchVisitingDays()
                    onSuccess()
                } else {
                    onError()
                }
            }
        } catch (ex) {
            onError()
        }
    }
}

/**
 * @returns {VisitingDays}
 */
export const useVisitingDays = () => {
    let visitingDays = useSelector((state) => state.visitingDays)
    if (!visitingDays) visitingDays = new VisitingDays()
    visitingDays.bindRedux(useDispatch())
    return visitingDays
}