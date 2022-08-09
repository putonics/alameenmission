import { useSelector, useDispatch } from 'react-redux'

export default class PdfImageControl {

    visible = false
    url = ''

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchPdfImageControl = () =>
        this.dispatch({ type: 'dispatchPdfImageControl', payload: new PdfImageControl(this) })

    /**
     * @param {PdfImageControl} tc 
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
        this.dispatchPdfImageControl()
    }

    hide = () => {
        this.url = ''
        this.visible = false
        this.dispatchPdfImageControl()
    }
}

/**
 * @returns {PdfImageControl}
 */
export const usePdfImageControl = () => {
    let pdfImageControl = useSelector((state) => state.pdfImageControl)
    if (!pdfImageControl) pdfImageControl = new PdfImageControl()
    pdfImageControl.bindRedux(useDispatch())
    return pdfImageControl
}
