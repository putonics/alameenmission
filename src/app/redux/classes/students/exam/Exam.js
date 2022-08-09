import { insertIntoFirestore, updateIntoFirestore } from "app/firebase/Firebase"
import { DocumentReference } from "firebase/firestore"
import { pclasses } from "../../Constants"
import { COLLECTION_EXAMS } from "./Exams"
import Grade from "./Grade"
import SubjectGroup from "./SubjectGroup"

export default class Exam {
    name = ''
    pclass = ''
    sessionFrom = 0
    /**
     * @type {'MALE'|'FEMALE'}
     */
    gender = 'MALE'
    /**
     * @type {Array<SubjectGroup>}
     */
    subjectGroups = []
    /**
     * @type {Array<Grade>}
     */
    grades = []
    //////////////////
    createdon = 0
    modifiedon = 0
    subscriberdocid = ''
    ////////////////////
    /**
     * @type {DocumentReference}
     */
    docref

    /**
     * @param {Exam} exam 
     */
    constructor(exam) {
        this.name = exam && exam.name ? exam.name : 'Annual Examination'
        this.pclass = exam && exam.pclass && pclasses.includes(exam.pclass) ? exam.pclass : 'XI'
        this.sessionFrom = exam && exam.sessionFrom ? (+ exam.sessionFrom) : new Date().getFullYear() - 1
        this.gender = exam && exam.gender ? exam.gender : 'MALE'
        this.subjectGroups = exam && exam.subjectGroups && exam.subjectGroups.length > 0
            ? exam.subjectGroups.map(sg => new SubjectGroup(sg))
            : [new SubjectGroup()]
        this.grades = exam && exam.grades && exam.grades.length > 0
            ? exam.grades.map(g => new Grade(g))
            : [
                Grade.create('O', 'Outstanding', 90, 100),
                Grade.create('A+', 'Excellent', 80, 89),
                Grade.create('A', 'Very Good', 70, 79),
                Grade.create('B+', 'Good', 60, 69),
                Grade.create('B', 'Satisfactory', 50, 59),
                Grade.create('C', 'Fair', 40, 49),
                Grade.create('P', 'Passed', 30, 39),
                Grade.create('F', 'Failed', 0, 29),
            ]
        this.createdon = exam && exam.createdon ? (+exam.createdon) : new Date().getTime()
        this.modifiedon = exam && exam.modifiedon ? (+exam.modifiedon) : this.createdon
        this.subscriberdocid = exam && exam.subscriberdocid ? exam.subscriberdocid : ''
        this.docref = exam && exam.docref ? exam.docref : null
    }

    /**
     * @param {Exam} exam 
     */
    set = (exam) => {
        this.name = exam && exam.name ? exam.name : this.name
        this.pclass = exam && exam.pclass && pclasses.includes(exam.pclass) ? exam.pclass : this.pclass
        this.sessionFrom = exam && exam.sessionFrom ? (+ exam.sessionFrom) : this.sessionFrom
        this.gender = exam && exam.gender ? exam.gender : this.gender
        this.subjectGroups = exam && exam.subjectGroups && exam.subjectGroups.length > 0
            ? exam.subjectGroups.map(sg => new SubjectGroup(sg))
            : this.subjectGroups
        this.grades = exam && exam.grades && exam.grades.length > 0
            ? exam.grades.map(g => new Grade(g))
            : this.grades
        this.createdon = exam && exam.createdon ? (+exam.createdon) : this.createdon
        this.modifiedon = exam && exam.modifiedon ? (+exam.modifiedon) : this.modifiedon
        this.subscriberdocid = exam && exam.subscriberdocid ? exam.subscriberdocid : this.subscriberdocid
        this.docref = exam && exam.docref ? exam.docref : this.docref
    }

    json = () => {
        const { name, pclass, sessionFrom, gender } = this
        const subjectGroups = this.subjectGroups.map(sg => sg.json())
        const grades = this.grades.map(g => g.json())
        return ({ name, pclass, sessionFrom, gender, subjectGroups, grades })
    }

    insert = async () => {
        const docref = await insertIntoFirestore(this.subscriberdocid, COLLECTION_EXAMS, this.json())
        if (docref) {
            this.docref = docref
            return true
        }
        return false
    }

    update = async () => {
        if (this.docref) {
            return await updateIntoFirestore(this.docref, this.json())
        }
        return false
    }

    /**
     * @param {Exam} e1 
     * @param {Exam} e2 
     */
    static equals = (e1, e2) => {
        let flag = e1.name === e2.name && e1.pclass === e2.pclass
            && e1.sessionFrom === e2.sessionFrom
            && e1.gender === e2.gender
            && e1.subjectGroups.length === e2.subjectGroups.length
            && e1.grades.length === e2.grades.length
        if (!flag) return flag
        e1.subjectGroups.forEach((s, i) => {
            flag = flag && SubjectGroup.equals(s, e2.subjectGroups[i])
        })
        e1.grades.forEach((g, i) => {
            flag = flag && Grade.equals(g, e2.grades[i])
        })
        return flag
    }

    /**
    * @param {Exam} e 
    */
    static isOk = (e) => (
        e.name && e.pclass && e.sessionFrom && e.gender
        && e.subjectGroups.length
        && e.grades.length
        && e.subjectGroups.filter(sg => SubjectGroup.isOk(sg)).length === e.subjectGroups.length
        && e.grades.filter(g => Grade.isOk(g)).length === e.grades.length
    )
}