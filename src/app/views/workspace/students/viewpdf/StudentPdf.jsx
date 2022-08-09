import React from 'react'
import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { APIURL, images, months } from 'app/redux/classes/Constants'
import Assets from '../../../../../assets'
import { Institute } from 'app/redux/classes/Institutes'
import Student from 'app/redux/classes/students/Student'
import { format } from 'date-fns'

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: '0.5cm',
    },
    section: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: '0.5cm',
        flexWrap: 'wrap',
    },
    card: {
        backgroundColor: '#ffffff',
        margin: '0.5cm',
        padding: '4px'
    },
    title: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginTop: '4px',
    },
    subtitle: {
        fontSize: '10px',
        marginTop: '4px',
    },
    subtitle2: {
        fontSize: '8px',
        marginTop: '4px',
    },
})

const Field = props => {
    return (
        <View style={{
            paddingHorizontal: '4px', width: '100%',
            flexDirection: 'row', paddingVertical: '3px',
            justifyContent: 'flex-start'
        }}>
            <View>
                <Text style={{ fontSize: '10px', color: '#444444' }}>{props?.name}&nbsp;</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: '10px', color: '#000000', marginLeft: '4px', fontWeight: 700 }}>
                    {props?.value}
                </Text>
            </View>
        </View>
    )
}

/**
 * @param {{student:Student, institute: Institute}} props 
 */
