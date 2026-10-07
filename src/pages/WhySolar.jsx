
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Calculator from "../components/Calculator";
import Reveal from "../components/Reveal";
import SafeImg from "../components/SafeImg";
import { whySolar, img } from "../data/site";

export default function WhySolar() {
  return (
    <>
      <PageHero image={img.farm} title="Smart investment. Cleaner future." text="Why more Indian homes, shops and factories are switching to solar." />
      <section><div className="wrap why-side">
        {/* Left side: photo, heading and button */}
        <Reveal className="why-left">
          <div className="ph">
            <SafeImg src={img.farm} fallback="/projects/farm.svg" alt="Solar panels on an open field" />
            <div className="why-badge"><b>Up to 90%</b><span>lower electricity bills</span></div>
          </div>
          <div className="tx">
            <h2>Why go solar?</h2>
            <p className="lead">Five simple reasons to switch your home, shop or factory to solar power.</p>
            <Link className="btn sun" to="/contact">Get Free Quote</Link>
          </div>
        </Reveal>

        {/* Right side: the five reasons as a list */}
        <div className="why-list">
          {whySolar.map(([icon, title, text], k) => (
            <Reveal key={title} delay={k * 90} className="why-item">
              <span>{icon}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
              <em>{String(k + 1).padStart(2, "0")}</em>
            </Reveal>
          ))}
        </div>
      </div></section>
      <Calculator />
    </>
  );
}
