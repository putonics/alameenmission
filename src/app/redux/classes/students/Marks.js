export default class Marks {
    subject = ''
    fullMarks = 0
    marksObtained = 0

    constructor(marks) {
        this.subject = marks && marks.subject ? marks.subject.toUpperCase() : ''
        this.fullMarks = marks && marks.fullMarks ? (+ marks.fullMarks) : 0
        this.marksObtained = marks && marks.marksObtained ? (+ marks.marksObtained) : 0
    }

    json = () => {
        const { subject, fullMarks, marksObtained } = this
        return ({ subject, fullMarks, marksObtained })
    }
}