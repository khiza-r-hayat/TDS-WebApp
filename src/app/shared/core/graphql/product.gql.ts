import gql from "graphql-tag";
import { BrandProductsQL, BrandsQL } from "../fragments/brand.fragment";

export const getProductsQL = gql`
  query getProductsQL {
    product {
      ...BrandProductsQL
      brand {
        ...BrandsQL
      }
    }
  }
  ${BrandProductsQL}
  ${BrandsQL}
`;

export const getProductsByBrandQL = gql`
  query getProductsByBrandQL($id: uuid!) {
    product(where: { brandId: { _eq: $id } }) {
      ...BrandProductsQL
      brand {
        ...BrandsQL
      }
    }
  }
  ${BrandProductsQL}
  ${BrandsQL}
`;

export const getProductByIdQL = gql`
  query getProductByIdQL($id: uuid!) {
    product(where: { id: { _eq: $id } }) {
      ...BrandProductsQL
      brand {
        ...BrandsQL
      }
    }
  }
  ${BrandProductsQL}
  ${BrandsQL}
`;

export const deleteProductsQL = gql`
  mutation deleteProductsQL($ids: [uuid!]!) {
    delete_product(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;

export const upsertProductsQL = gql`
  mutation upsertProductsQL($products: [product_insert_input!]!) {
    insert_product(
      objects: $products
      on_conflict: {
        constraint: product_pkey
        update_columns: [name, status, brandId]
      }
    ) {
      affected_rows
    }
  }
`;
