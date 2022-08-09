import { DocumentReference, DocumentData } from "firebase/firestore"
import { deleteFromFirestore, fetchFromFirestoreByDocid, fetchFromFirestoreBySubscriber, insertIntoFirestore, updateIntoFirestore } from 'app/firebase/Firebase'
import Parent from "./Parent"
import Address from "./Address"
import BankAccount from "./BankAccount"
import BoardExam from "./BoardExam"
import CasteCertificate from "./CasteCertificate"
import HandicappedCertificate from "./HandicappedCertificate"
import FamilyMemberFromMission from "./FamilyMemberFromMission"
import SiblingStudyingInMission from "./SiblingStudyingInMission"
import { bloodGroups, castes, genders, mediums, pclasses, statuses, streams } from "../Constants"
import Visitor from "./Visitor"
import { format } from 'date-fns'
import FeePaidItem from "../fees-received/FeePaidItem"
import { onlyDate } from "app/utils/constant"

const COLLECTION = 'students'

export default class Student {
    //Necessary details
    regno = ''
    name = ''
    admissionDate = 0
    pclass = ''//present class
    stream = ''
    medium = ''
    sessionFrom = 0
    sessionTo = 0
    fee = 0
    feeStartingMonth = 0
    /**
     * @type {Array<FeePaidItem>}
     */
    feesPaid = []
    mobile = 0
    whatsapp = 0
    email = ''
    /**
     * @type {'ACTIVE'|'DROPOUT'}
     */
    status
    dropoutRemarks = null
    gender = ''
    //Student's information details
    dob = 0
    aadhar = 0
    caste = ''
    casteCertificate = new CasteCertificate()
    bloodGroup = ''
    handicapped = false
    handicappedCertificate = new HandicappedCertificate()
    orphan = false
    orphanRemarks = ''
    previousBranchName = ''
    banglarsikshaId = ''
    kanyashreeId = ''
    aikyashreeId = ''
    fc = false
    nc = false
    //Previous School Details (for MP/HS passed candidates)
    lastBoardExam = new BoardExam()
    //Address Details
    addressPermanent = new Address()
    addressPresent = new Address()
    //Parents information
    father = new Parent()
    mother = new Parent()
    visitor1 = new Visitor()
    visitor2 = new Visitor()
    studentLogin = true
    //Bank details
    bankAccount = new BankAccount()
    //Family Members From Mission
    familyMembersFromMissionFlag = false
    familyMembersFromMission = [new FamilyMemberFromMission()]
    //Siblings studyings in Mission
    siblingsStudyingInMissionFlag = false
    siblingsStudyingInMission = [new SiblingStudyingInMission()]
    //Student reports
    // studentCountReport = new StudentCountReport()
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
     * @param {Student} student 
     */
    constructor(student) {
        //Necessary details
        this.regno = student && student.regno ? student.regno.toUpperCase() : ''
        this.name = student && student.name ? student.name.toUpperCase() : ''
        this.admissionDate = student && student.admissionDate ? new Date(new Date(student.admissionDate).toDateString()).getTime() : 0
        this.pclass = student && student.pclass ? student.pclass.toUpperCase() : pclasses[0] //present class
        this.stream = student && student.stream ? student.stream.toUpperCase() : streams[0]
        this.medium = student && student.medium ? student.medium.toUpperCase() : mediums[0]
        this.sessionFrom = student && student.sessionFrom ? (+ student.sessionFrom) : new Date().getFullYear()
        this.sessionTo = student && student.sessionTo ? (+ student.sessionTo) : new Date().getFullYear()
        this.fee = student && student.fee ? (+ student.fee) : 0
        this.feeStartingMonth = student && student.feeStartingMonth ? (+ student.feeStartingMonth) : 0
        this.feesPaid = student && student.feesPaid ? student.feesPaid.map(fp => new FeePaidItem(fp)) : []
        this.mobile = student && student.mobile ? (+ student.mobile) : 0
        this.whatsapp = student && student.whatsapp ? (+ student.whatsapp) : 0
        this.email = student && student.email ? student.email : ''
        this.status = student && student.status ? student.status.toUpperCase() : statuses[0]
        this.dropoutRemarks = student && student.dropoutRemarks ? student.dropoutRemarks : null
        this.gender = student && student.gender ? student.gender.toUpperCase() : genders[0]
        //Student's information details
        this.dob = student && student.dob ? new Date(new Date(student.dob).toDateString()).getTime() : 0
        this.aadhar = student && student.aadhar ? (+ student.aadhar) : 0
        this.caste = student && student.caste ? student.caste.toUpperCase() : castes[0]
        this.casteCertificate = student && student.casteCertificate ? new CasteCertificate(student.casteCertificate) : null
        this.bloodGroup = student && student.bloodGroup ? student.bloodGroup : bloodGroups[0]
        this.handicapped = student && student.handicapped && student.handicapped !== 'false' ? true : false
        this.handicappedCertificate = student && student.handicappedCertificate ? new HandicappedCertificate(student.handicappedCertificate) : null
        this.orphan = student && student.orphan && student.orphan !== 'false' ? true : false
        this.orphanRemarks = student && student.orphanRemarks ? student.orphanRemarks : null
        this.previousBranchName = student && student.previousBranchName ? student.previousBranchName.toUpperCase() : ''
        this.banglarsikshaId = student && student.banglarsikshaId ? student.banglarsikshaId.toUpperCase() : null
        this.kanyashreeId = student && student.kanyashreeId ? student.kanyashreeId.toUpperCase() : null
        this.aikyashreeId = student && student.aikyashreeId ? student.aikyashreeId.toUpperCase() : null
        this.fc = student && student.fc && student.fc !== 'false' ? true : false
        this.nc = student && student.nc && student.nc !== 'false' ? true : false
        //Previous School Details (for MP/HS passed candidates)
        this.lastBoardExam = student && student.lastBoardExam ? new BoardExam(student.lastBoardExam) : null
        //Address Details
        this.addressPermanent = student && student.addressPermanent ? new Address(student.addressPermanent) : new Address()
        this.addressPresent = student && student.addressPresent ? new Address(student.addressPresent) : new Address()
        //Parents information
        this.father = student && student.father ? new Parent(student.father) : new Parent()
        this.mother = student && student.mother ? new Parent(student.mother) : new Parent()
        this.visitor1 = student && student.visitor1 ? new Visitor(student.visitor1) : null
        this.visitor2 = student && student.visitor2 ? new Visitor(student.visitor2) : null
        this.studentLogin = student && student.studentLogin ? student.studentLogin : false
        //Bank details
        this.bankAccount = student && student.bankAccount ? new BankAccount(student.bankAccount) : new BankAccount()
        //Family member from mission
        this.familyMembersFromMission = student && student.familyMembersFromMission && student.familyMembersFromMission.length > 0 ? student.familyMembersFromMission.map(m => new FamilyMemberFromMission(m)) : []
        this.familyMembersFromMissionFlag = student && student.familyMembersFromMission && student.familyMembersFromMission.length > 0 ? true : false
        //Sibling studying in mission
        this.siblingsStudyingInMission = student && student.siblingsStudyingInMission && student.siblingsStudyingInMission.length > 0 ? student.siblingsStudyingInMission.map(m => new SiblingStudyingInMission(m)) : []
        this.siblingsStudyingInMissionFlag = student && student.siblingsStudyingInMission && student.siblingsStudyingInMission.length > 0 ? true : false
        //Student count information
        // this.studentCountReport = student && student.studentCountReport ? new StudentCountReport(student.studentCountReport) : new StudentCountReport()
        //////////////////////////////////////////////////////////////////////////////////////////
        this.createdon = student && student.createdon ? student.createdon : 0
        this.modifiedon = student && student.modifiedon ? student.modifiedon : 0
        this.subscriberdocid = student && student.subscriberdocid ? student.subscriberdocid : null
        this.docref = student && student.docref ? student.docref : null
        this.newlyInsertedRecord = student && student.newlyInsertedRecord ? student.newlyInsertedRecord : false
        this.recentlyUpdatedRecord = student && student.recentlyUpdatedRecord ? student.recentlyUpdatedRecord : false
    }
    /**
     * @param {Student} student 
     */
    set = (student) => {
        //Necessary details
        this.regno = student && student.regno ? student.regno.toUpperCase() : ''
        this.name = student && student.name ? student.name.toUpperCase() : ''
        this.admissionDate = student && student.admissionDate ? new Date(new Date(student.admissionDate).toDateString()).getTime() : 0
        this.pclass = student && student.pclass ? student.pclass.toUpperCase() : pclasses[0] //present class
        this.stream = student && student.stream ? student.stream.toUpperCase() : streams[0]
        this.medium = student && student.medium ? student.medium.toUpperCase() : mediums[0]
        this.sessionFrom = student && student.sessionFrom ? (+ student.sessionFrom) : new Date().getFullYear()
        this.sessionTo = student && student.sessionTo ? (+ student.sessionTo) : new Date().getFullYear()
        this.fee = student && student.fee ? (+ student.fee) : 0
        this.feeStartingMonth = student && student.feeStartingMonth ? (+ student.feeStartingMonth) : 0
        this.feesPaid = student && student.feesPaid ? student.feesPaid.map(fp => new FeePaidItem(fp)) : []
        this.mobile = student && student.mobile ? (+ student.mobile) : 0
        this.whatsapp = student && student.whatsapp ? (+ student.whatsapp) : 0
        this.email = student && student.email ? student.email : ''
        this.status = student && student.status ? student.status.toUpperCase() : statuses[0]
        this.dropoutRemarks = student && student.dropoutRemarks ? student.dropoutRemarks : null
        this.gender = student && student.gender ? student.gender.toUpperCase() : genders[0]
        //Student's information details
        this.dob = student && student.dob ? new Date(new Date(student.dob).toDateString()).getTime() : 0
        this.aadhar = student && student.aadhar ? (+ student.aadhar) : 0
        this.caste = student && student.caste ? student.caste.toUpperCase() : castes[0]
        this.casteCertificate = student && student.casteCertificate ? new CasteCertificate(student.casteCertificate) : null
        this.bloodGroup = student && student.bloodGroup ? student.bloodGroup : bloodGroups[0]
        this.handicapped = student && student.handicapped && student.handicapped !== 'false' ? true : false
        this.handicappedCertificate = student && student.handicappedCertificate ? new HandicappedCertificate(student.handicappedCertificate) : null
        this.orphan = student && student.orphan && student.orphan !== 'false' ? true : false
        this.orphanRemarks = student && student.orphanRemarks ? student.orphanRemarks : null
        this.previousBranchName = student && student.previousBranchName ? student.previousBranchName.toUpperCase() : ''
        this.banglarsikshaId = student && student.banglarsikshaId ? student.banglarsikshaId.toUpperCase() : null
        this.kanyashreeId = student && student.kanyashreeId ? student.kanyashreeId.toUpperCase() : null
        this.aikyashreeId = student && student.aikyashreeId ? student.aikyashreeId.toUpperCase() : null
        this.fc = student && student.fc && student.fc !== 'false' ? true : false
        this.nc = student && student.nc && student.nc !== 'false' ? true : false
        //Previous School Details (for MP/HS passed candidates)
        this.lastBoardExam = student && student.lastBoardExam ? new BoardExam(student.lastBoardExam) : null
        //Address Details
        this.addressPermanent = student && student.addressPermanent ? new Address(student.addressPermanent) : new Address()
        this.addressPresent = student && student.addressPresent ? new Address(student.addressPresent) : new Address()
        //Parents information
        this.father = student && student.father ? new Parent(student.father) : new Parent()
        this.mother = student && student.mother ? new Parent(student.mother) : new Parent()
        this.visitor1 = student && student.visitor1 ? new Visitor(student.visitor1) : null
        this.visitor2 = student && student.visitor2 ? new Visitor(student.visitor2) : null
        this.studentLogin = student && student.studentLogin ? student.studentLogin : false
        //Bank details
        this.bankAccount = student && student.bankAccount ? new BankAccount(student.bankAccount) : new BankAccount()
        //Family member from mission
        this.familyMembersFromMission = student && student.familyMembersFromMission && student.familyMembersFromMission.length > 0 ? student.familyMembersFromMission.map(m => new FamilyMemberFromMission(m)) : []
        this.familyMembersFromMissionFlag = student && student.familyMembersFromMission && student.familyMembersFromMission.length > 0 ? true : false
        //Sibling studying in mission
        this.siblingsStudyingInMission = student && student.siblingsStudyingInMission && student.siblingsStudyingInMission.length > 0 ? student.siblingsStudyingInMission.map(m => new SiblingStudyingInMission(m)) : []
        this.siblingsStudyingInMissionFlag = student && student.siblingsStudyingInMission && student.siblingsStudyingInMission.length > 0 ? true : false
        //Student count information
        // this.studentCountReport = student && student.studentCountReport ? new StudentCountReport(student.studentCountReport) : new StudentCountReport()
        ///////////////////////////
        this.createdon = student && student.createdon ? student.createdon : this.createdon
        this.modifiedon = student && student.modifiedon ? student.modifiedon : this.modifiedon
        this.subscriberdocid = student && student.subscriberdocid ? student.subscriberdocid : this.subscriberdocid
    }

