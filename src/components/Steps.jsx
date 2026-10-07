

import Reveal from "./Reveal";

const steps = [
  ["Site Survey", "Roof, shadow, load and available area assessment."],
  ["System Design", "Custom solar capacity and ROI planning."],
  ["Installation", "Professional installation with neat cabling and safety."],
  ["Monitoring", "Performance checks, cleaning and maintenance support."],
];

export default function Steps() {
  return (
    <section className="steps">
      <div className="wrap">
        <Reveal as="h1" className="center">
          Everything from survey to service
        </Reveal>

        <Reveal as="p" className="lead">
          Four clear steps, and you always know what is happening next.
        </Reveal>

        <div className="tl">
          {steps.map(([t, p], i) => (
            <Reveal
              key={t}
              delay={i * 90}
            >
              <h3>{t}</h3>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
