
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./logo";

const links = [["/", "Home"], ["/about", "About Us"],["/enquiry", "Enquiry"], ["/products", "Products"], ["/services", "Services"], ["/why-solar", "Why Solar"], ["/projects", "Projects"], ["/contact", "Contact"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={scrolled ? "sc" : ""}>
      <div className="wrap nav">
  
        <Link className="brand" to="/"><Logo uid="ft" /> <b>Solar <span>Pro</span> Energy</b></Link>
        <nav id="menu" className={open ? "open" : ""} aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "act" : "")}>{label}</NavLink>
          ))}
        </nav>
        <Link className="btn sun cta" to="/contact">Get a Free Quote</Link>
        <button className="burger" aria-label="Toggle menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
          <i /><i /><i />
        </button>
      </div>
    </header>
  );
}
