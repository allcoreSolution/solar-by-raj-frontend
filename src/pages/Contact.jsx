import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import FAQ from "../components/FAQ";
import Reveal from "../components/Reveal";
import { site, img } from "../data/site";

const cards = [
  { icon: "📞", title: "Call us", text: site.phone, href: site.phoneHref },
  { icon: "💬", title: "WhatsApp", text: "Chat with our team", href: site.whatsapp, ext: true, wa: true },
  { icon: "✉", title: "Email", text: site.email, href: `mailto:${site.email}` },
  { icon: "📍", title: "Visit us", text: site.address, href: site.map, ext: true },
];

export default function Contact() {
  return (
    <>
      <PageHero image={img.mount} title="Book a free site survey" text="Tell us about your property. Our team will get in touch with you." />
      <section><div className="wrap two contact-grid">
        {/* Left: the form (stays in view while you scroll on desktop) */}
        <div className="contact-form-col"><ContactForm /></div>

        {/* Right: contact cards and FAQ */}
        <div>
          <Reveal as="h2" className="c-title">Visit or call us</Reveal>
          <div className="c-cards">
            {cards.map((c, i) => (
              <Reveal key={c.title} as="a" delay={i * 90} className={`c-card ${c.wa ? "wa-card" : ""}`} href={c.href} {...(c.ext ? { target: "_blank", rel: "noreferrer" } : {})}>
                <span className="c-ic">{c.icon}</span>
                <div><b>{c.title}</b><span>{c.text}</span></div>
                <i>→</i>
              </Reveal>
            ))}
          </div>
          <FAQ />
        </div>
      </div></section>
    </>
  );
}