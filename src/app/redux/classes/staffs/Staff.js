import { DocumentReference, DocumentData } from "firebase/firestore"
import {
    deleteFromFirestore, fetchFromFirestoreByDocid, fetchFromFirestoreBySubscriber,
    insertIntoFirestore, updateIntoFirestore
} from 'app/firebase/Firebase'
import Address from "../students/Address"
import BankAccount from "../students/BankAccount"
import CasteCertificate from "../students/CasteCertificate"
import HandicappedCertificate from "../students/HandicappedCertificate"
import { bloodGroups, castes, genders, statuses } from "../Constants"
import jwt from 'jsonwebtoken'

export const COLLECTION = 'users'

export const encryptPassword = (subscriberdocid, email, password) => {
    return jwt.sign(password, email + subscriberdocid)
}

export default class Staff {
    //Necessary details
    regno = ''
    name = ''
    designation = ''
    father = ''
    mother = ''
    mobile = 0
    whatsapp = 0
    email = ''
    password = ''
    /**
    * @type {'TEACHING STAFF'|'NON-TEACHING STAFF'|'GATEKEEPER'}
    */
    role
    showInAttendanceList = false
    nickname

    //e.g.: ['/exams', '/students', '/fees']
    privilege = []

    /**
     * @type {'ACTIVE'|'DROPOUT'}
     */
    status
    gender = ''
    //Staff's information details
    dob = 0
    aadhar = 0
    pan = ''
    caste = ''
    casteCertificate = new CasteCertificate()
    bloodGroup = ''
    handicapped = false
    handicappedCertificate = new HandicappedCertificate()
    //Address Details
    addressPermanent = new Address()
    addressPresent = new Address()
    //Bank details
    bankAccount = new BankAccount()
    /////////////////
    createdon = 0
    modifiedon = 0
    subscriberdocid = ''
    /**
     * @type {DocumentReference<DocumentData>}
     */
    docref
    newlyInsertedRecord = false
    recentlyUpdatedRecord = false

    /**
     * @param {Staff} staff 
     */
    constructor(staff) {
        //Necessary details
        this.regno = staff && staff.regno ? staff.regno.toUpperCase() : ''
        this.name = staff && staff.name ? staff.name.toUpperCase() : ''
        this.designation = staff && staff.designation ? staff.designation.toUpperCase() : ''
        this.father = staff && staff.father ? staff.father.toUpperCase() : ''
        this.mother = staff && staff.mother ? staff.mother.toUpperCase() : ''
        this.mobile = staff && staff.mobile ? (+ staff.mobile) : 0
        this.whatsapp = staff && staff.whatsapp ? (+ staff.whatsapp) : 0
        this.email = staff && staff.email ? staff.email : ''
        this.password = staff && staff.password ? staff.password : ''
        this.role = staff && staff.role ? staff.role : 'NON-TEACHING STAFF'
        this.showInAttendanceList = staff && staff.showInAttendanceList ? staff.showInAttendanceList : false
        this.nickname = staff && staff.nickname ? staff.nickname.toUpperCase() : ''
        this.privilege = staff && staff.privilege ? staff.privilege : ['']
        this.status = staff && staff.status ? staff.status.toUpperCase() : statuses[0]
        this.gender = staff && staff.gender ? staff.gender.toUpperCase() : genders[0]
        //Staff's information details
        this.dob = staff && staff.dob ? new Date(new Date(staff.dob).toDateString()).getTime() : 0
        this.aadhar = staff && staff.aadhar ? (+ staff.aadhar) : 0
        this.pan = staff && staff.pan ? staff.pan.toUpperCase() : ''
        this.caste = staff && staff.caste ? staff.caste.toUpperCase() : castes[0]
        this.casteCertificate = staff && staff.casteCertificate ? new CasteCertificate(staff.casteCertificate) : null
        this.bloodGroup = staff && staff.bloodGroup ? staff.bloodGroup : bloodGroups[0]
        this.handicapped = staff && staff.handicapped && staff.handicapped !== 'false' ? true : false
        this.handicappedCertificate = staff && staff.handicappedCertificate ? new HandicappedCertificate(staff.handicappedCertificate) : null
        //Address Details
        this.addressPermanent = staff && staff.addressPermanent ? new Address(staff.addressPermanent) : new Address()
        this.addressPresent = staff && staff.addressPresent ? new Address(staff.addressPresent) : new Address()
        //Bank details
        this.bankAccount = staff && staff.bankAccount ? new BankAccount(staff.bankAccount) : new BankAccount()
        //////////////////////////////////////////////////////////////////////////////////////////
        this.createdon = staff && staff.createdon ? staff.createdon : 0
        this.modifiedon = staff && staff.modifiedon ? staff.modifiedon : 0
        this.subscriberdocid = staff && staff.subscriberdocid ? staff.subscriberdocid : null
        this.docref = staff && staff.docref ? staff.docref : null
        this.newlyInsertedRecord = staff && staff.newlyInsertedRecord ? staff.newlyInsertedRecord : false
        this.recentlyUpdatedRecord = staff && staff.recentlyUpdatedRecord ? staff.recentlyUpdatedRecord : false
    }
    /**
     * @param {Staff} staff 
     */
    set = (staff) => {
        //Necessary details
        this.regno = staff && staff.regno ? staff.regno.toUpperCase() : ''
        this.name = staff && staff.name ? staff.name.toUpperCase() : ''
        this.designation = staff && staff.designation ? staff.designation.toUpperCase() : ''
        this.father = staff && staff.father ? staff.father.toUpperCase() : ''
        this.mother = staff && staff.mother ? staff.mother.toUpperCase() : ''
        this.mobile = staff && staff.mobile ? (+ staff.mobile) : 0
        this.whatsapp = staff && staff.whatsapp ? (+ staff.whatsapp) : 0
        this.email = staff && staff.email ? staff.email : ''
        this.password = staff && staff.password ? staff.password : ''
        this.role = staff && staff.role ? staff.role : 'NON-TEACHING STAFF'
        this.showInAttendanceList = staff && staff.showInAttendanceList ? staff.showInAttendanceList : false
        this.nickname = staff && staff.nickname ? staff.nickname.toUpperCase() : ''
        this.privilege = staff && staff.privilege ? staff.privilege : ['']
        this.status = staff && staff.status ? staff.status.toUpperCase() : statuses[0]
        this.gender = staff && staff.gender ? staff.gender.toUpperCase() : genders[0]
        //Staff's information details
        this.dob = staff && staff.dob ? new Date(new Date(staff.dob).toDateString()).getTime() : 0
        this.aadhar = staff && staff.aadhar ? (+ staff.aadhar) : 0
        this.pan = staff && staff.pan ? staff.pan.toUpperCase() : ''
        this.caste = staff && staff.caste ? staff.caste.toUpperCase() : castes[0]
        this.casteCertificate = staff && staff.casteCertificate ? new CasteCertificate(staff.casteCertificate) : null
        this.bloodGroup = staff && staff.bloodGroup ? staff.bloodGroup : bloodGroups[0]
        this.handicapped = staff && staff.handicapped && staff.handicapped !== 'false' ? true : false
        this.handicappedCertificate = staff && staff.handicappedCertificate ? new HandicappedCertificate(staff.handicappedCertificate) : null
        //Address Details
        this.addressPermanent = staff && staff.addressPermanent ? new Address(staff.addressPermanent) : new Address()
        this.addressPresent = staff && staff.addressPresent ? new Address(staff.addressPresent) : new Address()
        //Bank details
        this.bankAccount = staff && staff.bankAccount ? new BankAccount(staff.bankAccount) : new BankAccount()
        ///////////////////////////
        this.createdon = staff && staff.createdon ? staff.createdon : this.createdon
        this.modifiedon = staff && staff.modifiedon ? staff.modifiedon : this.modifiedon
        this.subscriberdocid = staff && staff.subscriberdocid ? staff.subscriberdocid : this.subscriberdocid
    }

