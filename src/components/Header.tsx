"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

type Props = { q: string; onSearch: (v: string) => void };
const CITIES = ["Bangalore", "Delhi", "Mumbai", "Hyderabad", "Pune", "Chennai"];

export function Wordmark({ size = 34 }: { size?: number }) {
  return <span className="wm" style={{ fontSize: size }}>Share<em>Pal</em></span>;
}
const Cal = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>;

export default function Header({ q, onSearch }: Props) {
  const { count, range, user, setPanel, say } = useStore();
  const [hide, setHide] = useState(false);
  const [searching, setSearching] = useState(false);
  const [city, setCity] = useState("Bangalore");
  const [from, to] = range ? range.split(" → ") : ["", ""];

  useEffect(() => { // hide on scroll down, show on scroll up
    let last = 0;
    const on = () => { const y = scrollY; setHide(y > last && y > 160); last = y; };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  return (
    <header className={hide ? "hide" : ""}><div className="hd">
      <a className="logo" href="/" aria-label="SharePal home"><Wordmark /></a>
      <div className="loc">
        <label className="city"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
          <select value={city} onChange={(e) => { setCity(e.target.value); say(e.target.value === "Bangalore" ? "Showing gear in Bangalore" : `${e.target.value}: gaming inventory is Bangalore-only in this demo`); }} aria-label="City">
            {CITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <button className="seg" onClick={() => setPanel("dates")}><Cal />{from || "Delivery Date"}</button>
        <button className="seg" onClick={() => setPanel("dates")}><Cal />{to || "Pickup Date"}</button>
        <button className="sel" onClick={() => setPanel("dates")}><Cal />Select</button>
      </div>
      <div className="icons">
        {searching && <input autoFocus className="sinput" value={q} onChange={(e) => onSearch(e.target.value)} onBlur={() => !q && setSearching(false)} placeholder="Search PS5, FC27…" aria-label="Search products" />}
        <button aria-label="Search" onClick={() => setSearching(!searching)}><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg></button>
        <button aria-label={`Cart, ${count} items`} className="cartb" onClick={() => setPanel("cart")}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M2 3h3l2.5 12h11L21 7H6" /><circle cx="9" cy="20" r="1.6" /><circle cx="18" cy="20" r="1.6" /></svg>{count > 0 && <span className="badge">{count}</span>}</button>
        <button className="login" onClick={() => setPanel("login")}><span className="av"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3a1260" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg></span><b>Hi, {user ? user.name : "Login"}</b></button>
      </div>
    </div></header>
  );
}
