import GamingPage from "@/components/GamingPage";
import { queryProducts, getCategories, SORTS } from "@/lib/products";
import type { SortKey } from "@/lib/types";

type SP = { q?: string; category?: string; sort?: string };
export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const sort = (SORTS.includes(sp.sort as SortKey) ? sp.sort : "popular") as SortKey;
  const init = { q: sp.q ?? "", category: sp.category ?? "All", sort };
  return <GamingPage init={init} first={{ ...queryProducts({ ...init, page: 1 }), categories: getCategories() }} />;
}
