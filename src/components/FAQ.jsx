import { faqs } from "../data/services";
import Reveal from "./Reveal";
export default function FAQ() {
  return (
    <div>
      <Reveal as="h2">Questions we hear most</Reveal>
      {faqs.map(([q, a]) => <Reveal as="details" key={q}><summary>{q}</summary><p>{a}</p></Reveal>)}
    </div>
  );
}
