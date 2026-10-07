const items = ["Rooftop solar", "Net metering support", "Battery backup", "Free site survey", "25-year panel warranty", "Annual service"];
export default function Ticker() {
  return <div className="ticker" aria-hidden="true"><div>{[...items, ...items].map((t, i) => <span key={i}>☀ {t}</span>)}</div></div>;
}
