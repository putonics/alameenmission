export default class Mark {
    fullMarks = ''
    passMarks = ''
    marksObtained = 'Ab'
    ////////////////////
    passed = false

    /**
     * @param {Mark} m 
     */
    constructor(m = null) {
        this.fullMarks = m && m.fullMarks ? (+m.fullMarks) : 0
        this.passMarks = m && m.passMarks ? (+m.passMarks) : 0
        this.marksObtained = m ?
            isNaN(m.marksObtained) || m.marksObtained === '' ? 'Ab' : `${m.marksObtained}`
            : 'Ab'
        try {
            const m = parseInt(this.marksObtained)
            this.passed = m >= this.passMarks
        } catch (ex) {
            this.passed = false
        }
    }

    getMarksObtained = () => {
        try {
            const m = parseInt(this.marksObtained)
            this.passed = m >= this.passMarks
            return m
        } catch (ex) {
            this.passed = false
            return 0
        }
    }

    json = () => {
        const { fullMarks, passMarks, marksObtained, passed } = this
        return ({ fullMarks, passMarks, marksObtained, passed })
    }
}