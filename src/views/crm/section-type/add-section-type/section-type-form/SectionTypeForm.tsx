// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// ** Custom Components Imports
import Icon from "src/core/components/icon";
import { useTranslation } from "react-i18next";
import ReceiptFormCard from "src/views/crm/section-type/add-section-type/section-type-form/SectionTypeFormCard";


// ** Styled Component
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'
import { useRouter } from "next/navigation";
import AttachmentsButton from "src/components/attachments/AttachmentsButton";
import { receiptFormType } from "src/core/utils/form-types";
import { useSectionType } from "../context/useSectionType";
import toast from "react-hot-toast";
import { getData } from "src/store/crm/section-type/index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import CustomBackdrop from "src/core/components/loading";
import FormSaveButton from "src/components/form-save-button";
import { saveCloseKey, saveNewKey } from "src/core/utils/translation-file";

interface Props {
  recId?: string,
  callback?: (data: any) => void | null,
  toggle?: () => void | null
}

const SectionTypeForm = ({ recId, callback, toggle }: Props) => {
  // ** State
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { storeSectionType, resetSectionTypeData, loadSectionType } = useSectionType();
  const dispatch = useDispatch<AppDispatch>()

  const router = useRouter();

  useEffect(() => {
    if (recId) {
      loadSectionType(recId);
    } else {
      resetSectionTypeData();
    }
  }, [recId]);

  const onSubmit = async (e: any, index: number) => {
    e.preventDefault();

    setLoading(true);
    try {
      let res: any = await storeSectionType();
      if (res) {
        // Redux store refresh
        dispatch(getData({ PageNo: 1, PageSize: 10 }))

        if (index === 1) {
          resetSectionTypeData();
        } else {
          if (!!toggle) {
            toggle();
            if (!!callback) {
              callback(res);
            }
          } else {
            router.back();
          }
        }
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  }

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '100%' }, position: 'relative', height: 'calc(100vh - 50px)', overflow: 'hidden' }}>

      <Box sx={{ p: 2, overflow: 'auto', height: 'calc(100vh - 105px)' }}>
        <ReceiptFormCard toggle={toggle} />
      </Box>


      <Box sx={{ position: 'absolute', bottom: -10, zIndex: '1', width: '100%', backgroundColor: theme => theme.palette.common.black, borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', mb: 2, px: 2, py: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Button onClick={() => (!!toggle ? toggle() : router.back())} fullWidth variant='contained' color={'error'} size='small' sx={{ ml: 2, '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:x' />
            {t("Cancel")}
          </Button>
        </Box>


        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <FormSaveButton options={recId ? [saveCloseKey] : [saveCloseKey, saveNewKey]} onClick={(option: number, event: any) => onSubmit(event, option)} />
        </Box>
      </Box>

      <CustomBackdrop open={loading} />

    </DatePickerWrapper>
  )
}
export default SectionTypeForm
