/**
 * @param {Object} object1 
 * @param {Object} object2 
 * @param {Array<string>} onfields 
 * @returns {boolean}
 */
export const isEqual = (object1, object2, onfields) => {
    try {
        const unmatched = onfields.filter(field => `${object1[field]}` !== `${object2[field]}`)
        return unmatched.length === 0
    } catch (ex) {
        return false
    }
}

/**
 * @param {Object} object1 
 * @param {Object} object2 
 * @param {Array<string>} onfields 
 * @returns {boolean}
 */
export const isNotEqual = (object1, object2, onfields) => {
    try {
        const unmatched = onfields.filter(field => `${object1[field]}` !== `${object2[field]}`)
        return unmatched.length > 0
    } catch (e) {
        return true
    }
}

/**
 * @returns {boolean}
 */
export const isAllEmpty = (...fields) => {
    const empties = fields.filter(field => !field)
    return empties.length === fields.length
}

/**
 * @returns {boolean}
 */
export const isAllFilled = (...fields) => {
    const empties = fields.filter(field => field !== null && field !== undefined && field !== '' && `${field}` !== '0')
    return empties.length === fields.length
}

