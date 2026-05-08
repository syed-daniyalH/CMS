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
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {useEffect, useState} from "react";
import DatePickerWrapper from "../../@core/styles/libs/react-datepicker";
import CustomDatePicker from "../../@core/components/custom-date-picker";
import TypoLabel from "../inputs/TypoLabel";
import CustomTextField from "../../@core/components/mui/text-field";


interface Props {
  comment?: string | null
  setComment?: (value: string) => void
  title?: string | null
  description?: string | null
  sub_description?: string | null
  positiveText?: string | null
  negativeText?: string | null
  hideSuccessButton?: boolean | null
  commentImp?: boolean | null
  loading: boolean
  open: boolean
  date?: Date | null
  setDate?: (date: Date) => void
  toggle: (row: any) => void
  onSuccess: (e: any) => void
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const ConfirmationDialog = ({open, date, setDate, commentImp, comment, setComment, toggle, title, positiveText, negativeText, description, sub_description, loading, onSuccess, hideSuccessButton = false } : Props) => {

  const {t} = useTranslation();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'));
  const [time, setTime] = useState<number>(3);


  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        if(time === 0) {
          clearInterval(timerId)
        } else {
          setTime((prevTime) => prevTime - 1);
        }
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(timerId);
    }
  }, [time]);

  return (
    <Drawer
      open={open}
      anchor='top'
      variant={'temporary'}
      onClose={loading ? undefined : (_event, _reason) => toggle(null)}
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
          <Typography variant='subtitle1'>{t(title??"Confirmation")}</Typography>
          <IconButton
            size='small'
            disabled={loading}
            onClick={() => toggle(null)}
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

        <Box sx={{p: theme => theme.spacing(4, 6, 16), position: 'relative', maxHeight: '40vh', overflow: 'auto'}}>

          <Box sx={{display: 'flex', flexDirection: 'column'}}>

            <Typography variant={'h6'} sx={{fontWeight: 200}}>
              {description??"Are you sure you want to make changes in selected record?"}
            </Typography>

            <Typography variant={'body2'} sx={{fontWeight: 200, mt: 2}}>
              {sub_description??`You won't able to undo this action once done. Press ${(positiveText??"Save").toLowerCase()} button.`}
            </Typography>
            {
              date &&
              <Box sx={{mt: 4}}>
                <DatePickerWrapper>
                  <CustomDatePicker date={date} onChange={(dateS: Date) => {
                    setDate!(dateS)
                  }} label={"Date"} />
                </DatePickerWrapper>
              </Box>
            }

            {
              !!(setComment) &&
              <Box sx={{mt: 4}}>
                <CustomTextField
                  fullWidth
                  multiline
                  rows={2}
                  type='text'
                  variant='outlined'
                  label={<TypoLabel name={'Reason'} important={commentImp??false}/>}
                  placeholder={t('Reason') as string}
                  value={comment??""}
                  onChange={(e) => setComment(e.target.value??"")}
                />
              </Box>
            }
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
          {
            !hideSuccessButton &&
            <LoadingButton disabled={time !== 0} loading={loading} size={'small'}
                           color={positiveText === "Delete" ? 'error' : 'success'} variant='contained'
                           onClick={onSuccess} sx={{mr: 4}}>
              {t(positiveText ?? "Save")}{time !== 0 ? `(${time})` : ''}
            </LoadingButton>
          }
          <Button disabled={loading} size={'small'} variant='tonal' color={positiveText === "Delete" ? 'secondary' : 'error'} onClick={() => toggle(null)}>
            {t(negativeText??"Close")}
          </Button>
        </Box>
      </Card>
    </Drawer>
  )
}

export default ConfirmationDialog
