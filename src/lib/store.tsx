"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/types";

export type Item = { p: Product; qty: number };
export type User = { name: string; phone: string };
export type Panel = "cart" | "login" | "dates" | null;
type Ctx = {
  items: Item[]; count: number; add: (p: Product) => void; setQty: (id: number, q: number) => void; clear: () => void;
  days: number; range: string; setDates: (d: number, r: string) => void;
  user: User | null; setUser: (u: User | null) => void;
  panel: Panel; setPanel: (p: Panel) => void; say: (m: string) => void;
};
const C = createContext<Ctx | null>(null);
export const useStore = () => { const c = useContext(C); if (!c) throw new Error("Wrap in <StoreProvider>"); return c; };

// Safe localStorage helpers (can throw in private mode / SSR).
const load = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [days, setDays] = useState(0);
  const [range, setRange] = useState("");
  const [user, setUserState] = useState<User | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [toast, setToast] = useState("");
  const ready = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { // hydrate after mount to avoid SSR mismatch
    setItems(load("sp.cart", [])); const d = load("sp.dates", { days: 0, range: "" });
    setDays(d.days); setRange(d.range); setUserState(load("sp.user", null)); ready.current = true;
  }, []);
  useEffect(() => { if (ready.current) save("sp.cart", items); }, [items]);
  useEffect(() => { if (ready.current) save("sp.dates", { days, range }); }, [days, range]);

  const say = useCallback((m: string) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(""), 1900); }, []);
  const add = useCallback((p: Product) => {
    setItems((l) => l.some((i) => i.p.id === p.id) ? l.map((i) => i.p.id === p.id ? { ...i, qty: Math.min(i.qty + 1, 9) } : i) : [...l, { p, qty: 1 }]);
    say("Added to cart");
  }, [say]);
  const setQty = useCallback((id: number, q: number) => setItems((l) => q < 1 ? l.filter((i) => i.p.id !== id) : l.map((i) => i.p.id === id ? { ...i, qty: Math.min(q, 9) } : i)), []);
  const value = useMemo<Ctx>(() => ({
    items, count: items.reduce((s, i) => s + i.qty, 0), add, setQty, clear: () => setItems([]),
    days, range, setDates: (d, r) => { setDays(d); setRange(r); },
    user, setUser: (u) => { setUserState(u); save("sp.user", u); }, panel, setPanel, say,
  }), [items, days, range, user, panel, add, setQty, say]);
  return <C.Provider value={value}>{children}<div className={`toast ${toast ? "on" : ""}`} role="status">{toast}</div></C.Provider>;
}
