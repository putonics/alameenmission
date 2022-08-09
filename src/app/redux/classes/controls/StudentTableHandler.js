import { useSelector, useDispatch } from 'react-redux'

export default class StudentTableHandler {

    page = 0
    sessionFrom = 0
    pclass = 'V'

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchStudentTableHandler = () =>
        this.dispatch({ type: 'dispatchStudentTableHandler', payload: new StudentTableHandler(this) })

    /**
     * @param {StudentTableHandler} sth 
     */
    constructor(sth = null) {
        this.page = sth && sth.page ? sth.page : 0
        this.sessionFrom = sth && sth.sessionFrom ? sth.sessionFrom : 0
        this.pclass = sth && sth.pclass ? sth.pclass : 'V'
        this.dispatch = sth && sth.dispatch ? sth.dispatch : null
    }

    /**
     * @param {number} page
     * @param {number} sessionFrom
     * @param {string} pclass
     */
    setPage = (page, sessionFrom, pclass) => {
        if (this.sessionFrom !== sessionFrom || this.pclass !== pclass) {
            this.page = 0
            this.sessionFrom = sessionFrom
            this.pclass = pclass
            this.dispatchStudentTableHandler()
        } else if (page !== 0) {
            this.page = page
            this.dispatchStudentTableHandler()
        }
    }
}

/**
 * @returns {StudentTableHandler}
 */
export const useStudentTableHandler = () => {
    let studentTableHandler = useSelector((state) => state.studentTableHandler)
    if (!studentTableHandler) studentTableHandler = new StudentTableHandler()
    studentTableHandler.bindRedux(useDispatch())
    return studentTableHandler
}
