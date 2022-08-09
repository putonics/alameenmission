export const topBarHeight = 64
export const sideNavWidth = 260
export const navbarHeight = 60
export const sidenavCompactWidth = 80
export const containedLayoutWidth = 1200

/**
 * @returns {Date}
 */
export const onlyDate = (date = null) => {
    const x = date ? new Date(date) : new Date()
    x.setHours(0)
    x.setMinutes(0)
    x.setSeconds(0)
    x.setMilliseconds(0)
    return x
}