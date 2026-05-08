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
import Icon from '../../../../core/components/icon'

// ** Custom Components Imports
import CustomTextField from '../../../../core/components/mui/text-field'
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import axios from "axios";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import TypoLabel from "../../../../components/inputs/TypoLabel";
import { getData } from '../../../../store/inventory-operations/projects';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import {saveCloseKey, saveNewKey} from "../../../../core/utils/translation-file";
import FormSaveButton from "../../../../components/form-save-button";
import CustomBackdrop from "../../../../core/components/loading";
import { getDefaultFloors } from '../../../../store/dropdowns'
import ProjectSelector from '../../../../core/dropdown-selectors/ProjectSelector'
import ProjectTypeSelector from '../../../../core/dropdown-selectors/ProjectTypeSelector'


interface Props {
  data?: ProjectsSchema | null
  open: boolean
  toggle: (data?: ProjectsSchema | null) => void
  onSuccess?: (data: any) => void
}

export interface ProjectsSchema {
  projectId?: number | null;
  parentProjectId?: number | null;
  description: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  webUrl?: string | null;
  remarks?: string | null;
  type?: number | null;
  isActive: boolean;
  marlaSize: number;
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const ProjectsForm = ({open, toggle, data, onSuccess}: Props) => {

  const {t} = useTranslation();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'));
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<ProjectsSchema>({isActive: true, marlaSize: 0, description: ""});
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.projects)


  useEffect(() => {
    let isActive = true;

    if(isActive && data) {
      getFloorsData().then(() => console.log('loaded'));
    }

    return () => {
      isActive = false;
    }
  }, [data])


  const getFloorsData = async () => {
    try {
      let res = await axios.get(`/Project/${data?.projectId}`);
      setState({...(res?.data?.data)})
    } catch (e: any) {
      toast.error(t('Unable to load the project data.'));
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
        toast.error(`Error while creating projects!\n${errorMessage}`)
        return;
      }

      let response: any = state.projectId ? await axios.put('/Project', state) : await axios.post('/Project', state)
      let res = response?.data;
      if(res?.succeeded) {
        toast.success("Floors Saved Successfully.");

        dispatch(getData({
          ...(store.params)
        }));

        dispatch(getDefaultFloors({}));

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
          setState({isActive: true, marlaSize: 0, description: ""})
        }

      } else {
        let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
        toast.error(`Error while project!. ${message}`)
      }
    } catch (res: any) {
      let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Error while saving project!. ${message}`)
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
          <Typography variant='h5'>{state?.projectId ? t("Update Project") : t("Add Project")}</Typography>
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

          <Grid container spacing={2}>

            <Grid item xs={12} sm={12} lg={12}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'Name'} important />}
                type={'text'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Name') as string}
                value={state?.description??""}
                onChange={(event) => {
                  setState({...(state??{}), description: event.target.value??""})
                }}
              />
            </Grid>


            <Grid item xs={12} sm={12} lg={6}>
              <ProjectTypeSelector selected_value={state.parentProjectId??null} handleChange={(value) => {
                setState({...state, parentProjectId: value?.value ? parseInt(`${value?.value}`) : null})
              }} props={{label: <TypoLabel name={"Project Type"} />, placeholder: t("Project Type") as string}} />
            </Grid>

            <Grid item xs={12} sm={12} lg={6}>
              <ProjectSelector selected_value={state.type??null} handleChange={(value) => {
                setState({...state, type: value?.value ? parseInt(`${value?.value}`) : null})
              }} props={{label: <TypoLabel name={"Parent Project"} />, placeholder: t("Parent Project") as string}} />
            </Grid>

            <Grid item xs={12} sm={12} lg={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'Phone'} />}
                type={'text'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Phone') as string}
                value={state?.phone??""}
                onChange={(event) => {
                  setState({...(state??{}), phone: event.target.value??""})
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'Web Url'} />}
                type={'text'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Web Url') as string}
                value={state?.webUrl??""}
                onChange={(event) => {
                  setState({...(state??{}), webUrl: event.target.value??""})
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'Marla Size'} important />}
                type={'number'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Marla Size') as string}
                value={state?.marlaSize??""}
                onChange={(event) => {
                  setState({...(state??{}), marlaSize: +event.target.value??0})
                }}
              />
            </Grid>


            <Grid item xs={12} sm={12} lg={12}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'Address'} />}
                type={'text'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Address') as string}
                value={state?.address??""}
                onChange={(event) => {
                  setState({...(state??{}), address: event.target.value??""})
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'City'} />}
                type={'text'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('City') as string}
                value={state?.city??""}
                onChange={(event) => {
                  setState({...(state??{}), city: event.target.value??""})
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'Country'} />}
                type={'text'}
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Country') as string}
                value={state?.country??""}
                onChange={(event) => {
                  setState({...(state??{}), country: event.target.value??""})
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name={'Description'} />}
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

export default ProjectsForm
