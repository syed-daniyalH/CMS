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
import CustomerListTable from "./table/CustomerListTable";
import {Chip} from "@mui/material";

interface Props {
    state:any,
    queries:any,
    selected_columns?: any[];
    data: any[];
    totalRows:number,
    paginationModel:any
    setPaginationModel:any
    sumData:any
    filters:any
    clearAll : ()=> void
}

const CustomerListReport = ({clearAll,filters,state, queries, data, totalRows, paginationModel, setPaginationModel, selected_columns, sumData}: Props) => {
    const {t} = useTranslation();
    const {user} = useAuth();

    return (
      <Card sx={{mt: '10px', height: `calc(100vh  - 135px)`, overflow: 'hidden'}}>
            <CardHeader
                title={
                    <Stack direction='column' spacing={2}>
                      <Typography variant='h6' sx={{fontWeight: 200, color:theme => theme.palette.customColors.textColor}}>
                            {t(`${user?.tenantDetails[((user?.tenantDetails??[]).findIndex(e => e.tenantId === user?.loginTenantId))]?.organizationName??"No Name"}`)}
                        </Typography>
                      <Typography variant='body1' sx={{fontWeight: 600, fontSize:"18px", color:theme => theme.palette.customColors.textColor}}>
                            {t("Customer Detail List")}
                        </Typography>
                      {/*<Typography variant='body2' sx={{ color:theme => theme.palette.customColors.textColor}}>*/}
                      {/*      {formatDate(new Date(queries?.fromDate))} {t("to")} {formatDate(new Date(queries?.toDate))}*/}
                      {/*  </Typography>*/}
                    </Stack>
                }
                titleTypographyProps={{ align: 'center'}}
            />
            <Stack direction='row' spacing={2}sx={{p:2}}>


                { filters?.accountName !== null  && filters?.accountName !== undefined && (
                    <Chip
                        label={`Account : ${filters?.accountName } `}
                        variant="outlined"
                        size="small"

                        onDelete={clearAll}
                        style={{ marginTop: '10px' }}
                    />
                )}
            </Stack>

            <CustomerListTable filters={filters} sumData={sumData} queries={queries} selected_columns={selected_columns} state={state} data={data} totalRows={totalRows} paginationModel={paginationModel} setPaginationModel={setPaginationModel}   />

        </Card>
    )
}


export default CustomerListReport
