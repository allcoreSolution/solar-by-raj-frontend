
// Floating-label field used by the contact and enquiry forms
export default function Field({ id, label, f, set, err, i = 0, type = "text", auto, area, max, numeric }) {
  const Tag = area ? "textarea" : "input";
  return (
    <div className={`fld ${err ? "bad" : ""} ${area ? "wide" : ""}`} style={{ "--i": i }}>
      <Tag id={id} type={area ? undefined : type} autoComplete={auto} placeholder=" " value={f[id]} onChange={set(id)}
        rows={area ? 3 : undefined} maxLength={area ? 500 : max} inputMode={numeric ? "numeric" : undefined} />
      <label htmlFor={id}>{label}</label>
      {err && <small role="alert">{err}</small>}
    </div>
  );
}