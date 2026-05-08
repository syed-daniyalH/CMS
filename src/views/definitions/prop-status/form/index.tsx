// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled, useTheme} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";


// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import CustomTextField from 'src/core/components/mui/text-field'
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import CustomAvatar from "src/core/components/mui/avatar";
import axios from "axios";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import TypoLabel from "src/components/inputs/TypoLabel";
import { getData } from 'src/store/definitions/prop-status';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {saveCloseKey, saveNewKey} from "src/core/utils/translation-file";
import FormSaveButton from "src/components/form-save-button";
import CustomBackdrop from "src/core/components/loading";
import { getPropertyStatus } from '../../../../store/dropdowns'
import { MenuItem } from '@mui/material'


interface Props {
  data?: PropStatusSchema | null
  open: boolean
  toggle: (data?: PropStatusSchema | null) => void
  onSuccess?: (data: any) => void
}

export interface PropStatusSchema {
  statusId?: number | null
  description?: string | null
  remarks?: string | null
  isActive: boolean
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const PropStatusForm = ({open, toggle, data, onSuccess}: Props) => {

  const {t} = useTranslation();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'));
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<PropStatusSchema>({isActive: true});
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.propStatus)


  useEffect(() => {
    let isActive = true;

    if(isActive && data) {
      getPropStatusData().then(() => console.log('loaded'));
    }

    return () => {
      isActive = false;
    }
  }, [data])


  const getPropStatusData = async () => {
    try {
      let res = await axios.get(`/PropStatues/${data?.statusId}`);
      setState({...(res?.data?.data)})
    } catch (e: any) {
      toast.error(t('Unable to load the property status data.'));
      toggle(null);
    }
  }

  const onSubmit = async (event: any, index: number) => {
    event.preventDefault();
    setLoading(true);

    try {
      let errorMessage = "";
      if(!(state?.description)) {
        errorMessage += "*Please enter the name.\n";
      }

      if(errorMessage.length > 1) {
        toast.error(`Error while creating property status!\n${errorMessage}`)
        return;
      }

      let response: any = state.statusId ? await axios.put('/PropStatues', state) : await axios.post('/PropStatues', state)
      let res = response?.data;
      if(res?.succeeded) {
        toast.success("Property Status Saved Successfully.");

        dispatch(getData({
          ...(store.params)
        }));

        dispatch(getPropertyStatus({}));

        if(!!onSuccess) {
          onSuccess({
            recno: res?.data?.recno,
            text: res?.data?.name,
            code: res?.data?.code
          })
        }

        if(index === 0) {
          toggle(null);
        } else {
          setState({isActive: true})
        }

      } else {
        let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
        toast.error(`Error while property status!. ${message}`)
      }
    } catch (res: any) {
      let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Error while creating property status!. ${message}`)
    } finally {
      setLoading(false);
    }

  }

  return (
    <Drawer
      open={open}
      anchor='top'
      variant='temporary'
      onClose={loading ? undefined : () => toggle(null)}
      transitionDuration={500}
      sx={{
        '& .MuiDrawer-paper': {
          alignItems: 'center',
          backgroundColor: '#00000000',
          marginTop: 2,
        }
      }}
      ModalProps={{keepMounted: true}}
    >
      <Card sx={{width: hidden ? '30%' : '98%'}}>
        <Header sx={{px: 4, py: 2}}>
          <Typography variant='h5'>{state?.statusId ? t("Update Property Status") : t("Add Property Status")}</Typography>
          <IconButton
            size='small'
            onClick={loading ? undefined : () => toggle(null)}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.25rem'/>
          </IconButton>
        </Header>

        <Divider/>

        <Box sx={{p: theme => theme.spacing(4, 6, 16), position: 'relative', maxHeight: '90vh', overflow: 'auto'}}>

          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CustomAvatar skin='light' color='secondary' variant='rounded' sx={{mr: 4, width: 114, height: 114}}>
              <Icon icon='tabler:circle' fontSize={'4.5rem'}/>
            </CustomAvatar>
          </Box>

          <Grid container spacing={2} sx={{mt: 3}}>

            <Grid item xs={12} sm={12} lg={12}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'Description'} important />}
                type={'text'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Description') as string}
                value={state?.description??""}
                onChange={(event) => {
                  setState({...(state??{}), description: event.target.value??""})
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <CustomTextField
                select
                fullWidth
                label={<TypoLabel name={'Status'} important />}
                value={state?.isActive ? "active" : "inactive"}
                onChange={(event) => {
                  const value = event.target.value;
                  setState({
                    ...(state ?? {}),
                    isActive: value === "active",
                  });
                }}
              >
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>InActive</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={12} lg={12}>
              <CustomTextField
                autoFocus
                multiline={true}
                fullWidth
                rows={3}
                label={<TypoLabel name={'Description'} important />}
                type={'text'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Description') as string}
                value={state?.remarks??""}
                onChange={(event) => {
                  setState({...(state??{}), remarks: event.target.value??""})
                }}
              />
            </Grid>

          </Grid>
        </Box>
        <Box sx={{
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
          width: hidden ? '30%' : '98%',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: "end",
          p: 2,
          backgroundColor: theme => theme.palette.customColors.tableHeaderBg
        }}>
          <Box sx={{display: 'flex'}}>
            <FormSaveButton options={!!data ? [saveCloseKey] : [saveCloseKey, saveNewKey]}
                            onClick={(option: number, event: any) => onSubmit(event, option)}/>

            <Button disabled={loading} variant='tonal' color='error' onClick={() => toggle(null)} sx={{ml: 4}}>
              {t("Close")}
            </Button>
          </Box>
        </Box>

        <CustomBackdrop open={loading} />
      </Card>
    </Drawer>
  )
}

export default PropStatusForm
