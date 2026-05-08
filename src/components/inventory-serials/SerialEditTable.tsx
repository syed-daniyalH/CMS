// ** React imports
import React, {useEffect, useState} from "react";


// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  useGridApiRef
} from '@mui/x-data-grid'

// ** Data Import
import {GridStartRowEditModeParams} from "@mui/x-data-grid/models/api/gridEditingApi";

// ** Translation
import {useTranslation} from "react-i18next";
import {CardHeader} from "@mui/material";
import Typography from "@mui/material/Typography";
import SaleItemSelector from "src/core/dropdown-selectors/SaleItemSelector";
import {InventorySerialsData} from "./index";
import SerialDropdownSelector from "../../core/dropdown-selectors/SerialsDropdownSelector";
import Icon from "../../core/components/icon";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import axios from "axios";
import CustomBackdrop from "../../core/components/loading";
import Divider from "@mui/material/Divider";
import AddSerialsDialog from "./AddSerialsDialog";
import ViewSerialsDialog from "./ViewSerialsDialog";

const tableColumns = (handleSerialData: any, t: any, setRowHeight: any) => {

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 180,
      editable: false,
      field: 'itemName',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      headerName: t('Products/Services'),
      renderCell: (params: GridRenderCellParams) => {
        let row: InventorySerialsData = params.row;
        return (
          <Box sx={{width: '100%', px: 2, whiteSpace: 'normal', wordWrap: 'break-word'}}>
            <SaleItemSelector useListObject selected_value={row.itemId ?? null} handleChange={(_value) => {
              console.log('Item Selected');
            }} preview props={{label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus}} noBorder/>
          </Box>
        )
      }
    },
    {
      flex: 0.05,
      minWidth: 80,
      editable: false,
      field: 'qty',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      headerName: t('Quantity'),
      renderCell: (params: GridRenderCellParams) => {
        let row: InventorySerialsData = params.row;
        return (
          <Box sx={{width: '100%', px: 2, display: 'flex', flexDirection: 'column'}}>
            <Typography>
              {row?.lineTotalQty}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'serialCode',
      minWidth: 220,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: t("Serials"),
      renderEditCell: (params: GridRenderCellParams) => {
        let row: InventorySerialsData = params.row;

        return params.hasFocus ? (
            <SerialDropdownSelector data={row?.serialCode??[]} setRowHeight={(value: number) => {
              setRowHeight((prev: any) => ({ ...prev, [params.id]: value }));
            }} handleChange={(value: string[]) => {
              handleSerialData({serialCode: value}, row?.documentLineRecno)
            }}/>
          ) :
          <Typography sx={{whiteSpace: 'normal', wordWrap: 'break-word', width: '100%'}}>
            {
              (params?.row?.serialCode??[]).join(", ")
            }
          </Typography>
      },
      renderCell: (params) => (
        <Typography sx={{whiteSpace: 'normal', wordWrap: 'break-word', width: '100%'}}>
          {
            (params?.row?.serialCode??[]).join(", ")
          }
        </Typography>
      ),
    }
  ];

  return columns;
}

interface Props {
  serialDetails: InventorySerialsData[]
  handleSerialData: (data: any, documentLineRecno: number) => void
}

interface AddDataType {
  open: boolean
  data: InventorySerialsData | null
}

