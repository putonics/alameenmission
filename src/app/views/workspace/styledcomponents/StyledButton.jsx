import { Button } from "@mui/material"
import { styled } from "@mui/system"

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}))

export default StyledButton