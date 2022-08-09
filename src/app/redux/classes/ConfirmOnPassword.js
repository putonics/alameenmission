import { useSelector, useDispatch } from 'react-redux'
import jwt from 'jsonwebtoken'
import User from './User'
import { asyncCall } from './AsyncCaller'

export default class ConfirmOnPassword {

    open = false
    error = false
    callOnCinfirmed = () => { }

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchConfirmOnPassword = () =>
        this.dispatch({ type: 'dispatchConfirmOnPassword', payload: new ConfirmOnPassword(this) })

    /**
     * @param {ConfirmOnPassword} cop 
     */
    constructor(cop = null) {
        this.open = cop && cop.open ? true : false
        this.error = cop && cop.error ? true : false
        this.callOnCinfirmed = cop && cop.callOnCinfirmed ? cop.callOnCinfirmed : () => { }
        this.dispatch = cop && cop.dispatch ? cop.dispatch : null
    }

    /**
     * @param {()=>void} callOnCinfirmed 
     */
    askForConfirmation = (callOnCinfirmed) => {
        this.open = true
        this.callOnCinfirmed = callOnCinfirmed
        this.dispatchConfirmOnPassword()
    }

    reset = () => {
        this.open = false
        this.error = false
        this.callOnCinfirmed = () => { }
        this.dispatchConfirmOnPassword()
    }

    /**
     * @param {User} user
     * @param {string} passwordGiven 
     */
    verify = (user, passwordGiven) => {
        const { subscriberdocid, email, password } = user
        try {
            const passwordFetched = jwt.verify(password, email + subscriberdocid)
            if (passwordGiven === passwordFetched) {
                asyncCall(this.callOnCinfirmed)
                this.open = false
                this.error = false
            } else {
                this.error = true
            }
        } catch (e) {
            this.error = true
        }
        this.dispatchConfirmOnPassword()
    }
}

/**
 * @returns {ConfirmOnPassword}
 */
export const useConfirmOnPassword = () => {
    let confirmOnPassword = useSelector((state) => state.confirmOnPassword)
    if (!confirmOnPassword) confirmOnPassword = new ConfirmOnPassword()
    confirmOnPassword.bindRedux(useDispatch())
    return confirmOnPassword
}
