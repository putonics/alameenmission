import { Button, Checkbox, FormControlLabel, Icon, Radio, RadioGroup, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useSnackbarControl } from 'app/redux/classes/controls/SnackbarControl'
import Students, { useStudents } from 'app/redux/classes/students/Students'
import Student from 'app/redux/classes/students/Student'
import { generateCsv } from 'app/services/csv'
import React from 'react'
import { format } from 'date-fns'
import ContentBox from '../styledcomponents/ContentBox'
import { useInstitutes } from 'app/redux/classes/Institutes'
import { useUser } from 'app/redux/classes/User'

const CASTE_COLS = [
    { checked: true, label: 'No', field: 'certificateNo' },
    { checked: true, label: 'Issuing authority', field: 'issuingAuthority' },
    { checked: true, label: 'Date of issuance', field: 'issuingDate' },
]

const HANDICAPPED_COLS = [
    { checked: true, label: 'In', field: 'bodyPartsName' },
    { checked: true, label: 'Percentage', field: 'percentage' },
    { checked: true, label: 'No', field: 'certificateNo' },
    { checked: true, label: 'Issuing authority', field: 'issuingAuthority' },
    { checked: true, label: 'Date of issuance', field: 'issuingDate' },
]

const ADDRESS_COLS = [
    { checked: true, label: 'Village', field: 'vill' },
    { checked: true, label: 'Post Office', field: 'po' },
    { checked: true, label: 'Police Station', field: 'ps' },
    { checked: true, label: 'Block', field: 'block' },
    { checked: true, label: 'District', field: 'dist' },
    { checked: true, label: 'State', field: 'state' },
    { checked: true, label: 'Pin code', field: 'pin' },
]

const PARENT_COLS = [
    { checked: true, label: 'Name', field: 'name' },
    { checked: true, label: 'AADHAR no', field: 'aadhar' },
    { checked: true, label: 'Qualification', field: 'qualification' },
    { checked: true, label: 'Occupation', field: 'occupation' },
    { checked: true, label: 'Annual income', field: 'annualIncome' },
    { checked: true, label: 'Mobile', field: 'mobile' },
]

const VISITOR_COLS = [
    { checked: true, label: 'Name', field: 'name' },
    { checked: true, label: 'Relation', field: 'relation' },
    { checked: true, label: 'Mobile', field: 'mobile' },
    { checked: true, label: 'Email', field: 'email' },
    { checked: true, label: 'Address', field: 'address', cols: ADDRESS_COLS },
]

const BANK_COLS = [
    { checked: true, label: 'A/C No', field: 'accountNo' },
    { checked: true, label: 'Bank name', field: 'bankName' },
    { checked: true, label: 'Branch name', field: 'branchName' },
    { checked: true, label: 'IFSC', field: 'ifsc' },
    { checked: true, label: 'Branch address', field: 'branchAddress' },
]

