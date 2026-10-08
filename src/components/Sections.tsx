"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const F = [
  ["Do I need to pay a security deposit?", "No. Gaming rentals in Bangalore come with zero security deposit – just valid ID and address proof."],
  ["How does delivery work?", "Free doorstep delivery and pickup in Bangalore on the dates you choose."],
  ["What is the minimum rental period?", "One day. Longer rentals work out cheaper per day."],
  ["Can I extend my rental?", "Yes – extend from your orders page or contact support before pickup."],
  ["What if the console gets damaged?", "Normal wear is covered. Accidental damage is charged at repair cost."],
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return <div>{F.map(([q, a], i) => (
    <div key={q} className="faq">
      <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{q}
        <motion.span animate={{ rotate: open === i ? 45 : 0 }}>＋</motion.span></button>
      <AnimatePresence initial={false}>{open === i && (
        <motion.div className="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: .4 }}><p>{a}</p></motion.div>)}</AnimatePresence>
    </div>))}</div>;
}

export function Footer() {
  const cols: Record<string, string[]> = {
    SharePal: ["About us", "Careers", "Blog", "Earn with us"], Gaming: ["PS5 on rent", "PS4 on rent", "Xbox on rent", "VR on rent"],
    Help: ["FAQs", "Terms", "Privacy", "Contact"], Cities: ["Bangalore", "Delhi", "Mumbai", "Hyderabad"] };
  return <footer><div className="in">{Object.entries(cols).map(([h, l]) => <div key={h}><h4>{h}</h4>{l.map((x) => <a key={x} href="https://sharepal.in" target="_blank" rel="noopener noreferrer">{x}</a>)}</div>)}</div>
    <p className="cp">Rent gaming consoles in Bangalore with zero deposit. © SharePal – assignment recreation.</p></footer>;
}

const OTHER: Record<string, { icon: string; items: string[] }> = {
  Photography: { icon: "📷", items: ["DSLR & Mirrorless", "Lenses", "Action Cameras", "Drones", "Tripods & Gimbals"] },
  Outdoor: { icon: "⛺", items: ["Trekking Gear", "Camping & Tents", "Travel Luggage", "Riding Gear", "Fitness Equipment"] },
  Entertainment: { icon: "🎬", items: ["Projectors", "Speakers", "VR Headsets", "Karaoke", "Party Lights"] },
};
export function OtherTab({ tab, back }: { tab: string; back: () => void }) {
  const o = OTHER[tab];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="other">
      <div className="oicon">{o.icon}</div><h2>{tab} rentals</h2>
      <p>This demo recreates the Gaming page. Explore {tab.toLowerCase()} rentals on the live SharePal site:</p>
      <div className="ochips">{o.items.map((x) => <a key={x} href="https://sharepal.in/bangalore" target="_blank" rel="noopener noreferrer">{x} ↗</a>)}</div>
      <button className="cta" onClick={back}>← Back to Gaming</button>
    </motion.div>);
}
