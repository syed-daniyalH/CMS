//** Third party imports
import {useTranslation} from "react-i18next";

// ** Hooks
import {useAuth} from "src/hooks/useAuth";

// ** Utils
import {formatDate} from "src/core/utils/format";

// ** MUI imports
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// ** Custom imports
import ExpectedIncomeTable from "./table/ExpectedIncomeTable";
import {Chip} from "@mui/material";
import { useEffect, useState } from 'react'

interface Props {
    state:any,
    queries:any,
    selected_columns?: any[];
    data: any[];
    totalRows:number,
    paginationModel:any
    setPaginationModel:any

    filters:any
  updateQueries:any
    clearAll : ()=> void
  setState : ()=> void
}

const ExpectedIncome = ({clearAll,filters,state, queries, data, totalRows, paginationModel, setPaginationModel, selected_columns,setState,updateQueries,handleReset}: any) => {
    const {t} = useTranslation();
    const {user} = useAuth();
  const [isUpdate, setIsUpdate] = useState(false)
  const filterLabels:any = {

    status: "Status",
    Prefrences: "Prefrence",
    Type: "Type",
    Floor: "Floor",


  };

  const clearFilter = (filterName: string) => {
    const updatedState = { ...state };
    switch (filterName) {
      case 'status':
        updatedState.status = null;
        updatedState.statusId = null;

        break;
      case 'Prefrences':

        updatedState.Prefrences = null;
        updatedState.prefrenceId = null;

        break;
      case 'Type':
        updatedState.Type =  null;
        updatedState.propertyTypeId = null;

        break;
      case 'Floor':
        updatedState.Floor =  null;
        updatedState.floorId = null;

      default:
        break;
    }
    setState(updatedState);
    setIsUpdate(true)
  };
  useEffect(()=>{
    if(isUpdate){
      updateQueries();
      setIsUpdate(false)
    }
  },[state])
    return (
      <Card sx={{mt: '10px', height: `calc(100vh  - 135px)`, overflow: 'hidden'}}>
            <CardHeader
                title={
                    <Stack direction='column' spacing={2}>
                      <Typography variant='h6' sx={{fontWeight: 200, color:theme => theme.palette.customColors.textColor}}>
                            {t(`${user?.tenantDetails[((user?.tenantDetails??[]).findIndex(e => e.tenantId === user?.loginTenantId))]?.organizationName??"No Name"}`)}
                        </Typography>
                      <Typography variant='body1' sx={{fontWeight: 600, fontSize:"18px", color:theme => theme.palette.customColors.textColor}}>
                            {t("Expected Income")}
                        </Typography>
                      <Typography variant='body2' sx={{ color:theme => theme.palette.customColors.textColor}}>
                            {formatDate(new Date(queries?.fromDate))} {t("to")} {formatDate(new Date(queries?.toDate))}
                        </Typography>
                    </Stack>
                }
                titleTypographyProps={{ align: 'center'}}
            />
        <Stack direction='row' spacing={2} sx={{p:2}}>
          {Object.keys(filters).map(
            (key) =>
              filters[key] &&
              filters[key] !== "All" &&
              filters[key]  !== undefined && filters[key]  !== null && (
                <Chip
                  key={key}
                  label={`${filterLabels[key]}: ${filters[key]}`}
                  variant="outlined"
                  size="small"
                  onDelete={() => clearFilter(key)}
                  style={{ marginTop: "10px" }}
                />
              )
          )}
          {Object.keys(filters).length > 0  && filters?.name !== "All" &&  (
            <Chip
              label={`clear All `}
              variant="outlined"
              size="small"
              color={'error'}
              onDelete={handleReset}
              style={{ marginTop: '10px' }}
            />
          )}
        </Stack>


        <ExpectedIncomeTable filters={filters} queries={queries} selected_columns={selected_columns} state={state} data={data} totalRows={totalRows} paginationModel={paginationModel} setPaginationModel={setPaginationModel}   />

        </Card>
    )
}


export default ExpectedIncome
