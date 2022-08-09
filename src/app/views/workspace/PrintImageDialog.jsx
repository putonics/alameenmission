import React from 'react'
import { Dialog } from '@mui/material'
import { useReactToPrint } from 'react-to-print'
import { usePrintImageControl } from 'app/redux/classes/controls/PrintImageControl'

const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
        <img ref={ref} src={props.src} onLoad={props.onLoad} />
    )
})

const PrintImageDialog = props => {
    const printImageControl = usePrintImageControl()
    const ref = React.createRef()
    const handlePrint = useReactToPrint({
        content: () => ref.current,
        onAfterPrint: printImageControl.hide,
        onPrintError: printImageControl.hide,
        pageStyle: `
        @media print {
            body {display: flex; justify-content:center; align-items: flex-start; padding: 20;}
            img {max-width: 100%;}
        }
        `
    })
    return (
        <Dialog
            open={printImageControl.visible}
            onClose={printImageControl.hide}
        >
            <ComponentToPrint ref={ref} src={printImageControl.url} onLoad={handlePrint} />
        </Dialog>
    )
}

export default PrintImageDialog
