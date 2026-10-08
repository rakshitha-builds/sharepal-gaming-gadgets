"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useStore } from "@/lib/store";
import { rentalPrice } from "@/lib/products";
import type { Product } from "@/lib/types";

/** Number that counts up/down when the value changes. */
function Count({ to }: { to: number }) {
  const v = useMotionValue(to);
  const txt = useTransform(v, (n) => `₹${Math.round(n)}`);
  useEffect(() => { const c = animate(v, to, { duration: .6 }); return () => c.stop(); }, [to, v]);
  return <motion.span>{txt}</motion.span>;
}

export default function ProductCard({ p }: { p: Product }) {
  const { days, add, say } = useStore();
  const [fav, setFav] = useState(false);
  const [voted, setVoted] = useState(false);
  const [broken, setBroken] = useState(false);
  const vote = p.tag === "Vote to Launch";
  return (
    <article className={`card ${p.out_of_stock ? "oos" : ""}`}>
      <div className="im">
        <span className="ph">🎮</span>
        {!broken && <Image src={p.image} alt={`${p.name} on rent`} fill sizes="(max-width:760px) 50vw, 260px" onError={() => setBroken(true)} />}
        {p.tag && <span className="tag">{p.tag}</span>}
        <button className={`heart ${fav ? "on" : ""}`} aria-label="Wishlist" aria-pressed={fav} onClick={() => setFav(!fav)}>♥</button>
        {p.out_of_stock && <span className="soon">Out of stock</span>}
      </div>
      <div className="bd">
        <h3>{p.name}</h3>
        <div className="meta">{p.rating > 0 && <span className="star">{p.rating}★</span>}
          <span>{vote ? `${p.booked_count.toLocaleString("en-IN")}+ votes` : `${p.booked_count} booked this month`}</span></div>
        <div className="ft">
          {days > 0 ? <div className="pr"><Count to={rentalPrice(p.per_day_rent, days)} /><small> / {days} day{days > 1 ? "s" : ""}</small></div>
            : <div className="pr ask">Select dates to view price<br /><small>Rent/day</small> <strong>₹{p.per_day_rent}</strong></div>}
          {vote ? <button className="vote" disabled={voted} onClick={() => { setVoted(true); say("Thanks for voting!"); }}>{voted ? "Voted ✓" : "Vote"}</button>
            : p.out_of_stock ? <button className="add d" onClick={() => say("We'll notify you when it's back")}>Notify me</button>
            : <motion.button whileTap={{ scale: .85 }} className="add" aria-label={`Add ${p.name} to cart`} onClick={() => add(p)}>+</motion.button>}
        </div>
      </div>
    </article>
  );
}
