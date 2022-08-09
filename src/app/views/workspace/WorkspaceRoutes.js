import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'
import UnderMaintanance from './undermaintanance/UnderMaintanance'

const DashboardWorkspace = Loadable(lazy(() => import('./dashboard/DashboardWorkspace')))
const InstituteEntry = Loadable(lazy(() => import('./institute/InstituteEntry')))
const StudentWorkspace = Loadable(lazy(() => import('./students/StudentWorkspace')))
const StudentEntryForm = Loadable(lazy(() => import('./students/StudentEntryForm')))
const StudentPdfViewer = Loadable(lazy(() => import('./students/viewpdf/StudentPdfViewer')))
const AttendanceWorkspace = Loadable(lazy(() => import('./attendance/AttendanceWorkspace')))
const AttendanceReport = Loadable(lazy(() => import('./attendance/report/AttendanceReport.jsx')))
const PromotionWorkspace = Loadable(lazy(() => import('./promotion/PromotionWorkspace')))
const TransferWorkspace = Loadable(lazy(() => import('./transfer/TransferWorkspace')))
const DocumentUploadWorkspace = Loadable(lazy(() => import('./documents/DocumentUploadWorkspace')))
const FeesWorkspace = Loadable(lazy(() => import('./fees/FeesWorkspace')))
const FeeEntryForm = Loadable(lazy(() => import('./fees/FeeEntryForm')))
const VisitingDaysWorkspace = Loadable(lazy(() => import('./visiting-days/VisitingDaysWorkspace')))
const ICardPdfViewer = Loadable(lazy(() => import('./icards/ICardPdfViewer')))
const GatePass = Loadable(lazy(() => import('./gatepass/GatePass')))
const FeesReceived = Loadable(lazy(() => import('./fees-received/FeesReceived')))
const FeesReport = Loadable(lazy(() => import('./fees-received/report/FeesReport')))
const BillPdfViewer = Loadable(lazy(() => import('./fees-received/bill/BillPdfViewer')))
const ResultWorkspace = Loadable(lazy(() => import('./result/ResultWorkspace')))
const ExamWorkspace = Loadable(lazy(() => import('./exam/ExamWorkspace')))
const MarksheetWorkspace = Loadable(lazy(() => import('./marksheet/MarksheetWorkspace')))
const ExamForm = Loadable(lazy(() => import('./exam/ExamForm')))
const StaffWorkspace = Loadable(lazy(() => import('./staffs/StaffWorkspace')))
const StaffForm = Loadable(lazy(() => import('./staffs/StaffForm')))
const DailyClassTakenForm = Loadable(lazy(() => import('./staffs/classtaken/DailyClassTakenForm')))

