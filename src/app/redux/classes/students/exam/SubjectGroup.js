import Subject from "./Subject"

export default class SubjectGroup {
    name = ''//e.g Language Group, Science Group etc
    /**
     * @type {Array<Subject>}
     */
    subjects = []

    constructor(sg) {
        this.name = sg && sg.name ? sg.name.toUpperCase() : ''
        this.subjects = sg && sg.subjects && sg.subjects.length > 0 ? sg.subjects.map(sb => new Subject(sb)) : [new Subject()]
    }

    json = () => {
        const name = this.name
        const subjects = this.subjects.map(sb => sb.json())
        return ({ name, subjects })
    }

    /**
     * @param {SubjectGroup} s1 
     * @param {SubjectGroup} s2 
     */
    static equals = (s1, s2) => {
        let flag = s1.name === s2.name && s1.subjects.length === s2.subjects.length
        if (!flag) return flag
        s1.subjects.forEach((s, i) => {
            flag = flag && Subject.equals(s, s2.subjects[i])
        })
        return flag
    }

    /**
    * @param {SubjectGroup} sg 
    */
    static isOk = (sg) => (
        sg.name && sg.subjects.length &&
        sg.subjects.filter(s => Subject.isOk(s)).length === sg.subjects.length
    )
}