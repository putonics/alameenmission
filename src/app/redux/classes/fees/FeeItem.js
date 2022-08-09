export default class FeeItem {
    index = 0//index determines which fee-head comes first and which after
    head = ''//for which fee is needed
    amount = 0

    /**
     * @param {FeeItem} feeItem 
     */
    constructor(feeItem) {
        this.index = feeItem && feeItem.index ? (+feeItem.index) : 0
        this.head = feeItem && feeItem.head ? feeItem.head : ''
        this.amount = feeItem && (+feeItem.amount) >= 0 ? (+feeItem.amount) : 0
    }

    json = () => {
        const { index, head, amount } = this
        return ({ index, head, amount })
    }

    /**
     * @param {FeeItem} feeItem 
     * @returns {boolean}
     */
    equals = (feeItem) => feeItem.head === this.head && feeItem.amount === this.amount

    text = () => `${this.head} ₹${this.amount}`
}