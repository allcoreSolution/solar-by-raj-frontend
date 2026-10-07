import { createContext, useCallback, useContext, useRef, useState } from "react";

// Pop-up notifications (toasts). Use: const toast = useToast(); toast({ type: "success", title: "Done" })
const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const next = useRef(0);

  const remove = useCallback((id) => {
    setItems((a) => a.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setItems((a) => a.filter((t) => t.id !== id)), 300);
  }, []);

  const toast = useCallback(({ type = "info", title, text, action, ms = 6000 }) => {
    const id = ++next.current;
    setItems((a) => [...a.slice(-3), { id, type, title, text, action, ms }]);
    setTimeout(() => remove(id), ms);
  }, [remove]);

  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="toasts" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast ${t.type} ${t.leaving ? "out" : ""}`} role={t.type === "error" ? "alert" : "status"} style={{ "--ms": `${t.ms}ms` }}>
            <span className="t-ic">{t.type === "success" ? "✓" : t.type === "error" ? "!" : "i"}</span>
            <div className="t-tx">
              <b>{t.title}</b>
              {t.text && <p>{t.text}</p>}
              {t.action && <a href={t.action.href} target="_blank" rel="noreferrer">{t.action.label} →</a>}
            </div>
            <button aria-label="Close notification" onClick={() => remove(t.id)}>×</button>
            <i className="t-bar" />
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}