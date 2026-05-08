import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import Chip from '@mui/material/Chip'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import axiosInstance from 'src/core/utils/axiosInstence'

export type TechnologyServiceOption = { id: string; slug: string; name: string }

const extractObjectId = (value: any): string => {
  if (typeof value === 'string') {
    const raw = value.trim()
    if (!raw) return ''

    const objectIdCtorMatch = raw.match(/ObjectId\('([a-fA-F0-9]{24})'\)/)
    if (objectIdCtorMatch?.[1]) return objectIdCtorMatch[1]

    const quotedIdMatch = raw.match(/["_']_id["_']\s*:\s*["']([a-fA-F0-9]{24})["']/)
    if (quotedIdMatch?.[1]) return quotedIdMatch[1]

    const plainIdMatch = raw.match(/\b([a-fA-F0-9]{24})\b/)
    if (plainIdMatch?.[1]) return plainIdMatch[1]
    return raw
  }

  if (value && typeof value === 'object') {
    const nested = value?._id ?? value?.id ?? ''
    return extractObjectId(nested)
  }
  return ''
}

export const serviceIdsFromPopulated = (services: unknown): string[] => {
  if (!Array.isArray(services)) return []
  return services.map((s: any) => extractObjectId(s?.id ?? s?._id ?? s)).filter(Boolean)
}

const normalizeOptions = (res: any): TechnologyServiceOption[] => {
  const data = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
  return data
    .map((item: any) => ({
      id: extractObjectId(item?.id ?? item?._id ?? item),
      slug: `${item?.slug ?? ''}`.trim(),
      name: `${item?.name ?? item?.title ?? ''}`.trim()
    }))
    .filter((item: TechnologyServiceOption) => item.id)
}

type Props = {
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  label?: string
}

const TechnologyServicesMultiSelect = ({ value, onChange, disabled, label = 'Services' }: Props) => {
  const [options, setOptions] = useState<TechnologyServiceOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get('/api/menu-structure/services')
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
    return value.map(id => byId.get(id)).filter(Boolean) as TechnologyServiceOption[]
  }, [options, value])

  const handleChange = (_e: SyntheticEvent, next: TechnologyServiceOption[]) => {
    onChange(next.map(o => o.id))
  }

  return (
    <CustomAutocomplete<TechnologyServiceOption, true, false, false>
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
      renderInput={params => <CustomTextField {...params} fullWidth label={label} placeholder='Select services' />}
    />
  )
}

export default TechnologyServicesMultiSelect
