import { gql } from '@apollo/client';

export const GET_TRANSFER_PROPERTY = gql`
  query PropertyTransferDetail($propertyId: Int!) {
  propertyTransferDetail(propertyId: $propertyId) {
    nodes {
      propertyId
      propertyNo
      floorName
      status
      typeName
      formNo
      areaSqft
      ratePerSqft
      areaMarla
      marlaRate
      marlaSize
      orgPrice
      saleablePrice
      prefName
      prefPercentage
      prefAmount
      distAmount
      soldAmount
      secondNo
      regNo
      saleDate
      saleAgentName
      salesAgentIdentityNo
      salesAgentComAmount
      customerName
      customerIdentityNo
      customerContactNo
      customerAddress
      customerEmail
      guardianName
      vMPropertyTransferHistoriesDetail {
        propertyId
        oldCustomerName
        oldCustomerIdentityNo
        oldCustomerContactNo
        oldCustomerAddress
        oldCustomerEmail
        oldGuardianName
        newCustomerName
        newCustomerIdentityNo
        newCustomerContactNo
        newCustomerAddress
        newCustomerEmail
        newGuardianName
        transferDate
        transferBy
        transferCharges
        transferAgentName
        transfersAgentIdentityNo
        transfersAgentComAmount
      }
    }
  }
}
`;
