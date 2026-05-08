import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { getBlogSubCategoriesDropdown } from 'src/store/dropdowns/cms'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import TypoLabel from 'src/custom-components/inputs/TypoLabel'

interface Props {
  selectedValue: string | null
  parentCategoryId?: string | null
  handleChange: (value: any | null) => void
  disabled?: boolean
  important?: boolean
}

const BlogSubCategorySelector = ({ selectedValue, parentCategoryId, handleChange, disabled = false, important = false }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const subCategories = useSelector((state: RootState) => state.cmsDropdowns?.blogSubCategories ?? [])
  const params = useSelector((state: RootState) => state.cmsDropdowns?.blogSubCategoriesParams ?? {})
  const [value, setValue] = useState<any | null>(null)

  useEffect(() => {
    if (!subCategories.length || `${params?.parentCategory ?? ''}` !== `${parentCategoryId ?? ''}`) {
      dispatch(getBlogSubCategoriesDropdown({ parentCategory: parentCategoryId || undefined }))
    }
  }, [dispatch, subCategories.length, parentCategoryId, params?.parentCategory])

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
      disabled={disabled}
      isOptionEqualToValue={(option: any, val: any) => `${option?.id}` === `${val?.id}`}
      getOptionLabel={(option: any) => option?.name || ''}
      renderInput={paramsInput => <CustomTextField {...paramsInput} fullWidth label={<TypoLabel name='Sub Category' important={important} />} placeholder='Select sub category' />}
    />
  )
}

export default BlogSubCategorySelector
