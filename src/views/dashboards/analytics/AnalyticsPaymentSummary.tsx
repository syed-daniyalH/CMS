// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'


// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../../hooks/useAuth";
import {defaultCurrencyCode, formatCurrency, getDateRange} from "../../../@core/utils/format";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useEffect} from "react";
import {getGroupPaymentsStats} from "../../../store/dashboard";
import {useAppDefaults} from "../../../hooks/useAppDefaults";

const AnalyticsPaymentSummary = () => {
  // ** Hook
  const theme = useTheme()
  const { t } = useTranslation();
  const {user} = useAuth();
  let { fromDate, toDate } = getDateRange(7, user);
  const dispatch = useDispatch<AppDispatch>()
  const { defaultCurrency } = useAppDefaults();
  const store = useSelector((state: RootState) => state.dashboard)

  const options: ApexOptions = {
    colors: [
      theme.palette.warning.main,
      theme.palette.customColors.linkColor,
      theme.palette.secondary.light
    ],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return `${val.toFixed(2)}`; // or whatever your currency is
        }
      },
      style: {
        fontSize: '0.85rem',
        fontFamily: 'sans-serif'
      }
    },
    dataLabels: { enabled: true, formatter(val: string | number | number[], opts?: any): string | number {
      return `${opts.w.globals.labels[opts.seriesIndex]} ${parseFloat(`${val}`).toFixed(2)}%`
    }
    },
    labels: [t('Bill Payments'), t('Expenses'), t('Others')],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      padding: {
        top: -22,
        bottom: -18
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        expandOnClick: false,
        donut: {
          size: '0%',
          labels: {
            show: true,
            name: {
              show: false,
              offsetY: 22,
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily
            },
            value: {
              show: false,
              offsetY: -17,
              fontWeight: 500,
              formatter: val => `${val}`,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h2.fontSize as string
            },
            total: {
              show: false
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { width: 200, height: 249 }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: { width: 150, height: 199 }
        }
      }
    ]
  }

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      dispatch(getGroupPaymentsStats({
        FromDate: fromDate,
        ToDate: toDate
      }))
    }


    return () => {
      isActive = false;
    }
  }, [dispatch])

  return (
    <Card sx={{mt: 1}}>
      <CardHeader title={t('Payment Summary')} subheader={t("Top payments made.")} sx={{px: 3, py: 2}}/>
      <Divider />
      <CardContent>
        <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column', width: '100%'}}>
          <Box sx={{ gap: 1.75, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Typography variant='h6' sx={{ color: 'text.disabled' }}>
                {t("Total Payments")}
              </Typography>
              <Typography variant='h3'>{formatCurrency(store?.group_payment_stats?.totalAmount??0, defaultCurrency?.code??defaultCurrencyCode)}</Typography>
            </div>
          </Box>
          <ReactApexcharts type='donut' width={'100%'} height={365} series={[parseFloat((store?.group_payment_stats?.totalPayments??0).toFixed(2)), parseFloat((store?.group_payment_stats?.totalExpenses??0).toFixed(2)), parseFloat((store?.group_payment_stats?.totalOthers??0).toFixed(2))]} options={options} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default AnalyticsPaymentSummary
