export default function PageHero({ title, text, image }) {
  return (
    <div className={`page-hero ${image ? "photo" : ""}`} style={image ? { "--bg": `url(${image})` } : undefined}>
      <div className="wrap"><h1>{title}</h1><p>{text}</p></div>
    </div>
  );
}
