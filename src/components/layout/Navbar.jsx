import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX, FiArrowUpRight } from "react-icons/fi";
import Container from "../common/Container";
import { useTheme } from "../../contexts/ThemeContext";
import { useObject } from "../../hooks/useCollection";
import { profileService } from "../../services/contentService";
const links = [
  ["/projects", "Work"],
  ["/about", "About"],
  ["/expertise", "Skills"],
  ["/services", "Services"],
  ["/journey", "Journey"],
  ["/certifications", "Certifications"],
];
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: profile } = useObject(profileService);
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    const escape = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/95 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-2 sm:gap-6">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex min-w-0 items-center gap-2 sm:gap-3"
          aria-label={`${profile?.name || "Mehmood Khan"}, home`}
        >
          <span className="brand-mark shrink-0" aria-hidden="true">
            mk<span className="sr-only">.</span>
          </span>
          <span className="font-display font-medium text-sm sm:text-base truncate">
            {profile?.name || "Mehmood Khan"}
            <span className="text-accent">.</span>
          </span>
        </Link>
        <nav className="hidden xl:flex items-center gap-5" aria-label="Primary">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className="nav-link">
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="icon-button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="hidden sm:inline-flex btn btn-secondary !min-h-11 !py-2"
          >
            Let's talk <FiArrowUpRight />
          </Link>
          <button
            ref={toggle}
            onClick={() => setOpen(!open)}
            className="icon-button xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </Container>
      {open && (
        <nav
          id="mobile-navigation"
          className="xl:hidden border-t border-line bg-base max-h-[calc(100dvh-80px)] overflow-y-auto"
          aria-label="Mobile"
        >
          <Container className="mobile-menu grid grid-cols-2 gap-2 py-4">
            {[["/", "Home"], ...links, ["/contact", "Contact"]].map(
              ([to, label]) => (
                <NavLink key={to} to={to} end={to === "/"} className="nav-link" onClick={() => setOpen(false)}>
                  {label}
                </NavLink>
              ),
            )}
          </Container>
        </nav>
      )}
    </header>
  );
}
