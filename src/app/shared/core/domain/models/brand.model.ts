export interface BrandModel {
  id: string;
  tenantId: string;
  name: string;
  status: boolean;
  createdAt: Date | string;
  products: ProductModel[];
}

export interface BrandResponse {
  id: string;
  tenantId: string;
  name: string;
  status: boolean;
  createdAt: Date | string;
  products: ProductModel[];
}

export interface ProductModel {
  id: string;
  brandId: string;
  name: string;
  status: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  status: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  brand: BrandModel;
}

export interface ProductResponse {
  id: string;
  brandId: string;
  name: string;
  status: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BrandUpload {
  id: string;
  tenantId: string;
  name: string;
  status: boolean;
}

export interface ProductUpload {
  id: string;
  brandId: string;
  name: string;
  status: boolean;
}
