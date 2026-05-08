// ** React Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/core/components/icon'

// ** Third Party Imports
import {DropzoneOptions, FileRejection, useDropzone} from 'react-dropzone'
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import Cropper from 'cropperjs';

// ** Styled Component
import DropzoneWrapper from 'src/core/styles/libs/react-dropzone'
import 'cropperjs/dist/cropper.css';

interface FileProp {
  name: string
  type: string
  size: number
}

interface Props {
  title?: string | null
  height?: number | null
  cropper: any
  setCropper: (value: any) => void
  files: File[]
  setFiles: (files: File[]) => void
}

const CustomImageCropper = ({title, files, setFiles, height, cropper, setCropper} : Props) => {

  const {t} = useTranslation();


  //** States

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const maxSize = 800 * 1024; // 800kb in bytes
      const filteredFiles = acceptedFiles.filter(file => file.size <= maxSize);

      if (filteredFiles.length === 0) {
        toast.error('File is too large. Maximum allowed size is 800kb.');
        return;
      } else if (rejectedFiles.length) {
        let message = "You can only upload image Files!.";
        message =  (rejectedFiles[0] && (rejectedFiles[0].errors??[]).length) ? rejectedFiles[0]?.errors[0]?.message??"" : "You can only upload image Files!.";

        if(message.includes("File is larger than")){
          message = "You uploaded a file of size greater than 2MB. File size must be between 1 byte - 1MB.";
        } else if(message.includes("File is smaller than")){
          message = "You uploaded a file of size smaller than 5kb. File size must be between 1 byte - 1MB.";
        }

        toast.error(message)
      } else {
        if(acceptedFiles.length > 0) {
          setCropper(null);
          setFiles([...acceptedFiles])
          setTimeout(async ()=>{
            if(cropper) {
              await cropper.destroy();
            }
            const cropImage: any = document.getElementById('crop-profile-image');
            setCropper(new Cropper(cropImage, {
              initialAspectRatio: 1,
              center: true,
              responsive: true,
              background: false,
              viewMode: 1,
              crop(event) {
                console.log(event.detail.x);
                console.log(event.detail.y);
                console.log(event.detail.width);
                console.log(event.detail.height);
                console.log(event.detail.rotate);
              },
            }));
          }, 100);
        }
      }
    }
  } as DropzoneOptions)

  const img = files.map((file: FileProp) => (
    <img id={'crop-profile-image'} width={200} height={200} style={{borderRadius: '8px'}} key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ))

  return (
    <Box>
      {
        files.length ? (
          img
        ) : (
          <DropzoneWrapper minHeight={100}>
            <Box {...getRootProps({ className: 'dropzone' })} sx={{ height: height??200 }}>
            {
              cropper === null &&
              <input {...getInputProps()} />
            }
            {(
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
          </DropzoneWrapper>
        )
      }
    </Box>
  )
}

export default CustomImageCropper
