import Staff from "../Staff"
import DailyClassTaken from "./DailyClassTaken"

export default class ClassTakenReport {
    /**
     * @type {Staff}
     */
    staff

    totalClassTaken = 0

    constructor(at = null) {
        this.staff = at && at.staff ? new Staff(at.staff) : new Staff()
        this.totalClassTaken = at && at.totalClassTaken ? at.totalClassTaken : 0
    }

    /**
     * @param {DailyClassTaken} dct 
     */
    add = (dct) => {
        let n = 0
        dct.classTakens.forEach(ct => {
            ct.periodTeacherCodes.forEach(tcode => {
                if (this.staff.regno === tcode) {
                    n++
                }
            })
        })
        this.totalClassTaken += n
    }
}