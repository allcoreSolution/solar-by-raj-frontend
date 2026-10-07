import { useState } from "react";
import PageHero from "../components/PageHero";
import { img } from "../data/site";
import ProjectGrid from "../components/ProjectGrid";

const filters = ["All", "Home", "Commercial", "Industrial", "Farm"];

export default function Projects() {
  const [type, setType] = useState("All");
  return (
    <>
      <PageHero image={img.farm} title="Our projects" text="Systems we have switched on across homes, businesses, factories and farms." />
      <section><div className="wrap">
        <div className="chips" role="group" aria-label="Filter projects">
          {filters.map((f) => <button key={f} aria-pressed={type === f} onClick={() => setType(f)}>{f}</button>)}
        </div>
        <ProjectGrid key={type} query={type === "All" ? "" : `?type=${type}`} />
      </div></section>
    </>
  );
}
