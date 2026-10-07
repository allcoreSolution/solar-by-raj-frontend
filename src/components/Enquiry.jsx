import { useState, useEffect } from "react";
import { api } from "../api/client";
import { site } from "../data/site";
import { digits } from "../utils/digits";
import Field from "./Field";
import Reveal from "./Reveal";
import { useToast } from "./Toast";
import { waWithText } from "../utils/whatsapp";

const topics = [
  "Residential solar installation",
  "Commercial & industrial solar",
  "Solar maintenance & service",
  "Subsidy & paperwork assistance",
  "Solar consultation",
  "Other enquiry",
];

const empty = {
  name: "",
  phone: "",
  email: "",
  topic: topics[0],
  message: "",
};

const rules = {
  name: (v) =>
    v.trim() ? "" : "Please enter your name",

  phone: (v) =>
    /^[6-9]\d{9}$/.test(v)
      ? ""
      : "Enter a valid 10-digit mobile number",

  email: (v) =>
    !v || /^\S+@\S+\.\S+$/.test(v)
      ? ""
      : "Enter a valid email",

  message: (v) =>
    v.trim().length >= 5
      ? ""
      : "Please write your question",
};

export default function EnquirySection() {
  const [f, setF] = useState(empty);
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [apiErr, setApiErr] = useState("");

  const toast = useToast();

  // Automatically refresh page after successful enquiry
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => {
      window.location.reload();
    }, 2000);

    return () => clearTimeout(timer);
  }, [done]);

  // Handle input changes
  const set = (k) => (e) => {
    const value =
      k === "phone"
        ? digits(e.target.value, 10)
        : e.target.value;

    setF((prev) => ({
      ...prev,
      [k]: value,
    }));

    // Clear field error while typing
    if (errs[k]) {
      setErrs((prev) => ({
        ...prev,
        [k]: "",
      }));
    }

    // Clear API error while typing
    if (apiErr) {
      setApiErr("");
    }
  };

  // Submit enquiry
  const submit = async (e) => {
    e.preventDefault();

    // Prevent double submit
    if (busy) return;

    // Validate form
    const er = {};

    Object.keys(rules).forEach((k) => {
      const message = rules[k](f[k]);

      if (message) {
        er[k] = message;
      }
    });

    setErrs(er);

    if (Object.keys(er).length > 0) {
      toast({
        type: "error",
        title: "Please check the form",
        text: "Some fields need your attention.",
      });

      return;
    }

    setBusy(true);
    setApiErr("");
    setDone("");

    try {
      const payload = {
        name: f.name.trim(),
        phone: f.phone,
        source: "enquiry",
        topic: f.topic,
        email: f.email.trim(),
        message: f.message.trim().slice(
          0,
          500
        ),
      };

      // Send enquiry to backend
      const r = await api.post("/leads", payload);

      const successMessage =
        r?.message ||
        "Thank you! Our solar expert will contact you shortly.";

      // Show success screen
      setDone(successMessage);

      // Clear form state
      setF(empty);
      setErrs({});

      // Success toast
      toast({
        type: "success",
        title: "Enquiry sent!",
        text: successMessage,
      });

      /*
       * Page will automatically refresh after 2 seconds.
       * The timer is handled by useEffect above.
       */
    } catch (err) {
      const errorMessage =
        err?.message ||
        "Something went wrong. Please try again.";

      setApiErr(errorMessage);

      toast({
        type: "error",
        title: "Could not send your enquiry",
        text: errorMessage,
        ms: 9000,
        action: {
          label: "Send on WhatsApp instead",
          href: waWithText(
            `Hello Solar Pro Energy, I have an enquiry.

Name: ${f.name}
Phone: ${f.phone}
Email: ${f.email || "Not provided"}
Topic: ${f.topic}
Question: ${f.message}`
          ),
        },
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="enq" id="enquiry">
      <div className="wrap enq-grid">

        {/* =========================
            LEFT SIDE
        ========================== */}
        <Reveal className="enq-info">

          <h2>Ready to Go Solar?</h2>

          <p>
            Connect with our solar experts for personalised
            guidance, quotes, rooftop assessment, subsidy
            assistance, and technical support.
          </p>

          <ul className="enq-list">

            {/* Phone */}
            <li>
              <a href={site.phoneHref}>
                <i>📞</i>

                <div>
                  <b>Call us</b>
                  <span>{site.phone}</span>
                </div>
              </a>
            </li>

            {/* WhatsApp */}
            <li>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                <i>💬</i>

                <div>
                  <b>WhatsApp</b>
                  <span>Chat with our solar team</span>
                </div>
              </a>
            </li>

            {/* Email */}
            <li>
              <a href={`mailto:${site.email}`}>
                <i>✉</i>

                <div>
                  <b>Email</b>
                  <span>{site.email}</span>
                </div>
              </a>
            </li>

            {/* Address */}
            <li>
              <a
                href={site.map}
                target="_blank"
                rel="noreferrer"
              >
                <i>📍</i>

                <div>
                  <b>Visit us</b>
                  <span>{site.address}</span>
                </div>
              </a>
            </li>

          </ul>
        </Reveal>


        {/* =========================
            RIGHT SIDE
        ========================== */}
        <Reveal delay={120}>

          {/* SUCCESS SCREEN */}
          {done ? (
            <div className="sv sv-done">

              <svg
                className="tick"
                viewBox="0 0 52 52"
                aria-hidden="true"
              >
                <circle
                  cx="26"
                  cy="26"
                  r="24"
                  fill="none"
                />

                <path
                  fill="none"
                  d="M14 27l8 8 16-17"
                />
              </svg>

              <h2>Enquiry Sent!</h2>

              <p>
                {done}
              </p>

              <p className="success-subtext">
                Our team will contact you shortly.
              </p>

              <small>
                Refreshing...
              </small>

            </div>
          ) : (

            /* =========================
               ENQUIRY FORM
            ========================== */
            <form
              className="sv"
              onSubmit={submit}
              noValidate
            >

              {/* Form Header */}
              <div className="sv-head">

                <span className="sv-ic">
                  ✉️
                </span>

                <div>
                  <h2>Let's Talk Solar</h2>

                  <p>
                    Tell us what you need and our
                    experts will get in touch with you.
                  </p>
                </div>

              </div>


              {/* Form Fields */}
              <div className="sv-grid">

                {/* Full Name */}
                <Field
                  id="name"
                  label="Full name"
                  auto="name"
                  f={f}
                  set={set}
                  err={errs.name}
                  i={1}
                />


                {/* Mobile Number */}
                <Field
                  id="phone"
                  label="Mobile number"
                  type="tel"
                  auto="tel-national"
                  numeric
                  max={10}
                  f={f}
                  set={set}
                  err={errs.phone}
                  i={2}
                />


                {/* Email */}
                <Field
                  id="email"
                  label="Email (optional)"
                  type="email"
                  auto="email"
                  f={f}
                  set={set}
                  err={errs.email}
                  i={3}
                />


                {/* Enquiry Topic */}
                <label
                  className="sel"
                  style={{ "--i": 4 }}
                >
                  <span>
                    What are you looking for?
                  </span>

                  <select
                    value={f.topic}
                    onChange={set("topic")}
                  >
                    {topics.map((topic) => (
                      <option
                        key={topic}
                        value={topic}
                      >
                        {topic}
                      </option>
                    ))}
                  </select>
                </label>


                {/* Message */}
                <Field
                  id="message"
                  label="Your question"
                  area
                  f={f}
                  set={set}
                  err={errs.message}
                  i={5}
                />

              </div>


              {/* Submit Button */}
              <button
                type="submit"
                className="sv-btn"
                disabled={busy}
                style={{ "--i": 6 }}
              >
                {busy ? (
                  <>
                    <span className="btn-spinner" />
                    Sending...
                  </>
                ) : (
                  "Send Enquiry"
                )}
              </button>


              {/* API Error */}
              {apiErr && (
                <p
                  className="errmsg"
                  role="alert"
                >
                  {apiErr}
                </p>
              )}

            </form>
          )}

        </Reveal>
      </div>
    </section>
  );
}