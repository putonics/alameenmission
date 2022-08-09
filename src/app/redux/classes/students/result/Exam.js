import { pclasses } from "../../Constants"
import SubjectGroup from "./SubjectGroup"
import ExamExam from '../exam/Exam'
import Grade from "../exam/Grade"

export default class Exam {
    docref = { id: '' }
    name = ''
    pclass = ''
    sessionFrom = 0
    /**
     * @type {'MALE'|'FEMALE'}
     */
    gender = 'MALE'
    //////////////////
    /**
     * @type {SubjectGroup}
     */
    subjectGroup
    /**
    * @type {Array<Grade>}
    */
    grades = []

    /**
     * @param {Exam} exam 
     */
    constructor(exam) {
        this.docref = exam && exam.docref ? exam.docref : { id: '' }
        this.name = exam && exam.name ? exam.name : 'Annual Examination'
        this.pclass = exam && exam.pclass && pclasses.includes(exam.pclass) ? exam.pclass : 'XI'
        this.sessionFrom = exam && exam.sessionFrom ? (+ exam.sessionFrom) : new Date().getFullYear() - 1
        this.gender = exam && exam.gender ? exam.gender : 'MALE'
        this.subjectGroup = exam && exam.subjectGroup ? new SubjectGroup(exam.subjectGroup) : new SubjectGroup()
        this.grades = exam && exam.grades ? exam.grades.map(g => new Grade(g)) : []
    }


    json = () => {
        const { name, pclass, sessionFrom, gender } = this
        const subjectGroup = this.subjectGroup.json()
        const grades = this.grades.map(g => g.json())
        const docref = { id: this.docref.id }
        return ({ docref, name, pclass, sessionFrom, gender, subjectGroup, grades })
    }

    /**
     * @param {ExamExam} exam 
     */
    static parse = (exam) => {
        const newExam = new Exam()
        newExam.docref = exam && exam.docref ? exam.docref : { id: '' }
        newExam.name = exam && exam.name ? exam.name : 'Annual Examination'
        newExam.pclass = exam && exam.pclass && pclasses.includes(exam.pclass) ? exam.pclass : 'XI'
        newExam.sessionFrom = exam && exam.sessionFrom ? (+ exam.sessionFrom) : new Date().getFullYear() - 1
        newExam.gender = exam && exam.gender ? exam.gender : 'MALE'
        newExam.subjectGroup = exam && exam.subjectGroups ? SubjectGroup.parse(exam.subjectGroups[0]) : new SubjectGroup()
        newExam.grades = exam && exam.grades ? exam.grades : []
        return newExam
    }
}