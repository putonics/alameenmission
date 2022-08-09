import Fee from './Fee'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFromFirestoreBySubscriber, insertIntoFirestore, updateIntoFirestore } from 'app/firebase/Firebase'
import { DocumentReference, DocumentData } from 'firebase/firestore'
import { monthlyFees, oneTimeFees, pclasses, yearlyFees } from '../Constants'
import FeeItem from './FeeItem'
import Student from '../students/Student'
import FeePaidItem from '../fees-received/FeePaidItem'

const getIndex = (pclass) => {
    const index = pclasses.findIndex(pc => pc === pclass)
    return index >= 0 ? index : pclasses.length
}


const dt = new Date()

export default class Fees {

    sessionFrom = 0
    fees = [new Fee()]
    /**
     * @type {DocumentReference<DocumentData>}
     */
    docref
    selectedIndex = -1

    dispatch
    bindRedux = (dispatch) => (this.dispatch = dispatch)
    dispatchFees = () =>
        this.dispatch({ type: 'dispatchFees', payload: new Fees(this) })

    /**
     * @param {Fees} fees 
     */
    constructor(fees = null) {
        this.sessionFrom = fees && fees.sessionFrom ? (+fees.sessionFrom) : (dt.getFullYear() - (dt.getMonth() < 3 ? 1 : 0))
        this.fees = fees && fees.fees ? fees.fees.map(fee => new Fee(fee)) : []
        this.docref = fees && fees.docref ? fees.docref : null
        this.selectedIndex = fees && fees.selectedIndex >= 0 ? fees.selectedIndex : -1
        this.dispatch = fees && fees.dispatch ? fees.dispatch : null
    }

    json = () => {
        const sessionFrom = this.sessionFrom
        const fees = this.fees.map(fee => fee.json())
        return ({ sessionFrom, fees })
    }

    /**
     * @param {Fees} fees 
     */
    set = (fees = null) => {
        this.sessionFrom = fees && fees.sessionFrom ? fees.sessionFrom : (dt.getFullYear() - (dt.getMonth() < 3 ? 1 : 0))
        this.fees = fees && fees.fees ? fees.fees.map(fee => new Fee(fee)) : []
        this.docref = fees && fees.docref ? fees.docref : null
        this.selectedIndex = fees && fees.selectedIndex >= 0 ? fees.selectedIndex : -1
    }

    /**
     * @param {string} pclass
     * @returns {Array<number>} 
     */
    getOneTimeFees = (pclass) => {
        return this.fees.filter(fee => fee.pclass === pclass).map(fee => fee.totalOneTimeFees())
    }

    /**
     * @returns {Array<FeeItem>}
     */
    getOneTimeFeesHeads = () => {
        const heads = []
        this.fees.forEach(fee => {
            fee.oneTimeFees.forEach(otf => {
                if (heads.filter(h => otf.equals(h)).length === 0) {
                    heads.push(new FeeItem({ ...otf.json() }))
                }
            })
        })
        return heads.length > 0 ? heads : oneTimeFees.map(otf => new FeeItem({ ...otf }))
    }

    /**
     * @param {string} pclass
     * @returns {Array<number>} 
     */
    getMonthlyFees = (pclass) => {
        return this.fees.filter(fee => fee.pclass === pclass).map(fee => fee.totalMonthlyFees())
    }

    /**
     * @param {string} pclass
     * @returns {Array<number>} 
     */
    getMonthlyFeesExceptSelected = (pclass) => {
        console.log(`${pclass}, ${this.selectedIndex}`)
        return this.fees.filter((fee, index) => index !== this.selectedIndex && fee.pclass === pclass).map(fee => fee.totalMonthlyFees())
    }

    /**
     * @returns {Array<FeeItem>}
     */
    getMonthlyFeesHeads = () => {
        const heads = []
        this.fees.forEach(fee => {
            fee.monthlyFees.forEach(mf => {
                if (heads.filter(h => mf.equals(h)).length === 0) {
                    heads.push(new FeeItem({ ...mf.json() }))
                }
            })
        })
        return heads.length > 0 ? heads : monthlyFees.map(mf => new FeeItem({ ...mf }))
    }

    /**
     * @param {string} pclass
     * @returns {Array<number>} 
     */
    getYearlyFees = (pclass) => {
        return this.fees.filter(fee => fee.pclass === pclass).map(fee => fee.totalYearlyFees())
    }

    /**
     * @returns {Array<FeeItem>}
     */
    getYearlyFeesHeads = () => {
        const heads = []
        this.fees.forEach(fee => {
            fee.yearlyFees.forEach(yf => {
                if (heads.filter(h => yf.equals(h)).length === 0) {
                    heads.push(new FeeItem({ ...yf.json() }))
                }
            })
        })
        return heads.length > 0 ? heads : yearlyFees.map(yf => new FeeItem({ ...yf }))
    }

    /**
     * @param {string} pclass
     * @returns {Array<Fee>} 
     */
    getAllFees = (pclass) => {
        return this.fees.filter(fee => fee.pclass === pclass).sort((a, b) => b.totalFees() - a.totalFees())
    }

    /**
     * @returns {Array<string>} 
     */
    getPclasses = () => {
        const pclasses = []
        this.fees.forEach(fee => {
            if (!pclasses.includes(fee.pclass)) {
                pclasses.push(fee.pclass)
            }
        })
        if (pclasses.length > 1) {
            return pclasses.sort((a, b) => getIndex(a) - getIndex(b))//getIndex is declared at the top
        }
        return pclasses
    }

