import { useSelector, useDispatch } from 'react-redux'
import { DocumentReference, DocumentData } from 'firebase/firestore'
import { fetchFromFirestoreBySubscriber, insertIntoFirestore, updateIntoFirestore } from 'app/firebase/Firebase'
import ClassWiseAttendance from './ClassWiseAttendance'
import { onlyDate } from 'app/utils/constant'
import StudentStatus from './StudentStatus'
const COLLECTION = 'attendances'
export default class Attendance {

    classWiseAttendances = [new ClassWiseAttendance()]
    timestamp = 0
    schoolOffReason = ''
    gender = 'MALE'

    /////////////////
    createdon = 0
    modifiedon = 0
    subscriberdocid = ''
    /**
     * @type {DocumentReference<DocumentData>}
     */
    docref

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchAttendance = () =>
        this.dispatch({ type: 'dispatchAttendance', payload: new Attendance(this) })

    /**
     * @param {Attendance} am 
     */
    constructor(am = null) {
        this.classWiseAttendances = am && am.classWiseAttendances ? am.classWiseAttendances.map(cwa => new ClassWiseAttendance(cwa)) : []
        this.timestamp = am && am.timestamp ? am.timestamp : onlyDate().getTime()
        this.schoolOffReason = am && am.schoolOffReason ? am.schoolOffReason : null
        this.gender = am && am.gender ? am.gender : 'MALE'
        this.createdon = am && am.createdon ? am.createdon : 0
        this.modifiedon = am && am.modifiedon ? am.modifiedon : 0
        this.subscriberdocid = am && am.subscriberdocid ? am.subscriberdocid : ''
        this.docref = am && am.docref ? am.docref : null
        this.dispatch = am && am.dispatch ? am.dispatch : null
    }

    /**
     * @param {Attendance} am 
     */
    set = (am = null) => {
        this.classWiseAttendances = am && am.classWiseAttendances ? am.classWiseAttendances.map(cwa => new ClassWiseAttendance(cwa)) : []
        this.timestamp = am && am.timestamp ? am.timestamp : onlyDate().getTime()
        this.schoolOffReason = am && am.schoolOffReason ? am.schoolOffReason : null
        this.gender = am && am.gender ? am.gender : 'MALE'
        this.createdon = am && am.createdon ? am.createdon : 0
        this.modifiedon = am && am.modifiedon ? am.modifiedon : 0
        this.subscriberdocid = am && am.subscriberdocid ? am.subscriberdocid : ''
    }

    json = () => {
        const { timestamp, schoolOffReason, gender } = this
        const classWiseAttendances = schoolOffReason ? [] : this.classWiseAttendances.map(cwa => cwa.json())
        return ({ classWiseAttendances, timestamp, schoolOffReason, gender })
    }

    reset = () => {
        this.classWiseAttendances = []
        this.schoolOffReason = null
    }

    load = async () => {
        this.reset()
        const snap = await fetchFromFirestoreBySubscriber(this.subscriberdocid, COLLECTION,
            [
                { field: 'gender', operator: '==', value: this.gender },
                { field: 'timestamp', operator: '==', value: this.timestamp }
            ], null, null, 1)
        if (snap && snap.docs && snap.docs.length > 0) {
            const doc = snap.docs[0]
            this.set({ ...doc.data() })
            this.docref = doc.ref
        }
        this.dispatchAttendance()
    }

    //find dupicates
    // loadX = async (subscriberdocid) => {
    //     console.log('START#################')
    //     // this.reset()
    //     const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION, [],
    //         [
    //             { field: 'gender', order: 'asc' },
    //             { field: 'timestamp', order: 'desc' }
    //         ], null, null, 0)
    //     if (snap && snap.docs && snap.docs.length > 0) {
    //         snap.docs.forEach(doc => {
    //             const data = doc.data()
    //             console.log({ id: doc.ref.id, timestamp: data.timestamp, gender: data.gender, modifiedon: data.modifiedon })
    //         })
    //         // this.set({ ...doc.data() })
    //         // this.docref = doc.ref
    //     }
    //     // this.dispatchAttendance()
    //     console.log('############END')
    // }

    copyPreviousDay = async (timestamp) => {
        const thisTimestamp = this.timestamp
        this.reset()
        const snap = await fetchFromFirestoreBySubscriber(this.subscriberdocid, COLLECTION,
            [
                { field: 'gender', operator: '==', value: this.gender },
                { field: 'timestamp', operator: '==', value: onlyDate(timestamp).getTime() }
            ], null, null, 1)
        if (snap && snap.docs && snap.docs.length > 0) {
            const doc = snap.docs[0]
            this.set({ ...doc.data() })
            this.docref = null
            this.timestamp = thisTimestamp
        }
        this.dispatchAttendance()
    }

    reload = async (subscriberdocid, gender, timestamp) => {
        try {
            this.subscriberdocid = subscriberdocid
            this.gender = gender
            this.timestamp = onlyDate(timestamp).getTime()
            await this.load()
        } catch (ex) { }
    }

    setSchoolOffReason = schoolOffReason => {
        this.schoolOffReason = schoolOffReason
        this.dispatchAttendance()
    }

    update = async () => {
        // console.log('update()')
        if (!this.docref) {//insert
            // console.log('inserting...')
            await insertIntoFirestore(this.subscriberdocid, COLLECTION, this.json())
        } else {//update
            // console.log('updating...')
            // console.log(this.json())
            await updateIntoFirestore(this.docref, this.json())
        }
        // console.log('finished ' + this.docref.id)
        this.dispatchAttendance()
    }

    addClass = async (pclass = '', sessionFrom = 0, modifiedon = 0) => {
        const cwa = this.classWiseAttendances.find(cwa => cwa.pclass === pclass)
        if (cwa) {
            cwa.sessionFrom = sessionFrom
            cwa.classOffReason = null
            cwa.modifiedon = modifiedon
            await cwa.loadStudents(this.subscriberdocid, this.gender)
        } else {
            const newCwa = new ClassWiseAttendance({ pclass, sessionFrom, modifiedon })
            await newCwa.loadStudents(this.subscriberdocid, this.gender)
            this.classWiseAttendances.push(newCwa)
        }
        this.dispatchAttendance()
    }

    setSchoolOff = (reason = 'Holiday') => {
        this.schoolOffReason = reason
        this.dispatchAttendance()
    }

    setClassOff = (pclass, reason) => {
        this.classWiseAttendances.find(cwa => cwa.pclass === pclass)?.setClassOff(reason)
        this.dispatchAttendance()
    }

    setPresent = (pclass, regno) => {
        this.classWiseAttendances.find(cwa => cwa.pclass === pclass)?.setPresent(regno)
        this.dispatchAttendance()
    }

    setAbscent = (pclass, regno, reason) => {
        this.classWiseAttendances.find(cwa => cwa.pclass === pclass)?.setAbscent(regno, reason)
        this.dispatchAttendance()
    }

    /**
     * @param {StudentStatus} student 
     */
    present = (student) => {
        student.present = true
        student.abscentReason = null
        this.dispatchAttendance()
    }

    /**
     * @param {StudentStatus} student 
     * @param {string} abscentReason 
     */
    abscent = (student, abscentReason) => {
        student.present = false
        student.abscentReason = abscentReason
        this.dispatchAttendance()
    }
}

/**
 * @returns {Attendance}
 */
export const useAttendance = () => {
    let attendance = useSelector((state) => state.attendance)
    if (!attendance) attendance = new Attendance()
    attendance.bindRedux(useDispatch())
    return attendance
}