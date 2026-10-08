export default function Loading() {
  return (<main><div className="grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="card"><div className="im skel" /><div className="bd"><div className="skel" style={{ height: 14 }} /><div className="skel" style={{ height: 14, width: "60%" }} /></div></div>)}</div></main>);
}