//At the Loadable this priviliges are compared with user.privilege to show the page
const workspaceRoutes = [
    {
        privilege: 'Dashboard',
        path: '/dashboard',
        element: <DashboardWorkspace />
    },
    {
        // privilege: 'Institute',
        path: '/institute',
        element: <InstituteEntry />
    },
    {
        privilege: 'Student-view',
        path: '/students',
        element: <StudentWorkspace />
    },
    {
        privilege: 'Student-view-pdf',
        path: '/students/view-pdf/:docid',
        element: <StudentPdfViewer />
    },
    {
        privilege: 'Student-entry',
        path: '/students/entry/:docid',
        element: <StudentEntryForm />
    },
    {
        privilege: 'Attendance-entry',
        path: '/attendance',
        element: <AttendanceWorkspace />
    },
    {
        privilege: 'Attendance-report',
        path: '/attendance-report',
        element: <AttendanceReport />
    },
    {
        privilege: 'Student-Promotion',
        path: '/promotion',
        element: <PromotionWorkspace />
    },
    {
        privilege: '',
        path: '/transfer',
        element: <TransferWorkspace />
    },
    {
        privilege: 'Student-icard-download',
        path: '/icard/:docid',
        element: <ICardPdfViewer />
    },
    {
        privilege: 'Student-documents-entry',
        path: '/documents/:docid',
        element: <DocumentUploadWorkspace />
    },
    {
        privilege: 'Fees-view',
        path: '/fees',
        element: <FeesWorkspace />
    },
    {
        privilege: 'Fees-entry',
        path: '/fees/entry/:pclass/:monthlyFee',
        element: <FeeEntryForm />
    },
    {
        privilege: 'Visiting-days-entry',
        path: '/visiting-days',
        element: <VisitingDaysWorkspace />
    },
    {
        privilege: 'Gate-pass-view',
        path: '/gate-pass',
        element: <GatePass />
    },
    {
        privilege: 'Fees-received-entry',
        path: '/fees-received',
        element: <FeesReceived />
    },
    {
        privilege: 'Fees-report',
        path: '/fees-report',
        element: <FeesReport />
    },
    {
        privilege: 'Fees-received-bill-download',
        path: '/fees-received/bill/:docid',
        element: <BillPdfViewer />
    },
    {
        privilege: 'Exam-view',
        path: '/exams',
        element: <ExamWorkspace />
    },
    {
        privilege: 'Exam-entry',
        path: '/exams/:docid',
        element: <ExamForm />
    },
    {
        privilege: 'Result-entry',
        path: '/result',
        element: <ResultWorkspace />
    },
    {
        privilege: 'Marksheet',
        path: '/marksheet',
        element: <MarksheetWorkspace />
    },
    {
        // privilege: 'Staffs-view',
        path: '/staffs',
        element: <StaffWorkspace />
    },
    {
        // privilege: 'Staffs-entry',
        path: '/staffs/:docid',
        element: <StaffForm />
    },
    {
        // privilege: 'Staffs attendance',
        path: '/daily-class-taken',
        element: <DailyClassTakenForm />
    },
    {
        privilege: '',
        path: '/undermaintanance',
        element: <UnderMaintanance />
    },
]

export default workspaceRoutes

export const workspaceNavigation = [
    {
        name: 'Dashboard',
        icon: 'home',
        path: '/dashboard',
    },
    {
        name: 'Students',
        icon: 'groups',
        children: [
            {
                name: 'Details',
                icon: 'group_add',
                path: '/students',
            },
            {
                name: 'Attendance',
                icon: 'recent_actors',
                path: '/attendance',
            },
            {
                name: 'Attendance Report',
                icon: 'recent_actors',
                path: '/attendance-report',
            },
            {
                name: 'Promotion',
                icon: 'trending_up',
                path: '/promotion',
            },
            {
                name: 'Transfer',
                icon: 'east',
                path: '/transfer',
            },

        ]
    },
    {
        name: 'Fees',
        icon: 'receipt',
        children: [
            {
                name: 'Fees slabs',
                icon: 'library_add',
                path: '/fees',
            },
            {
                name: 'Fees received',
                icon: 'currency_rupee',
                path: '/fees-received',
            },
            {
                name: 'Fees report',
                icon: 'cloudy-snowing',
                path: '/fees-report',
            },
        ]
    },
    {
        name: 'Exams & results',
        icon: 'category',
        children: [
            {
                name: 'Exams',
                icon: 'rule',
                path: '/exams',
            },
            {
                name: 'Result',
                icon: 'fact_check',
                path: '/result',
            },
            {
                name: 'Marksheet',
                icon: 'workspace_premium',
                path: '/marksheet',
            },

        ]
    },
    {
        name: 'Staffs',
        icon: 'account_box',
        children: [
            {
                name: 'Staffs details',
                icon: 'account_box',
                path: '/staffs',
            },
            {
                name: 'Staffs attendance',
                icon: 'account_box',
                path: '/daily-class-taken',
            },
        ]
    },
    {
        name: 'Settings',
        icon: 'settings',
        children: [
            {
                name: 'Institute',
                icon: 'school',
                path: '/institute',
            },
            {
                name: 'Visiting days',
                icon: 'calendar_month',
                path: '/visiting-days',
            },
        ]
    },
    {
        name: 'Gate pass',
        icon: 'remember_me',
        path: '/gate-pass',
    },
]