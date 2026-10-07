import SafeImg from "./SafeImg";
import Reveal from "./Reveal";
import { products } from "../data/site";
export default function ProductGrid() {
  return (
    <div className="prods">{products.map(([t, p, src], i) => (
      <Reveal as="article" key={t} delay={i * 90}><div className="pimg"><SafeImg src={src} fallback="/projects/farm.svg" alt={t} /></div><div className="in"><h3>{t}</h3><p>{p}</p></div></Reveal>
    ))}</div>
  );
}