    json = () => {
        const { regno, name, designation, father, mother, mobile, whatsapp, email, password,
            role, showInAttendanceList, nickname, privilege,
            status, gender, dob, aadhar, pan, caste, bloodGroup, handicapped } = this
        const addressPermanent = this.addressPermanent.json()
        const addressPresent = this.addressPresent.json()
        const bankAccount = this.bankAccount.json()
        const handicappedCertificate = handicapped ? this.handicappedCertificate.json() : null
        if (!handicappedCertificate) this.handicappedCertificate = null
        const casteCertificate = caste === 'GENERAL' ? null : this.casteCertificate.json()
        if (!casteCertificate) this.casteCertificate = null
        return ({
            regno, name, designation, father, mother, mobile, whatsapp, email, password,
            role, showInAttendanceList, nickname, privilege,
            status, gender, dob, aadhar, pan, caste, bloodGroup, handicapped,
            addressPermanent, addressPresent, father, mother,
            bankAccount, handicappedCertificate, casteCertificate,
        })
    }

    /**
     * @param {string} subscriberdocid 
     */
    insert = async (subscriberdocid) => {
        this.subscriberdocid = subscriberdocid
        this.password = encryptPassword(subscriberdocid, this.email, this.password)
        this.docref = await insertIntoFirestore(subscriberdocid, COLLECTION, this.json())
        if (this.docref) {
            this.newlyInsertedRecord = true
        }
    }

    /**
     * @returns {Promise<boolean>}
     */
    delete = async () => {
        return await deleteFromFirestore(this.docref)
    }

    /**
     * @param {Staff} staff 
     * @returns {Promise<boolean>}
     */
    update = async (staff) => {
        const newStaff = new Staff(staff)
        if (newStaff.password !== this.password) {
            newStaff.password = encryptPassword(this.subscriberdocid, newStaff.email, newStaff.password)
        }
        // alert(new Date(newStaff.dob).toDateString())
        if (await updateIntoFirestore(this.docref, newStaff.json())) {
            this.set(newStaff)
            this.modifiedon = new Date().getTime()
            this.newlyInsertedRecord = false
            this.recentlyUpdatedRecord = true
            return true
        }
        return false
    }

    load = async (docid) => {
        if (docid) {
            const doc = await fetchFromFirestoreByDocid(COLLECTION, docid)
            if (doc && doc.exists()) {
                this.set(doc.data())
                this.docref = doc.ref
            }
        }
    }

    search = async (subscriberdocid, regno) => {
        if (subscriberdocid && regno) {
            const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION, [{ field: 'regno', operator: '==', value: regno }])
            if (snap && snap.docs && snap.docs.length > 0) {
                this.set(snap.docs[0].data())
                this.docref = snap.docs[0].ref
            }
        }
    }
}