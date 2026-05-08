import CustomInput from "src/views/forms/form-elements/pickers/PickersCustomInput";
import DatePicker, {ReactDatePickerProps} from "react-datepicker";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {globalDateFormat} from "../../utils/format";
import {useAuth} from "src/hooks/useAuth";
import TypoLabel from "../../../custom-components/inputs/TypoLabel";
import {DatePickerProps} from "@mui/lab";
import {FocusEvent} from "react";
import {clickToSelectDateKey} from "../../utils/translation-file";

type Props = DatePickerProps<any> & {
  label: string | null
  date?: Date | string | null
  important?: boolean | null
  noBorder?: boolean | null
  onChange: (date: Date) => void
  onBlur?: (e: FocusEvent) => void
}

const CustomDatePicker = ({label, date, onChange, onBlur, noBorder = false, important,  ...props} : Props) => {
  const theme = useTheme()
  const {direction} = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const { t } = useTranslation();
  const { user  } = useAuth();

  const handleKeyDown = (e: any) => {
    if (e.key === 'Tab') {
      e.stopPropagation(); // Prevent the datepicker from handling the Tab key
    }
  };

  return (
    <DatePicker
      selected={date ? new Date(date) : null}
      id={`${label}-basic-input`}
      showMonthDropdown
      showYearDropdown
      popperPlacement={popperPlacement}
      onKeyDown={(e) => handleKeyDown(e)}
      dateFormat={user?.dateFormat??globalDateFormat}
      onChange={onChange}
      placeholderText={t(clickToSelectDateKey) as string}
      {...props}
      excludeScrollbar={true}
      onBlur={onBlur ? (e: FocusEvent<Element, Element>) => onBlur!(e) : undefined}
      customInput={<CustomInput fullWidth noBorder={noBorder} label={label ? <TypoLabel name={t(label??"")} important={important??false} /> : null}/>}
    />
  )
}

export default CustomDatePicker;
