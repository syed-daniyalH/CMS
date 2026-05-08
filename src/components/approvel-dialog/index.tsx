// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled, useTheme} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";


// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {useEffect, useState} from "react";
import CustomTextField from "../../core/components/mui/text-field";
import axios from "axios";
import toast from "react-hot-toast";


interface Props {
  open: boolean
  recno: number
  currentApprovalUrl: string | null
  currentApprovalLevel: string | null
  onSuccess: () => void
  setOpen: (e: any) => void
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const ApprovelDialog = ({open, setOpen, currentApprovalLevel, currentApprovalUrl, recno, onSuccess}: Props) => {

  const {t} = useTranslation();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'));
  // ** state

  // **store


  const [time, setTime] = useState<number>(3);
  const [state, setState] = useState<string>("")
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean >(false);
  const [loadingReject, setLoadingReject] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        if (time === 0) {
          clearInterval(timerId)
        } else {
          setTime((prevTime) => prevTime - 1);
        }
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(timerId);
    }
  }, [time]);
  const onSubmit = async (approved: boolean) => {
    if (approved) setLoading(true)
    else setLoadingReject(true)

    if (!approved && !state) {
      toast.error("Reason is Required")
      setLoadingReject(false)
      return
    }

    const data = {
      approvedComments: state,
      recno,
      isApproved: approved,
    }

    try {
      const response = await axios.put(`${currentApprovalUrl}`, data)

      if (response.data.succeeded) {
        toast.success(approved ? "Approved Successfully" : "Rejected Successfully")
        onSuccess()
        setOpen(false)
      } else {
        setError(response?.data?.message ?? "")
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log("error", error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
      setLoadingReject(false)
    }
  }

  return (
    <Drawer
      open={open}
      anchor='top'
      variant={'temporary'}
      onClose={() => setOpen(false)}
      transitionDuration={1000}
      sx={{
        '& .MuiDrawer-paper': {
          alignItems: 'center',
          backgroundColor: '#00000000',
          marginTop: 0,
        }
      }}
      ModalProps={{keepMounted: true}}
    >
      <Card sx={{width: hidden ? '35%' : '98%'}}>
        <Header sx={{px: 4, py: 1}}>
          <Typography variant='subtitle1'>{t(currentApprovalLevel ?? "Confirmation")}</Typography>
          <IconButton
            size='small'

            onClick={() => setOpen(false)}
            sx={{
              p: '0.3rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.1rem'/>
          </IconButton>
        </Header>

        <Divider/>

        <Box sx={{p: theme => theme.spacing(6, 6, 16), position: 'relative', maxHeight: '40vh', overflow: 'auto'}}>

          <Box sx={{display: 'flex', flexDirection: 'column'}}>

            <Typography variant={'h6'} sx={{fontWeight: 200}}>
              {`Do you really want to mark this as ${currentApprovalLevel}. Please write the reason below.?`}
            </Typography>

            <Box sx={{mt: 3}}>

              <CustomTextField
                fullWidth
                autoFocus
                name={"approvedComments"}
                type='text'
                variant='outlined'
                label={t("Reason")}
                placeholder={t('Reason') as string}
                helperText={!isApproved && error ? error : ""}
                onChange={(e) => setState(e.target.value ?? "")}
              />
            </Box>


          </Box>

        </Box>
        <Box sx={{
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
          width: hidden ? '35%' : '98%',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: "end",
          p: 2,
          backgroundColor: theme => theme.palette.customColors.tableHeaderBg
        }}>
          <LoadingButton loading={loading} size={'small'} color={'success'} onClick={() => onSubmit(true)}
                         variant='contained' sx={{mr: 4}}>
            {t(`Mark as ${currentApprovalLevel}`)}
          </LoadingButton>
          <LoadingButton
            loading={loadingReject}
            disabled={time !== 0}
            size="small"
            variant="tonal"
            color="error"
            onClick={() => onSubmit(false)}
          >
            {t("Reject")}{time !== 0 ? `(${time})` : ''}
          </LoadingButton>
        </Box>
      </Card>
    </Drawer>
  )
}

export default ApprovelDialog
