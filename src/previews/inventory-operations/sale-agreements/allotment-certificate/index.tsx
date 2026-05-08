// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
// @ts-ignore
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import {SyntheticEvent, useEffect, useState} from "react";
import TabPanel from "@mui/lab/TabPanel";
import Grid from "@mui/material/Grid";
import DocumentPreview from "./preview";
import CustomBackdrop from "src/@core/components/loading";
import {InventoryPreviewDataType} from "./preview/type";

import { GET_PROPERTY_DETAIL_LIST } from 'src/graph-ql/sale-agreement/PropertyDetailList'
import { useQuery } from '@apollo/client'

interface Props {
  propertyId: number
  open: boolean
  toggle: (data: any) => void
}

const AllotmentCertificatePreview = ({open, toggle, propertyId}: Props) => {

  const {t} = useTranslation();
  const [value, setValue] = useState<string>('1')


  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const {
    data,
    loading ,
    error
  } = useQuery(GET_PROPERTY_DETAIL_LIST, {
    variables: {
      model: {

        propertyId: +propertyId
      }
    },
    skip: !propertyId,
    fetchPolicy: 'no-cache'
  });

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={() => toggle(null)}
      transitionDuration={100}
      sx={{'& .MuiDrawer-paper': {width: '60%', backgroundColor: '#00000000', my: '10px', height: '98vh', borderRadius: '12px'}}}
      ModalProps={{keepMounted: true}}
    >
      <Card sx={{mx: '10px', height: '100vh', overflow: 'hidden'}}>
        <TabContext value={value}>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <TabList onChange={handleTabChange} aria-label='icon tabs example' sx={{flexGrow: 1, borderBottom: 'none !important'}}>
              <Tab value='1' label={t('Details')} iconPosition={'start'} icon={<Icon icon='tabler:list-details' />} />
            </TabList>
            <Box sx={{mr: 4, display: 'flex', alignItems: 'center'}}>
              <IconButton
                size='small'
                onClick={() => toggle(null)}
                sx={{
                  ml: 2,
                  p: '0.375rem',
                  borderRadius: 1,
                  color: 'text.primary',
                  backgroundColor: 'action.selected',
                  '&:hover': {
                    backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
                  }
                }}
              >
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <TabPanel value='1' sx={{p: 0.8}}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box sx={{height: `calc(100vh - 60px)`, overflow: 'hidden', width: '100%'}}>
                  {
                    <DocumentPreview loading={loading} item={data?.propertyDetailList?.nodes[0]}/>
                  }
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      </Card>

      <CustomBackdrop open={loading} />
    </Drawer>
  )
}

export default AllotmentCertificatePreview
