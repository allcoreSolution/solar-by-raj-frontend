import { site } from "../data/site";
export default function TopBar() {
  return <div className="topbar"><div className="wrap"><span>Clean Energy • Better Tomorrow</span><a href={site.phoneHref}>📞 Call: {site.phone}</a><a href={site.emailHref}>✉️ Email: {site.email}</a></div></div>;
}
