// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// ** Custom Components Imports
import Icon from "src/core/components/icon";
import {useTranslation} from "react-i18next";
import AgentFormCard from "src/views/inventory-operations/agents/agent-form/AgentFormCard";


// ** Styled Component
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'
import {useRouter} from "next/navigation";
import AttachmentsButton from "src/components/attachments/AttachmentsButton";
import {agentFormType} from "src/core/utils/form-types";
import {useAgent} from "../context/useAgent";
import toast from "react-hot-toast";
import {getData} from "src/store/inventory-operations/agents";
import { getAgents } from "src/store/dropdowns/index";
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

const AgentForm = ({ recno, callback, toggle }: Props) => {
  // ** State
  const {t} = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { storeAgent, resetAgentData, loadAgentData } = useAgent();

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.agents)

  const router = useRouter();


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(recno) {
        loadAgentData(recno);
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
      let res: any = await storeAgent(files, imageFiles);
      if(res?.succeeded) {
        toast.success("Agent Saved Successfully.");
        dispatch(getData({
          ...store.params
        }))
        dispatch(getAgents({}))
        if(index === 1) {
          resetAgentData();
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
        toast.error(`Error while saving agent!. ${message}`)
      }
    } catch (res: any) {
      let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Error while saving agent!. ${message}`)
    }
    setLoading(false);
  }

  return (
    <DatePickerWrapper
      sx={{
        '& .react-datepicker-wrapper': { width: '100%' },
        position: 'relative',
        height: 'calc(100vh - 50px)',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2, overflow: 'auto', height: 'calc(100vh - 105px)' }}>
        <AgentFormCard toggle={toggle} files={imageFiles} setFiles={setImageFiles} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: -10,
          zIndex: '1',
          width: '100%',
          backgroundColor: theme => theme.palette.common.black,
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          mb: 2,
          px: 2,
          py: 3,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Button
            onClick={() => (!!toggle ? toggle() : router.back())}
            fullWidth
            variant='contained'
            color={'error'}
            size='small'
            sx={{ ml: 2, '& svg': { mr: 2 } }}
          >
            <Icon fontSize='1.125rem' icon='tabler:x' />
            {t('Cancel')}
          </Button>
        </Box>

        <AttachmentsButton files={files} setFiles={setFiles} formType={agentFormType} recno={recno} />

        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <FormSaveButton
            options={recno ? [saveCloseKey] : [saveCloseKey, saveNewKey]}
            onClick={(option: number, event: any) => onSubmit(event, option)}
          />
        </Box>
      </Box>

      <CustomBackdrop open={loading} />
    </DatePickerWrapper>
  )
}
export default AgentForm
