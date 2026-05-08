// ** React Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import {DropzoneOptions, useDropzone} from 'react-dropzone'
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";

interface FileProp {
  name: string
  type: string
  size: number
}

interface Props {
  title?: string | null
  height?: number | null
  image?: string | null
  files: File[]
  setFiles: (files: File[]) => void
}

const SingleFileUploader = ({title, files, setFiles, height, image} : Props) => {

  const {t} = useTranslation();

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      const maxSize = 800 * 1024; // 800kb in bytes
      const filteredFiles = acceptedFiles.filter(file => file.size <= maxSize);

      if (filteredFiles.length === 0) {
        toast.error('File is too large. Maximum allowed size is 800kb.');
        return;
      }

      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))

    }
  } as DropzoneOptions)

  const img = files.map((file: FileProp) => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ))

  return (
    <Box {...getRootProps({ className: 'dropzone' })} sx={files.length || image ? { height: height??450 } : {}}>
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : image ? (
        <img key={'saved-image'} alt={'saved-image'} className='single-file-image' src={image} />
      ) : (
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
            *Uploaded file size should be less than or equal to 800kb.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default SingleFileUploader
