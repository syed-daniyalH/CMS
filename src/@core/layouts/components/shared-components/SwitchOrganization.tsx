// ** React Import
import {useState} from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import {useTranslation} from 'react-i18next'

//** MUI Imports
import {Typography} from "@mui/material";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Box, {BoxProps} from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";

// ** Custom Components Imports
import {useAppDefaults} from "src/hooks/useAppDefaults";
import InputAdornment from "@mui/material/InputAdornment";
import CustomTextField from "../../../components/mui/text-field";
import {useAuth} from "src/hooks/useAuth";
import {LocationDetailType, LoginData, TenantDetailType} from "src/context/types";
import CustomAvatar from "../../../components/mui/avatar";
import CustomChip from "../../../components/mui/chip";
import CustomBackdrop from "../../../components/loading";
import toast from "react-hot-toast";
import axios from "axios";
import authConfig from "../../../../configs/auth";
import {localServerAddress} from "../../../utils/form-types";
import Tooltip from "@mui/material/Tooltip";


const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SwitchOrganization = () => {
  // ** Hook
  const {t} = useTranslation()
  const {defaultTanent, defaultCostLocation} = useAppDefaults();
  const {user} = useAuth();

  //** States
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showBranches, setShowBranches] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const toggle = () => {
    setOpen(!open);
  }

  const toggleBranches = () => {
    setShowBranches(!showBranches);
  }

  const onChangeOrg = async (org: TenantDetailType) => {
    setLoading(true);
    let success = false;

    try {
      let response: any = await axios.post('/Login/PostLocations', {userId: user?.userId, tenantId: org.tenantId})
      let res: LoginData = response?.data;
      if (res?.succeeded) {
        window.sessionStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
        sessionStorage.setItem('locationData', JSON.stringify(res.data.locationDetails[0]))
        axios.defaults.headers.common['Authorization'] = `Bearer ${res?.data.accessToken}`;
        window.sessionStorage.setItem('userData', JSON.stringify(res.data));
        window.sessionStorage.setItem(localServerAddress, res?.data?.instanceURL);
        success = true;
        toast.success("Organization switched Successfully. you are being redirected to the switched organization.");
        const timer = setTimeout(() => {
          clearTimeout(timer);
          window?.location?.reload();
        }, 1000);
      } else {
        let message: any = res?.message;
        toast.error(`Error while saving setting!. ${message}`)
      }
    } catch (res: any) {
      let message: any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Error while switching organization!. ${message}`)
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  }


  const onChangeBranch = async (loc: LocationDetailType) => {
    setLoading(true);
    let success = false;

    try {
      let response: any = await axios.post('/Login/PostFyearToken', {userId: user?.userId, tenantId: loc.tenantId, locationId: loc.locationId, fyearId: user?.loginFyearId})
      let res: LoginData = response?.data;
      if (res?.succeeded) {
        window.sessionStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
        sessionStorage.setItem('locationData', JSON.stringify(res.data.locationDetails[0]))
        axios.defaults.headers.common['Authorization'] = `Bearer ${res?.data.accessToken}`;
        window.sessionStorage.setItem('userData', JSON.stringify(res.data));
        window.sessionStorage.setItem(localServerAddress, res?.data?.instanceURL);
        success = true;
        toast.success("Branch switched Successfully. you are being redirected to the switched branch.");
        const timer = setTimeout(() => {
          clearTimeout(timer);
          window?.location?.reload();
        }, 1000);
      } else {
        let message: any = res?.message;
        toast.error(`Unable to switch branch!. ${message}`)
      }
    } catch (res: any) {
      let message: any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Unable to switch branch!. ${message}`)
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <Button sx={{width: 200}} onClick={() => (user?.tenantDetails ?? []).length > 1 || (user?.locationDetails??[]).length > 0 ? toggle() : undefined}
              variant={'tonal'} size={'small'} startIcon={<Icon icon={'tabler:building-arch'} color={'white'}/>}
              endIcon={(user?.tenantDetails ?? []).length > 1 ?
                <Icon icon={'tabler:chevron-down'} fontSize={'0.9rem'} color={'white'}/> : undefined}>
        <Typography variant={'body2'}
                    sx={{color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {t(defaultTanent?.name ?? "")} {(user?.locationDetails??[]).length > 1 ? `(${t("Branch")}: ${defaultCostLocation?.text})` : ""}
        </Typography>
      </Button>
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={loading ? undefined : toggle}
        transitionDuration={500}
        sx={{
          '& .MuiDrawer-paper': {
            alignItems: 'center',
            width: [300, 400],
            borderRadius: '12px'
          }
        }}
        ModalProps={{keepMounted: true}}
      >
        <Card sx={{width: '100%', height: '100%'}}>
          <Header sx={{px: 4, py: 2}}>
            <Typography variant='h5'>{t("Organizations & Branches")}</Typography>
            <IconButton
              size='small'
              onClick={loading ? undefined : toggle}
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

          <CardContent
            sx={{p: theme => theme.spacing(2, 2)}}
          >
            <CustomTextField
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value ?? "");
              }}
              fullWidth
              placeholder={t('Search...') as string}
              sx={{
                '& .MuiAutocomplete-endAdornment': {
                  display: 'none',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon={'tabler:search'}/>
                  </InputAdornment>
                ),
              }}
            />

            <Divider sx={{mt: 2, mb: 6}}/>

            <Box sx={{
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'column',
              height: 'calc(100vh - 125px)',
              overflow: 'auto'
            }}>
              {
                (user?.tenantDetails ?? []).filter((element: TenantDetailType) => ((element.organizationName ?? "").toLowerCase().includes(searchValue.toLowerCase()) || showBranches)).map((tenant: TenantDetailType, index: number) => {
                  return (showBranches && tenant.tenantId !== defaultTanent?.tenantId) ? null :(
                    <Box sx={{display: 'flex', flexDirection: 'column'}} key={index}>

                      {
                        tenant.tenantId === defaultTanent?.tenantId ?
                          <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                            <CustomAvatar skin='light' color='info' variant='rounded' sx={{width: 44, height: 44}}
                                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${tenant.logo}`}/>
                            <Box sx={{flexGrow: '1', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', ml: 2}}>
                              <Typography variant={'h6'} sx={{mb: 1, textAlign: 'start'}}>
                                {tenant.organizationName ?? ""}
                              </Typography>
                              {
                                (tenant.tenantId === defaultTanent?.tenantId) && (user?.locationDetails??[]).length > 1 &&
                                <Typography variant={'body2'} sx={{mb: 1, textAlign: 'start'}}>
                                  {t("Branch")}: {defaultCostLocation?.text ?? ""}
                                </Typography>
                              }
                              {
                                (tenant.tenantId === defaultTanent?.tenantId) && (user?.locationDetails??[]).length > 1 &&
                                <IconButton onClick={toggleBranches} sx={{borderRadius: '6px', display: 'flex', justifyContent: 'start', alignItems: 'center', mb: 1, p: 1}}>
                                  <Typography variant={'body2'} sx={{mb: 1, textAlign: 'start', color: 'customColors.linkColor', textDecoration: 'underline'}}>
                                    {t("Switch Branch")}
                                  </Typography>
                                </IconButton>
                              }
                              <Box sx={{display: 'flex', justifyContent: 'start'}}>
                                <CustomChip sx={{borderRadius: '6px'}} label={tenant.role ?? ""} size={'small'}
                                            skin={'light'} color={'success'}/>
                              </Box>
                            </Box>
                            {
                              !showBranches &&
                              <Icon
                                icon={tenant.tenantId === defaultTanent?.tenantId ? 'tabler:circle-check-filled' : 'tabler:circle-check'}
                                color={tenant.tenantId === defaultTanent?.tenantId ? 'green' : undefined}/>
                            }
                          </Box>
                          : <IconButton onClick={() => onChangeOrg(tenant)} sx={{borderRadius: '6px', display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                              <CustomAvatar skin='light' color='info' variant='rounded' sx={{width: 44, height: 44}}
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${tenant.logo}`}/>
                              <Box sx={{flexGrow: '1', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', ml: 2}}>
                                <Typography variant={'h6'} sx={{mb: 1, textAlign: 'start'}}>
                                  {tenant.organizationName ?? ""}
                                </Typography>
                                {
                                  (tenant.tenantId === defaultTanent?.tenantId) && (user?.locationDetails??[]).length > 1 &&
                                  <Typography variant={'body2'} sx={{mb: 1, textAlign: 'start'}}>
                                    {t("Branch")}: {defaultCostLocation?.text ?? ""}
                                  </Typography>
                                }
                                {
                                  (tenant.tenantId === defaultTanent?.tenantId) && (user?.locationDetails??[]).length > 1 &&
                                  <Typography variant={'body2'} sx={{mb: 1, textAlign: 'start', color: 'customColors.linkColor', textDecoration: 'underline', cursor: 'pointer'}}>
                                    {t("Switch Branch")}
                                  </Typography>
                                }
                                <Box sx={{display: 'flex', justifyContent: 'start'}}>
                                  <CustomChip sx={{borderRadius: '6px'}} label={tenant.role ?? ""} size={'small'}
                                              skin={'light'} color={'success'}/>
                                </Box>
                              </Box>

                              <Icon
                                icon={tenant.tenantId === defaultTanent?.tenantId ? 'tabler:circle-check-filled' : 'tabler:circle-check'}
                                color={tenant.tenantId === defaultTanent?.tenantId ? 'green' : undefined}/>
                            </Box>
                          </IconButton>
                      }

                      {
                        (tenant?.tenantId === defaultTanent?.tenantId) && showBranches &&
                        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', border: theme => `2px solid ${theme.palette.customColors.tableHeaderBg}`, borderRadius: '8px', mt: 2}}>
                          <Box sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'customColors.tableHeaderBg', borderRadius: '6px', p: theme => theme.spacing(2,3), mb: 2}}>
                            <Typography variant={'h6'}>
                              {tenant.organizationName??""} {t("Branches")}
                            </Typography>
                          </Box>

                          {
                            (user?.locationDetails ?? []).filter((element: LocationDetailType) => (element.name ?? "").toLowerCase().includes(searchValue.toLowerCase())).map((location: LocationDetailType, s_index: number) => {
                              return (
                                <Box sx={{display: 'flex', flexDirection: 'column', mx: 1}} key={s_index}>
                                  {
                                    defaultCostLocation?.recno === location?.locationId ?
                                      <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                        <CustomAvatar skin='light' color='info' variant='rounded' sx={{width: 44, height: 44}}
                                                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${location.branchLogo}`}/>
                                        <Box sx={{flexGrow: '1', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', ml: 2}}>
                                          <Typography variant={'h6'} sx={{mb: 1, textAlign: 'start'}}>
                                            {location.name ?? ""}
                                          </Typography>
                                        </Box>

                                        <Icon
                                          icon={defaultCostLocation?.recno === location?.locationId ? 'tabler:circle-check-filled' : 'tabler:circle-check'}
                                          color={defaultCostLocation?.recno === location?.locationId ? 'green' : undefined}/>
                                      </Box>
                                      : <IconButton onClick={() => onChangeBranch(location)} sx={{borderRadius: '6px', display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                                        <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                          <CustomAvatar skin='light' color='info' variant='rounded' sx={{width: 44, height: 44}}
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${location.branchLogo}`}/>
                                          <Box sx={{flexGrow: '1', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', ml: 2}}>
                                            <Typography variant={'h6'} sx={{mb: 1, textAlign: 'start'}}>
                                              {location.name ?? ""}
                                            </Typography>
                                          </Box>

                                          <Icon
                                            icon={defaultCostLocation?.recno === location?.locationId ? 'tabler:circle-check-filled' : 'tabler:circle-check'}
                                            color={defaultCostLocation?.recno === location?.locationId ? 'green' : undefined}/>
                                        </Box>
                                      </IconButton>
                                  }

                                  {
                                    s_index !== ((user?.locationDetails ?? []).filter((element: LocationDetailType) => (element.name ?? "").toLowerCase().includes(searchValue.toLowerCase())).length - 1) &&
                                    <Divider sx={{my: 2}}/>
                                  }
                                </Box>
                              )
                            })
                          }
                        </Box>
                      }

                      {
                        index !== ((user?.tenantDetails ?? []).filter((element: TenantDetailType) => (element.organizationName ?? "").toLowerCase().includes(searchValue.toLowerCase())).length - 1) &&
                        <Divider sx={{my: 2}}/>
                      }
                    </Box>
                  )
                })
              }
            </Box>
          </CardContent>
          <CustomBackdrop open={loading}/>
        </Card>
      </Drawer>
    </>
  )
}

export default SwitchOrganization
