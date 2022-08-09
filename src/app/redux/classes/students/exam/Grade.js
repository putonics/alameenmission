export default class Grade {
    code = '' //A+, A, B+
    title = ''//Excelent, Outstanding etc
    min = 0
    max = 0

    constructor(g) {
        this.code = g && g.code ? g.code.toUpperCase() : 'A+'
        this.title = g && g.title ? g.title : 'Excelent'
        this.min = g && g.min ? (+ g.min) : 0
        this.max = g && g.max ? (+ g.max) : 100
    }

    json = () => {
        const { code, title, min, max } = this
        return ({ code, title, min, max })
    }

    /**
     * @param {string} code 
     * @param {string} title 
     * @param {number} min 
     * @param {number} max 
     */
    static create = (code, title, min, max) => new Grade({ code, title, min, max })

    /**
     * @param {Grade} g1 
     * @param {Grade} g2 
     */
    static equals = (g1, g2) => (
        g1.code === g2.code &&
        g1.title === g2.title &&
        g1.min === g2.min &&
        g1.max === g2.max
    )

    /**
    * @param {Grade} g 
    */
    static isOk = (g) => (
        g.code && g.title && g.max && g.max > g.min
    )
}