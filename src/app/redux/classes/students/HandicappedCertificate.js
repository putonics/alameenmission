export default class HandicappedCertificate {
    bodyPartsName = ''
    percentage = 0
    certificateNo = ''
    issuingAuthority = ''
    issuingDate = 0

    constructor(hc) {
        this.bodyPartsName = hc && hc.bodyPartsName ? hc.bodyPartsName.toUpperCase() : ''
        this.percentage = hc && hc.percentage ? (+ hc.percentage) : 0
        this.certificateNo = hc && hc.certificateNo ? hc.certificateNo.toUpperCase() : ''
        this.issuingAuthority = hc && hc.issuingAuthority ? hc.issuingAuthority.toUpperCase() : ''
        this.issuingDate = hc && hc.issuingDate ? new Date(new Date(hc.issuingDate).toDateString()).getTime() : 0
    }

    json = () => {
        const { bodyPartsName, percentage, certificateNo, issuingAuthority, issuingDate } = this
        return ({ bodyPartsName, percentage, certificateNo, issuingAuthority, issuingDate })
    }

    /**
     * @param {HandicappedCertificate} h1 
     * @param {HandicappedCertificate} h2 
     */
    static equals = (h1, h2) => Boolean(
        h1 && !h2 &&
        h1.bodyPartsName === h2.bodyPartsName &&
        h1.percentage + '' === h2.percentage + '' &&
        h1.certificateNo === h2.certificateNo &&
        h1.issuingAuthority === h2.issuingAuthority &&
        h1.issuingDate + '' === h2.issuingDate + ''
    )

    /**
     * @param {HandicappedCertificate} h 
     */
    static isValid = (h) => Boolean(
        h &&
        h.bodyPartsName &&
        h.percentage &&
        h.certificateNo &&
        h.issuingAuthority &&
        h.issuingDate
    )
}