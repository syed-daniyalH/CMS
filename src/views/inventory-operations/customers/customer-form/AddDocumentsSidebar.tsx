// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import { useState } from 'react'
import { DocumentDataType } from '../context/types'
import Grid from '@mui/material/Grid'
import DropzoneWrapper from '../../../../@core/styles/libs/react-dropzone'
import SingleFileUploader from '../../../../custom-components/uploaders/SingleFileUplaoder'
import DocumentTypesSelector from '../../../../@core/dropdown-selectors/DocumentTypesSelector'
import { DocumentTypeEmp } from '../../../../store/dropdowns'
import TypoLabel from '../../../../custom-components/inputs/TypoLabel'
import CustomTextField from '../../../../@core/components/mui/text-field'
import CountrySelector from '../../../../@core/dropdown-selectors/CountrySelector'
import CustomDatePicker from '../../../../@core/components/custom-date-picker'
// @ts-ignore
import dateFormat from 'dateformat'
import { globalSendDateFormat } from '../../../../@core/utils/format'
import toast from 'react-hot-toast'
import { useCustomer } from '../context/useCustomer'
import { hexToRGBA } from '../../../../@core/utils/hex-to-rgba'
import Link from 'next/link'
import CustomBackdrop from '../../../../@core/components/loading'
import DatePickerWrapper from '../../../../@core/styles/libs/react-datepicker'