export const COLS = [
    { subheading: 'A. Necessary details', color: '#660099' },
    { checked: true, label: 'Registration no', field: 'regno' },
    { checked: true, label: 'Student\'s name', field: 'name' },
    { checked: false, label: 'Date of admission', field: 'admissionDate' },
    { checked: true, label: 'Class', field: 'pclass' },
    { checked: false, label: 'Stream', field: 'stream' },
    { checked: false, label: 'Medium', field: 'medium' },
    { checked: false, label: 'Session from', field: 'sessionFrom' },
    { checked: false, label: 'Session to', field: 'sessionTo' },
    { checked: true, label: 'Fees', field: 'fee' },
    { checked: false, label: 'Fees starting month', field: 'feeStartingMonth' },
    { checked: true, label: 'Mobile', field: 'mobile' },
    { checked: false, label: 'WhatsApp', field: 'whatsapp' },
    { checked: false, label: 'Email-id', field: 'email' },
    { checked: false, label: 'Status', field: 'status' },
    { checked: true, label: 'Gender', field: 'gender' },
    { subheading: 'B. Student details', color: '#006699' },
    { checked: false, label: 'Date of birth', field: 'dob' },
    { checked: false, label: 'Aadhar no.', field: 'aadhar' },
    { checked: false, label: 'Caste', field: 'caste' },
    { checked: false, label: 'Blood group', field: 'bloodGroup' },
    { checked: false, label: 'Is handicapped', field: 'handicapped' },
    { checked: false, label: 'Is orphan', field: 'orphan' },
    { checked: false, label: 'Orphan remarks', field: 'orphanRemarks' },
    { checked: false, label: 'Previous branch', field: 'previousBranchName' },
    { checked: false, label: 'Banglarsiksha-id', field: 'banglarsikshaId' },
    { checked: false, label: 'Kanyashree-id', field: 'kanyashreeId' },
    { checked: false, label: 'Aikyashree-id', field: 'aikyashreeId' },
    { checked: false, label: 'F.C', field: 'fc' },
    { checked: false, label: 'N.C', field: 'nc' },
    { subheading: 'Certificates', color: '#990066' },
    { checked: false, label: 'Caste certificate', field: 'casteCertificate', cols: CASTE_COLS },//...
    { checked: false, label: 'Handicapped certificate', field: 'handicappedCertificate', cols: HANDICAPPED_COLS },//...
    { subheading: 'C. Addresses', color: '#990066' },
    { checked: false, label: 'Permanent address', field: 'addressPermanent', cols: ADDRESS_COLS },//...
    { checked: false, label: 'Present address', field: 'addressPresent', cols: ADDRESS_COLS },//...
    { subheading: 'D. Parent\'s details', color: '#007733' },
    { checked: false, label: 'Father', field: 'father', cols: PARENT_COLS },//...
    { checked: false, label: 'Mother', field: 'mother', cols: PARENT_COLS },//...
    { subheading: 'E. Visitor\'s details', color: '#660099' },
    { checked: false, label: 'Visiotr-1', field: 'visitor1', cols: VISITOR_COLS },//...
    { checked: false, label: 'Visitor-2', field: 'visitor2', cols: VISITOR_COLS },//...
    { subheading: 'F. Bank details', color: '#006699' },
    { checked: false, label: 'Bank account', field: 'bankAccount', cols: BANK_COLS },//...
    { subheading: 'G. Others', color: '#990066' },
    { checked: false, label: 'Is family member working in misson', field: 'familyMembersFromMissionFlag' },
    { checked: false, label: 'Is siblings studying in mission', field: 'siblingsStudyingInMissionFlag' },
    { subheading: 'H. Board exam', color: '#ff8888', ignore: true },
    { checked: false, label: 'Last board exam', field: 'lastBoardExam', ignore: true },
]

// const lastBoardExam = pclasses.findIndex(p => p === pclass) > 5 ? this.lastBoardExam.json() : null
// if (!lastBoardExam) this.lastBoardExam = null

const getHeaders = (_cols, suffix = '') => {
    const cols = _cols.filter(col => !col.subheading && col.checked && !col.ignore)
    const headers = []
    cols.forEach(col => {
        if (col.cols && col.cols.length > 0) {
            getHeaders(col.cols, suffix + col.label + ' ').forEach(header => headers.push(header))
        } else {
            headers.push(suffix + col.label)
        }
    })
    return headers
}

const getData = (_cols, student) => {
    const cols = _cols.filter(col => !col.subheading && col.checked && !col.ignore)
    const fields = []
    cols.forEach(col => {
        if (col.cols && col.cols.length > 0) {
            getData(col.cols, student ? student[col.field] : '').forEach(field => fields.push(field))
        } else {
            fields.push(student
                ? col.label.toUpperCase().includes('DATE ')
                    ? format(new Date(student[col.field]), "dd/MM/yyyy")
                    : `${student[col.field]}`
                : ''
            )
        }
    })
    return fields
}


const LAST_BOARD_EXAM_HEADERS = [
    'examName', 'board', 'institute', 'yearOfPassing', 'regNo', 'rollNo', 'fullMarks', 'marksObtained'
]

/**
 * { checked: false, label: 'Last board exam', field: 'lastBoardExam' }
 * @param {Students} students 
 * @param {Array<{ checked: boolean, label: string, field: string }>} cols
 */
const getLastBoardExamHeaders = (students, cols) => {
    // console.log('exam header finding', cols)
    if (!cols.find(c => c.label === 'Last board exam' && c.checked)) return []
    const headers = [...LAST_BOARD_EXAM_HEADERS]
    students.list.forEach(s => {
        // console.log(s.name)
        s.lastBoardExam.marks.forEach(m => {
            // console.log(m.subject, m.marksObtained)
            if (!headers.includes(m.subject)) {
                headers.push(m.subject)
            }
        })
    })
    return LAST_BOARD_EXAM_HEADERS.length < headers.length ? headers : []
}

/**
 * @param {Student} student 
 * @param {Array<string>} examHeaders 
 */
