import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import FAQ from "../components/FAQ";
import { site } from "../data/site";

const UPDATED = "5 October 2026";

function Doc({ title, text, children }) {
  return (
    <>
      <PageHero title={title} text={text} />
      <section><div className="wrap legal">
        <p className="upd">Last updated: {UPDATED}</p>
        {children}
        <div className="box">
          <b>Questions about this page?</b>
          <p style={{ margin: "6px 0 0" }}>Call <a href={site.phoneHref}>{site.phone}</a>, email <a href={`mailto:${site.email}`}>{site.email}</a> or <Link to="/contact">send us a message</Link>.</p>
        </div>
      </div></section>
    </>
  );
}
const S = ({ h, children }) => <><h2>{h}</h2>{children}</>;

export function Privacy() {
  return (
    <Doc title="Privacy Policy" text="What we collect when you use this website, why we collect it, and the choices you have.">
      <p>{site.name} ("we", "us") respects your privacy. This policy explains how we handle the details you share with us through this website.</p>
      <S h="1. Information we collect">
        <ul>
          <li>Details you type into our contact, quote and enquiry forms: name, phone number, email, city, property type, monthly electricity bill and your message.</li>
          <li>Your email address, if you subscribe to solar tips.</li>
          <li>Basic technical information your browser sends automatically, such as browser type and pages visited.</li>
        </ul>
        <p>We never ask for card, bank or password details on this website.</p>
      </S>
      <S h="2. How we use it">
        <ul>
          <li>To call, message or email you about your enquiry.</li>
          <li>To plan your site survey and prepare your proposal or quote.</li>
          <li>To send solar tips and updates, only if you subscribed.</li>
          <li>To improve our service and to meet legal requirements.</li>
        </ul>
      </S>
      <S h="3. Who we share it with">
        <p>We do not sell your personal information. We share it only when needed to deliver your project, for example with installation partners, your electricity distribution company, banks or government subsidy portals, and with technical providers that host this website. We may also share it if the law requires.</p>
      </S>
      <S h="4. Cookies and local storage">
        <p>This website may keep small preferences in your browser, such as your display theme. We do not use this website to show advertising or to track you across other sites.</p>
      </S>
      <S h="5. How long we keep it">
        <p>We keep your enquiry details for as long as needed to serve you, handle service requests and follow the law. You can ask us to delete them at any time.</p>
      </S>
      <S h="6. Security">
        <p>We take reasonable steps to protect your information, including restricted access to our admin system. No website or storage method is completely secure, so please avoid sharing sensitive details in free-text boxes.</p>
      </S>
      <S h="7. Your choices">
        <ul>
          <li>Ask to see, correct or delete the information we hold about you.</li>
          <li>Withdraw your consent to be contacted.</li>
          <li>Unsubscribe from solar tips by replying to any email with the word "unsubscribe".</li>
        </ul>
      </S>
      <S h="8. Children">
        <p>This website is meant for adults. We do not knowingly collect information from anyone under 18.</p>
      </S>
      <S h="9. Changes">
        <p>We may update this policy from time to time. The date at the top shows when it last changed.</p>
      </S>
    </Doc>
  );
}

export function Terms() {
  return (
    <Doc title="Terms of Service" text="The simple rules for using this website and for working with Solar Pro Energy.">
      <p>By using this website or asking us for a quote, you agree to these terms. A signed proposal or agreement for your project will carry the final details and takes priority if it differs from this page.</p>
      <S h="1. Our services">
        <p>We survey, design, supply, install and service solar systems for homes, businesses, industry and farms. Information on this website is general and may change without notice.</p>
      </S>
      <S h="2. Quotes and estimates">
        <p>Savings, bill and generation figures, including those from our calculator, are estimates. Actual results depend on sunlight, roof direction and shade, your usage, local tariffs and how the system is maintained. They are not a guarantee. A quote is valid for the period written in your proposal.</p>
      </S>
      <S h="3. Approvals and subsidies">
        <p>Subsidies, net metering and grid approvals depend on government schemes and your electricity distribution company, and these rules change. We help with the paperwork, but we cannot promise that an approval or subsidy will be granted.</p>
      </S>
      <S h="4. Payments">
        <p>Prices, taxes and payment stages are set out in your signed proposal. Work is scheduled after the agreed advance is received.</p>
      </S>
      <S h="5. Warranties">
        <p>Panels, inverters and batteries carry the warranty of their manufacturer. Our workmanship warranty, if any, is stated in your agreement. Warranties do not cover damage from misuse, unauthorised changes, floods, lightning or other events outside normal use.</p>
      </S>
      <S h="6. Your responsibilities">
        <ul>
          <li>Give us correct information about your property and electricity connection.</li>
          <li>Allow safe access to the roof or site for survey, installation and service.</li>
          <li>Do not move, repair or modify the system yourself. Call us instead.</li>
        </ul>
      </S>
      <S h="7. Limits on our liability">
        <p>To the extent the law allows, we are not responsible for indirect or consequential loss, grid outages, or weather. Our total liability for a project is limited to the amount you paid us for it.</p>
      </S>
      <S h="8. Using this website">
        <p>Please do not misuse the site, try to break into it, or copy its content, logo or photos without our permission.</p>
      </S>
      <S h="9. Governing law">
        <p>These terms are governed by the laws of India. Courts in Lucknow, Uttar Pradesh have jurisdiction over any dispute.</p>
      </S>
    </Doc>
  );
}

export function Help() {
  const cards = [
    ["📞", "Call us", site.phone, site.phoneHref],
    ["💬", "WhatsApp", "Chat with our team", site.whatsapp],
    ["✉️", "Email", site.email, `mailto:${site.email}`],
    ["📝", "Get a free quote", "We reply within one working day", "/contact"],
  ];
  const how = [
    ["How do I get a free quote?", "Fill the quote form on the Contact page, or call or WhatsApp us. Tell us your city, property type and monthly electricity bill and we will call you back."],
    ["What happens after I enquire?", "We call you, book a free site survey, then send a proposal with system size, price and expected savings. Installation is scheduled once you approve."],
    ["How do I book a service visit?", "Call or WhatsApp us with your name, address and the problem you see. Mention if your inverter shows an error code."],
    ["Can you help with subsidy and net metering papers?", "Yes. We check what applies to you during the survey and help with the forms. Approvals depend on the government and your electricity company."],
    ["How do I change or delete my details?", "Email or call us and we will update or remove them. See our Privacy Policy for more."],
  ];
  return (
    <>
      <PageHero title="Help centre" text="Quick answers, and the fastest ways to reach our team." />
      <section><div className="wrap">
        <div className="help-cards">
          {cards.map(([i, t, s, href]) => href.startsWith("/")
            ? <Link key={t} to={href}><span>{i}</span><b>{t}</b><small>{s}</small></Link>
            : <a key={t} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><span>{i}</span><b>{t}</b><small>{s}</small></a>)}
        </div>
        <div className="legal" style={{ maxWidth: "none" }}>
          <h2 style={{ marginTop: 0 }}>Getting started</h2>
          {how.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
        <div style={{ marginTop: 40 }}><FAQ /></div>
        <p style={{ marginTop: 28 }}>
          <Link className="btn sun" to="/contact">Still need help? Contact us</Link>{" "}
          <Link to="/privacy" style={{ marginLeft: 14 }}>Privacy Policy</Link> · <Link to="/terms">Terms of Service</Link>
        </p>
      </div></section>
    </>
  );
}
