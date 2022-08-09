export default class FamilyMemberFromMission {
    relation = ''
    name = ''
    empid = ''
    branch = ''
    dept = ''

    constructor(m) {
        this.relation = m && m.relation ? m.relation.toUpperCase() : ''
        this.name = m && m.name ? m.name.toUpperCase() : ''
        this.empid = m && m.empid ? m.empid.toUpperCase() : ''
        this.branch = m && m.branch ? m.branch.toUpperCase() : ''
        this.dept = m && m.dept ? m.dept.toUpperCase() : ''
    }

    json = () => {
        const { relation, name, empid, branch, dept } = this
        return ({ relation, name, empid, branch, dept })
    }
}