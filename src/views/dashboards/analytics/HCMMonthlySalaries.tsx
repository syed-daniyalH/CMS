import {ApexOptions} from "apexcharts";
import {useTheme} from "@mui/material/styles";
import Card from "@mui/material/Card";
import {CardHeader} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import ReactApexcharts from "../../../@core/components/react-apexcharts";
import Divider from "@mui/material/Divider";
import {kFormatter} from "../../../@core/utils/format";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getPayPeriodSalary} from "../../../store/dashboard";

//@ts-ignore
import {useRouter} from "next/navigation";
import {encodeParameters} from "../../../@core/utils/encrypted-params";

const HCMMonthlySalaries = () => {

  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const { t } = useTranslation();
  const router = useRouter();

  const [series, setSeries] = useState<ApexOptions['series']>([
    {
      name: 'Salaries',
      type: 'column',
      data: []
    }
  ]);

  const [labels, setLabels] = useState<ApexOptions['labels']>([]);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
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

          const obj = {...store.pay_period_salaries[dataPointIndex]};

          // Assuming index 0 = bar, index 1 = line
          if (seriesIndex === 0) {
            // 👇 Navigate to bar click page
            router.push(`/reports/payroll-reports/department-wise-detail/?query_filter=${encodeParameters({payPeriodId: obj.payPeriodId})}`)
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
    legend: {
      show: false,
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
    colors: [theme.palette.info.light],
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
      dispatch(getPayPeriodSalary({}))
    }


    return () => {
      isActive = false;
    }
  }, [dispatch])


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(store.pay_period_salaries.length > 0) {
        let tempLabels = [];
        let periodSalariesSeries = [];

        for(let  i = 0; i < (store.pay_period_salaries??[]).length; i++) {
          tempLabels.push(`${store.pay_period_salaries[i].periodName}`);
          periodSalariesSeries.push(store.pay_period_salaries[i].totalSalary??0);
        }

        setSeries([
          {
            name: t('Salaries') as string,
            type: 'column',
            data: periodSalariesSeries
          }
        ]);
        setLabels(tempLabels);

      }
    }


    return () => {
      isActive = false;
    }
  }, [store.pay_period_salaries])

  return (
    <Card sx={{mt: 1, ml: 2}}>
      <CardHeader
        title={t('Monthly Salaries')}
        subheader={t(`Last pay period wise salaries.`)}
        sx={{px: 3, py: 2}}/>

      <Divider />

      <CardContent sx={{p: 2}}>
        <ReactApexcharts
          id='shipment-statistics'
          type='bar'
          height={350}
          width='100%'
          series={series}
          options={options}
        />
      </CardContent>
    </Card>
  )

}

export default HCMMonthlySalaries;
