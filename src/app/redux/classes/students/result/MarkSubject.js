import Grade from '../exam/Grade'
import Exam from './Exam'
import Mark from './Mark'
export default class MarkSubject {
    name = ''
    code = ''
    theory = new Mark()
    practical = new Mark()
    ///////////////////////
    totalFM = 0
    totalPM = 0
    totalMO = 0
    grade = ''
    passed = false

    /**
     * @param {MarkSubject} m 
     */
    constructor(m = null) {
        this.name = m && m.name ? m.name : ''
        this.code = m && m.code ? m.code : ''
        this.theory = m && m.theory ? new Mark(m.theory) : new Mark()
        this.practical = m && m.practical ? new Mark(m.practical) : new Mark()
        this.totalFM = m && m.totalFM ? m.totalFM : 0
        this.totalPM = m && m.totalPM ? m.totalPM : 0
        this.totalMO = m && m.totalMO ? m.totalMO : 0
        this.grade = m && m.grade ? m.grade : ''
        this.passed = m && m.passed ? m.passed : false
    }

    json = () => {
        const { name, code, grade, totalFM, totalPM, totalMO, passed } = this
        const theory = this.theory.json()
        const practical = this.practical.json()
        return ({ name, code, theory, practical, grade, totalFM, totalPM, totalMO, passed })
    }

    /**
     * @private
     * @param {Array<Grade>} grades 
     */
    calculateGrade = (grades) => {
        this.totalFM = 0
        this.totalPM = 0
        this.totalMO = 0
        if (this.theory) {
            this.totalFM += this.theory.fullMarks
            this.totalPM += this.theory.passMarks
            this.totalMO += this.theory.getMarksObtained()
        }
        if (this.practical) {
            this.totalFM += this.practical.fullMarks
            this.totalPM += this.practical.passMarks
            this.totalMO += this.practical.getMarksObtained()
        }
        this.passed = this.totalMO >= this.totalPM
        const p = parseInt((this.totalMO * 100) / this.totalFM)
        this.grade = grades.find(g => g.min <= p && g.max >= p)?.code
    }

    /**
    * @param {Exam} exam 
    * @param {string} marksObtained 
    * @param {Array<Grade>} grades 
    */
    addMarks = (exam, marksObtained, grades) => {
        const newMark = new Mark({
            ...exam.subjectGroup.subject.examType.json(), marksObtained
        })
        if (['THEORY', 'WRITTEN'].includes(exam.subjectGroup.subject.examType.type)) {
            this.theory = newMark
        } else {
            this.practical = newMark
        }
        this.calculateGrade(grades)
    }
}