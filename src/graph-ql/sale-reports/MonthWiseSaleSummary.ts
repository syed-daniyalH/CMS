import { gql } from '@apollo/client';

export const SaleSummaryMonthWise = gql`
 query ExampleQuery($model: VMMonthWiseSaleSummaryFiltersInput, $first: Int, $after: String, $last: Int, $before: String) {
  saleSummaryMonthWise(model: $model, first: $first, after: $after, last: $last, before: $before) {
    nodes {
      monthYear
      noOfProp
      totalAreaMarla
      totalAreaSqft
      avgRatePerMarla
      avgRatePerSqft
      totalDist
      totalSoldValue
      totalAgentComAmount
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
