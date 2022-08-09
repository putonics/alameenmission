export default class SiblingStudyingInMission {
    regno = ''
    name = ''
    branch = ''
    fee = 0

    constructor(m) {
        this.regno = m && m.regno ? m.regno.toUpperCase() : ''
        this.name = m && m.name ? m.name.toUpperCase() : ''
        this.branch = m && m.branch ? m.branch.toUpperCase() : ''
        this.fee = m && m.fee ? (+m.fee) : 0
    }

    json = () => {
        const { regno, name, branch, fee } = this
        return ({ regno, name, branch, fee })
    }
}