export type Product = { id:number; name:string; image:string; rating:number; booked_count:number; tag:string; per_day_rent:number; out_of_stock:boolean };
export type SortKey = "popular" | "rating" | "price-asc" | "price-desc";
export type ProductQuery = { q?:string; category?:string; sort?:SortKey; page?:number; limit?:number };
export type ProductsResponse = { items:Product[]; total:number; hasMore:boolean; categories:string[] };
