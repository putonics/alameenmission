import { onlyDate } from "app/utils/constant"

export default class FeePaidItem {
    /**
     * @type {'ONETIME'|'YEARLY'|'MONTHLY'}
     */
    group = 'ONETIME'
    head = ''//for which fee is needed
    amount = 0
    paidon = 0
    month = -1//JAN: 0, DEC: 11, NoMonth: -1
    year = 0

    /**
     * @param {FeePaidItem} feePaidItem 
     */
    constructor(feePaidItem) {
        this.group = feePaidItem && feePaidItem.group ? feePaidItem.group : 'MONTHLY'
        this.head = feePaidItem && feePaidItem.head ? feePaidItem.head : ''
        this.amount = feePaidItem && (+feePaidItem.amount) >= 0 ? (+feePaidItem.amount) : 0
        this.paidon = feePaidItem && feePaidItem.paidon ? onlyDate(feePaidItem.paidon).getTime() : 0
        this.month = feePaidItem && feePaidItem.month !== '' && feePaidItem.month !== null && feePaidItem.month !== undefined ? (+feePaidItem.month) : -1
        this.year = feePaidItem && feePaidItem.year ? feePaidItem.year : 0
    }

    json = () => {
        const { group, head, amount, paidon, month, year } = this
        return ({ group, head, amount, paidon, month, year })
    }

    /**
     * @param {FeePaidItem} fpi 
     */
    isEqualSignature = (fpi) => (
        this.group === fpi.group
        && this.head === fpi.head
        && this.amount === fpi.amount
        && this.month === fpi.month
        && this.year === fpi.year
    )

    /**
     * @param {FeePaidItem} feePaidItem 
     * @returns {boolean}
     */
    equals = (feePaidItem) => feePaidItem.head === this.head && feePaidItem.amount === this.amount

    text = () => `${this.head} ₹${this.amount}`
}