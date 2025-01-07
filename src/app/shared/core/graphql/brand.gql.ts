import gql from "graphql-tag";
import {
  BrandProductsQL,
  BrandsQL,
  TenantBrandsQL,
} from "../fragments/brand.fragment";

export const getTenantBrandQL = gql`
  query getTenantBrandQL($id: uuid!) {
    brand(where: { tenantId: { _eq: $id } }) {
      ...TenantBrandsQL
    }
  }
  ${TenantBrandsQL}
`;

export const getTenantBrandWithoutProductsQL = gql`
  query getTenantBrandWithoutProductsQL($id: uuid!) {
    brand(where: { tenantId: { _eq: $id } }) {
      ...BrandsQL
      products {
        id
      }
    }
  }
  ${BrandsQL}
`;

export const getBrandByIdQL = gql`
  query getBrandByIdQL($id: uuid!) {
    brand(where: { id: { _eq: $id } }) {
      ...TenantBrandsQL
    }
  }
  ${TenantBrandsQL}
`;

export const getProductByIdInQL = gql`
  query getProductByIdInQL($ids: [uuid!]!) {
    product(where: { id: { _in: $ids } }) {
      ...BrandProductsQL
    }
  }
  ${BrandProductsQL}
`;

export const deleteBrandsQL = gql`
  mutation deleteBrandsQL($ids: [uuid!]!) {
    delete_brand(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;

export const upsertBrandsQL = gql`
  mutation upsertBrandsQL($brands: [brand_insert_input!]!) {
    insert_brand(
      objects: $brands
      on_conflict: { constraint: brand_pkey, update_columns: [name, status] }
    ) {
      affected_rows
    }
  }
`;
