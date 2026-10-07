import { useState } from "react";
import { Link } from "react-router-dom";

const inr = (n) => (n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)} L` : `₹${Math.round(n).toLocaleString("en-IN")}`);
const types = [["Home", 1], ["Business", 0.93], ["Industry", 0.88]];

export default function Calculator() {
  const [bill, setBill] = useState(4000);
  const [ratio, setRatio] = useState(1);
  const kw = Math.max(1, Math.round(((bill / 8 / 120) * ratio) * 2) / 2);
  const cost = kw * 55000, save = bill * 12 * 0.85;
  return (
    <section className="calc" id="calculator"><div className="wrap">
      <h2>Find out what solar would save you</h2>
      <p className="lead">Move the slider to your monthly electricity bill. You get a quick estimate of system size, cost and savings.</p>
      <div className="calc-box">
        <div className="calc-in">
          <label htmlFor="bill">Your monthly electricity bill</label>
          <output>₹{bill.toLocaleString("en-IN")}</output>
          <input id="bill" type="range" min="1000" max="100000" step="500" value={bill} onChange={(e) => setBill(+e.target.value)} />
          <label>Property type</label>
          <div className="seg">{types.map(([t, r]) => <button key={t} aria-pressed={ratio === r} onClick={() => setRatio(r)}>{t}</button>)}</div>
          <p className="note">Estimate only. It assumes about ₹8 per unit and about 120 units per kW each month. Your survey gives the exact figure.</p>
        </div>
        <div className="calc-out">
          <h3>Your estimated solar system</h3>
          <div className="res">
            <div><b>{kw} kW</b><span>System size</span></div><div><b>{inr(save)}</b><span>Saved per year</span></div>
            <div><b>{inr(cost)}</b><span>Approx. cost</span></div><div><b>{(cost / save).toFixed(1)} yrs</b><span>Payback</span></div>
          </div>
          <p style={{ margin: "26px 0 16px", color: "#cfdcff" }}>That is roughly {Math.round(kw * 1.3)} tonnes of CO₂ avoided each year.</p>
          <Link className="btn sun" to="/contact">Get an exact quote</Link>
        </div>
      </div>
    </div></section>
  );
}