interface Props {
  open: boolean
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AddDocumentsSidebar = ({ open, toggle }: Props) => {

  const {t} = useTranslation();
  const [document, setDocument] = useState<DocumentDataType>({documentNo: "", files: [], documents: []})
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { documents, storeDocument, removeDocument } = useCustomer();


  const handleDocument = (updated: any) => {
    setDocument({...document, ...updated});
  }

  const handleChangeDocType = (value: DocumentTypeEmp | null ) => {
    handleDocument({docTypeId: value?.value})
  }


  const deleteDocument = async (recno: number) => {
    setLoading(true);
    try {
      let res = await removeDocument(recno);

      if (!res) {
        toast.error("Unable to remove document at the moment please try again later.")
      } else {
        toast.success("Document removed successfully!");
      }
    } catch (e) {
      toast.error("Unable to remove document at the moment please try again later.")
    }

    setLoading(false)
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
      <Header sx={{px: 4, py: 2}}>
        <Typography variant='h5'>{t("Customer Documents")}</Typography>
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

      <Divider />

      <Box sx={{ p: theme => theme.spacing(4, 6, 16), position: 'relative', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          px: 2,
          py: 1,
          mb: 4,
          border: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          backgroundColor: theme => theme.palette.customColors.tableHeaderBg
        }}>
          <Typography variant={'h6'}>
            {t("Documents")}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {
            documents.map((e) => {
              return (
                <>
                  {
                    (e?.documents??[]).map((doc, sIndex: number) => {
                      return (
                        <Grid key={sIndex} item xs={4} md={4}>
                          <Box sx={{position: 'relative',  width: '100%'}}>
                            <Box component={Link} target={'_blank'} href={`${doc?.url}`} sx={{display: 'flex', width: '100%', flexDirection: 'column', textDecoration: 'none'}}>
                              <Box sx={{height: '100px', display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', border: theme => `2px solid ${theme.palette.divider}`, backgroundColor: 'divider'}}>
                                <img alt={'Image'} src={`${doc?.url}`} width={'100%'}
                                     style={{borderRadius: '6px', maxHeight: '100%', maxWidth: '100%'}}/>
                              </Box>
                              <Typography variant={'caption'} sx={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                textAlign: 'center',
                                mt: 1
                              }}>
                                {e?.documentNo ?? ""}
                              </Typography>
                            </Box>

                            <Box sx={{position: 'absolute', top: -6, right: -6}}>
                              <IconButton  size='small'
                                           sx={{
                                             p: '0.275rem',
                                             borderRadius: 1,
                                             color: 'common.white',
                                             backgroundColor: 'error.main',
                                             '&:hover': {
                                               backgroundColor: theme => hexToRGBA(theme.palette.error.main, 0.56)
                                             }
                                           }}
                                           onClick={() => deleteDocument(doc.documentId)}>
                                <Icon icon={'tabler:trash'} fontSize={'0.85rem'} />
                              </IconButton>
                            </Box>

                          </Box>
                        </Grid>
                      )
                    })
                  }
                </>
              )
            })
          }
          {
            (documents ?? []).length <= 0 &&
            <Box sx={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <Typography variant={'body2'} sx={{
                mt: 2,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                textAlign: 'center'
              }}>
                {t("No Document Available!")}
              </Typography>
            </Box>
          }
        </Grid>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          px: 2,
          py: 1,
          mb: 4,
          mt: 2,
          border: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          backgroundColor: theme => theme.palette.customColors.tableHeaderBg
        }}>
          <Typography variant={'h6'}>
            {t("+ Add Documents")}
          </Typography>
        </Box>

        <DatePickerWrapper>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <DropzoneWrapper minHeight={100}>
                <SingleFileUploader height={200} title={"Drop or click to Upload your document."}
                                    files={files} setFiles={setFiles}/>
              </DropzoneWrapper>
            </Grid>
            <Grid item xs={12} md={12}>
              <DocumentTypesSelector selected_value={document?.docTypeId ?? null} clearable={false}
                                     handleChange={handleChangeDocType} props={{
                label: <TypoLabel name={"Document Type"} important/>,
                placeholder: t("Document Type") as string,
                sx: {mb: 2}
              }}/>

              <CustomTextField
                fullWidth
                label={<TypoLabel name={"Document No"} important/>}
                type='text'
                sx={{mb: 3}}
                variant='outlined'
                placeholder={t('Document No') as string}
                value={document?.documentNo ?? ""}
                onChange={(e) => {
                  handleDocument({documentNo: e.target.value ?? 0})
                }}
              />

              <CountrySelector selected_value_recno={document?.countryId ?? null}
                               handleChange={(value) => handleDocument({countryId: value?.recno})}
                               props={{
                                 placeholder: t("Country") as string,
                                 label: <TypoLabel name={"Country"} />
                               }}/>

              <Box sx={{mb: 3}}>
                <CustomDatePicker date={document?.issuedOn} onChange={(date: Date) => {
                  handleDocument({issuedOn: dateFormat(new Date(date), globalSendDateFormat)})
                }} label={"Issue Date"} important
                                  placeholderText={t("Issue Date")}/>
              </Box>

              <Box sx={{mb: 3}}>
                <CustomDatePicker date={document?.expiresOn} onChange={(date: Date) => {
                  handleDocument({expiresOn: dateFormat(new Date(date), globalSendDateFormat)})
                }} label={"Expiry Date"}
                                  important
                                  placeholderText={t("Expiry Date")}/>
              </Box>

              <CustomDatePicker date={document?.validFrom} onChange={(date: Date) => {
                handleDocument({validFrom: dateFormat(new Date(date), globalSendDateFormat)})
              }} label={"Valid From"} important
                                placeholderText={t("Valid From")}/>

            </Grid>
            {
              files.length > 0 && document?.docTypeId && document?.documentNo &&
              <Grid item xs={12} md={12} sx={{display: 'flex', justifyContent: 'end'}}>
                <Button variant={'tonal'} color={'success'} onClick={async () => {
                  if (files.length <= 0) {
                    toast.error("Please upload the file.");
                    return;
                  }

                  if (!document?.validFrom) {
                    toast.error("Please enter document valid from date.");
                    return;
                  }

                  if (!document?.issuedOn) {
                    toast.error("Please enter document issue date.");
                    return;
                  }

                  if (!document?.expiresOn) {
                    toast.error("Please enter document expiry date.");
                    return;
                  }

                  document.files = files;

                  setLoading(true);

                  try {
                    await storeDocument(document);
                    toast.success("File Uploaded!");
                    setFiles([]);
                    setDocument({documentNo: "", files: [], docTypeId: document.docTypeId, documents: []});
                  } catch (e: any) {
                    let message = e?.response?.data?.message ?? e?.data?.message ?? "";
                    toast.error(`Unable to upload file! "${message}"`)
                  }

                  setLoading(false);

                }}>
                  {t("Upload")}
                </Button>
              </Grid>
            }
          </Grid>
        </DatePickerWrapper>

        <CustomBackdrop open={loading} />
      </Box>
      <Box sx={{position: 'absolute', zIndex: 1, bottom: 0, width: '100%', display: 'flex', justifyContent: "end", p: 2, backgroundColor: theme => theme.palette.customColors.tableHeaderBg}}>
        <Button variant='tonal' color='error' onClick={() => {
          toggle();
        }}>
          {t("Close")}
        </Button>
      </Box>
    </Drawer>
  )
}

export default AddDocumentsSidebar
