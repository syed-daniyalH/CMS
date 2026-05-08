// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Util Import
import {useTranslation} from "react-i18next";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {useEffect, useState} from "react";
import {getNewJoiners} from "../../../store/dashboard";
import {useAuth} from "../../../hooks/useAuth";

//@ts-ignore
import dateFormat from 'dateformat';
import {globalDateFormat} from "../../../@core/utils/format";


type dataTypes = {
  icon: string
  departmentId: number
  employeeId: number
  lastName: string
  name: string
  departmentName: string
  joinDate: string
}


const HCMTopJoiners = () => {
  // ** Hook
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const [data, setData] = useState<dataTypes[]>([]);
  const { t } = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      dispatch(getNewJoiners({}))
    }


    return () => {
      isActive = false;
    }
  }, [dispatch])


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      setData(store.new_joiners??[]);
    }


    return () => {
      isActive = false;
    }
  }, [store.new_joiners])


  return (
    <Card sx={{mt: 1}}>
      <CardHeader title={t('New Joiners')} subheader={t("New joiners employees.")} sx={{px: 3, py: 2}}/>
      <Divider />
      <CardContent>
        {
          store.loadingState.getSupplierStats &&
          <Box sx={{width: '100%', height: '20vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <LinearProgress variant={'indeterminate'} sx={{width: '20%', height: 3}} />
            <Typography variant={'caption'} sx={{mt: 3}}>
              {t("loading...")}
            </Typography>
          </Box>
        }

        {
          !store.loadingState.getSupplierStats &&
          <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: 6}}>
            <Box sx={{overflowX: 'auto', border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '8px'}}>
              <Table>
                <TableHead sx={{p: 0}}>
                  <TableRow sx={{backgroundColor: 'customColors.tableHeaderBg'}}>
                    <TableCell colSpan={3} sx={{p: 2}}>
                      <Typography sx={{fontSize: '0.7rem !important', ml: -4}} variant={'h6'}
                                  color='text.primary'>{t("Name")}</Typography>
                    </TableCell>
                    <TableCell colSpan={1} align={'left'} sx={{p: 2}}>
                      <Typography sx={{fontSize: '0.7rem !important'}}
                                  variant={'h6'}>{t("Department")}</Typography>
                    </TableCell>

                    <TableCell colSpan={1} align={'right'} sx={{p: 2}}>
                      <Typography sx={{fontSize: '0.7rem !important', mr: -4}} variant={'h6'} color='text.primary'>
                        {t("Join Date")}
                      </Typography>
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={3} style={{padding: '8px'}}>
                        <Box sx={{p: 0, display: 'flex', alignItems: 'center'}}>
                          <Typography variant={'subtitle2'} color='text.primary'>{`${item.name} ${item.lastName??""}`}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell colSpan={1} align={'left'} style={{padding: '8px'}}>
                        <Typography variant={'subtitle2'}>{item.departmentName}</Typography>
                      </TableCell>
                      <TableCell colSpan={1} align={'right'} style={{padding: '8px'}}>
                        <Typography variant={'subtitle2'} color='text.primary'>
                          {dateFormat(new Date(item.joinDate??(new Date())), (user?.dateFormat??globalDateFormat).toLowerCase())}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        }
      </CardContent>
    </Card>
  )
}

export default HCMTopJoiners
