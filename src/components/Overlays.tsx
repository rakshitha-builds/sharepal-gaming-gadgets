"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { rentalPrice } from "@/lib/products";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

function Shell({ onClose, children, side }: { onClose: () => void; children: React.ReactNode; side?: boolean }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [onClose]);
  return (
    <motion.div className={`ov ${side ? "side" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
        initial={side ? { x: "100%" } : { y: 30, scale: .96 }} animate={side ? { x: 0 } : { y: 0, scale: 1 }} exit={side ? { x: "100%" } : { y: 20, opacity: 0 }}
        transition={{ type: "spring", bounce: 0, duration: .4 }}>{children}</motion.div>
    </motion.div>);
}

function Dates() {
  const { setPanel, setDates, say } = useStore();
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [err, setErr] = useState("");
  const preset = (n: number) => { setA(addDays(1)); setB(addDays(1 + n)); setErr(""); };
  const apply = () => {
    const d = Math.round((+new Date(b) - +new Date(a)) / 864e5);
    if (!a || !b) return setErr("Pick both dates");
    if (d < 1) return setErr("Pickup must be after delivery");
    if (d > 90) return setErr("Maximum rental is 90 days");
    setDates(d, `${a} → ${b}`); setPanel(null); say(`Prices updated for ${d} day${d > 1 ? "s" : ""}`);
  };
  return (<Shell onClose={() => setPanel(null)}>
    <h3>Select rental dates</h3>
    <div className="chips">{[1, 3, 7].map((n) => <button key={n} onClick={() => preset(n)}>{n} day{n > 1 ? "s" : ""}</button>)}</div>
    <label>Delivery Date<input type="date" min={iso(new Date())} value={a} onChange={(e) => { setA(e.target.value); setErr(""); }} /></label>
    <label>Pickup Date<input type="date" min={a || iso(new Date())} value={b} onChange={(e) => { setB(e.target.value); setErr(""); }} /></label>
    {err && <span className="err" role="alert">{err}</span>}
    <button className="cta" onClick={apply}>Apply</button></Shell>);
}

function Login() {
  const { setPanel, user, setUser, say } = useStore();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [otp, setOtp] = useState(""); const [err, setErr] = useState("");
  if (user) return (<Shell onClose={() => setPanel(null)}><h3>Hi, {user.name} 👋</h3><p className="mu">Logged in as +91 {user.phone}</p>
    <button className="cta" onClick={() => { setUser(null); setPanel(null); say("Logged out"); }}>Log out</button></Shell>);
  const send = () => {
    if (name.trim().length < 2) return setErr("Enter your name");
    if (!/^[6-9]\d{9}$/.test(phone)) return setErr("Enter a valid 10-digit mobile number");
    setErr(""); setStep("otp"); say("OTP sent (demo: any 4 digits)");
  };
  const verify = () => {
    if (!/^\d{4}$/.test(otp)) return setErr("Enter the 4-digit OTP");
    setUser({ name: name.trim().split(" ")[0], phone }); setPanel(null); say(`Welcome, ${name.trim().split(" ")[0]}!`);
  };
  return (<Shell onClose={() => setPanel(null)}>
    <h3>{step === "phone" ? "Login to SharePal" : "Verify OTP"}</h3>
    {step === "phone" ? (<>
      <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoFocus /></label>
      <label>Mobile number<input value={phone} inputMode="numeric" maxLength={10} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="10-digit number" /></label>
      {err && <span className="err" role="alert">{err}</span>}<button className="cta" onClick={send}>Send OTP</button></>) : (<>
      <p className="mu">Enter the OTP sent to +91 {phone} (demo: any 4 digits)</p>
      <input className="otp" value={otp} inputMode="numeric" maxLength={4} autoFocus onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
      {err && <span className="err" role="alert">{err}</span>}<button className="cta" onClick={verify}>Verify &amp; login</button>
      <button className="link" onClick={() => { setStep("phone"); setOtp(""); setErr(""); }}>Change number</button></>)}
  </Shell>);
}

function Cart() {
  const { setPanel, items, setQty, clear, days, user, say } = useStore();
  const [done, setDone] = useState("");
  const d = Math.max(days, 1);
  const total = items.reduce((s, i) => s + rentalPrice(i.p.per_day_rent, d) * i.qty, 0);
  const place = () => {
    if (!user) { say("Please login to place the order"); return setPanel("login"); }
    setDone("SP" + Math.random().toString(36).slice(2, 8).toUpperCase()); clear();
  };
  return (<Shell side onClose={() => setPanel(null)}>
    <div className="ch"><h3>Your cart ({items.length})</h3><button aria-label="Close" onClick={() => setPanel(null)}>✕</button></div>
    {done ? <div className="empty">🎉<h3>Order placed!</h3><p>Order ID <b>{done}</b>. We&apos;ll deliver for free with zero deposit.</p><button className="cta" onClick={() => setPanel(null)}>Continue browsing</button></div>
    : !items.length ? <div className="empty">🛒<p>Your cart is empty.</p><button className="cta" onClick={() => setPanel(null)}>Browse gadgets</button></div> : (<>
      <div className="clist"><AnimatePresence initial={false}>{items.map(({ p, qty }) => (
        <motion.div key={p.id} layout exit={{ opacity: 0, x: 60 }} className="crow">
          <div className="cimg"><Image src={p.image} alt="" fill sizes="72px" /></div>
          <div className="cin"><b>{p.name}</b><small>{inr(p.per_day_rent)}/day × {d} day{d > 1 ? "s" : ""}</small>
            <div className="qty"><button aria-label="Decrease" onClick={() => setQty(p.id, qty - 1)}>−</button><span>{qty}</span><button aria-label="Increase" onClick={() => setQty(p.id, qty + 1)}>+</button></div></div>
          <div className="cpr">{inr(rentalPrice(p.per_day_rent, d) * qty)}<button className="link" onClick={() => setQty(p.id, 0)}>Remove</button></div>
        </motion.div>))}</AnimatePresence></div>
      <div className="cf">{!days && <button className="link" onClick={() => setPanel("dates")}>Select dates for exact price (showing 1 day)</button>}
        <div className="tot"><span>Total</span><b>{inr(total)}</b></div><small className="mu">Zero deposit · Free delivery · Pay on delivery</small>
        <button className="cta" onClick={place}>Place order</button></div></>)}
  </Shell>);
}

export default function Overlays() {
  const { panel } = useStore();
  return <AnimatePresence>{panel === "cart" ? <Cart key="c" /> : panel === "login" ? <Login key="l" /> : panel === "dates" ? <Dates key="d" /> : null}</AnimatePresence>;
}
