import { useSelector, useDispatch } from 'react-redux'
import { getStorage, ref, getDownloadURL } from "firebase/storage"

export default class LocalImageCache {

    /**
     * @type {Array<{path: string, url: string}>}
     */
    list = []

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchLocalImageCache = () =>
        this.dispatch({ type: 'dispatchLocalImageCache', payload: new LocalImageCache(this) })

    /**
     * @param {LocalImageCache} lic 
     */
    constructor(lic = null) {
        this.list = lic && lic.list ? lic.list : []
        this.dispatch = lic && lic.dispatch ? lic.dispatch : null
    }

    /**
     * @param {string} path 
     * @returns  {Promise<string>}
     */
    getUrl = async (path) => {
        const ic = this.list.find(o => o.path === path)
        if (ic) return ic.url
        try {
            const url = await getDownloadURL(ref(getStorage(), path))
            this.list.push({ path, url })
            this.dispatchLocalImageCache()
            return url
        } catch (e) { }
        return null
    }

    /**
     * @param {string} path 
     */
    resetUrl = async (path) => {
        setTimeout(async () => {
            const list = this.list.filter(x => x.path !== path)
            try {
                const url = await getDownloadURL(ref(getStorage(), path))
                list.push({ path, url })
                this.list = list
                this.dispatchLocalImageCache()
            } catch (e) { }
        }, 1000)
    }
}

/**
 * @returns {LocalImageCache}
 */
export const useLocalImageCache = () => {
    let localImageCache = useSelector((state) => state.localImageCache)
    if (!localImageCache) localImageCache = new LocalImageCache()
    localImageCache.bindRedux(useDispatch())
    return localImageCache
}
