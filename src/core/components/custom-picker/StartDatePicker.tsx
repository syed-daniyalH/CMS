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

interface CustomStartPickerProps {
  placeholder: string;
  startDate: Date | string | null;
  onChange: (startDate: Date | null) => void;
  disabled?: boolean;
}

const CustomStartPicker = ({ placeholder, startDate, onChange, ...props }: CustomStartPickerProps) => {

  const theme = useTheme();
  const { direction } = theme;

  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end';

  // Helper — always convert string → Date
  const toValidDate = (d: any): Date | null => {
    if (!d) return null;
    if (d instanceof Date) return d;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // Store selected date
  const [selected, setSelected] = useState<Date | null>(toValidDate(startDate));

  // Whenever incoming startDate changes, update internal state
  useEffect(() => {
    const parsed = toValidDate(startDate);
    setSelected(parsed);
    onChange(parsed);
  }, [startDate]);

  // Input UI
  const CustomInput = forwardRef((pickerProps: any, ref) => {
    const formattedDate =
      selected !== null ? format(selected, customDateFormat) : '';

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
        startDate={selected}
        title={"From Date"}
        monthsShown={1}
        showMonthDropdown
        showYearDropdown
        shouldCloseOnSelect={true}
        id='date-range-picker-d-months'
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

export default CustomStartPicker;
