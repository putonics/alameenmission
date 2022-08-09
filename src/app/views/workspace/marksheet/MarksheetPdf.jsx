import React from 'react'
import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import Assets from '../../../../assets'
import Marksheet from 'app/redux/classes/students/result/Marksheet'
import { Institute } from 'app/redux/classes/Institutes'
import Exam from 'app/redux/classes/students/result/Exam'
import MarkSubjectGroup from 'app/redux/classes/students/result/MarkSubjectGroup'
import MarkSubject from 'app/redux/classes/students/result/MarkSubject'
import { APIURL, images } from 'app/redux/classes/Constants'

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
            justifyContent: 'center', alignItems: 'center'
        }}>
            <Text style={{ fontSize: '10px', color: '#777777' }}>{props?.name}:</Text>
            <Text style={{ fontSize: '10px', color: '#000000', marginLeft: '4px', fontWeight: 'extrabold' }}>{props?.value}</Text>
        </View>
    )
}

// const BottomField = props => {
//     return (
//         <View style={{
//             paddingHorizontal: '4px', width: '100%',
//             flexDirection: 'row', justifyContent: 'space-between',
//             fontSize: '8px', paddingVertical: '1px'
//         }}>
//             <Text style={{ color: '#000000' }}>{props?.val1}</Text>
//             <Text style={{ color: '#777777', fontStyle: 'italic' }}>{props?.val2}</Text>
//         </View>
//     )
// }

/**
 * @param {{ms: MarkSubject}} props 
 */
const SubjectView = props => {
    return (
        <View style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center',
            width: '17.6cm'
        }} >
            <View
                style={{
                    width: '2.7cm',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    borderRight: '1px solid #777799', paddingVertical: '0.3cm'
                }}
            >
                <Text style={{ fontSize: 10 }}>{props?.ms?.code}</Text>
            </View>
            <View style={{ width: '3.7cm', borderRight: '1px solid #777799' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '1.85cm', justifyContent: 'center', alignItems: 'center', paddingVertical: '0.3cm' }}>
                        <Text style={{ fontSize: 10 }}>{props?.ms?.theory?.fullMarks}</Text>
                    </View>
                    <View style={{ width: '1.85cm', justifyContent: 'center', alignItems: 'center', paddingVertical: '0.3cm' }}>
                        <Text style={{ fontSize: 10 }}>{props?.ms?.practical?.fullMarks}</Text>
                    </View>
                </View>
            </View>
            <View style={{ width: '3.7cm', borderRight: '1px solid #777799' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '1.85cm', justifyContent: 'center', alignItems: 'center', paddingVertical: '0.3cm' }}>
                        <Text style={{ fontSize: 10 }}>{props?.ms?.theory?.passMarks}</Text>
                    </View>
                    <View style={{ width: '1.85cm', justifyContent: 'center', alignItems: 'center', paddingVertical: '0.3cm' }}>
                        <Text style={{ fontSize: 10 }}>{props?.ms?.practical?.passMarks}</Text>
                    </View>
                </View>
            </View>
            <View style={{ width: '3.7cm', borderRight: '1px solid #777799' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '1.85cm', justifyContent: 'center', alignItems: 'center', paddingVertical: '0.3cm' }}>
                        <Text style={{ fontSize: 10 }}>{props?.ms?.theory?.marksObtained}</Text>
                    </View>
                    <View style={{ width: '1.85cm', justifyContent: 'center', alignItems: 'center', paddingVertical: '0.3cm' }}>
                        <Text style={{ fontSize: 10 }}>{props?.ms?.practical?.marksObtained}</Text>
                    </View>
                </View>
            </View>
            <View
                style={{
                    width: '1.85cm',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    borderRight: '1px solid #777799', paddingVertical: '0.3cm'
                }}
            >
                <Text style={{ fontSize: 10 }}>{props?.ms?.totalMO}</Text>
            </View>
            <View
                style={{
                    width: '1.85cm',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    paddingVertical: '0.3cm'
                }}
            >
                <Text style={{ fontSize: 10 }}>{props?.ms?.grade}</Text>
            </View>
        </View>
    )
}

/**
 * @param {{msg: MarkSubjectGroup}} props 
 */
const SubjectGroupView = props => {
    return (
        <View style={{ width: '18.6cm', marginTop: '0.3cm' }}>
            <Text style={{ fontSize: 10, paddingLeft: '0.2cm' }}>{props?.msg?.name}</Text>
            <View style={{ width: '17.6cm', border: '1px solid #777799', marginTop: '0.3cm' }}>
                {
                    props?.msg?.markSubjects.map((ms, i) => (
                        <SubjectView ms={ms} key={'subject-view-' + i} />
                    ))
                }
            </View>
        </View>
    )
}

/**
 * @param {{exam:Exam, marksheet: Marksheet, institute: Institute}} props 
 */
