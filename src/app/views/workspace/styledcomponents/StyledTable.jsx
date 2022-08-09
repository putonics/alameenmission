import { Table } from "@mui/material"
import { styled } from "@mui/system"

const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: 'pre',
    '& thead': {
        '& tr': {
            '& th': {
                paddingTop: 1,
                paddingBottom: 1,
                paddingLeft: 0,
                paddingRight: 0,
                ':nth-of-type(even)': {
                    color: '#003388',
                },
                ':nth-of-type(odd)': {
                    color: '#882244',
                },
                fontWeight: '600',
                // borderBottom: '1px solid black',
            },
        },
        backgroundColor: '#ddeeef',
    },
    '& tbody': {
        '& tr': {
            '& td': {
                paddingTop: 1,
                paddingBottom: 1,
                paddingLeft: 0,
                textTransform: 'capitalize',
            },
            ':nth-of-type(odd)': {
                backgroundColor: '#f8feff'
            },
            ':hover': {
                backgroundColor: '#ffbbaa55',
            }
        },
    },
}))

export default StyledTable