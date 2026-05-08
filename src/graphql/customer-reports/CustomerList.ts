import { gql } from '@apollo/client';

export const GET_CUSTOMER_LIST = gql`
 query CustomerDetailList($model: VMRptCustomerListFiltersInput) {
  customerDetailList(model: $model) {
    nodes {
      firstName
      customerId
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
      vMRptCustomerNominees {
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
