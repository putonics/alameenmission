import { useSelector, useDispatch } from 'react-redux'

export default class SnackbarControl {

    visible = false
    message = ''

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchSnackbarControl = () =>
        this.dispatch({ type: 'dispatchSnackbarControl', payload: new SnackbarControl(this) })

    /**
     * @param {SnackbarControl} tc 
     */
    constructor(tc = null) {
        this.visible = tc && tc.visible ? tc.visible : false
        this.message = tc && tc.message ? tc.message : ''
        this.dispatch = tc && tc.dispatch ? tc.dispatch : null
    }

    /**
     * @param {string} message 
     */
    show = (message) => {
        this.message = message
        this.visible = true
        this.dispatchSnackbarControl()
    }

    hide = () => {
        this.message = ''
        this.visible = false
        this.dispatchSnackbarControl()
    }
}

/**
 * @returns {SnackbarControl}
 */
export const useSnackbarControl = () => {
    let snackbarControl = useSelector((state) => state.snackbarControl)
    if (!snackbarControl) snackbarControl = new SnackbarControl()
    snackbarControl.bindRedux(useDispatch())
    return snackbarControl
}
