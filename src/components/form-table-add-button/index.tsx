import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";

interface Props {
  onClickAdd: (data: any) => void
  title?: string | null
}

const CustomEmptyState = ({onClickAdd, title}: Props) => {

  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column'
      }}
    >
      <Typography variant={'body2'} sx={{mb: 1, color: 'text.disabled'}}>
        {t("No Data Available to add new row click below.")}
      </Typography>
      <Button onClick={(_) => onClickAdd({id: -1})} variant={'contained'} color={'success'}>
        {t(title??"Add Row")}
      </Button>
    </Box>
  )
}

export default CustomEmptyState;
