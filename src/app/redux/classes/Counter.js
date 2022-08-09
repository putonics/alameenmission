import { useSelector, useDispatch } from 'react-redux'

export default class Counter {

    value = 0

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchCounter = () =>
        this.dispatch({ type: 'dispatchCounter', payload: new Counter(this) })

    /**
     * @param {Counter} am 
     */
    constructor(am = null) {
        this.value = am && am.value ? am.value : 0
        this.dispatch = am && am.dispatch ? am.dispatch : null
    }

    increment = () => {
        ++this.value
        this.dispatchCounter()
    }

    decrement = () => {
        --this.value
        this.dispatchCounter()
    }
}

/**
 * @returns {Counter}
 */
export const useCounter = () => {
    let counter = useSelector((state) => state.counter)
    if (!counter) counter = new Counter()
    counter.bindRedux(useDispatch())
    return counter
}
