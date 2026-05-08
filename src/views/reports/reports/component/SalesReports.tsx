// ** React Imports
import React, {useContext} from "react";

// ** Third Party Imports
import {useTranslation} from "react-i18next";

// ** MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";


// ** Utils Imports
import {HeaderChipSizes, ContentSizes} from 'src/core/utils/reports-dashbard-sizes'

// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/core/components/mui/avatar'
import CustomChip from 'src/core/components/mui/chip'

// ** Next Imports
import Link from "next/link";
import isScreenViewable from "src/core/utils/userRights"
import IconButton from "@mui/material/IconButton";
import {AbilityContext} from "../../../../layouts/components/acl/Can";
import {SaleReportsDescKey} from "../../../../core/utils/translation-file";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";


interface MainProps {
  makeReportFav: any
  checkFav: any
}

const SalesReports = ({makeReportFav, checkFav}: MainProps) => {

  // ** Hook
  const {t} = useTranslation();
  const ability = useContext(AbilityContext);



  const salesReports = [
    {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Sales Summary",
      screenDescription: "SalesByCustomer",
      subtitle: "View sales summary by customer",
      isShow: true,
      path: "/reports/sales-reports/sales-summary",
    },
  {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Inventory Report",
      screenDescription: "SalesByCustomer",
      subtitle: "View sales summary by customer",
      isShow: true,
      path: "/reports/sales-reports/property-list",
    },
    {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Receipt List",
      screenDescription: "SalesByCustomer",
      subtitle: "View sales Receipt List",
      isShow: true,
      path: "/reports/receipt/receipt-list/",
    },
    {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Customer List",
      screenDescription: "SalesByCustomer",
      subtitle: "View sales summary by customer",
      isShow: true,
      path: "/reports/customer-report/customer-list",
    },

    {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Expected Income",
      screenDescription: "SalesByCustomer",
      subtitle: "View sales Expected Income",
      isShow: true,
      path: "/reports/sales-reports/expected-income-report",
    },

    {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Property Wise Pending",
      screenDescription: "SalesByCustomer",
      subtitle: "View Property Wise Pending Report",
      isShow: true,
      path: "/reports/sales-reports/property-wise-pending-report",
    },
    {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Property Type Wise Installment",
      screenDescription: "SalesByCustomer",
      subtitle: "Property Type Wise Installment",
      isShow: true,
      path: "/reports/sales-reports/property-type-wise-pending-report",
    },
    {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Pending Installments report",
      screenDescription: "SalesByCustomer",
      subtitle: "View Pending Installments report",
      isShow: true,
      path: "/reports/sales-reports/pending-installment-report",
    },
    {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Monthly Sale Summary",
      screenDescription: "SalesByCustomer",
      subtitle: "View Monthly Sale Summary",
      isShow: true,
      path: "/reports/sales-reports/month-wise-sale-summary",
    },
    {
      icon: 'wave-saw-tool',
      iconName: "wave-saw-tool",
      title: "Transfer Report",
      screenDescription: "SalesByCustomer",
      subtitle: "View Transfer Report",
      isShow: true,
      path: "/reports/transfer-report",
    },

  ];


  return (
    <>
      {salesReports.some(item => item.isShow) && (
        <Card sx={{marginTop: 2}}>
          <CardContent sx={{textAlign: 'center', p: 0}} style={{paddingBottom: 0}}>

            <Box sx={{
              position: 'relative',
              height: '90px',
              backgroundColor: 'customColors.tableHeaderBg',
              borderRadius: '6px',
              display: 'flex',
              p: theme => theme.spacing(2, 3)
            }}>
              <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <CustomAvatar
                    skin='light'
                    sx={{
                      color: "#28C76F",
                      backgroundColor: '#1d1f1e',
                      width: `${HeaderChipSizes.width}`,
                      height: `${HeaderChipSizes.height}`,
                      mr: 3
                    }}
                    variant={'rounded'}
                  >
                    <Icon fontSize={HeaderChipSizes.iconSize} icon='tabler:wave-saw-tool'/>
                  </CustomAvatar>
                  <Typography variant='h5' sx={{fontWeight: 400}}>{t("Reports")}</Typography>
                </Box>
                <Typography variant='caption' sx={{
                  mt: 1.5,
                  fontWeight: 300,
                  color: 'text.disabled',
                  textAlign: 'start',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'normal',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>{t(SaleReportsDescKey)}</Typography>
              </Box>
            </Box>

            <Box sx={{p: 2}}>
              {salesReports.map((item, index) => {
                return (
                  item.isShow ? (
                    <Box sx={{display: 'flex', flexDirection: 'column'}} key={index}>
                      <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Box sx={{mr: 1}}>
                          <IconButton
                            color='warning'
                            onClick={(_e) => makeReportFav(`${item.title}`, `${(item.path)}`, `${item.iconName}`, item.screenDescription)}
                          >
                            <Icon fontSize={ContentSizes.favIconSize}
                                  icon={`tabler:${checkFav(item.path) ? "star-filled" : "star"}`}/>
                          </IconButton>
                        </Box>

                        <IconButton sx={{
                          flexGrow: 1,
                          display: 'flex',
                          justifyContent: 'start',
                          py: 2,
                          borderRadius: '8px',
                          alignItems: 'center'
                        }} component={Link} href={item.path}>
                          <Typography variant={'body1'} sx={{mr: 2}}>
                            {t(item.title)}
                          </Typography>
                        </IconButton>
                      </Box>
                      {
                        index < (salesReports.length - 1) &&
                        <Divider sx={{my: 1}}/>
                      }
                    </Box>
                  ) : null
                );
              })}
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default SalesReports;
