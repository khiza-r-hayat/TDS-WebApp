import gql from "graphql-tag";

export const BrandProductsQL = gql`
  fragment BrandProductsQL on product {
    id
    brandId
    name
    status
    createdAt
    updatedAt
  }
`;

export const TenantBrandsQL = gql`
  fragment TenantBrandsQL on brand {
    id
    tenantId
    name
    status
    createdAt
    products(order_by: { name: asc }) {
      ...BrandProductsQL
    }
  }
  ${BrandProductsQL}
`;

export const BrandsQL = gql`
  fragment BrandsQL on brand {
    id
    tenantId
    name
    status
    createdAt
  }
`;
