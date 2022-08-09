import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import Assets from '../../../../assets'
import { APIURL, images } from 'app/redux/classes/Constants'
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
        width: '8.5cm',
        height: '6cm',
        backgroundColor: '#ffffff',
        border: '1px solid #cccccc',
        margin: '0.5cm',
        padding: '4px'
    },
    title: {
        width: '100%',
        textAlign: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
    },
    subtitle: {
        width: '100%',
        textAlign: 'center',
        fontSize: '8px',
        marginTop: '2px',
    },
    subtitle2: {
        width: '100%',
        textAlign: 'center',
        fontSize: '6px',
        marginTop: '2px',
    },
})

const Field = props => {
    return (
        <View style={{
            paddingHorizontal: '4px', backgroundColor: props.backColor, width: '100%',
            flexDirection: 'row', fontSize: '8px', paddingVertical: '1px'
        }}>
            <Text style={{ color: '#777777' }}>{props?.name}:</Text>
            <Text style={{ color: '#000000', marginLeft: '4px' }}>{props?.value}</Text>
        </View>
    )
}

const BottomField = props => {
    return (
        <View style={{
            paddingHorizontal: '4px', backgroundColor: props.backColor, width: '100%',
            flexDirection: 'row', justifyContent: 'space-between',
            fontSize: '8px', paddingVertical: '1px'
        }}>
            <Text style={{ color: '#000000' }}>{props?.val1}</Text>
            <Text style={{ color: '#777777', fontStyle: 'italic' }}>{props?.val2}</Text>
        </View>
    )
}

const Card = props => {
    return (
        <View style={styles.card}>
            <View
                style={{
                    flexDirection: 'row', alignItems: 'center',
                    paddingVertical: '4px', paddingHorizontal: '2px',
                    backgroundColor: props.visitor ? ['FATHER', 'MOTHER'].includes(props.visitor.relation) ? '#00ff88' : '#ffffff' : '#440099',
                    color: props.visitor ? '#000066' : '#ffffff'
                }}
            >
                <Image src={Assets.logo} style={{ width: '1.1cm', height: '1.1cm' }} />
                <View style={{ flexGrow: 1, marginLeft: '4px' }}>
                    <View style={styles.title}><Text>{props?.institute?.institute}</Text></View>
                    <View style={styles.subtitle}><Text>{props?.institute?.place}</Text></View>
                    <View style={styles.subtitle2}>
                        <Text>{props?.institute?.phone} {props?.institute?.email}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                <Image
                    src={`${APIURL}/avatars/${props?.student?.regno}_${images[0].name}.jpg?${props.dt}`}
                    style={{ width: '2cm', height: '2cm' }}
                />
                <View style={{ flexGrow: 1, marginLeft: '2px' }}>
                    <Field backColor='#ccffdd88' name='Name' value={props?.student?.name} />
                    <Field backColor='#ccddff88' name='C/O' value={props?.student?.father?.name} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Field backColor='#ffccee88' name='Reg. no.' value={props?.student?.regno} />
                        <Field backColor='#ffccee88' name='Year' value={props?.student?.sessionFrom} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Field backColor='#ccffdd88' name='Class' value={props?.student?.pclass} />
                        <Field backColor='#ccffdd88' name='D.O.B' value={format(new Date(props?.student?.dob || 0), "dd/MM/yyyy")} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Field backColor='#ccddff88' name='Blood gr.' value={props?.student?.bloodGroup} />
                        <Field backColor='#ccddff88' name='Mob.' value={props?.student?.mobile} />
                    </View>
                </View>
            </View>
            {
                props?.visitor
                    ?
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                src={`${APIURL}/avatars/${props?.student?.regno}_${props?.imageName}.jpg?${props.dt}`}
                                style={{ width: '2cm', height: '2cm' }}
                            />
                            <View style={{ flexGrow: 1, marginLeft: '2px' }}>
                                <Field backColor='#ffccee88' name={`Visitor (${props?.visitor?.relation})`} value={props?.visitor?.name} />
                                <Field backColor='#ccddff88' name="Visitor's mob." value={props?.visitor?.mobile} />
                                <Field backColor='#ccffdd88' name='Vill.'
                                    value={
                                        ['FATHER', 'MOTHER'].includes(props?.visitor?.relation)
                                            ? props?.student?.addressPresent.vill
                                            : props?.visitor?.address.vill
                                    }
                                />
                                <Field backColor='#ccddff88' name='P.S'
                                    value={
                                        ['FATHER', 'MOTHER'].includes(props?.visitor?.relation)
                                            ? props?.student?.addressPresent.ps
                                            : props?.visitor?.address.ps
                                    }
                                />
                                <Field backColor='#ccffdd88' name='Dist.'
                                    value={
                                        ['FATHER', 'MOTHER'].includes(props?.visitor?.relation)
                                            ? props?.student?.addressPresent.dist
                                            : props?.visitor?.address.dist
                                    }
                                />
                            </View>
                        </View>
                        <BottomField backColor='#ccddff88' val1={`Visit: ${props?.visitingDay}`} val2='Signature of Incharge' />
                    </>
                    :
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexGrow: 1 }}>
                                <Field backColor='#ccffdd88' name='Vill.' value={props?.student?.addressPresent.vill} />
                                <Field backColor='#ccddff88' name='P.S' value={props?.student?.addressPresent.ps} />
                                <Field backColor='#ccffdd88' name='Dist.' value={props?.student?.addressPresent.dist} />
                            </View>
                        </View>
                        <BottomField backColor='#ccddff88' val1=' ' val2=' ' />
                        <BottomField backColor='#ccffdd88' val1=' ' val2=' ' />
                        <BottomField backColor='#ccddff88' val1=' ' val2='Signature of Incharge' />
                    </>
            }
        </View>
    )
}

const ICardPdf = props => {
    const dt = new Date().getTime()
    return (
        <Document
            author='alameenmission'
            title={props?.student?.regno + ' - icard'}
            creator='alameenmission'
            subject={props?.student?.regno + ' - icard'}
        >
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    {props.cards.includes('student') && <Card dt={dt} student={props?.student} institute={props?.institute} />}
                    {/* </View> */}
                    {/* <View style={styles.section}> */}
                    {props.cards.includes('father') && <Card dt={dt} student={props?.student} visitingDay={props?.visitingDay} institute={props?.institute} imageName={images[1].name} visitor={{ ...props?.student?.father, relation: 'FATHER' }} />}
                    {props.cards.includes('mother') && <Card dt={dt} student={props?.student} visitingDay={props?.visitingDay} institute={props?.institute} imageName={images[2].name} visitor={{ ...props?.student?.mother, relation: 'MOTHER' }} />}
                    {/* </View> */}
                    {/* <View style={styles.section}> */}
                    {props.cards.includes('visitor1') && <Card dt={dt} student={props?.student} visitingDay={props?.visitingDay} institute={props?.institute} imageName={images[3].name} visitor={props?.student?.visitor1} />}
                    {props.cards.includes('visitor2') && <Card dt={dt} student={props?.student} visitingDay={props?.visitingDay} institute={props?.institute} imageName={images[4].name} visitor={props?.student?.visitor2} />}
                </View>
            </Page>
        </Document>
    )
}

export default ICardPdf