import { useSelector, useDispatch } from 'react-redux'
import { fetchFromFirestoreBySubscriber } from 'app/firebase/Firebase'
import { asyncCall } from '../AsyncCaller'
import { APIURL } from '../Constants'
import Student from './Student'
import StudentCountReports from '../report/StudentCountReports'

const COLLECTION = 'students'

export default class Students {

    /**
     * @type {Array<Student>}
     */
    list

    loaded = false
    subscriberdocid = ''
    sessionFrom = 0
    pclass = 'V'

    searchText = ''

    viewOrder = { field: 'regno', order: 'ascending' }

    /**
     * @type {Array<{list: Array<Student>, subscriberdocid: string, sessionFrom: number, pclass: string}>}
     */
    cache

    filterGender = ''
    filterStatus = ''

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchStudents = () => this.dispatch({ type: 'dispatchStudents', payload: new Students(this) })

    /**
     * @param {Students} students 
     */
    constructor(students = null) {
        this.list = students && students.list ? students.list.map(student => new Student(student)) : []
        this.dispatch = students && students.dispatch ? students.dispatch : null
        this.loaded = students && students.loaded ? students.loaded : false
        this.subscriberdocid = students && students.subscriberdocid ? students.subscriberdocid : null
        this.sessionFrom = students && students.sessionFrom ? parseInt(`${students.sessionFrom}`) : 0
        this.pclass = students && students.pclass ? students.pclass : 'V'
        this.searchText = students && students.searchText ? students.searchText : ''
        this.viewOrder = students && students.viewOrder ? students.viewOrder : { field: 'regno', order: 'ascending' }
        this.cache = students && students.cache ? students.cache : []
        this.filterGender = students && students.filterGender ? students.filterGender : ''
        this.filterStatus = students && students.filterStatus ? students.filterStatus : ''
    }

    /**
     * @private
     */
    updateCache = () => {
        const index = this.cache.findIndex(
            s => s.subscriberdocid === this.subscriberdocid && s.sessionFrom === this.sessionFrom && s.pclass === this.pclass
        )
        if (index >= 0) {
            this.cache[index].list = this.list.map(student => new Student(student))
        } else {
            const { list, subscriberdocid, sessionFrom, pclass } = this
            this.cache.push({ list: list.map(student => new Student(student)), subscriberdocid, sessionFrom, pclass })
        }
    }

    /**
     * @private
     */
    getCachedList = () => {
        const index = this.cache.findIndex(
            s => s.subscriberdocid === this.subscriberdocid && s.sessionFrom === this.sessionFrom && s.pclass === this.pclass
        )
        if (index >= 0) {
            this.list = this.cache[index].list
        }
    }

