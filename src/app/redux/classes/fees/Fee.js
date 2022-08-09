import { monthlyFees, oneTimeFees, yearlyFees } from '../Constants'
import FeePaidItem from '../fees-received/FeePaidItem'
import Student from '../students/Student'
import FeeItem from './FeeItem'

export default class Fee {
    pclass = ''
    oneTimeFees = [new FeeItem()]
    monthlyFees = [new FeeItem()]
    yearlyFees = [new FeeItem()]

    /**
     * @param {Fee} fee 
     */
    constructor(fee) {
        this.pclass = fee && fee.pclass ? fee.pclass.toUpperCase() : ''
        this.oneTimeFees = fee && fee.oneTimeFees
            ? fee.oneTimeFees.map(otf => new FeeItem(otf)).sort((a, b) => a.index - b.index)
            : oneTimeFees.map((otf, index) => new FeeItem({ ...otf, index }))
        this.monthlyFees = fee && fee.monthlyFees
            ? fee.monthlyFees.map(mf => new FeeItem(mf)).sort((a, b) => a.index - b.index)
            : monthlyFees.map((mf, index) => new FeeItem({ ...mf, index }))
        this.yearlyFees = fee && fee.yearlyFees
            ? fee.yearlyFees.map(yf => new FeeItem(yf)).sort((a, b) => a.index - b.index)
            : yearlyFees.map((yf, index) => new FeeItem({ ...yf, index }))
    }

    json = () => {
        const pclass = this.pclass
        const oneTimeFees = this.oneTimeFees.map(otf => otf.json())
        const monthlyFees = this.monthlyFees.map(mf => mf.json())
        const yearlyFees = this.yearlyFees.map(yf => yf.json())
        return ({ pclass, oneTimeFees, monthlyFees, yearlyFees })
    }

    /**
     * @param {Student} student 
     */
    getFeePaidItems = (student) => {
        const fpis = []
        const doa = new Date(student.admissionDate)//date of admission
        const yoa = doa.getFullYear()
        const moa = doa.getMonth()

        const mofs = student.feeStartingMonth //month of fee starting
        const yofs = mofs < moa ? yoa + 1 : yoa//year of fee starting

        this.oneTimeFees.forEach(otf => {
            const fpi = new FeePaidItem({ ...otf.json(), group: 'ONETIME', paidon: 0, month: -1, year: yofs })
            const fp = student.feesPaid.find(fp => fp.isEqualSignature(fpi))
            fpis.push(fp ? fp : fpi)
        })
        this.yearlyFees.forEach(yf => {
            const fpi = new FeePaidItem({ ...yf.json(), group: 'YEARLY', paidon: 0, month: -1, year: yofs })
            const fp = student.feesPaid.find(fp => fp.isEqualSignature(fpi))
            fpis.push(fp ? fp : fpi)
        })
        const dot = new Date()//date of today
        const yot = mofs ? yofs + 1 : yofs
        let mot = mofs + 11
        //adjust month to 1year only
        // while (yot > yofs && (mot % 12) >= mofs) --mot;
        // if (mot < 0) {
        //     --yot
        //     mot = 0
        // }
        //------------------------
        for (let i = mofs; i <= mot; i++) {
            this.monthlyFees.forEach(mf => {
                const fpi = new FeePaidItem({ ...mf.json(), group: 'MONTHLY', paidon: 0, month: i, year: i > 11 ? yofs + 1 : yofs })
                const fp = student.feesPaid.find(fp => fp.isEqualSignature(fpi))
                fpis.push(fp ? fp : fpi)
            })
        }
        return fpis
    }

    /**
     * @returns {number}
     */
    totalOneTimeFees = () => {
        let sum = 0
        this.oneTimeFees.forEach(otf => sum += otf.amount)
        return sum
    }

    /**
     * @returns {number}
     */
    totalMonthlyFees = () => {
        let sum = 0
        this.monthlyFees.forEach(mf => sum += mf.amount)
        return sum
    }

    /**
     * @returns {number}
     */
    totalYearlyFees = () => {
        let sum = 0
        this.yearlyFees.forEach(yf => sum += yf.amount)
        return sum
    }

    /**
     * @returns {number}
     */
    totalFees = () => {
        return this.totalOneTimeFees() + this.totalYearlyFees() + this.totalMonthlyFees()
    }
}