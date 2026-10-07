import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SafeImg from "./SafeImg";
import Reveal from "./Reveal";
import { products } from "../data/site";

const points = {
  "Solar Panels": ["High efficiency cells", "Built for Indian weather", "Long panel life"],
  "Solar Inverters": ["On-grid and hybrid options", "Safe power conversion", "Easy monitoring"],
  "Solar Batteries": ["Backup during power cuts", "Hybrid and off-grid ready", "Sized to your load"],
  "Mounting Structure": ["GI and aluminium options", "Wind-safe design", "Neat, secure finish"],
};
const GAP = 16;

export default function ProductSlider() {
  const track = useRef(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false });
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(products.length);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);

  // width of one card plus the gap
  const step = () => {
    const c = track.current && track.current.firstElementChild;
    return c ? c.getBoundingClientRect().width + GAP : 0;
  };

  const go = (dir) => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    let next = el.scrollLeft + dir * step();
    if (dir > 0 && el.scrollLeft >= max - 4) next = 0;   // loop back to the start
    if (dir < 0 && el.scrollLeft <= 4) next = max;       // loop to the end
    el.scrollTo({ left: next, behavior: "smooth" });
  };
  const goTo = (i) => track.current && track.current.scrollTo({ left: i * step(), behavior: "smooth" });

  const onScroll = () => {
    const s = step();
    if (s) setActive(Math.min(count - 1, Math.round(track.current.scrollLeft / s)));
  };

  // how many slide positions there are (changes with screen size)
  useEffect(() => {
    const calc = () => {
      const el = track.current, s = step();
      if (el && s) setCount(Math.max(1, Math.ceil((el.scrollWidth - el.clientWidth - 2) / s) + 1));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // auto-slide every 3.5 seconds, paused on hover or if the person prefers less motion
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(1), 3500);
    return () => clearInterval(id);
  }, [paused]);

  // mouse drag to slide (touch screens already swipe)
  const down = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { on: true, x: e.clientX, left: track.current.scrollLeft, moved: false };
    setDragging(true);
  };
  const move = (e) => {
    if (!drag.current.on) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    track.current.scrollLeft = drag.current.left - dx;
  };
  const up = () => { if (drag.current.on) { drag.current.on = false; setDragging(false); } };
  const stopClick = (e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } };
  const key = (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };

  return (
    <Reveal className="pslide" onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); up(); }} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className={`ptrack ${dragging ? "drag" : ""}`} ref={track} onScroll={onScroll} role="region" aria-label="Solar products" tabIndex={0}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onClickCapture={stopClick} onKeyDown={key}>
        {products.map(([title, text, src], i) => (
          <article className="pcard" key={title} style={{ "--i": i }}>
            <div className="pc-img">
              <SafeImg src={src} fallback="/projects/farm.svg" alt={title} draggable="false" />
              <span className="pc-no">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="pc-body">
              <h3>{title}</h3>
              <p>{text}</p>
              <ul>{(points[title] || []).map((x) => <li key={x}>{x}</li>)}</ul>
              <Link className="pc-link" to="/contact">Get quote <i>→</i></Link>
            </div>
          </article>
        ))}
      </div>
      <div className="pbar">
        <button className="pslide-btn" aria-label="Previous product" onClick={() => go(-1)}>←</button>
        <div className="pdots">
          {Array.from({ length: count }, (_, i) => (
            <button key={i} className={i === active ? "on" : ""} aria-label={`Go to slide ${i + 1}`} onClick={() => goTo(i)} />
          ))}
        </div>
        <button className="pslide-btn" aria-label="Next product" onClick={() => go(1)}>→</button>
      </div>
    </Reveal>
  );
}