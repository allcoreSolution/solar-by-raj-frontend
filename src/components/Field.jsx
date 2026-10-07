import { useLayoutEffect, useRef } from "react";

// Floating-label field used by the contact and enquiry forms
export default function Field({ id, label, f, set, err, i = 0, type = "text", auto, area, max, numeric }) {
  const Tag = area ? "textarea" : "input";
  const ref = useRef(null);

  // Message box grows with the text (up to 200px) so nothing gets cut or scrolls under the label
  useLayoutEffect(() => {
    const el = ref.current;
    if (!area || !el) return;
    el.style.height = "auto";
    const border = el.offsetHeight - el.clientHeight;
    el.style.height = Math.min(el.scrollHeight + border, 200) + "px";
  }, [area, f[id]]);

  return (
    <div className={`fld ${err ? "bad" : ""} ${area ? "wide" : ""}`} style={{ "--i": i }}>
      <Tag ref={ref} id={id} type={area ? undefined : type} autoComplete={auto} placeholder=" " value={f[id]} onChange={set(id)}
        rows={area ? 3 : undefined} maxLength={area ? 500 : max} inputMode={numeric ? "numeric" : undefined} />
      <label htmlFor={id}>{label}</label>
      {err && <small role="alert">{err}</small>}
    </div>
  );
}