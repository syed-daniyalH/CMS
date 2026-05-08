import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { getMenuSubCategoriesDropdown } from 'src/store/dropdowns/cms'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import TypoLabel from 'src/components/inputs/TypoLabel'

interface Props {
  selectedValue: string | null
  categoryId?: string | null
  handleChange: (value: any | null) => void
  disabled?: boolean
}

const MenuSubCategorySelector = ({ selectedValue, categoryId, handleChange, disabled = false }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const subCategories = useSelector((state: RootState) => state.cmsDropdowns?.menuSubCategories ?? [])
  const params = useSelector((state: RootState) => state.cmsDropdowns?.menuSubCategoriesParams ?? {})
  const [value, setValue] = useState<any | null>(null)

  useEffect(() => {
    if (!categoryId) return
    if (!subCategories.length || `${params?.categoryId ?? ''}` !== `${categoryId ?? ''}`) {
      dispatch(getMenuSubCategoriesDropdown({ categoryId }))
    }
  }, [dispatch, subCategories.length, categoryId, params?.categoryId])

  const options = useMemo(() => subCategories.map((item: any) => ({ ...item, id: item?._id ?? item?.id })), [subCategories])

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
      disabled={disabled || !categoryId}
      isOptionEqualToValue={(option: any, val: any) => `${option?.id}` === `${val?.id}`}
      getOptionLabel={(option: any) => option?.name || ''}
      renderInput={paramsInput => <CustomTextField {...paramsInput} fullWidth label={<TypoLabel name='Sub Category' />} placeholder='Select sub category' />}
    />
  )
}

export default MenuSubCategorySelector
