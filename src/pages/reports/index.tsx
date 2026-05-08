// ** React Imports
import React, {SyntheticEvent, useContext, useState} from "react";

// ** Custom Component Imports
import DashboardReports from "src/views/reports/reports/DashboardReports";
import {AutocompleteChangeDetails, AutocompleteChangeReason, Box} from "@mui/material";
import Button from "@mui/material/Button";
import Icon from "../../@core/components/icon";
import CustomAutocomplete from "../../@core/components/mui/autocomplete";
import CustomTextField from "../../@core/components/mui/text-field";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";
import {useAuth} from "../../hooks/useAuth";
import {AbilityContext} from "../../layouts/components/acl/Can";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {LoginDataType} from "../../context/types";


type SearchItem = {
  label: string
  icon: string
  path: string
  resource: string
}

const searchItems = (userData: LoginDataType | null): SearchItem[] => {
  return [
    // Sales Reports
    {
      label: "Sales Summary",
      icon: "users-group",
      path: "/reports/sales-reports/sales-summary/",
      resource: "SaleAgreement"
    },

  ];
}


const Reports = () => {
  const {t} = useTranslation();

  const router = useRouter();

  const { user } = useAuth();

  const ability = useContext(AbilityContext)

  const theme = useTheme()

  const hidden = useMediaQuery(theme.breakpoints.up('md'));

  const [value, setValue] = useState<SearchItem | null>(null)

  return (
    <Box sx={{p: theme => theme.spacing(3,3)}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        {
          hidden &&
          <Button variant={"contained"} color={'success'} size={'small'} startIcon={<Icon icon={'tabler:headset'}/>}>
            {t("Need Support?")}
          </Button>
        }
        <CustomAutocomplete
          autoHighlight
          sx={{width: hidden ? 450 : '100%'}}
          id='autocomplete-country-select'
          options={(searchItems(user) as SearchItem[]).filter((element: SearchItem) => ability.can('view' as any, element.resource as any))}
          getOptionLabel={(option: SearchItem) => option.label || ''}
          renderOption={(props, option: SearchItem) => (
            <Box component='li' sx={{'& > svg': {mr: 4, flexShrink: 0}}} {...props}>
              <Icon icon={`tabler:${option.icon}`}/>
              {option.label}
            </Box>
          )}
          value={value}
          onChange={(_event: SyntheticEvent<Element, Event>, value: SearchItem | null, _reason: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<SearchItem> | undefined) => {
            router.push(value?.path ?? '').then(() => console.log("Stayed"));
            setValue(null);
          }}
          renderInput={params => (
            <CustomTextField
              {...params}
              placeholder='Search Reports'
              sx={{
                '& .MuiAutocomplete-endAdornment': {
                  display: 'none',
                }
              }}
              InputProps={{
                ...params.InputProps,
                autoComplete: 'new-password',
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon={'tabler:search'}/>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {
          hidden &&
          <Button onClick={() => router.replace('/dashboards')} variant={"tonal"} color={'error'} size={'small'}
                  startIcon={<Icon icon={'tabler:x'}/>}>
            {t("Close Reports")}
          </Button>
        }
      </Box>
      <Divider sx={{my: 2}}/>

      <DashboardReports />

    </Box>
  )
}

Reports.acl = {
  action: 'view',
  subject: 'Receipts'
}

export default Reports;