    string = () => {
        const be = this.lastBoardExam ? [
            'board:' + this.lastBoardExam.board,
            'exam:' + this.lastBoardExam.examName,
            'institute:' + this.lastBoardExam.institute,
            'school:' + this.lastBoardExam.institute,
            'regno:' + this.lastBoardExam.regNo,
            'no:' + this.lastBoardExam.regNo,
            'id:' + this.lastBoardExam.regNo,
            'roll:' + this.lastBoardExam.rollNo,
            'rollno:' + this.lastBoardExam.rollNo,
            'no:' + this.lastBoardExam.rollNo,
            'id:' + this.lastBoardExam.rollNo,
            'marks:' + this.lastBoardExam.marksObtained,
            'passed-year:' + this.lastBoardExam.yearOfPassing,
        ] : []
        const visitor1 = this.visitor1 ? [
            'visitor:' + this.visitor1.name,
            'visitor1:' + this.visitor1.name,
            ...this.visitor1.name.split(" ").map(vnm => "visitor:" + vnm),
            ...this.visitor1.name.split(" ").map(vnm => "visitor1:" + vnm),
            'mobile:' + this.visitor1.mobile,
            'visitor:' + this.visitor1.mobile,
            'visitor1:' + this.visitor1.mobile,
            'email:' + this.visitor1.email,
            'visitor:' + this.visitor1.email,
            'visitor1:' + this.visitor1.email,
            'visitor:' + this.visitor1.relation,
            'visitor1:' + this.visitor1.relation,
        ] : []
        const visitor2 = this.visitor2 ? [
            'visitor:' + this.visitor2.name,
            'visitor2:' + this.visitor2.name,
            ...this.visitor2.name.split(" ").map(vnm => "visitor:" + vnm),
            ...this.visitor2.name.split(" ").map(vnm => "visitor2:" + vnm),
            'mobile:' + this.visitor2.mobile,
            'visitor:' + this.visitor2.mobile,
            'visitor2:' + this.visitor2.mobile,
            'email:' + this.visitor2.email,
            'visitor:' + this.visitor2.email,
            'visitor2:' + this.visitor2.email,
            'visitor:' + this.visitor2.relation,
            'visitor2:' + this.visitor2.relation,
        ] : []
        return [
            'regno:' + this.regno,
            'no:' + this.regno,
            'id:' + this.regno,
            'name:' + this.name,
            'student:' + this.name,
            ...this.name.split(" ").map(nm => 'name:' + nm),
            'date:' + format(new Date(this.admissionDate), 'dd/MM/yyyy'),
            'date:' + format(new Date(this.admissionDate), 'dd-MM-yyyy'),
            'doa:' + format(new Date(this.admissionDate), 'dd/MM/yyyy'),
            'doa:' + format(new Date(this.admissionDate), 'dd-MM-yyyy'),
            'date:' + format(new Date(this.admissionDate), 'MM/yyyy'),
            'date:' + format(new Date(this.admissionDate), 'MM-yyyy'),
            'doa:' + format(new Date(this.admissionDate), 'MM/yyyy'),
            'doa:' + format(new Date(this.admissionDate), 'MM-yyyy'),
            'class:' + this.pclass,
            'stream:' + this.stream,
            'medium:' + this.medium,
            'fees:' + this.fee,
            'mobile:' + this.mobile,
            'student:' + this.mobile,
            'whatsapp:' + this.whatsapp,
            'student:' + this.whatsapp,
            'email:' + this.email,
            'student:' + this.email,
            'status:' + this.status,
            'gender:' + this.gender,
            'sex:' + this.gender,
            'date:' + format(new Date(this.dob), 'dd/MM/yyyy'),
            'date:' + format(new Date(this.dob), 'dd-MM-yyyy'),
            'dob:' + format(new Date(this.dob), 'dd/MM/yyyy'),
            'dob:' + format(new Date(this.dob), 'dd-MM-yyyy'),
            'date:' + format(new Date(this.dob), 'MM/yyyy'),
            'date:' + format(new Date(this.dob), 'MM-yyyy'),
            'dob:' + format(new Date(this.dob), 'MM/yyyy'),
            'dob:' + format(new Date(this.dob), 'MM-yyyy'),
            'aadhar:' + this.aadhar,
            'caste:' + this.caste,
            'blood:' + this.bloodGroup,
            'blood-group:' + this.bloodGroup,
            'bg:' + this.bloodGroup,
            (this.handicapped) ? 'handicapped' : '',
            (this.orphan) ? 'orphan' : '',
            'banglarsiksha:' + this.banglarsikshaId,
            'id:' + this.banglarsikshaId,
            'kanyashree:' + this.kanyashreeId,
            'id:' + this.kanyashreeId,
            'aikyashree:' + this.aikyashreeId,
            'id:' + this.aikyashreeId,
            'father:' + this.father.name,
            ...this.father.name.split(" ").map(fnm => 'father:' + fnm),
            'occupation:' + this.father.occupation,
            'mobile:' + this.father.mobile,
            'father:' + this.father.mobile,
            'mother:' + this.mother.name,
            ...this.mother.name.split(" ").map(mnm => 'mother:' + mnm),
            'mobile:' + this.mother.mobile,
            'mother:' + this.mother.mobile,
            'occupation:' + this.mother.occupation,
            'accountno:' + this.bankAccount.accountNo,
            'account:' + this.bankAccount.accountNo,
            'acno:' + this.bankAccount.accountNo,
            'no:' + this.bankAccount.accountNo,
            'bank:' + this.bankAccount.bankName,
            'ifsc:' + this.bankAccount.ifsc,
            (this.familyMembersFromMissionFlag) ? 'family member is in mission' : '',
            (this.siblingsStudyingInMissionFlag) ? 'brother is in mission' : '',
            (this.siblingsStudyingInMissionFlag) ? 'sister is in mission' : '',
            'vill:' + this.addressPermanent.vill,
            'ps:' + this.addressPermanent.ps,
            'po:' + this.addressPermanent.po,
            'pin:' + this.addressPermanent.pin,
            'block:' + this.addressPermanent.block,
            'dist:' + this.addressPermanent.dist,
            'state:' + this.addressPermanent.state,
            'vill:' + this.addressPresent.vill,
            'ps:' + this.addressPresent.ps,
            'po:' + this.addressPresent.po,
            'pin:' + this.addressPresent.pin,
            'block:' + this.addressPresent.block,
            'dist:' + this.addressPresent.dist,
            'state:' + this.addressPresent.state,
            ...be,
            ...visitor1,
            ...visitor2,
        ].join(',').toUpperCase()
    }

