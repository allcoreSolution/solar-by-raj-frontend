import Reveal from "./Reveal";
import { features } from "../data/site";
export default function FeatureStrip() {
  return (
    <div className="wrap"><div className="feat">
      {features.map(([i, t, p], k) => <Reveal key={t} delay={k * 90}><span>{i}</span><h3>{t}</h3><p>{p}</p></Reveal>)}
    </div></div>
  );
}
