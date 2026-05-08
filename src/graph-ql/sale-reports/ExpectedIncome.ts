import { gql } from '@apollo/client';

export const GET_EXPECTED_INCOME_REPORT = gql`
 query InstallmentsSummaryData($model: VMRptSalesSummaryListFiltersInput, $before: String, $last: Int, $after: String, $first: Int) {
  installmentsSummaryData(model: $model, before: $before, last: $last, after: $after, first: $first) {
    nodes {
      agreeId
      saleDate
      floorName
      typeName
      propertyNo
      propertyStatus
      customerName
      customerIdentityNo
      areaMarla
      ratePerMarla
      areaSqft
      ratePerSqft
      perfrence
      perfrenceAmount
      plotAmount
      discountAmount
      netAmount
      regNo
      agentName
      agentComAmount
         totalInstAmount
      totalPendingAmount
      totalInRecAmount
      totalInPendingAmount

    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
`;
