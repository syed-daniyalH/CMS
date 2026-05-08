// ** Next Import
import {useTranslation} from "react-i18next";

// ** MUI Imports
import { Box, Divider } from '@mui/material'

// ** Components Imports
import TablePropType from "src/views/definitions/prop-type/list/TablePropType";
import Icon from 'src/@core/components/icon';
import CustomBackdrop from "src/@core/components/loading";
import {useSelector} from "react-redux";
import {RootState} from "src/store";
import {useState} from "react";
import PropTypeForm, {PropTypeSchema} from "src/views/definitions/prop-type/form";
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { hexToRGBA } from '../../../@core/utils/hex-to-rgba'
import Card from '@mui/material/Card'

const PropTypeList = () => {
  const {t} = useTranslation();
  const store = useSelector((state: RootState) => state.propType)
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<PropTypeSchema | null>(null)


  const toggleForm = (data?: PropTypeSchema | null) => {
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
          {t("Property Types")}
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

      <TablePropType toggleForm={toggleForm}/>

      <CustomBackdrop open={(store.loadingState.getData??false)} />

      {
        openForm &&
          <PropTypeForm open={openForm} toggle={toggleForm} data={selectedRow} />
      }

    </Card>
  )
}

PropTypeList.contentHeightFixed = true;

PropTypeList.acl = {
  action: 'read',
  subject: 'PropType'
}

export default PropTypeList
