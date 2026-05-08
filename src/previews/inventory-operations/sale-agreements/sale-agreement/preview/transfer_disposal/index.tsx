import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";
import Icon from 'src/core/components/icon';
import Link from "next/link";
import {encodeParameters} from "src/core/utils/encrypted-params";
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import DateViewFormat from "src/core/components/date-view";
import {formatCurrency} from "src/core/utils/format";
import Card from "@mui/material/Card";
import {CardHeader} from "@mui/material";



const tableColumns = () => {
  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 90,
      field: 'depreciationMonth',
      sortable: false,
      headerName: 'Month',
      renderCell: (params: GridRenderCellParams) => {
        return params?.row?.depreciationMonth && (
          <DateViewFormat date={params?.row?.depreciationMonth}/>
        )
      }
    },
    {
      flex: 0.175,
      sortable: false,
      minWidth: 120,
      headerName: 'Date',
      field: 'depreciationRunDate',
      renderCell: (params: GridRenderCellParams) => params?.row?.depreciationRunDate && (
        <DateViewFormat date={params?.row?.depreciationRunDate}/>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      sortable: false,
      headerName: 'Period',
      field: 'depreciationFromDate',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {
            params?.row?.depreciationFromDate &&
            <DateViewFormat date={params?.row?.depreciationFromDate}/>
          }

          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            -
          </Typography>

          {
            params?.row?.depreciationToDate &&
            <DateViewFormat date={params?.row?.depreciationToDate}/>
          }

        </Box>
      )
    },
    {
      flex: 0.12,
      minWidth: 140,
      sortable: false,
      field: 'depreciationAmount',
      headerName: 'Amount',
      headerAlign: "right",
      align: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatCurrency(params.row?.depreciationAmount??0, null)}
        </Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 250,
      field: 'accumulatedDepreciation',
      sortable: false,
      headerName: 'Accumulated Depreciation',
      headerAlign: "right",
      align: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatCurrency(params.row?.accumulatedDepreciation??0, null)}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 110,
      field: 'bookValue',
      sortable: false,
      headerName: 'Book Value',
      headerAlign: "right",
      align: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {formatCurrency(params.row?.bookValue??0, null)}
        </Typography>
      )
    }
  ];

  return columns;
}

const tableColumnsTransfer = () => {
  const columns: GridColDef[] = [
    {
      flex: 0.12,
      minWidth: 140,
      sortable: false,
      field: 'employee',
      headerName: 'Employee',
      renderCell: (params: GridRenderCellParams) => params?.row?.toAssignedEmployee && (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.fromAssignedEmployee??""} → {params.row?.toAssignedEmployee??""}
        </Typography>
      )
    },
    {
      flex: 0.12,
      minWidth: 140,
      sortable: false,
      field: 'fromAssignedProject',
      headerName: 'Project',
      renderCell: (params: GridRenderCellParams) => params?.row?.toAssignedProject && (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.fromAssignedProject??""} → {params.row?.toAssignedProject??""}
        </Typography>
      )
    },
    {
      flex: 0.12,
      minWidth: 140,
      sortable: false,
      field: 'fromAssignedBranch',
      headerName: 'Branch',
      renderCell: (params: GridRenderCellParams) => params?.row?.toAssignedBranch && (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.fromAssignedBranch??""} → {params.row?.toAssignedBranch??""}
        </Typography>
      )
    },
    {
      flex: 0.12,
      minWidth: 140,
      sortable: false,
      field: 'fromAssignedDepartment',
      headerName: 'Department',
      renderCell: (params: GridRenderCellParams) => params?.row?.toAssignedDepartment && (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row?.fromAssignedDepartment??""} → {params.row?.toAssignedDepartment??""}
        </Typography>
      )
    }
  ];

  return columns;
}

const TransferDisposalHistory = ({loading, fixedAsset, toggleTransfer, toggleDispose}: {
  loading: boolean
  fixedAsset: any | null,
  toggleTransfer: (id: number) => void,
  toggleDispose: (id: number) => void
}) => {

  const {t} = useTranslation();

  //** States

  return (
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        px: 2,
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        backgroundColor: theme => theme.palette.customColors.tableHeaderBg
      }}>
        <Tooltip title={t("Edit")}>
          <Link
            href={`/business-operations/fixed-assets/edit-assets/${encodeParameters({recno: fixedAsset?.recno})}`}>
            <IconButton sx={{borderRadius: '5px'}}>
              <Icon icon={'tabler:edit'} fontSize={'1.15rem'}/>
              <Typography variant={'body2'} sx={{ml: 1}}>
                {t("Edit")}
              </Typography>
            </IconButton>
          </Link>
        </Tooltip>
        <Divider orientation={'vertical'} sx={{height: '15px'}}/>
        <Tooltip title={t("Download")}>
          <IconButton sx={{borderRadius: '5px'}} onClick={async () => {
            toggleTransfer(fixedAsset?.recno??0);
          }}>
            <Icon icon={'tabler:transfer'} fontSize={'1.15rem'}/>
            <Typography variant={'body2'} sx={{ml: 1}}>
              {t("Transfer")}
            </Typography>

          </IconButton>
        </Tooltip>
        <Divider orientation={'vertical'} sx={{height: '15px'}}/>
        <Tooltip title={t("Print")}>
          <IconButton sx={{borderRadius: '5px'}} onClick={() => {
            toggleDispose(fixedAsset?.recno??0);
          }}>
            <Icon icon={'tabler:alert-circle'} fontSize={'1.15rem'}/>
            <Typography variant={'body2'} sx={{ml: 1}}>
              {t("Dispose")}
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{height: `calc(100vh - 100px)`, position: 'relative', overflow: 'auto', width: '100%'}}>

        <Card sx={{mt: 4, mx: 3}}>
          <CardHeader title={"Disposal History"} sx={{p: theme => theme.spacing(2,4)}} />
          <DataGrid
            autoHeight
            pagination
            disableRowSelectionOnClick
            rows={fixedAsset?.depreciationHistory??[]}
            getRowId={(row) => row.depreciationRunDate}
            rowCount={(fixedAsset?.depreciationHistory??[]).length}
            columnHeaderHeight={30}
            columns={tableColumns()}
            paginationMode='client'
            pageSizeOptions={[10]}
          />
        </Card>


        <Card sx={{mt: 10, mx: 3}}>
          <CardHeader title={"Transfer History"} sx={{p: theme => theme.spacing(2,4)}} />
          <DataGrid
            autoHeight
            pagination
            disableRowSelectionOnClick
            rows={(fixedAsset?.transferHistory??[]).map((item:any, index:any) => ({ ...item, uid: index }))}
            getRowId={(row) => row.uid}
            rowCount={(fixedAsset?.transferHistory??[]).length}
            columnHeaderHeight={30}
            columns={tableColumnsTransfer()}
            paginationMode='client'
            pageSizeOptions={[10]}
          />
        </Card>

      </Box>


    </Box>
  );
}

export default TransferDisposalHistory;
