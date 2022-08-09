export default class Address {
    vill = ''
    po = ''
    ps = ''
    block = ''
    dist = ''
    state = ''
    pin = 0

    constructor(address) {
        this.vill = address && address.vill ? address.vill.toUpperCase() : ''
        this.po = address && address.po ? address.po.toUpperCase() : ''
        this.ps = address && address.ps ? address.ps.toUpperCase() : ''
        this.block = address && address.block ? address.block.toUpperCase() : ''
        this.dist = address && address.dist ? address.dist.toUpperCase() : ''
        this.state = address && address.state ? address.state.toUpperCase() : ''
        this.pin = address && address.pin ? (+ address.pin) : 0
    }

    json = () => {
        const { vill, po, ps, block, dist, state, pin } = this
        return ({ vill, po, ps, block, dist, state, pin })
    }

    /**
     * @param {Address} a1 
     * @param {Address} a2 
     */
    static equals = (a1, a2) => Boolean(
        a1 && a2 &&
        a1.vill === a2.vill &&
        a1.po === a2.po &&
        a1.ps === a2.ps &&
        a1.block === a2.block &&
        a1.dist === a2.dist &&
        a1.state === a2.state &&
        a1.pin + '' === a2.pin + ''
    )

    static isValid = (a) => Boolean(
        a &&
        a.vill &&
        a.po &&
        a.ps &&
        a.block &&
        a.dist &&
        a.state &&
        a.pin &&
        (a.pin + '').length === 6
    )
}