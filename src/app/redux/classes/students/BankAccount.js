export default class BankAccount {
    accountNo = ''
    bankName = ''
    branchName = ''
    ifsc = ''
    branchAddress = ''

    constructor(ba) {
        this.accountNo = ba && ba.accountNo ? ba.accountNo : '00000000000000'
        this.bankName = ba && ba.bankName ? ba.bankName.toUpperCase() : 'UNKNOWN BANK'
        this.branchName = ba && ba.branchName ? ba.branchName.toUpperCase() : 'UNKNOWN BRANCH'
        this.ifsc = ba && ba.ifsc ? ba.ifsc.toUpperCase() : 'UNKNOWN IFSC'
        this.branchAddress = ba && ba.branchAddress ? ba.branchAddress : 'UNKNOWN ADDRESS'
    }

    json = () => {
        const { accountNo, bankName, branchName, ifsc, branchAddress } = this
        return ({ accountNo, bankName, branchName, ifsc, branchAddress })
    }

    /**
     * @param {BankAccount} b1 
     * @param {BankAccount} b2 
     */
    static equals = (b1, b2) => Boolean(
        b1 && b2
        && b1.accountNo === b2.accountNo
        && b1.bankName === b2.bankName
        && b1.branchName === b2.branchName
        && b1.ifsc === b2.ifsc
        && b1.branchAddress === b2.branchAddress
    )

    /**
     * @param {BankAccount} b 
     */
    static isValid = (b) => Boolean(
        b
        && b.accountNo
        && b.bankName
        && b.branchName
        && b.ifsc
        && b.branchAddress
    )
}