const getLastBoardExamData = (student, examHeaders) => {
    if (examHeaders.length === 0) return []
    const fields = []
    LAST_BOARD_EXAM_HEADERS.forEach(e => {
        fields.push(`${student.lastBoardExam[e]}`)
    })
    for (let i = LAST_BOARD_EXAM_HEADERS.length; i < examHeaders.length; i++) {
        const mark = student.lastBoardExam.marks.find(m => m.subject === examHeaders[i])
        fields.push(`${mark ? mark.marksObtained : 0}`)
    }
    return fields
}

const SelectColumns = props => {
    const [operation, setOperation] = React.useState('View')
    const [state, setState] = React.useState(COLS)
    const institutes = useInstitutes()
    const user = useUser()
    const [institute, setInstitute] = React.useState(null)

    React.useEffect(() => {
        if (user.loggedin && institutes.loaded) {
            setInstitute(institutes.getInstitute(user.subscriberdocid))
        } else {
            institutes.load()
        }
    }, [user, institutes])

    React.useEffect(() => {
        if (institute && institute.studentTableCols) {
            const cols = institute.studentTableCols
            COLS.forEach(col => {
                if (!cols.find(s => s.subheading === col.subheading && s.label === col.label)) {
                    cols.push(col)
                }
            })
            setState(cols)
        }
    }, [institute])

    React.useEffect(() => {
        let i = 0
        setState(state.map((col, index) => {
            if (col.checked) {
                if (index < 30 && i < 7) {
                    ++i
                } else {
                    col.checked = false
                }
            }
            return col
        }))
    }, [operation])

    const onChange = (index) => {
        if (operation === 'View'
            && ((state.filter(col => col.checked).length > 6 && !state[index].checked)
                || (state.filter(col => col.checked).length < 4 && state[index].checked))
        ) return
        const newState = state.map(col => col)
        newState[index].checked = !newState[index].checked
        setState(newState)
        if (operation === 'View' && institute) {
            setBusy(true)
            institutes.update(institute, { studentTableCols: state }).finally(() => {
                setBusy(false)
            })
        }
    }

    const [busy, setBusy] = React.useState(false)

    const students = useStudents()
    const snackbarControl = useSnackbarControl()
    const downloadData = () => {
        setBusy(true)
        const headers = getHeaders(state)
        if (headers.length > 0 && students.list.length > 0) {
            ////////////////exam headers//////////////////////
            const examHeaders = getLastBoardExamHeaders(students, state)
            examHeaders.forEach(h => headers.push(h))
            ////////////////////////////////////////////////
            const dataList = []
            students.list.forEach(student => {
                const data = getData(state, student)
                ////////////////exam data///////////////
                const examData = getLastBoardExamData(student, examHeaders)
                examData.forEach(d => data.push(d))
                ////////////////////////////////////////
                dataList.push(data)
            })
            generateCsv(`Students_${students.pclass}_${students.sessionFrom}.csv`, headers, dataList)
        } else {
            snackbarControl.show('Invalid selection!')
        }
        setBusy(false)
    }

    return (
        <ContentBox>
            <RadioGroup
                sx={{ mb: 2 }}
                value={operation || 'View'}
                name="operation"
                onChange={e => setOperation(e.target.value)}
                row
            >
                <FormControlLabel
                    value="View"
                    control={<Radio color="primary" />}
                    label="View"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="Download"
                    control={<Radio color="secondary" />}
                    label="Download"
                    labelPlacement="end"
                />
            </RadioGroup>
            {
                state.map((col, index) => (
                    col.subheading
                        ?
                        <Box key={col.subheading + index} sx={{ py: 1, my: 1, borderBottom: `1px solid ${col.color}`, textAlign: 'center' }}>
                            <Typography sx={{ color: col.color, fontWeight: 600, fontSize: 17 }}>
                                {col.subheading}
                            </Typography>
                        </Box>
                        :
                        <FormControlLabel
                            disabled={busy || (index === 1) || (index > 29 && operation === 'View')}
                            key={col.label + index}
                            sx={col.checked ? { color: '#0066aa' } : { color: '#aaaaaa' }}
                            defaultValue={col.checked}
                            onChange={() => onChange(index)}
                            control={<Checkbox size='small' checked={col.checked} />}
                            label={col.label}
                        />
                ))
            }
            <ContentBox sx={{ textAlign: 'center' }}>
                <Button
                    disabled={busy || operation === 'View'}
                    variant='outlined'
                    onClick={downloadData}
                >
                    <Icon>download</Icon>
                    Excel
                </Button>
            </ContentBox>
        </ContentBox>
    )
}

export default SelectColumns