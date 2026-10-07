import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Steps from "../components/Steps";
import Calculator from "../components/Calculator";
import Reveal from "../components/Reveal";
import { services } from "../data/services";
import { img } from "../data/site";

export default function Services() {
  return (
    <>
      <PageHero image={img.field} title="Our solar services" text="Whatever you own, we size the system to your usage and your space." />
      <section><div className="wrap">
        <div className="svc svc-2">
          {services.map((s, i) => (
            <Reveal as="article" key={s.title} delay={(i % 2) * 90}>
              <div className="ic">{s.icon}</div><h3>{s.title}</h3><p>{s.text}</p>
              <ul className="checks" style={{ margin: "16px 0" }}>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <small>{s.range}</small>
              <Link className="btn line" style={{ marginTop: 16, padding: "10px 18px" }} to="/contact">Ask about {s.title.toLowerCase()}</Link>
            </Reveal>
          ))}
        </div>
      </div></section>
      <Steps />
      <Calculator />
    </>
  );
}
