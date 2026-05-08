// ** React Imports
import { useState, forwardRef, useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';

// ** Custom Component Import
import CustomTextField from 'src/core/components/mui/text-field';

// ** Third Party Imports
import format from 'date-fns/format';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

import Icon from 'src/core/components/icon';

// ** Styles
import { useTheme } from "@mui/material/styles";

// ** Utils
import { customDateFormat } from "src/core/utils/format";
import InputAdornment from "@mui/material/InputAdornment";

interface CustomEndPickerProps {
  placeholder: string;
  endDate: Date | string | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}

const CustomEndPicker = ({ placeholder, endDate, onChange, ...props }: CustomEndPickerProps) => {

  const theme = useTheme();
  const { direction } = theme;

  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end';

  // Helper — convert string → Date
  const toValidDate = (d: any): Date | null => {
    if (!d) return null;
    if (d instanceof Date) return d;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const [selected, setSelected] = useState<Date | null>(toValidDate(endDate));

  // Update internal state if prop changes
  useEffect(() => {
    const parsed = toValidDate(endDate);
    setSelected(parsed);
    onChange(parsed);
  }, [endDate]);

  const CustomInput = forwardRef((pickerProps: any, ref) => {
    const formattedDate = selected ? format(selected, customDateFormat) : '';

    return (
      <CustomTextField
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='tabler:calendar' />
            </InputAdornment>
          ),
        }}
        inputRef={ref}
        {...pickerProps}
        value={formattedDate || placeholder || ''}
      />
    );
  });

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <DatePicker
        selected={selected}
        endDate={selected}
        title="To Date"
        monthsShown={1}
        showMonthDropdown
        showYearDropdown
        shouldCloseOnSelect
        id="date-range-picker"
        onChange={(date) => {
          setSelected(date);
          onChange(date);
        }}
        popperPlacement={popperPlacement}
        customInput={<CustomInput />}
        onFocus={(e) => e.target.click()}
        disabled={props.disabled}
        yearDropdownItemNumber={3}
      />
    </Box>
  );
};

export default CustomEndPicker;
