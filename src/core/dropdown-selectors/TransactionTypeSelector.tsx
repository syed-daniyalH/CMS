// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {getDateRange} from "../utils/format";
import {useAuth} from "../../hooks/useAuth";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import Box from "@mui/material/Box";


interface DropdownObj {
  name: string
  value: string
}

const statuses: DropdownObj[] = [
  { name: "Customer Advance", value: "CustomerAdvance" },
  { name: "Customer Receivings", value: "CustomerPayment" },
  { name: "Transfer From Another Account", value: "TransferFromAccount" },
  { name: "Other Income", value: "OtherIncome" },
  { name: "Expense Refund", value: "ExpenseRefund" },
  { name: "Deposit From Other Account", value: "DepositFromAccounts" },
  { name: "Owner's Contribution", value: "OwnerContribution" },
  { name: "Supplier Refund", value: "VendorCreditRefund" },
  { name: "Supplier Payment Refund", value: "VendorPaymentRefund" },
  { name: "Supplier Advance", value: "VendorAdvance" },
  { name: "Supplier Payments", value: "VendorPayment" },
  { name: "Transfer To Another Account", value: "TransferToAccount" },
  { name: "Card Payment", value: "CardPayment" },
  { name: "Payment Refund", value: "PaymentRefund" },
  { name: "Deposit To Other Account", value: "DepositToAccounts" },
  { name: "Owner's Drawing", value: "OwnerDrawings" },
  { name: "Credit Note Refund", value: "CreditNoteRefund" }
]

interface Props {
  selected_value: string | null
  handleChange: (value: string | null) => void
  props?: TextFieldProps
}

const TransactionTypeSelector = ({selected_value, handleChange, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(statuses.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      } else {
        setObject(statuses.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, statuses])


  const onChange = (event: any, value: DropdownObj) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={statuses}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      disableClearable
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderOption={(props, option) => {
        const { ...optionProps } = props;
        return (
          <Box
            key={option.value}
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            {option.name}
          </Box>
        );
      }}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Transaction Type')} placeholder={t("Transaction Type") as string} {...(props??{})} />}
    />
  )
}

export default TransactionTypeSelector;
