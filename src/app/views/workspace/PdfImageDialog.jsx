import React from 'react'
import { Dialog } from '@mui/material'
import { usePdfImageControl } from 'app/redux/classes/controls/PdfImageControl'
import ReactPDF, { PDFViewer, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

// Create Document Component
const MyDocument = props => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Image src={{
                uri: props.url,
                method: 'GET',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
                    "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
                }, body: ''
            }}
            />
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
);


const PdfImageDialog = props => {
    const pdfImageControl = usePdfImageControl()
    // ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);
    // const ref = React.createRef()
    return (
        <Dialog
            open={pdfImageControl.visible}
            onClose={pdfImageControl.hide}
        >
            {/* <img onLoad={e => {console.log(e.currentTarget) }} /> */}
            <PDFViewer >
                <MyDocument url={pdfImageControl.url} />
            </PDFViewer>
        </Dialog>
    )
}

export default PdfImageDialog
