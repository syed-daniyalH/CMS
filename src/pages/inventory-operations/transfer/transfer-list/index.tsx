// ** Next Import
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Typography from '@mui/material/Typography'
import { Box, Chip, Divider } from '@mui/material'

// ** Demo Components Imports
import TableTransferList from 'src/views/inventory-operations/transfer/transfer-list/TableTransferList'
import { useRef, useState } from 'react'
import Icon from 'src/@core/components/icon'
import CustomBackdrop from 'src/@core/components/loading'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useRouter } from 'next/navigation'
import { encodeParameters } from 'src/@core/utils/encrypted-params'
import Collapse from '@mui/material/Collapse'
import CustomTextField from '../../../../@core/components/mui/text-field'
import IconButton from '@mui/material/IconButton'
import { hexToRGBA } from '../../../../@core/utils/hex-to-rgba'
import Card from '@mui/material/Card'
import {useRouter as useQRouter} from "next/router";
import { FilterListObj } from '../../../../context/types'

const SalePlansList = () => {
  const { t } = useTranslation()
  const inputRef = useRef();
  const [openFilter, setOpenFilter] = useState<boolean>(false)

  const [value, setValue] = useState<string>('')
  const [showSearch, setShowSearch] = useState(false)
  const [searchData, setSearchData] = useState<any>({PageNo: 1, PageSize: 10})
  const [filterList, setFilterList] = useState<FilterListObj[]>([])
  const store = useSelector((state: RootState) => state.transfer)


  const router = useRouter()
  const qRouter = useQRouter();
  const toggleFilter = () => {
    setOpenFilter(!openFilter)
  }

  const onNewClick = (e: any, index: number) => {
    e.preventDefault()
    switch (index) {
      case 0:
        router.push(`/inventory-operations/sale-plans/add-sales`)
        break
      case 1:
        router.push(`/system-import?query=${encodeParameters({ url: '/Customers', type: 'Customer' })}`)
        break
    }
  }
  const doSearch = (data: any) => {
    console.log(data,"datadata")
    setSearchData({...searchData, ...data})

    qRouter.replace({
      pathname: qRouter.pathname,
      query: {
        ...qRouter.query,
        filters: encodeParameters(
          {
            ...searchData,
            ...data,
            PageNo: parseInt(`${1}`)
          }
        )
      }
    }).then(r => console.log(r));
  }
  const clearSearch = () => {
    setSearchData({PageSize: 10, PageNo: 1});
    qRouter.replace({
      pathname: qRouter.pathname,
      query: {
        ...qRouter.query,
        filters: encodeParameters(
          {

            PageNo: 1,
            PageSize: 10
          }
        )
      }
    }).then(r => console.log(r));
  }
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0 }}>
      <Box
        sx={{
          py: 1,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'customColors.trackBg'
        }}
      >
        <Typography variant={'h5'}>{t('Transfer Properties')}</Typography>

        <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
          <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1}}>
            <Typography variant={'body2'} sx={{color: 'primary.main', mr: 2, display: filterList.length > 0 ? 'flex' : 'none'}}>
              {t("Applied Filters")}:
            </Typography>
            {
              filterList.map((fil, index: number) => {
                const label = `${fil.title}: ${fil.value}`;
                const truncated = label.length > 30 ? label.slice(0, 30) + "…" : label;

                return (
                  <Chip key={index} size={'small'} label={truncated} variant='outlined' onDelete={() => {
                    doSearch({...searchData, [fil.name]: undefined})
                  }} sx={{mr: 1}} />
                )
              })
            }

            {
              filterList.length > 1 &&
              <Chip color={'error'} size={'small'} label={`Clear All`} variant='outlined' onDelete={() => {
                clearSearch()
              }} sx={{mr: 1}} />
            }

          </Box>
          <Collapse in={showSearch} orientation="horizontal" sx={{flexGrow: 1}}>
            <CustomTextField
              inputRef={inputRef}
              fullWidth
              autoFocus
              value={value}
              placeholder="Press Enter to Search…"
              onChange={e => setValue(e.target.value ?? '')}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  doSearch({...searchData, PropertyNo: value});
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{mr: 2, display: 'flex'}}>
                    <Icon fontSize="1.25rem" icon="tabler:search"/>
                  </Box>
                ),
                endAdornment: (
                  <IconButton size="small" title="Clear" aria-label="Clear" onClick={() => {
                    setValue('')
                    setShowSearch(prev => !prev)
                    if((searchData.PropertyNo??"").length > 0) {
                      doSearch({...searchData, PropertyNo: ''});
                    }
                  }}>
                    <Icon fontSize="1.25rem" icon="tabler:x"/>
                  </IconButton>
                )
              }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root > svg': {mr: 2}
              }}
            />
          </Collapse>

          <Collapse in={!showSearch} orientation="horizontal" sx={{flexGrow: 1}}>
            <IconButton
              size="small"
              onClick={() => setShowSearch(prev => !prev)}
              sx={{
                p: '0.375rem',
                borderRadius: 1,
                color: 'text.primary',
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: theme => hexToRGBA(`${theme.palette.secondary.main}`, 0.76)
                }
              }}
            >
              <Icon icon="tabler:search" fontSize="1.25rem"/>
            </IconButton>
          </Collapse>

          <IconButton
            size="small"
            onClick={toggleFilter}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'common.white',
              ml: 2,
              backgroundColor: 'warning.main',
              '&:hover': {
                backgroundColor: theme => hexToRGBA(`${theme.palette.warning.main}`, 0.76)
              }
            }}
          >
            <Icon icon="tabler:filter-search" fontSize="1.25rem"/>
          </IconButton>

        </Box>
      </Box>

      <Divider />
      <TableTransferList toggleFilter={toggleFilter} openFilter={openFilter}  searchData={searchData}
                         setSearchData={setSearchData}  setFilterList={setFilterList}/>

      <CustomBackdrop open={store.loadingState.getData ?? false} />
    </Card>
  )
}

SalePlansList.contentHeightFixed = true

SalePlansList.acl = {
  action: 'read',
  subject: 'SalePlans'
}

export default SalePlansList
