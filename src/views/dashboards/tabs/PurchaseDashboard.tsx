import Grid from "@mui/material/Grid";
import {Box} from "@mui/material";
import PaymentAnalyticsBarLine from "../analytics/PaymentsAnalyticsBarLine";
import AnalyticsPaymentSummary from "../analytics/AnalyticsPaymentSummary";
import AnalyticsSupplierPayable from "../analytics/AnalyticsSupplierPayable";
import AnalyticsStatsCard from "../analytics/AnalyticsStatsCard";
import AnalyticsTopExpenses from "../analytics/AnalyticsTopExpenses";
import {useAuth} from "../../../hooks/useAuth";
import {getDateRange, kFormatter} from "../../../@core/utils/format";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useEffect} from "react";
import {getMonthlyPurchaseExpenses} from "../../../store/dashboard";
import {useTranslation} from "react-i18next";

const PurchaseDashboard = () => {

  const {user} = useAuth();
  let { fromDate, toDate } = getDateRange(4, user);
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const { t } = useTranslation();



  useEffect(() => {
    let isActive = true;

    if(isActive) {
      dispatch(getMonthlyPurchaseExpenses({
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
          <PaymentAnalyticsBarLine />
        </Grid>

        <Grid item xs={12} sm={12} md={3}>
          <AnalyticsPaymentSummary />
        </Grid>

        <Grid item xs={12} sm={12} md={3}>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%', height: '100%', mt: 1}}>
            <AnalyticsStatsCard
              sx={{width: '100%'}}
              stats={kFormatter(store.monthly_purchases??0)}
              chipText={`MONTH`}
              avatarColor='error'
              chipColor='default'
              title={t('Monthly Bills')}
              subtitle={t('Bills for the current month.')}
              avatarIcon='tabler:trending-down'
            />
            <Box sx={{height: '20px'}} />
            <AnalyticsStatsCard
              sx={{width: '100%'}}
              stats={kFormatter(store.monthly_expenses??0)}
              chipText={`MONTH`}
              avatarColor='warning'
              chipColor='default'
              title={t('Monthly Expenses')}
              subtitle={t('Expenses for the current month.')}
              avatarIcon='tabler:wallet'
            />

          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={7}>
          <AnalyticsSupplierPayable />
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <AnalyticsTopExpenses />
        </Grid>


      </Grid>
    </Box>
  )
}

export default PurchaseDashboard;