const SerialEditTable = ({serialDetails, handleSerialData} : Props) => {

  // ** States
  const {t} = useTranslation();


  const [details, setDetails] = useState<InventorySerialsData[]>([]);
  const [rowHeight, setRowHeight] = useState<any>({});
  const [addData, setAddData] = useState<AddDataType>({open: false, data: null});
  const [viewData, setViewData] = useState<AddDataType>({open: false, data: null});
  const [loading, setLoading] = useState<boolean>(false);

  const tableRef = useGridApiRef();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      setDetails([...(serialDetails??[])]);
    }

    return () => {
      isActive = false;
    }
  }, [serialDetails])

  const toggleAddData = () => setAddData({open: false, data: null});

  const toggleViewData = () => setViewData({open: false, data: null});

  const handleCellEditStart = (params: GridRowParams) => {
    handleSerialData({isEditing: true}, parseInt(`${params.id}`));
  };

  const handleCellEditCommit = (params: any, event: any) => {

    const currentRowIndex = (serialDetails??[]).findIndex((row: any) => row.documentLineRecno === params.id);

    if(params.id > -1) {
      handleSerialData({ isEditing: false }, params.id);
    }

    if (event.key === 'Tab' || event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();
      try {
        const nextRow = serialDetails[currentRowIndex + 1];
        if (nextRow) {
          handleSerialData({isEditing: true}, currentRowIndex + 1);

          tableRef.current.startRowEditMode({id: nextRow.documentLineRecno, fieldToFocus: 'serialCode'} as GridStartRowEditModeParams);
        }
      } catch (e) {
        console.log(e);
      }
    }

    return false;
  };

  const onSubmit = async (event: any) => {
      event.preventDefault();
      setLoading(true);

      try {
        let filteredDetails = serialDetails.filter((obj) => obj.serialCode.length > 0);

        let response: any = await axios.post('/Defaults/InsertBulkInventorySerials', filteredDetails)
        let res = response?.data;
        if(res?.succeeded) {
          let unAddedErrorList = res?.data?.unAddedErrorList??[];

          if(unAddedErrorList.length > 0) {
            toast.error(`Serials Partially Saved.\n *${unAddedErrorList.join("\n*")}`);
          } else {
            toast.success(`Serials Saved Successfully.`);
          }
        } else {
          let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
          toast.error(`Error while serials!. ${message}`)
        }
      } catch (res: any) {
        let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
        toast.error(`Error while creating serials!. ${message}`)
      } finally {
        setLoading(false);
      }
  }

  return (
    <Card>
      <CardHeader
        sx={{
          width: '100%',
          display: 'flex',
          p: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`]
        }}
      />
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
        {/*<DataGrid
          autoHeight
          apiRef={tableRef}
          hideFooter
          columnHeaderHeight={35}
          getRowHeight={({ id }) => rowHeight[id] || 50}
          getRowId={(row: InventorySerialsData) => row.documentLineRecno}
          onCellKeyDown={(_params, event) => {
            if(event.key === 'Enter') {
              event.stopPropagation();
              event.preventDefault();
            }
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              border: theme => `0.05px solid ${theme.palette.secondary.light}`,
              '&:not(.MuiDataGrid-cellCheckbox)': {
                paddingLeft: 2,
                paddingRight: 2,
                '&:first-of-type': {
                  paddingLeft: 0,
                  paddingRight: 0,
                }
              }
            }
          }}
          onCellClick={(params) => {
            if(params.field !== "Action") {
              if(!params.row.isEditing) {
                handleSerialData({ isEditing: true }, params.row.documentLineRecno);
                tableRef.current.startRowEditMode({id: params.id})
              }
            }
          }}
          columns={tableColumns(handleSerialData, t, setRowHeight)}
          rows={details}
          onRowEditStop={handleCellEditCommit}
          onRowEditStart={handleCellEditStart}
          editMode="row"
        />*/}

        <Box sx={{display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', px: 2, py: 1.5, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '8px', backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
          <Typography variant={'h6'}>
            {t("Details")}
          </Typography>
          <Typography variant={'h6'}>
            {t("Actions")}
          </Typography>
        </Box>
        {
          details.map((item: InventorySerialsData, index: number) => {
            return (
              <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%'}} key={`${item?.itemId}-${index}`}>
                <Box sx={{display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between', width: '100%'}}>
                  <Box sx={{display: 'flex', alignItems: 'start', flexDirection: 'column'}}>
                    <SaleItemSelector useListObject selected_value={item.itemId ?? null} handleChange={(_value) => {
                      console.log('Item Selected');
                    }} preview props={{label: null, sx: { mb: 0 }}} variant={'h6'} noBorder/>
                    <Typography variant={'body2'}>
                      {t("Quantity")}: {item?.lineTotalQty}
                    </Typography>
                  </Box>
                  <Box sx={{display: 'flex', justifyContent: 'end', flexDirection: 'column', alignItems: 'center'}}>
                    <Button onClick={() => setViewData({open: true, data: item})} size={'small'} variant={'outlined'} sx={{mb: 2}} color={'primary'} startIcon={<Icon icon={'tabler:eye'} />}>
                      {t("View Serials")}
                    </Button>
                    <Button onClick={() => setAddData({open: true, data: item})} size={'small'} variant={'outlined'} color={'success'} startIcon={<Icon icon={'tabler:plus'} />}>
                      {t("Add Serials")}
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{width: '100%', mt: 2}} />
              </Box>
            )
          })
        }

        {
          addData.open &&
          <AddSerialsDialog open={addData.open} toggle={toggleAddData} title={"Add Document Serials"} data={addData.data} />
        }

        {
          viewData.open &&
          <ViewSerialsDialog open={viewData.open} toggle={toggleViewData} title={"View Document Serials"} data={viewData.data} />
        }

      </Box>

      <CustomBackdrop open={loading} />
    </Card>
  )
}

export default SerialEditTable