    /**
     * @param {string} subscriberdocid 
     * @param {Student} student 
     * @param {()=>void} onSuccess
     * @param {()=>void} onError
     */
    insert = async (subscriberdocid, student, onSuccess, onError) => {
        const newStudent = new Student(student)
        //checking existence
        const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION,
            [
                { field: 'sessionFrom', operator: '==', value: (+student.sessionFrom) },
                { field: 'regno', operator: '==', value: student.regno },
            ], null, null, 1)
        //...
        if (snap && snap.docs && snap.docs.length > 0) {//don't allow duplicates
            asyncCall(onError)
            return
        }
        await newStudent.insert(subscriberdocid)
        if (newStudent.docref) {
            const list = [newStudent]
            this.list.forEach(s => list.push(s))
            this.list = list
            this.loaded = true
            this.dispatchStudents()
            asyncCall(onSuccess)
        } else {
            asyncCall(onError)
        }
    }

    /**
     * @param {Student} student 
     * @param {Student} value
     * @param {()=>void} onSuccess
     * @param {()=>void} onError
     */
    update = async (student, value, onSuccess, onError) => {
        if (await student.update(value)) {
            this.dispatchStudents()
            asyncCall(onSuccess)
        } else {
            asyncCall(onError)
        }
    }

    /**
     * @param {Student} student 
     * @param {()=>void} onSuccess
     * @param {()=>void} onError
     */
    delete = async (student, onSuccess, onError) => {
        const id = student.docref.id
        if (await student.delete()) {
            try {
                const index = this.cache.findIndex(c => c.subscriberdocid === this.subscriberdocid && c.pclass === this.pclass && c.sessionFrom === this.sessionFrom)
                const list = this.cache[index].list.filter(s => s.docref.id !== id)
                this.cache[index] = list
            } catch (ex) { }
            try {
                this.list = this.list.filter(s => s.docref.id !== id)
            } catch (ex2) { }
            this.dispatchStudents()
            asyncCall(onSuccess)
        } else {
            asyncCall(onError)
        }
    }

    /**
     * @private
     */
    reorder = () => {
        const { field, order } = this.viewOrder
        this.list = this.list.sort((s1, s2) =>
            (order === 'ascending' ? 1 : -1) *
            ((typeof (s1[field]) === 'number')
                ? s1[field] - s2[field]
                : `${s1[field]}`.localeCompare(`${s2[field]}`))
        )
    }

    toggleOrder = (field) => {
        this.viewOrder = {
            field: field ? field : 'name',
            order: (this.viewOrder.field === field && this.viewOrder.order === 'ascending') ? 'descending' : 'ascending'
        }
        this.reorder()
        this.dispatchStudents()
    }

    /**
     * @param {string} subscriberdocid 
     * @param {number} sessionFrom 
     * @param {string} pclass 
     */
    setHeaders = (subscriberdocid, sessionFrom, pclass) => {
        if (this.subscriberdocid === subscriberdocid && this.sessionFrom === sessionFrom && this.pclass === pclass) return
        this.subscriberdocid = subscriberdocid
        this.sessionFrom = sessionFrom
        this.pclass = pclass
        this.dispatchStudents()
    }

    /**
     * @param {string} subscriberdocid 
     * @param {number} sessionFrom 
     * @param {string} pclass
     * @param {StudentCountReports} scrs
     * @returns 
     */
    load = async (subscriberdocid, sessionFrom, pclass, scrs) => {
        if (this.loaded && this.subscriberdocid === subscriberdocid && sessionFrom === this.sessionFrom && pclass === this.pclass) return
        let cacheModifiedon = 0
        if (scrs && scrs.list && scrs.list.length > 0) {
            const scr = scrs.list.find(scr => scr.sessionFrom === sessionFrom)
            if (scr && scr.classWiseStudents && scr.classWiseStudents.length > 0) {
                const cws = scr.classWiseStudents.find(cw => cw.pclass === pclass)
                if (cws && cws.modifiedon) {
                    cacheModifiedon = cws.modifiedon
                    // alert(cacheModifiedon)
                }
            }
        }
        this.loaded = true
        this.subscriberdocid = subscriberdocid
        this.sessionFrom = sessionFrom
        this.pclass = pclass
        this.list = []
        this.getCachedList()
        if (this.list.length === 0) {
            const response = await fetch(`${APIURL}/students/alameenmission/${subscriberdocid}/${sessionFrom}/${pclass}/1${cacheModifiedon}`)
            const data = await response.json()
            if (data) {
                const students = data.students
                if (students && students.length > 0) {
                    students.forEach(student => {
                        const s = new Student(student)
                        // alert(Date(s.modifiedon).toLocaleDateString() + '===' + new Date(cacheModifiedon).toLocaleDateString())
                        s.recentlyUpdatedRecord = Boolean(cacheModifiedon) && s.modifiedon === cacheModifiedon
                        // console.log(student.modifiedon)
                        this.list.push(s)
                    })
                    this.updateCache()
                    this.reorder()
                }
            }
        }
        // alert(this.pclass + '---' + this.sessionFrom)
        this.dispatchStudents()
    }

    toogleFilterGender = (text = '') => {
        this.filterGender = this.filterGender === text ? '' : text
        this.search(this.searchText)
    }

    toogleFilterStatus = (filterStatus = null) => {
        this.filterStatus = filterStatus || (!this.filterStatus ? 'STATUS:ACTIVE'
            : this.filterStatus === 'STATUS:ACTIVE' ? 'STATUS:DROPOUT' : '')
        this.search(this.searchText)
    }

    /**
     * @param {String} text 
     */
    search = (text = '') => {
        this.getCachedList()
        this.list = this.list.filter(s => {
            const searchKey = s.string()
            return searchKey.includes(text.toUpperCase())
                && searchKey.includes(this.filterGender)
                && searchKey.includes(this.filterStatus)
        })
        this.reorder()
        this.searchText = text
        this.dispatchStudents()
    }

    /**
     * @param {string} subscriberdocid 
     * @param {string} field 
     * @param {string|number} value 
     */
    deepSearch = async (subscriberdocid, field, value) => {
        const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION, [{ field, operator: '==', value }])
        if (snap && snap.docs.length > 0) {
            this.list = []
            snap.docs.forEach(doc => {
                const data = doc.data()
                const s = new Student({ ...data, docref: doc.ref })
                this.list.push(s)
            })
            this.reorder()
            this.dispatchStudents()
        }
    }

    /**
     * @param {string} subscriberdocid 
     * @param {number} sessionFrom 
     * @param {string} pclass 
     * @param {string} gender 
     */
    static isExist = async (subscriberdocid, sessionFrom, pclass, gender) => {
        const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION,
            [
                { field: 'sessionFrom', operator: '==', value: (+sessionFrom) },
                { field: 'pclass', operator: '==', value: pclass },
                { field: 'gender', operator: '==', value: gender },
            ], null, null, 1)
        return Boolean(snap && snap.docs.length > 0)
    }

    /**
     * @param {Student} student 
     */
    uptodate = async (student) => {
        await student.update(student)
        this.dispatchStudents()
    }
}

/**
 * @returns {Students}
 */
export const useStudents = () => {
    let students = useSelector((state) => state.students)
    students.bindRedux(useDispatch())
    return students
}
