import { useTopbarControl } from 'app/redux/classes/controls/TopbarControl'
import React from 'react'
import ContentBox from '../styledcomponents/ContentBox'
import PromotionForm from './PromotionForm'
import TopBar from './TopBar'

const PromotionWorkspace = props => {
    const [gender, setGender] = React.useState('MALE')
    const [step, setStep] = React.useState(0)
    const topbarControl = useTopbarControl()
    React.useEffect(() => {
        topbarControl.setControlBox(<TopBar disabled={step > 1} onGenderChange={gender => setGender(gender)} />)
    }, [step])

    return (
        <ContentBox>
            <PromotionForm
                gender={gender}
                onChange={step => setStep(step)}
            />
        </ContentBox>
    )
}

export default PromotionWorkspace