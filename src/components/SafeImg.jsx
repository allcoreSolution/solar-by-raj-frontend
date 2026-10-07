
import { useState } from "react";

// Shows a photo, and swaps to a local illustration if the photo fails to load
export default function SafeImg({ src, fallback, alt, ...rest }) {
  const [s, setS] = useState(src || fallback);
  return <img src={s} alt={alt} loading="lazy" onError={() => fallback && s !== fallback && setS(fallback)} {...rest} />;
}