import { data } from './data'
const header = ['regno', 'dob', 'admissionDate', 'name', 'pclass',//0-4
    'stream', 'medium', 'sessionFrom', 'sessionTo', 'fee', 'feeStartingMonth',//5-10
    'mobile', 'whatsapp', 'email', 'status', 'gender', 'aadhar', 'caste', 'bloodGroup',//11-18
    'father.name', 'father.aadhar', 'father.qualification', 'father.occupation', 'father.annualIncome',
    'father.mobile',//19-24
    'mother.name', 'mother.aadhar', 'mother.qualification', 'mother.occupation', 'mother.annualIncome',
    'mother.mobile',//25-30
    'visitor1.name', 'visitor1.relation', 'visitor1.mobile',//31-33 
    'visitor2.name', 'visitor2.relation', 'visitor2.mobile',//34-36
    'address.vill', 'address.ps', 'address.pin', 'address.po', 'address.block', 'address.dist',
    'address.state',//37-43
    'bankAccount.bankName', 'bankAccount.accountNo', 'bankAccount.branchName',
    'bankAccount.ifsc', 'bankAccount.branchAddress',//44-48
    'institute', 'examName', 'board', 'regNo', 'yearOfPassing', 'rollNo', 'marksObtained', 'fullMarks',//49-56
    'BNGA', 'ENGB', 'MATH', 'PHYS', 'BIOS', 'HIST', 'GEGR', //57-63
    'banglarsikshaId'] //64

/**
 * @param {[]} data 
 * @param {number} from 
 * @param {number} to 
 * @param {[]} fields 
 */
const generate = (datax, from, to, fields) => {
    const x = {}
    fields.forEach((field, index) => {
        x[field] = datax[from + index]
    })
    return x
}

export const fetchConstantData = (regno) => {
    const datax = data.filter(d => d[0] === regno)[0]
    const student = generate(datax, 0, 18, [
        'regno', 'dob', 'admissionDate', 'name', 'pclass',//0-4
        'stream', 'medium', 'sessionFrom', 'sessionTo', 'fee', 'feeStartingMonth',//5-10
        'mobile', 'whatsapp', 'email', 'status', 'gender', 'aadhar', 'caste', 'bloodGroup',//11-18
    ])
    ////
    const father = generate(datax, 19, 24, [
        'name', 'aadhar', 'qualification', 'occupation', 'annualIncome', 'mobile',//19-24
    ])
    student['father'] = father
    /////
    const mother = generate(datax, 25, 30, [
        'name', 'aadhar', 'qualification', 'occupation', 'annualIncome', 'mobile',//25-30
    ])
    student['mother'] = mother
    /////
    const visitor1 = generate(datax, 31, 33, [
        'name', 'relation', 'mobile',//31-33 
    ])
    const visitor2 = generate(datax, 34, 36, [
        'name', 'relation', 'mobile',//34-36
    ])
    //////
    const address = generate(datax, 37, 43, [
        'vill', 'ps', 'pin', 'po', 'block', 'dist', 'state',//37-43
    ])
    //////////////////////
    visitor1['address'] = address
    visitor2['address'] = address
    student['addressPresent'] = address
    student['addressPermanent'] = address
    student['visitor1'] = visitor1
    student['visitor2'] = visitor2
    //////////
    const bankAccount = generate(datax, 44, 48, [
        'bankName', 'accountNo', 'branchName', 'ifsc', 'branchAddress',//44-48
    ])
    student['bankAccount'] = bankAccount
    ////
    const lastBoardExam = generate(datax, 49, 56, [
        'institute', 'examName', 'board', 'regNo', 'yearOfPassing', 'rollNo', 'marksObtained', 'fullMarks',//49-56
    ])
    const marks = ['BNGA', 'ENGB', 'MATH', 'PHYS', 'BIOS', 'HIST', 'GEGR'].map((sub, index) => ({
        subject: sub,
        fullMarks: '100',
        marksObtained: datax[57 + index]
    }))
    lastBoardExam['marks'] = marks
    student['lastBoardExam'] = lastBoardExam
    student['casteCertificate'] = { certificateNo: 'UNKNOWN', issuingAuthority: 'UNKNOWN', issuingDate: 0 }
    student['banglarsikshaId'] = datax[64]
    // console.log(student)
    return student
}