    json = () => {
        if (!this.orphan) this.orphanRemarks = null
        const { regno, name, admissionDate, pclass, medium, sessionFrom, sessionTo,
            fee, feeStartingMonth, mobile, whatsapp, email, status, gender, dob,
            aadhar, caste, bloodGroup, handicapped, orphan, orphanRemarks, previousBranchName,
            banglarsikshaId, kanyashreeId, aikyashreeId, fc, nc,
            familyMembersFromMissionFlag, siblingsStudyingInMissionFlag, studentLogin } = this
        const feesPaid = this.feesPaid.map(fp => fp.json())
        const visitor1 = (this.visitor1) ? this.visitor1.json() : null
        const visitor2 = (this.visitor2) ? this.visitor2.json() : null
        const stream = ['V', 'VI', 'VII', 'VIII', 'IX', 'X'].includes(pclass) ? null : this.stream
        const addressPermanent = this.addressPermanent.json()
        const addressPresent = this.addressPresent.json()
        const father = this.father.json()
        const mother = this.mother.json()
        const bankAccount = this.bankAccount.json()
        const dropoutRemarks = this.status === 'DROPOUT' ? this.dropoutRemarks : null
        const lastBoardExam = pclasses.findIndex(p => p === pclass) > pclasses.findIndex(p => p === 'X') ? this.lastBoardExam.json() : null
        if (!lastBoardExam) this.lastBoardExam = null
        const handicappedCertificate = handicapped ? this.handicappedCertificate.json() : null
        if (!handicappedCertificate) this.handicappedCertificate = null
        const casteCertificate = caste === 'GENERAL' ? null : this.casteCertificate.json()
        if (!casteCertificate) this.casteCertificate = null
        const familyMembersFromMission = this.familyMembersFromMission.map(m => m.json())
        const siblingsStudyingInMission = this.siblingsStudyingInMission.map(m => m.json())
        const studentCountReport = null
        return ({
            regno, name, admissionDate, pclass, stream, medium, sessionFrom, sessionTo,
            fee, feeStartingMonth, feesPaid, mobile, whatsapp, email, status, dropoutRemarks, gender, dob,
            aadhar, caste, bloodGroup, handicapped, orphan, orphanRemarks, previousBranchName,
            banglarsikshaId, kanyashreeId, aikyashreeId, fc, nc,
            familyMembersFromMissionFlag, siblingsStudyingInMissionFlag, studentLogin,
            addressPermanent, addressPresent, father, mother,
            bankAccount, lastBoardExam, handicappedCertificate, casteCertificate,
            familyMembersFromMission, siblingsStudyingInMission, studentCountReport,
            visitor1, visitor2,
        })
    }

