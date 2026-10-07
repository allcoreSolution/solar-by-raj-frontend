import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import ProductSlider from "../components/ProductSlider";
import Reveal from "../components/Reveal";
import { img, site } from "../data/site";

export default function Products() {
  return (
    <>
      <PageHero image={img.panel} title="High-performance solar products" text="Panels, inverters, batteries and mounting structures chosen for output and long life." />
      <section><div className="wrap">
        <ProductSlider />
        <Reveal className="cta-card" style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 28 }}>Not sure which system suits you?</h2>
          <p className="lead" style={{ margin: "12px 0 24px" }}>Tell us your monthly bill and roof space. We will recommend the right panels, inverter and battery setup.</p>
          <Link className="btn sun" to="/contact">Get Free Quote</Link> <a className="btn line" href={site.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        </Reveal>
      </div></section>
    </>
  );
}