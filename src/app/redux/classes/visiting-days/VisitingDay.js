import { pclasses } from "../Constants"

export default class VisitingDay {
    pclass = ''
    maleVisitingDays = ''
    femaleVisitingDays = ''
    sessionFrom = 0
    //--
    tempId = 0

    /**
     * @param {VisitingDay} vd 
     */
    constructor(vd = null) {
        this.pclass = vd && vd.pclass ? vd.pclass.toUpperCase() : pclasses[0]
        this.maleVisitingDays = vd && vd.maleVisitingDays ? vd.maleVisitingDays : ''
        this.femaleVisitingDays = vd && vd.femaleVisitingDays ? vd.femaleVisitingDays : ''
        this.sessionFrom = vd && vd.sessionFrom ? (+vd.sessionFrom) : new Date().getFullYear()
        this.tempId = vd && vd.tempId ? vd.tempId : Math.random()
    }

    json = () => {
        const { pclass, maleVisitingDays, femaleVisitingDays, sessionFrom } = this
        return ({ pclass, maleVisitingDays, femaleVisitingDays, sessionFrom })
    }

    valid = () => {
        const { pclass, maleVisitingDays, femaleVisitingDays, sessionFrom } = this
        return (
            pclasses.includes(pclass)
            && maleVisitingDays
            && femaleVisitingDays
            && sessionFrom > 2015
            && sessionFrom < (new Date().getFullYear() + 2)
        )
    }

    /**
     * @param {VisitingDay} visitingDay 
     */
    equals = (visitingDay) => {
        return (
            this.pclass === visitingDay.pclass &&
            this.maleVisitingDays === visitingDay.maleVisitingDays &&
            this.femaleVisitingDays === visitingDay.femaleVisitingDays &&
            this.sessionFrom === visitingDay.sessionFrom
        )
    }
}