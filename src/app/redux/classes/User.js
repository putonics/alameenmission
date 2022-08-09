import { useSelector, useDispatch } from 'react-redux'
import { fetchFromFirestoreByDocid, fetchFromFirestoreBySubscriber } from "app/firebase/Firebase"
import { DocumentReference } from "firebase/firestore"
import { useNavigate } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import workspaceRoutes from 'app/views/workspace/WorkspaceRoutes'
const JWT_VALIDITY = '1 days'
const JWT_SECRET = '~Z!0@q#7$xL)w(C*5K^ev%3J-rV{H9<tb/tb\\G,5.y+n4F1}u=8M\'D"o6S|pA+'

/**
 * @returns  {string}
 */
const getAccessToken = () => window.localStorage.getItem('accessToken')

const logout = () => window.localStorage.removeItem('accessToken')

/**
 * @param {string} accessToken 
 * @returns {boolean}
 */
const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }
    let decodedToken = { exp: 0 }
    try {
        decodedToken = jwtDecode(accessToken)
    } catch (ex) {

    }
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

/**
 * @param {string} accessToken 
 */
const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
    } else {
        localStorage.removeItem('accessToken')
    }
}



export default class User {
    privilege = []
    /**
     * @type {string}
     */
    subscriberdocid
    /**
     * @type {string}
     */
    regno //regno of staff i.e staff id or teacher id etc
    /**
     * @type {string}
     */
    email
    /**
     * @type {string}
     */
    password
    /**
     * @type {string}
     */
    name
    /**
     * @type {'BRANCH ADMIN'|'TEACHING STAFF'|'NON-TEACHING STAFF'|'GATEKEEPER'|'GUARDIAN'|'STUDENT'}
     */
    role
    /**
     * @type {string}
     */
    institute
    /**
     * Only for students and student's relative
     * @type {Array<string>}
     */
    studentdocids

    /**
     * @type {DocumentReference}
     */
    docref
    /**
     * @type {boolean}
     */
    loggedin

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchUser = () => this.dispatch({ type: 'dispatchUser', payload: new User(this) })
    navigate
    bindNavigate = (navigate) => (this.navigate = navigate)
    gotoDashboardPage = () => this.navigate('/dashboard')
    gotoSigninPage = () => {//hard reload
        const a = document.createElement("a")
        a.href = '/session/signin'
        a.click()
        document.body.removeChild(a)
        // this.navigate('/session/signin')
    }

    /**
     * @param {User} user 
     */
    constructor(user) {
        this.subscriberdocid = user && user.subscriberdocid ? user.subscriberdocid : null
        this.regno = user && user.regno ? user.regno : null
        this.email = user && user.email ? user.email : null
        this.password = user && user.password ? user.password : null
        this.name = user && user.name ? user.name : null
        this.role = user && user.role ? user.role : 'GUARDIAN'
        this.institute = user && user.institute ? user.institute : null
        this.studentdocids = user && user.studentdocids ? user.studentdocids : []
        this.docref = user && user.docref ? user.docref : null
        this.dispatch = user && user.dispatch ? user.dispatch : null
        this.navigate = user && user.navigate ? user.navigate : null
        this.loggedin = user && user.loggedin ? user.loggedin : false
        this.privilege = this.role === 'BRANCH ADMIN' ? workspaceRoutes.map(w => w.privilege) : user && user.privilege ? user.privilege : ['']
    }

    /**
     * @param {User} user 
     */
    set = (user) => {
        this.subscriberdocid = user && user.subscriberdocid ? user.subscriberdocid : null
        this.regno = user && user.regno ? user.regno : null
        this.email = user && user.email ? user.email : null
        this.password = user && user.password ? user.password : null
        this.name = user && user.name ? user.name : null
        this.role = user && user.role ? user.role : 'GUARDIAN'
        this.institute = user && user.institute ? user.institute : null
        this.studentdocids = user && user.studentdocids ? user.studentdocids : []
        this.docref = user && user.docref ? user.docref : null
        // this.dispatch = user && user.dispatch ? user.dispatch : null
        // this.navigate = user && user.navigate ? user.navigate : null
        this.loggedin = user && user.loggedin ? user.loggedin : false
        this.privilege = this.role === 'BRANCH ADMIN' ? workspaceRoutes.map(w => w.privilege) : user && user.privilege ? user.privilege : ['']
    }

    static newAdmin = (email, password, name, institute) => new User({ email, password, name, institute, role: 'BRANCH ADMIN' })
    static newTeachingStaff = (email, password, name, institute) => new User({ email, password, name, institute, role: 'TEACHING STAFF' })
    static newNonTeachingStaff = (email, password, name, institute) => new User({ email, password, name, institute, role: 'NON-TEACHING STAFF' })
    static newNonGateKeeper = (email, password, name, institute) => new User({ email, password, name, institute, role: 'GATEKEEPER' })

    json = () => {
        const user = {
            subscriberdocid: this.subscriberdocid | undefined,
            email: this.email | undefined,
            password: this.password | undefined,
            name: this.name | undefined,
            role: this.role | undefined,
            institute: this.institute | undefined,
            studentdocids: this.studentdocids | undefined,
            privilege: this.privilege | ['']
        }
        const userJSON = JSON.stringify(user)
        return userJSON === '{}' ? undefined : JSON.parse(userJSON)
    }

    /**
     * @param {string} email 
     * @param {string} password 
     * @param {string} subscriberdocid 
     */
    signin = async (email, password, subscriberdocid) => {
        try {
            const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, 'users', [{ field: 'email', operator: '==', value: email }], null, null, 0)
            if (snap) {
                const data = snap.docs[0].data()
                let pwd = ''
                try {
                    pwd = jwt.verify(data.password, data.email + data.subscriberdocid)
                } catch (e) {

                }
                if (pwd === password) {
                    this.set({ ...data, docref: snap.docs[0].ref, loggedin: true })
                    const accessToken = jwt.sign({ userdocid: snap.docs[0].ref.id }, JWT_SECRET, {
                        expiresIn: JWT_VALIDITY,
                    })
                    setSession(accessToken)
                    this.dispatchUser()
                    this.gotoDashboardPage()
                }
            }
        } catch (ex) {
        }
    }

    loadProfile = async () => {
        if (this.loggedin) return
        const accessToken = getAccessToken()
        if (!isValidToken(accessToken)) return
        let userdocid = ''
        try {
            userdocid = jwt.verify(accessToken, JWT_SECRET).userdocid
        } catch (e) {

        }
        try {
            const snap = await fetchFromFirestoreByDocid('users', userdocid)
            if (snap) {
                this.set({ ...snap.data(), docref: snap.ref, loggedin: true })
                this.dispatchUser()
                this.gotoDashboardPage()
                return
            }
        } catch (ex) {

        }
    }

    logout = () => {
        logout()
        this.loggedin = false
        this.dispatchUser()
        this.gotoSigninPage()
    }
}

/**
 * @returns {User}
 */
export const useUser = () => {
    let user = useSelector((state) => state.user)
    if (!user) user = new User()
    user.bindRedux(useDispatch())
    user.bindNavigate(useNavigate())
    return user
}

