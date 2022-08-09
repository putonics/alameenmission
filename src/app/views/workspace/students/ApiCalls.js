import { fetchFromFirestore, fetchFromFirestoreBySubscriber } from "app/firebase/Firebase"
import Staff from "app/redux/classes/staffs/Staff"
import Student from "app/redux/classes/students/Student"

/**
 * @param {string} pincode
 * @returns {Promise<Array<{po:string, dist: string, state: string, block: string}>>}
 */
export const searchByPin = async (pincode) => {
    if (pincode && pincode.length === 6) {
        try {
            let data = (await (await fetch(`https://api.postalpincode.in/pincode/${pincode}`)).json())[0]
            if (data.Status === 'Success' && data.PostOffice && data.PostOffice.length > 0) {
                return data.PostOffice.map(p => ({ po: p.Name, dist: p.District, state: p.State, block: p.Block }))
            }
        } catch (ex) {

        }
    }
    return null
}

/**
 * @param {string} ifsc
 * @returns {Promise<{bankName:string, branchName: string, branchAddress: string, ifsc: string}>}
 */
export const searchByIfsc = async (ifsc) => {
    if (ifsc && ifsc.length > 6) {
        try {
            let data = (await (await fetch(`https://ifsc.razorpay.com/${ifsc}`)).json())
            if (data.BRANCH) {
                return ({ bankName: data.BANK, branchName: data.BRANCH, branchAddress: data.ADDRESS, ifsc: data.IFSC })
            }
        } catch (ex) {

        }
    }
    return null
}

/**
 * @param {string} name
 * @returns {Promise<'MALE'|'FEMALE'>}
 */
export const searchGenderByName = async (name) => {
    if (name.trim().includes(" ")) {
        try {
            let data = (await (await fetch(`https://api.genderize.io/?name=${name.trim().split(' ')[0].toLowerCase()}`)).json())
            if (data.gender === 'female') {
                return 'FEMALE'
            }
        } catch (ex) {

        }
    }
    return 'MALE'
}

/**
 * @param {string} regno
 * @returns {Promise<Student>} 
 */
export const searchByRegno = async (regno) => {
    const snap = await fetchFromFirestore('students', [{ field: 'regno', operator: '==', value: regno }])
    if (snap && snap.docs && snap.docs.length > 0) {
        return new Student({ ...snap.docs[0].data(), docref: snap.docs[0].ref })
    }
    return null
}