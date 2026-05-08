import {ApexOptions} from "apexcharts";
import {useTheme} from "@mui/material/styles";
import Card from "@mui/material/Card";
import {Box, CardHeader} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import ReactApexcharts from "../../../core/components/react-apexcharts";
import Divider from "@mui/material/Divider";
import {getDateFromMonth, getDateRange, globalDateFormat, kFormatter} from "../../../core/utils/format";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useAuth} from "../../../hooks/useAuth";
import {getRevenueStats} from "../../../store/dashboard";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";

//@ts-ignore
import dateFormat from 'dateformat';
import OptionMenu from "../../../core/components/option-menu";
import {encodeParameters} from "../../../core/utils/encrypted-params";
import {useRouter} from "next/navigation";


const RevenueAnalyticsBarLine = () => {

  const theme = useTheme();
  const {user} = useAuth();
  const [state, setState] = useState<any>({fromDate: new Date(), toDate: new Date()})
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const { t } = useTranslation();
  const router = useRouter();

  const [series, setSeries] = useState<ApexOptions['series']>([
    {
      name: t('Sales') as string,
      type: 'column',
      data: []
    },
    {
      name: t('Recoveries') as string,
      type: 'line',
      data: []
    }
  ]);

  const [labels, setLabels] = useState<ApexOptions['labels']>([]);

  const options: ApexOptions = {
    chart: {
      type: 'line',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const seriesIndex = config.seriesIndex;
          const dataPointIndex = config.dataPointIndex;

          const obj = {...store.revenue_stats[dataPointIndex]};
          let {dataFromDate, dataToDate} = getDateFromMonth(obj?.month??"", obj?.year??(new Date().getFullYear()));

          // Assuming index 0 = bar, index 1 = line
          if (seriesIndex === 0) {
            // 👇 Navigate to bar click page
            router.push(`/reports/sales-reports/sales-by-customer-summary/?query_filter=${encodeParameters({fromDate: dataFromDate, toDate: dataToDate})}`)
          } else if (seriesIndex === 1) {
            // 👇 Navigate to line circle click page
            router.push(`/reports/payment-received/payments-received/?query_filter=${encodeParameters({fromDate: dataFromDate, toDate: dataToDate})}`)
          }
        }
      }
    },
    markers: {
      size: 5,
      colors: ['#fff'],
      strokeColors: theme.palette.primary.main,
      hover: {
        size: 6
      },
      radius: 4
    },
    stroke: {
      curve: 'smooth',
      width: [0, 3],
      lineCap: 'round',
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      markers: {
        width: 8,
        height: 8,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 8 : -4
      },
      height: 40,
      itemMargin: {
        horizontal: 10,
        vertical: 0
      },
      fontSize: '15px',
      fontFamily: 'Open Sans',
      fontWeight: 400,
      labels: {
        colors: theme.palette.text.primary
      },
      offsetY: 10
    },
    grid: {
      strokeDashArray: 8,
      borderColor: theme.palette.divider
    },
    colors: [theme.palette.warning.light, theme.palette.primary.main],
    fill: {
      opacity: [1, 1]
    },
    plotOptions: {
      bar: {
        columnWidth: '32%',
        borderRadius: 4,
        startingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      tickAmount: 12,
      categories: labels,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontSize: '13px',
          fontWeight: 400
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter(val: number, _opts?: any): string | string[] {
          return kFormatter(val);
        },
        style: {
          colors: theme.palette.text.disabled,
          fontSize: '13px',
          fontWeight: 400
        }
      }
    }
  }

  useEffect(() => {
      let isActive = true;

        if(isActive) {
          let { fromDate, toDate } = getDateRange(7, user);
          setState({fromDate, toDate});

          dispatch(getRevenueStats({
            FromDate: fromDate,
            ToDate: toDate,
            type: 'month',
          }))
        }


      return () => {
        isActive = false;
      }
    }, [dispatch])


  useEffect(() => {
      let isActive = true;

        if(isActive) {
          if(store.revenue_stats.length > 0) {
            let tempLabels = [];
            let salesSeries = [];
            let recoverySeries = [];

            for(let  i = 0; i < (store.revenue_stats??[]).length; i++) {
              tempLabels.push(`${store.revenue_stats[i].month} ${store.revenue_stats[i].year.substring(2,4)}`);
              salesSeries.push(store.revenue_stats[i].totalSales??0);
              recoverySeries.push(store.revenue_stats[i].totalRecoveries??0);
            }

            setSeries([
              {
                name: t('Sales') as string,
                type: 'column',
                data: salesSeries
              },
              {
                name: t('Recoveries') as string,
                type: 'line',
                data: recoverySeries
              }
            ]);
            setLabels(tempLabels);

          }
        }


      return () => {
        isActive = false;
      }
    }, [store.revenue_stats])

  return (
    <Card sx={{mt: 1, ml: 2}}>
      <CardHeader
        title={t('Revenue Report')}
        subheader={t(`Revenue report for the period of `) + (`${dateFormat(new Date(state.fromDate), (user?.dateFormat??globalDateFormat).toLowerCase())} - ${dateFormat(new Date(state.toDate), (user?.dateFormat??globalDateFormat).toLowerCase())}`) + "."}
        sx={{px: 3, py: 2}}
        action={<OptionMenu options={['This Year', 'Last Year', 'Last 6 Months']} onChange={(option: string) => {
          if(option === "This Year") {
            let { fromDate, toDate } = getDateRange(7, user);
            setState({fromDate, toDate});
            dispatch(getRevenueStats({
              FromDate: fromDate,
              ToDate: toDate,
              type: 'month',
            }))
          } else if(option === "Last Year") {
            let { fromDate, toDate } = getDateRange(11, user);
            setState({fromDate, toDate});
            dispatch(getRevenueStats({
              FromDate: fromDate,
              ToDate: toDate,
              type: 'month',
            }))
          } else if(option === "Last 6 Months") {
            let { fromDate, toDate } = getDateRange(10, user);
            setState({fromDate, toDate});
            dispatch(getRevenueStats({
              FromDate: fromDate,
              ToDate: toDate,
              type: 'month',
            }))
          }
        }} />}
      />

      <Divider />

      <CardContent sx={{p: 2}}>
        {
          store.loadingState.getRevenueStats &&
          <Box sx={{width: '100%', height: '20vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <LinearProgress variant={'indeterminate'} sx={{width: '20%', height: 3}} />
            <Typography variant={'caption'} sx={{mt: 3}}>
              {t("loading...")}
            </Typography>
          </Box>
        }
        {
          ((labels??[]).length > 0 && !(store.loadingState.getRevenueStats)) &&
          <ReactApexcharts
            id='shipment-statistics'
            type='line'
            height={280}
            width='100%'
            series={series}
            options={options}
          />
        }
      </CardContent>
    </Card>
  )

}

export default RevenueAnalyticsBarLine;
