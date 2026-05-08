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
import {useState} from "react";
import CustomImageCropper from "../image-cropper";
import {Tooltip} from "@mui/material";
import toast from "react-hot-toast";


interface Props {
  title?: string | null
  description?: string | null
  sub_description?: string | null
  positiveText?: string | null
  negativeText?: string | null
  loading: boolean
  open: boolean
  pixels: number
  toggle: (row: any) => void
  onSuccess: (e: any) => void
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const ChangeProfileDialog = ({open, toggle, title, positiveText, negativeText, description, sub_description, loading, onSuccess, pixels } : Props) => {

  const {t} = useTranslation();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'));

  //** States
  const [cropper, setCropper] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);

  const onCrop = (event: any) => {
    event.preventDefault();
    cropper.getCroppedCanvas({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "medium",
      maxWidth: pixels,
      maxHeight:  pixels,
    }).toBlob((blob: any) => {
      setFiles([blob]);
      setCropper(null)
      cropper.destroy();
    });
  }

  const onCropCanceled = (event: any) => {
    event.preventDefault();
    setFiles([]);
    setCropper(null);
    cropper.destroy();
  }

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

        <Box sx={{p: theme => theme.spacing(4, 6, 16), position: 'relative', maxHeight: '50vh', overflow: 'auto'}}>

          <Box sx={{display: 'flex', flexDirection: 'column'}}>

            <Typography variant={'h6'} sx={{fontWeight: 200}}>
              {description??"Are you sure you want to make changes in selected record?"}
            </Typography>

            <Typography variant={'body2'} sx={{fontWeight: 200, mt: 2}}>
              {sub_description??`You won't able to undo this action once done. Press ${(positiveText??"Save").toLowerCase()} button.`}
            </Typography>

            <Box sx={{display: 'flex', height: 220, justifyContent: 'center'}}>
              <Box sx={{width: 200, height: 200, mt: 2}}>
                  <CustomImageCropper height={200} cropper={cropper} setCropper={setCropper} files={files} setFiles={setFiles} />
              </Box>
            </Box>
            {
              cropper !== null &&
              <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Box sx={{
                  width: 'fit-content',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'customColors.tableHeaderBg',
                  borderRadius: '8px'
                }}>

                  <Tooltip title={t("Square 1:1")}>
                    <IconButton onClick={() => {
                      cropper.setAspectRatio(1);
                    }} sx={{
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Icon icon={'tabler:crop-1-1'} fontSize={'1.45rem'}/>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={t("Portrait 9:16")}>
                    <IconButton onClick={() => {
                      cropper.setAspectRatio(9/16);
                    }} sx={{
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Icon icon={'tabler:crop-portrait'} fontSize={'1.45rem'}/>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={t("Landscape 16:9")}>
                    <IconButton onClick={() => {
                      cropper.setAspectRatio(16/9);
                    }} sx={{
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Icon icon={'tabler:crop-16-9'} fontSize={'1.45rem'}/>
                    </IconButton>
                  </Tooltip>
                </Box>
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
            cropper !== null &&
            <Button disabled={loading} size={'small'} variant='tonal' color='error' sx={{mr: 4}}
                    onClick={onCropCanceled}>
              {t("Cancel")}
            </Button>
          }
          {
            cropper === null &&
            <Button disabled={loading} size={'small'} variant='tonal' color='error' sx={{mr: 4}}
                    onClick={() => toggle(null)}>
              {t(negativeText ?? "Close")}
            </Button>
          }
          {
            cropper === null &&
            <LoadingButton loading={loading} size={'small'} variant='contained' onClick={() => {
              if(files.length) {
                onSuccess(files[0]);
              } else {
                toast.error("Upload the file to save!");
              }
            }}>
              {t(positiveText ?? "Save")}
            </LoadingButton>
          }
          {
            cropper !== null &&
            <LoadingButton loading={loading} size={'small'} variant='contained' onClick={onCrop}>
              {t("Crop")}
            </LoadingButton>
          }
        </Box>
      </Card>
    </Drawer>
  )
}

export default ChangeProfileDialog
