// ** React Imports
import {forwardRef, ReactNode} from 'react'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

interface PickerProps {
  label?: ReactNode | string
  placeholder?: string
  readOnly?: boolean
  fullWidth?: boolean,
  sx?: any
}

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, readOnly } = props

  return (
    <CustomTextField
      {...props}
      inputRef={ref}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

export default PickersComponent
