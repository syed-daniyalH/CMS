import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { getMenuTypesDropdown } from 'src/store/dropdowns/cms'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import TypoLabel from 'src/components/inputs/TypoLabel'

interface Props {
  selectedValue: string | null
  handleChange: (value: any | null) => void
  disabled?: boolean
  important?: boolean
}

const MenuTypeSelector = ({ selectedValue, handleChange, disabled = false, important = false }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const types = useSelector((state: RootState) => state.cmsDropdowns?.menuTypes ?? [])
  const [value, setValue] = useState<any | null>(null)

  useEffect(() => {
    if (!types.length) dispatch(getMenuTypesDropdown())
  }, [dispatch, types.length])

  const options = useMemo(() => types.map((item: any) => ({ ...item, id: item?._id ?? item?.id })), [types])

  useEffect(() => {
    if (!selectedValue) {
      setValue(null)
      return
    }
    setValue(options.find((item: any) => `${item?.id}` === `${selectedValue}`) ?? null)
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
      isOptionEqualToValue={(option: any, val: any) => `${option?.id}` === `${val?.id}`}
      getOptionLabel={(option: any) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name='Type' important={important} />} placeholder='Select type' />}
    />
  )
}

export default MenuTypeSelector
