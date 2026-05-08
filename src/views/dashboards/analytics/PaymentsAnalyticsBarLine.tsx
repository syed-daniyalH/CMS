import {ApexOptions} from "apexcharts";
import {useTheme} from "@mui/material/styles";
import Card from "@mui/material/Card";
import {CardHeader} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import ReactApexcharts from "../../../core/components/react-apexcharts";
import Divider from "@mui/material/Divider";
import {getDateFromMonth, getDateRange, globalDateFormat, kFormatter} from "../../../core/utils/format";
import {useAuth} from "../../../hooks/useAuth";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getPaymentStats} from "../../../store/dashboard";

//@ts-ignore
import dateFormat from 'dateformat'
import {useRouter} from "next/navigation";
import {encodeParameters} from "../../../core/utils/encrypted-params";

const PaymentAnalyticsBarLine = () => {

  const theme = useTheme();
  const {user} = useAuth();
  let { fromDate, toDate } = getDateRange(7, user);
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const { t } = useTranslation();
  const router = useRouter();

  const [series, setSeries] = useState<ApexOptions['series']>([
    {
      name: t('Purchase') as string,
      type: 'column',
      data: []
    },
    {
      name: t('Payments') as string,
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

          const obj = {...store.payment_stats[dataPointIndex]};
          let {dataFromDate, dataToDate} = getDateFromMonth(obj?.month??"", obj?.year??(new Date().getFullYear()));

          // Assuming index 0 = bar, index 1 = line
          if (seriesIndex === 0) {
            // 👇 Navigate to bar click page
            router.push(`/reports/purchases/vendor-wise-purchase-summary/?query_filter=${encodeParameters({fromDate: dataFromDate, toDate: dataToDate})}`)
          } else if (seriesIndex === 1) {
            // 👇 Navigate to line circle click page
            router.push(`/reports/payable/payment-made/?query_filter=${encodeParameters({fromDate: dataFromDate, toDate: dataToDate})}`)
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
    colors: [theme.palette.error.light, theme.palette.primary.main],
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
      dispatch(getPaymentStats({
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
      if(store.payment_stats.length > 0) {
        let tempLabels = [];
        let purchaseSeries = [];
        let paymentSeries = [];

        for(let  i = 0; i < (store.payment_stats??[]).length; i++) {
          tempLabels.push(`${store.payment_stats[i].month} ${store.payment_stats[i].year.substring(2,4)}`);
          purchaseSeries.push(store.payment_stats[i].totalPurchases??0);
          paymentSeries.push(store.payment_stats[i].totalPayments??0);
        }

        setSeries([
          {
            name: t('Purchase') as string,
            type: 'column',
            data: purchaseSeries
          },
          {
            name: t('Payments') as string,
            type: 'line',
            data: paymentSeries
          }
        ]);
        setLabels(tempLabels);

      }
    }


    return () => {
      isActive = false;
    }
  }, [store.payment_stats])

  return (
    <Card sx={{mt: 1, ml: 2}}>
      <CardHeader
        title={t('Purchase Report')}
        subheader={t(`Purchase report for the current year `) + `${dateFormat(new Date(fromDate), (user?.dateFormat??globalDateFormat).toLowerCase())} - ${dateFormat(new Date(toDate), (user?.dateFormat??globalDateFormat).toLowerCase())}.`}
        sx={{px: 3, py: 2}}/>

      <Divider />

      <CardContent sx={{p: 2}}>
        <ReactApexcharts
          id='shipment-statistics'
          type='line'
          height={350}
          width='100%'
          series={series}
          options={options}
        />
      </CardContent>
    </Card>
  )

}

export default PaymentAnalyticsBarLine;
