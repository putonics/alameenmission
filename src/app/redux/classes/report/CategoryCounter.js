export default class CategoryCounter {
    category = ''
    male = 0
    female = 0
    other = 0

    constructor(cc) {
        this.category = cc && cc.category ? cc.category : ''
        this.male = cc && cc.male ? cc.male : 0
        this.female = cc && cc.female ? cc.female : 0
        this.other = cc && cc.other ? cc.other : 0
    }

    json = () => {
        const { category, male = 0, female = 0, other = 0 } = this
        return ({ category, male, female, other })
    }

    get = () => {
        const { male = 0, female = 0, other = 0 } = this
        return ({ maleCount: male, femaleCount: female, otherCount: other, totalCount: male + female + other })
    }
}