import { APIURL } from "../../Constants"
import StudentStatus from "./StudentStatus"

export default class ClassWiseAttendance {
    pclass = ''
    sessionFrom = 0
    classOffReason = ''
    students = [new StudentStatus()]
    modifiedon = 0

    /**
     * @param {ClassWiseAttendance} cwa 
     */
    constructor(cwa = null) {
        this.pclass = cwa && cwa.pclass ? cwa.pclass : null
        this.sessionFrom = cwa && cwa.sessionFrom ? (+ cwa.sessionFrom) : 0
        this.modifiedon = cwa && cwa.modifiedon ? (+ cwa.modifiedon) : 0
        this.classOffReason = cwa && cwa.classOffReason ? cwa.classOffReason : null
        this.students = cwa && cwa.students ? cwa.students.map(s => new StudentStatus(s)) : []
    }

    json = () => {
        const { pclass, sessionFrom, classOffReason, modifiedon } = this
        const students = classOffReason ? [] : this.students.map(s => s.json())
        return ({ pclass, sessionFrom, students, classOffReason, modifiedon })
    }

    setClassOff = (reason = 'Session not started') => {
        this.classOffReason = reason
    }

    setPresent = (regno = '') => {
        this.students.find(s => s.regno === regno)?.setPresent()
    }

    setAbscent = (regno = '', reason = '') => {
        this.students.find(s => s.regno === regno)?.setAbscent(reason)
    }

    loadStudents = async (subscriberdocid, gender) => {
        const response = await fetch(`${APIURL}/students/alameenmission/${subscriberdocid}/${this.sessionFrom}/${this.pclass}/1${this.modifiedon}`)
        const data = await response.json()
        if (data) {
            const students = data.students
            if (students && students.length > 0) {
                this.students = []
                students.sort((a, b) => a.regno.localeCompare(b.regno)).forEach(student => {
                    if (student.status !== 'ACTIVE' || student.gender !== gender) return
                    this.students.push(new StudentStatus({ ...student, present: true }))
                })
            }
        }
    }
}