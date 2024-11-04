/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Categories {
    KITCHEN = "KITCHEN",
    TECH = "TECH",
    CAR = "CAR"
}

export class CreateOrderInput {
    status?: Nullable<string>;
    products: OrderedProductInput[];
}

export class OrderedProductInput {
    id: string;
    orderedQuantity: number;
}

export class VendorInput {
    name: string;
    bio?: Nullable<string>;
}

export class CreateProductInput {
    name: string;
    quantity: number;
    price: number;
    category?: Nullable<Categories>;
    tags: string[];
    vendor?: Nullable<VendorInput>;
}

export class UpdateProductInput {
    name: string;
    quantity: number;
    price: number;
    category?: Nullable<Categories>;
    tags: string[];
    vendor?: Nullable<VendorInput>;
}

export class Order {
    id: string;
    status: string;
    products: OrderedProducts[];
}

export class OrderDetails {
    id: string;
    status: string;
    products: OrderedProductsDetailed[];
}

export class OrderedProductsDetailed {
    product: Product;
    capturedName: string;
    capturedPrice: number;
    orderedQuantity: number;
}

export class OrderedProducts {
    product: string;
    capturedName: string;
    capturedPrice: number;
    orderedQuantity: number;
}

export abstract class IQuery {
    orders: Order[];
    order?: OrderDetails;
    products: Product[];
    product?: Product;
}

export abstract class IMutation {
    createOrder?: Order;
    createProduct?: Product;
    updateProduct?: Product;
    deleteProduct?: Product;
}

export class Vendor {
    name: string;
    bio?: Nullable<string>;
}

export class Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
    category?: Nullable<Categories>;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    vendor?: Nullable<Vendor>;
}

type Nullable<T> = T | null;
