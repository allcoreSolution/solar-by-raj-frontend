import { Link } from "react-router-dom";
export default function NotFound() {
  return <section><div className="wrap" style={{ textAlign: "center" }}><h1 style={{ fontSize: 64 }}>404</h1><p className="lead" style={{ margin: "12px auto 24px" }}>This page does not exist. Let's get you back home.</p><Link className="btn sun" to="/">Go to home</Link></div></section>;
}
