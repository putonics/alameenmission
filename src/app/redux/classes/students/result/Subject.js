import { subjectCodes } from "../../Constants"
import ExamType from "../exam/ExamType"
import ExamSubject from '../exam/Subject'

export default class Subject {
    code = ''
    name = ''
    /**
     * @type {ExamType}
     */
    examType

    constructor(sb) {
        this.code = sb && sb.code && subjectCodes.includes(sb.code.toUpperCase()) ? sb.code.toUpperCase() : subjectCodes[14]
        this.name = sb && sb.name ? sb.name.toUpperCase() : subjectCodes[14] //BNGA is in index 14
        this.examType = sb && sb.examType ? new ExamType(sb.examType) : new ExamType()
    }

    json = () => {
        const { code, name } = this
        const examType = this.examType.json()
        return ({ code, name, examType })
    }

    /**
     * @param {ExamSubject} subject
     */
    static parse = (subject) => {
        const newSubject = new Subject()
        newSubject.code = subject && subject.code && subjectCodes.includes(subject.code.toUpperCase()) ? subject.code.toUpperCase() : subjectCodes[14]
        newSubject.name = subject && subject.name ? subject.name.toUpperCase() : subjectCodes[14] //BNGA is in index 14
        newSubject.examType = subject && subject.examTypes ? new ExamType(subject.examTypes[0]) : new ExamType()
        return newSubject
    }
}