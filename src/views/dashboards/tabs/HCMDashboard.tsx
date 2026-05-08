import Grid from "@mui/material/Grid";
import {Box} from "@mui/material";
import AnalyticsStatsCard from "../analytics/AnalyticsStatsCard";

//@ts-ignore
import HCMMonthlySalaries from "../analytics/HCMMonthlySalaries";
import HCMDepartmentStrength from "../analytics/HCMDepartmentStrength";
import HCMDesignationStrength from "../analytics/HCMDesignationStrength";
import HCMTopJoiners from "../analytics/HCMTopJoiners";
import HCMTopLeavers from "../analytics/HCMTopLeavers";
import HCMSalaryDemographics from "../analytics/SalaryDemographics";
import TableExpireDocuments from "../analytics/hcm-documents-table/TableExpireDocuments";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useEffect} from "react";
import {getHCMCardsData} from "../../../store/dashboard";
import {kFormatter} from "../../../@core/utils/format";
import {useTranslation} from "react-i18next";

const HCMDashboard = () => {

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const { t } = useTranslation();


  useEffect(() => {
      let isActive = true;

        if(isActive) {
          dispatch(
            getHCMCardsData({})
          )
        }


      return () => {
        isActive = false;
      }
    }, [dispatch])

  return (
    <Box sx={{height: 'calc(100vh - 190px)', mt: 4, mb: 4, pb: 5, overflow: 'auto'}}>
      <Grid container spacing={6} className={'match-height'}>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={store.hcm_cards_stats.male??'loading...'}
            chipText={``}
            avatarColor={'info'}
            chipColor={'error'}
            title={t('Male Employees')}
            subtitle={t(`Total no of male employees.`)}
            avatarIcon='tabler:man'
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={store.hcm_cards_stats.female??'loading...'}
            chipText={``}
            avatarColor={'warning'}
            chipColor={'error'}
            title={t('Female Employees')}
            subtitle={t(`Total no of female employees.`)}
            avatarIcon='tabler:woman'
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={store.hcm_cards_stats.total??'loading...'}
            chipText={``}
            avatarColor={'success'}
            chipColor={'error'}
            title={t('Total Employees')}
            subtitle={t(`Total no of employees.`)}
            avatarIcon='tabler:friends'
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={kFormatter(store.hcm_cards_stats.totalSalary??0)}
            chipText={``}
            avatarColor={'secondary'}
            chipColor={'error'}
            title={t('Total Salary')}
            subtitle={t(`Total salary of employees.`)}
            avatarIcon='tabler:cash'
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={kFormatter(store.hcm_cards_stats.minimumSalary??0)}
            chipText={``}
            avatarColor={'warning'}
            chipColor={'error'}
            title={t('Minimum Salary')}
            subtitle={t(`Minimum salary of employees.`)}
            avatarIcon='tabler:coins'
          />
        </Grid>


        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={kFormatter(store.hcm_cards_stats.maximumSalary??0)}
            chipText={``}
            avatarColor={'error'}
            chipColor={'error'}
            title={t('Maximum Salary')}
            subtitle={t(`Maximum salary of employees.`)}
            avatarIcon='tabler:cash'
          />
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <HCMMonthlySalaries />
        </Grid>


        <Grid item xs={12} sm={12} md={3.5}>
          <HCMSalaryDemographics />
        </Grid>

        <Grid item xs={12} sm={12} md={3.5}>
          <HCMTopJoiners />
        </Grid>


        <Grid item xs={12} sm={12} md={4}>
          <HCMTopLeavers />
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <HCMDepartmentStrength />
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <HCMDesignationStrength />
        </Grid>


        <Grid item xs={12} sm={12} md={12}>
          <TableExpireDocuments />
        </Grid>


      </Grid>
    </Box>
  )
}

export default HCMDashboard;
