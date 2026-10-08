"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProductsResponse, SortKey } from "@/lib/types";
import Header, { Wordmark } from "./Header";
import ProductCard from "./ProductCard";
import { FAQ, Footer, OtherTab } from "./Sections";
import { useStore } from "@/lib/store";

const ICON: Record<string, string> = { All: "😀", "PS5 Console": "🎮", "Game Combos": "💿", "Racing Wheel": "🏎️", "PS Portal": "📱" };
type Init = { q: string; category: string; sort: SortKey };

export default function GamingPage({ init, first }: { init: Init; first: ProductsResponse }) {
  const [q, setQ] = useState(init.q);
  const [category, setCategory] = useState(init.category);
  const [sort, setSort] = useState<SortKey>(init.sort);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(first);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("Gaming");
  const [retry, setRetry] = useState(0);
  const { days, setPanel } = useStore();
  const firstRender = useRef(true);


  // Fetch from the REST API whenever filters change; keep the URL shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category !== "All") params.set("category", category);
    if (sort !== "popular") params.set("sort", sort);
    history.replaceState(null, "", `?${params}`.replace(/\?$/, location.pathname));
    if (firstRender.current && page === 1) { firstRender.current = false; return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true); setError(false);
      try {
        params.set("page", String(page));
        const r = await fetch(`/api/products?${params}`, { signal: ctrl.signal });
        if (!r.ok) throw new Error();
        setData(await r.json());
      } catch (e) { if ((e as Error).name !== "AbortError") setError(true); }
      finally { setLoading(false); }
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q, category, sort, page, retry]);

  const reset = () => { setPage(1); };
  return (
    <>
      <Header q={q} onSearch={(v) => { setQ(v); reset(); }} />
      <nav className="tabs"><div>{["Photography","Gaming","Outdoor","Entertainment"].map((t) =>
        <a key={t} href="#" className={t === tab ? "on" : ""} onClick={(e) => { e.preventDefault(); setTab(t); }}>{t}</a>)}</div></nav>
      <main>
        {tab !== "Gaming" ? <OtherTab tab={tab} back={() => setTab("Gaming")} /> : (<>
        <div className="crumb">Home › Bangalore › <b>Gaming gadgets on rent</b></div>
        <motion.section className="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
          <div className="deco l" aria-hidden>🎮</div><div className="deco r" aria-hidden>🕹️</div>
          <h1>Gaming Consoles</h1>
          <p>Rent the latest gaming gadgets from <Wordmark size={24} /> PS5, Xbox, Oculus VR, Racing Wheel on rent.</p>
          <div className="brands"><span>⊗ XBOX</span><i /><span>PS5</span><i /><span>∞ Meta</span></div>
        </motion.section>
        <div className="trust"><span>✔ Zero Deposit</span><span>🚚 Free Delivery</span><span>⭐ Excellent Quality</span><span>💵 Pay on Delivery</span></div>

        <div className="layout">
          <aside className="rail">{data.categories.map((c) => (
            <button key={c} className={c === category ? "on" : ""} onClick={() => { setCategory(c); reset(); }}>
              <span className={`tile ${c === category ? "on" : ""}`}>{ICON[c] ?? "🎮"}</span><span className="lbl">{c}</span>{c === category && <motion.i layoutId="railpill" className="ul" />}</button>))}
          </aside>
          <section>
            <div className="bar"><span>Total items: {data.total} items</span>
              <label>Sort <select value={sort} onChange={(e) => { setSort(e.target.value as SortKey); reset(); }}>
                <option value="popular">Most booked</option><option value="rating">Top rated</option>
                <option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div>
            {error && <div className="empty">⚠️ Couldn&apos;t load products. <button className="link" onClick={() => setRetry((n) => n + 1)}>Retry</button></div>}
            <div className={`grid ${loading ? "loading" : ""}`}>
              <AnimatePresence mode="popLayout">
                {data.items.map((p, i) => (
                  <motion.div key={p.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: .9 }} transition={{ duration: .35, delay: Math.min(i, 8) * .04 }}>
                    <ProductCard p={p} />
                  </motion.div>))}
              </AnimatePresence>
              {!data.items.length && !loading && <div className="empty">😕 No gadgets match your search.</div>}
            </div>
            {data.hasMore && <button className="more" onClick={() => setPage((p) => p + 1)} disabled={loading}>
              {loading ? "Loading…" : `Show more (${data.total - data.items.length} left)`}</button>}
            <div className="promo"><div><b>Earn With Us</b><br />List your gaming gear and earn every month.</div>
              <button onClick={() => window.open("https://sharepal.in", "_blank", "noopener")}>Become a partner</button></div>
          </section>
        </div>

        <h2>Why Gamers Trust SharePal</h2>
        <div className="stats"><div><b>50K+</b>Customers served</div><div><b>₹100 Cr+</b>Saved by renters</div><div><b>₹0</b>Security deposit</div><div><b>Free</b>Delivery &amp; pickup</div></div>
        <h2>Frequently Asked Questions</h2>
        <FAQ /></>)}
      </main>
      <Footer />
      {!days && <motion.button className="dp" initial={{ y: 80 }} animate={{ y: 0 }} onClick={() => setPanel("dates")}>Select rental dates to view prices</motion.button>}
    </>
  );
}
