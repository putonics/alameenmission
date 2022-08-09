import Address from "./Address";
export default class Visitor {
    name = ''
    email = ''
    relation = ''
    mobile = 0
    address = new Address()

    /**
     * @param {Visitor} visitor 
     */
    constructor(visitor) {
        this.name = visitor && visitor.name ? visitor.name.toUpperCase() : ''
        this.email = visitor && visitor.email ? visitor.email : ''
        this.relation = visitor && visitor.relation ? visitor.relation.toUpperCase() : ''
        this.mobile = visitor && visitor.mobile ? (+visitor.mobile) : ''
        this.address = visitor && visitor.address ? new Address(visitor.address) : new Address()
    }

    /**
     * @param {Visitor} visitor 
     */
    set = (visitor) => {
        this.name = visitor && visitor.name ? visitor.name.toUpperCase() : this.name
        this.email = visitor && visitor.email ? visitor.email : this.email
        this.relation = visitor && visitor.relation ? visitor.relation.toUpperCase() : this.relation
        this.mobile = visitor && visitor.mobile ? (+visitor.mobile) : this.mobile
        this.address = visitor && visitor.address ? new Address(visitor.address) : this.address
    }

    json = () => {
        const { name, email, relation, mobile, } = this
        const address = this.address.json()
        return ({ name, email, relation, mobile, address })
    }
}
