import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
export default function PublicLayout() {
  const location = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!first.current)
      document.getElementById("main-content")?.focus({ preventScroll: true });
    first.current = false;
  }, [location.pathname, location.hash]);
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
