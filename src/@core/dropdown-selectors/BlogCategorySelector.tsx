import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { getBlogCategoriesDropdown } from 'src/store/dropdowns/cms'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import TypoLabel from 'src/custom-components/inputs/TypoLabel'

interface Props {
  selectedValue: string | null
  handleChange: (value: any | null) => void
  disabled?: boolean
  important?: boolean
}

const isMongoObjectId = (value: unknown) => /^[a-fA-F0-9]{24}$/.test(`${value ?? ''}`.trim())

const resolveCategoryId = (item: any) => {
  const candidates = [item?._id, item?.id, item?.categoryId, item?.value]
  const mongoId = candidates.find(isMongoObjectId)
  if (mongoId) return `${mongoId}`.trim()
  const firstTruthy = candidates.find(candidate => `${candidate ?? ''}`.trim())
  return `${firstTruthy ?? ''}`.trim()
}

const BlogCategorySelector = ({ selectedValue, handleChange, disabled = false, important = false }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const categories = useSelector((state: RootState) => state.cmsDropdowns?.blogCategories ?? [])
  const [value, setValue] = useState<any | null>(null)

  useEffect(() => {
    if (!categories.length) dispatch(getBlogCategoriesDropdown())
  }, [dispatch, categories.length])

  const options = useMemo(
    () =>
      categories.map((item: any) => {
        const resolvedId = resolveCategoryId(item)
        return { ...item, _id: resolvedId || item?._id, id: resolvedId || item?.id }
      }),
    [categories]
  )

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
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name='Category' important={important} />} placeholder='Select category' />}
    />
  )
}

export default BlogCategorySelector
