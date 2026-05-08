import { gql } from '@apollo/client';

export const GET_PROPERTY_WISE_REPORT = gql`
query InstallmentsSummaryData($model: VMRptSalesSummaryListFiltersInput) {
  installmentsSummaryData(model: $model) {
    nodes {
      agreeId
      propertyNo
      customerName
      plotAmount
      discountAmount
      netAmount
      totalInstAmount
      totalRecAmount
      totalPendingAmount
      totalInInstAmount
      totalInRecAmount
      totalInPendingAmount
      monthWiseAmounts {
        monthYear
        totalAmount
        totalRecAmount
        totalPendingAmount
        totalInAmount
        totalInRecAmount
        totalInPendingAmount

      }
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
