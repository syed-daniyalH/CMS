import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import Chip from '@mui/material/Chip'
import CustomAutocomplete from '../components/mui/autocomplete'
import CustomTextField from '../components/mui/text-field'
import axiosInstance from 'src/core/utils/axiosInstence'

export type IndustryOption = { id: string; slug: string; name: string; type?: string }

const extractObjectId = (value: any): string => {
  if (typeof value === 'string') {
    const raw = value.trim()
    if (!raw) return ''

    // Handles malformed payloads like: "{ _id: new ObjectId('...'), ... }"
    const objectIdCtorMatch = raw.match(/ObjectId\('([a-fA-F0-9]{24})'\)/)
    if (objectIdCtorMatch?.[1]) return objectIdCtorMatch[1]

    // Handles JSON-like fragments containing _id.
    const quotedIdMatch = raw.match(/["_']_id["_']\s*:\s*["']([a-fA-F0-9]{24})["']/)
    if (quotedIdMatch?.[1]) return quotedIdMatch[1]

    const plainIdMatch = raw.match(/\b([a-fA-F0-9]{24})\b/)
    if (plainIdMatch?.[1]) return plainIdMatch[1]
    return raw
  }

  if (value && typeof value === "object") {
    const nested = value?._id ?? value?.id ?? ''
    return extractObjectId(nested)
  }
  return ''
}

/** Map populated `industries` from menu-structure service/sub-service detail to id list for the form. */
export const industryIdsFromPopulated = (industries: unknown): string[] => {
  if (!Array.isArray(industries)) return []
  return industries
    .map((i: any) => extractObjectId(i?.id ?? i?._id ?? i))
    .filter(Boolean)
}

const normalizeOptions = (res: any): IndustryOption[] => {
  const data = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
  return data
    .map((item: any) => ({
      id: extractObjectId(item?.id ?? item?._id ?? item),
      slug: `${item?.slug ?? ''}`.trim(),
      name: `${item?.name ?? item?.title ?? ''}`.trim(),
      type: item?.type != null ? `${item.type}` : undefined
    }))
    .filter((item: IndustryOption) => item.id)
}

type Props = {
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  label?: string
}

const ServiceIndustriesMultiSelect = ({ value, onChange, disabled, label = 'Industries' }: Props) => {
  const [options, setOptions] = useState<IndustryOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get('/api/frontend/dropdowns/industries')
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
    return value.map(id => byId.get(id)).filter(Boolean) as IndustryOption[]
  }, [options, value])

  const handleChange = (_e: SyntheticEvent, next: IndustryOption[]) => {
    onChange(next.map(o => o.id))
  }

  return (
    <CustomAutocomplete<IndustryOption, true, false, false>
      multiple
      options={options}
      value={selected}
      onChange={handleChange}
      disabled={disabled || loading}
      loading={loading}
      disableCloseOnSelect
      isOptionEqualToValue={(option, val) => option.id === val.id}
      getOptionLabel={option => {
        if (typeof option === 'string') return option
        const base = option.name || option.slug || option.id
        return option.type ? `${base} (${option.type})` : base
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip {...getTagProps({ index })} key={option.id} size='small' label={option.name || option.slug || option.id} />
        ))
      }
      renderInput={params => <CustomTextField {...params} fullWidth label={label} placeholder='Select industries' />}
    />
  )
}

export default ServiceIndustriesMultiSelect
