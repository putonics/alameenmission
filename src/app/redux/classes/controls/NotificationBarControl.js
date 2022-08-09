import { useSelector, useDispatch } from 'react-redux'

export default class NotificationBarControl {

    /**
     * @type {boolean}
     */
    open

    title = ''
    icon = ''
    /**
     * @type {JSX.Element}
     */
    content

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchNotificationBarControl = () =>
        this.dispatch({ type: 'dispatchNotificationBarControl', payload: new NotificationBarControl(this) })

    /**
     * @param {NotificationBarControl} nbc 
     */
    constructor(nbc = null) {
        this.open = nbc && nbc.open ? nbc.open : false
        this.title = nbc && nbc.title ? nbc.title : ''
        this.icon = nbc && nbc.icon ? nbc.icon : ''
        this.content = nbc && nbc.content ? nbc.content : <></>
        this.dispatch = nbc && nbc.dispatch ? nbc.dispatch : null
    }

    /**
     * @param {boolean} open 
     */
    setopen = (open) => {
        this.open = open
        this.dispatchNotificationBarControl()
    }

    /**
     * @param {string} title 
     * @param {string} icon 
     * @param {JSX.Element} content 
     */
    setContent = (title, icon, content) => {
        this.title = title
        this.icon = icon
        this.content = content
        this.dispatchNotificationBarControl()
    }
}

/**
 * @returns {NotificationBarControl}
 */
export const useNotificationBarControl = () => {
    let notificationBarControl = useSelector((state) => state.notificationBarControl)
    if (!notificationBarControl) notificationBarControl = new NotificationBarControl()
    notificationBarControl.bindRedux(useDispatch())
    return notificationBarControl
}
