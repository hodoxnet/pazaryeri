export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  parentCategoryId: number;
  brandId?: number;
  brand?: Brand;
  category?: Category;
  merchant?: Merchant;
  variants: ProductVariant[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  price: number;
  originalPrice?: number;
  stock: number;
  barcode: string;
  sku: string;
  thumbnails: ProductImage[];
  options: ProductVariantOption[];
}

export interface ProductVariantOption {
  title: string;
  value: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt?: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentCategoryId?: number | null;
  imageUrl?: string;
  children?: Category[];
  attributes?: CategoryAttribute[];
}

export interface CategoryAttribute {
  inputType: string;
  label: string;
  options?: string[];
}

export interface Merchant {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  rating?: number;
}

export enum ProductStatus {
  Active = 0,
  Inactive = 1,
  Draft = 2,
  Archived = 3,
}

export interface ProductComment {
  id: number;
  productId: number;
  memberId: number;
  memberName: string;
  starCount: number;
  text: string;
  createdAt: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  status?: ProductStatus;
  sortBy?: SortBy;
  search?: string;
  categoryId?: number;
  merchantId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export enum SortBy {
  Newest = 0,
  Oldest = 1,
  PriceAsc = 2,
  PriceDesc = 3,
  Popular = 4,
  Rating = 5,
  NameAsc = 6,
  NameDesc = 7,
}
