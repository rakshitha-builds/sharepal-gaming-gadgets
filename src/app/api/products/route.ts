import { NextRequest, NextResponse } from "next/server";
import { queryProducts, getCategories, SORTS } from "@/lib/products";
import type { SortKey } from "@/lib/types";

// GET /api/products?q=&category=&sort=&page=
export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const sort = sp.get("sort") as SortKey;
  const result = queryProducts({
    q: sp.get("q") ?? "",
    category: sp.get("category") ?? "All",
    sort: SORTS.includes(sort) ? sort : "popular",
    page: Math.max(1, Number(sp.get("page")) || 1),
  });
  return NextResponse.json({ ...result, categories: getCategories() });
}
