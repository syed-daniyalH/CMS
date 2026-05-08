// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// ** Custom Components Imports
import Icon from "src/core/components/icon";
import {useTranslation} from "react-i18next";
import SalePlansFormCard from "src/views/inventory-operations/sale-plans/sales-form/SalePlansFormCard";


// ** Styled Component
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'
import {useRouter} from "next/navigation";
import AttachmentsButton from "src/components/attachments/AttachmentsButton";
import {salePlansFormType} from "src/core/utils/form-types";
import {useSalePlans} from "../context/useSalePlans";
import toast from "react-hot-toast";
import {getData} from "src/store/inventory-operations/customers";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import CustomBackdrop from "src/core/components/loading";
import FormSaveButton from "src/components/form-save-button";
import {saveCloseKey, saveNewKey} from "src/core/utils/translation-file";

interface Props {
  recno?: number,
  callback?: (data: any) => void | null,
  toggle?: () => void | null
}

const SalePlansForm = ({ recno, callback, toggle }: Props) => {
  // ** State
  const {t} = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { storeSalePlans, resetSalePlansData, loadSalePlansData } = useSalePlans();

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.salePlans)

  const router = useRouter();


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(recno) {
        loadSalePlansData(recno);
      }
    }

    return () => {
      isActive = false;
    }
  }, [recno])

  const onSubmit = async (e: any, index: number) => {
    e.preventDefault();

    setLoading(true);
    try {
      let res: any = await storeSalePlans(files);
      console.log(res,"rresresreses")
      if(res?.succeeded) {
        toast.success("Sale Plans Saved Successfully.");

        dispatch(getData({
          ...store.params
        }))

        if(index === 1) {
          resetSalePlansData();
        } else {
          if (!!toggle) {
            toggle();
            if (!!callback) {
              callback(res?.data);
            }
          } else {
            router.back();
          }
        }
      } else {
        let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
        toast.error(`Error while saving sale plan!. ${message}`)
      }
    } catch (res: any) {

      let message : any = res?.response.data?.Message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Error while saving sale plan!. ${message}`)
    }
    setLoading(false);
  }

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '100%' }, position: 'relative', height: 'calc(100vh - 50px)', overflow: 'hidden' }}>

      <Box sx={{p: 2, overflow: 'auto', height: 'calc(100vh - 105px)'}}>
        <SalePlansFormCard toggle={toggle} />
      </Box>


      <Box sx={{position: 'absolute', bottom: -10, zIndex: '1', width: '100%', backgroundColor: theme => theme.palette.common.black, borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', mb: 2, px: 2, py: 3, display: 'flex', justifyContent: 'space-between'}}>
        <Box>
          <Button onClick={() => (!!toggle ? toggle() : router.back())} fullWidth variant='contained' color={'error'} size='small' sx={{ml: 2, '& svg': { mr: 2 }}}>
            <Icon fontSize='1.125rem' icon='tabler:x' />
            {t("Cancel")}
          </Button>
        </Box>

        <AttachmentsButton files={files} setFiles={setFiles} formType={salePlansFormType} recno={recno} />

        <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
          <FormSaveButton options={recno ?  [saveCloseKey] : [saveCloseKey, saveNewKey]} onClick={(option: number, event: any) => onSubmit(event, option)} />
        </Box>
      </Box>

      <CustomBackdrop open={loading} />

    </DatePickerWrapper>
  )
}
export default SalePlansForm
