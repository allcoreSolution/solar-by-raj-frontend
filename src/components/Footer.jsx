import { useState } from "react";
import Logo from "./logo";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { site } from "../data/site";
import { useToast } from "./Toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const toast = useToast();
  const subscribe = async (e) => {
    e.preventDefault();
    try { const r = await api.post("/subscribers", { email }); setMsg(r.message); setEmail(""); toast({ type: "success", title: "Subscribed!", text: r.message }); }
    catch (err) { setMsg(err.message); toast({ type: "error", title: "Could not subscribe", text: err.message }); }
  };
  return (
    <footer className="ft">
      <div className="ft-cta"><div className="wrap">
        <div><h3>Ready to switch to solar?</h3><p>Book a free site survey and get your proposal in a few days.</p></div>
        <Link className="btn ink" to="/contact">Book free survey</Link>
      </div></div>
      <div className="wrap ft-grid">
        <div className="ft-brand">
          <Link className="brand" to="/"><Logo uid="ft" /> <b>Solar <span>Pro</span> Energy</b></Link>
          <p>Solar for homes, businesses and industry. We survey, install and service every system ourselves.</p>
          <div className="soc"><a href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">wa</a><a href={site.phoneHref} aria-label="Call">☎</a><a href={`mailto:${site.email}`} aria-label="Email">@</a></div>
        </div>
        <div><h4>Company</h4><ul>{[["/", "Home"], ["/about", "About Us"], ["/products", "Products"], ["/why-solar", "Why Solar"], ["/projects", "Projects"], ["/#enquiry", "Enquiry"], ["/contact", "Contact"]].map(([to, l]) => <li key={l}><Link to={to}>{l}</Link></li>)}</ul></div>
        <div><h4>Solutions</h4><ul>{["Home solar", "Commercial", "Industrial", "Farmhouse", "Battery backup", "Maintenance & AMC"].map((l) => <li key={l}><Link to="/services">{l}</Link></li>)}<li><Link to="/#calculator">Savings calculator</Link></li></ul></div>
        <div>
          <h4>Get in touch</h4>
          <ul className="ci"><li>📍 <a href={site.map} target="_blank" rel="noreferrer">{site.address}</a></li><li>📞 <a href={site.phoneHref}>{site.phone}</a></li><li>✉ <a href={`mailto:${site.email}`}>{site.email}</a></li></ul>
          <form className="news" onSubmit={subscribe}>
            <label htmlFor="nl" className="sr">Email for solar tips</label>
            <input id="nl" type="email" required placeholder="Your email for solar tips" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button aria-label="Subscribe">→</button>
            <small role="status">{msg}</small>
          </form>
        </div>
      </div>
      <div className="wrap ft-bar">
        <span>© {new Date().getFullYear()} Solar Pro Energy. All rights reserved.</span>
        <span className="ft-links"><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link><Link to="/help">Help</Link></span>
      </div>
    </footer>
  );
}