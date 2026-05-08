// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import {useTranslation} from "react-i18next";
import DropzoneWrapper from "src/@core/styles/libs/react-dropzone";
import {SyntheticEvent, useState} from "react";
import AttachmentsUploader from "../uploaders/AttachmentsUploader";
import {AttachmentDataType} from "./AttachmentsButton";
import CustomBackdrop from "../../@core/components/loading";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";

interface Props {
  recno?: string | number | null
  open: boolean
  formType?: string | null
  loading: boolean
  toggle: () => void,
  attachments: AttachmentDataType[],
  removeAttachment: (file: AttachmentDataType) => void,
  uploadAttachment: (file: File[]) => void,
  files: File[],
  setFiles: (files: File[]) => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AttachmentsSidebar = ({ loading, open, toggle, files, setFiles, attachments, removeAttachment, uploadAttachment, recno, formType }: Props) => {
  const {t} = useTranslation();
  const [value, setValue] = useState<string>('1')


  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={toggle}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400], mx: '10px', my: '10px', height: '97vh', borderRadius: '12px' } }}
      ModalProps={{ keepMounted: true }}
    >
      <TabContext value={value}>
        <Header sx={{px: 2, py: 0, width: '100%'}}>
          <TabList onChange={handleTabChange} aria-label='icon tabs example'>
            <Tab value='1' label={t('Attachments')} />
          </TabList>

          <IconButton
            size='small'
            onClick={toggle}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Header>
        <TabPanel value='1' sx={{p: 0}}>
          <Box sx={{ p: theme => theme.spacing(4, 6, 16), position: 'relative', overflow: 'auto', width: '100%' }}>
            <Box sx={{display: 'flex', justifyContent: {md: 'end', sm: 'center'}}}>
              <Box sx={{width: '100%'}}>
                <DropzoneWrapper minHeight={100}>
                  <AttachmentsUploader recno={recno} uploadAttachment={uploadAttachment} height={200} title={"Drop or click to Upload your attachment."} files={files} setFiles={setFiles} attachments={attachments} removeAttachment={removeAttachment}/>
                </DropzoneWrapper>
              </Box>
            </Box>
          </Box>
          <Box sx={{position: 'absolute', zIndex: 1, bottom: 0, width: '100%', display: 'flex', justifyContent: "end", p: 2, backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
            <Button variant='tonal' color='error' onClick={toggle}>
              {t("Close")}
            </Button>
          </Box>

        </TabPanel>
      </TabContext>
      <CustomBackdrop open={loading} />
    </Drawer>
  )
}

export default AttachmentsSidebar
