// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'


// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import {useTranslation} from "react-i18next";
import {CardHeader} from "@mui/material";
import Divider from "@mui/material/Divider";
import {
  defaultCurrencyCode,
  formatCurrency,
  kFormatter
} from "../../../@core/utils/format";
import {useEffect, useState} from "react";
import {useAppDefaults} from "../../../hooks/useAppDefaults";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {getDesignationStrength} from "../../../store/dashboard";

const HCMDesignationStrength = () => {
  // ** Hook
  const theme = useTheme()
  const { t } = useTranslation();
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
      dispatch(getDesignationStrength({}))
    }


    return () => {
      isActive = false;
    }
  }, [dispatch])


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(store.desg_strength.length > 0) {
        let tempLabels = [];
        let periodSalariesSeries = [];

        for(let  i = 0; i < (store.desg_strength??[]).length; i++) {
          tempLabels.push(t(`${store.desg_strength[i].designationName}`));
          periodSalariesSeries.push(store.desg_strength[i].totalSalary??0);
        }

        setSeries([
          {
            data: periodSalariesSeries
          }
        ]);
        setLabels(tempLabels);

      }
    }


    return () => {
      isActive = false;
    }
  }, [store.desg_strength])


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
      theme.palette.primary.dark,
      theme.palette.info.dark,
      theme.palette.success.dark,
      theme.palette.secondary.dark,
      theme.palette.error.dark,
      theme.palette.warning.dark,
      theme.palette.common.black,
      theme.palette.customColors.linkColor,
      theme.palette.primary.light,
      theme.palette.divider,
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

  return (
    <Card>
      <CardHeader
        title={t('Designation Strength')}
        subheader={t(`designation strength.`)}
        sx={{p: theme.spacing(2,3)}}
      />

      <Divider />

      <CardContent>
        <ReactApexcharts type='bar' height={366} width='100%' series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default HCMDesignationStrength
