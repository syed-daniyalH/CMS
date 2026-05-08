// ** MUI Imports
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from '@mui/material/CircularProgress'

type Props = {
  open: boolean
}

const CustomBackdrop = ({ open }: Props) => {
  // ** Hook

  return (
    <Backdrop sx={{
      position: 'absolute',
      color: 'common.white',
      zIndex: theme => theme.zIndex.mobileStepper - 1
    }} open={open} transitionDuration={250}>
      <CircularProgress color='inherit' size={44} thickness={4.5} />
    </Backdrop>
  )
}

export default CustomBackdrop
