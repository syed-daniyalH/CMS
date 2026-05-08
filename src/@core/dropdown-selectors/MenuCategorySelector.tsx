import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { getMenuCategoriesDropdown } from 'src/store/dropdowns/cms'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import TypoLabel from 'src/custom-components/inputs/TypoLabel'

interface Props {
  selectedValue: string | null
  menuTypeId?: string | null
  handleChange: (value: any | null) => void
  disabled?: boolean
  important?: boolean
}

const MenuCategorySelector = ({ selectedValue, menuTypeId, handleChange, disabled = false, important = false }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const categories = useSelector((state: RootState) => state.cmsDropdowns?.menuCategories ?? [])
  const params = useSelector((state: RootState) => state.cmsDropdowns?.menuCategoriesParams ?? {})
  const [value, setValue] = useState<any | null>(null)

  useEffect(() => {
    if (!categories.length || `${params?.menuType ?? ''}` !== `${menuTypeId ?? ''}`) {
      dispatch(getMenuCategoriesDropdown({ menuType: menuTypeId || undefined }))
    }
  }, [dispatch, categories.length, menuTypeId, params?.menuType])

  const options = useMemo(() => categories.map((item: any) => ({ ...item, id: item?._id ?? item?.id })), [categories])

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
      renderInput={paramsInput => <CustomTextField {...paramsInput} fullWidth label={<TypoLabel name='Category' important={important} />} placeholder='Select category' />}
    />
  )
}

export default MenuCategorySelector