    /**
     * @param {string} subscriberdocid 
     * @param {number} sessionFrom 
     */
    fetch = async (subscriberdocid, sessionFrom = (dt.getFullYear() - (dt.getMonth() < 3 ? 1 : 0))) => {
        if (this.docref && this.sessionFrom === (+sessionFrom)) return
        this.sessionFrom = (+sessionFrom)
        const snap = await fetchFromFirestoreBySubscriber(
            subscriberdocid, 'fees',
            [{ field: 'sessionFrom', operator: '==', value: this.sessionFrom }],
            null, null, 1
        )
        if (snap && snap.docs && snap.docs.length > 0) {
            const doc = snap.docs[0]
            this.set({ ...doc.data(), docref: doc.ref })
            this.fees = this.fees.sort((a, b) => getIndex(a.pclass) - getIndex(b.pclass))
        } else if (snap.empty) {
            this.set({ sessionFrom })
            this.docref = await insertIntoFirestore(subscriberdocid, 'fees', this.json())
        }
        this.dispatchFees()
    }

    /**
     * @private
     * @param {Fee} fee
     * @returns {boolean} 
     */
    isMonthlyFeesSame = (fee) => {
        const f1 = new Fee(fee)
        return this.getMonthlyFees(f1.pclass).includes(f1.totalMonthlyFees())
    }

    /**
     * @param {Fee} fee 
     * @param {()=>void} onSuccess 
     * @param {()=>void} onError 
     */
    insert = async (fee, onSuccess, onError) => {
        if (this.isMonthlyFeesSame(fee)) {
            onError() //two monthly fees cannont be same for same class
            return
        }
        this.fees.push(new Fee(fee))
        this.dispatchFees()
        if (await updateIntoFirestore(this.docref, this.json(), null)) {
            onSuccess()
        } else {
            onError()
        }
    }

    /**
    * @param {number} monthlyFee
    * @param {string} pclass
    */
    load = (monthlyFee, pclass) => {
        // console.log(`load: ${monthlyFee}, ${pclass}`)
        this.selectedIndex = this.fees.findIndex(fee => fee.pclass === pclass && fee.totalMonthlyFees() === (+ monthlyFee))
        this.dispatchFees()
    }

    /**
     * @param {number} monthlyFee
     * @param {string} pclass
     * @param {Fee} fee 
     * @param {()=>void} onSuccess 
     * @param {()=>void} onError 
     */
    update = async (monthlyFee, pclass, fee, onSuccess, onError) => {
        const index = this.fees.findIndex(f1 => f1.pclass === pclass && f1.totalMonthlyFees() === (+monthlyFee))
        const newFee = new Fee(fee)
        if (newFee.totalMonthlyFees() !== (+monthlyFee) && this.isMonthlyFeesSame(fee)) {
            onError()//two monthly fees cannont be same for same class
            return
        }
        if (index >= 0) {
            this.fees[index] = newFee
            if (await updateIntoFirestore(this.docref, this.json(), null)) {
                this.dispatchFees()
                onSuccess()
            } else {
                onError()
            }
        } else {
            onError()
        }
    }

    /**
     * @param {string} fromPclass 
     * @param {string} toPclass 
     * @param {()=>void} onSuccess 
     * @param {()=>void} onError 
     */
    copy = async (fromPclass, toPclass, onSuccess, onError) => {
        const fromFees = this.fees.filter(fee => fee.pclass === fromPclass)
        if (fromFees.length > 0) {
            this.fees = this.fees.filter(fee => fee.pclass !== toPclass)
            fromFees.forEach(fee => this.fees.push(new Fee({ ...fee.json(), pclass: toPclass })))
            if (await updateIntoFirestore(this.docref, this.json(), null)) {
                this.dispatchFees()
                onSuccess()
            } else {
                onError()
            }
        } else {
            onError()
        }
    }

    /**
     * @param {string} pclass 
     * @param {()=>void} onSuccess 
     * @param {()=>void} onError 
     */
    delete = async (pclass, onSuccess, onError) => {
        this.fees = this.fees.filter(fee => fee.pclass !== pclass)
        if (await updateIntoFirestore(this.docref, this.json(), null)) {
            this.dispatchFees()
            onSuccess()
        } else {
            onError()
        }
    }

    /**
     * invoked only by developer
    * @param {()=>void} onSuccess 
    * @param {()=>void} onError 
    */
    copyFromMemaryBranch = async (onSuccess, onError) => {
        const snap = await fetchFromFirestoreBySubscriber(
            'ALAMEENMISSION-PURBABARDHAMAN-MEMARI', 'fees',
            [{ field: 'sessionFrom', operator: '==', value: this.sessionFrom }],
            null, null, 1
        )
        if (snap && snap.docs && snap.docs.length > 0) {
            const fees = snap.docs[0].data().fees
            this.fees = fees.map(fee => new Fee(fee))
            if (await updateIntoFirestore(this.docref, this.json(), null)) {
                this.dispatchFees()
                onSuccess()
            } else {
                onError()
            }
        } else {
            onError()
        }
    }

    /**
     * @param {Student} student 
     * @returns {Array<FeePaidItem>}
     */
    getFeePaidItems = (student) => {
        if (this.docref && student && student.docref && this.sessionFrom === student.sessionFrom) {
            const fee = this.fees.find(fee => fee.pclass === student.pclass && fee.totalMonthlyFees() === student.fee)
            return fee.getFeePaidItems(student)
        }
        return []
    }
}

/**
 * @returns {Fees}
 */
export const useFees = () => {
    let fees = useSelector((state) => state.fees)
    if (!fees) fees = new Fees()
    fees.bindRedux(useDispatch())
    return fees
}
