import SafeImg from "../components/SafeImg";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Steps from "../components/Steps";
import Reveal from "../components/Reveal";
import Testimonials from "../components/Testimonials";
import { img } from "../data/site";

export function AboutBlock() {
  return (
    <section id="about"><div className="wrap about-grid">
      <Reveal>
        <h2>Reliable solar systems for homes and businesses</h2>
        <p className="lead" style={{ marginBottom: 22 }}>Solar Pro Energy delivers end-to-end solar solutions: consultation, site survey, system design, installation and after-sales service. We focus on clean workmanship, efficient output and long-term value.</p>
        <ul className="checks">
          <li><b>Rooftop and commercial solar</b> for homes, shops and industries.</li>
          <li><b>On-grid and hybrid systems</b> sized to your usage.</li>
          <li><b>Subsidy guidance and support</b> with the paperwork.</li>
        </ul>
        <Link className="btn sun" to="/services">Explore Services</Link>
      </Reveal>
      <Reveal delay={120} className="about-photo">
        <SafeImg src={img.field} fallback="/projects/farm.svg" alt="Solar panels installed on a field" />
        <div className="badge-card"><b>MNRE Ready</b><span>Quality-focused installation</span></div>
      </Reveal>
    </div></section>
  );
}

const values = [["Clarity", "Every proposal shows the cost, the savings and the payback in plain numbers."], ["Craft", "Neat cabling, safe mounting and a clean finish on every roof."], ["Care", "We stay in touch through survey, installation and after-sales service."]];

export default function About() {
  return (
    <>
      <PageHero image={img.mount} title="About Solar Pro Energy" text="End-to-end solar: consultation, survey, design, installation and after-sales service." />
      <AboutBlock />
      <section className="calc"><div className="wrap">
        <Reveal as="h2">What we stand for</Reveal>
        <div className="svc" style={{ gridTemplateColumns: "repeat(3,1fr)", marginTop: 32 }}>
          {values.map(([t, p], i) => <Reveal as="article" key={t} delay={i * 90}><h3>{t}</h3><p>{p}</p></Reveal>)}
        </div>
      </div></section>
      <Steps />
      <Testimonials />
    </>
  );
}
