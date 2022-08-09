import { useSelector, useDispatch } from 'react-redux'
import { fetchFromFirestoreBySubscriber } from 'app/firebase/Firebase'
import { asyncCall } from '../AsyncCaller'
import Staff from './Staff'
import { COLLECTION } from './Staff'

export default class Staffs {

    /**
     * @type {Array<Staff>}
     */
    list

    loaded = false
    subscriberdocid = ''

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchStaffs = () => this.dispatch({ type: 'dispatchStaffs', payload: new Staffs(this) })

    /**
     * @param {Staffs} staffs 
     */
    constructor(staffs = null) {
        this.list = staffs && staffs.list ? staffs.list.map(staff => new Staff(staff)) : []
        this.loaded = staffs && staffs.loaded ? staffs.loaded : false
        this.subscriberdocid = staffs && staffs.subscriberdocid ? staffs.subscriberdocid : null
        this.dispatch = staffs && staffs.dispatch ? staffs.dispatch : null
    }

    /**
     * @param {Staff} staff 
     * @param {()=>void} onSuccess
     * @param {()=>void} onError
     */
    insert = async (staff, onSuccess, onError) => {
        const newStudent = new Staff(staff)
        await newStudent.insert(this.subscriberdocid)
        if (newStudent.docref) {
            const list = [newStudent]
            this.list.forEach(s => list.push(s))
            this.list = list
            this.loaded = true
            this.dispatchStaffs()
            asyncCall(onSuccess)
        } else {
            asyncCall(onError)
        }
    }

    /**
     * @param {string} docid 
     * @param {Staff} value
     * @param {()=>void} onSuccess
     * @param {()=>void} onError
     */
    update = async (docid, value, onSuccess, onError) => {
        const staff = this.list.find(s => s.docref.id === docid)
        if (staff && await staff.update(value)) {
            this.dispatchStaffs()
            asyncCall(onSuccess)
        } else {
            asyncCall(onError)
        }
    }

    /**
     * @param {string} docid 
     * @param {()=>void} onSuccess
     * @param {()=>void} onError
     */
    delete = async (docid, onSuccess, onError) => {
        const staff = this.list.find(s => s.docref.id === docid)
        if (staff && await staff.delete()) {
            try {
                const list = this.list.filter(s => s.docref.id !== docid)
            } catch (ex) { }
            try {
                this.list = this.list.filter(s => s.docref.id !== docid)
            } catch (ex2) { }
            this.dispatchStaffs()
            asyncCall(onSuccess)
        } else {
            asyncCall(onError)
        }
    }

    /**
     * @private
     */
    reorder = () => {
        const field = 'name'
        this.list = this.list.sort((s1, s2) =>
        ((typeof (s1[field]) === 'number')
            ? s1[field] - s2[field]
            : `${s1[field]}`.localeCompare(`${s2[field]}`))
        )
    }

    /**
     * @param {string} subscriberdocid 
     */
    load = async (subscriberdocid) => {
        if (subscriberdocid === this.subscriberdocid && this.loaded) return
        this.loaded = true
        this.subscriberdocid = subscriberdocid
        this.list = []
        const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION, [
            { field: 'role', operator: '!=', value: 'BRANCH ADMIN' }
        ])
        if (snap && snap.docs && snap.docs.length > 0) {
            snap.docs.forEach(doc => {
                this.list.push({ ...doc.data(), docref: doc.ref })
            })
        }
        this.reorder()
        this.dispatchStaffs()
    }
}

/**
 * @returns {Staffs}
 */
export const useStaffs = () => {
    let staffs = useSelector((state) => state.staffs)
    staffs.bindRedux(useDispatch())
    return staffs
}
