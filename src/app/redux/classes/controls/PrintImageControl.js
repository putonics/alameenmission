import { useSelector, useDispatch } from 'react-redux'

export default class PrintImageControl {

    visible = false
    url = ''

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchPrintImageControl = () =>
        this.dispatch({ type: 'dispatchPrintImageControl', payload: new PrintImageControl(this) })

    /**
     * @param {PrintImageControl} tc 
     */
    constructor(tc = null) {
        this.visible = tc && tc.visible ? tc.visible : false
        this.url = tc && tc.url ? tc.url : ''
        this.dispatch = tc && tc.dispatch ? tc.dispatch : null
    }

    /**
     * @param {string} url 
     */
    print = (url) => {
        this.url = url
        this.visible = url ? true : false
        this.dispatchPrintImageControl()
    }

    hide = () => {
        this.url = ''
        this.visible = false
        this.dispatchPrintImageControl()
    }
}

/**
 * @returns {PrintImageControl}
 */
export const usePrintImageControl = () => {
    let printImageControl = useSelector((state) => state.printImageControl)
    if (!printImageControl) printImageControl = new PrintImageControl()
    printImageControl.bindRedux(useDispatch())
    return printImageControl
}
