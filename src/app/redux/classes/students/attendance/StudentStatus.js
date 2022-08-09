export default class StudentStatus {
    name = ''
    regno = ''
    present = false
    abscentReason = ''

    /**
     * @param {StudentStatus} ss 
     */
    constructor(ss = null) {
        this.name = ss && ss.name ? ss.name : null
        this.regno = ss && ss.regno ? ss.regno : null
        this.present = ss && ss.present ? ss.present : false
        this.abscentReason = ss && ss.abscentReason ? ss.abscentReason : null
    }

    json = () => {
        const { name, regno, present, abscentReason } = this
        return ({ name, regno, present, abscentReason })
    }

    setPresent = () => {
        this.present = true
        this.abscentReason = null
    }

    setAbscent = (reason = 'Illness') => {
        this.present = false
        this.abscentReason = reason
    }
}