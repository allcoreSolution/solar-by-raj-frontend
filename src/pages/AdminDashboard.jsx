import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api/client";
import "../styles/admin.css";

const TK = "solarpro_admin_token";
const NAV = [["dashboard","Dashboard","▦"],["leads","Leads","☺"],["customers","Customers","♟"],["projects","Projects","▣"],["surveys","Site Surveys","⌖"],["proposals","Proposals & Quotes","▤"],["installations","Installations","⚡"],["service-requests","Service Requests","⚙"],["invoices","Invoices","₹"],["payments","Payments","$"],["reports","Reports","▥"],["tasks","Tasks","✓"],["calendar","Calendar","◫"],["documents","Documents","▧"],["settings","Settings","✱"],["recycle-bin","Recycle Bin","♻"]];
const GROUPS = [
  [null, ["dashboard"]],
  ["📊 CRM", ["leads", "customers", "projects", "surveys", "proposals", "installations", "service-requests"]],
  ["💰 Finance", ["invoices", "payments"]],
  ["📈 Management", ["reports", "tasks", "calendar", "documents"]],
  ["⚙️ System", ["settings", "recycle-bin"]],
];
const MOD = { customers:"Customer", surveys:"Site Survey", proposals:"Proposal", installations:"Installation", "service-requests":"Service Request", invoices:"Invoice", payments:"Payment", tasks:"Task", documents:"Document" };
const LEAD_ST = ["New","Contacted","Survey Booked","Proposal Sent","Won","Closed","Lost"];
const CRM_ST = ["New","In Progress","Pending","Paid","Completed","Cancelled"];
const arr = (v) => (Array.isArray(v) ? v : []);
const cls = (v) => String(v || "New").toLowerCase().replace(/\s+/g, "-");
const money = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(v || 0));
const fmtDate = (v) => { const d = new Date(v); return !v || isNaN(d) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); };

