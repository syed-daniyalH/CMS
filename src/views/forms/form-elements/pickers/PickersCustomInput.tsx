// ** React Imports
import {forwardRef, ReactNode} from 'react'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import {TextFieldProps} from "@mui/material/TextField";

interface PickerProps {
  label?: ReactNode | string
  placeholder?: string
  readOnly?: boolean
  fullWidth?: boolean,
  noBorder?: boolean | null,
  sx?: any
}

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, readOnly, noBorder } = props

  return (
    <CustomTextField
      {...props}
      inputRef={ref}
      noBorder={noBorder??false}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

export default PickersComponent
