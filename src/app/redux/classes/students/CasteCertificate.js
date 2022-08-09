export default class CasteCertificate {
    certificateNo = ''
    issuingAuthority = ''
    issuingDate = 0

    constructor(cc) {
        this.certificateNo = cc && cc.certificateNo ? cc.certificateNo.toUpperCase() : ''
        this.issuingAuthority = cc && cc.issuingAuthority ? cc.issuingAuthority.toUpperCase() : ''
        this.issuingDate = cc && cc.issuingDate ? new Date(new Date(cc.issuingDate).toDateString()).getTime() : 0
    }

    json = () => {
        const { certificateNo, issuingAuthority, issuingDate } = this
        return ({ certificateNo, issuingAuthority, issuingDate })
    }

    /**
     * @param {CasteCertificate} c1 
     * @param {CasteCertificate} c2 
     */
    static equals = (c1, c2) => Boolean(
        c1 && c2 &&
        c1.certificateNo === c2.certificateNo &&
        c1.issuingAuthority === c2.issuingAuthority &&
        c1.issuingDate === c2.issuingDate
    )

    /**
     * @param {CasteCertificate} c 
     */
    static isValid = (c) => Boolean(
        c &&
        c.certificateNo &&
        c.issuingAuthority &&
        c.issuingDate
    )
}