export default class ClassTaken {
    pclass = ''
    section = ''
    periodTeacherCodes = ['', '', '', '', '', '', '', '']

    constructor(ct = null) {
        this.pclass = ct && ct.pclass ? ct.pclass : 'OTHER'
        this.section = ct && ct.section ? ct.section : 'A'
        this.periodTeacherCodes = ct && ct.periodTeacherCodes ? ct.periodTeacherCodes : ['', '', '', '', '', '', '', '']
    }

    json = () => {
        const { pclass, section, periodTeacherCodes } = this
        return ({ pclass, section, periodTeacherCodes })
    }
}