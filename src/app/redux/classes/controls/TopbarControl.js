import { useSelector, useDispatch } from 'react-redux'

export default class TopbarControl {

    /**
     * @type {JSX.Element}
     */
    controlBox
    /**
     * @type {(string)=>void}
     */
    search

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchTopbarControl = () =>
        this.dispatch({ type: 'dispatchTopbarControl', payload: new TopbarControl(this) })

    /**
     * @param {TopbarControl} tc 
     */
    constructor(tc = null) {
        this.controlBox = tc && tc.controlBox ? tc.controlBox : <></>
        this.search = tc && tc.search ? tc.search : null//() => { }
        this.dispatch = tc && tc.dispatch ? tc.dispatch : null
    }

    /**
     * @param {JSX.Element} controlBox 
     * @param {(string)=>void} search
     * @returns {JSX.Element}
     */
    setControlBox = (controlBox, search = null) => {
        this.controlBox = controlBox
        this.search = search
        this.dispatchTopbarControl()
        return this.controlBox
    }

    /**
     * @param {(string)=>void} search
     * @returns {(string)=>void}
     */
    setSearch = (search) => {
        this.search = search
        this.dispatchTopbarControl()
        return this.search
    }
}

/**
 * @returns {TopbarControl}
 */
export const useTopbarControl = () => {
    let topbarControl = useSelector((state) => state.topbarControl)
    if (!topbarControl) topbarControl = new TopbarControl()
    topbarControl.bindRedux(useDispatch())
    return topbarControl
}
