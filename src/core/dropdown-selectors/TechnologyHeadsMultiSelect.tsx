import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import Chip from '@mui/material/Chip'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import axiosInstance from 'src/core/utils/axiosInstence'

export type TechnologyHeadOption = { id: string; slug: string; name: string }

export const headIdsFromPopulated = (heads: unknown): string[] => {
  if (!Array.isArray(heads)) return []
  return heads.map((h: any) => `${h?.id ?? h?._id ?? ''}`.trim()).filter(Boolean)
}

const normalizeOptions = (res: any): TechnologyHeadOption[] => {
  const data = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
  return data
    .map((item: any) => ({
      id: `${item?.id ?? item?._id ?? ''}`.trim(),
      slug: `${item?.slug ?? ''}`.trim(),
      name: `${item?.name ?? ''}`.trim()
    }))
    .filter((item: TechnologyHeadOption) => item.id)
}

type Props = {
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  label?: string
}

const TechnologyHeadsMultiSelect = ({ value, onChange, disabled, label = 'Technology heads' }: Props) => {
  const [options, setOptions] = useState<TechnologyHeadOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get('/api/menu-structure/technology-heads')
        if (!cancelled) setOptions(normalizeOptions(res))
      } catch {
        if (!cancelled) setOptions([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const selected = useMemo(() => {
    const byId = new Map(options.map(o => [o.id, o]))
    return value.map(id => byId.get(id)).filter(Boolean) as TechnologyHeadOption[]
  }, [options, value])

  const handleChange = (_e: SyntheticEvent, next: TechnologyHeadOption[]) => {
    onChange(next.map(o => o.id))
  }

  return (
    <CustomAutocomplete<TechnologyHeadOption, true, false, false>
      multiple
      options={options}
      value={selected}
      onChange={handleChange}
      disabled={disabled || loading}
      loading={loading}
      disableCloseOnSelect
      isOptionEqualToValue={(option, val) => option.id === val.id}
      getOptionLabel={option => (typeof option === 'string' ? option : option.name || option.slug || option.id)}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip {...getTagProps({ index })} key={option.id} size='small' label={option.name || option.slug || option.id} />
        ))
      }
      renderInput={params => <CustomTextField {...params} fullWidth label={label} placeholder='Select technology heads' />}
    />
  )
}

export default TechnologyHeadsMultiSelect
