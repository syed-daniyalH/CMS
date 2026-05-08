// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import KeenSliderWrapper from 'src/core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/core/styles/libs/react-apexcharts'
import {Box} from "@mui/material";
import CustomAvatar from "src/core/components/mui/avatar";
import {getInitials} from "src/core/utils/get-initials";
import Typography from "@mui/material/Typography";
import {globalDateFormat} from "src/core/utils/format";
import Button from "@mui/material/Button";
import Icon from "src/core/components/icon";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import {useAppDefaults} from "src/hooks/useAppDefaults";
import {useAuth} from "src/hooks/useAuth";
import {useTranslation} from "react-i18next";
import {SyntheticEvent, useContext, useEffect, useState} from "react";

// @ts-ignore
import dateFormat from "dateformat";
import BusinessDashboard from "../../../views/dashboards/tabs/BusinessDashboard";
import SalesDashboard from "../../../views/dashboards/tabs/SalesDashboard";
import PurchaseDashboard from "../../../views/dashboards/tabs/PurchaseDashboard";
import {useRouter} from "next/router";
import HCMDashboard from "../../../views/dashboards/tabs/HCMDashboard";
import {AbilityContext} from "../../../layouts/components/acl/Can";

const AnalyticsDashboard = () => {

  const { defaultTanent, defaultCurrency } = useAppDefaults();
  const {user} = useAuth();
  const {t} = useTranslation();

  const router = useRouter();

  const ability = useContext(AbilityContext);

  const { tabs } = router.query;


  // ** States
  const [value, setValue] = useState<string>('1')


  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    // setValue(newValue)
    router.push(`?tabs=${getTabName(newValue)}`).then(() => console.log('loaded'))
  }

  const getTabName = (val: string) => {
    return val === "1" ? "business" : val === "2" ? "sales" : val === "3" ? "purchases" : 'hcm';
  }


  useEffect(() => {
      let isActive = true;

        if(isActive) {
          if(tabs === 'business' && value !== '1') {
            setValue('1');
          } else if(tabs === 'sales' && value !== '2') {
            setValue('2');
          } else if(tabs === 'purchases' && value !== '3') {
            setValue('3');
          } else if(tabs === 'hcm' && value !== '4') {
            setValue('4');
          }
        }


      return () => {
        isActive = false;
      }
    }, [tabs])


  return (
    <Box sx={{height: '100%', overflow: 'hidden', backgroundColor: theme => theme.palette.background.paper}}>
      <ApexChartWrapper>
        <KeenSliderWrapper>
          <Grid container spacing={2} sx={{p: theme => theme.spacing(2,2,6,2), height: 'calc( 100vh - 45px)', overflow: 'hidden'}}>
            <Grid item xs={12} lg={12}>
              <Grid container spacing={2} sx={{mb: 2}}>
                <Grid item xs={8} lg={6}>
                  <Box sx={{display: 'flex', width: '100%', ml: 2}}>
                    {(defaultTanent?.base64Logo ?? "").length > 0 ? (
                      <Box sx={{
                        alignItems: 'center',
                        display: 'flex',
                        height: 50,
                        pr: 1,
                        mr: 2,
                        borderRight: theme => `1px solid ${theme.palette.divider}`
                      }}>
                        <img
                          src={defaultTanent?.base64Logo ?? ""}
                          alt={"Company Logo"}
                          style={{minWidth: 10, maxWidth: 100, maxHeight: 40, marginBottom: 4, marginRight: 4}}
                        />
                      </Box>
                    ) : (
                      <CustomAvatar
                        skin='light'
                        variant='rounded'
                        color={'primary'}
                        sx={{width: 40, height: 40, mb: 4, mr: 4, fontSize: '3rem'}}
                      >
                        {getInitials(defaultTanent?.name ?? "IN")}
                      </CustomAvatar>
                    )}

                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                      <Typography variant={'h4'} sx={{color: 'text.secondary', fontWeight: 700, mb: 1}}>
                        Welcome! {user?.name ?? ""}
                      </Typography>
                      <Typography variant={'body2'} sx={{color: 'text.disabled', fontWeight: 500}}>
                        {defaultTanent?.name ?? ""}
                      </Typography>
                    </Box>

                  </Box>
                </Grid>
                <Grid item xs={4} lg={6}>
                  <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'end', width: '100%'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                      <Typography variant={'body2'}>
                        {t("Date")}: {dateFormat(new Date(), (user?.dateFormat ?? globalDateFormat).toLowerCase())}
                      </Typography>
                      <Button color={'success'} variant={'tonal'} sx={{mt: 1}}
                              startIcon={<Icon icon={'tabler:fingerprint'}/>}>
                        {t("Check In")}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <TabContext value={value}>
                <TabList onChange={handleTabChange} aria-label='icon tabs dashboard'
                         sx={{flexGrow: 1, backgroundColor: 'customColors.tableHeaderBg', borderRadius: '8px'}}>
                  {
                    ability.can('read', 'Dashboard') &&
                    <Tab value='1' label={t('Business')} iconPosition={'start'}
                         icon={<Icon icon='tabler:list-details'/>}/>
                  }
                  {
                    ability.can('read', 'salesdashboard') &&
                    <Tab value='2' label={t('Sales')} iconPosition={'start'}
                         icon={<Icon icon='tabler:trending-up'/>}/>
                  }
                  {
                    ability.can('read', 'Purchasedashboard') &&
                    <Tab value='3' label={t('Purchase')} iconPosition={'start'}
                         icon={<Icon icon='tabler:trending-down'/>}/>
                  }
                  {
                    ability.can('read', 'HCM') &&
                    <Tab value='4' label={t('HCM')} iconPosition={'start'}
                         icon={<Icon icon='tabler:users-group'/>}/>
                  }
                </TabList>
                {
                  ability.can('read', 'Dashboard') &&
                  <TabPanel value='1' sx={{p: 0.8}}>
                    <BusinessDashboard defaultCurrency={defaultCurrency}/>
                  </TabPanel>
                }
                {
                  ability.can('read', 'salesdashboard') &&
                  <TabPanel value='2' sx={{p: 0.8}}>
                    <SalesDashboard/>
                  </TabPanel>
                }
                {
                  ability.can('read', 'Purchasedashboard') &&
                  <TabPanel value='3' sx={{p: 0.8}}>
                    <PurchaseDashboard/>
                  </TabPanel>
                }
                {
                  ability.can('read', 'HCM') &&
                  <TabPanel value='4' sx={{p: 0.8}}>
                    <HCMDashboard/>
                  </TabPanel>
                }
              </TabContext>
            </Grid>
          </Grid>
        </KeenSliderWrapper>
      </ApexChartWrapper>
    </Box>
  )
}

AnalyticsDashboard.contentHeightFixed = true;

AnalyticsDashboard.acl = {
  action: 'read',
  subject: 'DashboardMain'
}

export default AnalyticsDashboard
