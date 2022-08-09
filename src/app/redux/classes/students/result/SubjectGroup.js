import Subject from "./Subject"
import ExamSubjectGroup from '../exam/SubjectGroup'

export default class SubjectGroup {
    name = ''
    /**
     * @type {Subject}
     */
    subject

    constructor(sg) {
        this.name = sg && sg.name ? sg.name.toUpperCase() : ''
        this.subject = sg && sg.subject ? new Subject(sg.subject) : new Subject()
    }

    json = () => {
        const name = this.name
        const subject = this.subject.json()
        return ({ name, subject })
    }

    /**
     * @param {ExamSubjectGroup} subjectGroup 
     */
    static parse = (subjectGroup) => {
        const newSubjectGroup = new SubjectGroup()
        newSubjectGroup.name = subjectGroup && subjectGroup.name ? subjectGroup.name.toUpperCase() : ''
        newSubjectGroup.subject = subjectGroup && subjectGroup.subjects ? Subject.parse(subjectGroup.subjects[0]) : new Subject()
        return newSubjectGroup
    }
}