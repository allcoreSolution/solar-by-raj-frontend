import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import Ticker from "../components/Ticker";
import Calculator from "../components/Calculator";
import Steps from "../components/Steps";
import ProductSlider from "../components/ProductSlider";
import ProjectGrid from "../components/ProjectGrid";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import EnquirySection from "../components/Enquiry";
import WhySide from "../components/WhySide";
import Reveal from "../components/Reveal";
import { AboutBlock } from "./About";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureStrip />
      <AboutBlock />
      <Ticker />
      <section><div className="wrap">
        <Reveal as="h2">High-performance solar products</Reveal>
        <Reveal as="p" className="lead">Everything your system needs, from panels to mounting structure.</Reveal>
        <ProductSlider />
      </div></section>
      <section><div className="wrap"><WhySide /></div></section>
      <Calculator />
      <Steps />
      <section><div className="wrap">
        <Reveal as="h2">Clean installs. Strong output.</Reveal>
        <Reveal as="p" className="lead">A few of our recent projects.</Reveal>
        <ProjectGrid query="?featured=true" />
        <p style={{ marginTop: 28 }}><Link className="btn line" to="/projects">See all projects</Link></p>
      </div></section>
      <Testimonials />
      <EnquirySection />
      <section><div className="wrap two"><FAQ />
        <Reveal className="cta-card"><h2 style={{ fontSize: 28 }}>Ready to switch to solar?</h2><p className="lead" style={{ margin: "12px 0 24px" }}>Get a free consultation and quote today.</p><Link className="btn sun" to="/contact">Get Free Quote</Link></Reveal>
      </div></section>
    </>
  );
}