    /**
     * @param {string} subscriberdocid 
     */
    insert = async (subscriberdocid) => {
        this.subscriberdocid = subscriberdocid
        this.studentLogin = true
        this.docref = await insertIntoFirestore(subscriberdocid, COLLECTION, this.json(),
            [
                this.name,
                this.regno,
                this.banglarsikshaId,
                this.kanyashreeId,
                this.aikyashreeId,
                this.bankAccount.accountNo,
                this.mobile,
                this.whatsapp,
                this.email,
                this.dob,
                this.fee,
                this.pclass,
                this.status,
                this.bloodGroup,
                this.previousBranchName,
            ])
        if (this.docref) {
            this.newlyInsertedRecord = true
        }
    }

    /**
     * @returns {Promise<boolean>}
     */
    delete = async () => {
        const snap = await fetchFromFirestoreByDocid(COLLECTION, this.docref.id)
        if (snap && snap.exists()) {
            this.set({ ...snap.data() })
            this.docref = snap.ref
        }
        return await deleteFromFirestore(snap.ref)
    }

    /**
     * @param {Student} value 
     * @returns {Promise<boolean>}
     */
    update = async (value) => {
        //downloading latest document
        const snap = await fetchFromFirestoreByDocid(COLLECTION, this.docref.id)
        if (snap && snap.exists()) {
            this.set({ ...snap.data() })
            this.docref = snap.ref
        }
        const newStudent = new Student(value)
        // alert(new Date(newStudent.dob).toDateString())
        if (await updateIntoFirestore(snap.ref, newStudent.json(), [
            newStudent.name,
            newStudent.regno,
            newStudent.banglarsikshaId,
            newStudent.kanyashreeId,
            newStudent.aikyashreeId,
            newStudent.bankAccount.accountNo,
            newStudent.mobile,
            newStudent.whatsapp,
            newStudent.email,
            newStudent.dob,
            newStudent.fee,
            newStudent.pclass,
            newStudent.status,
            newStudent.bloodGroup,
            newStudent.previousBranchName,
        ])) {
            this.set(newStudent)
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

    search = async (subscriberdocid, regno, sessionFrom) => {
        if (subscriberdocid && regno) {
            const snap = await fetchFromFirestoreBySubscriber(
                subscriberdocid, COLLECTION,
                sessionFrom
                    ? [
                        { field: 'sessionFrom', operator: '==', value: (+sessionFrom) },
                        { field: 'regno', operator: '==', value: regno },
                    ]
                    : [{ field: 'regno', operator: '==', value: regno }]
            )
            if (snap && snap.docs && snap.docs.length > 0) {
                this.set(snap.docs[0].data())
                this.docref = snap.docs[0].ref
            }
        }
    }


    /**
     * @private
     */
    selfUpdate = async () => {
        if (await updateIntoFirestore(this.docref, this.json(), [
            this.name,
            this.regno,
            this.banglarsikshaId,
            this.kanyashreeId,
            this.aikyashreeId,
            this.bankAccount.accountNo,
            this.mobile,
            this.whatsapp,
            this.email,
            this.dob,
            this.fee,
            this.pclass,
            this.status,
            this.bloodGroup,
            this.previousBranchName,
        ])) {
            this.modifiedon = new Date().getTime()
            this.newlyInsertedRecord = false
            this.recentlyUpdatedRecord = true
            return true
        }
        return false
    }

    /**
     * @param {Array<FeePaidItem>} oneTimeFees 
     * @param {Array<FeePaidItem>} yearlyFees 
     * @param {Array<FeePaidItem>} monthlyFees 
     */
    makePayment = async (oneTimeFees, yearlyFees, monthlyFees) => {
        this.feesPaid = []
        oneTimeFees.forEach(fpi => {
            if (fpi.paidon) {
                this.feesPaid.push(new FeePaidItem(fpi))
            }
        })
        yearlyFees.forEach(fpi => {
            if (fpi.paidon) {
                this.feesPaid.push(new FeePaidItem(fpi))
            }
        })
        monthlyFees.forEach(fpi => {
            if (fpi.paidon) {
                this.feesPaid.push(new FeePaidItem(fpi))
            }
        })
        await this.selfUpdate()
    }

    /**
     * @param {number} sessionFrom
     * @param {string} pclass 
     * @param {Date} admissionDate 
     * @param {number} feeStartingMonth 
     * @param {number} fee
     * @param {(flag: boolean)=>{}} onFinish 
     */
    promote = async (sessionFrom, pclass, admissionDate, feeStartingMonth, fee, onFinish) => {
        if (this.status === 'ACTIVE') {
            const snap = await fetchFromFirestoreBySubscriber(this.subscriberdocid, COLLECTION, [
                { field: 'sessionFrom', operator: '==', value: (+sessionFrom) },
                { field: 'regno', operator: '==', value: this.regno },
            ])
            if (!(snap && snap.docs && snap.docs.length > 0)) {
                const s = new Student(this)
                s.docref = null
                s.sessionFrom = (+sessionFrom)
                s.sessionTo = s.sessionFrom + 1
                s.pclass = pclass
                s.admissionDate = onlyDate(admissionDate).getTime()
                s.feeStartingMonth = (+feeStartingMonth)
                s.fee = (+fee)
                s.feesPaid = this.feesPaid.filter(f => (f.group === 'ONETIME'))
                await s.insert(this.subscriberdocid)
                onFinish(s.docref ? true : false)
                return
            }
        }
        onFinish(false)
    }

    /**
    * @param {string} subscriberdocid 
    */
    transferTo = async (subscriberdocid, onSuccess = () => { }, onError = () => { }) => {
        this.subscriberdocid = subscriberdocid
        if (await this.update(this)) {
            onSuccess()
        } else {
            onError()
        }
    }
}