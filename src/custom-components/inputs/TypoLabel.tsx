import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import Box from "@mui/material/Box";

type Props = {
  name: string
  important?: boolean
  action_name?: string
  action_callback?: () => void
}

const TypoLabel = ({name, important = false, action_name, action_callback}: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
      <Typography variant={'body1'} sx={{color: important ? theme => theme.palette.error.main : theme => theme.palette.text.primary, fontWeight: 300}}>{t(`${name}`)}{important ? "*" : ""}</Typography>
      {
        action_name && action_callback &&
        //@ts-ignore
        <Typography onClick={() => action_callback!()} variant={'body2'} sx={{cursor: 'pointer', textDecoration: 'underline', color: theme => theme.palette.customColors.linkColor, fontWeight: 300}}>{t(`${action_name}`)}</Typography>
      }
    </Box>
  )
}

export default TypoLabel;
