
import useFetch from "../hooks/useFetch";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import { fallbackProjects } from "../data/site";

export default function ProjectGrid({ query = "" }) {
  const { data, loading, error } = useFetch(`/projects${query}`);
  if (loading) return <p className="state">Loading projects…</p>;

  // If the API is offline, show the saved projects instead of an error
  let list = data;
  if (error) {
    const q = new URLSearchParams(query);
    list = fallbackProjects.filter((p) => (!q.get("type") || p.type === q.get("type")) && (!q.get("featured") || p.featured));
  }
  if (!list.length) return <p className="state">No projects in this category yet.</p>;
  return <div className="proj">{list.map((p, i) => <Reveal key={p._id} delay={(i % 3) * 90}><ProjectCard p={p} /></Reveal>)}</div>;
}