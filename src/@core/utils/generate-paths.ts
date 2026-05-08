    import {encodeParameters} from "./encrypted-params";

    interface VoucherTypes {
      [key: string]: VoucherType;
      CA: VoucherType;
      CP: VoucherType;
      TFA: VoucherType;
      OI: VoucherType;
      ER: VoucherType;
      DOA: VoucherType;
      OC: VoucherType;
      VCR: VoucherType;
      VPR: VoucherType;
      VA: VoucherType;
      VP: VoucherType;
      TTA: VoucherType;
      CRP: VoucherType;
      OD: VoucherType;
      DTA: VoucherType;
      CNR: VoucherType;
      PR: VoucherType;

    }

    interface VoucherType {
      type: string;
      uri: string;
      formType: string;
      listType: string;
      voucherType: string;
    }

    const tabs : VoucherTypes = {
      CA: { type: 'CustomerAdvance', uri: '/Recoveries', formType: 'Recoveries', listType: 'DC NOTE', voucherType: "CA" },
      CP: { type: 'CustomerPayment', uri: '/Recoveries', formType: 'Recoveries', listType: 'DC NOTE', voucherType: "CP" },
      TFA: { type: 'TransferFromAccount', uri: '/Recoveries', formType: 'Recoveries', listType: 'Recoveries', voucherType: "TFA" },
      OI: { type: 'OtherIncome', uri: '/CRV', formType: 'CRV', listType: 'DC NOTE', voucherType: "OI" },
      ER: { type: 'ExpenseRefund', uri: '/CRV', formType: 'CRV', listType: 'CRV', voucherType: "ER" },
      DOA: { type: 'DepositFromAccounts', uri: '/Recoveries', formType: 'Recoveries', listType: 'DC NOTE', voucherType: "DOA" },
      OC: { type: 'OwnerContribution', uri: '/CRV', formType: 'CRV', listType: 'CRV', voucherType: "OC" },
      VCR: { type: 'VendorCreditRefund', uri: '/Recoveries', formType: 'Recoveries', listType: 'DC NOTE', voucherType: "VCR" },
      VPR: { type: 'VendorPaymentRefund', uri: '/Recoveries', formType: 'Recoveries', listType: 'DC NOTE', voucherType: "VPR" },
      VA: { type: 'VendorAdvance', uri: '/Payments', formType: 'Payments', listType: 'DCNOTE(Payment)', voucherType: "VA" },
      VP: { type: 'VendorPayment', uri: '/Payments', formType: 'Payments', listType: 'DCNOTE(Payment)', voucherType: "VP" },
      TTA: { type: 'TransferToAccount', uri: '/Payments', formType: 'Payments', listType: 'DCNOTE(Payment)', voucherType: "TTA" },
      CRP: { type: 'CardPayment', uri: '/Payments', formType: 'Payments', listType: 'DCNOTE(Payment)', voucherType: "CRP" },
      OD: { type: 'OwnerDrawings', uri: '/CPV', formType: 'CPV', listType: 'CPV', voucherType: "OD" },
      DTA: { type: 'DepositToAccounts', uri: '/CPV', formType: 'CPV', listType: 'CPV', voucherType: "DTA" },
      CNR: { type: 'CreditNoteRefund', uri: '/Payments', formType: 'Payments', listType: 'DCNOTE(Payment)', voucherType: "CNR" },
      PR: { type: 'PaymentRefund', uri: '/Payments', formType: 'Payments', listType: 'DCNOTE(Payment)', voucherType: "PR" }
    }

    export const getUrlForTransactionPath = (source: string | null, folio: string | null, recordNo: number | null, coaId: number | null): string => {
      let url = '';

      if(recordNo && source && folio) {

      if(source.toLowerCase() === 'recovery' && folio.toLowerCase() === 'ca') {
          url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
        }
      else if(source.toLowerCase() === 'recovery' && folio.toLowerCase() === 'vcr') {
          url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
        }
      else if(source.toLowerCase() === 'recovery' && folio.toLowerCase() === 'cp') {
          url = `/financial-operations/sales/recoveries/recovery-list/?recoveryNo=${recordNo}`
        }

      else if(source.toLowerCase() === 'recovery'&& folio.toLowerCase() === 'tfa') {
          url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
        }
      else if(source.toLowerCase() === 'recovery' && folio.toLowerCase() === 'doa') {
          url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
        }
      else if(source.toLowerCase() === 'recovery'&& folio.toLowerCase() === 'vpr') {
          url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
        }

      else if(source.toLowerCase() === 'payment' && folio.toLowerCase() === 'vp') {
        url = `/financial-operations/purchases/payments/payment-list/?paymentNo=${recordNo}`
      }
      else if(source.toLowerCase() === 'payment'&& folio.toLowerCase() === 'va') {
        url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
      }
      else if(source.toLowerCase() === 'payment'&& folio.toLowerCase() === 'tta') {
        url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
      }
            else if(source.toLowerCase() === 'payment'&& folio.toLowerCase() === 'crp') {
        url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
      }
             else if(source.toLowerCase() === 'payment'&& folio.toLowerCase() === 'pr') {
        url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
      }
             else if(source.toLowerCase() === 'payment'&& folio.toLowerCase() === 'cnr') {
        url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
      }
             else if(source.toLowerCase() === 'crv1') {
        url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
      }
             else if(source.toLowerCase() === 'cpv1') {
        url = `/financial-operations/cash-and-banks/account-details/${encodeParameters({recno: coaId})}/?transationNo=${recordNo}&&source=${source}&&folio=${folio}`
      }


        else if(source.toLowerCase() === 'cpv1') {
          url = `apps/receiving/transactions/${coaId}?p_recno=${recordNo}&p_form_type=${tabs[folio].type}`
        }
        else if(source.toLowerCase() === 'crv1') {
          url = `apps/receiving/transactions/${coaId}?p_recno=${recordNo}&p_form_type=${tabs[folio].type}`
        }
        else if (source.toLowerCase() === `inv`) {
          url = `/financial-operations/sales/invoices/invoice-list?invoiceNo=${recordNo}`
        }
        else if (source.toLowerCase() === `exp`) {
          url = `/financial-operations/purchases/expenses/expense-list/?expenseNo=${recordNo}`
        }
        else if (source.toLowerCase() === `ipv`) {
          url = `/financial-operations/purchases/bills/bills-list/?billNo=${recordNo}`
        }
        else if (source.toLowerCase() === `srv`) {
          url = `/financial-operations/sales/invoice-return/return-list/?invoiceNo=${recordNo}`
        }
        else if (source.toLowerCase() === `jv1`) {
          url = `/business-operations/accounts/journals/journal-list?jvNo=${recordNo}`
        } else if (source.toLowerCase() === `prv`) {
          url = `/financial-operations/purchases/bills-return/bills-list/?billNo=${recordNo}`
        }

        else if (source.toLowerCase() === `coa1vendor`) {
          url = `/financial-operations/purchases/suppliers/suppliers-list/?supplier=${recordNo}`
        }
        else if (source.toLowerCase() === `coa1customer`) {
          url = `/financial-operations/sales/customers/customers-list?customer=${recordNo}`
        }
        else if (source.toLowerCase() === `itl`) {
          url = `/financial-operations/purchases/suppliers/suppliers-list/?supplier=${recordNo}`
        }
        else if (source.toLowerCase() === `ril`) {
          url = `/financial-operations/purchases/suppliers/suppliers-list/?supplier=${recordNo}`
        }
        else if (source.toLowerCase() === 'cu1') {
          url = `/financial-operations/sales/customers/customers-list?customer=${recordNo}`;
        }
        else if (source.toLowerCase() === 'it') {
          url = `/apps/inventory/items/list?itemNo=${recordNo}`;
        }
        else if (source.toLowerCase() === 'po') {
          url = `/financial-operations/purchases/purchase-order/purchase-order-list?poNo=${recordNo}`;
        }
        else if (source.toLowerCase() === 'es') {
          url = `/financial-operations/sales/estimates/estimates-list?estimateNo=${recordNo}`;
        }
        else if (source.toLowerCase() === 'pr') {
          url = `/financial-operations/purchases/purchase-request/purchase-request-list/?prNo=${recordNo}`;
        }
        else if (source.toLowerCase() === 'dm') {
          url = `/business-operations/stock/demand/demand-list?demandNo=${recordNo}`;
        }
        else if (source.toLowerCase() === 'grn') {
          url = `/financial-operations/purchases/goods-receive-notes/grn-list?prNo=${recordNo}`;
        }
        else if (source.toLowerCase() === 'deliveryorder') {
          url = `/financial-operations/sales/delivery-notes/delivery-notes-list?DnNo=${recordNo}`;
        }
        else if (source.toLowerCase() === 'itls') {
          url = `/business-operations/stock/issue-to-location/itl-list?ITLNo=${recordNo}`;
        }
        else if (source.toLowerCase() === 'rils') {
          url = `/business-operations/stock/receipt-in-location/ril-list?RILNo=${recordNo}`;
        }
      }

      return url;
    }
