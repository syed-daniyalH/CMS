// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'


// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/core/components/react-apexcharts'

// ** Util Import
import {useTranslation} from "react-i18next";
import {CardHeader} from "@mui/material";
import OptionMenu from "../../../core/components/option-menu";
import Divider from "@mui/material/Divider";
import {useAuth} from "../../../hooks/useAuth";
import {
  defaultCurrencyCode,
  formatCurrency,
  getDateRange,
  globalDateFormat,
  kFormatter
} from "../../../core/utils/format";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useEffect, useState} from "react";
import {getTopExpensesStats} from "../../../store/dashboard";
//@ts-ignore
import dateFormat from 'dateformat';
import {useAppDefaults} from "../../../hooks/useAppDefaults";

const AnalyticsTopExpenses = () => {
  // ** Hook
  const theme = useTheme()
  const { t } = useTranslation();
  const {user} = useAuth();
  const [state, setState] = useState<any>({fromDate: new Date(), toDate: new Date()});
  const { defaultCurrency } = useAppDefaults();
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const [series, setSeries] = useState<ApexOptions['series']>([
    {
      data: []
    }
  ])

  const [labels, setLabels] = useState<ApexOptions['labels']>([])


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      let { fromDate, toDate } = getDateRange(4, user);
      setState({fromDate, toDate});

      dispatch(getTopExpensesStats({
        FromDate: fromDate,
        ToDate: toDate,
      }))
    }


    return () => {
      isActive = false;
    }
  }, [dispatch])


  // Vars
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: (labels??[]).length < 2 ? '20%' : (labels??[]).length < 4 ? '40%' : (labels??[]).length < 5 ? '60%' : '70%',
        distributed: true,
        borderRadius: 7,
        startingShape: "rounded"
      }
    },

    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main
    ],
    grid: {
      strokeDashArray: 8,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -25,
        left: 21,
        right: 25,
        bottom: 0
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: 8,
      style: {
        colors: ['#fff'],
        fontWeight: 500,
        fontSize: '0.8125rem'
      },
      formatter(_val: string, opt: any) {
        return (labels??[]).length > 0 ? labels![opt.dataPointIndex] : ''
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '0.75rem'
      },
      y: {
        formatter: (value) => {
          return `${formatCurrency(value??0, defaultCurrency?.code??defaultCurrencyCode)}`
        },
        title: {
          formatter: () => ''
        }
      }
    },
    legend: { show: false },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: labels,
      labels: {
        show: true,
        formatter: val => `${kFormatter(parseFloat(val))}`,
        style: {
          fontSize: '0.8125rem',
          colors: theme.palette.text.disabled
        }
      }
    },
    yaxis: {
      labels: {
        show: false,
        align: theme.direction === 'rtl' ? 'right' : 'left',
        style: {
          fontWeight: 500,
          fontSize: '0.8125rem',
          colors: theme.palette.text.disabled
        },
        offsetX: theme.direction === 'rtl' ? -15 : -30
      }
    }
  }


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(store.expense_stats.length > 0) {
        let tempLabels = [];
        let expenseSeries = [];

        for(let  i = 0; i < (store.expense_stats??[]).length; i++) {
          tempLabels.push(`${store.expense_stats[i].accountName}`);
          expenseSeries.push(store.expense_stats[i].amount??0);
        }

        setSeries([
          {
            data: expenseSeries
          }
        ]);
        setLabels(tempLabels);

      }
    }


    return () => {
      isActive = false;
    }
  }, [store.expense_stats])

  return (
    <Card>
      <CardHeader
        title={t('Top Expenses')}
        subheader={t(`Top expenses for the period of `) + `${dateFormat(new Date(state.fromDate), (user?.dateFormat??globalDateFormat).toLowerCase())} - ${dateFormat(new Date(state.toDate), (user?.dateFormat??globalDateFormat).toLowerCase())}.`}
        action={<OptionMenu options={["This Month", "Last Month", 'Last 6 Months', 'This Year', 'Last Year']} onChange={(option: string) => {
          if(option === "This Year") {
            let { fromDate, toDate } = getDateRange(7, user);
            setState({fromDate, toDate});
            dispatch(getTopExpensesStats({
              FromDate: fromDate,
              ToDate: toDate
            }))
          } else if(option === "Last Year") {
            let { fromDate, toDate } = getDateRange(11, user);
            setState({fromDate, toDate});
            dispatch(getTopExpensesStats({
              FromDate: fromDate,
              ToDate: toDate
            }))
          } else if(option === "This Month") {
            let { fromDate, toDate } = getDateRange(4, user);
            setState({fromDate, toDate});
            dispatch(getTopExpensesStats({
              FromDate: fromDate,
              ToDate: toDate
            }))
          } else if(option === "Last Month") {
            let { fromDate, toDate } = getDateRange(5, user);
            setState({fromDate, toDate});
            dispatch(getTopExpensesStats({
              FromDate: fromDate,
              ToDate: toDate
            }))
          } else if(option === "Last 6 Months") {
            let { fromDate, toDate } = getDateRange(10, user);
            setState({fromDate, toDate});
            dispatch(getTopExpensesStats({
              FromDate: fromDate,
              ToDate: toDate
            }))
          }
        }} />}
        sx={{p: theme.spacing(2,3)}}
      />
      <Divider />

      <CardContent>
        <ReactApexcharts type='bar' height={296} width='100%' series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default AnalyticsTopExpenses
