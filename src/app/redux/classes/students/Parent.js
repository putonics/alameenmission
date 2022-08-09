export default class Parent {
    name = ''
    aadhar = 0
    qualification = ''
    occupation = ''
    annualIncome = 0
    mobile = 0

    constructor(parent) {
        this.name = parent && parent.name ? parent.name.toUpperCase() : ''
        this.aadhar = parent && parent.aadhar ? (+ parent.aadhar) : 0
        this.qualification = parent && parent.qualification ? parent.qualification.toUpperCase() : ''
        this.occupation = parent && parent.occupation ? parent.occupation.toUpperCase() : ''
        this.annualIncome = parent && parent.annualIncome ? (+ parent.annualIncome) : 0
        this.mobile = parent && parent.mobile ? (+ parent.mobile) : 0
    }

    json = () => {
        const { name, aadhar, qualification, occupation, annualIncome, mobile } = this
        return ({ name, aadhar, qualification, occupation, annualIncome, mobile })
    }
}