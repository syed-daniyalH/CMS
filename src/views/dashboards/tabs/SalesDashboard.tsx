import Grid from "@mui/material/Grid";
import {Box} from "@mui/material";
import RevenueAnalyticsBarLine from "../analytics/RevenueAnalyticsBarLine";
import AnalyticsRevenueTracker from "../analytics/AnalyticsRevenueTracker";
import AnalyticsTopCustomers from "../analytics/AnalyticsTopCustomers";
import AnalyticsEstimatesByCustomer from "../analytics/AnalyticsEstimatesByCustomer";
import AnalyticsStatsCard from "../analytics/AnalyticsStatsCard";
import {useAuth} from "../../../hooks/useAuth";
import {getDateRange, kFormatter} from "../../../core/utils/format";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useEffect} from "react";
import {getMonthlySalesRecoveries} from "../../../store/dashboard";
import {useTranslation} from "react-i18next";


const SalesDashboard = () => {


  const {user} = useAuth();
  let { fromDate, toDate } = getDateRange(4, user);
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const { t } = useTranslation();



  useEffect(() => {
    let isActive = true;

    if(isActive) {
      dispatch(getMonthlySalesRecoveries({
        FromDate: fromDate,
        ToDate: toDate,
        type: 'month'
      }))
    }


    return () => {
      isActive = false;
    }
  }, [dispatch])

  return (
    <Box sx={{height: 'calc(100vh - 190px)', mt: 4, mb: 4, pb: 5, overflow: 'auto'}}>
      <Grid container spacing={6} className={'match-height'}>

        <Grid item xs={12} sm={12} md={6}>
          <RevenueAnalyticsBarLine />
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <AnalyticsRevenueTracker />
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <AnalyticsTopCustomers />
        </Grid>

        <Grid item xs={12} sm={12} md={3}>
          <AnalyticsEstimatesByCustomer />
        </Grid>

        <Grid item xs={12} sm={12} md={3}>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%', height: '100%'}}>
            <AnalyticsStatsCard
              sx={{width: '100%'}}
              stats={kFormatter(store.monthly_sales??0)}
              chipText={`MONTH`}
              avatarColor='primary'
              chipColor='default'
              title={t('Monthly Sales')}
              subtitle={t('Sales for the current month')}
              avatarIcon='tabler:trending-up'
            />
            <Box sx={{height: '20px'}} />
            <AnalyticsStatsCard
              sx={{width: '100%'}}
              stats={kFormatter(store.monthly_recoveries??0)}
              chipText={`MONTH`}
              avatarColor='success'
              chipColor='default'
              title={t('Monthly Recoveries')}
              subtitle={t('Recoveries for the current month')}
              avatarIcon='tabler:chart-bar'
            />

          </Box>
        </Grid>

      </Grid>
    </Box>
  )
}

export default SalesDashboard;
