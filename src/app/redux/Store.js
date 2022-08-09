import { createStore } from "redux"
import User from "./classes/User"
import Institutes from "./classes/Institutes"
import Students from "./classes/students/Students"
import SelectedStudent from "./classes/students/SelectedStudent"
import StudentCountReports from "./classes/report/StudentCountReports"
import Attendance from "./classes/students/attendance/Attendance"
import ConfirmOnPassword from "./classes/ConfirmOnPassword"
import LocalImageCache from "./classes/LocalImageCache"
import TopbarControl from "./classes/controls/TopbarControl"
import NotificationBarControl from "./classes/controls/NotificationBarControl"
import SnackbarControl from "./classes/controls/SnackbarControl"
import PrintImageControl from "./classes/controls/PrintImageControl"
import PdfImageControl from "./classes/controls/PdfImageControl"
import StudentTableHandler from "./classes/controls/StudentTableHandler"
import Fees from "./classes/fees/Fees"
import Exams from "./classes/students/exam/Exams"
import Result from "./classes/students/result/Result"
import Results from "./classes/students/result/Results"
import VisitingDays from "./classes/visiting-days/VisitingDays"
import Staffs from "./classes/staffs/Staffs"
import DailyClassTaken from "./classes/staffs/classtaken/DailyClassTaken"

const initstate = {
    user: new User(),
    institutes: new Institutes(),
    students: new Students(),
    selectedStudent: new SelectedStudent(),
    studentCountReports: new StudentCountReports(),
    attendance: new Attendance(),
    confirmOnPassword: new ConfirmOnPassword(),
    localImageCache: new LocalImageCache(),
    topbarControl: new TopbarControl(),
    notificationBarControl: new NotificationBarControl(),
    snackbarControl: new SnackbarControl(),
    printImageControl: new PrintImageControl(),
    pdfImageControl: new PdfImageControl(),
    studentTableHandler: new StudentTableHandler(),
    fees: new Fees(),
    exams: new Exams(),
    result: new Result(),
    results: new Results(),
    visitingDays: new VisitingDays(),
    staffs: new Staffs(),
    dailyClassTaken: new DailyClassTaken(),
}

export const Store = createStore((state = initstate, action) => {
    switch (action.type) {
        case 'dispatchUser':
            return { ...state, user: action.payload }
        case 'dispatchInstitutes':
            return { ...state, institutes: action.payload }
        case 'dispatchStudents':
            return { ...state, students: action.payload }
        case 'dispatchSelectedStudent':
            return { ...state, selectedStudent: action.payload }
        case 'dispatchStudentCountReports':
            return { ...state, studentCountReports: action.payload }
        case 'dispatchAttendance':
            return { ...state, attendance: action.payload }
        case 'dispatchConfirmOnPassword':
            return { ...state, confirmOnPassword: action.payload }
        case 'dispatchLocalImageCache':
            return { ...state, localImageCache: action.payload }
        case 'dispatchTopbarControl':
            return { ...state, topbarControl: action.payload }
        case 'dispatchNotificationBarControl':
            return { ...state, notificationBarControl: action.payload }
        case 'dispatchSnackbarControl':
            return { ...state, snackbarControl: action.payload }
        case 'dispatchPrintImageControl':
            return { ...state, printImageControl: action.payload }
        case 'dispatchPdfImageControl':
            return { ...state, pdfImageControl: action.payload }
        case 'dispatchStudentTableHandler':
            return { ...state, studentTableHandler: action.payload }
        case 'dispatchFees':
            return { ...state, fees: action.payload }
        case 'dispatchExams':
            return { ...state, exams: action.payload }
        case 'dispatchResult':
            return { ...state, result: action.payload }
        case 'dispatchResults':
            return { ...state, results: action.payload }
        case 'dispatchVisitingDays':
            return { ...state, visitingDays: action.payload }
        case 'dispatchStaffs':
            return { ...state, staffs: action.payload }
        case 'dispatchDailyClassTaken':
            return { ...state, dailyClassTaken: action.payload }
        default:
            return state
    }
})