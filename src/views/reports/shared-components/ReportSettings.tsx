import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import CustomTextField from "src/@core/components/mui/text-field";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";


interface Props {
  reportName: string
  reportTitle: string
}

export interface ReportsSettingsData {
  orientation: 'portrait' | 'landscape'
  pageSize: 'A4' | 'Letter'
  reportTitle: string
  scale: number
  repeatHeaders: boolean
}

export const defaultReportSettings: ReportsSettingsData = {orientation: 'portrait', pageSize: "A4", reportTitle: "", scale: 1, repeatHeaders: false};

const ReportSettings = ({ reportName, reportTitle }: Props) => {
  const { t } = useTranslation();

  const [settings, setSettings] = useState<ReportsSettingsData>(defaultReportSettings);

  useEffect(() => {
    let isActive = true;

    if(isActive) {

      let localReportSettings = localStorage.getItem(reportName);

      if(localReportSettings) {
        setSettings({...settings, ...(JSON.parse(localReportSettings))});
      } else {
        setSettings({...settings, reportTitle: reportTitle});
      }
    }

    return () => {
      isActive = false;
    }
  }, [reportName, reportTitle])


  const handleChangeOrientation = (e: any) => {
    setSettings({...settings, orientation: e.target.value});
  }

  const handleChangePageSize = (e: any) => {
    setSettings({...settings, pageSize: e.target.value});
  }

  return (
    <Box sx={{display: 'flex', width: '100%', p: 4, alignItems: 'start', flexDirection: 'column'}}>

      <Box sx={{display: 'flex',  width: '100%', alignItems: 'center', justifyContent: 'start', px: 2, py: 2, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '8px', backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
        <Typography variant={'h6'}>
          {t("Report Title & Scale")}
        </Typography>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={6} sm={6} lg={6}>
          <CustomTextField
            fullWidth
            type='text'
            variant='outlined'
            placeholder={t('Report Name') as string}
            label={t("Report Name")}
            error={(settings?.reportTitle??"").length <= 0}
            helperText={(settings?.reportTitle??"").length <= 0 ? "It must be valid report name." : ""}
            value={(settings.reportTitle??"")}
            sx={{mt: 3}}
            onChange={(e => setSettings({...settings, reportTitle: e.target.value}))}
          />
        </Grid>

        <Grid item xs={6} sm={6} lg={6}>
          <CustomTextField
            fullWidth
            type='number'
            variant='outlined'
            label={t("Scale (0 - 1)")}
            placeholder={t('Scale') as string}
            error={(settings?.scale??0) > 1 || (settings?.scale??0) <= 0}
            helperText={(settings?.scale??0) > 1 || (settings?.scale??0) <= 0 ? "Scale can not be greater than 1 OR less than 0.1" : ""}
            value={(settings.scale??0)}
            sx={{mt: 3}}
            onChange={(e => setSettings({...settings, scale: +e.target.value}))}
          />
        </Grid>
      </Grid>

      <Box sx={{display: 'flex', mt: 4, width: '100%', alignItems: 'center', justifyContent: 'start', px: 2, py: 2, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '8px', backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
        <Typography variant={'h6'}>
          {t("Orientation")}
        </Typography>
      </Box>

      <RadioGroup row value={settings.orientation} name='simple-radio' onChange={handleChangeOrientation} aria-label='simple-radio-reports-orientation'>
        <FormControlLabel value='portrait' control={<Radio />} label='Portrait' />
        <FormControlLabel value='landscape' control={<Radio />} label='Landscape' />
      </RadioGroup>

      <Box sx={{display: 'flex',  width: '100%', mt: 4, alignItems: 'center', justifyContent: 'start', px: 2, py: 2, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '8px', backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
        <Typography variant={'h6'}>
          {t("Page Size")}
        </Typography>
      </Box>

      <RadioGroup row value={settings.pageSize} name='simple-radio' onChange={handleChangePageSize} aria-label='simple-radio-reports-pageSize'>
        <FormControlLabel value='A4' control={<Radio />} label='A4' />
        <FormControlLabel value='Letter' control={<Radio />} label='Letter' />
      </RadioGroup>


      <Box sx={{display: 'flex', mt: 4,  width: '100%', alignItems: 'center', justifyContent: 'start', px: 2, py: 2, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '8px', backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
        <Typography variant={'h6'}>
          {t("Table Headers")}
        </Typography>
      </Box>

      <FormControlLabel
        sx={{ mt: 2 }}
        label={t("Allow to repeat headers at each page.")}
        control={
          <Checkbox
            checked={settings.repeatHeaders}
            name="repeatHeaders"
            onChange={e => setSettings({ ...settings, repeatHeaders: e.target.checked })}
          />
        }
      />
      <Box sx={{
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        width: '100%',
        display: 'flex',
        justifyContent: "end",
        p: 2,
        backgroundColor: theme => theme.palette.customColors.tableHeaderBg
      }}>
        <Button variant='contained' color='success' onClick={() => {
          if(settings.scale <= 0 || settings.scale > 1 ) {
            toast.error("Scale must be between 0 - 1");
            return;
          } else if((settings.reportTitle??"").length <= 0) {
            toast.error("Report Title is required");
            return;
          }

          localStorage.setItem(reportName, JSON.stringify(settings));

          toast.success("Setting Saved");

        }} sx={{mr: 4}}>
          {t("Save")}
        </Button>
      </Box>

    </Box>
  )

}

export default ReportSettings;
