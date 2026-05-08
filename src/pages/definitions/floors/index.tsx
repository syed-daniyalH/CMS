// ** Next Import
import {useTranslation} from "react-i18next";

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { Box, Divider } from '@mui/material'
import Button from "@mui/material/Button";

// ** Components Imports
import TableFloors from "src/views/definitions/floors/list/TableFloors";
import Icon from 'src/core/components/icon';
import CustomBackdrop from "src/core/components/loading";
import {useSelector} from "react-redux";
import {RootState} from "src/store";
import {useState} from "react";
import FloorsForm, {FloorsSchema} from "src/views/definitions/floors/form";
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { rgbaToHex } from '../../../core/utils/rgba-to-hex'
import { hexToRGBA } from '../../../core/utils/hex-to-rgba'
import { getProjectDetail } from '../../../core/utils/format'
import { useAuth } from '../../../hooks/useAuth'

const FloorsList = () => {
  const {t} = useTranslation();
  const store = useSelector((state: RootState) => state.floors)
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<FloorsSchema | null>(null)
  const { user } = useAuth();

  const toggleForm = (data?: FloorsSchema | null) => {
    if(data) {
      setSelectedRow(data);
    } else {
      setSelectedRow(null)
    }

    setOpenForm(!openForm);

  }

  return (
    <Card sx={{display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0}}>
      <Box sx={{py: 1, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'customColors.trackBg'}}>
        <Typography variant={'h5'}>
          {t(`All ${getProjectDetail(user?.projectType??1)}`)}
        </Typography>
        <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
          <IconButton
            size='small'
            onClick={() => toggleForm(null)}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'common.white',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: theme => hexToRGBA(`${theme.palette.primary.main}`, 0.76)
              }
            }}
          >
            <Icon icon='tabler:plus' fontSize='1.25rem'/>
          </IconButton>

          <IconButton
            size='small'
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'customColors.bodyBg',
              ml: 2,
              backgroundColor: 'text.primary',
              '&:hover': {
                backgroundColor: theme => hexToRGBA(`${theme.palette.text.primary}`, 0.96)
              }
            }}
          >
            <Icon icon='tabler:adjustments' fontSize='1.25rem'/>
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <TableFloors toggleForm={toggleForm}/>

      <CustomBackdrop open={(store.loadingState.getData??false)} />

      {
        openForm &&
          <FloorsForm open={openForm} toggle={toggleForm} data={selectedRow} />
      }

    </Card>
  )
}

FloorsList.contentHeightFixed = true;

FloorsList.acl = {
  action: 'read',
  subject: 'Floors'
}

export default FloorsList
