import { subjectCodes } from "../../Constants"
import ExamType from "./ExamType"

export default class Subject {
    code = ''
    name = ''
    /**
     * @type {Array<ExamType>}
     */
    examTypes = []

    constructor(sb) {
        this.name = sb && sb.name ? sb.name.toUpperCase() : subjectCodes[14] //BNGA is in index 14
        this.code = sb && sb.code && subjectCodes.includes(sb.code.toUpperCase()) ? sb.code.toUpperCase() : subjectCodes[14]
        this.examTypes = sb && sb.examTypes && sb.examTypes.length > 0 ? sb.examTypes.map(et => new ExamType(et)) : [new ExamType()]
    }

    json = () => {
        const { code, name } = this
        const examTypes = this.examTypes.map(et => et.json())
        return ({ code, name, examTypes })
    }

    /**
     * @param {Subject} s1 
     * @param {Subject} s2 
     */
    static equals = (s1, s2) => {
        let flag = s1.code === s2.code && s1.name === s2.name && s1.examTypes.length === s2.examTypes.length
        if (!flag) return flag
        s1.examTypes.forEach((e, i) => {
            flag = flag && ExamType.equals(e, s2.examTypes[i])
        })
        return flag
    }

    /**
    * @param {Subject} s 
    */
    static isOk = (s) => (
        s.code && s.name && s.examTypes.length &&
        s.examTypes.filter(e => ExamType.isOk(e)).length === s.examTypes.length
    )
}