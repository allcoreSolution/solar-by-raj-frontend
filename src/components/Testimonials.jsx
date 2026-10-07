import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import { site, fallbackTestimonials } from "../data/site";

const ICONS = { "Installations": "⚡", "Bill savings": "💸", "Years panel life": "☀️" };
const initials = (name = "") => name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "SP";

export function Stats() {
  return (
    <Reveal className="nums">
      {site.stats.map(([label, n, suffix]) => (
        <div key={label} className="stat">
          <i>{ICONS[label] || "★"}</i>
          <div><b><CountUp to={n} suffix={suffix} /></b><span>{label}</span></div>
        </div>
      ))}
    </Reveal>
  );
}

// Reviews slide by themselves every few seconds. Hover to pause, or use the dots.
function Slider({ items }) {
  const [per, setPer] = useState(3);
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const f = () => setPer(window.innerWidth < 640 ? 1 : window.innerWidth < 980 ? 2 : 3);
    f(); window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  const view = Math.max(1, Math.min(per, items.length));
  const pages = Math.max(1, items.length - view + 1);

  useEffect(() => { if (i >= pages) setI(0); }, [pages, i]);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hover || reduce || pages < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % pages), 4500);
    return () => clearInterval(t);
  }, [hover, pages]);

  return (
    <div className="tslider" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="tview">
        <div className="ttrack" style={{ transform: `translateX(-${(i * 100) / view}%)` }}>
          {items.map((t) => (
            <div className="tslide" key={t._id} style={{ flexBasis: `${100 / view}%` }}>
              <article className="tcard">
                <div className="stars" aria-label={`${t.rating} out of 5`}>{"★".repeat(t.rating || 5)}</div>
                <p className="tq">“{t.quote}”</p>
                <div className="who">
                  <span className="av">{initials(t.name)}</span>
                  <div><strong>{t.name?.trim()}</strong><small>{t.role}{t.city ? `, ${t.city}` : ""}</small></div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
      {pages > 1 && (
        <div className="tdots">
          {Array.from({ length: pages }, (_, k) => (
            <button key={k} className={k === i ? "on" : ""} aria-label={`Show reviews ${k + 1}`} onClick={() => setI(k)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Testimonials() {
  const { data, error } = useFetch("/testimonials");
  const list = error ? fallbackTestimonials : data || [];
  return (
    <section className="trust">
      <div className="wrap">
        <Stats />
        {list.length > 0 && (
          <>
            <Reveal className="trust-head">
              <span className="eyebrow">Happy customers</span>
              <h2>Loved by homes and businesses</h2>
            </Reveal>
            <Slider items={list} />
          </>
        )}
      </div>
    </section>
  );
}
