import MarkSubjectGroup from "./MarkSubjectGroup"
import Exam from "./Exam"
import StudentResult from "./StudentResult"

export default class Marksheet {
    studentRegno
    studentName
    /**
     * @type {Array<MarkSubjectGroup>}
     */
    markSubjectGroups
    ///////////////////////
    totalFM = 0
    totalPM = 0
    totalMO = 0
    grade = ''
    passed = false

    /**
     * @param {Marksheet} m 
     */
    constructor(m = null) {
        this.studentRegno = m && m.studentRegno ? m.studentRegno : ''
        this.studentName = m && m.studentName ? m.studentName : ''
        this.markSubjectGroups = m && m.markSubjectGroups ? m.markSubjectGroups.map(mx => new MarkSubjectGroup(mx)) : []
        this.totalFM = m && m.totalFM ? m.totalFM : 0
        this.totalPM = m && m.totalPM ? m.totalPM : 0
        this.totalMO = m && m.totalMO ? m.totalMO : 0
        this.grade = m && m.grade ? m.grade : ''
        this.passed = m && m.passed ? m.passed : false
    }

    json = () => {
        const { studentRegno, studentName, totalFM, totalPM, totalMO, grade, passed } = this
        const markSubjectGroups = this.markSubjectGroups
            .map(m => m.json())
            .sort((a, b) => (a.name).localeCompare(b.name))
        return ({ studentName, studentRegno, totalFM, totalPM, totalMO, grade, passed, markSubjectGroups })
    }

    /**
     * @param {Exam} exam 
     * @param {string} marksObtained 
     */
    addMarks = (exam, marksObtained) => {
        let msg = this.markSubjectGroups.find(msg => msg.name === exam.subjectGroup.name)
        if (msg) {
            msg.addMarks(exam, marksObtained, exam.grades)
        } else {
            msg = new MarkSubjectGroup({ name: exam.subjectGroup.name })
            msg.addMarks(exam, marksObtained, exam.grades)
            this.markSubjectGroups.push(msg)
        }
        this.totalFM = 0
        this.totalPM = 0
        this.totalMO = 0
        let nq = 0
        let min = 999999
        let anFM = 100
        this.markSubjectGroups.forEach(m => {
            this.totalFM += m.totalFM
            this.totalPM += m.totalPM
            this.totalMO += m.totalMO
            nq += m.nq
            min = m.min < min ? m.min : min
            anFM = m.anFM
        })
        this.passed = nq < 2 //nq in Two Subjects is considered as not passed
        const p = parseInt(((this.totalMO - min) * 100) / (this.totalFM - anFM))//parseInt((this.totalMO * 100) / this.totalFM)
        this.totalMO = this.totalMO - min
        this.grade = exam.grades.find(g => g.min <= p && g.max >= p)?.code
    }

    /**
     * @param {StudentResult} student 
     */
    static create = (student) => {
        const newMarksheet = new Marksheet()
        newMarksheet.studentRegno = student.regno
        newMarksheet.studentName = student.name
        return newMarksheet
    }
}