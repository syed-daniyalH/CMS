import { SyntheticEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import TypoLabel from 'src/components/inputs/TypoLabel'
import { AppDispatch, RootState } from 'src/store'
import { getSubServiceLinksDropdown } from 'src/store/dropdowns/cms'

interface Props {
  selectedValue: string
  serviceSlug: string
  handleChange: (value: { slug: string; name: string } | null) => void
  disabled?: boolean
}

const SubServiceSlugSelector = ({ selectedValue, serviceSlug, handleChange, disabled = false }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const options = useSelector((state: RootState) => state.cmsDropdowns?.subServiceLinks ?? [])
  const params = useSelector((state: RootState) => state.cmsDropdowns?.subServiceLinksParams ?? {})
  const [value, setValue] = useState<any | null>(null)

  useEffect(() => {
    if (!serviceSlug) return
    if (`${params?.serviceSlug ?? ''}` === `${serviceSlug}` && options.length) return
    dispatch(getSubServiceLinksDropdown({ serviceSlug }))
  }, [dispatch, serviceSlug, params?.serviceSlug, options.length])

  useEffect(() => {
    if (!selectedValue) {
      setValue(null)
      return
    }
    setValue(options.find((item: any) => `${item?.slug}` === `${selectedValue}`) ?? null)
  }, [selectedValue, options])

  const onChange = (_event: SyntheticEvent, option: any | null) => {
    setValue(option)
    handleChange(option)
  }

  return (
    <CustomAutocomplete
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled || !serviceSlug}
      isOptionEqualToValue={(option: any, val: any) => `${option?.slug}` === `${val?.slug}`}
      getOptionLabel={(option: any) => option?.name || option?.slug || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name='Sub Service' />} placeholder='Select sub service' />}
    />
  )
}

export default SubServiceSlugSelector