function Count({ to, cur }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let f, s; const t = Number(to) || 0;
    const step = (ts) => { s ??= ts; const p = Math.min(1, (ts - s) / 900); setV(t * (1 - Math.pow(1 - p, 3))); if (p < 1) f = requestAnimationFrame(step); };
    f = requestAnimationFrame(step); return () => cancelAnimationFrame(f);
  }, [to]);
  return cur ? money(v) : Math.round(v).toLocaleString("en-IN");
}

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem(TK));
  const [active, setActive] = useState(() => { const h = window.location.hash.slice(1); return NAV.some((n) => n[0] === h) ? h : "dashboard"; });
  const [dash, setDash] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const [toast, setToast] = useState(null);
  const [me, setMe] = useState({ name: "Admin" });
  const [theme, setTheme] = useState(() => localStorage.getItem("solarpro_theme") || "dark");
  const [modal, setModal] = useState(null); // "lead" | "record" | {project}
  const [tick, setTick] = useState(0);
  const [hideTop, setHideTop] = useState(false);
  const [results, setResults] = useState([]);
  const [showRes, setShowRes] = useState(false);
  const [sErr, setSErr] = useState("");
  useEffect(() => {
    const q = search.trim();
    if (!token || q.length < 2) { setResults([]); return; }
    const t = setTimeout(() => api.get("/admin/search?q=" + encodeURIComponent(q)).then((r) => { setSErr(Array.isArray(r) ? "" : "Server is running old code - restart it (Ctrl+C, npm run dev)"); setResults(arr(r)); }).catch((e) => { setSErr(e.message || "Search failed"); setResults([]); }), 250);
    return () => clearTimeout(t);
  }, [search, token]);
  const lastY = useRef(0);
  const onScroll = (e) => {
    const y = e.currentTarget.scrollTop, d = y - lastY.current;
    if (Math.abs(d) < 6) return;
    setHideTop(d > 0 && y > 80); if (d > 0) setBell(false);
    lastY.current = y;
  };
  const notify = useCallback((m, t = "ok") => setToast({ m, t, k: Date.now() }), []);
  const logout = useCallback(() => { localStorage.removeItem(TK); setToken(null); }, []);
  const loadDash = useCallback(async () => {
    try { setDash(await api.get("/admin/dashboard")); }
    catch (e) { if (/Authentication/i.test(e.message)) logout(); else notify(e.message, "err"); }
  }, [logout, notify]);
  const reload = useCallback(() => { loadDash(); setTick((t) => t + 1); }, [loadDash]);

  useEffect(() => { if (!toast) return; const x = setTimeout(() => setToast(null), 2800); return () => clearTimeout(x); }, [toast]);
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    loadDash();
    api.get("/admin/me")
      .then((r) => { if (!cancelled) setMe(r.admin || {}); })
      .catch((e) => {
        if (/Authentication|401|token/i.test(e.message || "")) logout();
      });
    return () => { cancelled = true; };
  }, [token, loadDash, logout]);
  useEffect(() => { localStorage.setItem("solarpro_theme", theme); }, [theme]);
  useEffect(() => {
    const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); document.getElementById("adm-search")?.focus(); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  const go = (id, keep) => { document.querySelector(".adm .main")?.scrollTo(0, 0); setHideTop(false); setActive(id); if (!keep) setSearch(""); setOpen(false); setShowRes(false); setBell(false); window.history.replaceState(null, "", "#" + id); };

  if (!token) return <div className="adm" data-theme={theme}><Login onLogin={(t, admin) => { localStorage.setItem(TK, t); setToken(t); if (admin) setMe(admin); }} /></div>;

  const k = dash?.kpis || {};
  const props = { search, notify, reload, tick, dash };
  const initials = String(me.name || "A").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const delProject = async (id) => { if (!window.confirm("Move this project to Recycle Bin?")) return; try { await api.del("/admin/projects/" + id); notify("Project moved to Recycle Bin"); reload(); } catch (e) { notify(e.message, "err"); } };

  let view;
  if (active === "dashboard") view = <Dashboard dash={dash} go={go} reload={loadDash} />;
  else if (active === "leads") view = <Leads {...props} onAdd={() => setModal("lead")} />;
  else if (active === "projects") view = <Projects {...props} onAdd={() => setModal({})} onEdit={(p) => setModal(p)} onDelete={delProject} />;
  else if (active === "reports") view = <Reports dash={dash} />;
  else if (active === "calendar") view = <CalendarPage records={arr(dash?.calendar)} />;
  else if (active === "settings") view = <Settings me={me} setMe={setMe} theme={theme} setTheme={setTheme} notify={notify} />;
  else if (active === "recycle-bin") view = <RecycleBinView onRefresh={reload} notify={notify} />;
  else view = <Module key={active} module={active} {...props} onAdd={() => setModal("record")} />;

  return (
    <div className="adm" data-theme={theme}>
      <div className={"shade" + (open ? " show" : "")} onClick={() => setOpen(false)} />
      <aside className={"side" + (open ? " open" : "")}>
        <div className="abrand"><img src="/projects/logo.png" alt="" /><div><b>Solar<span>Pro</span></b><small>ENERGY CRM</small></div></div>
        <nav>
          {GROUPS.map(([title, ids]) => (
            <div className="ngroup" key={title || "top"}>
              {title && <h6>{title}</h6>}
              {ids.map((id) => {
                const [, label, icon] = NAV.find((n) => n[0] === id);
                return (
                  <button key={id} style={{ animationDelay: NAV.findIndex((n) => n[0] === id) * 25 + "ms" }} className={active === id ? "on" : ""} onClick={() => go(id)}>
                    <i>{icon}</i><span>{label}</span>{id === "leads" && k.totalLeads > 0 && <em>{k.totalLeads}</em>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="promo"><div className="sun">☀</div><b>Go Solar. Save More.</b><p>Clean energy for a better tomorrow.</p><button onClick={() => { go("leads"); setModal("lead"); }}>＋ Create New Lead</button></div>
      </aside>
      <section className="main" onScroll={onScroll}>
        <header className={"top" + (hideTop ? " hide" : "")}>
          <button className="ib hamb" onClick={() => setOpen(!open)}>☰</button>
          <div className="srch">
            <span>⌕</span>
            <input id="adm-search" value={search} autoComplete="off" onChange={(e) => { setSearch(e.target.value); setShowRes(true); }} onFocus={() => setShowRes(true)} onBlur={() => setTimeout(() => setShowRes(false), 180)}
              onKeyDown={(e) => { if (e.key === "Enter" && results[0]) go(results[0].type, true); if (e.key === "Escape") { setSearch(""); e.target.blur(); } }}
              placeholder="Search leads, customers, projects…  (Ctrl+K)" />
            {search && <button className="clr" onClick={() => setSearch("")} title="Clear">✕</button>}
            {showRes && search.trim().length >= 2 && (
              <div className="sres">
                {results.map((r) => (
                  <button key={r.type + r.id} onMouseDown={() => go(r.type, true)}><em>{r.tag}</em><b>{r.label}</b><small>{r.sub}</small></button>
                ))}
                {sErr ? <p className="serr">⚠ {sErr}</p> : !results.length && <p>No results for “{search.trim()}”</p>}
              </div>
            )}
          </div>
          <div className="tacts">
            <button className="ib" title="New lead" onClick={() => { go("leads"); setModal("lead"); }}>＋</button>
            <button className="ib" title="Refresh" onClick={() => { reload(); notify("Refreshed"); }}>↻</button>
            <div className="bellwrap">
              <button className="ib" title="Notifications" onClick={() => setBell(!bell)}>🔔{arr(dash?.activities).length > 0 && <u />}</button>
              {bell && <div className="drop"><h4>Recent activity</h4>{arr(dash?.activities).slice(0, 6).map((a, i) => <p key={i}>{a.text}<small>{fmtDate(a.at)}</small></p>)}{!arr(dash?.activities).length && <p>No activity yet</p>}</div>}
            </div>
            <div className="prof" onClick={() => go("settings")} title="Open settings"><div className="av">{initials}</div><div><b>{me.name}</b><small>Admin</small></div></div>
            <button className="ib out" title="Logout" onClick={logout}>⏻</button>
          </div>
        </header>
        <div className="content" key={active}>{view}</div>
      </section>
      {modal === "lead" && <LeadModal onClose={() => setModal(null)} onSaved={() => { setModal(null); notify("Lead created"); reload(); }} notify={notify} />}
      {modal === "record" && <RecordModal module={active} title={MOD[active]} onClose={() => setModal(null)} onSaved={() => { setModal(null); notify("Record added"); reload(); }} notify={notify} />}
      {modal && typeof modal === "object" && <ProjectModal project={modal._id ? modal : null} onClose={() => setModal(null)} onSaved={async () => { setModal(null); notify("Project saved"); reload(); }} />}
      {toast && <div key={toast.k} className={"atoast " + toast.t}>{toast.t === "err" ? "⚠ " : "✓ "}{toast.m}</div>}
    </div>
  );
}

function Login({ onLogin }) {
  const [mode, setMode] = useState("email"); // email | phone | otp | forgot | reset
  const [f, setF] = useState({ email: "", password: "", phone: "", otp: "", next: "", again: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(""); setInfo(""); setDevOtp("");
    try {
      if (mode === "email") {
        const r = await api.post("/admin/login", { email: f.email, password: f.password });
        onLogin(r.token, r.admin);
      } else if (mode === "phone") {
        const r = await api.post("/admin/login/phone", { phone: f.phone, password: f.password });
        onLogin(r.token, r.admin);
      } else if (mode === "otp") {
        if (!f.otp) {
          const r = await api.post("/admin/login/send-otp", { phone: f.phone, email: f.email });
          setInfo(r.message || "OTP sent");
          if (r.otp) setDevOtp(r.otp);
        } else {
          const r = await api.post("/admin/login/verify-otp", { phone: f.phone, email: f.email, otp: f.otp });
          onLogin(r.token, r.admin);
        }
      } else if (mode === "forgot") {
        const r = await api.post("/admin/forgot-password", { email: f.email, phone: f.phone });
        setInfo(r.message || "OTP sent if account exists");
        if (r.otp) setDevOtp(r.otp);
        setMode("reset");
      } else if (mode === "reset") {
        if (f.next !== f.again) throw new Error("Passwords do not match");
        const r = await api.post("/admin/reset-password", { email: f.email, phone: f.phone, otp: f.otp, password: f.next });
        setInfo(r.message || "Password reset. Login now.");
        setMode("email");
        setF((p) => ({ ...p, password: "", otp: "", next: "", again: "" }));
      }
    } catch (x) {
      setErr(x.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const tabs = [
    ["email", "Email"],
    ["phone", "Phone"],
    ["otp", "OTP Login"],
  ];

  return (
    <div className="login">
      <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      <form className="lcard" onSubmit={submit}>
        <span className="bigsun">☀</span>
        <img className="llogo" src="/projects/logo.png" alt="SolarPro" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <span className="kick">SOLARPRO WORKSPACE</span>
        <h1>{mode === "forgot" || mode === "reset" ? "Reset Password" : "Admin Login"}</h1>
        <p>
          {mode === "email" && "Sign in with your admin email and password."}
          {mode === "phone" && "Sign in with registered mobile number."}
          {mode === "otp" && "Get a one-time password on your phone or email."}
          {mode === "forgot" && "Enter email or phone to receive a reset OTP."}
          {mode === "reset" && "Enter the OTP and choose a new password."}
        </p>

        {(mode === "email" || mode === "phone" || mode === "otp") && (
          <div className="ltabs">
            {tabs.map(([id, label]) => (
              <button type="button" key={id} className={mode === id ? "on" : ""} onClick={() => { setMode(id); setErr(""); setInfo(""); setDevOtp(""); }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {err && <div className="err">{err}</div>}
        {info && <div className="okmsg">{info}</div>}
        {devOtp && <div className="devotp">Dev OTP: <b>{devOtp}</b></div>}

        {(mode === "email" || mode === "forgot" || mode === "reset" || mode === "otp") && (
          <label>Email
            <input type="email" value={f.email} onChange={set("email")} placeholder="admin@company.com" autoComplete="username"
              required={mode === "email"} />
          </label>
        )}

        {(mode === "phone" || mode === "otp" || mode === "forgot" || mode === "reset") && (
          <label>Phone (10 digit)
            <input type="tel" value={f.phone} onChange={set("phone")} placeholder="9876543210" maxLength={10}
              required={mode === "phone"} inputMode="numeric" />
          </label>
        )}

        {(mode === "email" || mode === "phone") && (
          <label>Password
            <div className="pw">
              <input type={showPw ? "text" : "password"} value={f.password} onChange={set("password")} placeholder="••••••••" required autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw((v) => !v)}>{showPw ? "Hide" : "Show"}</button>
            </div>
          </label>
        )}

        {(mode === "otp" || mode === "reset") && (
          <label>OTP (6 digit)
            <input type="text" value={f.otp} onChange={set("otp")} placeholder="123456" maxLength={6} inputMode="numeric"
              required={mode === "reset"} />
          </label>
        )}

        {mode === "reset" && (
          <>
            <label>New password
              <input type="password" value={f.next} onChange={set("next")} placeholder="Min 6 characters" required minLength={6} />
            </label>
            <label>Confirm password
              <input type="password" value={f.again} onChange={set("again")} placeholder="Repeat password" required minLength={6} />
            </label>
          </>
        )}

        <button className="abtn pri full" disabled={busy}>
          {busy ? "Please wait…" :
            mode === "email" || mode === "phone" ? "Sign in" :
            mode === "otp" ? (f.otp ? "Verify & Login" : "Send OTP") :
            mode === "forgot" ? "Send Reset OTP" :
            "Reset Password"}
        </button>

        <div className="lfoot">
          {(mode === "email" || mode === "phone") && (
            <button type="button" className="linkish" onClick={() => { setMode("forgot"); setErr(""); setInfo(""); }}>Forgot password?</button>
          )}
          {(mode === "forgot" || mode === "reset" || mode === "otp") && (
            <button type="button" className="linkish" onClick={() => { setMode("email"); setErr(""); setInfo(""); setDevOtp(""); }}>← Back to login</button>
          )}
        </div>
        <small className="hint">Protected admin workspace · SolarPro Energy</small>
      </form>
    </div>
  );
}

function Head({ tag, title, sub, children }) {
  return <div className="head"><div><span>{tag}</span><h1>{title}</h1><p>{sub}</p></div><div className="act">{children}</div></div>;
}

function Dashboard({ dash, go, reload }) {
  const k = dash?.kpis || {}; const pipe = dash?.pipeline || {};
  const stages = [["New","New Lead","blue"],["Survey Booked","Site Survey","cyan"],["Proposal Sent","Proposal","yellow"],["Won","Installation","purple"],["Closed","Completed","green"]];
  const kp = [["Total Leads", k.totalLeads, "blue", "☺", "leads"], ["Active Projects", k.activeProjects, "yellow", "▣", "projects"], ["Installations", k.installations, "green", "⚡", "installations"], ["Revenue", k.revenue, "purple", "₹", "payments", true]];
  return (<>
    <Head tag="OVERVIEW" title="Dashboard" sub="Monitor your solar business from one place."><button className="abtn" onClick={reload}>↻ Refresh</button></Head>
    <div className="kpis">{kp.map(([t, v, tone, ic, to, cur], i) => (
      <div key={t} className={"kpi " + tone} style={{ animationDelay: i * 80 + "ms" }} onClick={() => go(to)}><i>{ic}</i><div><small>{t}</small><b><Count to={v} cur={cur} /></b></div><span>→</span></div>
    ))}</div>
    <div className="grid2">
      <section className="panel"><h3>Sales Pipeline <a onClick={() => go("leads")}>View all leads →</a></h3>
        <div className="pipe">{stages.map(([key, name, tone]) => (
          <div key={key} className={"stage " + tone} onClick={() => go("leads")}><b>{name}<em>{pipe[key] || 0}</em></b>
            {arr(dash?.pipelineRecords?.[key]).map((l) => <div className="lc" key={l._id}><b>{l.name}</b><small>{l.city || l.propertyType || "—"}</small></div>)}
            {!pipe[key] && <div className="empty sm">No records</div>}</div>
        ))}</div></section>
      <section className="panel"><h3>Upcoming <a onClick={() => go("calendar")}>Calendar →</a></h3><Upcoming records={arr(dash?.calendar)} /></section>
    </div>
    <div className="grid3">
      <section className="panel"><h3>Revenue (6 months)</h3><Bars data={arr(dash?.revenueByMonth)} /></section>
      <section className="panel"><h3>Lead Sources</h3><Donut data={arr(dash?.leadSources)} /></section>
      <section className="panel"><h3>Recent Activity</h3><div className="feed">{arr(dash?.activities).slice(0, 6).map((a, i) => <p key={i} style={{ animationDelay: i * 60 + "ms" }}><i />{a.text}<small>{fmtDate(a.at)}</small></p>)}{!arr(dash?.activities).length && <div className="empty sm">Nothing yet</div>}</div></section>
    </div>
    <section className="panel"><h3>Recent Projects <a onClick={() => go("projects")}>Manage →</a></h3>
      <DataTable columns={["Project", "Type", "Location", "Size"]} rows={arr(dash?.recentProjects).map((p) => [<b>{p.title}</b>, p.type, p.location, p.sizeKw ? p.sizeKw + " kW" : "—"])} /></section>
  </>);
}

function Bars({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (!data.length || data.every((d) => !d.value)) return <div className="empty sm">Revenue appears here once payments are marked Paid.</div>;
  return <div className="bars">{data.map((d, i) => <div key={i}><div className="col"><i style={{ height: (d.value / max) * 100 + "%", animationDelay: i * 90 + "ms" }} title={money(d.value)} /></div><small>{d.label}</small></div>)}</div>;
}

function Donut({ data }) {
  const total = data.reduce((a, b) => a + b.count, 0); const C = 251.3; let off = 0;
  const colors = ["#f5b301", "#3b82f6", "#22c55e", "#a855f7", "#ef4444"];
  if (!total) return <div className="empty sm">No leads yet</div>;
  return <div className="donut"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" className="trk" />
    {data.map((d, i) => { const len = (d.count / total) * C; const el = <circle key={i} cx="50" cy="50" r="40" stroke={colors[i % 5]} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} style={{ animationDelay: i * 150 + "ms" }} />; off += len; return el; })}
    <text x="50" y="54" textAnchor="middle">{total}</text></svg>
    <ul>{data.map((d, i) => <li key={i}><i style={{ background: colors[i % 5] }} />{d.name}<b>{d.count}</b></li>)}</ul></div>;
}

function Upcoming({ records }) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const list = records.filter((r) => new Date(r.dueDate) >= now).slice(0, 6);
  if (!list.length) return <div className="empty sm">No upcoming dates. Add a due date to any record.</div>;
  return <div className="feed">{list.map((r) => <p key={r._id}><i />{r.title}<small>{fmtDate(r.dueDate)} · {r.module}</small></p>)}</div>;
}

function CalendarPage({ records }) {
  const [m, setM] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [sel, setSel] = useState(null);
  const first = m.getDay(); const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const on = (d) => records.filter((r) => { const x = new Date(r.dueDate); return x.getFullYear() === m.getFullYear() && x.getMonth() === m.getMonth() && x.getDate() === d; });
  const today = new Date();
  return (<>
    <Head tag="SCHEDULE" title="Calendar" sub="Surveys, installations, payments and tasks by due date." />
    <div className="grid2 cal">
      <section className="panel"><h3><button className="ib" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))}>‹</button>{m.toLocaleString("en-IN", { month: "long", year: "numeric" })}<button className="ib" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))}>›</button></h3>
        <div className="calg">{"SMTWTFS".split("").map((d, i) => <b key={i}>{d}</b>)}{Array.from({ length: first }, (_, i) => <span key={"e" + i} />)}
          {Array.from({ length: days }, (_, i) => { const d = i + 1; const n = on(d).length; const isT = today.getDate() === d && today.getMonth() === m.getMonth() && today.getFullYear() === m.getFullYear();
            return <button key={d} className={(isT ? "today " : "") + (sel === d ? "asel" : "")} onClick={() => setSel(d)}>{d}{n > 0 && <u>{n}</u>}</button>; })}</div></section>
      <section className="panel"><h3>{sel ? `${sel} ${m.toLocaleString("en-IN", { month: "short" })}` : "Pick a day"}</h3>
        <div className="feed">{sel && on(sel).map((r) => <p key={r._id}><i />{r.title}<small>{r.module} · {r.status}</small></p>)}{sel && !on(sel).length && <div className="empty sm">Nothing scheduled</div>}</div></section>
    </div></>);
}

function Reports({ dash }) {
  const k = dash?.kpis || {}; const pipe = Object.entries(dash?.pipeline || {}); const max = Math.max(1, ...pipe.map((p) => p[1]));
  const won = (dash?.pipeline?.Won || 0) + (dash?.pipeline?.Closed || 0); const conv = k.totalLeads ? Math.round((won / k.totalLeads) * 100) : 0;
  return (<>
    <Head tag="ANALYTICS" title="Reports" sub="Performance from your real CRM data."><button className="abtn" onClick={() => window.print()}>🖨 Print / Save PDF</button></Head>
    <div className="kpis">{[["Total Leads", k.totalLeads, "blue", "☺"], ["Won / Closed", won, "green", "✓"], ["Conversion %", conv, "yellow", "%"], ["Revenue", k.revenue, "purple", "₹", true]].map(([t, v, tone, ic, cur]) => <div key={t} className={"kpi " + tone}><i>{ic}</i><div><small>{t}</small><b><Count to={v} cur={cur} /></b></div></div>)}</div>
    <div className="grid3"><section className="panel"><h3>Revenue</h3><Bars data={arr(dash?.revenueByMonth)} /></section><section className="panel"><h3>Lead Sources</h3><Donut data={arr(dash?.leadSources)} /></section>
      <section className="panel"><h3>Pipeline</h3><div className="hbars">{pipe.map(([n, v]) => <div key={n}><span>{n}</span><i><b style={{ width: (v / max) * 100 + "%" }} /></i><strong>{v}</strong></div>)}{!pipe.length && <div className="empty sm">No leads yet</div>}</div></section></div></>);
}

function ModuleFrame({ title, count, children, add, action, extra }) {
  return (<><Head tag="CRM MODULE" title={<>{title} <small>{count ?? ""}</small></>} sub={`Manage ${title.toLowerCase()} and keep operations moving.`}>
    {extra}{action && <button className="abtn" onClick={action}>↻ Refresh</button>}{add && <button className="abtn pri" onClick={add}>＋ Add {title.replace(/s$/, "")}</button>}</Head>
    <section className="panel tp">{children}</section></>);
}

/* ---- bulk selection helpers ---- */
function useSel(keys) {
  const [sel, setSel] = useState([]);
  const sig = keys.join("|");
  useEffect(() => { setSel((s) => s.filter((k) => keys.includes(k))); }, [sig]); // eslint-disable-line
  const toggle = (k) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const all = keys.length > 0 && sel.length === keys.length;
  return { sel, keys, all, toggle, toggleAll: () => setSel(all ? [] : keys), selectAll: () => setSel(keys), clear: () => setSel([]) };
}

function BulkBar({ picker, onDelete, label = "Delete selected", busy, extra }) {
  if (!picker.sel.length) return null;
  return (
    <div className="bulk">
      <b>✓ {picker.sel.length} selected</b>
      {picker.sel.length < picker.keys.length && <button className="abtn" onClick={picker.selectAll}>Select all {picker.keys.length}</button>}
      <button className="abtn" onClick={picker.clear}>Clear</button>
      <span className="grow" />
      {extra}
      <button className="delete-btn big" disabled={busy} onClick={onDelete}>🗑 {busy ? "Working…" : label}</button>
    </div>
  );
}

function DataTable({ columns, rows, ids, picker }) {
  if (!rows.length) return <div className="empty">No records found.</div>;
  const pick = ids && picker;
  return <div className="ts"><table><thead><tr>
    {pick && <th className="cb"><input type="checkbox" checked={picker.all} onChange={picker.toggleAll} aria-label="Select all" /></th>}
    {columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => (
      <tr key={i} className={pick && picker.sel.includes(ids[i]) ? "picked" : ""} style={{ animationDelay: Math.min(i, 12) * 30 + "ms" }}>
        {pick && <td className="cb"><input type="checkbox" checked={picker.sel.includes(ids[i])} onChange={() => picker.toggle(ids[i])} aria-label="Select row" /></td>}
        {r.map((c, j) => <td key={j}>{c}</td>)}</tr>))}</tbody></table></div>;
}

function StatusSelect({ value, options, onChange }) {
  return <select className={"pill " + cls(value)} value={value} onChange={(e) => onChange(e.target.value)}>{[...new Set([value, ...options])].map((o) => <option key={o}>{o}</option>)}</select>;
}

function Leads({ search, notify, reload, tick, onAdd }) {
  const [rows, setRows] = useState(null); const [st, setSt] = useState(""); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try { const q = new URLSearchParams({ limit: 500 }); if (st) q.set("status", st); if (search) q.set("search", search); setRows((await api.get("/admin/leads?" + q)).items); }
    catch (e) { setRows([]); notify(e.message, "err"); }
  }, [st, search, tick, notify]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  const picker = useSel(arr(rows).map((l) => l._id));
  const setStatus = async (l, status) => { try { await api.patch("/admin/leads/" + l._id, { status }); notify("Status updated"); load(); reload(); } catch (e) { notify(e.message, "err"); } };
  const del = async (l) => { if (!window.confirm("Move this lead to Recycle Bin?")) return; try { await api.del("/admin/leads/" + l._id); notify("Moved to Recycle Bin"); load(); reload(); } catch (e) { notify(e.message, "err"); } };
  const bulkDel = async () => {
    if (!window.confirm(`Move ${picker.sel.length} lead(s) to Recycle Bin?`)) return;
    setBusy(true);
    try { const r = await api.post("/admin/bulk/leads", { ids: picker.sel }); notify(`${r.count} lead(s) moved to Recycle Bin`); picker.clear(); load(); reload(); }
    catch (e) { notify(e.message, "err"); } finally { setBusy(false); }
  };
  return (<ModuleFrame title="Leads" count={rows?.length} add={onAdd} action={load}>
    <div className="achips">{["", ...LEAD_ST].map((s) => <button key={s} className={st === s ? "on" : ""} onClick={() => setSt(s)}>{s || "All"}</button>)}</div>
    {rows === null ? <div className="empty">Loading…</div> : <DataTable ids={rows.map((l) => l._id)} picker={picker} columns={["Name", "Contact", "City", "Source", "Status", "Created", "Actions"]} rows={rows.map((l) => [
      <b>{l.name}</b>, <span>{l.phone}<small className="sub">{l.email || ""}</small></span>, l.city || "—", l.source,
      <StatusSelect value={l.status} options={LEAD_ST} onChange={(v) => setStatus(l, v)} />, fmtDate(l.createdAt),
      <div className="table-actions"><a className="edit-btn" href={"tel:+91" + l.phone}>Call</a><a className="edit-btn" target="_blank" rel="noreferrer" href={"https://wa.me/91" + l.phone}>WhatsApp</a><button className="delete-btn" onClick={() => del(l)}>Delete</button></div>])} />}
    <BulkBar picker={picker} busy={busy} onDelete={bulkDel} />
  </ModuleFrame>);
}

function Module({ module, search, notify, reload, tick, onAdd }) {
  const [rows, setRows] = useState(null); const [busy, setBusy] = useState(false);
  const title = NAV.find((n) => n[0] === module)?.[1] || module;
  const load = useCallback(async () => {
    try { setRows(arr(await api.get(`/admin/crm/${module}` + (search ? "?search=" + encodeURIComponent(search) : "")))); }
    catch (e) { setRows([]); notify(e.message, "err"); }
  }, [module, search, tick, notify]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  const picker = useSel(arr(rows).map((r) => r._id));
  const setStatus = async (r, status) => { try { await api.patch("/admin/crm/record/" + r._id, { status }); notify("Status updated"); load(); reload(); } catch (e) { notify(e.message, "err"); } };
  const del = async (r) => { if (!window.confirm("Move this record to Recycle Bin?")) return; try { await api.del("/admin/crm/record/" + r._id); notify("Moved to Recycle Bin"); load(); reload(); } catch (e) { notify(e.message, "err"); } };
  const bulkDel = async () => {
    if (!window.confirm(`Move ${picker.sel.length} record(s) to Recycle Bin?`)) return;
    setBusy(true);
    try { const r = await api.post("/admin/bulk/crm", { ids: picker.sel }); notify(`${r.count} record(s) moved to Recycle Bin`); picker.clear(); load(); reload(); }
    catch (e) { notify(e.message, "err"); } finally { setBusy(false); }
  };
  return (<ModuleFrame title={title} count={rows?.length} add={onAdd} action={load}>
    {rows === null ? <div className="empty">Loading…</div> : <DataTable ids={rows.map((r) => r._id)} picker={picker} columns={["Title", "Customer", "Location", "Status", "Amount", "Owner", "Due", ""]} rows={rows.map((r) => [
      <b>{r.title}</b>, r.customer || "—", r.location || "—", <StatusSelect value={r.status || "New"} options={CRM_ST} onChange={(v) => setStatus(r, v)} />,
      r.amount ? money(r.amount) : "—", r.owner || "—", fmtDate(r.dueDate), <button className="delete-btn" onClick={() => del(r)}>Delete</button>])} />}
    <BulkBar picker={picker} busy={busy} onDelete={bulkDel} />
  </ModuleFrame>);
}

function Modal({ tag, title, onClose, onSubmit, busy, children, label }) {
  return <div className="mback" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><form className="modal" onSubmit={onSubmit}>
    <div className="mhead"><div><span>{tag}</span><h2>{title}</h2></div><button type="button" onClick={onClose}>×</button></div>
    <div className="fgrid">{children}</div><div className="mact"><button type="button" className="abtn" onClick={onClose}>Cancel</button><button className="abtn pri" disabled={busy}>{busy ? "Saving…" : label}</button></div></form></div>;
}

function LeadModal({ onClose, onSaved, notify }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", city: "", source: "website", status: "New", propertyType: "Home", message: "" }); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) { e.preventDefault(); setBusy(true); try { await api.post("/admin/leads", f); onSaved(); } catch (x) { notify(x.message, "err"); } finally { setBusy(false); } }
  return <Modal tag="NEW LEAD" title="Create New Lead" onClose={onClose} onSubmit={submit} busy={busy} label="Create Lead">
    <label>Name<input value={f.name} onChange={set("name")} required /></label><label>Phone (10 digits)<input value={f.phone} onChange={set("phone")} pattern="[6-9][0-9]{9}" required /></label>
    <label>Email<input type="email" value={f.email} onChange={set("email")} /></label><label>City<input value={f.city} onChange={set("city")} /></label>
    <label>Source<select value={f.source} onChange={set("source")}>{["website", "contact", "quote", "enquiry", "other"].map((o) => <option key={o}>{o}</option>)}</select></label>
    <label>Status<select value={f.status} onChange={set("status")}>{LEAD_ST.map((o) => <option key={o}>{o}</option>)}</select></label>
    <label>Property<select value={f.propertyType} onChange={set("propertyType")}>{["Home", "Commercial", "Industry", "Farmhouse", "Business", "Farm land"].map((o) => <option key={o}>{o}</option>)}</select></label>
    <label className="full">Requirement<textarea rows="3" value={f.message} onChange={set("message")} /></label></Modal>;
}

function RecordModal({ module, title, onClose, onSaved, notify }) {
  const [f, setF] = useState({ title: "", status: "New", customer: "", location: "", amount: "", sizeKw: "", owner: "", dueDate: "" }); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) { e.preventDefault(); setBusy(true); try { await api.post("/admin/crm/" + module, { ...f, amount: Number(f.amount || 0), sizeKw: Number(f.sizeKw || 0) }); onSaved(); } catch (x) { notify(x.message, "err"); } finally { setBusy(false); } }
  return <Modal tag="NEW RECORD" title={"Add " + title} onClose={onClose} onSubmit={submit} busy={busy} label="Save">
    <label className="full">Title<input value={f.title} onChange={set("title")} required /></label><label>Customer<input value={f.customer} onChange={set("customer")} /></label><label>Location<input value={f.location} onChange={set("location")} /></label>
    <label>Status<select value={f.status} onChange={set("status")}>{CRM_ST.map((o) => <option key={o}>{o}</option>)}</select></label><label>Owner<input value={f.owner} onChange={set("owner")} /></label>
    <label>Amount (₹)<input type="number" min="0" value={f.amount} onChange={set("amount")} /></label><label>System kW<input type="number" min="0" step="any" value={f.sizeKw} onChange={set("sizeKw")} /></label>
    <label>Due date<input type="date" value={f.dueDate} onChange={set("dueDate")} /></label></Modal>;
}

function Projects({ search, tick, notify, reload, onAdd, onEdit, onDelete }) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  useEffect(() => { setLoading(true); api.get("/admin/projects").then((d) => setItems(arr(d))).catch((e) => notify(e.message, "err")).finally(() => setLoading(false)); }, [tick, notify]);
  const shown = useMemo(() => items.filter((x) => JSON.stringify(x).toLowerCase().includes(search.toLowerCase())), [items, search]);
  const picker = useSel(shown.map((x) => x._id));
  const bulkDel = async () => {
    if (!window.confirm(`Move ${picker.sel.length} project(s) to Recycle Bin?`)) return;
    setBusy(true);
    try { const r = await api.post("/admin/bulk/projects", { ids: picker.sel }); notify(`${r.count} project(s) moved to Recycle Bin`); picker.clear(); reload(); }
    catch (e) { notify(e.message, "err"); } finally { setBusy(false); }
  };
  return <ProjectsView items={shown} loading={loading} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} picker={picker} busy={busy} onBulkDelete={bulkDel} />;
}

function Switch({ on, onChange }) { return <button type="button" className={"sw" + (on ? " on" : "")} onClick={() => onChange(!on)}><i /></button>; }

function Settings({ me, setMe, theme, setTheme, notify }) {
  const [tab, setTab] = useState("company"); const [s, setS] = useState(null); const [db, setDb] = useState(null);
  const [prof, setProf] = useState({ name: me.name || "", email: me.email || "", phone: me.phone || "" }); const [pw, setPw] = useState({ current: "", next: "", again: "" });
  useEffect(() => { api.get("/admin/settings").then(setS).catch((e) => notify(e.message, "err")); api.get("/health").then(setDb).catch(() => setDb({ database: "unreachable" })); }, [notify]);
  useEffect(() => setProf({ name: me.name || "", email: me.email || "", phone: me.phone || "" }), [me]);
  const save = async (patch, msg = "Settings saved") => { try { setS(await api.patch("/admin/settings", patch)); notify(msg); } catch (e) { notify(e.message, "err"); } };
  const saveProfile = async (e) => { e.preventDefault(); try { const r = await api.patch("/admin/profile", prof); if (r.token) localStorage.setItem(TK, r.token); setMe(r.admin); notify("Profile updated"); } catch (x) { notify(x.message, "err"); } };
  const changePw = async (e) => { e.preventDefault(); if (pw.next !== pw.again) return notify("New passwords do not match", "err"); try { await api.post("/admin/change-password", { current: pw.current, next: pw.next }); setPw({ current: "", next: "", again: "" }); notify("Password changed"); } catch (x) { notify(x.message, "err"); } };
  const exportCsv = async () => { try { const d = (await api.get("/admin/leads?limit=100")).items; const h = ["name", "phone", "email", "city", "source", "status", "createdAt"]; const csv = [h.join(","), ...d.map((l) => h.map((k) => `"${String(l[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "solarpro-leads.csv"; a.click(); notify("CSV downloaded"); } catch (e) { notify(e.message, "err"); } };
  const tabs = [["company", "🏢 Company"], ["profile", "👤 Profile"], ["security", "🔒 Security"], ["notifications", "🔔 Notifications"], ["appearance", "🎨 Appearance"], ["data", "🗄 Data"]];
  const co = s?.company || {}; const [cf, setCf] = useState(null); useEffect(() => { if (s) setCf(s.company); }, [s]);
  return (<><Head tag="ADMINISTRATION" title="Settings" sub="Configure your SolarPro CRM workspace." />
    <div className="sgrid"><div className="stabs">{tabs.map(([id, l]) => <button key={id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>{l}</button>)}</div>
      <section className="panel sbody" key={tab}>
        {tab === "company" && cf && <form onSubmit={(e) => { e.preventDefault(); save({ company: cf }); }}><h3>Company Profile</h3><div className="fgrid">{[["name", "Company name"], ["phone", "Phone"], ["email", "Email"], ["website", "Website"], ["gst", "GST number"], ["address", "Address"]].map(([k, l]) => <label key={k} className={k === "address" ? "full" : ""}>{l}<input value={cf[k] || ""} onChange={(e) => setCf({ ...cf, [k]: e.target.value })} /></label>)}</div><button className="abtn pri">Save Company</button></form>}
        {tab === "profile" && <form onSubmit={saveProfile}><h3>Admin Profile</h3><div className="fgrid"><label>Name<input value={prof.name} onChange={(e) => setProf({ ...prof, name: e.target.value })} required /></label><label>Email (login)<input type="email" value={prof.email} onChange={(e) => setProf({ ...prof, email: e.target.value })} required /></label><label>Phone (login)<input type="tel" value={prof.phone || ""} onChange={(e) => setProf({ ...prof, phone: e.target.value })} placeholder="10-digit mobile" maxLength={10} /></label></div><button className="abtn pri">Update Profile</button></form>}
        {tab === "security" && <form onSubmit={changePw}><h3>Change Password</h3><div className="fgrid">{[["current", "Current password"], ["next", "New password (min 6)"], ["again", "Confirm new password"]].map(([k, l]) => <label key={k} className={k === "current" ? "full" : ""}>{l}<input type="password" value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} required /></label>)}</div><button className="abtn pri">Change Password</button></form>}
        {tab === "notifications" && s && <div><h3>Notifications</h3>{[["newLead", "New lead alerts", "Notify when a website enquiry arrives"], ["payment", "Payment alerts", "Notify when a payment is marked Paid"], ["weekly", "Weekly summary", "A weekly business report"], ["email", "Email notifications", "Send alerts to your admin email"]].map(([k, t, d]) => <div className="srow" key={k}><div><b>{t}</b><small>{d}</small></div><Switch on={s.notifications[k]} onChange={(v) => save({ notifications: { [k]: v } }, "Preference saved")} /></div>)}</div>}
        {tab === "appearance" && <div><h3>Theme</h3><div className="themes">{["dark", "light"].map((t) => <button key={t} className={"th " + t + (theme === t ? " on" : "")} onClick={() => { setTheme(t); notify(t + " theme applied"); }}><i /><b>{t === "dark" ? "Dark" : "Light"}</b></button>)}</div></div>}
        {tab === "data" && <div><h3>Data & Backup</h3><div className="srow"><div><b>Database</b><small>MongoDB connection</small></div><span className={"pill " + (db?.database === "connected" ? "won" : "lost")}>{db?.database || "checking…"}</span></div><div className="srow"><div><b>Export leads</b><small>Download all leads as a CSV file</small></div><button className="abtn" onClick={exportCsv}>⬇ Export CSV</button></div></div>}
      </section></div></>);
}

function ProjectsView({ items, loading, onAdd, onEdit, onDelete, picker, busy, onBulkDelete }) {
  return <ModuleFrame title="Projects" count={items.length} add={onAdd}>
    {loading ? <div className="empty">Loading projects...</div> : <DataTable ids={items.map((x) => x._id)} picker={picker} columns={["Project","Type","Location","Size","Featured","Actions"]} rows={items.map(item => [
      <><b>{item.title || "Untitled"}</b><small style={{display:"block",color:"#8b96a8"}}>{item.description || "Solar project"}</small></>,
      item.type || "—", item.location || "—", item.sizeKw ? `${item.sizeKw} kW` : "—",
      item.featured ? <span className="status completed">Featured</span> : <span className="status">Standard</span>,
      <div className="table-actions"><button className="edit-btn" onClick={() => onEdit(item)}>Edit</button><button className="delete-btn" onClick={() => onDelete(item._id)}>Delete</button></div>
    ])}/>}
    {picker && <BulkBar picker={picker} busy={busy} onDelete={onBulkDelete} />}
  </ModuleFrame>;
}

function ProjectModal({ project, onClose, onSaved }) {
  const [form, setForm] = useState({ title: project?.title || "", type: project?.type || "Home", location: project?.location || "", sizeKw: project?.sizeKw || "", image: project?.image || "", imageUrl: project?.image || project?.images?.[0] || "", description: project?.description || "", savingsPerYear: project?.savingsPerYear || "", description: project?.description || "", featured: !!project?.featured });
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function submit(e) { e.preventDefault(); setBusy(true); setError(""); const url=form.imageUrl.trim(); if(!/^https?:\/\//i.test(url)){setError("Please paste one valid image link starting with http:// or https://");setBusy(false);return;} const images=[url]; try { const body={...form,sizeKw:Number(form.sizeKw||0),savingsPerYear:Number(form.savingsPerYear||0),images,image:images[0]}; if(project) await api.patch(`/admin/projects/${project._id}`,body); else await api.post("/admin/projects",body); await onSaved(); } catch(e){setError(e.message||"Unable to save project");} finally{setBusy(false);} }
  return <div className="modal-backdrop"><form className="record-modal" onSubmit={submit}><div className="modal-head"><div><span>{project?"EDIT PROJECT":"NEW PROJECT"}</span><h2>{project?"Edit Project":"Add Project"}</h2></div><button type="button" onClick={onClose}>×</button></div>{error&&<div className="admin-error">{error}</div>}<div className="form-grid">
    {[["title","Project Name"],["location","Location"],["sizeKw","System Size (kW)"],["savingsPerYear","Yearly Savings"]].map(([k,l])=><label key={k}>{l}<input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} required={k!=="savingsPerYear"}/></label>)}
    <label>Type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Home</option><option>Commercial</option><option>Industrial</option><option>Farm</option></select></label>
    <label>Featured<select value={form.featured?"yes":"no"} onChange={e=>setForm({...form,featured:e.target.value==="yes"})}><option value="yes">Yes</option><option value="no">No</option></select></label>
    <label style={{gridColumn:"1/-1"}}>Image link (1 photo)<input type="url" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://example.com/photo.jpg" required/></label>
    <label style={{gridColumn:"1/-1"}}>Description<textarea rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
  </div><div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary" disabled={busy}>{busy?"Saving...":project?"Update Project":"Create Project"}</button></div></form></div>;
}

function RecycleBinView({ onRefresh, notify }) {
  const [data, setData] = useState({ projects: [], leads: [], crm: [] }); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { setData(await api.get("/admin/recycle-bin")); setError(""); } catch (e) { setError(e.message || "Unable to load recycle bin"); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const rows = [
    ...arr(data.projects).map((x) => ({ type: "project", label: "Project", title: x.title, location: x.location, deletedAt: x.deletedAt, id: x._id })),
    ...arr(data.leads).map((x) => ({ type: "lead", label: "Lead", title: x.name, location: x.city, deletedAt: x.deletedAt, id: x._id })),
    ...arr(data.crm).map((x) => ({ type: "crm", label: x.module, title: x.title, location: x.location, deletedAt: x.deletedAt, id: x._id })),
  ].map((x) => ({ ...x, key: x.type + ":" + x.id }));
  const picker = useSel(rows.map((x) => x.key));
  const done = async (msg) => { notify(msg); picker.clear(); await load(); await onRefresh(); };
  async function restore(type, id) { try { await api.patch(`/admin/recycle-bin/${type}/${id}/restore`, {}); await done("Restored"); } catch (e) { setError(e.message); } }
  async function permanent(type, id) { if (!window.confirm("Permanently delete this item? This cannot be undone.")) return; try { await api.del(`/admin/recycle-bin/${type}/${id}`); await done("Deleted forever"); } catch (e) { setError(e.message); } }
  async function bulk(action, all) {
    const items = picker.sel.map((k) => { const [type, ...rest] = k.split(":"); return { type, id: rest.join(":") }; });
    const n = all ? rows.length : items.length;
    if (action === "delete" && !window.confirm(`Permanently delete ${all ? "ALL " + n : n} item(s)? This cannot be undone.`)) return;
    if (action === "restore" && all && !window.confirm(`Restore all ${n} item(s)?`)) return;
    setBusy(true);
    try { const r = await api.post("/admin/bulk/recycle", all ? { action, all: true } : { action, items }); await done(`${r.count} item(s) ${action === "delete" ? "deleted forever" : "restored"}`); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  const head = rows.length ? <><button className="abtn" disabled={busy} onClick={() => bulk("restore", true)}>↩ Restore all</button><button className="abtn danger" disabled={busy} onClick={() => bulk("delete", true)}>🗑 Empty Recycle Bin</button></> : null;
  return <ModuleFrame title="Recycle Bin" count={rows.length} action={load} extra={head}>
    <div className="recycle-note">Deleted items stay here until restored or permanently deleted.</div>
    {error && <div className="admin-error">{error}</div>}
    {loading ? <div className="empty">Loading recycle bin...</div> : <DataTable ids={rows.map((x) => x.key)} picker={picker} columns={["Type", "Name", "Location", "Deleted", "Actions"]} rows={rows.map((x) => [
      x.label, <b>{x.title || "Untitled"}</b>, x.location || "—", fmtDate(x.deletedAt),
      <div className="table-actions"><button className="edit-btn" onClick={() => restore(x.type, x.id)}>Restore</button><button className="delete-btn" onClick={() => permanent(x.type, x.id)}>Delete Forever</button></div>])} />}
    <BulkBar picker={picker} busy={busy} label="Delete forever" onDelete={() => bulk("delete")} extra={<button className="abtn" disabled={busy} onClick={() => bulk("restore")}>↩ Restore selected</button>} />
  </ModuleFrame>;
}