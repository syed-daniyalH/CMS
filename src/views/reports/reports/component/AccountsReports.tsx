
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

// ** Hook Imports
import {useSettings} from "src/core/hooks/useSettings";

// ** Utils Imports
import { HeaderChipSizes, ContentSizes} from 'src/core/utils/reports-dashbard-sizes'
import isScreenViewable from "src/core/utils/userRights"
// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/core/components/mui/avatar'
import CustomChip from 'src/core/components/mui/chip'
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import {AbilityContext} from "../../../../layouts/components/acl/Can";



interface MainProps {
    makeReportFav: any
    checkFav: any
}

const AccountsReports = ({makeReportFav, checkFav} : MainProps) => {

    // ** Hook
    const {t} = useTranslation();
  const ability = useContext(AbilityContext);



    const accountsReports = [
        {
            icon: 'book',
            iconName: "book",
            title: "Journal Ledgers",
            screenDescription:"",
            subtitle: "View Journal Ledgers summary",
            isShow: false,
            path: "/reports/sales/Daily-Sales?type=report&by=Customer",
        },
        {
            icon: 'book',
            iconName: "book",
            title: "Ledger Summary",
            subtitle: "View company ledger",
            screenDescription : "LedgerSummary",
            isShow: isScreenViewable("LedgerSummary", ability),
            path: "/reports/accounts/sales-summary",
        },
      {
            icon: 'book',
            iconName: "book",
            title: "Detailed General Ledger",
            subtitle: "View company ledger",
            screenDescription : "LedgerSummary",
            isShow: isScreenViewable("LedgerSummary", ability),
            path: "/reports/accounts/all-journal-ledgers",
        },
        {
            icon: 'book',
            iconName: "book",
            title: "Bank Ledger Summary",
            screenDescription : "BankLedgerSummary",
            subtitle: "View bank ledger",
            isShow: isScreenViewable("BankLedgerSummary", ability),
            path: "/reports/accounts/bank-ledgers-summary",
        },
        {
            icon: 'book',
            iconName: "book",
            title: "Ledger Summary (Customer)",
            screenDescription : "LedgerSummaryCustomer",
            subtitle: "View customer ledger",
            isShow: isScreenViewable("LedgerSummaryCustomer", ability),
            path: "/reports/accounts/account-customer-ledger-summary",
        },
        {
            icon: 'book',
            iconName: "book",
            title: "Ledger Summary (Vendor)",
            screenDescription : "LedgerSummaryVendor",
            subtitle: "View vendor ledger",
            isShow: isScreenViewable("LedgerSummaryVendor", ability),
            path: "/reports/accounts/account-vendor-ledger-summary",
        }, {
            icon: 'book',
            iconName: "book",
            title: "Budget List",
            screenDescription : "LedgerSummaryVendor",
            subtitle: "View Budget List",
            isShow: isScreenViewable("LedgerSummaryVendor", ability),
            path: "/reports/accounts/budget-list",
        }, {
            icon: 'book',
            iconName: "book",
            title: "Employee Ledger Summary",
            screenDescription : "LedgerSummaryVendor",
            subtitle: "View Employee Ledger",
            isShow: isScreenViewable("LedgerSummaryVendor", ability),
        path: "/reports/accounts/account-employee-ledger-summary",
        },
      {
            icon: 'book',
            iconName: "book",
            title: "Class Transaction Summary",
            screenDescription : "LedgerSummaryVendor",
            subtitle: "View Employee Ledger",
            isShow: isScreenViewable("InventoryCostCenters", ability),
        path: "/reports/accounts/class-transaction-summary",
        },
      {
            icon: 'book',
            iconName: "book",
            title: "Account Ledger by Class Summary",
            screenDescription : "LedgerSummaryVendor",
            subtitle: "View Account By Class Summary",
            isShow: isScreenViewable("InventoryCostCenters", ability),
        path: "/reports/accounts/account-class-by-summary",
        },
    ];

    return (
        <>
          {accountsReports.some(item => item.isShow) && (
            <Card sx={{ marginTop: 2}}>
              <CardContent sx={{textAlign:'center', p: 0}} style={{paddingBottom: 0}}>

                <Box sx={{position: 'relative', height: '90px', backgroundColor: 'customColors.tableHeaderBg', borderRadius: '6px', display: 'flex', p: theme => theme.spacing(2,3)}}>
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <CustomAvatar
                        skin='light'
                        sx={{
                          color:"#00ffff",
                          backgroundColor:'#05053d',
                          width:`${HeaderChipSizes.width}`,
                          height:`${HeaderChipSizes.height}`,
                          mr: 3
                        }}
                        variant={'rounded'}
                      >
                        <Icon fontSize={HeaderChipSizes.iconSize} icon='tabler:file-invoice'/>
                      </CustomAvatar>
                      <Typography variant='h5' sx={{fontWeight:400}}>{t("Account Reports")}</Typography>
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
                    }}>{t("accountsReportsDescKey")}</Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 2 }}>
                  {accountsReports.map((item, index) => {
                    return (
                      item.isShow ? (
                        <Box sx={{display: 'flex', flexDirection: 'column'}} key={index}>
                          <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Box sx={{mr:1}}>
                              <IconButton
                                color='warning'
                                onClick={(_e) => makeReportFav(`${item.title}`, `${(item.path)}`, `${item.iconName}`, item.screenDescription)}
                              >
                                <Icon fontSize={ContentSizes.favIconSize} icon={`tabler:${checkFav(item.path) ? "star-filled" : "star"}`} />
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
                            index < (accountsReports.length-1) &&
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
};

export default AccountsReports
