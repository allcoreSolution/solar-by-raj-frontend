import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import WhySolar from "./pages/WhySolar";
import TopBar from "./components/TopBar";
import WhatsAppButton from "./components/WhatsAppButton";
import NotFound from "./pages/NotFound";
import Enquiry from "./pages/Enquiry";
import { Privacy, Terms, Help } from "./pages/Legal";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 80);
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      {pathname !== "/admin" && <TopBar />}
      {pathname !== "/admin" && <Navbar />}
      <main key={pathname} className={pathname === "/admin" ? "" : "page"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/why-solar" element={<WhySolar />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/help" element={<Help />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {pathname !== "/admin" && <Footer />}
      {pathname !== "/admin" && <BackToTop />}
      {pathname !== "/admin" && <WhatsAppButton />}
    </>
  );
}