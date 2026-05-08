// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled, useTheme} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";


// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {InventorySerialsData} from "./index";
import axios from "axios";
import toast from "react-hot-toast";
import CustomBackdrop from "../../core/components/loading";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import Barcode from "react-barcode";
import {hexToRGBA} from "../../core/utils/hex-to-rgba";


interface Props {
  title?: string | null
  open: boolean
  data: InventorySerialsData | null
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const tableColumns = (t: any, handleDelete: any) => {

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 180,
      editable: false,
      field: 'serialCode',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      headerName: t('Serials'),
      renderCell: (params: GridRenderCellParams) => {
        let row: any = params.row;
        return (
          <Box sx={{width: '100%'}}>
            <Barcode value={row?.serialCode??""} height={25} fontSize={8}/>
          </Box>
        )
      }
    },
    {
      flex: 0.05,
      minWidth: 80,
      editable: false,
      field: 'action',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      align: "right",
      headerAlign: 'right',
      headerName: t('Action'),
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{width: '100%', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
            <IconButton
              size='small'
              onClick={() => handleDelete(params.row)}
              sx={{
                p: '0.3rem',
                borderRadius: 1,
                color: 'common.white',
                backgroundColor: 'error.main',
                '&:hover': {
                  backgroundColor: theme => hexToRGBA(theme.palette.error.main, 0.6)
                }
              }}
            >
              <Icon icon='tabler:trash' fontSize='1.1rem'/>
            </IconButton>
          </Box>
        )
      }
    }
  ];

  return columns;
}


const ViewSerialsDialog = ({open, toggle, title, data } : Props) => {

  const {t} = useTranslation();
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.up('md'));
  const [loading, setLoading] = useState<boolean>(false);
  const [serials, setSerials] = useState<InventorySerialsData[]>([]);

  useEffect(() => {
      let isActive = true;

        if(isActive && data) {
          getAllSerials().then(() => console.log("loaded!"));
        }


      return () => {
        isActive = false;
      }
    }, [data])

  const getAllSerials = async () => {
    try {
      setLoading(true);
      let response = await axios.get(`/Defaults/GetDocumentItemSerialsList/${data?.documentRecno}/${data?.documentLineRecno}/${data?.itemId}/${data?.documentSource}/${data?.source}`)
      if(response?.data?.succeeded) {
        setSerials(response?.data?.data?.list??[]);
      }
    } catch (e: any) {
      let message = e?.response?.data?.message??e?.response?.message??e?.message??"";
      toast.error(`Unable to load serials.\n${message}`)
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (item: InventorySerialsData) => {
    setLoading(true);

    try {

      let response: any = await axios.delete(`/Defaults/RemoveDocumentItemSerialsList/${item.documentRecno}/${item.documentLineRecno}/${item.itemId}/${item.documentSource}/${item.source}?id=${item.id}`)
      let res = response?.data;
      if(res?.succeeded) {
        toast.success(`Serials deleted successfully.`);
        setSerials(serials.filter((e) => e.id !== item?.id));
      } else {
        let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
        toast.error(`Error while deleting serials!. ${message}`)
      }
    } catch (res: any) {
      let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Error while deleting serials!. ${message}`)
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      open={open}
      anchor='top'
      variant={'temporary'}
      onClose={toggle}
      transitionDuration={1000}
      sx={{
        '& .MuiDrawer-paper': {
          alignItems: 'center',
          backgroundColor: '#00000000',
          marginTop: 0,
        }
      }}
      ModalProps={{keepMounted: true}}
    >
      <Card sx={{width: hidden ? '35%' : '98%'}}>
        <Header sx={{px: 4, py: 1}}>
          <Typography variant='subtitle1'>{t(title??"Confirmation")}</Typography>
          <IconButton
            size='small'
            onClick={() => toggle()}
            sx={{
              p: '0.3rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.1rem'/>
          </IconButton>
        </Header>

        <Divider/>

        <Box sx={{p: theme => theme.spacing(4, 6, 16), position: 'relative', maxHeight: '90vh', overflow: 'auto'}}>

          <Box sx={{display: 'flex', flexDirection: 'column', border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '3px'}}>
            <DataGrid
              autoHeight
              columnHeaderHeight={35}
              rowHeight={70}
              pagination
              paginationMode={'client'}
              pageSizeOptions={[10, 25, 50]}
              getRowId={(row: InventorySerialsData) => (row?.id??-1)}
              columns={tableColumns(t, handleDelete)}
              rows={serials}
            />
          </Box>

        </Box>
        <Box sx={{
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
          width: hidden ? '35%' : '98%',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: "end",
          p: 2,
          backgroundColor: theme => theme.palette.customColors.tableHeaderBg
        }}>
          <Button size={'small'} variant='tonal' color={'secondary'} onClick={() => toggle()}>
            {t("Close")}
          </Button>
        </Box>
      </Card>
      <CustomBackdrop open={loading} />
    </Drawer>
  )
}

export default ViewSerialsDialog
