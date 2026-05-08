import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import TypoLabel from 'src/components/inputs/TypoLabel'
import { AppDispatch, RootState } from 'src/store'
import { getIndustryLinksDropdown } from 'src/store/dropdowns/cms'

interface Props {
  selectedValue: string
  handleChange: (value: { slug: string; name: string } | null) => void
  disabled?: boolean
  important?: boolean
}

const IndustrySlugSelector = ({ selectedValue, handleChange, disabled = false, important = false }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const links = useSelector((state: RootState) => state.cmsDropdowns?.industryLinks ?? [])
  const [value, setValue] = useState<any | null>(null)

  useEffect(() => {
    if (!links.length) dispatch(getIndustryLinksDropdown())
  }, [dispatch, links.length])

  const options = useMemo(
    () => links.map((item: any) => ({ slug: `${item?.slug ?? ''}`, name: `${item?.name ?? ''}` })),
    [links]
  )

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
      disabled={disabled}
      isOptionEqualToValue={(option: any, val: any) => `${option?.slug}` === `${val?.slug}`}
      getOptionLabel={(option: any) => option?.name || option?.slug || ''}
      renderInput={params => (
        <CustomTextField {...params} fullWidth label={<TypoLabel name='Industry' important={important} />} placeholder='Select industry' />
      )}
    />
  )
}

export default IndustrySlugSelector
