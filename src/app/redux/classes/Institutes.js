import { fetchFromFirestore, updateIntoFirestore } from 'app/firebase/Firebase'
import { DocumentReference } from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'

export class Institute {
    branch = ''
    district = ''
    email = ''
    institute = ''
    phone = ''
    place = ''
    subscriberdocid = ''
    title = ''
    studentTableCols = null
    /**
     * @type {DocumentReference}
     */
    docref

    constructor(institute = null) {
        this.branch = institute && institute.branch ? institute.branch : 'BRANCH-NAME'
        this.district = institute && institute.district ? institute.district : 'DISTRICT-NAME'
        this.email = institute && institute.email ? institute.email : 'EMAIL-ID'
        this.institute = institute && institute.institute ? institute.institute : 'INSTITUTE-NAME'
        this.phone = institute && institute.phone ? institute.phone : 'PHONE'
        this.place = institute && institute.place ? institute.place : 'PLACE'
        this.subscriberdocid = institute && institute.subscriberdocid ? institute.subscriberdocid : 'SUBSCRIBERDOCID'
        this.title = institute && institute.title ? institute.title : 'TITLE'
        this.studentTableCols = institute && institute.studentTableCols ? institute.studentTableCols : null
        this.docref = institute && institute.docref ? institute.docref : null
    }

    json = () => {
        const { branch, district, email, institute, phone, place, subscriberdocid, title, studentTableCols } = this
        return ({ branch, district, email, institute, phone, place, subscriberdocid, title, studentTableCols })
    }

    override = (institute = null) => {
        this.branch = institute && institute.branch ? institute.branch : this.branch
        this.district = institute && institute.district ? institute.district : this.district
        this.email = institute && institute.email ? institute.email : this.email
        this.institute = institute && institute.institute ? institute.institute : this.institute
        this.phone = institute && institute.phone ? institute.phone : this.phone
        this.place = institute && institute.place ? institute.place : this.place
        this.studentTableCols = institute && institute.studentTableCols ? institute.studentTableCols : this.studentTableCols
    }
}

export default class Institutes {

    /**
     * @type {Array<Institute>}
     */
    list
    loaded = false

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchInstitutes = () =>
        this.dispatch({ type: 'dispatchInstitutes', payload: new Institutes(this) })

    /**
     * @param {Institutes} institutes 
     */
    constructor(institutes = null) {
        this.list = institutes && institutes.list ? institutes.list : []
        this.loaded = institutes && institutes.loaded ? institutes.loaded : false
        this.dispatch = institutes && institutes.dispatch ? institutes.dispatch : null
    }

    load = async () => {
        if (this.loaded) return
        try {
            const snap = await fetchFromFirestore('institutes', [], [{ field: 'branch', order: 'asc' }], null, null)
            if (snap && snap.docs && snap.docs.length > 0) {
                this.list = snap.docs.map(doc => new Institute({ ...doc.data(), docref: doc.ref }))
                this.loaded = true
                this.dispatchInstitutes()
            }
        } catch (ex) {

        }
    }

    getInstitute = (subscriberdocid) => {
        if (this.list.length) {
            return this.list.find(i => i.subscriberdocid === subscriberdocid)
        }
        return null
    }

    /**
     * @param {Institute} institute 
     * @param {Institute} data 
     */
    update = async (institute, data) => {
        if (institute && institute.docref) {
            institute.override(data)
            await updateIntoFirestore(institute.docref, institute.json())
            this.getInstitute(institute.subscriberdocid).override(data)
            this.dispatchInstitutes()
        }
    }
}

/**
 * @returns {Institutes}
 */
export const useInstitutes = () => {
    let institutes = useSelector((state) => state.institutes)
    if (!institutes) institutes = new Institutes()
    institutes.bindRedux(useDispatch())
    return institutes
}