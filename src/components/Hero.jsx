import { Link } from "react-router-dom";
import CountUp from "./CountUp";
import QuoteForm from "./QuoteForm";
import { site, img } from "../data/site";

export default function Hero() {
  return (
    <div className="hero photo" style={{ "--bg": `url(${img.field})` }}><div className="wrap">
      <div>
        <span className="tag">Premium Solar EPC Solutions</span>
        <h1>Turn Sunshine Into Savings. Power Your Future with Solar.</h1>
        <p>Switch to reliable, affordable and future-ready solar energy solutions designed for Indian Homes, Farms and Industries.</p>
        <div className="btns"><Link className="btn sun" to="/contact">Get Free Quote</Link><Link className="btn line" to="/about">Know More</Link></div>
        <div className="hero-stats">{site.stats.map(([l, n, s]) => <div key={l}><b><CountUp to={n} suffix={s} /></b><span>{l}</span></div>)}</div>
      </div>
      <QuoteForm />
    </div></div>
  );
}
