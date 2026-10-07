import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { digits } from "../utils/digits";
import { estimate, inr } from "../utils/estimate";

const types = ["Home", "Commercial", "Industry", "Farmhouse"];
const empty = { name: "", phone: "", propertyType: "Home", bill: "" };

export default function QuoteForm() {
  const [f, setF] = useState(empty);
  const [errs, setErrs] = useState({});
  const [res, setRes] = useState(null);
  const [note, setNote] = useState({ ok: true, text: "" });
  const [busy, setBusy] = useState(false);

  // Auto-refresh the page 8 seconds after the request is saved (gives time to read the estimate)
  useEffect(() => {
    if (!res || busy || !note.ok || !note.text) return;
    const timer = setTimeout(() => window.location.reload(), 8000);
    return () => clearTimeout(timer);
  }, [res, busy, note]);

  const set = (k) => (e) => {
    let v = e.target.value;
    if (k === "phone") v = digits(v, 10);   // numbers only, max 10
    if (k === "bill") v = digits(v, 6);     // numbers only, max 6
    setF({ ...f, [k]: v });
    if (errs[k]) setErrs({ ...errs, [k]: "" });
  };

  const validate = () => {
    const er = {};
    if (!f.name.trim()) er.name = "Enter your name";
    if (!/^[6-9]\d{9}$/.test(f.phone)) er.phone = "Enter a valid 10-digit mobile number";
    if (!f.bill || Number(f.bill) < 500) er.bill = "Enter a bill of ₹500 or more";
    return er;
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrs(er);
    if (Object.keys(er).length) return;

    // 1. Calculate and show the result right away
    const bill = Number(f.bill);
    const est = estimate(bill, f.propertyType);
    setRes(est); setBusy(true); setNote({ ok: true, text: "" });

    // 2. Save the enquiry in the background
    try {
      await api.post("/leads", {
        name: f.name.trim(), phone: f.phone, source: "quote", propertyType: f.propertyType, monthlyBill: bill,
        billRange: `₹${bill.toLocaleString("en-IN")} per month`, message: `Quick estimate: ${est.kw} kW system`,
      });
      setNote({ ok: true, text: "Thanks! Our team will call you to confirm the exact quote." });
    } catch {
      setNote({ ok: false, text: "Estimate is ready, but we could not save your request. Please call or WhatsApp us." });
    }
    setBusy(false);
  };

  if (res) {
    return (
      <div className="quote qres" role="status">
        <small>Your estimate</small>
        <h2>{res.kw} kW solar system</h2>
        <div className="q-grid">
          <div><b>{inr(res.yearly)}</b><span>Saved per year</span></div>
          <div><b>{inr(res.cost)}</b><span>Approx. cost</span></div>
          <div><b>{res.payback.toFixed(1)} yrs</b><span>Payback</span></div>
          <div><b>{res.co2} t</b><span>CO₂ avoided a year</span></div>
        </div>
        <p className={note.ok ? "q-note" : "q-note warn"}>{busy ? "Saving your request…" : note.text}</p>
        <div className="q-btns">
          <Link className="btn sun" to="/contact">Book free survey</Link>
          <button type="button" className="btn line" onClick={() => setRes(null)}>Recalculate</button>
        </div>
        <span className="fine">Estimate only. Exact quote after a site survey.</span>
      </div>
    );
  }

  return (
    <form className="quote" onSubmit={submit} noValidate>
      <small>Quick estimate</small>
      <h2>Get Solar Quote</h2>
      <label>Name
        <input value={f.name} onChange={set("name")} autoComplete="name" placeholder="Your name" maxLength={40} />
        {errs.name && <em className="fe">{errs.name}</em>}
      </label>
      <label>Mobile number
        <input value={f.phone} onChange={set("phone")} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit mobile" maxLength={10} />
        {errs.phone && <em className="fe">{errs.phone}</em>}
      </label>
      <div className="two-in">
        <label>Property
          <select value={f.propertyType} onChange={set("propertyType")}>{types.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label>Monthly bill (₹)
          <input value={f.bill} onChange={set("bill")} inputMode="numeric" placeholder="e.g. 4000" maxLength={6} />
          {errs.bill && <em className="fe">{errs.bill}</em>}
        </label>
      </div>
      <button className="btn sun" disabled={busy}>Calculate Savings</button>
      <span className="fine">Free consultation. No spam.</span>
    </form>
  );
}