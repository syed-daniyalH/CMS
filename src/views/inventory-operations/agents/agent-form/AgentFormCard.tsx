// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Imports
import CustomTextField from 'src/core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import Icon from 'src/core/components/icon'
import TypoLabel from 'src/components/inputs/TypoLabel'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import IconButton from '@mui/material/IconButton'
import { useAgent } from '../context/useAgent'
import { useRouter } from 'next/navigation'
import { CityDropdownObj, CountryDropdownObj, GenericDropdownObj } from 'src/store/dropdowns'
import CountrySelector from 'src/core/dropdown-selectors/CountrySelector'
import CitiesSelector from 'src/core/dropdown-selectors/CitiesSelector'
import CustomerTypeSelector from '../../../../core/dropdown-selectors/CustomerTypeSelector'
import GenderSelector from '../../../../core/dropdown-selectors/GenderSelector'
import CustomDatePicker from '../../../../core/components/custom-date-picker'

//@ts-ignore
import dateFormat from 'dateformat'
import { globalSendDateFormat } from '../../../../core/utils/format'
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import DropzoneWrapper from '../../../../core/styles/libs/react-dropzone'
import SingleImageUploader from '../../../../components/uploaders/SingleImageUploader'

const AgentFormCard = ({ toggle, files, setFiles }: any) => {
  // ** State
  const { t } = useTranslation()

  // ** Hook
  const theme = useTheme()

  const [value, setValue] = useState<string>('1')

  const { agent, nominee, handleAgentData, handleNominee, resetNominee } = useAgent()
  const router = useRouter()

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleChangeCountry = (value: CountryDropdownObj | null) => {
    handleAgentData({ country: value?.name, countryId: value?.recno, state: null })
  }

  const handleChangeState = (value: CityDropdownObj | null) => {
    handleAgentData({ state: value?.name })
  }

  const handleChangeAgentType = (value: GenericDropdownObj | null) => {
    handleAgentData({ typeId: value?.value ? parseInt(`${value?.value}`) : null })
  }

  const handleChangeGender = (value: string | null) => {
    handleAgentData({ gender: value ?? null })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xl={12} md={12} xs={12}>
        <Card>
          <CardContent sx={{ p: [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`] }}>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <IconButton onClick={() => (!!toggle ? toggle() : router.back())}>
                <Icon icon={'tabler:arrow-left'} />
              </IconButton>
              <Typography variant={'h5'}>{agent?.agentId ? t('Update Agent') : t('New Agent')}</Typography>
            </Box>
            <Divider />
            <Grid container sx={{ mt: 2, alignItems: 'center' }} spacing={2}>
              <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: { md: 250, sm: '100%', xs: '100%' } }}>
                    <DropzoneWrapper minHeight={100}>
                      <SingleImageUploader
                        image={agent?.customerImageUrl ?? null}
                        height={200}
                        title={'Drop or click to Upload your agent image.'}
                        files={files}
                        setFiles={setFiles}
                      />
                    </DropzoneWrapper>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomTextField
                  fullWidth
                  autoFocus
                  label={<TypoLabel important name={'First Name'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Display Name') as string}
                  value={agent?.firstName ?? ''}
                  onChange={e => {
                    handleAgentData({ firstName: e.target.value ?? '' })
                  }}
                />

                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Email'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Email') as string}
                  value={agent?.email ?? ''}
                  onChange={e => {
                    handleAgentData({ email: e.target.value ?? '' })
                  }}
                />

                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Identity#'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Identity#') as string}
                  value={agent?.identityNo ?? ''}
                  onChange={e => {
                    handleAgentData({ identityNo: e.target.value ?? '' })
                  }}
                />
              </Grid>

              <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomTextField
                  fullWidth
                  type='text'
                  label={<TypoLabel important name={'Second Name'} />}
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Second Name') as string}
                  value={agent?.secondName ?? ''}
                  onChange={e => {
                    handleAgentData({ secondName: e.target.value ?? '' })
                  }}
                />

                <CustomerTypeSelector
                  selected_value={agent?.typeId ?? null}
                  handleChange={handleChangeAgentType}
                />

                <Box sx={{ mb: 2 }}>
                  <CustomDatePicker
                    date={agent?.identityExpDate}
                    onChange={(date: Date) => {
                      handleAgentData({ identityExpDate: dateFormat(new Date(date), globalSendDateFormat) })
                    }}
                    label={'Identity Expiry'}
                  />
                </Box>
              </Grid>

              <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel important name={'Mobile'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Mobile') as string}
                  value={agent?.phone1 ?? ''}
                  onChange={e => {
                    handleAgentData({ phone1: e.target.value ?? '' })
                  }}
                />

                <GenderSelector selected_value={agent?.gender ?? null} handleChange={handleChangeGender} />

                <CustomTextField
                  fullWidth
                  label={<TypoLabel name={'Guardian Name'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Guardian Name') as string}
                  value={agent?.guardianName ?? ''}
                  onChange={e => {
                    handleAgentData({ guardianName: e.target.value ?? '' })
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <CardContent sx={{ p: [`${theme.spacing(2)} !important`, `${theme.spacing(2)} !important`] }}>
            <TabContext value={value}>
              <TabList onChange={handleTabChange} aria-label='icon tabs example'>
                <Tab value='1' label={t('Address')} icon={<Icon icon='tabler:location-pin' />} />
                <Tab value='2' label={t('General Information')} icon={<Icon icon='tabler:progress' />} />
                <Tab value='3' label={t('Nominees')} icon={<Icon icon='tabler:users' />} />
              </TabList>
              <TabPanel value='1'>
                <Grid container spacing={0} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} lg={6}>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
                        <CustomTextField
                          fullWidth
                          type='text'
                          sx={{ mb: 4 }}
                          variant='outlined'
                          placeholder={t('Temporary Address') as string}
                          value={agent?.tempAddress ?? ''}
                          onChange={e => {
                            handleAgentData({ tempAddress: e.target.value ?? '' })
                          }}
                        />

                        <CustomTextField
                          fullWidth
                          type='text'
                          sx={{ mb: 4 }}
                          variant='outlined'
                          placeholder={t('Permanent Address') as string}
                          value={agent?.permAddress ?? ''}
                          onChange={e => {
                            handleAgentData({ permAddress: e.target.value ?? '' })
                          }}
                        />
                      </Grid>

                      <Grid item md={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
                        <CountrySelector
                          selected_value={agent?.country ?? null}
                          handleChange={handleChangeCountry}
                          props={{ sx: { mb: 0 }, label: null, placeholder: t('Country') as string }}
                        />
                      </Grid>

                      <Grid item md={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
                        <CitiesSelector
                          disabled={!agent?.country}
                          selected_value={agent?.city ?? null}
                          country_id={agent?.countryId ?? null}
                          handleChange={handleChangeState}
                          props={{ sx: { mb: 0 }, label: null, placeholder: t('State') as string }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value='2'>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                    <Box sx={{ mb: 2 }}>
                      <CustomDatePicker
                        date={agent?.dob}
                        onChange={(date: Date) => {
                          handleAgentData({ dob: dateFormat(new Date(date), globalSendDateFormat) })
                        }}
                        label={'Date of Birth'}
                      />
                    </Box>
                  </Grid>

                  <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                    <CustomTextField
                      fullWidth
                      label={<TypoLabel name={'Registration#'} important />}
                      type='text'
                      sx={{ mb: 2 }}
                      variant='outlined'
                      placeholder={t('Registration#') as string}
                      value={agent?.regNo ?? ''}
                      onChange={e => {
                        handleAgentData({ regNo: e.target.value ?? '' })
                      }}
                    />
                  </Grid>

                  <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                    <CustomTextField
                      fullWidth
                      label={<TypoLabel name={'Passport#'} />}
                      type='text'
                      sx={{ mb: 2 }}
                      variant='outlined'
                      placeholder={t('Passport#') as string}
                      value={agent?.passNo ?? ''}
                      onChange={e => {
                        handleAgentData({ passNo: e.target.value ?? '' })
                      }}
                    />
                  </Grid>

                  <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                    <Box sx={{ mb: 2 }}>
                      <CustomDatePicker
                        date={agent?.passExpDate}
                        onChange={(date: Date) => {
                          handleAgentData({ passExpDate: dateFormat(new Date(date), globalSendDateFormat) })
                        }}
                        label={'Passport Expiry'}
                      />
                    </Box>
                  </Grid>

                  <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                    <CustomTextField
                      fullWidth
                      label={<TypoLabel name={'Nationality'} />}
                      type='text'
                      sx={{ mb: 2 }}
                      variant='outlined'
                      placeholder={t('Nationality') as string}
                      value={agent?.nationality ?? ''}
                      onChange={e => {
                        handleAgentData({ nationality: e.target.value ?? '' })
                      }}
                    />
                  </Grid>

                  <Grid item md={3} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                    <CustomTextField
                      fullWidth
                      label={<TypoLabel name={'Remarks'} />}
                      type='text'
                      sx={{ mb: 2 }}
                      variant='outlined'
                      placeholder={t('Remarks') as string}
                      value={agent?.remarks ?? ''}
                      onChange={e => {
                        handleAgentData({ remarks: e.target.value ?? '' })
                      }}
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value='3'>
                <Box sx={{ mt: 0 }}>
                  <CardContent sx={{ p: [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`] }}>
                    <Grid container spacing={4}>
                      <Grid item md={7} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                        <Grid container spacing={4}>
                          <Grid
                            item
                            md={6}
                            xs={12}
                            order={{ xs: 1, sm: 1, md: 0, lg: 0 }}
                            sx={{ mb: { xl: 0, xs: 4 } }}
                          >
                            <CustomTextField
                              fullWidth
                              label={<TypoLabel important name={'Name'} />}
                              type='text'
                              sx={{ mb: 2 }}
                              variant='outlined'
                              placeholder={t('Name') as string}
                              value={nominee?.name ?? ''}
                              onChange={e => {
                                handleNominee({ name: e.target.value ?? '' })
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            md={6}
                            xs={12}
                            order={{ xs: 1, sm: 1, md: 0, lg: 0 }}
                            sx={{ mb: { xl: 0, xs: 4 } }}
                          >
                            <CustomTextField
                              fullWidth
                              type='text'
                              label={<TypoLabel important name={'Email'} />}
                              sx={{ mb: 2 }}
                              variant='outlined'
                              placeholder={t('Email') as string}
                              value={nominee?.email ?? ''}
                              onChange={e => {
                                handleNominee({ email: e.target.value ?? '' })
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            md={6}
                            xs={12}
                            order={{ xs: 1, sm: 1, md: 0, lg: 0 }}
                            sx={{ mb: { xl: 0, xs: 4 } }}
                          >
                            <CustomTextField
                              fullWidth
                              label={<TypoLabel name={'Mobile'} />}
                              type='text'
                              sx={{ mb: 2 }}
                              variant='outlined'
                              placeholder={t('Mobile') as string}
                              value={nominee?.phone ?? ''}
                              onChange={e => {
                                handleNominee({ phone: e.target.value ?? '' })
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            md={6}
                            xs={12}
                            order={{ xs: 1, sm: 1, md: 0, lg: 0 }}
                            sx={{ mb: { xl: 0, xs: 4 } }}
                          >
                            <CustomTextField
                              fullWidth
                              label={<TypoLabel name={'Relation'} important />}
                              type='text'
                              sx={{ mb: 2 }}
                              variant='outlined'
                              placeholder={t('Relation') as string}
                              value={nominee?.relation ?? ''}
                              onChange={e => {
                                handleNominee({ relation: e.target.value ?? '' })
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            md={6}
                            xs={12}
                            order={{ xs: 1, sm: 1, md: 0, lg: 0 }}
                            sx={{ mb: { xl: 0, xs: 4 } }}
                          >
                            <CustomTextField
                              fullWidth
                              label={<TypoLabel name={'Identity#'} important />}
                              type='text'
                              sx={{ mb: 2 }}
                              variant='outlined'
                              placeholder={t('Identity#') as string}
                              value={nominee?.identityNo ?? ''}
                              onChange={e => {
                                handleNominee({ identityNo: e.target.value ?? '' })
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            md={6}
                            xs={12}
                            order={{ xs: 1, sm: 1, md: 0, lg: 0 }}
                            sx={{ mb: { xl: 0, xs: 4 } }}
                          >
                            <Box sx={{ mb: 2 }}>
                              <CustomDatePicker
                                date={nominee?.identityExp}
                                onChange={(date: Date) => {
                                  handleNominee({ identityExp: dateFormat(new Date(date), globalSendDateFormat) })
                                }}
                                label={'Identity Expiry'}
                              />
                            </Box>
                          </Grid>

                          <Grid
                            item
                            md={6}
                            xs={12}
                            order={{ xs: 1, sm: 1, md: 0, lg: 0 }}
                            sx={{ mb: { xl: 0, xs: 4 } }}
                          >
                            <CustomTextField
                              fullWidth
                              label={<TypoLabel name={'Address'} />}
                              type='text'
                              sx={{ mb: 2 }}
                              variant='outlined'
                              placeholder={t('Address') as string}
                              value={nominee?.address ?? ''}
                              onChange={e => {
                                handleNominee({ address: e.target.value ?? '' })
                              }}
                            />
                          </Grid>

                          <Grid item md={6} xs={6} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                            <CustomTextField
                              fullWidth
                              label={<TypoLabel name={'Remarks'} />}
                              type='text'
                              sx={{ mb: 2 }}
                              variant='outlined'
                              placeholder={t('Remarks') as string}
                              value={nominee?.remarks ?? ''}
                              onChange={e => {
                                handleNominee({ remarks: e.target.value ?? '' })
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} lg={12}>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'end', py: 4 }}>
                              <Button
                                variant={'contained'}
                                color={'success'}
                                onClick={() => {
                                  if (!nominee?.name || !nominee.relation || !nominee.identityNo) {
                                    toast.error(t('Please add required fields.'))
                                    return
                                  }
                                  handleAgentData({ nominees: [...(agent?.nominees ?? []), nominee] })
                                  resetNominee()
                                }}
                              >
                                {t('Add')}
                              </Button>
                            </Box>
                            <Divider />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={5} xs={12} order={{ xs: 1, sm: 1, md: 0, lg: 0 }} sx={{ mb: { xl: 0, xs: 4 } }}>
                        {
                          <Box sx={{ display: 'flex', p: 2 }}>
                            <Typography variant={'h6'}>{t('Nominees Details')}</Typography>
                          </Box>
                        }
                        {<Divider />}

                        {(agent?.nominees ?? []).map((nomineeDetail, index: number) => {
                          return (
                            <Box sx={{ display: 'flex', flexDirection: 'column' }} key={index}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }} key={index}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                  <Typography variant={'body2'}>
                                    {nomineeDetail.name ?? ''} ({nomineeDetail.email ?? ''})
                                  </Typography>
                                  <Typography variant={'body2'}>
                                    {t('Identity#')}: {nomineeDetail.identityNo ?? ''}
                                  </Typography>
                                  <Typography variant={'body2'}>
                                    {t('Relation')}: {nomineeDetail.relation ?? ''}
                                  </Typography>
                                  {nomineeDetail.address && (
                                    <Typography variant={'body2'}>
                                      {t('Address')}: {nomineeDetail.address ?? ''}
                                    </Typography>
                                  )}
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                  <IconButton
                                    size='small'
                                    onClick={() => {
                                      agent?.nominees.splice(index, 1)
                                      handleAgentData({ nominees: [...(agent?.nominees ?? [])] })
                                    }}
                                    sx={{
                                      p: '0.375rem',
                                      borderRadius: 1,
                                      color: 'common.white',
                                      backgroundColor: 'error.main',
                                      '&:hover': {
                                        backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
                                      }
                                    }}
                                  >
                                    <Icon icon='tabler:trash' fontSize='1.25rem' />
                                  </IconButton>
                                </Box>
                              </Box>

                              <Divider />
                            </Box>
                          )
                        })}

                        {(agent?.nominees ?? []).length <= 0 && (
                          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                            <Typography variant={'body2'}>{t('No nominee detail found!')}</Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Box>
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AgentFormCard
