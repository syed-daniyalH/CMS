import { gql } from '@apollo/client';

export const GET_INSTALLMENT_PLAN = gql`
  query Nodes($propertyId: Int!) {
  singlePropertyData(propertyId: $propertyId) {
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
      agentName
      agentIdentityNo
      agentComAmount
      installmentSummary {
        installmentId
        instNo
        isCharged
        instTypeDesc
        instAmount
        recAmount
        dueDate
        vMRptInstRecevingDetails {
          refId
          recepitId
          recepitNo
          recepitDate
          payementModeDesc
          amount
        }
      }
      customerDetail {
        customerId
        firstName
        secondName
        gender
        customerType
        identityNo
        identityExpDate
        isActive
        guardianName
        dob
        nationality
        city
        country
        tempAddress
        permAddress
        email
        phone1
        phone2
        remarks
        passNo
        passExpDate
        imageUrl
      }
      customerNominees {
        name
        email
        phone
        relation
        identityNo
        identityExp
        address
        remarks
      }
    }
    totalCount
  }
}
`;
