import CategoryCounter from "./CategoryCounter"

export default class ClassWiseStudents {
    pclass
    totalCount
    handicappedCount
    orphanCount

    mediumCount = [new CategoryCounter()]
    streamCount = [new CategoryCounter()]
    statusCount = [new CategoryCounter()]
    bloodGroupCount = [new CategoryCounter()]
    casteCount = [new CategoryCounter()]
    feeCount = [new CategoryCounter()]

    modifiedon

    constructor(cws) {
        this.pclass = cws && cws.pclass ? cws.pclass : ''
        this.totalCount = cws && cws.totalCount ? new CategoryCounter(cws.totalCount) : new CategoryCounter()
        this.totalCount.category = 'TOTAL'
        this.handicappedCount = cws && cws.handicappedCount ? new CategoryCounter(cws.handicappedCount) : new CategoryCounter()
        this.handicappedCount.category = 'HANDICAPPED'
        this.orphanCount = cws && cws.orphanCount ? new CategoryCounter(cws.orphanCount) : new CategoryCounter()
        this.orphanCount.category = 'ORPHAN'
        this.mediumCount = cws && cws.mediumCount ? cws.mediumCount.map((c) => new CategoryCounter(c)) : new Array()
        this.streamCount = cws && cws.streamCount ? cws.streamCount.map((c) => new CategoryCounter(c)) : new Array()
        this.statusCount = cws && cws.statusCount ? cws.statusCount.map((c) => new CategoryCounter(c)) : new Array()
        this.bloodGroupCount = cws && cws.bloodGroupCount ? cws.bloodGroupCount.map((c) => new CategoryCounter(c)) : new Array()
        this.casteCount = cws && cws.casteCount ? cws.casteCount.map((c) => new CategoryCounter(c)) : new Array()
        this.feeCount = cws && cws.feeCount ? cws.feeCount.map((c) => new CategoryCounter(c)) : new Array()
        this.modifiedon = cws && cws.modifiedon ? cws.modifiedon : 0
    }

    json = () => {
        const { pclass, modifiedon } = this
        const totalCount = this.totalCount.json()
        const handicappedCount = this.handicappedCount.json()
        const orphanCount = this.orphanCount.json()
        const mediumCount = this.mediumCount.map((c) => c.json())
        const streamCount = this.streamCount.map((c) => c.json())
        const statusCount = this.statusCount.map((c) => c.json())
        const bloodGroupCount = this.bloodGroupCount.map((c) => c.json())
        const casteCount = this.casteCount.map((c) => c.json())
        const feeCount = this.feeCount.map((c) => c.json())
        return ({
            pclass, modifiedon,
            totalCount, handicappedCount, orphanCount,
            mediumCount, streamCount, statusCount, bloodGroupCount, casteCount, feeCount,
        })
    }

    getTotalCount = () => {
        const { male, female, other } = this.totalCount
        return ({ pclass: this.pclass, maleCount: male, femaleCount: female, otherCount: other })
    }

    getTotal = (gender = null) => {
        const { male, female, other } = this.totalCount
        return gender === 'MALE' ? male : gender === 'FEMALE' ? female : gender === 'OTHER' ? other : (male + female + other)
    }

    getOrphanCount = () => {
        const { male, female, other } = this.orphanCount
        return ({ pclass: this.pclass, maleCount: male, femaleCount: female, otherCount: other })
    }

    getHandicappedCount = () => {
        const { male, female, other } = this.handicappedCount
        return ({ pclass: this.pclass, maleCount: male, femaleCount: female, otherCount: other })
    }

    getStatusCount = () => {
        return this.statusCount.map(c => {
            const { male, female, other, category } = c
            return ({ pclass: this.pclass, status: category, maleCount: male, femaleCount: female, otherCount: other })
        })
    }

    getCasteCount = () => {
        return this.casteCount.map(c => {
            const { male, female, other, category } = c
            return ({ pclass: this.pclass, caste: category, maleCount: male, femaleCount: female, otherCount: other })
        })
    }

    getMediumCount = () => {
        return this.mediumCount.map(c => {
            const { male, female, other, category } = c
            return ({ pclass: this.pclass, medium: category, maleCount: male, femaleCount: female, otherCount: other })
        })
    }

    getStreamCount = () => {
        return this.streamCount.map(c => {
            const { male, female, other, category } = c
            return ({ pclass: this.pclass, stream: category, maleCount: male, femaleCount: female, otherCount: other })
        })
    }

    getFeeCount = () => {
        return this.feeCount.map(c => {
            const { male, female, other, category } = c
            return ({ pclass: this.pclass, fee: category, maleCount: male, femaleCount: female, otherCount: other })
        })
    }
}