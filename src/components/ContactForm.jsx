import { useState, useEffect } from "react";
import { api } from "../api/client";
import { site } from "../data/site";
import { digits } from "../utils/digits";
import Field from "./Field";
import { useToast } from "./Toast";
import { waWithText } from "../utils/whatsapp";

const types = [["Home", "🏠"], ["Commercial", "🏬"], ["Industry", "🏭"], ["Farmhouse", "🌾"]];
const empty = { name: "", phone: "", email: "", city: "", propertyType: "Home", monthlyBill: "", message: "" };
const rules = {
  name: (v) => (v.trim() ? "" : "Please enter your name"),
  phone: (v) => (/^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit mobile number"),
  email: (v) => (!v || /^\S+@\S+\.\S+$/.test(v) ? "" : "Enter a valid email"),
  city: (v) => (v.trim() ? "" : "Please enter your city"),
};

export default function ContactForm() {
  const [f, setF] = useState(empty);
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [apiErr, setApiErr] = useState("");
  const toast = useToast();

  // Auto-refresh the page 3 seconds after a successful request
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => window.location.reload(), 3000);
    return () => clearTimeout(timer);
  }, [done]);

  const set = (k) => (e) => {
    let v = e.target.value;
    if (k === "phone") v = digits(v, 10);
    if (k === "monthlyBill") v = digits(v, 6);
    setF({ ...f, [k]: v });
    if (errs[k]) setErrs({ ...errs, [k]: "" });
  };
  const progress = Math.round((["name", "phone", "city"].filter((k) => !rules[k](f[k])).length / 3) * 100);

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    Object.keys(rules).forEach((k) => { const m = rules[k](f[k]); if (m) er[k] = m; });
    setErrs(er);
    if (Object.keys(er).length) { toast({ type: "error", title: "Please check the form", text: "Some fields need your attention." }); return; }
    setBusy(true); setApiErr("");
    try {
      const r = await api.post("/leads", { ...f, source: "contact", monthlyBill: f.monthlyBill ? Number(f.monthlyBill) : undefined });
      setDone(r.message); setF(empty);
      toast({ type: "success", title: "Request sent!", text: r.message });
    } catch (err) {
      setApiErr(err.message);
      toast({ type: "error", title: "Could not send your request", text: err.message, ms: 9000,
        action: { label: "Send on WhatsApp instead", href: waWithText(`Hello Solar Pro Energy, I want a free site survey.\nName: ${f.name}\nPhone: ${f.phone}\nCity: ${f.city}\nProperty: ${f.propertyType}`) } });
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="sv sv-done" id="contact">
        <svg className="tick" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none" /><path fill="none" d="M14 27l8 8 16-17" /></svg>
        <h2>Request received!</h2>
        <p>{done}</p>
        <p className="muted">In a hurry? Call <a href={site.phoneHref}>{site.phone}</a> or <a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp us</a>.</p>
        <button className="btn line" onClick={() => setDone("")}>Send another request</button>
      </div>
    );
  }

  return (
    <form className="sv sv-sm" id="contact" onSubmit={submit} noValidate style={{ "--p": `${progress}%` }}>
      <div className="sv-bar" aria-hidden="true"><i /></div>
      <div className="sv-head" style={{ "--i": 0 }}>
        <span className="sv-ic">📋</span>
        <div><h2>Book your free site survey</h2><p>Takes 30 seconds. No spam, no obligation.</p></div>
      </div>
      <div className="sv-perks" style={{ "--i": 1 }}><span>✓ Free roof check</span><span>✓ Clear proposal</span><span>✓ Expert guidance</span></div>

      <div className="sv-grid">
        <Field id="name" label="Full name" auto="name" f={f} set={set} err={errs.name} i={2} />
        <Field id="phone" label="Mobile number" type="tel" auto="tel-national" numeric max={10} f={f} set={set} err={errs.phone} i={3} />
        <Field id="email" label="Email (optional)" type="email" auto="email" f={f} set={set} err={errs.email} i={4} />
        <Field id="city" label="City" auto="address-level2" f={f} set={set} err={errs.city} i={5} />
      </div>

      <fieldset className="sv-types" style={{ "--i": 6 }}>
        <legend>Property type</legend>
        {types.map(([t, ic]) => (
          <label key={t}><input type="radio" name="ptype" value={t} checked={f.propertyType === t} onChange={set("propertyType")} /><span>{ic} {t}</span></label>
        ))}
      </fieldset>

      <div className="sv-grid">
        <Field id="monthlyBill" label="Monthly bill (₹)" type="text" numeric max={6} f={f} set={set} i={7} />
        <div className="sv-hint" style={{ "--i": 7 }}>Helps us size your system before the visit.</div>
        <Field id="message" label="Anything we should know? (optional)" area f={f} set={set} i={8} />
      </div>

      <button className="sv-btn" disabled={busy} style={{ "--i": 9 }}>
        {busy ? <span className="spin" aria-hidden="true" /> : null}{busy ? "Sending…" : <>Request free survey <span className="arr">→</span></>}
      </button>
      {apiErr && <p className="errmsg" role="alert">{apiErr}</p>}
    </form>
  );
}