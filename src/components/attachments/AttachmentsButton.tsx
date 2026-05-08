import CustomChip from "src/core/components/mui/chip";
import Icon from "src/core/components/icon";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import AttachmentsSidebar from "./AttachmentsSidebar";
import axios from "axios";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface Props {
  files: File[],
  setFiles: (files: File[]) => void,
  formType?: string | null
  color?: any
  iconOnly?: boolean | null
  recno?: string | number | null
}

export interface AttachmentDataType {
  name: string | null
  path: string | null
  fileSize: number | null
  recno: number | null
  uploadDate: string | null
}
const AttachmentsButton = ({formType, color, recno, files, setFiles, iconOnly = false}: Props) => {
  const [openAttachments, setOpenAttachments] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<AttachmentDataType[]>([])

  const  { t } = useTranslation();
  const toggleAttachments = () => setOpenAttachments(!openAttachments);


  const loadAttachments = async () => {
    try {
      const response = await axios.get(`/FileUpload/GetPageWise/${formType},${recno}`, {
        params: { PageNo: 1, PageSize: 20 }
      });
      console.log(response.data?.data,"responsedatadata")
      setAttachments(response.data?.data || [])
    } catch (error: any) {
      let message = error?.message || error.response?.message || error.response?.data?.message || error || "";
      toast.error(message);
    }
  }

  const removeAttachment = async (attachment: AttachmentDataType) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/FileUpload/${attachment.recno}`);
      if(response.data?.succeeded) {
        setAttachments(attachments => attachments.filter(a => a.recno !== attachment.recno))
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      let message = error?.message || error.response?.message || error.response?.data?.message || error || "";
      toast.error(message);
    }
  }

  const uploadAttachment = async (file: File[]) => {
    try {
      setLoading(true);
      const formData = new FormData()
      for(let i = 0; i < file.length; i++) {
        formData.append('FormType', formType??"")
        formData.append('DocumentId', `${recno??""}`)
        formData.append("objfile", file[i], file[i].name)
      }

      const response = await axios.post('/FileUpload', formData)
      setAttachments(attachments => [...attachments, ...(response.data?.data?.list??[])])
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      let message = error?.message || error.response?.message || error.response?.data?.message || error || "";
      toast.error(message);
    }
  }



  useEffect(() => {
    if (formType && recno) {
      loadAttachments().then(() => {
        console.log('attachments loaded');
      })
    }
  }, [formType, recno])

  return (
    <Box>
      {
        iconOnly ?
          <Tooltip title={t("Attachments")}>
            <IconButton
              size='small'
              onClick={() => toggleAttachments()}
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
              <Icon icon='tabler:link' fontSize='1.25rem' />
            </IconButton>
          </Tooltip>
          :
        <CustomChip
          rounded
          skin='light'
          color={color ?? 'secondary'}
          onClick={(_) => toggleAttachments()}
          label={`${t("Attachments")} ${(attachments.length + files.length) ? `(${attachments.length + files.length})` : ''}`}
          icon={<Icon icon='tabler:link' fontSize='1.25rem'/>}
        />
      }
      {
        openAttachments && <AttachmentsSidebar loading={loading} attachments={attachments} files={files} setFiles={setFiles} open={openAttachments} toggle={toggleAttachments} uploadAttachment={uploadAttachment} removeAttachment={removeAttachment} recno={recno} formType={formType} />
      }
    </Box>
  )
}

export default AttachmentsButton;
