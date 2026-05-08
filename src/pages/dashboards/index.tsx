// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CustomAvatar from "src/@core/components/mui/avatar";
import {getInitials} from "src/@core/utils/get-initials";
import CustomBackdrop from "src/@core/components/loading";
import {useAppDefaults} from "../../hooks/useAppDefaults";
import {useAuth} from "../../hooks/useAuth";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import Icon from "../../@core/components/icon";
import TabContext from "@mui/lab/TabContext";
import {useTranslation} from "react-i18next";
import {SyntheticEvent, useState} from "react";
import TabPanel from "@mui/lab/TabPanel";
import DashboardOverview from "../../views/dashboards/overview/DashboardOverview";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";

// @ts-ignore
import dateFormat from "dateformat";
import {globalDateFormat} from "../../@core/utils/format";
import Button from "@mui/material/Button";
import AnnouncementsTab from "../../views/dashboards/announcements";
import ActivityLogs from "../../views/dashboards/activity-logs";

const Dashboard = () => {

  const { defaultTanent } = useAppDefaults();
  const { user } = useAuth();
  const { t } = useTranslation();

  // ** States
  const [value, setValue] = useState<string>('1')

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box sx={{height: '100%', overflow: 'hidden', backgroundColor: theme => theme.palette.background.paper}}>
  Dashboard
    </Box>
  )
}

Dashboard.contentHeightFixed = true;

Dashboard.acl = {
  action: 'read',
  subject: 'DashboardMain'
}

export default Dashboard
