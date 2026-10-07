import SafeImg from "./SafeImg";

const local = { Home: "/projects/home.svg", Commercial: "/projects/commercial.svg", Industrial: "/projects/industrial.svg", Farm: "/projects/farm.svg" };

export default function ProjectCard({ p }) {
  const real = (Array.isArray(p.images) && p.images.length ? p.images : [p.image]).filter(Boolean);
  const n = real.length >= 4 ? 4 : real.length >= 2 ? 2 : 1;
  const gallery = real.length ? real.slice(0, n) : [local[p.type] || local.Home];

  return (
    <article>
      <div className={`pic g-${p.type}`}>
        <div className={`project-gallery g${gallery.length}`}>
          {gallery.map((src, i) => (
            <SafeImg key={`${p._id || p.title}-${i}`} src={src} fallback={local[p.type] || local.Home} alt={`${p.title}, ${p.location}, image ${i + 1}`} />
          ))}
        </div>
        {gallery.length > 1 && <span className="project-count">{gallery.length} photos</span>}
        <em>{p.type}</em>
      </div>
      <div className="in">
        <h3>{p.title}</h3><p>{p.location}</p>
        {p.description && <p className="desc">{p.description}</p>}
        {p.sizeKw > 0 && <div className="row"><span>{p.sizeKw} kW</span><span>{p.location}</span></div>}
      </div>
    </article>
  );
}