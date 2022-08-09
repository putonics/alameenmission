import { fetchFromFirestoreBySubscriber } from "app/firebase/Firebase"
// import { months } from "../../Constants"
import Attendance from "./Attendance"
const COLLECTION = 'attendances'
export const getAttendances = async (subscriberdocid, gender, fromDate, toDate) => {
    // const fromDate = new Date(`01-${months[month]}-${year}`)
    // const toDate = new Date(`01-${months[(month + 1) % 12]}-${month === 11 ? year + 1 : year}`)
    const attendances = []
    try {
        const snap = await fetchFromFirestoreBySubscriber(subscriberdocid, COLLECTION,
            [
                { field: 'gender', operator: '==', value: gender },
                { field: 'timestamp', operator: '>=', value: fromDate },
                { field: 'timestamp', operator: '<', value: toDate }
            ], null, null, null)
        if (snap && snap.docs && snap.docs.length > 0) {
            snap.docs.forEach(doc => {
                attendances.push(new Attendance(doc.data()))
            })
        }
    } catch (ex) {

    }
    return attendances.filter(a => !a.schoolOffReason).sort((a, b) => a.timestamp - b.timestamp)
}