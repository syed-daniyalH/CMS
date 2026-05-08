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
import {useEffect, useState} from "react";
import {getSalaryDemographics} from "../../../store/dashboard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";

const HCMSalaryDemographics = () => {
  // ** Hook
  const theme = useTheme()
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<any[]>([]);

  const options: ApexOptions = {
    colors: [
      theme.palette.warning.main,
      theme.palette.customColors.linkColor,
      theme.palette.success.main,
      theme.palette.info.light,
      theme.palette.error.dark,
    ],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return `${val.toFixed(0)} ${t("Employees")}`; // or whatever your currency is
        }
      },
      style: {
        fontSize: '0.85rem',
        fontFamily: 'sans-serif'
      }
    },
    dataLabels: { enabled: true, formatter(val: string | number | number[], opts?: any): string | number {
        return `${opts.w.globals.labels[opts.seriesIndex]}`
      }
    },
    labels: labels,
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
      dispatch(getSalaryDemographics({}))
    }


    return () => {
      isActive = false;
    }
  }, [dispatch])


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if((store.salary_demo??[]).length > 0) {
        let tempLabels = [];
        let noOfEmployees = [];

        for(let  i = 0; i < (store.salary_demo??[]).length; i++) {
          tempLabels.push(`${store.salary_demo[i].range}`);
          noOfEmployees.push(store.salary_demo[i].noOfEmployees??0);
        }

        setLabels(tempLabels);
        setSeries(noOfEmployees)
      }
    }


    return () => {
      isActive = false;
    }
  }, [store.salary_demo])

  return (
    <Card sx={{mt: 1}}>
      <CardHeader title={t('Salary Demographics')} subheader={t("salary demographics for all ranges.")} sx={{px: 3, py: 2}}/>
      <Divider />
      <CardContent>
        <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column', width: '100%'}}>
          <Box sx={{ gap: 1.75, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Typography variant='h6' sx={{ color: 'text.disabled' }}>
                {t("Total Salary")}
              </Typography>
              <Typography variant='h3'>{"325k"}</Typography>
            </div>
          </Box>

          {
            series.length > 0 &&
            <ReactApexcharts type='donut' width={'100%'} height={365} series={series} options={options}/>
          }

        </Box>
      </CardContent>
    </Card>
  )
}

export default HCMSalaryDemographics
