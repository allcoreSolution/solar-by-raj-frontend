
import EnquirySection from "../components/Enquiry";

export default function Enquiry() {
  return (
    <main>
      {/* Top Banner (Aapke CSS ki .page-hero class use karta hai) */}
      <div className="page-hero">
        <div className="wrap">
          <h1>Enquiry & Consultation</h1>
          <p>Get in touch with our solar experts for quotes, rooftop survey, or technical queries.</p>
        </div>
      </div>

      {/* Main Enquiry Form & Contact details */}
      <EnquirySection />
    </main>
  );
}