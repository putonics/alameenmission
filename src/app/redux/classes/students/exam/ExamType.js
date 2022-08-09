export const EXAM_TYPE = ['THEORY', 'WRITTEN', 'PRACTICAL', 'ORAL', 'VIVA', 'PROJECT', 'ASSIGNMENT']
export default class ExamType {
    /**
     * @type {'THEORY' | 'WRITTEN' | 'PRACTICAL' | 'ORAL' | 'VIVA' | 'PROJECT' | 'ASSIGNMENT'}
     */
    type = 'THEORY'
    timestamp = 0 //Date & time schedule of exam
    fullMarks = 0
    passMarks = 0
    teacherRegno = ''

    constructor(et) {
        this.type = et && et.type ? et.type.toUpperCase() : EXAM_TYPE[0]
        this.timestamp = et && et.timestamp ? et.timestamp : new Date().getTime()
        this.fullMarks = et && et.fullMarks && et.fullMarks > 0 ? (+ et.fullMarks) : 100
        this.passMarks = et && et.passMarks && et.passMarks > 0 ? (+ et.passMarks) : 30
        this.teacherRegno = et && et.teacherRegno ? et.teacherRegno : ''
    }

    json = () => {
        const { type, timestamp, fullMarks, passMarks, teacherRegno } = this
        return ({ type, timestamp, fullMarks, passMarks, teacherRegno })
    }

    /**
     * @param {ExamType} e1 
     * @param {ExamType} e2 
     */
    static equals = (e1, e2) => Boolean(
        e1.type === e2.type
        && e1.timestamp === e2.timestamp
        && e1.fullMarks === e2.fullMarks
        && e1.passMarks === e2.passMarks
        && e1.teacherRegno === e2.teacherRegno
    )

    /**
     * @param {ExamType} e 
     */
    static isOk = (e) => Boolean(
        e.type && e.timestamp && e.fullMarks && e.passMarks && e.teacherRegno
    )
}