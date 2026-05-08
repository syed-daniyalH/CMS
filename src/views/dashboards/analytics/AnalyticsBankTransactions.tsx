// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Custom Components Imports
import Avatar from "../../../core/components/mui/avatar";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {getDateRange, kFormatter} from "../../../core/utils/format";
import {useAuth} from "../../../hooks/useAuth";
import {getBankClosingBalances} from "../../../store/dashboard";
import {useAppDefaults} from "../../../hooks/useAppDefaults";
import {useTranslation} from "react-i18next";

interface DataType {
  coaId: number
  name: string
  actualBalanceAmount: number
  actualTransactionBalanceAmount: number
  trend?: 'positive' | 'negative'
}

const AnalyticsBankTransactions = () => {

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dashboard)
  const { user } = useAuth();
  const { defaultCurrency } = useAppDefaults();
  const { t } = useTranslation();


  useEffect(() => {
      let isActive = true;

        if(isActive) {
          let { fromDate, toDate } = getDateRange(8, user);
          dispatch(
            getBankClosingBalances({
              FromDate: fromDate,
              ToDate: toDate
            })
          );

        }


      return () => {
        isActive = false;
      }
    }, [dispatch])


  return (
    <Card sx={{height: '400px', maxHeight: '450px', display: 'flex', flexDirection: 'column'}}>
      <CardHeader title={<Typography variant={'h4'}>{t('Bank Balances')}</Typography>} sx={{p: 3, mb: 2,backgroundColor: 'customColors.tableHeaderBg'}} />

      <CardContent sx={{flex: 1, overflow: 'auto'}}>
        {(store.bank_data??[]).map((item: DataType, index: number) => {
          return (
            <Box
              key={item.name}
              sx={{
                display: 'flex',
                // '& img': { mr: 4 },
                alignItems: 'center',
                mb: index !== (store.bank_data??[]).length - 1 ? 4.5 : undefined
              }}
            >
              <Avatar skin='light'
                      variant='circular'
                      color={index % 2 === 0 ? 'success' : index % 3 === 0 ? 'warning' : 'info'}
                      sx={{width: 34, height: 34, mr: 4, fontSize: '3rem' }}>
                <Icon icon={'tabler:wallet'} />
              </Avatar>
              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6'>{item.name}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    '& svg': { mr: 1 },
                    alignItems: 'center',
                    '& > *': { color: 'text.primary' }
                  }}
                >
                  <Typography variant='h6' sx={item.actualBalanceAmount < 0 ? {color: 'error.main' } : {}}>{defaultCurrency?.code??""} {kFormatter(item.actualBalanceAmount)}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnalyticsBankTransactions
