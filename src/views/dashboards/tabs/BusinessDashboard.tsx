import Grid from "@mui/material/Grid";
import AnalyticsStatsCard from "../../../@core/components/card-statistics/card-stats-vertical";
import {defaultCurrencyCode, getDateRange, globalDateFormat, kFormatter} from "../../../@core/utils/format";
import AnalyticsCashFlow from "../analytics/AnalyticsCashFlow";
import AnalyticsBankTransactions from "../analytics/AnalyticsBankTransactions";
import AnalyticsAgingReceivable from "../analytics/AnalyticsAgingReceivable";
import AnalyticsAgingPayable from "../analytics/AnalyticsAgingPayable";
import {Box} from "@mui/material";
import {CurrencyTypeData} from "../../../context/types";

//@ts-ignore
import dateFormat from 'dateformat';
import {useEffect, useState} from "react";
import {getPayableStats, getPNLComparison, getReceivableStats} from "../../../store/dashboard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useAuth} from "../../../hooks/useAuth";
import {useTranslation} from "react-i18next";

interface Props {
  defaultCurrency: CurrencyTypeData | null,
}

const BusinessDashboard = ({defaultCurrency}: Props) => {

  const [data, setData] = useState<any>({fromDate: new Date(), toDate: new Date()})
  const dispatch = useDispatch<AppDispatch>()
  const {user} = useAuth();
  const store = useSelector((state: RootState) => state.dashboard)
  const { t } = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      let { fromDate, toDate } = getDateRange(8, user);
      setData({fromDate, toDate})
      dispatch(
        getPayableStats({
          ToDate: toDate
        })
      );

      dispatch(
        getReceivableStats({
          ToDate: toDate
        })
      );

      dispatch(
        getPNLComparison({
          FromDate: fromDate,
          ToDate: toDate
        })
      );

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
            stats={`${defaultCurrency?.code??defaultCurrencyCode} ${kFormatter(store.pnl_data.totalRevenue??0)}`}
            chipText={`${((((store.pnl_data.totalRevenue??0)-(store.pnl_data.previousTotalRevenue??0))/((store.pnl_data.previousTotalRevenue??0) !== 0 ? store.pnl_data.previousTotalRevenue : 1)) * 100).toFixed(1)}%`}
            avatarColor={'success'}
            chipColor={((((store.pnl_data.totalRevenue??0)-(store.pnl_data.previousTotalRevenue??0))/((store.pnl_data.previousTotalRevenue??0) !== 0 ? store.pnl_data.previousTotalRevenue : 1)) * 100) > -1 ? 'success' : 'error'}
            title={t('Total Revenue')}
            subtitle={`Year: ${dateFormat(data.fromDate, (user?.dateFormat??globalDateFormat).toLowerCase())} - ${dateFormat(data.toDate, (user?.dateFormat??globalDateFormat).toLowerCase())}`}
            avatarIcon='tabler:chart-bar'
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={`${defaultCurrency?.code??defaultCurrencyCode} ${kFormatter(store.pnl_data.totalExpense??0)}`}
            chipText={`${((((store.pnl_data.totalExpense??0)-(store.pnl_data.previousTotalExpense??0))/((store.pnl_data.previousTotalExpense??0) !== 0 ? store.pnl_data.previousTotalExpense : 1)) * 100).toFixed(1)}%`}
            avatarColor={'error'}
            chipColor={((((store.pnl_data.totalExpense??0)-(store.pnl_data.previousTotalExpense??0))/((store.pnl_data.previousTotalExpense??0) !== 0 ? store.pnl_data.previousTotalExpense : 1)) * 100) > -1 ? 'success' : 'error'}
            title={t('Expenses')}
            subtitle={`Year: ${dateFormat(data.fromDate, (user?.dateFormat??globalDateFormat).toLowerCase())} - ${dateFormat(data.toDate, (user?.dateFormat??globalDateFormat).toLowerCase())}`}
            avatarIcon='tabler:wallet'
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={`${defaultCurrency?.code??defaultCurrencyCode} ${kFormatter(store.pnl_data.grossProfit??0)}`}
            chipText={`${((((store.pnl_data.grossProfit??0)-(store.pnl_data.previousGrossProfit??0))/((store.pnl_data.previousGrossProfit??0) !== 0 ? store.pnl_data.previousGrossProfit : 1)) * 100).toFixed(1)}%`}
            avatarColor={'info'}
            chipColor={((((store.pnl_data.grossProfit??0)-(store.pnl_data.previousGrossProfit??0))/((store.pnl_data.previousGrossProfit??0) !== 0 ? store.pnl_data.previousGrossProfit : 1)) * 100) > -1 ? 'success' : 'error'}
            title={t('Gross Profit')}
            subtitle={`Year: ${dateFormat(data.fromDate, (user?.dateFormat??globalDateFormat).toLowerCase())} - ${dateFormat(data.toDate, (user?.dateFormat??globalDateFormat).toLowerCase())}`}
            avatarIcon='tabler:coins'
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={`${defaultCurrency?.code??defaultCurrencyCode} ${kFormatter(store.pnl_data.netProft??0)}`}
            chipText={`${((((store.pnl_data.netProft??0)-(store.pnl_data.previousNetProft??0))/((store.pnl_data.previousNetProft??0) !== 0 ? store.pnl_data.previousNetProft : 1)) * 100).toFixed(1)}%`}
            avatarColor={'primary'}
            chipColor={((((store.pnl_data.netProft??0)-(store.pnl_data.previousNetProft??0))/((store.pnl_data.previousNetProft??0) !== 0 ? store.pnl_data.previousNetProft : 1)) * 100) > -1 ? 'success' : 'error'}
            title={t('Net Profit')}
            subtitle={`Year: ${dateFormat(data.fromDate, (user?.dateFormat??globalDateFormat).toLowerCase())} - ${dateFormat(data.toDate, (user?.dateFormat??globalDateFormat).toLowerCase())}`}
            avatarIcon='tabler:chart-arrows-vertical'
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={`${defaultCurrency?.code??defaultCurrencyCode} ${kFormatter(store.payable_data.totalPendingPayables??0)}`}
            chipText={`${(((store.payable_data.totalPendingPayables??0)/((store.payable_data.totalPayables??0) !== 0 ? store.payable_data.totalPayables : 1)) * 100).toFixed(2)}%`}
            avatarColor='secondary'
            chipColor={(((store.payable_data.totalPendingPayables??0)/(store.payable_data.totalPayables??0)) * 100) > 80 ? 'error' : (((store.payable_data.totalPendingPayables??0)/(store.payable_data.totalPayables??0)) * 100) > 50 ? 'warning' : 'success'}
            title={t('Invoices Due')}
            subtitle={`Until: ${dateFormat(data.toDate, (user?.dateFormat??globalDateFormat).toLowerCase())}`}
            avatarIcon='tabler:timeline'
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={2}>
          <AnalyticsStatsCard
            stats={`${defaultCurrency?.code??defaultCurrencyCode} ${kFormatter(store.receivable_data.totalPendingReceivables??0)}`}
            chipText={`${(((store.receivable_data.totalPendingReceivables??0)/((store.receivable_data.totalReceived??0) !== 0 ? store.receivable_data.totalReceived : 1)) * 100).toFixed(2)}%`}
            avatarColor='warning'
            chipColor={(((store.receivable_data.totalPendingReceivables??0)/(store.receivable_data.totalReceived??0)) * 100) > 80 ? 'error' : (((store.receivable_data.totalPendingReceivables??0)/(store.receivable_data.totalReceived??0)) * 100) > 50 ? 'warning' : 'success'}
            title={t('Pending Payments')}
            subtitle={`Until: ${dateFormat(data.toDate, (user?.dateFormat??globalDateFormat).toLowerCase())}`}
            avatarIcon='tabler:cash'
          />
        </Grid>

        <Grid item xs={12} lg={8}>
          <AnalyticsCashFlow />
        </Grid>

        <Grid item xs={12} lg={4}>
          <AnalyticsBankTransactions />
        </Grid>

        <Grid item xs={12} lg={4}>
          <AnalyticsAgingReceivable />
        </Grid>

        {/*<Grid item xs={12} lg={3}>*/}
        {/*  <AnalyticsReceivableOverdue />*/}
        {/*</Grid>*/}

        <Grid item xs={12} lg={4}>
          <AnalyticsAgingPayable />
        </Grid>

        {/*<Grid item xs={12} lg={3}>*/}
        {/*  <AnalyticsPayableOverdue />*/}
        {/*</Grid>*/}


      </Grid>
    </Box>
  )
}

export default BusinessDashboard;
