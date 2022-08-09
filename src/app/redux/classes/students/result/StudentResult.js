export default class StudentResult {
    name = ''
    regno = ''
    appeared = true
    marks = 0

    /**
     * @param {StudentResult} ss 
     */
    constructor(ss = null) {
        this.name = ss && ss.name ? ss.name : null
        this.regno = ss && ss.regno ? ss.regno : null
        this.appeared = ss && ss.appeared ? ss.appeared : true
        this.marks = ss && ss.marks ? (+ ss.marks)
            : (ss.marks === '' || ss.marks === undefined || ss.marks === null) ? null : 0
    }

    json = () => {
        const { name, regno, appeared, marks } = this
        return ({ name, regno, appeared, marks })
    }

    setPresent = () => {
        this.appeared = true
    }
    setAbscent = () => {
        this.appeared = false
    }

    /**
     * @param {StudentResult} s1 
     * @param {StudentResult} s2 
     */
    static equals = (s1, s2) => Boolean(
        s1 && s2
        && s1.name === s2.name
        && s1.regno === s2.regno
        && s1.appeared === s2.appeared
        && s1.marks === s2.marks
    )

    /**
     * @param {StudentResult} s 
     */
    static isValid = (s) => Boolean(s && s.name && s.regno && s.appeared)
}