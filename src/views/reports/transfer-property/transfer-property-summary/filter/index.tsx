

// ** React imports
import React, {MouseEvent, SyntheticEvent, useState} from "react";


// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import TabPanel from "@mui/lab/TabPanel";

// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import LedgerSummaryFilter from "./LedgerSummaryFilter";

// ** Type

import {useTranslation} from "react-i18next";
import Divider from "@mui/material/Divider";
import ReportSettings from "../../../shared-components/ReportSettings";
import {PropertyTransferDetail} from "../../../../../core/utils/form-types";
import TypoLabel from '../../../../../components/inputs/TypoLabel'
import CustomerSelector from '../../../../../core/dropdown-selectors/CustomerSelector'

interface Props {
    open: boolean
    state: any
    toggle: () => void
    queries: any
    setState: (value: any) => void
    updateQueries:() => void
    handleReset:()=> void
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2,3),
  justifyContent: 'space-between'
}))
const FilterDrawer = ({ open, handleReset, toggle, state, setState ,queries, updateQueries}: Props) => {

    const [value, setValue] = useState<string>('1')
  const {t} = useTranslation();
    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }
    const handleApplyClick = () => {
        updateQueries();
        toggle();
    }
    const handleResetClick = () => {
        handleReset();
        toggle();
    }

    return (
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={toggle}
        sx={{'& .MuiDrawer-paper': {width: '50%', height: '100%', overflow: 'hidden', borderRadius: '12px'}}}
        ModalProps={{keepMounted: true}}
      >
        <Header>
          <Typography variant='h5'>{t("Property Transfer Detail Customization")}</Typography>
          <IconButton
            size='small'
            onClick={toggle}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.25rem'/>
          </IconButton>
        </Header>

        <Divider />

        <Box sx={{p: theme => theme.spacing(0, 0, 6), height: 'calc(100vh - 130px)', overflow: 'hidden'}}>

                <TabContext value={value}>
                    <TabList onChange={handleChange} aria-label='nav tabs example'>
                        <Tab
                            value='1'
                            component='a'
                            label={t("Filters")}
                            href='/filters'
                            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                        />
                      <Tab
                        value='3'
                        component='a'
                        label={t('Print Settings')}
                        href='/settings'
                        onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                      />
                    </TabList>
                  <TabPanel value='1' sx={{p: theme => theme.spacing(2, 3)}}>
                    <Box sx={{height: 'calc(100vh - 130px)', overflow: 'auto'}}>

                      <LedgerSummaryFilter queries={queries} state={state} setState={setState} open={open}  />

                        </Box>
                    </TabPanel>
                  <TabPanel value='3' sx={{p: 0}}>
                    <Box sx={{height: 'calc(100vh - 130px)', overflow: 'auto'}}>
                      <ReportSettings reportName={PropertyTransferDetail} reportTitle={"Property Transfer Detail"} />
                    </Box>
                  </TabPanel>
                </TabContext>
          {
            value == '1' &&
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
              <Button variant='contained' color='success' onClick={handleApplyClick} sx={{mr: 4}}>
                {t("Apply")}
              </Button>
              <Button variant='outlined' onClick={handleResetClick} sx={{mr: 4}}>
                {t("Reset Filter")}
              </Button>

              <Button variant='outlined' color='error' onClick={toggle} sx={{mr: 2}}>
                {t("Cancel")}
              </Button>
            </Box>
          }
        </Box>
      </Drawer>
    )
}

export default FilterDrawer
