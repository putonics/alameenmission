import { styled } from '@mui/system'
import { TextValidator } from 'react-material-ui-form-validator'

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
    input: { color: '#0022aa', fontWeight: '700' },
    label: { color: '#993366', fontWeight: '600' }
}))

export default TextField