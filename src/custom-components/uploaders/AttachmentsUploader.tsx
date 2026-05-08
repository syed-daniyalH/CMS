// ** React Imports
import {Fragment} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import {DropzoneOptions, useDropzone} from 'react-dropzone'
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {AttachmentDataType} from "../attachments/AttachmentsButton";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";

interface FileProp {
  name: string
  type: string
  size: number
}

interface Props {
  title?: string | null
  recno?: string | number | null
  height?: number | null
  attachments: AttachmentDataType[]
  removeAttachment: (file: AttachmentDataType) => void
  uploadAttachment: (file: File[]) => void
  files: File[]
  setFiles: (files: File[]) => void
}

const AttachmentsUploader = ({title, files, setFiles, attachments, removeAttachment, uploadAttachment, recno}: Props) => {
  // ** State

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const maxSize = 800 * 1024; // 800kb in bytes
      const filteredFiles = acceptedFiles.filter(file => file.size <= maxSize);

      if (filteredFiles.length === 0) {
        toast.error('One of file is too large. Maximum allowed size is 800kb.');
        return;
      }

      if(recno) {
        uploadAttachment(acceptedFiles);
      } else {
        setFiles([...files, ...acceptedFiles.map((file: File) => Object.assign(file))])
      }
    }
  } as DropzoneOptions)

  const {t} = useTranslation();

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const renderAttachmentPreview = (file: AttachmentDataType) => {
    if ((file.name??"").includes('.png') || (file.name??"").includes('.jpg') || (file.name??"").includes('.jpeg') || (file.name??"").includes('.gif')) {
      return <img width={38} height={38} alt={file.name??"Image"} src={`${file.path}`} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const filtered = files.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <Link style={{color: 'inherit', textDecoration: 'none'}} target={'_blank'} href={URL.createObjectURL(file as any)}>
        <div className='file-details'>
          <div className='file-preview'>{renderFilePreview(file)}</div>
          <div>
            <Typography className='file-name'>{file.name}</Typography>
            <Typography className='file-size' variant='body2'>
              {Math.round(file.size / 100) / 10 > 1000
                ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
            </Typography>
          </div>
        </div>
      </Link>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const attachmentList = attachments.map((file: AttachmentDataType) => {
    return (
      <ListItem key={file.name}>
        <Link style={{color: 'inherit', textDecoration: 'none'}} target={'_blank'} href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${file.path??""}`}>
          <div className='file-details'>
            <div className='file-preview'>{renderAttachmentPreview(file)}</div>
            <div>
              <Typography className='file-name'>{file.name}</Typography>
              <Typography className='file-size' variant='body2'>
                {(file.fileSize??0) > 1
                ? `${((file.fileSize??0)).toFixed(1)} mb`
                : `${((file.fileSize??0) * 1024).toFixed(1)} kb`}
              </Typography>
            </div>
          </div>
        </Link>
        <Tooltip title={t("Delete`")}>
          <IconButton onClick={() => removeAttachment(file)}>
            <Icon icon='tabler:trash' fontSize={20}/>
          </IconButton>
        </Tooltip>
      </ListItem>
    )
  })

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Box
            sx={{
              mb: 8.75,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
            }}
          >
            <Icon icon='tabler:upload' fontSize='1.75rem' />
          </Box>
          <Typography variant='h6' sx={{ mb: 2.5 }}>
            {t(title??"Drop files here or click to upload.")}
          </Typography>
          <Typography variant='caption' sx={{ color: theme => theme.palette.error.main }}>
            *{t("Uploaded file size should be less than or equal to 800kb.")}
          </Typography>
        </Box>
      </div>
      {(files.length || attachments.length) ? (
        <Fragment>
          {
            files.length ?
            <List>{fileList}</List> : null
          }

          {
            attachments.length ?
            <List>{attachmentList}</List> : null
          }
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default AttachmentsUploader