const MarksheetPdf = props => {
    return (
        <Page size="A4" style={styles.page}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                <Image src={Assets.marksheet} style={{ width: '21cm', height: '29.7cm' }} />
            </View>
            <View style={{ padding: '1.2cm' }}>
                <View style={{ height: '21cm' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: '4cm', alignItems: 'center', justifyContent: 'center' }} >
                            <Image src={Assets.logo} style={{ width: '2.8cm', height: '2.8cm' }} />
                        </View>
                        <View style={{ width: '11.8cm', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ ...styles.title, marginBottom: 6 }}>
                                {props?.institute?.institute}
                            </Text>
                            <Text style={{ ...styles.subtitle, marginBottom: 6 }}>
                                {props?.institute?.place}
                            </Text>
                            <Text style={{ marginTop: 6, color: '#000000', fontWeight: 'bold', fontSize: 15 }} >MARKSHEET</Text>
                            <Text style={{ marginTop: 6, color: '#000000', fontWeight: 'bold', fontSize: 12 }} >{props?.exam?.name}</Text>
                        </View>
                        <View style={{ width: '4cm', alignItems: 'center', justifyContent: 'center' }} >
                            <Image src={`${APIURL}/documents/${props?.marksheet?.studentRegno}_${images[0].name}.jpg`}
                                style={{ width: '3cm', height: '4cm' }}
                            />
                        </View>
                    </View>
                    <View style={{ padding: '2px', display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: '0.5cm' }}>
                        <Field name='NAME' value={props?.marksheet?.studentName} />
                        <Field name='REG. NO.' value={props?.marksheet?.studentRegno} />
                        <Field name='CLASS' value={props?.exam?.pclass} />
                        <Field name='SESSION' value={`${props?.exam?.sessionFrom}-${(props?.exam?.sessionFrom % 100 + 1)}`} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '4px', border: '1px solid #777799', }} >
                        <View
                            style={{
                                width: '3cm', height: '2cm',
                                borderRight: '1px solid #777799',
                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 10 }}>SUBJECT</Text>
                        </View>
                        <View
                            style={{
                                width: '4cm', height: '2cm', borderRight: '1px solid #777799'
                            }}
                        >
                            <View style={{ width: '4cm', height: '1cm', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 10 }}>FULL MARKS</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTop: '1px solid #777799' }}>
                                <View style={{ width: '2cm', height: '1cm', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #777799' }}>
                                    <Text style={{ fontSize: 8 }}>THEORY</Text>
                                </View>
                                <View style={{ width: '2cm', height: '1cm', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 6 }}>PRACTICAL/ ORAL/ PROJECT</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                width: '4cm', height: '2cm', borderRight: '1px solid #777799'
                            }}
                        >
                            <View style={{ width: '4cm', height: '1cm', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 10 }}>PASS MARKS</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTop: '1px solid #777799' }}>
                                <View style={{ width: '2cm', height: '1cm', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #777799' }}>
                                    <Text style={{ fontSize: 8 }}>THEORY</Text>
                                </View>
                                <View style={{ width: '2cm', height: '1cm', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 6 }}>PRACTICAL/ ORAL/ PROJECT</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                width: '4cm', height: '2cm', borderRight: '1px solid #777799'
                            }}
                        >
                            <View style={{ width: '4cm', height: '1cm', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 10 }}>MARKS OBTAINED</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTop: '1px solid #777799' }}>
                                <View style={{ width: '2cm', height: '1cm', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #777799' }}>
                                    <Text style={{ fontSize: 8 }}>THEORY</Text>
                                </View>
                                <View style={{ width: '2cm', height: '1cm', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 6 }}>PRACTICAL/ ORAL/ PROJECT</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                width: '2cm', height: '2cm', borderRight: '1px solid #777799',
                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 10 }}>TOTAL</Text>
                        </View>
                        <View
                            style={{
                                width: '2cm', height: '2cm',
                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 10 }}>GRADE</Text>
                        </View>
                    </View>
                    {
                        props?.marksheet?.markSubjectGroups?.map((msg, i) => (
                            <SubjectGroupView msg={msg} key={'subject-group-view' + i} />
                        ))
                    }
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: '0.3cm' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', marginRight: '0.5cm' }}>
                            GRAND TOTAL
                        </Text>
                        <View style={{ width: '3.7cm', border: '1px solid #777799', paddingVertical: '0.5cm' }}>
                            <Text style={{ fontSize: 15, textAlign: 'center', fontWeight: 'bold' }}>
                                {props.marksheet.totalMO}
                            </Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '1cm' }}>
                        <Text style={{ fontSize: 10 }}>
                            RESULT: {props.marksheet.passed ? 'PASSED' : 'NOT QUALIFIED'}
                        </Text>
                        <Text style={{ fontSize: 10 }}>
                            OVERALL GRADE: {props.marksheet.grade}
                        </Text>
                    </View>
                </View>
                <View style={{ width: '18.6cm', padding: '0.2cm', marginTop: '0.03cm' }}>
                    <Text style={{ fontSize: 10, width: '17cm', textAlign: 'right', marginVertical: '1cm' }}>
                        SIGNATURE OF THE H.M
                    </Text>
                    <Text style={{ fontSize: 10 }}>Grades</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingLeft: '0.2cm' }}>
                        {
                            props.exam.grades.map((g, i) => (
                                <Text style={{ fontSize: 10, width: '6cm' }} key={g.code + i}>
                                    {g.min} - {g.max}: {g.code} [ {g.title} ]
                                </Text>
                            ))
                        }
                    </View>
                </View>
            </View>
        </Page>
    )
}

export default MarksheetPdf