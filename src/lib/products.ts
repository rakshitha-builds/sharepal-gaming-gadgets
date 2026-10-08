import data from "@/data/product-list.json";
import type { Product, ProductQuery, SortKey } from "./types";

const all = data.products as Product[];
export const SORTS: SortKey[] = ["popular", "rating", "price-asc", "price-desc"];

/** Derive a filter category from the product name. */
export function getCategory(p: Product): string {
  if (/portal/i.test(p.name)) return "PS Portal";
  if (/wheel/i.test(p.name)) return "Racing Wheel";
  if (/digital game|fc2\d|cricket/i.test(p.name)) return "Game Combos";
  return "PS5 Console";
}
export const getCategories = () => ["All", ...Array.from(new Set(all.map(getCategory)))];

/** Filter + sort + paginate (page N returns the first N*limit items, for "Show more"). */
export function queryProducts({ q = "", category = "All", sort = "popular", page = 1, limit = 12 }: ProductQuery) {
  const term = q.trim().toLowerCase();
  const list = all
    .filter((p) => (category === "All" || getCategory(p) === category) && p.name.toLowerCase().includes(term))
    .sort((a, b) =>
      sort === "rating" ? b.rating - a.rating
      : sort === "price-asc" ? a.per_day_rent - b.per_day_rent
      : sort === "price-desc" ? b.per_day_rent - a.per_day_rent
      : b.booked_count - a.booked_count);
  const items = list.slice(0, page * limit);
  return { items, total: list.length, hasMore: items.length < list.length };
}
export const rentalPrice = (perDay: number, days: number) => Math.round(perDay * Math.max(days, 1));
