// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {getDateRange} from "../utils/format";
import {useAuth} from "../../hooks/useAuth";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";


interface DropdownObj {
  name: string
  value: string
}

const frequencies: DropdownObj[] = [
  {
    name: "Cash",
    value: "Cash"
  },
  {
    name: "Cheque",
    value: "Cheque"
  },
  {
    name: "Cross Cheque",
    value: "Cross Cheque"
  },
  {
    name: "Online Payment",
    value: "Online Payment"
  },
  {
    name: "Voucher",
    value: "Voucher"
  }
]

interface Props {
  selected_value: string | null
  handleChange: (method: string | null) => void
  disabled?: boolean | null
  props?: TextFieldProps
}

const PaymentMethodSelector = ({selected_value, handleChange, disabled = false, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(frequencies.find((element: any) => `${element.value}` === `${selected_value}`)??{
          name: "Cash",
          value: "cash"
        })
      } else {
        setObject(frequencies.find((element: any) => `${element.value}` === `${selected_value}`)??{
          name: "Cash",
          value: "cash"
        })
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, frequencies])


  const onChange = (event: any, value: DropdownObj | null) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={frequencies}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      isOptionEqualToValue={(option => option.name === selected_value)}
      disableClearable
      disabled={disabled??false}
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Payment Method')} placeholder={t("Payment Method") as string} {...(props??{})} />}
    />
  )
}

export default PaymentMethodSelector;
