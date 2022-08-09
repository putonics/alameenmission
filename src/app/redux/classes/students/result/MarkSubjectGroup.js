import Grade from '../exam/Grade'
import Exam from './Exam'
import MarkSubject from './MarkSubject'
export default class MarkSubjectGroup {
    name = ''
    /**
     * Array<MarkSubject>
     */
    markSubjects = [new MarkSubject()]
    ///////////////////////
    totalFM = 0
    totalPM = 0
    totalMO = 0
    grade = ''
    passed = false
    /////////////////////////
    nq = 0 //count total nq
    min = 0//hold min mo
    anFM = 0

    constructor(msg = null) {
        this.name = msg && msg.name ? msg.name : ''
        this.markSubjects = msg && msg.markSubjects ? msg.markSubjects.map(m => new MarkSubject(m)) : []
        this.totalFM = msg && msg.totalFM ? msg.totalFM : 0
        this.totalPM = msg && msg.totalPM ? msg.totalPM : 0
        this.totalMO = msg && msg.totalMO ? msg.totalMO : 0
        this.grade = msg && msg.grade ? msg.grade : ''
        this.passed = msg && msg.passed ? msg.passed : false
        this.nq = msg && msg.nq ? msg.nq : 0
        this.min = msg && msg.min ? msg.min : 99999
        this.anFM = msg && msg.anFM ? msg.anFM : 100
    }

    json = () => {
        const { name, passed, totalFM, totalPM, totalMO, grade } = this
        const markSubjects = this.markSubjects.map(m => m.json())
            .sort((a, b) => a.name.localeCompare(b.name))
        return ({ name, passed, totalFM, totalPM, totalMO, grade, markSubjects })
    }

    /**
    * @param {Exam} exam 
    * @param {string} marksObtained 
    * @param {Array<Grade>} grades 
    */
    addMarks = (exam, marksObtained, grades) => {
        let ms = this.markSubjects.find(ms => ms.code === exam.subjectGroup.subject.code)
        if (ms) {
            ms.addMarks(exam, marksObtained, grades)
        } else {
            ms = new MarkSubject({ name: exam.subjectGroup.subject.name, code: exam.subjectGroup.subject.code })
            ms.addMarks(exam, marksObtained, grades)
            this.markSubjects.push(ms)
        }
        this.passed = true
        this.totalFM = 0
        this.totalPM = 0
        this.totalMO = 0
        this.markSubjects.forEach(m => {
            this.totalFM += m.totalFM
            this.totalPM += m.totalPM
            this.totalMO += m.totalMO
            this.passed = this.passed && m.passed
            /////////////////////////////////////
            this.nq += (m.passed ? 0 : 1)
            this.min = (m.totalMO < this.min) ? m.totalMO : this.min
            this.anFM = m.totalFM
        })
        const p = parseInt((this.totalMO * 100) / this.totalFM)
        this.grade = grades.find(g => g.min <= p && g.max >= p)?.code
    }
}