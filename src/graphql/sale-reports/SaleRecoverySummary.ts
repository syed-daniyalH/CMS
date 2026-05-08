import { gql } from '@apollo/client';

export const GET_SALE_SUMMARY_LIST = gql`
  query ExampleQuery($model: VMRptSalesAgingFiltersInput) {

  salesExpectedAgingData(model: $model) {
    nodes {
      floorName
      typeName
      propNo
      areaSqft
      ratePerSqft
      areaMarla
      ratePerMarla
      customerName
      customerIndentityNo
      customerPhoneNo
      statusName
      regNo
      secondNo
      prefrence
      saleDate
      propertyAmount
      prefAmount
      saleableAmount
      distAmount
      soldAmount
      totalReceviable
      totalPaid
      totalIncludedReceviable
      totalIncludedPaid
      totalExcludedReceviable
      totalExcludedPaid
      totalReceviableTillDate
      totalPaidTillDate
      totalIncludedReceviableTillDate
      totalIncludedPaidTillDate
      totalExcludedReceviableTillDate
      totalExcludedPaidTillDate
      installmentAgingDetailLists {
        dueDate
        installmentType
        receviableAmount
        paidAmount
        receviableAmountTillDate
        paidAmountTillDate
      }
    }
  }
}
`;
