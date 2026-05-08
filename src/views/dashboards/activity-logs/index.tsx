import {useState} from "react";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";

// @ts-ignore
import Icon from "../../../@core/components/icon";
import IconButton from "@mui/material/IconButton";


const ActivityLogs = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false)
  const { t } = useTranslation();


  const toggleFilter = () => {
    setOpenFilter(!openFilter);
  }


  return (
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1,
        mt: 2,
        mb: 5,
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        backgroundColor: theme => theme.palette.customColors.tableHeaderBg
      }}>
        <Typography variant={'h6'}>
          {t("Activity Logs for ")}
        </Typography>
        <IconButton
          size='small'
          onClick={toggleFilter}
          sx={{
            p: '0.375rem',
            borderRadius: 1,
            color: 'common.white',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.primary.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:filter' fontSize='1.25rem' />
        </IconButton>
      </Box>

    </Box>
  )
}

export default ActivityLogs;
