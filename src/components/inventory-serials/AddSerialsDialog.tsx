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
import React, {useEffect, useState} from "react";
import {InventorySerialsData} from "./index";
import SerialDropdownSelector from "../../core/dropdown-selectors/SerialsDropdownSelector";
import axios from "axios";
import toast from "react-hot-toast";


interface Props {
  title?: string | null
  open: boolean
  data: InventorySerialsData | null
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AddSerialsDialog = ({open, toggle, title, data } : Props) => {

  const {t} = useTranslation();
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.up('md'));
  const [loading, setLoading] = useState<boolean>(false);
  const [serials, setSerials] = useState<InventorySerialsData | null>(null);

  useEffect(() => {
      let isActive = true;

        if(isActive) {
          setSerials(data);
        }


      return () => {
        isActive = false;
      }
    }, [data])

  const handleSerialData = (updated: any) => {
    setSerials({...serials, ...updated});
  }

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    try {

      let response: any = await axios.post('/Defaults/InsertInventorySerials', serials)
      let res = response?.data;
      if(res?.succeeded) {
        let unAddedErrorList = res?.data?.unAddedErrorList??[];

        if(unAddedErrorList.length > 0) {
          toast.error(`Serials Partially Saved.\n *${unAddedErrorList.join("\n*")}`);
        } else {
          toast.success(`Serials Saved Successfully.`);
        }
      } else {
        let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
        toast.error(`Error while serials!. ${message}`)
      }
    } catch (res: any) {
      let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Error while creating serials!. ${message}`)
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      open={open}
      anchor='top'
      variant={'temporary'}
      onClose={loading ? undefined :toggle}
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
            onClick={() => toggle()}
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
            <SerialDropdownSelector data={serials?.serialCode??[]} handleChange={(value: string[]) => {
              handleSerialData({serialCode: value})
            }} noBorder={false}/>
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
            <LoadingButton disabled={(serials?.serialCode??[]).length <= 0} loading={loading} size={'small'}
                           color={'success'} variant='contained'
                           onClick={onSubmit} sx={{mr: 4}}>
              {t("Save")}
            </LoadingButton>
          }
          <Button disabled={loading} size={'small'} variant='tonal' color={'secondary'} onClick={() => toggle()}>
            {t("Close")}
          </Button>
        </Box>
      </Card>
    </Drawer>
  )
}

export default AddSerialsDialog
