import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import Assets from '../../../../../assets'
import { format } from 'date-fns'
import { months } from 'app/redux/classes/Constants'

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
            flexDirection: 'row', fontSize: '10px', paddingVertical: '1px'
        }}>
            <Text style={{ color: '#777777' }}>{props?.name}:</Text>
            <Text style={{ color: '#000000', marginLeft: '4px' }}>{props?.value}</Text>
        </View>
    )
}

const BottomField = props => {
    return (
        <View style={{
            paddingHorizontal: '4px', width: '100%',
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
                    paddingVertical: '4px', paddingHorizontal: '2px'
                }}
            >
                <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image src={Assets.logo} style={{ width: '2.5cm', height: '2.5cm' }} />
                </View>
                <View style={{ flexGrow: 3, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.title}>
                        {props?.institute?.institute}
                    </Text>
                    <Text style={styles.subtitle}>
                        {props?.institute?.place}
                    </Text>
                    <Text style={styles.subtitle2}>
                        {props?.institute?.phone} {props?.institute?.email}
                    </Text>
                    <Text style={styles.title}>
                        Admission {props?.student?.sessionFrom}-{props?.student?.sessionTo}
                    </Text>
                </View>
                <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <View style={styles.title}>
                        <Text>{format(new Date(), "dd/MM/yyyy")}</Text>
                    </View>
                    <View style={styles.subtitle2}>
                        <Text style={{ color: '#777777' }} >BILL GENERATION DATE</Text>
                    </View>
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', marginVertical: '8px', border: '1px solid #777', padding: '4px' }}>
                <Field name='Reg. No.' value={props?.student?.regno} />
                <Field name='Class' value={props?.student?.pclass} />
                <Field name='Name' value={props?.student?.name} />
                <Field name='C/O' value={props?.student?.father?.name} />
                <Field name='Contact' value={props?.student?.mobile} />
            </View>
            <View style={{ marginTop: '8px' }}>
                <Text style={{ ...styles.title, paddingBottom: '4px', borderBottom: '1px solid #777' }}>
                    One Time Fees (Rs.):
                </Text>
                <View style={{ marginLeft: '10px', marginTop: '4px', fontSize: '10px' }}>
                    {
                        props.ofpis.map((fpi, index) => (
                            <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '4px', justifyContent: 'space-between', color: fpi.paidon ? '#000' : '#777' }}>
                                <Text>
                                    {index + 1}. {fpi.head} {fpi.paidon ? `(paid on ${format(new Date(fpi.paidon), "dd/MM/yyyy")})` : '<due>'}
                                </Text>
                                <Text>
                                    {fpi.amount}
                                </Text>
                            </View>
                        ))
                    }
                </View>
            </View>
            <View style={{ marginTop: '8px' }}>
                <Text style={{ ...styles.title, paddingBottom: '4px', borderBottom: '1px solid #777' }}>
                    Yearly Fees (Rs.):
                </Text>
                <View style={{ marginLeft: '10px', marginTop: '4px', fontSize: '10px' }}>
                    {
                        props.yfpis.map((fpi, index) => (
                            <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '4px', justifyContent: 'space-between', color: fpi.paidon ? '#000' : '#777' }}>
                                <Text>
                                    {index + 1}. {fpi.head} {fpi.paidon ? `(paid on ${format(new Date(fpi.paidon), "dd/MM/yyyy")})` : '<due>'}
                                </Text>
                                <Text>
                                    {fpi.amount}
                                </Text>
                            </View>
                        ))
                    }
                </View>
            </View>
            <View style={{ marginTop: '8px' }}>
                <Text style={{ ...styles.title, paddingBottom: '4px', borderBottom: '1px solid #777' }}>
                    Monthly Fees (Rs.):
                </Text>
                <View style={{ marginLeft: '10px', marginTop: '4px', fontSize: '10px' }}>
                    {
                        props.mfpis.map((fpi, index) => (
                            <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '4px', justifyContent: 'space-between', color: fpi.paidon ? '#000' : '#777' }}>
                                <Text>
                                    {index + 1}. {fpi.month >= 0 ? months[fpi.month % 12] : ''} {fpi.year} {fpi.head} {fpi.paidon ? `(paid on ${format(new Date(fpi.paidon), "dd/MM/yyyy")})` : '<due>'}
                                </Text>
                                <Text>
                                    {fpi.amount}
                                </Text>
                            </View>
                        ))
                    }
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: '8px', marginBottom: '4px', justifyContent: 'space-around', border: '1px solid #777', padding: '4px' }}>
                <Text style={styles.title}>
                    Total Fees: Rs. {props.amount.opaid + props.amount.ypaid + props.amount.mpaid + props.amount.odue + props.amount.ydue + props.amount.mdue}
                </Text>
                <Text style={styles.title}>
                    Total Paid: Rs. {props.amount.opaid + props.amount.ypaid + props.amount.mpaid}
                </Text>
                <Text style={styles.title}>
                    Total Due: Rs. {props.amount.odue + props.amount.ydue + props.amount.mdue}
                </Text>
            </View>
        </View>
    )
}

const BillPdf = props => {
    return (
        <Document
            author='alameenmission'
            title={props?.student?.regno + ' - bill' + props?.student?.sessionFrom}
            creator='alameenmission'
            subject={props?.student?.regno + ' - bill' + props?.student?.sessionFrom}
        >
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Card
                        student={props?.student}
                        institute={props?.institute}
                        ofpis={props?.ofpis}
                        yfpis={props?.yfpis}
                        mfpis={props?.mfpis}
                        amount={props?.amount}
                    />
                </View>
            </Page>
        </Document>
    )
}

export default BillPdf