const StudentPdf = props => {
    return (
        <Page size="A4" style={styles.page}>
            <View style={{ padding: '0.1cm', border: '4px solid #aaaacc' }}>
                <View style={{ padding: '0.4cm', border: '1px solid #aaaacc', height: '28cm' }}>
                    <View style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 8, color: '#444466' }}>Printed on: {format(new Date(), 'dd-MMM-yyyy')}</Text>
                        <View style={{ padding: 4, backgroundColor: '#aaaacc', border: '1px solid #aaaacc', borderRight: '0.5cm solid #aaaacc', marginRight: '-1.2cm' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{props?.student?.regno}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: '4cm', alignItems: 'center', justifyContent: 'center' }} >
                            <Image src={Assets.logo} style={{ width: '2.8cm', height: '2.8cm' }} />
                        </View>
                        <View style={{ width: '12cm', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ fontSize: 20, fontWeight: 900 }}>
                                <Text>Admission Form</Text>
                            </View>
                            <Text style={styles.title}>
                                {props?.institute?.institute}
                            </Text>
                            <Text style={styles.subtitle}>
                                {props?.institute?.place}
                            </Text>
                            <Text style={styles.subtitle2}>
                                {props?.institute?.email}
                            </Text>
                            <View style={styles.title}>
                                <Text>{props?.student?.sessionFrom}-{(props?.student?.sessionFrom % 100 + 1)}</Text>
                            </View>
                            <View style={{
                                paddingHorizontal: '4px', width: '100%',
                                flexDirection: 'row', paddingVertical: '3px',
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: '12px', color: '#444444' }}>CLASS: </Text>
                                <Text style={{ fontSize: '12px', color: '#000000', marginLeft: '4px', fontWeight: 700 }}>{props?.student?.pclass}</Text>
                            </View>
                        </View>
                        <View style={{ padding: '0.2cm', border: '1px solid #aaaacc' }} >
                            <View style={{ width: '3cm', height: '4cm', overflow: 'clipped' }}>
                                <Image src={`${APIURL}/documents/${props?.student?.regno}_${images[0].name}.jpg`}
                                    style={{ width: '3cm', height: '4cm' }}
                                />
                            </View>
                        </View>
                    </View>
                    {/* body */}
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Field name='Reg. No.:' value={props?.student?.regno} />
                        <Field name='Admission date:' value={format(props?.student?.admissionDate, 'dd-MMM-yyyy')} />
                        <Field name='Name:' value={props?.student?.name} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Field name='Gender:' value={props?.student?.gender} />
                        <Field name='Stream:' value={props?.student?.stream} />
                        <Field name='Medium:' value={props?.student?.medium} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Field name='Monthly fees:' value={props?.student?.fee} />
                        <Field name='Fee starting:' value={months[+ props?.student.feeStartingMonth]} />
                        <Field name='Mobile no.:' value={props?.student?.mobile} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Field name='WhatsApp no.:' value={props?.student.whatsapp} />
                        <Field name='Email id.:' value={props?.student?.email} />
                        <Field name='Date of birth:' value={format(props?.student?.dob, 'dd-MMM-yyyy')} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Field name='AADHAR no.:' value={props?.student?.aadhar} />
                        <Field name='Caste:' value={props?.student?.caste} />
                        <Field name='Blood group:' value={props?.student?.bloodGroup} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Field name='Handicapped:' value={props?.student?.handicapped ? 'Yes' : 'No'} />
                        <Field name='Orphan:' value={props?.student?.orphan ? 'Yes' : 'No'} />
                        <Field name='OrphanRemarks:' value={props?.student?.orphanRemarks} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Field name='Previous branch:' value={props?.student?.previousBranchName || 'NA'} />
                        <Field name='Banglarsiksha id:' value={props?.student?.banglarsikshaId || 'NA'} />
                        <Field name='Kanyashree id:' value={props?.student?.kanyashreeId || 'NA'} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Field name='Aikyashree id:' value={props?.student?.aikyashreeId || 'NA'} />
                        <Field name='F.C:' value={props?.student?.fc ? 'Yes' : 'No'} />
                        <Field name='N.C' value={props?.student?.nc ? 'Yes' : 'No'} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 3 }}>
                        <View style={{ flex: 1, marginTop: 4 }}>
                            <Text style={{ color: '#666677', fontSize: 12, marginVertical: 3, textAlign: 'left', fontWeight: 'bold' }}>Permanent address</Text>
                            <Field name='Vill.:' value={props?.student?.addressPermanent?.vill} />
                            <Field name='P.O.:' value={props?.student?.addressPermanent?.po} />
                            <Field name='P.S.:' value={props?.student?.addressPermanent?.ps} />
                            <Field name='Block:' value={props?.student?.addressPermanent?.block} />
                            <Field name='Dist.:' value={props?.student?.addressPermanent?.dist} />
                            <Field name='State:' value={props?.student?.addressPermanent?.state} />
                            <Field name='Pin code:' value={props?.student?.addressPermanent?.pin} />
                        </View>
                        <View style={{ flex: 1, marginTop: 4 }}>
                            <Text style={{ color: '#666677', fontSize: 12, marginVertical: 3, textAlign: 'left', fontWeight: 'bold' }}>Present address</Text>
                            <Field name='Vill.:' value={props?.student?.addressPresent?.vill} />
                            <Field name='P.O.:' value={props?.student?.addressPresent?.po} />
                            <Field name='P.S.:' value={props?.student?.addressPresent?.ps} />
                            <Field name='Block:' value={props?.student?.addressPresent?.block} />
                            <Field name='Dist.:' value={props?.student?.addressPresent?.dist} />
                            <Field name='State:' value={props?.student?.addressPresent?.state} />
                            <Field name='Pin code:' value={props?.student?.addressPresent?.pin} />
                        </View>
                        <View style={{ flex: 1, marginTop: 4 }}>
                            <Text style={{ color: '#666677', fontSize: 12, marginVertical: 3, textAlign: 'left', fontWeight: 'bold' }}>Father's information</Text>
                            <Field name='Name:' value={props?.student?.father?.name} />
                            <Field name='Mobile no.:' value={props?.student?.father?.mobile} />
                            <Field name='AADHAR No.:' value={props?.student?.father?.aadhar} />
                            <Field name='Qualification:' value={props?.student?.father?.qualification} />
                            <Field name='Occupation:' value={props?.student?.father?.occupation} />
                            <Field name='Annual income:' value={props?.student?.father?.annualIncome} />
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 3 }}>
                        <View style={{ flex: 1, marginTop: 4 }}>
                            <Text style={{ color: '#666677', fontSize: 12, marginVertical: 3, textAlign: 'left', fontWeight: 'bold' }}>Mother's information</Text>
                            <Field name='Name:' value={props?.student?.mother?.name} />
                            <Field name='Mobile no.:' value={props?.student?.mother?.mobile} />
                            <Field name='AADHAR No.:' value={props?.student?.mother?.aadhar} />
                            <Field name='Qualification:' value={props?.student?.mother?.qualification} />
                            <Field name='Occupation:' value={props?.student?.mother?.occupation} />
                            <Field name='Annual income:' value={props?.student?.mother?.annualIncome} />
                        </View>
                        <View style={{ flex: 1, marginTop: 4 }}>
                            <Text style={{ color: '#666677', fontSize: 12, marginVertical: 3, textAlign: 'left', fontWeight: 'bold' }}>A/C information</Text>
                            <Field name='A/C No.:' value={props?.student?.bankAccount?.accountNo} />
                            <Field name='IFSC:' value={props?.student?.bankAccount?.ifsc} />
                            <Field name='Bank name:' value={props?.student?.bankAccount?.bankName} />
                            <Field name='Branch name:' value={props?.student?.bankAccount?.branchName} />
                            <Field name='Branch address:' value={props?.student?.bankAccount?.branchAddress} />
                        </View>
                    </View>
                    <View style={{ marginTop: 4 }}>
                        <Field name='Any family members working in mission:' value={props?.student?.familyMembersFromMissionFlag ? 'Yes' : 'No'} />
                        <Field name='Any siblings studying in mission:' value={props?.student?.siblingsStudyingInMissionFlag ? 'Yes' : 'No'} />
                    </View>
                    <View style={{ marginTop: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 8, color: '#444466' }}>FULL SIGNATURE OF STUDENT</Text>
                        <Text style={{ fontSize: 8, color: '#444466' }}>FULL SIGNATURE OF GUARDIAN</Text>
                        <Text style={{ fontSize: 8, color: '#444466' }}>SIGNATURE &amp; SEAL OF H.O.I</Text>
                    </View>
                </View>
            </View>
        </Page>
    )
}

export default StudentPdf