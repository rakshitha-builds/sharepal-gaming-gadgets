import Link from "next/link";
export default function NotFound() {
  return (<main style={{ textAlign: "center", padding: "120px 20px" }}><div style={{ fontSize: 72 }}>🎮</div><h1>Game over – page not found</h1>
    <p style={{ color: "var(--mu)" }}>This page doesn&apos;t exist.</p>
    <Link className="cta" style={{ display: "inline-block", textDecoration: "none" }} href="/bangalore/gaming-gadgets-on-rent">Back to gaming gadgets</Link></main>);
}
